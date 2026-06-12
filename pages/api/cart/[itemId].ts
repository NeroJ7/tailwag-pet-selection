// @ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
const { Pool } = require('pg');

// 数据库连接池
const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  ssl: { rejectUnauthorized: false },
});

async function query(sql: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

// 简易速率限制（内存存储）
const rateLimitStore = new Map<string, number[]>();
const RATE_WINDOW = 60 * 1000; // 1分钟
const RATE_MAX = 60; // 最多60次/分钟

function checkRateLimit(req: NextApiRequest): boolean {
  const identifier = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;
  const requests = rateLimitStore.get(identifier) || [];
  const recentRequests = requests.filter(t => t > windowStart);
  if (recentRequests.length >= RATE_MAX) {
    return false; // 被限速
  }
  recentRequests.push(now);
  rateLimitStore.set(identifier, recentRequests);
  return true;
}

// 获取当前用户
async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return null;
  const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [session.user.email]);
  return result.rows[0] || null;
}

// 获取用户的购物车
async function getUserCart(userId: string) {
  let result = await query('SELECT * FROM carts WHERE user_id = $1 LIMIT 1', [userId]);
  if (result.rows.length === 0) {
    const crypto = require('crypto');
    result = await query(
      'INSERT INTO carts (id, user_id, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [crypto.randomUUID(), userId]
    );
  }
  return result.rows[0];
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 速率限制
  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: '请求过于频繁，请1分钟后再试' });
  }

  try {
    const user = await getCurrentUser(req, res);
    if (!user) {
      return res.status(401).json({ error: '请先登录' });
    }

    const cart = await getUserCart(user.id);

    // 获取 itemId
    const { itemId } = req.query;
    if (!itemId || typeof itemId !== 'string') {
      return res.status(400).json({ error: '缺少商品项ID' });
    }

    // 验证 cartItem 属于当前用户
    const itemResult = await query(
      `SELECT ci.*, p.name, p.price, p.images 
         FROM cart_items ci
         LEFT JOIN products p ON ci.product_id = p.id
         WHERE ci.id = $1 AND ci.cart_id = $2 LIMIT 1`,
      [itemId, cart.id]
    );
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: '购物车商品不存在' });
    }

    // PUT: 更新数量
    if (req.method === 'PUT') {
      const { quantity } = req.body;
      const safeQty = Math.min(Math.max(Math.floor(Number(quantity)) || 1, 1), 99);
      if (safeQty < 1) {
        return res.status(400).json({ error: '数量必须大于0' });
      }
      const result = await query(
        'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [safeQty, itemId]
      );
      return res.status(200).json({ message: '已更新商品数量', item: result.rows[0] });
    }

    // DELETE: 删除商品
    if (req.method === 'DELETE') {
      await query('DELETE FROM cart_items WHERE id = $1', [itemId]);
      return res.status(200).json({ message: '已从购物车删除商品' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error: any) {
    console.error('Cart Item API error:', error);
    return res.status(500).json({ error: error.message || '服务器内部错误' });
  }
}

export default handler;

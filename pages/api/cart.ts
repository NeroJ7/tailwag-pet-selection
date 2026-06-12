// @ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
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
  return true; // 通过
}

// 获取当前用户
async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return null;
  const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [session.user.email]);
  return result.rows[0] || null;
}

// 获取或创建购物车
async function getOrCreateCart(userId: string) {
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
      return res.status(401).json({ error: '请先登录', step: 1 });
    }

    const cart = await getOrCreateCart(user.id);

    // POST: 添加/更新购物车商品
    if (req.method === 'POST') {
      const { product_id, quantity = 1 } = req.body;
      if (!product_id) {
        return res.status(400).json({ error: '缺少产品ID', step: 2 });
      }
      // 数量校验：必须是正整数且不超过99
      const safeQty = Math.min(Math.max(Math.floor(Number(quantity)) || 1, 1), 99);

      // 检查商品是否存在
      const productResult = await query('SELECT * FROM products WHERE id = $1 AND is_active = true', [product_id]);
      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: '产品不存在', step: 3 });
      }

      // 检查是否已存在
      const existingResult = await query(
        'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
        [cart.id, product_id]
      );

      if (existingResult.rows.length > 0) {
        // 更新数量
        const newQty = Math.min(existingResult.rows[0].quantity + safeQty, 99);
        const result = await query(
          'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
          [newQty, existingResult.rows[0].id]
        );
        return res.status(200).json({ message: '已更新购物车数量', item: result.rows[0] });
      } else {
        // 新增
        const crypto = require('crypto');
        const result = await query(
          'INSERT INTO cart_items (id, cart_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
          [crypto.randomUUID(), cart.id, product_id, safeQty]
        );
        return res.status(201).json({ message: '已加入购物车', item: result.rows[0] });
      }
    }

    // GET: 获取购物车商品列表
    const itemsResult = await query(
      `SELECT 
          ci.*, 
          p.name, p.price, p.images, p.brand
         FROM cart_items ci
         LEFT JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = $1`,
      [cart.id]
    );
    const total = itemsResult.rows.reduce((sum: number, item: any) => {
      const price = Number(item.price) || 0;
      return sum + price * item.quantity;
    }, 0);
    return res.status(200).json({ cartItems: itemsResult.rows, total: total.toFixed(2) });

  } catch (error: any) {
    console.error('Cart API error:', error);
    return res.status(500).json({ error: error.message || '服务器内部错误', step: 'catch' });
  }
}

export default handler;

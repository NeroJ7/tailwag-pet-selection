import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { query } from "../../../lib/db";
import { withRateLimit } from "../../../lib/rate-limit";

// 获取当前登录用户
async function getSessionUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return null;
  }

  const result = await query(
    'SELECT id FROM "users" WHERE email = $1 LIMIT 1',
    [session.user.email]
  );

  return result.rows[0]?.id || null;
}

// 生成订单号
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TW${timestamp}${random}`;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getSessionUser(req, res);

  if (!userId) {
    return res.status(401).json({ error: "未登录" });
  }

  // GET: 获取订单列表
  if (req.method === "GET") {
    try {
      const result = await query(
        `SELECT 
          o.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'quantity', oi.quantity,
                'price', oi.price,
                'product_name', p.name,
                'product_image', p.images[1]
              )
            ) FILTER (WHERE oi.id IS NOT NULL),
            '[]'::json
          ) as items
        FROM "orders" o
        LEFT JOIN "order_items" oi ON o.id = oi.order_id
        LEFT JOIN "products" p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        [userId]
      );

      return res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("获取订单列表失败:", err);
      return res.status(500).json({ error: "获取订单列表失败" });
    }
  }

  // POST: 创建订单
  if (req.method === "POST") {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "订单商品不能为空" });
    }

    try {
      // 优化：一次性查询所有商品（修复 N+1 问题）
      const productIds = items.map((item: any) => item.productId);
      const placeholders = productIds.map((_: any, idx: number) => `$${idx + 1}`).join(',');
      const productResult = await query(
        `SELECT id, name, price FROM "products" WHERE id IN (${placeholders}) AND is_active = true`,
        productIds
      );

      if (productResult.rows.length !== items.length) {
        return res.status(400).json({ error: '部分商品不存在或已下架' });
      }

      // 将商品信息映射到 item 中
      const productMap = new Map(productResult.rows.map((p: any) => [p.id, p]));
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = productMap.get(item.productId) as any;
        if (!product) {
          return res.status(400).json({ error: `商品不存在: ${item.productId}` });
        }

        const quantity = item.quantity || 1;
        const itemPrice = parseFloat((product as any).price) * quantity;
        totalAmount += itemPrice;

        orderItems.push({
          productId: product.id,
          quantity: quantity,
          price: (product as any).price,
        });
      }

      // 生成订单号
      const orderNumber = generateOrderNumber();
      const crypto = require('crypto');
      const orderId = crypto.randomUUID();

      // 创建订单
      await query(
        `INSERT INTO "orders" (
          id, user_id, order_number, status, total_amount, 
          shipping_address, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          orderId,
          userId,
          orderNumber,
          'pending',
          totalAmount.toFixed(2),
          JSON.stringify(shippingAddress || {}),
        ]
      );

      // 创建订单项
      for (const item of orderItems) {
        const itemId = crypto.randomUUID();
        await query(
          `INSERT INTO "order_items" (
            id, order_id, product_id, quantity, price, created_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())`,
          [itemId, orderId, item.productId, item.quantity, item.price]
        );
      }

      // 返回创建成功的订单
      const orderResult = await query(
        `SELECT * FROM "orders" WHERE id = $1`,
        [orderId]
      );

      return res.status(201).json({
        success: true,
        order: orderResult.rows[0],
      });
    } catch (err: any) {
      console.error("创建订单失败:", err);
      return res.status(500).json({ error: "创建订单失败" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRateLimit(handler, 'createOrder');

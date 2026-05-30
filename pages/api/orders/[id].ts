import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { query } from "../../../lib/db";

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getSessionUser(req, res);

  if (!userId) {
    return res.status(401).json({ error: "未登录" });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: "订单ID不能为空" });
  }

  // GET: 获取订单详情
  if (req.method === "GET") {
    try {
      const orderResult = await query(
        `SELECT * FROM "orders" WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: "订单不存在" });
      }

      const order = orderResult.rows[0];

      // 获取订单项
      const itemsResult = await query(
        `SELECT 
          oi.*,
          p.name as product_name,
          p.images as product_images,
          p.brand as product_brand
        FROM "order_items" oi
        JOIN "products" p ON oi.product_id = p.id
        WHERE oi.order_id = $1`,
        [id]
      );

      return res.status(200).json({
        ...order,
        items: itemsResult.rows,
      });
    } catch (err: any) {
      console.error("获取订单详情失败:", err);
      return res.status(500).json({ error: "获取订单详情失败" });
    }
  }

  // PUT: 取消订单
  if (req.method === "PUT") {
    const { status } = req.body;

    if (status !== 'cancelled') {
      return res.status(400).json({ error: "只能取消订单" });
    }

    try {
      const orderResult = await query(
        `SELECT * FROM "orders" WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: "订单不存在" });
      }

      const order = orderResult.rows[0];

      // 只能取消未支付的订单
      if (order.status !== 'pending') {
        return res.status(400).json({ error: "只能取消未支付的订单" });
      }

      await query(
        `UPDATE "orders" SET status = $1, updated_at = NOW() WHERE id = $2`,
        ['cancelled', id]
      );

      return res.status(200).json({ success: true, message: "订单已取消" });
    } catch (err: any) {
      console.error("取消订单失败:", err);
      return res.status(500).json({ error: "取消订单失败" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { query } from "../../../lib/db";

// 检查是否是管理员
async function isAdmin(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return false;
  }

  // 简单检查：如果是特定邮箱则为管理员
  // 实际项目中应该使用role字段
  const adminEmails = ['admin@tailwag.com']; // 可以扩展
  return adminEmails.includes(session.user.email);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req, res))) {
    return res.status(403).json({ error: "无权限访问" });
  }

  // GET: 获取所有商品
  if (req.method === "GET") {
    try {
      const result = await query(
        `SELECT p.*, pc.name as category_name 
         FROM products p 
         LEFT JOIN product_categories pc ON p.category_id = pc.id 
         ORDER BY p.created_at DESC`,
        []
      );
      return res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("获取商品列表失败:", err);
      return res.status(500).json({ error: "获取商品列表失败" });
    }
  }

  // POST: 创建商品
  if (req.method === "POST") {
    const {
      name,
      brand,
      categoryId,
      categoryName,
      price,
      description,
      images,
      tag,
      selectionReason,
      sourcingUrl,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "商品名称和价格为必填项" });
    }

    try {
      const crypto = require('crypto');
      const productId = crypto.randomUUID();

      const result = await query(
        `INSERT INTO products (
          id, name, brand, category_id, category_name, price, description,
          images, tag, selection_reason, sourcing_url, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW(), NOW())
        RETURNING *`,
        [
          productId,
          name,
          brand || null,
          categoryId || null,
          categoryName || null,
          price,
          description || null,
          images || [],
          tag || null,
          selectionReason || null,
          sourcingUrl || null,
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error("创建商品失败:", err);
      return res.status(500).json({ error: "创建商品失败" });
    }
  }

  // PUT: 更新商品
  if (req.method === "PUT") {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ error: "商品ID不能为空" });
    }

    try {
      const result = await query(
        `UPDATE products SET
          name = $1,
          brand = $2,
          category_id = $3,
          category_name = $4,
          price = $5,
          description = $6,
          images = $7,
          tag = $8,
          selection_reason = $9,
          sourcing_url = $10,
          updated_at = NOW()
        WHERE id = $11
        RETURNING *`,
        [
          updateData.name,
          updateData.brand,
          updateData.categoryId,
          updateData.categoryName,
          updateData.price,
          updateData.description,
          updateData.images,
          updateData.tag,
          updateData.selectionReason,
          updateData.sourcingUrl,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "商品不存在" });
      }

      return res.status(200).json(result.rows[0]);
    } catch (err: any) {
      console.error("更新商品失败:", err);
      return res.status(500).json({ error: "更新商品失败" });
    }
  }

  // DELETE: 删除商品
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "商品ID不能为空" });
    }

    try {
      await query('DELETE FROM products WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("删除商品失败:", err);
      return res.status(500).json({ error: "删除商品失败" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

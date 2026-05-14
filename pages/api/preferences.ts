import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { query } from "../../lib/db";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getSessionUser(req, res);
  
  if (!userId) {
    return res.status(401).json({ error: "未登录" });
  }

  if (req.method === "GET") {
    const { petId } = req.query;

    try {
      let sql = 'SELECT * FROM "pet_preferences"';
      const params: any[] = [];

      if (petId) {
        // 验证 pet 属于当前用户
        const petCheck = await query(
          'SELECT id FROM "pets" WHERE id = $1 AND "user_id" = $2',
          [petId, userId]
        );
        if (petCheck.rows.length === 0) {
          return res.status(403).json({ error: "无权限" });
        }
        
        sql += ' WHERE "pet_id" = $1';
        params.push(petId);
      } else {
        // 只返回当前用户的宠物的偏好
        sql += ' WHERE "pet_id" IN (SELECT id FROM "pets" WHERE "user_id" = $1)';
        params.push(userId);
      }

      sql += ' ORDER BY "created_at" DESC';

      const result = await query(sql, params);
      return res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("获取宠物偏好失败:", err);
      return res.status(500).json({ error: "获取宠物偏好失败", details: err.message });
    }
  }

  if (req.method === "POST") {
    const {
      petId,
      category,
      itemId,
      preferenceScore,
      notes
    } = req.body;

    if (!petId || !category) {
      return res.status(400).json({ error: "petId 和 category 为必填项" });
    }

    // 验证 pet 属于当前用户
    const petCheck = await query(
      'SELECT id FROM "pets" WHERE id = $1 AND "user_id" = $2',
      [petId, userId]
    );
    if (petCheck.rows.length === 0) {
      return res.status(403).json({ error: "无权限" });
    }

    try {
      const crypto = require('crypto');
      const prefId = crypto.randomUUID();

      const result = await query(
        `INSERT INTO "pet_preferences" (
          id, "pet_id", category, "item_id", "preference_score", notes, "created_at"
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *`,
        [
          prefId,
          petId,
          category,
          itemId || null,
          preferenceScore || null,
          notes || null
        ]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error("创建宠物偏好失败:", err);
      return res.status(500).json({ error: "创建宠物偏好失败", details: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

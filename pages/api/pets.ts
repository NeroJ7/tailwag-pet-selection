import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { query } from "../../lib/db";
import { withRateLimit } from "../../lib/rate-limit";

// 获取当前登录用户
async function getSessionUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return null;
  }
  
  // 从数据库获取用户 ID
  const result = await query(
    'SELECT id FROM "users" WHERE email = $1 LIMIT 1',
    [session.user.email]
  );
  
  return result.rows[0]?.id || null;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 获取当前用户
  const userId = await getSessionUser(req, res);
  
  if (!userId) {
    return res.status(401).json({ error: "未登录" });
  }

  if (req.method === "GET") {
    const { id } = req.query;
    
    try {
      let sql = 'SELECT * FROM "pets" WHERE "user_id" = $1';
      const params: any[] = [userId];
      
      if (id) {
        sql += ' AND id = $2';
        params.push(id);
      }
      
      sql += ' ORDER BY "created_at" DESC';
      
      const result = await query(sql, params);
      
      if (id) {
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "宠物不存在或无权限" });
        }
        return res.status(200).json(result.rows[0]);
      }
      
      return res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("获取宠物失败:", err);
      return res.status(500).json({ error: "获取宠物失败" });
    }
  }

  if (req.method === "POST") {
    const {
      name,
      species,
      breed,
      gender,
      birthday,
      weight,
      photoUrls,
      microchipId,
      isNeutered
    } = req.body;

    if (!name || !species) {
      return res.status(400).json({ error: "name 和 species 为必填项" });
    }

    try {
      const crypto = require('crypto');
      const petId = crypto.randomUUID();
      
      const result = await query(
        `INSERT INTO "pets" (
          id, "user_id", name, species, breed, gender, birthday, weight, 
          "photoUrls", "microchip_id", "is_neutered", "created_at", "updated_at"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING *`,
        [
          petId,
          userId,  // 使用认证用户的 ID
          name,
          species,
          breed || null,
          gender || null,
          birthday || null,
          weight || null,
          photoUrls || [],
          microchipId || null,
          isNeutered || false
        ]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error("创建宠物失败:", err);
      return res.status(500).json({ error: "创建宠物失败" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id 为必填项" });
    }

    try {
      // 只能删除自己的宠物
      const result = await query(
        'DELETE FROM "pets" WHERE id = $1 AND "user_id" = $2',
        [id, userId]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "宠物不存在或无权限" });
      }
      
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("删除宠物失败:", err);
      return res.status(500).json({ error: "删除宠物失败" });
    }
  }

  if (req.method === "PUT") {
    const {
      id,
      name,
      species,
      breed,
      gender,
      birthday,
      weight,
      photoUrls,
      microchipId,
      isNeutered
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id 为必填项" });
    }

    // 验证宠物属于当前用户
    const petCheck = await query(
      'SELECT id FROM "pets" WHERE id = $1 AND "user_id" = $2',
      [id, userId]
    );
    
    if (petCheck.rows.length === 0) {
      return res.status(404).json({ error: "宠物不存在或无权限" });
    }

    // 构建动态更新查询
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (species !== undefined) {
      updates.push(`species = $${paramCount++}`);
      values.push(species);
    }
    if (breed !== undefined) {
      updates.push(`breed = $${paramCount++}`);
      values.push(breed);
    }
    if (gender !== undefined) {
      updates.push(`gender = $${paramCount++}`);
      values.push(gender);
    }
    if (birthday !== undefined) {
      updates.push(`birthday = $${paramCount++}`);
      values.push(birthday);
    }
    if (weight !== undefined) {
      updates.push(`weight = $${paramCount++}`);
      values.push(weight);
    }
    if (photoUrls !== undefined) {
      updates.push(`"photoUrls" = $${paramCount++}`);
      values.push(photoUrls);
    }
    if (microchipId !== undefined) {
      updates.push(`"microchip_id" = $${paramCount++}`);
      values.push(microchipId);
    }
    if (isNeutered !== undefined) {
      updates.push(`"is_neutered" = $${paramCount++}`);
      values.push(isNeutered);
    }

    updates.push(`"updated_at" = NOW()`);

    if (updates.length === 1) { // 只有 updated_at
      return res.status(400).json({ error: "没有提供要更新的字段" });
    }

    values.push(id); // WHERE id = $last

    try {
      const result = await query(
        `UPDATE "pets" SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      return res.status(200).json(result.rows[0]);
    } catch (err: any) {
      console.error("更新宠物失败:", err);
      return res.status(500).json({ error: "更新宠物失败" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

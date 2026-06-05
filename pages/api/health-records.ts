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

  if (req.method === "GET") {
    const { petId } = req.query;

    try {
      let sql = 'SELECT * FROM "health_records"';
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
        // 只返回当前用户的宠物的健康记录
        sql += ' WHERE "pet_id" IN (SELECT id FROM "pets" WHERE "user_id" = $1)';
        params.push(userId);
      }

      sql += ' ORDER BY "record_date" DESC';

      const result = await query(sql, params);
      return res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("获取健康记录失败:", err);
      return res.status(500).json({ error: "获取健康记录失败" });
    }
  }

  if (req.method === "POST") {
    const {
      petId,
      recordType,
      title,
      description,
      recordDate,
      nextDueDate,
      veterinarian,
      clinicName,
      documentUrls
    } = req.body;

    if (!petId || !recordType || !title || !recordDate) {
      return res.status(400).json({ error: "petId, recordType, title, recordDate 为必填项" });
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
      const recordId = crypto.randomUUID();

      const result = await query(
        `INSERT INTO "health_records" (
          id, "pet_id", "record_type", title, description, "record_date",
          "next_due_date", veterinarian, "clinic_name", "document_urls", "created_at"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING *`,
        [
          recordId,
          petId,
          recordType,
          title,
          description || null,
          recordDate,
          nextDueDate || null,
          veterinarian || null,
          clinicName || null,
          documentUrls || []
        ]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error("创建健康记录失败:", err);
      return res.status(500).json({ error: "创建健康记录失败" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "id 为必填项" });
    }

    // 验证记录属于当前用户的宠物
    const recordCheck = await query(
      'SELECT hr.id FROM "health_records" hr JOIN "pets" p ON hr."pet_id" = p.id WHERE hr.id = $1 AND p."user_id" = $2',
      [id, userId]
    );
    
    if (recordCheck.rows.length === 0) {
      return res.status(404).json({ error: "记录不存在或无权限" });
    }

    try {
      await query(
        'DELETE FROM "health_records" WHERE id = $1',
        [id]
      );
      
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("删除健康记录失败:", err);
      return res.status(500).json({ error: "删除健康记录失败" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRateLimit(handler, 'default');

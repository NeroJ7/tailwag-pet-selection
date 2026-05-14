import { query } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import DOMPurify from 'isomorphic-dompurify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // 输入清洗：防止XSS攻击
    const sanitizedEmail = email ? DOMPurify.sanitize(email.trim().toLowerCase()) : '';
    const sanitizedName = name ? DOMPurify.sanitize(name.trim()) : null;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码为必填项' });
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 强密码策略：必须包含大小写字母、数字和特殊字符，至少8位
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: '密码必须包含大小写字母、数字和特殊字符，至少8位' 
      });
    }

    // 检查用户是否已存在
    const existing = await query('SELECT id FROM "users" WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 创建用户
    const crypto = require('crypto');
    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO "users" (id, email, name, "password_hash", "created_at", "updated_at")
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, sanitizedEmail, sanitizedName, passwordHash]
    );

    return res.status(201).json({ 
      success: true,
      user: { id: userId, email: sanitizedEmail, name: sanitizedName }
    });
  } catch (error: any) {
    console.error('注册失败:', error);
    return res.status(500).json({ error: '注册失败，请稍后重试' });
  }
}

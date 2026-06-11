import { query } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from '../../../lib/rate-limit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // 基础验证
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码为必填项' });
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 密码强度验证
    if (password.length < 8) {
      return res.status(400).json({ error: '密码长度至少8位' });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name ? name.trim() : null;

    // 检查用户是否已存在
    const existing = await query('SELECT id FROM "users" WHERE email = $1', [sanitizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 创建用户 - 使用简单 UUID 生成
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
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
    // 返回详细错误信息（生产环境调试用）
    return res.status(500).json({
      error: '注册失败，请稍后重试',
      debug: {
        message: error.message,
        code: error.code,
        detail: error.detail || '',
      }
    });
  }
}

export default withRateLimit(handler, 'register');

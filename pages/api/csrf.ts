// pages/api/csrf.ts
// 获取 CSRF Token 的 API 端点
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 生成简单的随机 token
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    return res.status(200).json({ token });
  } catch (error: any) {
    console.error('CSRF Token 生成失败:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import { query } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from '../../../lib/rate-limit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '无效的产品ID' });
  }

  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT 
          p.*,
          c.name as category_name
         FROM "products" p
         LEFT JOIN "product_categories" c ON p."category_id" = c.id
         WHERE p.id = $1 AND p."is_active" = true
         LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: '产品不存在' });
      }

      return res.status(200).json({ product: result.rows[0] });
    } catch (error: any) {
      console.error('获取产品详情失败:', error);
      return res.status(500).json({ 
        error: '服务器内部错误',
        debug: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withRateLimit(handler, 'detail');

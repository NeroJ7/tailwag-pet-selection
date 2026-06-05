import { query } from '../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { withRateLimit } from '../../../lib/rate-limit';

async function handler(req: any, res: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '无效的产ID' });
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

      const product = result.rows[0];

      return res.status(200).json({ product });
    } catch (error: any) {
      console.error('获取产品详情失败:', error);
      return res.status(500).json({ error: '服务器内部错误' });
    }
  }

  if (req.method === 'PUT') {
    // 需要管理员权限（基于 role 字段）
    const session = await getServerSession(req, res, authOptions);
    if (!session || !(session.user as any).id) {
      return res.status(403).json({ error: '无权操作' });
    }
    // 从数据库验证角色
    const userResult = await query(
      'SELECT role FROM users WHERE id = $1 LIMIT 1',
      [(session.user as any).id]
    );
    if (userResult.rows[0]?.role !== 'admin') {
      return res.status(403).json({ error: '无权操作' });
    }

    try {
      const {
        name,
        price,
        images,
        sourcing_url,
        selection_reason,
        tag,
        margin,
        voc_highlights,
        description,
        specs,
        reviews,
        is_active,
      } = req.body;

      await query(
        `UPDATE "products" 
         SET 
           name = $1,
           price = $2,
           images = $3,
           sourcing_url = $4,
           selection_reason = $5,
           tag = $6,
           margin = $7,
           voc_highlights = $8,
           description = $9,
           specs = $10,
           reviews = $11,
           "is_active" = $12,
           "updated_at" = NOW()
         WHERE id = $13`,
        [
          name,
          price,
          JSON.stringify(images),
          sourcing_url,
          selection_reason,
          tag,
          margin,
          JSON.stringify(voc_highlights),
          description,
          JSON.stringify(specs),
          JSON.stringify(reviews),
          is_active,
          id,
        ]
      );

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('更新产品失败:', error);
      return res.status(500).json({ error: '更新失败' });
    }
  }

  if (req.method === 'DELETE') {
    // 需要管理员权限（基于 role 字段）
    const session = await getServerSession(req, res, authOptions);
    if (!session || !(session.user as any).id) {
      return res.status(403).json({ error: '无权操作' });
    }
    // 从数据库验证角色
    const userResult = await query(
      'SELECT role FROM users WHERE id = $1 LIMIT 1',
      [(session.user as any).id]
    );
    if (userResult.rows[0]?.role !== 'admin') {
      return res.status(403).json({ error: '无权操作' });
    }

    try {
      await query(
        `UPDATE "products" SET "is_active" = false, "updated_at" = NOW() WHERE id = $1`,
        [id]
      );

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('删除产品失败:', error);
      return res.status(500).json({ error: '删除失败' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withRateLimit(handler, 'detail');

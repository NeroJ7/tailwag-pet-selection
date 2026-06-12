import { query } from '../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from '../../lib/rate-limit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      id,
      category,
      minPrice,
      maxPrice,
      species,
      search,
      sort,
      limit = '20',
      offset = '0'
    } = req.query;

    // 如果指定了 id，返回单个产品
    if (id) {
      const result = await query('SELECT * FROM products WHERE id = $1 AND is_active = true', [id as string]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json({ product: result.rows[0] });
    }

    // 否则返回产品列表
    let sql = `
      SELECT p.*, pc.name as category_name
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.is_active = true
    `;
    const params: any[] = [];
    let paramCount = 0;

    // 分类筛选 - 支持数字 ID 和名称
    if (category) {
      const categoryStr = category as string;
      const isNumericId = /^\d+$/.test(categoryStr);
      if (isNumericId) {
        paramCount++;
        sql += ` AND p.category_id = $${paramCount}`;
        params.push(parseInt(categoryStr));
      } else {
        // 按名称筛选：同时匹配 category_name 和 product_categories.name
        paramCount++;
        sql += ` AND (p.category_name ILIKE $${paramCount} OR pc.name ILIKE $${paramCount})`;
        params.push(`%${categoryStr}%`);
      }
    }

    // 价格区间筛选
    if (minPrice) {
      paramCount++;
      sql += ` AND p.price >= $${paramCount}`;
      params.push(parseFloat(minPrice as string));
    }
    if (maxPrice) {
      paramCount++;
      sql += ` AND p.price <= $${paramCount}`;
      params.push(parseFloat(maxPrice as string));
    }

    // 搜索（产品名称、品牌、描述）
    if (search) {
      paramCount++;
      sql += ` AND (p.name ILIKE $${paramCount} OR p.brand ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.tag ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // 物种筛选（匹配 tag 和 description）
    if (species) {
      paramCount++;
      sql += ` AND (p.tag ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.category_name ILIKE $${paramCount})`;
      params.push(`%${species}%`);
    }

    // 排序
    const sortStr = (sort as string) || 'newest';
    switch (sortStr) {
      case 'price_asc':
        sql += ` ORDER BY p.price ASC`;
        break;
      case 'price_desc':
        sql += ` ORDER BY p.price DESC`;
        break;
      case 'name':
        sql += ` ORDER BY p.name ASC`;
        break;
      case 'name_desc':
        sql += ` ORDER BY p.name DESC`;
        break;
      case 'newest':
      default:
        sql += ` ORDER BY p.created_at DESC NULLS LAST`;
        break;
    }

    // 分页
    paramCount++;
    sql += ` LIMIT $${paramCount}`;
    params.push(Math.min(parseInt(limit as string) || 20, 100));

    paramCount++;
    sql += ` OFFSET $${paramCount}`;
    params.push(Math.max(parseInt(offset as string) || 0, 0));

    const result = await query(sql, params);

    // 获取总数（考虑筛选条件）
    let countSql = 'SELECT COUNT(*) FROM products p LEFT JOIN product_categories pc ON p.category_id = pc.id WHERE p.is_active = true';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countSql += ` AND (p.name ILIKE $${countParamCount} OR p.brand ILIKE $${countParamCount} OR p.description ILIKE $${countParamCount} OR p.tag ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }
    if (category) {
      const categoryStr = category as string;
      const isNumericId = /^\d+$/.test(categoryStr);
      if (isNumericId) {
        countParamCount++;
        countSql += ` AND p.category_id = $${countParamCount}`;
        countParams.push(parseInt(categoryStr));
      } else {
        countParamCount++;
        countSql += ` AND (p.category_name ILIKE $${countParamCount} OR pc.name ILIKE $${countParamCount})`;
        countParams.push(`%${categoryStr}%`);
      }
    }
    if (species) {
      countParamCount++;
      countSql += ` AND (p.tag ILIKE $${countParamCount} OR p.description ILIKE $${countParamCount} OR p.category_name ILIKE $${countParamCount})`;
      countParams.push(`%${species}%`);
    }
    if (minPrice) {
      countParamCount++;
      countSql += ` AND p.price >= $${countParamCount}`;
      countParams.push(parseFloat(minPrice as string));
    }
    if (maxPrice) {
      countParamCount++;
      countSql += ` AND p.price <= $${countParamCount}`;
      countParams.push(parseFloat(maxPrice as string));
    }

    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count);

    return res.status(200).json({
      products: result.rows,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      error: 'Internal server error',
      debug: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
}

export default withRateLimit(handler, 'list');

import { query } from '../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';

// 推荐算法：根据用户宠物信息推荐产品
function calculateRecommendationScore(product: any, pet: any, healthRecords: any[]): number {
  let score = 0;

  // 1. 物种匹配（权重 30%）
  const species = pet.species.toLowerCase();
  const productText = `${product.name} ${product.description} ${product.tag} ${JSON.stringify(product.specs)}`.toLowerCase();

  if (species.includes('狗') || species.includes('dog')) {
    if (productText.includes('犬') || productText.includes('dog') || productText.includes('通用')) {
      score += 30;
    }
  }
  if (species.includes('猫') || species.includes('cat')) {
    if (productText.includes('猫') || productText.includes('cat') || productText.includes('通用')) {
      score += 30;
    }
  }

  // 2. 年龄相关推荐（权重 20%）
  if (pet.birthday) {
    const birthDate = new Date(pet.birthday);
    const ageInYears = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (ageInYears < 1) {
      // 幼宠：推荐幼宠粮、温和零食
      if (productText.includes('幼') || productText.includes('温和') || productText.includes('零食')) {
        score += 20;
      }
    } else if (ageInYears > 7) {
      // 老年宠：推荐关节保健、骨科床、益生菌
      if (productText.includes('关节') || productText.includes('骨科') || productText.includes('益生菌') || productText.includes('老年')) {
        score += 20;
      }
    }
  }

  // 3. 健康记录相关推荐（权重 30%）
  for (const record of healthRecords) {
    const recordText = `${record.title} ${record.description} ${record.record_type}`.toLowerCase();

    // 关节/骨骼问题 → 骨科床、关节保健品
    if (recordText.includes('关节') || recordText.includes('骨科') || recordText.includes('关节炎')) {
      if (productText.includes('骨科') || productText.includes('关节') || productText.includes('记忆棉')) {
        score += 30;
      }
    }

    // 牙齿问题 → 牙刷、洁牙产品
    if (recordText.includes('牙') || recordText.includes('口腔') || recordText.includes('洁牙')) {
      if (productText.includes('牙') || productText.includes('口腔') || productText.includes('洁牙')) {
        score += 30;
      }
    }

    // 肠胃问题 → 益生菌、易消化食品
    if (recordText.includes('肠胃') || recordText.includes('腹泻') || recordText.includes('呕吐')) {
      if (productText.includes('益生菌') || productText.includes('肠胃') || productText.includes('消化')) {
        score += 30;
      }
    }

    // 皮肤问题 → 低敏食品、护理用品
    if (recordText.includes('皮肤') || recordText.includes('过敏') || recordText.includes('瘙痒')) {
      if (productText.includes('低敏') || productText.includes('皮肤') || productText.includes('过敏')) {
        score += 30;
      }
    }
  }

  // 4. 体重相关推荐（权重 10%）
  if (pet.weight) {
    const weight = pet.weight;
    if (productText.includes('承重') || productText.includes('适用')) {
      // 大型犬推荐大尺寸/高承重产品
      if (weight > 25 && (productText.includes('25') || productText.includes('大'))) {
        score += 10;
      }
      // 小型犬/猫推荐小尺寸产品
      if (weight < 10 && (productText.includes('小') || productText.includes('5kg'))) {
        score += 10;
      }
    }
  }

  // 5. 绝育状态（权重 10%）
  if (pet.is_neutered) {
    // 绝育后易胖，推荐低卡零食、体重管理产品
    if (productText.includes('低卡') || productText.includes('体重') || productText.includes('管理')) {
      score += 10;
    }
  }

  return Math.min(score, 100); // 最高 100 分
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取当前登录用户
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: '未登录' });
    }

    // 获取用户 ID
    const userResult = await query('SELECT id FROM "users" WHERE email = $1 LIMIT 1', [session.user.email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    const userId = userResult.rows[0].id;

    // 获取用户的宠物
    const petsResult = await query('SELECT * FROM pets WHERE user_id = $1', [userId]);
    const pets = petsResult.rows;

    if (pets.length === 0) {
      // 没有宠物，返回热门产品
      const popularProducts = await query(`
        SELECT p.*, pc.name as category_name_full
        FROM products p
        LEFT JOIN product_categories pc ON p.category_id = pc.id
        WHERE p.is_active = true
        ORDER BY p.price DESC
        LIMIT 10
      `);
      return res.status(200).json({ recommendations: popularProducts.rows, based_on: 'popular' });
    }

    // 获取所有产品
    const productsResult = await query('SELECT * FROM products WHERE is_active = true', []);
    const products = productsResult.rows;

    // 为每个宠物获取健康记录
    const recommendations: any[] = [];

    for (const pet of pets) {
      const healthResult = await query('SELECT * FROM health_records WHERE pet_id = $1', [pet.id]);
      const healthRecords = healthResult.rows;

      // 计算每只宠物对每个产品的推荐分数
      for (const product of products) {
        const score = calculateRecommendationScore(product, pet, healthRecords);

        if (score > 0) {
          recommendations.push({
            product,
            score,
            pet_name: pet.name,
            reason: generateRecommendationReason(product, pet, healthRecords)
          });
        }
      }
    }

    // 按分数排序，去重（同一产品只保留最高分）
    const uniqueRecommendations = new Map();
    for (const rec of recommendations) {
      const existing = uniqueRecommendations.get(rec.product.id);
      if (!existing || rec.score > existing.score) {
        uniqueRecommendations.set(rec.product.id, rec);
      }
    }

    const sortedRecommendations = Array.from(uniqueRecommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return res.status(200).json({
      recommendations: sortedRecommendations,
      based_on: 'pet_profile'
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// 生成推荐理由
function generateRecommendationReason(product: any, pet: any, healthRecords: any[]): string {
  const reasons: string[] = [];

  const productText = `${product.name} ${product.description}`.toLowerCase();
  const species = pet.species.toLowerCase();

  if (species.includes('狗') && (productText.includes('犬') || productText.includes('通用'))) {
    reasons.push(`适合${pet.species}`);
  }
  if (species.includes('猫') && (productText.includes('猫') || productText.includes('通用'))) {
    reasons.push(`适合${pet.species}`);
  }

  if (pet.birthday) {
    const birthDate = new Date(pet.birthday);
    const ageInYears = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (ageInYears > 7) {
      reasons.push('适合老年宠物');
    } else if (ageInYears < 1) {
      reasons.push('适合幼宠');
    }
  }

  for (const record of healthRecords) {
    const recordText = `${record.title} ${record.description}`.toLowerCase();
    if (recordText.includes('关节') && productText.includes('骨科')) {
      reasons.push('根据健康记录：关节保健需求');
    }
    if (recordText.includes('牙') && productText.includes('牙')) {
      reasons.push('根据健康记录：口腔护理需求');
    }
    if (recordText.includes('肠胃') && productText.includes('益生菌')) {
      reasons.push('根据健康记录：肠胃调理需求');
    }
  }

  return reasons.length > 0 ? reasons.join('；') : '根据您的宠物档案推荐';
}

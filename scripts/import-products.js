// 导入产品数据到数据库
const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function importProducts() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // 读取产品数据
    const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
    console.log(`Read ${products.length} products from JSON`);

    // 插入产品分类
    const categories = [...new Set(products.map(p => p.category))];
    console.log('Categories:', categories);

    for (const category of categories) {
      try {
        await client.query(
          'INSERT INTO product_categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
          [category]
        );
      } catch (err) {
        console.error(`Error inserting category ${category}:`, err.message);
      }
    }
    console.log('Categories inserted');

    // 获取分类 ID 映射
    const categoryResult = await client.query('SELECT id, name FROM product_categories');
    const categoryMap = {};
    categoryResult.rows.forEach(row => {
      categoryMap[row.name] = row.id;
    });
    console.log('Category map:', categoryMap);

    // 插入产品
    for (const product of products) {
      try {
        await client.query(`
          INSERT INTO products (
            id, product_code, name, brand, category_id, category_name,
            price, images, sourcing_url, selection_reason, tag, margin,
            voc_highlights, description, specs, reviews, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            price = EXCLUDED.price,
            updated_at = NOW()
        `, [
          product.id,
          product.id, // 使用 id 作为 product_code
          product.name,
          product.brand,
          categoryMap[product.category],
          product.category,
          product.price,
          product.images,
          product.sourcingUrl,
          product.selectionReason,
          product.tag,
          product.margin,
          product.vocHighlights || [],
          product.description,
          JSON.stringify(product.specs || []),
          JSON.stringify(product.reviews || []),
          true
        ]);
        console.log(`Imported: ${product.name}`);
      } catch (err) {
        console.error(`Error importing product ${product.name}:`, err.message);
      }
    }

    console.log('Products imported successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

importProducts();

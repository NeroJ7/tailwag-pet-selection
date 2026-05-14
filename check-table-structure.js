// 检查数据库表结构
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTableStructure() {
  try {
    await client.connect();
    console.log('✅ 数据库连接成功！');
    
    // 查询 health_records 表的列名
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'health_records'
      ORDER BY ordinal_position
    `);
    
    console.log('🏥 health_records 表的列名:');
    res.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // 查询 pet_preferences 表的列名
    const res2 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'pet_preferences'
      ORDER BY ordinal_position
    `);
    
    console.log('🎯 pet_preferences 表的列名:');
    res2.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // 查询 users 表的列名（确认）
    const res3 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('👤 users 表的列名:');
    res3.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkTableStructure();

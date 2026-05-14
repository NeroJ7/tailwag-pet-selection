// 测试 Neon 数据库连接
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ 数据库连接成功！');
    
    const res = await client.query('SELECT version()');
    console.log('📊 数据库版本:', res.rows[0].version);
    
    await client.end();
    console.log('✅ 连接已关闭');
  } catch (err) {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  }
}

testConnection();

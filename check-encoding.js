// 检查数据库编码
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkEncoding() {
  try {
    await client.connect();
    console.log('✅ 数据库连接成功！');
    
    // 检查数据库编码
    const serverEncoding = await client.query('SHOW server_encoding');
    console.log('📊 数据库编码 (server_encoding):', serverEncoding.rows[0].server_encoding);
    
    const clientEncoding = await client.query('SHOW client_encoding');
    console.log('📊 客户端编码 (client_encoding):', clientEncoding.rows[0].client_encoding);
    
    // 测试中文写入和读取
    await client.query('SET client_encoding TO $1', ['UTF-8']);
    
    const testResult = await client.query('SELECT $1::text as test', ['测试中文']);
    console.log('📝 中文测试:', testResult.rows[0].test);
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkEncoding();

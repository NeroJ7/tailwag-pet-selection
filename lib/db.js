// 数据库连接工具（CommonJS，供 API routes 用 require 引入）
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
});

const SLOW_QUERY_THRESHOLD = 500;

async function query(sql, params = []) {
  const client = await pool.connect();
  const start = Date.now();
  try {
    const result = await client.query(sql, params);
    const duration = Date.now() - start;
    if (duration > SLOW_QUERY_THRESHOLD) {
      console.warn(`[SLOW QUERY] ${duration}ms:`, sql.substring(0, 100));
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DB Query] ${duration}ms:`, sql.substring(0, 80));
    }
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB ERROR] ${duration}ms:`, error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { query };

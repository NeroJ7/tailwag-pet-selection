// 数据库连接工具（使用 pg 连接池）
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: true }  // 生产环境强制SSL验证
    : { rejectUnauthorized: false }   // 开发环境可放宽
});

export async function query(sql: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

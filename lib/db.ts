// 数据库连接工具（使用 pg 连接池）
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
  ssl: { rejectUnauthorized: false }, // 兼容 Neon 等云数据库（SSL 加密但不验证证书）
});

// 查询日志配置
const SLOW_QUERY_THRESHOLD = 500; // 慢查询阈值（毫秒）

export async function query(sql: string, params: any[] = []) {
  const client = await pool.connect();
  const start = Date.now();
  
  try {
    const result = await client.query(sql, params);
    const duration = Date.now() - start;
    
    // 记录慢查询（>500ms）
    if (duration > SLOW_QUERY_THRESHOLD) {
      console.warn(`[SLOW QUERY] ${duration}ms:`, sql.substring(0, 100));
    }
    
    // 开发环境记录所有查询
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

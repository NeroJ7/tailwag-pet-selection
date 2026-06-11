import { query } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: any = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET',
      directUrlPrefix: process.env.DIRECT_URL ? process.env.DIRECT_URL.substring(0, 30) + '...' : 'NOT SET',
    },
    tests: {} as any,
  };

  // 测试 1: 简单查询
  try {
    const test1 = await query('SELECT NOW() as time');
    results.tests.query_now = {
      success: true,
      time: test1.rows[0]?.time,
    };
  } catch (err: any) {
    results.tests.query_now = {
      success: false,
      error: err.message,
      stack: err.stack?.substring(0, 200),
    };
  }

  // 测试 2: 检查 users 表
  try {
    const test2 = await query('SELECT COUNT(*) as count FROM "users"');
    results.tests.users_count = {
      success: true,
      count: test2.rows[0]?.count,
    };
  } catch (err: any) {
    results.tests.users_count = {
      success: false,
      error: err.message,
      stack: err.stack?.substring(0, 200),
    };
  }

  // 测试 3: 检查 crypto
  try {
    const crypto = require('crypto');
    const uuid = crypto.randomUUID();
    results.tests.crypto = {
      success: true,
      uuid: uuid,
    };
  } catch (err: any) {
    results.tests.crypto = {
      success: false,
      error: err.message,
    };
  }

  // 测试 4: 检查 bcryptjs
  try {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('test', 10);
    results.tests.bcrypt = {
      success: true,
      hashPrefix: hash.substring(0, 20) + '...',
    };
  } catch (err: any) {
    results.tests.bcrypt = {
      success: false,
      error: err.message,
    };
  }

  // 测试 5: 检查 DOMPurify
  try {
    const DOMPurify = require('isomorphic-dompurify');
    const clean = DOMPurify.sanitize('<script>alert(1)</script>hello');
    results.tests.dompurify = {
      success: true,
      result: clean,
    };
  } catch (err: any) {
    results.tests.dompurify = {
      success: false,
      error: err.message,
      stack: err.stack?.substring(0, 200),
    };
  }

  return res.status(200).json(results);
}

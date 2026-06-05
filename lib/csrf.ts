// CSRF 保护工具库
// 使用双重提交 Cookie 模式（Double Submit Cookie）
// 适用于 Next.js API Routes

import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');
const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

export interface CsrfToken {
  token: string;
  expires: number;
}

/**
 * 生成 CSRF Token
 * 使用 HMAC 签名确保 token 未被篡改
 */
export function generateCsrfToken(): string {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const data = `${timestamp}:${nonce}`;
  
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');
  
  const token = Buffer.from(`${data}:${signature}`).toString('base64');
  return token;
}

/**
 * 验证 CSRF Token
 * 检查 token 格式、签名和过期时间
 */
export function verifyCsrfToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    
    if (parts.length !== 3) return false;
    
    const [timestamp, nonce, signature] = parts;
    const data = `${timestamp}:${nonce}`;
    
    // 验证签名
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
      return false;
    }
    
    // 检查是否过期（1小时有效期）
    const tokenTime = parseInt(timestamp, 10);
    if (Date.now() - tokenTime > 3600 * 1000) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * 从请求中获取 CSRF Token
 * 优先从 Header 获取，其次从 body 获取
 */
export function getCsrfTokenFromRequest(req: any): string | null {
  // 如果 req 是 undefined，返回 null
  if (!req) return null;
  
  // 1. 从 Header 获取
  const headerToken = req.headers?.[CSRF_HEADER_NAME];
  if (headerToken) return headerToken;
  
  // 2. 从 body 获取
  if (req.body && req.body._csrf) return req.body._csrf;
  
  return null;
}

/**
 * CSRF 验证中间件
 * 用于 Next.js API Routes
 */
export function withCsrfProtection(handler: any) {
  return async (req: any, res: any) => {
    // 仅对状态变更请求进行验证
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const token = getCsrfTokenFromRequest(req);
      
      if (!token) {
        return res.status(403).json({ 
          error: 'CSRF Token 缺失',
          code: 'CSRF_TOKEN_MISSING'
        });
      }
      
      if (!verifyCsrfToken(token)) {
        return res.status(403).json({ 
          error: 'CSRF Token 无效或已过期',
          code: 'CSRF_TOKEN_INVALID'
        });
      }
    }
    
    return handler(req, res);
  };
}

/**
 * 获取 CSRF Token 的 API 处理程序
 * 客户端通过调用 /api/csrf 获取 token
 */
export function createCsrfTokenHandler() {
  return async (req: any, res: any) => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const token = generateCsrfToken();
    
    // 设置 Cookie（允许 JavaScript 读取，用于双重提交 Cookie 模式）
    res.setHeader('Set-Cookie', [
      `${CSRF_TOKEN_NAME}=${token}; Path=/; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
    ]);
    
    return res.status(200).json({ token });
  };
}

export { CSRF_TOKEN_NAME, CSRF_HEADER_NAME };

import { NextRequest, NextResponse } from 'next/server';

// 简易内存速率限制（Edge Runtime 兼容）
const stores: Map<string, { count: number; resetAt: number }> = new Map();

const LOGIN_LIMIT = {
  windowMs: 15 * 60 * 1000,  // 15 分钟
  maxRequests: 10,               // 合理限制：10次/15分钟
};

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * CSRF 验证（Double Submit Cookie 模式）
 * 1. 从 cookie 读取 csrf_token
 * 2. 从 header 或 body 读取 x-csrf-token
 * 3. 两者必须匹配
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  let result = 0;
  for (let i = 0; i < bufA.length; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
}

function validateCsrf(req: NextRequest): boolean {
  // 仅验证状态变更请求
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
    return true;
  }

  const cookieToken = req.cookies.get('csrf_token')?.value;
  const headerToken = req.headers.get('x-csrf-token');

  if (!cookieToken || !headerToken) {
    return false;
  }

  // 使用 timingSafeEqual 防止时序攻击
  try {
    return timingSafeEqual(cookieToken, headerToken);
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();
  const pathname = req.nextUrl.pathname;

  // 1. 速率限制（仅登录相关路由）
  if (pathname.startsWith('/api/auth') && req.method === 'POST') {
    let entry = stores.get(ip);

    if (!entry || now > entry.resetAt) {
      entry = { count: 1, resetAt: now + LOGIN_LIMIT.windowMs };
      stores.set(ip, entry);
    } else {
      entry.count += 1;
      if (entry.count > LOGIN_LIMIT.maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return new NextResponse(
          JSON.stringify({ error: '登录请求过于频繁，请15分钟后再试' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfter),
            },
          }
        );
      }
      stores.set(ip, entry);
    }
  }

  // 2. CSRF 验证（状态变更请求）
  // 排除 NextAuth 路由（NextAuth 自己处理 CSRF）
  // 排除注册 API（公开端点，不需要 CSRF）
  const isNextAuthCallback = pathname.startsWith('/api/auth/callback/');
  const isNextAuthCsrf = pathname.startsWith('/api/auth/csrf');
  const isRegister = pathname === '/api/auth/register';
  if (!isNextAuthCallback && !isNextAuthCsrf && !isRegister && !validateCsrf(req)) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF Token 无效或缺失', code: 'CSRF_TOKEN_INVALID' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 3. 为未认证的 GET 请求设置 CSRF cookie
  if (req.method === 'GET' && !req.cookies.has('csrf_token')) {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const response = NextResponse.next();
    const isLocalhost = req.nextUrl.hostname === 'localhost' || req.nextUrl.hostname === '127.0.0.1';
    response.cookies.set('csrf_token', token, {
      httpOnly: false,  // 允许 JavaScript 读取
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production' && !isLocalhost,
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*', '/api/orders/:path*', '/api/pets/:path*', '/api/csrf'],
};

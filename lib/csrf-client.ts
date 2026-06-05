// 前端 CSRF 工具库
// 读取 CSRF token cookie，并在请求中包含

/**
 * 读取 CSRF token（从 cookie）
 * 依赖：middleware 已通过 Set-Cookie 设置 csrf_token
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/(^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * 获取 CSRF headers（用于 fetch 请求）
 */
export function getCsrfHeaders(): Record<string, string> {
  const token = getCsrfToken();
  if (!token) return {};

  return {
    'x-csrf-token': token,
    'Content-Type': 'application/json',
  };
}

/**
 * 带 CSRF 保护的 fetch 包装器
 */
export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getCsrfToken();

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['x-csrf-token'] = token;
  }

  if (!headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',  // 必须包含 cookie
  });
}

/**
 * 获取 CSRF token（从 API）
 * 当 cookie 中无 token 时调用
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/csrf', {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || null;
  } catch {
    return null;
  }
}

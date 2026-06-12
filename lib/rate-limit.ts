// 速率限制工具（手动实现，兼容 Next.js）
import type { NextApiRequest, NextApiResponse } from 'next';

// 存储请求记录（生产环境应使用 Redis）
const requestLogs = new Map<string, number[]>();

// 预定义限流配置
export const RateLimitConfig = {
  // 认证相关 API（合理限流）
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 分钟
    maxRequests: 30,             // 30次/15分钟（从10提升到30）
    message: '登录请求过于频繁，请15分钟后再试'
  },
  register: {
    windowMs: 60 * 60 * 1000,  // 1 小时
    maxRequests: 20,             // 20次/小时（从5提升到20）
    message: '注册请求过于频繁，请1小时后再试'
  },
  
  // 查询类 API（宽松限流）
  list: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 120,             // 120次/分钟（从60提升到120）
    message: '查询请求过于频繁，请1分钟后再试'
  },
  detail: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 200,             // 200次/分钟（从120提升到200）
    message: '查询请求过于频繁，请1分钟后再试'
  },
  search: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 60,              // 60次/分钟（从30提升到60）
    message: '搜索请求过于频繁，请1分钟后再试'
  },
  
  // 操作类 API（中等限流）
  createOrder: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 30,              // 30次/分钟
    message: '创建订单请求过于频繁，请1分钟后再试'
  },
  cart: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 120,             // 120次/分钟（从60提升到120）
    message: '购物车操作过于频繁，请1分钟后再试'
  },
  review: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 30,              // 30次/分钟
    message: '提交评价请求过于频繁，请1分钟后再试'
  },
  
  // 支付 API（严格限流）
  payment: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 20,              // 20次/分钟
    message: '支付请求过于频繁，请1分钟后再试'
  },
  
  // 管理类 API（中等限流）
  admin: {
    windowMs: 60 * 1000,        // 1 分钟
    maxRequests: 60,              // 60次/分钟（从30提升到60）
    message: '管理员操作过于频繁，请1分钟后再试'
  },
  
  // 默认配置
  default: {
    windowMs: 15 * 60 * 1000,  // 15 分钟
    maxRequests: 200,             // 200次/15分钟（从100提升到200）
    message: '请求过于频繁，请稍后再试'
  }
};

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
}

/**
 * 速率限制中间件工厂函数
 * @param handler - API 路由处理函数
 * @param options - 限流配置或使用预设配置名称
 */
export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: RateLimitOptions | keyof typeof RateLimitConfig = {}
) {
  // 如果 options 是字符串，使用预设配置
  let config: RateLimitOptions;
  
  if (typeof options === 'string') {
    config = RateLimitConfig[options] || RateLimitConfig.default;
  } else {
    config = {
      windowMs: options.windowMs || 15 * 60 * 1000,
      maxRequests: options.maxRequests || 200,
      message: options.message || '请求过于频繁，请稍后再试'
    };
  }
  
  const { windowMs, maxRequests, message } = config;
  
  return async function rateLimitMiddleware(
    req: NextApiRequest, 
    res: NextApiResponse
  ) {
    // 🔧 生产环境：支持通过环境变量禁用（仅测试用）
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      console.log('[RateLimit] DISABLE_RATE_LIMIT check: true (测试模式)');
      return handler(req, res);
    }
    
    const identifier = 
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
      req.socket.remoteAddress || 
      'unknown';
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // 获取该 IP 的请求记录
    const requests = requestLogs.get(identifier) || [];
    
    // 过滤出在时间窗口内的请求
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    // 记录本次请求
    recentRequests.push(now);
    requestLogs.set(identifier, recentRequests);
    
    // 继续处理请求
    return handler(req, res);
  };
}

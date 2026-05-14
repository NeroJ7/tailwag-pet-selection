# TailWag 宠物用品优选 - 安全评估报告

**评估日期**: 2026-05-01  
**评估版本**: v1.0.0  
**评估范围**: f:\副业项目\宠物用品优选\pet-selection-site  
**评估人员**: 安全专家  

---

## 执行摘要

本次安全评估对 TailWag 宠物用品优选电商项目进行了全面的安全审计。发现了 **19个安全漏洞**，其中包括 **2个严重漏洞**、**多個高危漏洞**。当前系统处于演示/原型阶段，缺少生产环境所需的基本安全措施。

**总体风险等级**: 🔴 **CRITICAL（严重）**

---

## 一、身份认证安全评估

### 🔴 严重问题

#### 1. 假的认证系统 (CRITICAL)
- **位置**: `pages/login.js:38-43`, `pages/login.js:68-73`
- **问题描述**: 
  - 系统使用 localStorage 模拟登录，无任何真实身份认证
  - 任何知道 email 的人都可以"登录"（无需密码验证）
  - 登录状态仅通过 `isLoggedIn: true` 标记，极易伪造
- **风险**: 任何人都可以伪造登录状态，访问需要认证的页面
- **修复建议**:
  ```javascript
  // 必须实现真实的后端认证系统
  // 1. 使用 JWT 或 Session-based authentication
  // 2. 密码必须 bcrypt/scrypt 哈希后存储
  // 3. 实现登录 API 端点进行凭据验证
  ```

#### 2. 密码明文存储风险 (HIGH)
- **位置**: `pages/login.js:68-73`
- **问题描述**: 
  - 注册时密码未哈希直接存储到 localStorage
  - `password` 字段虽然被存储但未使用，说明密码处理不完整
- **风险**: 任何能访问浏览器的用户都能看到"存储的"密码
- **修复建议**: 
  - 永远不要在前端存储密码
  - 使用后端 API 处理密码，后端用 bcrypt 哈希

#### 3. 缺少 CSRF 保护 (HIGH)
- **位置**: 整个应用
- **问题描述**: 没有 CSRF token 验证机制
- **风险**: 攻击者可以伪造用户操作（如创建订单、修改地址）
- **修复建议**: 实现 CSRF token 机制，使用 Next.js 的内置 CSRF 保护或第三方库

---

## 二、数据安全评估

### 🔴 严重问题

#### 4. 敏感数据明文存储 (CRITICAL)
- **位置**: `utils/cart-util.js`, `pages/orders.js`, `pages/cart.js`
- **问题描述**: 
  - 用户订单信息（姓名、邮箱、地址）明文存储在 localStorage
  - 订单数据存储在 `tailwag_orders` 键下，无任何加密
  - 购物车数据存储在 `tailwag_cart` 键下
- **风险**: 
  - XSS 攻击可窃取所有用户数据
  - 浏览器开发者工具可直接查看敏感信息
  - 跨站脚本可访问 localStorage 所有内容
- **修复建议**:
  ```
  1. 敏感数据必须存储在后端数据库
  2. 如果必须存储在前端，使用 Web Crypto API 加密
  3. 实现后端 API 处理订单和用户信息
  ```

#### 5. 订单 ID 可预测 (MEDIUM)
- **位置**: `utils/cart-util.js:53`
- **代码示例**:
  ```javascript
  id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  ```
- **问题描述**: 使用 `Math.random()` 生成订单 ID，可预测且可能重复
- **风险**: 订单 ID 可被猜测，导致信息泄露
- **修复建议**: 使用 UUID v4 或加密安全的随机数生成器

### 🟡 中等问题

#### 6. 缺少输入验证和清理 (MEDIUM)
- **位置**: `pages/cart.js:170-199` (结账表单)
- **问题描述**: 
  - 收货人姓名、邮箱、地址字段仅有 `required` 验证
  - 没有长度限制、特殊字符过滤
  - 没有服务端验证（所有验证都在前端）
- **风险**: XSS 注入、数据存储污染
- **修复建议**:
  ```javascript
  // 后端必须实现：
  // 1. 输入长度限制
  // 2. 特殊字符转义
  // 3. 邮箱格式严格验证
  // 4. 地址合法性验证
  ```

---

## 三、XSS（跨站脚本）风险评估

### 🟠 高危问题

#### 7. 潜在的 XSS 注入点 (HIGH)
- **位置**: `components/SearchModal.js:32-36`
- **代码示例**:
  ```javascript
  const results = query
    ? products.filter((p) =>
        [p.name, p.brand, p.category, p.description]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query))
      )
    : [];
  ```
- **问题描述**: 
  - 搜索功能直接处理用户输入并在页面渲染
  - 虽然 React 默认会转义，但 `dangerouslySetInnerHTML` 若被使用则风险极高
  - `products.json` 数据若被污染，可导致存储型 XSS
- **风险**: 存储型或反射型 XSS 攻击
- **修复建议**:
  ```
  1. 对所有用户输入进行严格清理
  2. 使用 DOMPurify 清理 HTML 内容
  3. 实施 CSP (Content Security Policy)
  4. 验证 products.json 数据来源
  ```

#### 8. 外部图片资源无验证 (MEDIUM)
- **位置**: 多个文件通过 Unsplash URL 加载图片
- **问题描述**: 图片 URL 来自外部源，若被劫持可导致 XSS
- **修复建议**: 实施 CSP `img-src` 指令限制图片来源

---

## 四、依赖安全评估

### 🔴 严重问题

#### 9. Next.js 多个严重漏洞 (CRITICAL)
- **当前版本**: next@14.1.0
- **问题**: npm audit 发现 **19个安全漏洞**
  - **1个严重 (Critical)**
    - Authorization Bypass in Next.js Middleware (CVSS 9.1)
  - **多個高危 (High)**
    - Server-Side Request Forgery (CVSS 7.5)
    - Cache Poisoning (CVSS 7.5)
    - Authorization Bypass (CVSS 7.5)
    - DoS via Server Components (CVSS 7.5) - 多个
  - **多个中危 (Moderate)**
    - Image Optimization DoS
    - Content Injection
    - Cache Key Confusion
- **修复命令**:
  ```bash
  cd f:\副业项目\宠物用品优选\pet-selection-site
  npm install next@14.2.35
  ```

#### 10. postcss XSS 漏洞 (MODERATE)
- **问题**: postcss < 8.5.10 存在 XSS 漏洞
- **修复**: 更新到 postcss >= 8.5.10（通过更新 Next.js 自动修复）

---

## 五、配置安全评估

### 🟡 中等问题

#### 11. 缺少 Content Security Policy (MEDIUM)
- **位置**: `vercel.json`, `next.config.js`
- **问题描述**: 
  - 没有配置 CSP
  - 仅有的安全头来自 vercel.json 的基本配置
- **当前安全头** (vercel.json):
  ```json
  "headers": [
    {"key": "X-Content-Type-Options", "value": "nosniff"},
    {"key": "X-Frame-Options", "value": "DENY"},
    {"key": "X-XSS-Protection", "value": "1; mode=block"}
  ]
  ```
- **缺失的安全头**:
  - Content-Security-Policy
  - Strict-Transport-Security (HSTS)
  - Referrer-Policy
  - Permissions-Policy
- **修复建议**: 在 `next.config.js` 或 `vercel.json` 中添加完整的 CSP

#### 12. 环境变量可能泄露 (LOW)
- **位置**: `next.config.js`
- **问题描述**: 没有检查是否有敏感信息硬编码
- **修复建议**: 
  - 使用 `next/config` 或环境变量
  - 确保 `.env.local` 在 `.gitignore` 中

---

## 六、合规性评估

### 🔴 严重问题

#### 13. 缺失隐私政策页面 (HIGH)
- **位置**: `pages/index.js:240` (页脚链接)
- **问题描述**: 
  - 页脚 "Privacy" 链接指向 `#`（无效）
  - 没有隐私政策页面
- **法律风险**: 违反 GDPR、CCPA 等数据保护法规
- **修复建议**: 创建 `/privacy` 页面，详细说明数据收集和使用方式

#### 14. 缺失用户协议页面 (HIGH)
- **位置**: `pages/index.js:241` (页脚链接)
- **问题描述**: "Terms" 链接指向 `#`（无效）
- **法律风险**: 无服务条款，纠纷时无法律依据
- **修复建议**: 创建 `/terms` 页面

#### 15. 缺失 Cookie 政策 (MEDIUM)
- **问题描述**: 没有 Cookie 同意机制
- **法律风险**: 违反 EU Cookie Law、GDPR
- **修复建议**: 实现 Cookie 横幅和偏好中心

---

## 七、其他安全问题

### 🟡 中等问题

#### 16. 控制台信息泄露 (LOW)
- **位置**: `pages/login.js:249`, `pages/cart.js:31`, `pages/dashboard.js:31-35`
- **问题描述**: 使用 `alert()` 显示开发信息
- **修复建议**: 移除所有 `alert()`，使用正确的通知系统

#### 17. 错误信息可能泄露敏感数据 (LOW)
- **问题描述**: 没有统一的错误处理
- **修复建议**: 实施全局错误处理，不向客户端发送详细错误

#### 18. 缺少 Rate Limiting (MEDIUM)
- **问题描述**: 没有 API 速率限制（虽然当前无真实 API）
- **修复建议**: 实施 API 速率限制防止暴力破解和 DoS

#### 19. 不安全的数据传输 (HIGH)
- **问题描述**: 
  - 没有强制 HTTPS
  - 表单数据通过 HTTP 传输时易被窃听
- **修复建议**: 
  - 强制 HTTPS（HSTS）
  - 实施 TLS 1.3

---

## 八、修复优先级清单

### 立即修复（24小时内）
1. ✅ 更新 Next.js 到 14.2.35 (`npm install next@14.2.35`)
2. ✅ 实施真实的后端认证系统
3. ✅ 将用户数据从 localStorage 迁移到后端数据库
4. ✅ 添加隐私政策和用户协议页面

### 短期修复（1周内）
5. 实施 CSRF 保护
6. 配置完整的 CSP 和安全头
7. 实施输入验证和清理
8. 强制 HTTPS (HSTS)

### 中期修复（1个月内）
9. 实施 Rate Limiting
10. 添加安全日志记录和监控
11. 进行渗透测试
12. 实施 PCI DSS 合规措施（如果处理支付）

---

## 九、安全架构建议

### 推荐的技术栈
```
前端: Next.js 14.2.35+ (已修复漏洞)
认证: NextAuth.js 或 Auth0
数据库: PostgreSQL + Prisma (用户数据)
ORM: 使用参数化查询防止 SQL 注入
API: 实施输入验证中间件
加密: Web Crypto API (前端) + bcrypt (后端)
```

### 安全头配置示例 (next.config.js)
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 十、结论

当前 TailWag 项目处于**演示/原型阶段**，存在大量安全风险。**不应在生产环境中部署**，除非完成以下关键修复：

1. ✅ 修复所有严重和高危漏洞
2. ✅ 实施完整的后端认证和授权系统
3. ✅ 将敏感数据从 localStorage 迁移到安全的后端存储
4. ✅ 更新所有依赖到安全版本
5. ✅ 添加必要的法律页面（隐私政策、用户协议）

**建议在修复完成后进行专业渗透测试。**

---

**报告结束**

评估人员: 安全专家 (security-specialist-v2)  
日期: 2026-05-01

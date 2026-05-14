# TailWag 宠物用品优选 - 测试覆盖率与质量审计报告

**审计日期:** 2026-05-13  
**审计人员:** test-engineer (QA Audit Team)  
**项目版本:** 1.1.0 (Post-Database Integration)  
**技术栈:** Next.js 14.1.0, React 18, TypeScript, Prisma, Neon Postgres

---

## 执行摘要

TailWag 项目已完成数据库集成和身份验证系统的基础实现，但**存在严重的功能缺陷和质量问题**。**注册功能完全无法使用**，测试覆盖率为 **0%**，项目**不具备上线条件**。

**总体评分: 4.5 / 10** (较之前 3.5/10 有提升，但仍不达标)

**关键发现:**
- 🔴 **注册功能完全失效** (P0)
- 🔴 **测试覆盖率 0%** (P0)
- 🔴 **数据库连接未使用连接池** (P0)
- 🟡 **多处安全漏洞** (P1)
- 🟡 **代码质量不一致** (P1)

---

## 一、测试覆盖率审计

### 1.1 测试结果：**0% 覆盖率**

| 测试类型 | 覆盖率 | 状态 | 说明 |
|---------|--------|------|------|
| 单元测试 | 0% | ❌ 缺失 | 无 Jest/Vitest 配置 |
| 集成测试 | 0% | ❌ 缺失 | 无 API 测试 |
| E2E测试 | 0% | ❌ 缺失 | 无 Cypress/Playwright |
| 手动测试 | 未知 | ⚠️ 未记录 | 无测试记录 |

### 1.2 测试框架现状

**已安装的开发依赖:**
```json
"devDependencies": {
  "@types/node": "25.6.2",
  "@types/react": "19.2.14",
  "autoprefixer": "^10.0.1",
  "postcss": "^8",
  "tailwindcss": "^3.3.0",
  "typescript": "6.0.3"
}
```

**问题:**
- ❌ 未安装任何测试框架 (Jest, Vitest, Cypress, Playwright)
- ❌ 无测试脚本 in package.json
- ❌ 无测试配置文件
- ❌ 无 `__tests__` 或 `*.test.*` 文件

### 1.3 应测试但未测试的功能

#### 优先级 P0 (必须测试)
1. **身份验证系统**
   - 用户注册 API (`/api/auth/register`)
   - 用户登录 (NextAuth Credentials)
   - JWT token 生成与验证
   - 密码加密与验证

2. **数据库操作**
   - 用户 CRUD 操作
   - 宠物档案 CRUD 操作
   - 健康记录管理
   - 数据完整性约束

3. **API 端点**
   - `/api/auth/register` - **目前已损坏**
   - `/api/pets` - GET, POST, DELETE
   - `/api/products` - GET with filters
   - `/api/health-records` - GET, POST
   - `/api/preferences` - GET, POST
   - `/api/recommendations` - GET

#### 优先级 P1 (强烈建议测试)
1. **表单验证**
   - 邮箱格式验证
   - 密码强度验证
   - 必填字段验证
   - 数据格式验证

2. **错误处理**
   - 数据库连接失败
   - 重复注册处理
   - 无效输入处理
   - 服务器错误处理

---

## 二、关键缺陷清单

### 🔴 P0 级别缺陷 (Blocker - 必须修复)

#### BUG #001: 注册 API 端点不匹配 - **注册功能完全失效**

**位置:**
- `pages/auth/signup.tsx:33` - 调用 `/api/auth/signup`
- `pages/api/auth/register.ts` - 实际 API 路由

**问题描述:**
```
signup.tsx 前端代码:
  const res = await fetch("/api/auth/signup", {  // ❌ 错误的端点
    method: "POST",
    ...
  });

实际 API 文件:
  pages/api/auth/register.ts  // ✅ 正确的文件名
```

**影响:**
- 用户点击"注册"按钮后，请求发送到不存在的 `/api/auth/signup`
- 服务器返回 **404 Not Found**
- **注册功能完全无法使用**
- 新用户无法创建账户

**修复方案:**
```typescript
// 方案 A: 修改前端调用 (推荐)
// pages/auth/signup.tsx:33
const res = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, name, password }),
});

// 方案 B: 重命名 API 文件
// 将 register.ts 重命名为 signup.ts
```

**验证步骤:**
1. 创建测试注册请求
2. 验证 API 端点存在且可访问
3. 验证数据库用户记录创建成功

---

#### BUG #002: 密码长度验证不一致

**位置:**
- `pages/api/auth/register.ts:24` - 要求 ≥8 位
- `pages/auth/signup.tsx:25` - 要求 ≥6 位

**代码对比:**
```typescript
// 后端 API (register.ts)
if (password.length < 8) {
  return res.status(400).json({ error: '密码长度至少8位' });
}

// 前端表单验证 (signup.tsx)
if (password.length < 6) {
  setError("密码长度至少 6 位");
  setLoading(false);
  return;
}
```

**影响:**
- 用户输入 6-7 位密码时，前端验证通过
- 提交到后端后，后端返回错误 "密码长度至少8位"
- 用户体验混乱，错误信息不一致

**修复方案:**
```typescript
// 统一为 8 位 (更安全)
// pages/auth/signup.tsx:25
if (password.length < 8) {
  setError("密码长度至少 8 位");
  setLoading(false);
  return;
}
```

---

#### BUG #003: 数据库表缺失 - products API 将失败

**位置:**
- `pages/api/products.ts` - 查询 `products` 和 `product_categories` 表
- `prisma/schema.prisma` - **未定义** Product 和 ProductCategory 模型

**问题描述:**
Prisma schema 中定义的模型:
- ✅ User
- ✅ Pet
- ✅ HealthRecord
- ✅ PetPreference
- ✅ UserActivity
- ❌ **Product (缺失)**
- ❌ **ProductCategory (缺失)**

但 `products.ts` API 尝试查询:
```sql
SELECT p.*, pc.name as category_name
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
WHERE p.is_active = true
```

**影响:**
- 调用 `/api/products` 将抛出数据库错误
- 产品列表页面将显示错误
- 首页产品展示失败

**修复方案:**
```prisma
// 在 prisma/schema.prisma 中添加:
model ProductCategory {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  products    Product[]
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("product_categories")
}

model Product {
  id            String   @id @default(uuid())
  name          String
  brand         String?
  description   String?
  price         Float
  categoryId    String?  @map("category_id")
  tag           String?
  specs         Json?
  photoUrls     String[] @default([]) @map("photo_urls")
  isActive      Boolean  @default(true) @map("is_active")
  category      ProductCategory? @relation(fields: [categoryId], references: [id])
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

---

#### BUG #004: 数据库连接未使用连接池

**位置:** `lib/db.ts`

**当前实现:**
```typescript
let client: Client | null = null;

export async function getDbClient(): Promise<Client> {
  if (!client) {
    client = new Client({
      connectionString: ...,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
  }
  return client;
}
```

**问题:**
1. 每次请求都创建新连接 (无连接复用)
2. 不支持并发请求 (单例 client)
3. 无连接池管理
4. 生产环境将导致连接耗尽

**修复方案:**
```typescript
// 使用 pg.Pool 替代 Client
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
});

export async function query(sql: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}
```

---

### 🟡 P1 级别缺陷 (Critical - 强烈建议修复)

#### BUG #005: 无输入数据清洗 - XSS 风险

**位置:** `pages/api/auth/register.ts:40-43`

**问题代码:**
```typescript
await query(
  `INSERT INTO "users" (id, email, name, "password_hash", "created_at", "updated_at")
   VALUES ($1, $2, $3, $4, NOW(), NOW())`,
  [userId, email, name || null, passwordHash]  // ⚠️ name 未清洗
);
```

**风险:**
- 如果 `name` 包含恶意脚本: `<script>alert('XSS')</script>`
- 当名称在页面上显示时，将执行脚本
- 可能导致会话劫持、数据窃取

**修复方案:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitize = (input: string) => {
  return DOMPurify.sanitize(input.trim());
};

// 在注册时清洗
const sanitizedName = name ? sanitize(name) : null;
```

---

#### BUG #006: 无速率限制 - 暴力破解风险

**位置:** `pages/api/auth/register.ts`, `pages/api/auth/[...nextauth].ts`

**问题:**
- 注册端点无速率限制
- 登录端点无速率限制
- 可无限次尝试注册/登录

**攻击场景:**
1. 攻击者可以批量注册垃圾账户
2. 攻击者可以暴力破解用户密码

**修复方案:**
```typescript
// 使用 express-rate-limit 或类似中间件
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 限制 5 次尝试
  message: 'Too many requests, please try again later',
});

// 应用到 API 路由
export default withRateLimit(handler, limiter);
```

---

#### BUG #007: 使用 `require()` 而非 `import`

**位置:**
- `pages/api/auth/register.ts:35`
- `pages/api/pets.ts:62`

**问题代码:**
```typescript
// ❌ 不好的做法
const crypto = require('crypto');

// ✅ 应该是
import crypto from 'crypto';
```

**影响:**
- 混合 CommonJS 和 ES Module 语法
- 不符合 TypeScript 最佳实践
- 可能导致打包问题

---

#### BUG #008: 无 CSRF 保护

**位置:** 所有状态更改 API (POST, PUT, DELETE)

**问题:**
- NextAuth 默认提供 CSRF 保护
- 但自定义 API 路由 (`/api/auth/register`, `/api/pets`) 未启用 CSRF 保护

**修复方案:**
```typescript
// 在 API 路由中验证 CSRF token
import { getCsrfToken } from 'next-auth/react';

async function validateCsrf(req: NextApiRequest) {
  const csrfToken = req.headers['x-csrf-token'];
  const validToken = await getCsrfToken();
  return csrfToken === validToken;
}
```

---

### 🟢 P2 级别缺陷 (Major - 建议修复)

#### BUG #009: 无密码重置功能

**影响:**
- 用户忘记密码后无法恢复
- 降低用户体验
- 增加支持负担

**建议:**
- 实现 `/api/auth/forgot-password` 端点
- 发送密码重置邮件
- 实现 token 验证和密码更新

---

#### BUG #010: 无邮箱验证

**影响:**
- 可以注册虚假邮箱
- 无法发送通知邮件
- 账户安全性降低

**建议:**
- 注册后发送验证邮件
- 实现 `/api/auth/verify-email` 端点
- 未验证邮箱限制某些功能

---

## 三、风险点识别

### 3.1 边界情况未处理

| 场景 | 当前行为 | 期望行为 |
|------|----------|----------|
| 数据库连接失败 | 返回 500 错误 | 返回友好错误信息，记录日志 |
| 并发注册相同邮箱 | 可能成功创建重复记录 | 数据库约束 + 事务处理 |
| 超长输入 | 可能截断或报错 | 前端验证 + 后端限制 |
| 特殊字符输入 | 未处理 | 输入清洗和验证 |
| SQL 注入 | 使用参数化查询 (安全) | 保持参数化查询 |
| XSS 攻击 | 无防护 | HTML 标签转义 |

### 3.2 性能风险

| 风险项 | 严重程度 | 说明 |
|--------|----------|------|
| 数据库连接池缺失 | 🔴 高 | 高并发下连接耗尽 |
| 无缓存机制 | 🟡 中 | 重复查询数据库 |
| 无分页限制 | 🟡 中 | 可能返回大量数据 |
| 同步操作阻塞 | 🟢 低 | 注册时使用 `crypto.randomUUID()` 同步 |

### 3.3 安全风险

| 风险项 | 概率 | 影响 | 缓解措施 |
|--------|------|------|----------|
| XSS 攻击 | 高 | 中 | 输入清洗 + 输出转义 |
| 暴力破解 | 中 | 高 | 速率限制 + 账户锁定 |
| SQL 注入 | 低 | 高 | 已使用参数化查询 (安全) |
| CSRF 攻击 | 中 | 中 | 启用 CSRF 保护 |
| 会话劫持 | 低 | 高 | HTTPS + Secure Cookie |

---

## 四、测试策略评估

### 4.1 当前测试成熟度: **Level 0 - 无测试**

```
测试成熟度模型:
Level 0: 无测试 ❌ (当前状态)
Level 1: 基础单元测试
Level 2: 集成测试 + 覆盖率报告
Level 3: E2E 测试 + CI/CD
Level 4: 自动化测试 + 性能测试
Level 5: 持续测试 + 质量度量
```

### 4.2 推荐测试技术栈

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest-environment-jsdom": "^29.7.0",
    "msw": "^2.0.0",  // Mock Service Worker
    "@playwright/test": "^1.40.0",
    "supertest": "^6.3.0"
  }
}
```

### 4.3 测试金字塔建议

```
           /\
          /E2E\     (10-20% 覆盖关键流程)
         /______\
        /        \
       /Integration\  (20-30% 覆盖 API 和数据库)
      /__________\
     /            \
    /  Unit Tests   \  (60-70% 覆盖业务逻辑)
   /________________\
```

---

## 五、测试改进建议

### 5.1 立即行动项 (P0)

#### 1. 安装测试框架
```bash
cd pet-selection-site
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
npm install -D @playwright/test  # E2E 测试
```

#### 2. 配置 Jest
创建 `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
};
```

#### 3. 编写第一个测试
创建 `pages/api/auth/register.test.ts`:
```typescript
import { createMocks } from 'node-mocks-http';
import handler from './register';

describe('/api/auth/register', () => {
  it('should reject non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  it('should validate required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { email: '', password: '' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
});
```

### 5.2 短期改进 (1-2 周)

1. **单元测试 (目标: 70% 覆盖率)**
   - 身份验证逻辑
   - 数据库工具函数
   - 表单验证逻辑

2. **集成测试**
   - API 端点测试
   - 数据库操作测试
   - NextAuth 集成测试

3. **E2E 测试 (关键流程)**
   - 用户注册流程
   - 用户登录流程
   - 宠物档案创建流程

### 5.3 中期改进 (2-4 周)

1. **CI/CD 集成**
   - GitHub Actions / Vercel CI
   - 自动运行测试
   - 覆盖率报告

2. **性能测试**
   - API 响应时间
   - 数据库查询优化
   - 并发用户测试

3. **安全测试**
   - OWASP ZAP 扫描
   - 渗透测试
   - 依赖漏洞扫描

---

## 六、测试计划

### Phase 1: 基础测试框架 (Week 1)

**任务清单:**
- [ ] 安装 Jest + Testing Library
- [ ] 配置测试环境
- [ ] 编写第一批单元测试
- [ ] 设置 CI 流水线

**目标覆盖率:** 30%

### Phase 2: API 和集成测试 (Week 2)

**任务清单:**
- [ ] 测试所有 API 端点
- [ ] 测试数据库操作
- [ ] Mock 外部依赖
- [ ] 测试错误处理

**目标覆盖率:** 60%

### Phase 3: E2E 测试 (Week 3)

**任务清单:**
- [ ] 安装 Playwright/Cypress
- [ ] 编写关键流程 E2E 测试
- [ ] 测试跨浏览器兼容性
- [ ] 视觉回归测试

**目标覆盖率:** 80%

### Phase 4: 持续集成和质量监控 (Week 4)

**任务清单:**
- [ ] 配置 GitHub Actions
- [ ] 自动部署预览
- [ ] 覆盖率门禁
- [ ] 性能监控集成

**目标覆盖率:** 90%

---

## 七、质量保障流程建议

### 7.1 代码审查检查清单

**每个 Pull Request 必须:**
- [ ] 包含单元测试
- [ ] 通过所有现有测试
- [ ] 新增代码覆盖率 ≥ 70%
- [ ] 无 ESLint 警告
- [ ] 通过 TypeScript 类型检查
- [ ] 手动测试关键流程

### 7.2 发布检查清单

**上线前必须:**
- [ ] 所有测试通过 (100%)
- [ ] 覆盖率报告 ≥ 80%
- [ ] 安全扫描无高危漏洞
- [ ] 性能测试通过
- [ ] 手动回归测试完成

---

## 八、结论与建议

### 8.1 当前状态

TailWag 项目在数据库集成方面取得了进展，但**质量和测试保障严重缺失**:

❌ **注册功能完全损坏** (API 端点不匹配)  
❌ **测试覆盖率 0%**  
❌ **无测试框架**  
❌ **多处安全漏洞**  
⚠️ **代码质量不一致**  

### 8.2 风险评估

| 风险 | 等级 | 影响 |
|------|------|------|
| 注册功能失效 | 🔴 P0 | 新用户无法注册 |
| 无测试覆盖 | 🔴 P0 | 代码变更易引入 bug |
| 数据库连接池缺失 | 🔴 P0 | 生产环境性能问题 |
| XSS 漏洞 | 🟡 P1 | 用户数据泄露风险 |
| 无速率限制 | 🟡 P1 | 暴力破解风险 |

### 8.3 建议路线

**路线 A: 快速修复关键 Bug (1-2 天)**
1. 修复注册 API 端点不匹配
2. 统一密码验证规则
3. 添加数据库连接池
4. 安装测试框架并编写基础测试

**路线 B: 完整质量保障体系建设 (2-4 周)**
1. 完成所有 P0 和 P1 缺陷修复
2. 建立测试金字塔 (单元 + 集成 + E2E)
3. 配置 CI/CD 流水线
4. 实施代码审查流程
5. 进行安全审计和性能测试

### 8.4 立即行动项

**今天必须完成:**
1. ✅ 修复 `signup.tsx` 中的 API 端点调用
2. ✅ 统一密码长度验证 (改为 8 位)
3. ✅ 安装 Jest 并编写第一个测试

**本周必须完成:**
1. ✅ 修复所有 P0 级别 bug
2. ✅ 实现数据库连接池
3. ✅ 编写身份验证模块的单元测试
4. ✅ 配置 CI 流水线

---

## 九、附录: 完整 Bug 清单

| Bug ID | 标题 | 位置 | 严重程度 | 状态 |
|--------|------|------|----------|------|
| BUG-001 | 注册 API 端点不匹配 | `signup.tsx:33` | 🔴 P0 | 未修复 |
| BUG-002 | 密码长度验证不一致 | `register.ts:24`, `signup.tsx:25` | 🔴 P0 | 未修复 |
| BUG-003 | 数据库表缺失 (products) | `products.ts`, `schema.prisma` | 🔴 P0 | 未修复 |
| BUG-004 | 数据库连接未使用连接池 | `lib/db.ts` | 🔴 P0 | 未修复 |
| BUG-005 | 无输入数据清洗 | `register.ts:40` | 🟡 P1 | 未修复 |
| BUG-006 | 无速率限制 | `register.ts`, `nextauth.ts` | 🟡 P1 | 未修复 |
| BUG-007 | 使用 `require()` 而非 `import` | `register.ts:35` | 🟡 P1 | 未修复 |
| BUG-008 | 无 CSRF 保护 | 所有 API 路由 | 🟡 P1 | 未修复 |
| BUG-009 | 无密码重置功能 | 缺失 | 🟢 P2 | 未实现 |
| BUG-010 | 无邮箱验证 | 缺失 | 🟢 P2 | 未实现 |

---

## 十、测试覆盖率目标

| 模块 | 当前覆盖率 | 目标覆盖率 | 优先级 |
|------|------------|------------|--------|
| 身份验证 | 0% | 90% | P0 |
| API 端点 | 0% | 80% | P0 |
| 数据库操作 | 0% | 85% | P0 |
| 表单验证 | 0% | 75% | P1 |
| UI 组件 | 0% | 60% | P1 |
| 工具函数 | 0% | 90% | P1 |
| **综合覆盖率** | **0%** | **80%** | **P0** |

---

**报告结束**

审计人: test-engineer (TailWag Audit Team)  
日期: 2026-05-13  
版本: 1.0

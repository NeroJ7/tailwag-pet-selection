# TailWag Vercel 部署指南

## 1. 前置条件
- Vercel 账号（https://vercel.com）
- GitHub 仓库已同步最新代码

## 2. Vercel 项目配置

### 方式一：Git 自动部署（推荐）
1. 登录 Vercel Dashboard
2. 点击 "Add New Project"
3. 选择 `tailwag-pet-selection` GitHub 仓库
4. 框架预设选择 **Next.js**
5. 点击 "Deploy"

### 方式二：Vercel CLI 部署
```bash
npx vercel login
npx vercel --prod
```

## 3. 环境变量配置

在 Vercel Dashboard → Project Settings → Environment Variables 中添加以下变量：

### 必需变量
| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_fa5wunGHR7eF@ep-restless-feather-ap9yccdr-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `DIRECT_URL` | 同上 | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `oI6YJo1AXVuxALTb2zXAehne/y9Pl+MElwenuPN5Cv8=` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://你的域名.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://你的域名.vercel.app` | Production |

### 支付配置（可选）
未配置时自动使用**模拟支付**。

#### 支付宝沙箱测试
1. 登录 https://open.alipay.com → 沙箱环境
2. 获取 APP ID、应用私钥、支付宝公钥
3. 在 Vercel 添加：

| 变量名 | 说明 |
|--------|------|
| `ALIPAY_APP_ID` | 沙箱应用的 APP ID |
| `ALIPAY_PRIVATE_KEY` | 应用私钥（含头尾标记） |
| `ALIPAY_PUBLIC_KEY` | 支付宝公钥（含头尾标记） |
| `ALIPAY_GATEWAY` | `https://openapi.alipaydev.com/gateway.do` |

#### 支付宝生产环境
将 `ALIPAY_GATEWAY` 改为 `https://openapi.alipay.com/gateway.do`

## 4. 数据库同步

首次部署后，确保数据库表结构已创建：
```bash
npx prisma db push
```

## 5. 验证部署

部署完成后验证以下功能：
- [ ] 首页正常加载
- [ ] 注册/登录功能正常
- [ ] 商品列表页正常
- [ ] 购物车 → 结算 → 创建订单流程正常
- [ ] 订单列表和详情页正常
- [ ] 支付流程（未配置支付宝时显示模拟支付）
- [ ] 宠物管理功能正常
- [ ] 推荐页面正常

## 6. 已知限制

1. **文件上传**：当前使用本地磁盘存储上传文件，Vercel 无持久化磁盘。建议迁移到：
   - Vercel Blob Storage
   - AWS S3 / Cloudflare R2
   - 阿里云 OSS

2. **微信支付**：当前仅支持模拟支付，真实微信支付需要商户资质和 API 证书。

3. **管理员权限**：当前硬编码管理员邮箱，建议后续添加角色系统。

## 7. 域名配置（可选）

在 Vercel Dashboard → Domains 中添加自定义域名，按提示配置 DNS。

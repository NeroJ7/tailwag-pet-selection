# TailWag UI Consistency Review Report

**审查日期**: 2026-05-12
**审查页面**: `/`, `/login`, `/pets`, `/products`
**品牌规范**: brand-orange(#f97316), brand-charcoal(#1a1a1a), brand-cream(#FDFCF8), Plus Jakarta Sans, Playfair Display

---

## 🚨 Critical Issues (Priority 1)

### 1. `/pets` - 宠物档案页 - 完全未应用品牌设计

**问题**: 该页面使用内联样式，完全不符合品牌设计规范

**具体问题和修复**:

#### 问题 1.1: 整个页面使用 inline styles
**当前代码** (line 54-92):
```tsx
return (
  <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1>我的宠物</h1>
      <button onClick={() => signOut()}>退出登录</button>
    </div>
    <button onClick={() => router.push("/pets/add")}>添加宠物</button>
    ...
    <div style={{ border: "1px solid #ccc", padding: 15, ... }}>
```

**修复后的代码**:
```tsx
return (
  <div className="min-h-screen bg-brand-cream">
    <Navbar />
    
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
            My Pets
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-brand-charcoal tracking-tighter">
            我的<span className="title-serif text-brand-orange">宠物</span>
          </h1>
        </div>
        <button
          onClick={() => router.push("/pets/add")}
          className="btn-primary mt-6 md:mt-0"
        >
          添加宠物
        </button>
      </div>
      ...
```

#### 问题 1.2: 宠物卡片样式
**修复后的卡片代码**:
```tsx
{pets.map((pet) => (
  <div
    key={pet.id}
    className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-premium transition-all duration-500 border border-stone-100"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center text-3xl">
          {pet.species === '狗' ? '🐶' : pet.species === '猫' ? '🐱' : '🐾'}
        </div>
        <div>
          <h3 className="text-lg font-black text-brand-charcoal">{pet.name}</h3>
          <p className="text-sm text-brand-stone">{pet.species} · {pet.breed}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => router.push(`/pets/${pet.id}`)}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange hover:text-brand-charcoal transition-colors"
        >
          查看详情
        </button>
        <button
          onClick={() => deletePet(pet.id)}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-red-700 transition-colors"
        >
          删除
        </button>
      </div>
    </div>
    
    {/* Pet Details */}
    <div className="mt-6 grid grid-cols-2 gap-4">
      {pet.gender && (
        <div className="bg-brand-cream rounded-xl p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-stone">性别</p>
          <p className="text-sm font-bold text-brand-charcoal mt-1">{pet.gender}</p>
        </div>
      )}
      {pet.birthDate && (
        <div className="bg-brand-cream rounded-xl p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-stone">生日</p>
          <p className="text-sm font-bold text-brand-charcoal mt-1">
            {new Date(pet.birthDate).toLocaleDateString('zh-CN')}
          </p>
        </div>
      )}
    </div>
  </div>
))}
```

#### 问题 1.3: 空状态设计
**修复后的空状态**:
```tsx
{pets.length === 0 ? (
  <div className="text-center py-20">
    <div className="text-6xl mb-6">🐾</div>
    <h3 className="text-2xl font-black text-brand-charcoal mb-4">还没有添加宠物</h3>
    <p className="text-brand-stone mb-8">点击"添加宠物"开始建立您的宠物档案</p>
    <button
      onClick={() => router.push("/pets/add")}
      className="btn-primary"
    >
      添加第一个宠物
    </button>
  </div>
) : (...)}
```

#### 问题 1.4: Loading 状态
**修复后的 loading 状态**:
```tsx
if (status === "loading" || loading) {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
        <p className="text-sm font-bold text-brand-stone tracking-wider">加载中...</p>
      </div>
    </div>
  );
}
```

---

## ⚠️ High Priority Issues (Priority 2)

### 2. `/products` - 商品页 - 使用通用灰色而非品牌色

**问题**: 页面使用 Tailwind 默认灰色系统，而非品牌自定义颜色

#### 问题 2.1: 背景色错误
**当前代码** (line 66):
```tsx
<div className="min-h-screen bg-gray-50">
```

**修复**:
```tsx
<div className="min-h-screen bg-brand-cream">
```

#### 问题 2.2: 导航栏未使用 Navbar 组件
**当前代码** (line 68-100): 自定义 nav 组件

**修复**: 删除自定义 nav，使用 `<Navbar />` 组件

#### 问题 2.3: 颜色使用错误
需要全局替换:
- `text-orange-600` → `text-brand-orange`
- `text-gray-700` → `text-brand-stone`
- `text-gray-600` → `text-brand-stone`
- `text-gray-500` → `text-brand-stone`
- `text-gray-900` → `text-brand-charcoal`
- `border-gray-300` → `border-stone-100`
- `focus:ring-orange-500` → `focus:ring-brand-orange/10`
- `bg-orange-100` → `bg-orange-50`
- `text-orange-600` (tag) → `text-brand-orange bg-brand-orange/10`

#### 问题 2.4: 商品卡片样式不一致
**当前代码** (line 133):
```tsx
<div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
```

**修复**:
```tsx
<div className="bg-white rounded-[2rem] shadow-sm hover:shadow-premium transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-stone-100">
```

#### 问题 2.5: 输入框样式
**当前代码** (line 110):
```tsx
className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
```

**修复**:
```tsx
className="flex-1 px-8 py-5 bg-white border-2 border-stone-100 rounded-2xl outline-none font-bold text-sm focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
```

#### 问题 2.6: 筛选下拉框样式
**当前代码** (line 115):
```tsx
className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
```

**修复**:
```tsx
className="px-8 py-5 bg-white border-2 border-stone-100 rounded-2xl outline-none font-bold text-sm focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
```

---

## ✅ Well Designed Pages

### 3. `/` - 首页 - 设计规范
- ✅ 使用 brand-cream 背景
- ✅ 使用 brand-orange, brand-charcoal, brand-stone
- ✅ 使用 title-serif 衬线字体
- ✅ 使用 shadow-premium
- ✅ 使用 rounded-[2rem] 和 rounded-[3rem]
- ✅ 间距统一 (py-24, px-6)

** minor 建议**:
- CTA 按钮可使用 `btn-primary` 和 `btn-secondary` 保持一致性

### 4. `/login` - 登录页 - 设计规范
- ✅ 使用 brand-cream 背景
- ✅ 使用 brand-orange, brand-charcoal, brand-stone
- ✅ 使用 title-serif 衬线字体
- ✅ 使用 shadow-premium
- ✅ 表单输入框样式统一

**Minor 建议**:
- Mobile Benefits 区域使用 `bg-white rounded-3xl`，建议改为 `bg-brand-cream rounded-[2rem]` 以保持统一

---

## 📋 Action Items

| 优先级 | 页面 | 问题 | 工作量 |
|--------|------|------|--------|
| P1 | `/pets` | 完全重写，应用品牌设计 | 2小时 |
| P2 | `/products` | 替换所有通用灰色为品牌色 | 1小时 |
| P2 | `/products` | 使用 Navbar 组件 | 15分钟 |
| P2 | `/products` | 统一卡片/输入框/按钮样式 | 1小时 |
| P3 | `/login` | Mobile benefits 背景色统一 | 5分钟 |

---

## 🎨 Correct Tailwind Classes Reference

**背景**:
- ✅ `bg-brand-cream` (主要背景)
- ✅ `bg-white` (卡片背景)
- ✅ `bg-brand-charcoal` (深色背景)

**文字**:
- ✅ `text-brand-orange` (强调)
- ✅ `text-brand-charcoal` (标题)
- ✅ `text-brand-stone` (正文/辅助)

**边框**:
- ✅ `border-stone-100` (默认边框)
- ✅ `border-brand-orange` (焦点边框)

**圆角**:
- ✅ `rounded-[2rem]` (卡片)
- ✅ `rounded-[3rem]` (大图)
- ✅ `rounded-2xl` (图标容器)
- ✅ `rounded-full` (按钮)

**阴影**:
- ✅ `shadow-sm` (默认)
- ✅ `shadow-premium` (悬停)

**字体**:
- ✅ `title-serif` (标题斜体)
- ✅ `font-black` (标题)
- ✅ `font-bold` (正文)
- ✅ `text-[10px] font-black uppercase tracking-[0.5em]` (标签)

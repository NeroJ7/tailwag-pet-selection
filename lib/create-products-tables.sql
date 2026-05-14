-- 创建产品分类表
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  product_code VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category_id INTEGER REFERENCES product_categories(id),
  category_name VARCHAR(100), -- 冗余字段，方便查询
  price DECIMAL(10, 2) NOT NULL,
  images TEXT[], -- 图片URL数组
  sourcing_url TEXT,
  selection_reason TEXT,
  tag VARCHAR(100),
  margin VARCHAR(50),
  voc_highlights TEXT[], -- 用户反馈亮点数组
  description TEXT,
  specs JSONB, -- 规格，存储为JSON
  reviews JSONB, -- 评价，存储为JSON
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建产品推荐记录表（可选，用于记录推荐历史）
CREATE TABLE IF NOT EXISTS product_recommendations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  pet_id VARCHAR(255) REFERENCES pets(id) ON DELETE SET NULL,
  product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
  recommendation_score DECIMAL(5, 2), -- 推荐分数
  recommendation_reason TEXT, -- 推荐理由
  is_clicked BOOLEAN DEFAULT false, -- 用户是否点击
  is_purchased BOOLEAN DEFAULT false, -- 用户是否购买
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_user ON product_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_pet ON product_recommendations(pet_id);

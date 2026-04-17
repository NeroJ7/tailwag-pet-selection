import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <Navbar />

      <main>
        {/* 主视觉区域 */}
        <Hero />

        {/* 优选选品标准 (新增核心模块) */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择 TailWag？</h2>
              <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "专业测评", desc: "每一件商品都经过养宠专家实测，确保安全耐用。" },
                { title: "材质透明", desc: "严格审查原料供应链，拒绝任何有害添加。" },
                { title: "售后无忧", desc: "品牌直供，7天无理由退换，全方位养宠指导。" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-orange-500 mb-4 font-black text-4xl">0{i+1}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 热门品类展示区 */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">热门品类</h2>
              <p className="text-gray-500 mt-2">为您和您的爱宠精心挑选</p>
            </div>
            <a href="#" className="text-orange-500 font-semibold hover:underline">查看全部 &rarr;</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['猫粮/狗粮', '智能设备', '宠物家居', '清洁健康'].map((cat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-md transition cursor-pointer group border border-transparent hover:border-orange-200">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-100 transition shadow-sm">
                  <span className="text-2xl">🐾</span>
                </div>
                <h3 className="font-bold text-gray-800">{cat}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 优选商品列表 */}
        <section id="products" className="py-20 bg-white max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">本周优选好物</h2>
              <p className="text-gray-500">每一次挑选，我们都为您考虑更多</p>
            </div>
            
            {/* 简单的分类过滤逻辑 (模拟) */}
            <div className="flex flex-wrap justify-center gap-2">
              {['全部', '智能用品', '猫咪专区', '宠物家居', '户外出行'].map((cat) => (
                <button key={cat} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${cat === '全部' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <button className="bg-white border-2 border-gray-900 text-gray-900 px-10 py-4 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all">
              加载更多商品
            </button>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-16 px-6 mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <p className="text-3xl font-black text-orange-500 mb-6 italic tracking-tighter">TailWag</p>
            <p className="text-gray-400 max-w-xs mb-6">
              专业的宠物用品优选平台，致力于为全球养宠人士提供值得信赖的购物体验。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">快速链接</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-500">关于我们</a></li>
              <li><a href="/selection-process" className="hover:text-orange-500">选品流程</a></li>
              <li><a href="/brand-recruitment" className="hover:text-orange-500 font-bold text-orange-400">品牌入驻招募</a></li>
              <li><a href="#" className="hover:text-orange-500">配送政策</a></li>
              <li><a href="#" className="hover:text-orange-500">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">关注我们</h4>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition">📱</div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition">📸</div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-sm">
          © 2026 TailWag (摇尾精选). 保留所有权利。让每一次摇尾都值得。
        </div>
      </footer>

      {/* 移动端底部导航 */}
      <MobileNav />
    </div>
  );
}
�得。
        </div>
      </footer>
    </div>
  );
}

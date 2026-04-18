import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import MobileNav from '../components/MobileNav';
import products from '../data/products.json';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-cream pb-20 md:pb-0 font-sans">
      <Navbar />

      <main>
        <Hero />

        {/* 优选选品标准 (高级重构) */}
        <section className="py-32 px-10 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-24 space-y-8 lg:space-y-0">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-black text-brand-charcoal mb-8 tracking-tighter leading-none">
                  为什么选择 <br/><span className="title-serif text-brand-orange">TailWag 摇尾精选？</span>
                </h2>
                <p className="text-xl text-brand-stone font-medium leading-relaxed">
                  我们不只是在销售产品，我们是在为一种更美好的生命伙伴关系制定新的基准。
                </p>
              </div>
              <div className="pb-2">
                <a href="/selection-process" className="text-brand-charcoal font-black border-b-2 border-brand-orange pb-1 hover:text-brand-orange transition-colors">深入了解我们的 12 项选品标准 &rarr;</a>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "专业级测评体系", desc: "每一件商品都由 50+ 位专业兽医与养宠行为专家深度实测，拒绝纸上谈兵。" },
                { title: "纯净材质追踪", desc: "全球溯源，严格审查原料供应链。每一份猫粮、每一件玩具都拥有完整的成分透明度。" },
                { title: "全时段尊享售后", desc: "品牌直供渠道，72小时内极速响应。我们不仅提供产品，更提供全生命周期的养宠咨询。" }
              ].map((item, i) => (
                <div key={i} className="group p-10 rounded-[3rem] border border-stone-100 hover:border-brand-orange transition-all duration-700 hover:bg-brand-warm relative overflow-hidden">
                  <div className="text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors absolute -top-4 -right-4 font-black text-[120px] leading-none select-none">0{i+1}</div>
                  <h3 className="text-2xl font-black mb-6 text-brand-charcoal relative z-10">{item.title}</h3>
                  <p className="text-brand-stone leading-loose font-medium relative z-10">{item.desc}</p>
                  <div className="mt-10 h-1 w-0 bg-brand-orange group-hover:w-full transition-all duration-700"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 热门品类 (极简平铺) */}
        <section className="py-32 bg-brand-cream max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 space-y-8 md:space-y-0 text-center md:text-left">
            <div>
              <h2 className="text-5xl font-black text-brand-charcoal tracking-tighter">探索核心领域</h2>
              <p className="text-lg text-brand-stone mt-4 font-medium">为您和您的爱宠，定义未来生活方式</p>
            </div>
            <a href="#" className="bg-brand-charcoal text-white px-10 py-5 rounded-full font-bold hover:bg-brand-orange transition-all">浏览全站目录</a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { name: '科学食补', tag: 'Nutrition', icon: '🦴' },
              { name: '智能栖所', tag: 'Smart Living', icon: '🤖' },
              { name: '美学家居', tag: 'Aesthetics', icon: '🏠' },
              { name: '健康护理', tag: 'Wellness', icon: '🩺' }
            ].map((cat, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] p-12 text-center hover:shadow-glass transition-all duration-500 cursor-pointer group border border-stone-50 hover:-translate-y-2">
                <div className="w-24 h-24 bg-brand-warm rounded-full mx-auto mb-8 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors shadow-sm text-4xl">
                  {cat.icon}
                </div>
                <div className="text-[10px] font-black text-brand-orange mb-2 uppercase tracking-[0.3em]">{cat.tag}</div>
                <h3 className="text-2xl font-black text-brand-charcoal">{cat.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 优选商品列表 (杂志化排版) */}
        <section id="products" className="py-32 bg-white px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-baseline mb-24 border-b border-stone-100 pb-12 space-y-8 lg:space-y-0">
              <div>
                <h2 className="text-6xl font-black text-brand-charcoal mb-4 tracking-tighter">本周甄选</h2>
                <p className="text-xl text-brand-stone font-medium italic">每一件，都承载着对生命的敬畏与深思。</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {['全部', '智能用品', '猫咪专区', '宠物家居', '户外出行'].map((cat) => (
                  <button key={cat} className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${cat === '全部' ? 'bg-brand-charcoal text-white shadow-xl' : 'bg-brand-warm text-brand-stone hover:bg-brand-orange/10 hover:text-brand-orange'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-32 text-center">
              <button className="group inline-flex items-center space-x-4 bg-transparent border-2 border-brand-charcoal text-brand-charcoal px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-charcoal hover:text-white transition-all duration-500">
                <span>加载更多精选作品</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 高级页脚 */}
      <footer className="bg-brand-charcoal text-white pt-32 pb-16 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
            <div className="lg:col-span-5">
              <p className="text-5xl font-black text-brand-orange mb-10 italic tracking-tighter">TailWag</p>
              <p className="text-stone-400 text-lg font-medium max-w-md leading-loose mb-10">
                TailWag 为极少数懂生活的养宠家庭提供支持。致力于将卓越的设计、尖端的科技与深沉的人文关怀注入每一个养宠瞬间。
              </p>
              <div className="flex space-x-6">
                <div className="w-14 h-14 border border-stone-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-orange hover:border-brand-orange transition-all duration-500 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
                </div>
                <div className="w-14 h-14 border border-stone-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-orange hover:border-brand-orange transition-all duration-500 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">📸</span>
                </div>
                <div className="w-14 h-14 border border-stone-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-orange hover:border-brand-orange transition-all duration-500 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🐦</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-10">作品展示</h4>
              <ul className="space-y-6 text-stone-400 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition-colors">所有作品</a></li>
                <li><a href="#" className="hover:text-white transition-colors">智能设备</a></li>
                <li><a href="#" className="hover:text-white transition-colors">家居美学</a></li>
                <li><a href="#" className="hover:text-white transition-colors">健康护理</a></li>
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-10">关于我们</h4>
              <ul className="space-y-6 text-stone-400 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition-colors">品牌哲学</a></li>
                <li><a href="/selection-process" className="hover:text-white transition-colors">选品标准</a></li>
                <li><a href="/brand-recruitment" className="hover:text-white transition-colors text-white border-b border-brand-orange pb-1">品牌入驻</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
            
            <div className="lg:col-span-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-10">订阅时讯</h4>
              <p className="text-stone-400 text-sm mb-6">获取最新的选品动态与养宠美学趋势。</p>
              <div className="relative">
                <input type="email" placeholder="Email Address" className="w-full bg-stone-900 border-none py-5 px-6 rounded-2xl text-white focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-stone-700" />
                <button className="absolute right-2 top-2 bottom-2 bg-brand-orange text-white px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-brand-orange transition-all">Join</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-stone-900 pt-16 flex flex-col md:flex-row justify-between items-center text-stone-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>© 2026 TailWag (摇尾精选). ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-10 mt-8 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <MobileNav />
    </div>

      {/* 移动端底部导航 */}
      <MobileNav />
    </div>
  );
}

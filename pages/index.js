import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import MobileNav from '../components/MobileNav';
import products from '../data/products.json';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-cream pb-20 md:pb-0 font-sans selection:bg-brand-orange selection:text-white">
      <Navbar />

      <main>
        <Hero />

        {/* Brand Philosophy - Luxury Section */}
        <section className="py-32 px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-6 block">Our Philosophy</span>
                <h2 className="text-5xl md:text-7xl font-black text-brand-charcoal mb-10 tracking-tighter leading-none">
                  不只是工具，<br/>更是对<span className="title-serif text-brand-orange">生命</span>的礼赞。
                </h2>
                <p className="text-xl text-brand-stone font-medium leading-relaxed mb-12 max-w-lg">
                  TailWag 存在的意义，是为那些将宠物视为家人的少数派，提供具有艺术美感与尖端科技的生存装备。
                </p>
                <div className="flex space-x-8">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-brand-charcoal mb-1">50+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-stone">合作专家</span>
                  </div>
                  <div className="flex flex-col border-l border-stone-100 pl-8">
                    <span className="text-3xl font-black text-brand-charcoal mb-1">12层</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-stone">筛选工序</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-brand-warm relative group">
                    <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-8 bg-brand-warm rounded-3xl">
                    <h3 className="font-bold mb-2">专业级测评</h3>
                    <p className="text-xs text-brand-stone">每一件商品都经过临床级测试。</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-8 bg-brand-orange/5 rounded-3xl border border-brand-orange/10">
                    <h3 className="font-bold mb-2 text-brand-orange">产地溯源</h3>
                    <p className="text-xs text-orange-900/60">全球透明供应链，每一口都安心。</p>
                  </div>
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-brand-warm relative group">
                    <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Selection */}
        <section id="products" className="py-40 bg-brand-cream px-10 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-24 space-y-8 lg:space-y-0 relative">
              <div className="relative">
                <div className="absolute -top-12 -left-12 text-[120px] font-black text-brand-orange/5 select-none leading-none tracking-tighter">FEATURED</div>
                <h2 className="text-6xl md:text-8xl font-black text-brand-charcoal tracking-tighter relative z-10">
                  本周<span className="text-brand-orange italic">甄选</span>
                </h2>
                <div className="h-1 w-40 bg-brand-orange mt-6"></div>
              </div>
              
              <div className="flex flex-wrap gap-4 z-10">
                {['全部', '智能用品', '极地冻干', '宠物家居', '户外出行'].map((cat) => (
                  <button key={cat} className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${cat === '全部' ? 'bg-brand-charcoal text-white shadow-premium' : 'bg-white text-brand-stone hover:bg-brand-orange hover:text-white hover:shadow-xl hover:-translate-y-1'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-40 text-center">
              <button className="group relative inline-flex items-center justify-center px-16 py-8 overflow-hidden font-black text-xs uppercase tracking-[0.3em] transition duration-300 ease-out border-2 border-brand-charcoal rounded-full shadow-md">
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-brand-charcoal group-hover:translate-x-0 ease">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-brand-charcoal transition-all duration-300 transform group-hover:translate-x-full ease tracking-[0.4em]">更多探索</span>
                <span className="relative invisible">更多探索</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-charcoal text-white pt-40 pb-20 px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-24 mb-40">
            <div className="lg:col-span-5">
              <p className="text-6xl font-black text-brand-orange mb-12 italic tracking-tighter">TailWag</p>
              <h4 className="text-xl font-bold mb-8 text-stone-200">致力于重新定义宠物的生活艺术。</h4>
              <p className="text-stone-500 text-lg leading-loose max-w-md mb-12 font-medium">
                每一个细节的考究，都是对生命尊严的致敬。加入我们的全球美学养宠社区。
              </p>
              <div className="flex space-x-8">
                {['📱', '📸', '🐦'].map((icon, i) => (
                  <div key={i} className="w-16 h-16 rounded-2xl border border-stone-800 flex items-center justify-center cursor-pointer hover:bg-brand-orange hover:border-brand-orange hover:-translate-y-2 transition-all duration-500">
                    <span className="text-2xl">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-10">探索</h5>
                <ul className="space-y-6 text-stone-400 font-bold text-sm uppercase tracking-widest">
                  <li><a href="#" className="hover:text-white transition-colors">最新作品</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">智能硬件</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">极地营养</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-10">服务</h5>
                <ul className="space-y-6 text-stone-400 font-bold text-sm uppercase tracking-widest">
                  <li><a href="#" className="hover:text-white transition-colors">选品专栏</a></li>
                  <li><a href="/brand-recruitment" className="hover:text-brand-orange">品牌入驻</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">全球配送</a></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-10">新闻订阅</h5>
                <p className="text-stone-500 text-sm mb-8 font-medium">获取独家选品内幕与会员限时礼遇。</p>
                <div className="relative">
                  <input type="email" placeholder="YOUR EMAIL" className="w-full bg-stone-900/50 border-b border-stone-800 py-6 px-0 text-white focus:border-brand-orange focus:ring-0 transition-all placeholder:text-stone-700 font-black text-xs tracking-widest" />
                  <button className="absolute right-0 bottom-6 text-brand-orange font-black text-xs uppercase tracking-widest hover:text-white transition-colors">JOIN &rarr;</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-stone-600">
            <p>© 2026 TAILWAG SELECTION. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-12 mt-8 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <MobileNav />
    </div>
  );
}

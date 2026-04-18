import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-brand-cream pt-24 pb-32 px-10 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-stone-200 rounded-full blur-[80px] opacity-30"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative">
        <div className="lg:w-1/2 text-center lg:text-left z-10 mb-16 lg:mb-0">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-stone-100 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-ping"></span>
            <span className="text-xs font-bold text-brand-stone uppercase tracking-tighter">全球严选 2026 夏季新品已上线</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-brand-charcoal leading-[0.9] mb-8 tracking-tighter">
            每一次摇尾，<br />
            <span className="title-serif text-brand-orange">都是至高赞赏。</span>
          </h1>
          <p className="text-xl text-brand-stone mb-10 max-w-lg leading-relaxed font-medium">
            TailWag 为极少数懂生活的养宠家庭提供支持。我们走遍全球，严选每一件具有革新精神与高尚质感的宠物良品。
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center lg:justify-start">
            <button className="bg-brand-charcoal text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-orange shadow-2xl transition-all hover:scale-105 duration-300">
              探索精选好物
            </button>
            <button className="bg-transparent text-brand-charcoal border-2 border-stone-200 px-10 py-5 rounded-full font-bold text-lg hover:border-brand-charcoal hover:bg-white transition-all duration-300">
              选品标准 →
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-stone-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=90" 
              alt="Premium pet products selection" 
              className="relative rounded-[2rem] shadow-glass z-10 object-cover w-full h-[600px]"
            />
            {/* Overlay tag */}
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl z-20 max-w-[200px] border border-white/50">
              <p className="text-brand-orange text-xs font-black uppercase tracking-widest mb-2">Editor's Choice</p>
              <p className="text-brand-charcoal text-sm font-bold leading-snug">“不仅仅是工具，更是对生命的尊重。”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

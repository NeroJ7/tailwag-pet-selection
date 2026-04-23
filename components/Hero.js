import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-brand-cream pt-48 pb-40 px-6 md:px-12 overflow-hidden">
      {/* Abstract Design Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-white skew-x-12 translate-x-1/4 -z-0"></div>
      <div className="absolute top-40 right-40 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-md border border-stone-100 px-6 py-3 rounded-full mb-12 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-ping"></span>
            <span className="text-[10px] font-black text-brand-stone uppercase tracking-[0.4em]">Summer Selection 2026</span>
          </div>
          
          <h1 className="text-6xl md:text-[100px] font-black text-brand-charcoal leading-[0.85] mb-12 tracking-tighter">
            每一次摇尾，<br />
            <span className="title-serif text-brand-orange">皆是礼赞。</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-stone mb-16 max-w-xl leading-relaxed font-medium">
            TailWag (摇尾精选) 专为追求生活艺术的少数派而生。我们跨越国界，为您严选每一件具有革新精神与高尚质感的宠物生活作品。
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8">
            <a href="#products" className="bg-brand-charcoal text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange hover:shadow-2xl hover:shadow-orange-200 transition-all duration-500 hover:-translate-y-2 active:scale-95 text-center">
              立即探索甄选
            </a>
            <a href="/selection-process" className="bg-white text-brand-charcoal border-2 border-stone-100 px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:border-brand-charcoal transition-all duration-500 hover:-translate-y-2 active:scale-95 text-center">
              选品哲学 &rarr;
            </a>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative">
          <div className="relative">
            {/* Animated Ring */}
            <div className="absolute -inset-10 border border-brand-orange/20 rounded-full animate-[spin_20s_linear_infinite] -z-10"></div>
            
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-premium group relative">
              <img 
                src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=90" 
                alt="Premium pet products curation" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 to-transparent"></div>
              
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Special Curation</span>
                    <h4 className="text-lg font-black text-brand-charcoal mt-1">极地冻干系列</h4>
                  </div>
                  <span className="text-2xl">❄️</span>
                </div>
                <p className="text-xs text-brand-stone font-medium italic leading-relaxed">
                  “选自零下40度的极地牧场，每一块都是对自然与生命的最高敬意。”
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

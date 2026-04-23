import React from 'react';
import Navbar from '../components/Navbar';

const SelectionProcess = () => {
  const steps = [
    {
      title: "VOC 深度审计",
      desc: "扫描全球数万条真实用户评价，精准捕捉‘碎末多’、‘难清理’、‘支架不稳’等痛点，倒逼工厂进行工艺改进。",
      icon: "🔍"
    },
    {
      title: "材质健康溯源",
      desc: "所有实木必须达到 FAS 级，陶瓷需经过 1300 度高温烧制。我们拒绝任何会危害宠物健康的廉价平替。",
      icon: "🪵"
    },
    {
      title: "实地深度测评",
      desc: "由 50+ 位专业养宠博主 and 资深兽医组成的“摇尾评审团”进行为期 30 天的深度试用，拒绝任何实验室外的空谈。",
      icon: "🐾"
    },
    {
      title: "全链路透明仓储",
      desc: "从 1688 源头工厂到国际转运中心，再到您家门口。每一个节点均可实时追踪，拒绝供应链暗箱操作。",
      icon: "🛰️"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <main>
        {/* Header Section */}
        <section className="bg-white py-32 px-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-stone-200"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-block px-4 py-2 bg-brand-warm rounded-full text-[10px] font-black uppercase tracking-widest text-brand-orange mb-10">THE TAILWAG STANDARD</div>
            <h1 className="text-6xl md:text-8xl font-black text-brand-charcoal mb-10 tracking-tighter leading-none">
              我们如何定义<br/><span className="title-serif text-brand-orange">“全球优选”？</span>
            </h1>
            <p className="text-xl text-brand-stone leading-loose font-medium max-w-2xl mx-auto">
              在 TailWag，我们不只是在销售。我们是在为您和您的爱宠筛选一份跨越时间与空间的安心感。
              每一件入选的作品，都必须经过生命尊严的终极考验。
            </p>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
        </section>

        {/* Process Steps */}
        <section className="py-32 max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
            {steps.map((step, index) => (
              <div key={index} className="relative group p-8 bg-white rounded-[3rem] shadow-sm hover:shadow-premium transition-all duration-700 hover:-translate-y-2 border border-stone-50">
                <div className="text-7xl mb-10 group-hover:rotate-12 transition-transform duration-500">
                  {step.icon}
                </div>
                <div className="absolute top-8 right-8 text-stone-100 text-6xl font-black group-hover:text-brand-orange/10 transition-colors">
                  0{index + 1}
                </div>
                <h3 className="text-2xl font-black text-brand-charcoal mb-6 tracking-tight">{step.title}</h3>
                <p className="text-brand-stone leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Standard Details */}
        <section className="bg-brand-charcoal text-white py-32 px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 -skew-x-12 transform translate-x-1/2"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-5xl font-black mb-20 text-center tracking-tighter">
              我们的 <span className="title-serif text-brand-orange italic">拒绝原则</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              {[
                "拒绝成分不明的廉价宠粮",
                "拒绝存在安全隐患的劣质玩具",
                "拒绝虚假宣传的功能性装备",
                "拒绝无法提供完整售后保障的供应商",
                "拒绝任何可能引起宠物不适的设计缺陷"
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-6 bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 hover:border-brand-orange/50 transition-colors group">
                  <div className="h-10 w-10 flex-shrink-0 bg-brand-orange/20 rounded-full flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold tracking-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-40 text-center px-10 bg-brand-cream">
          <div className="max-w-3xl mx-auto bg-white p-20 rounded-[4rem] shadow-premium border border-stone-50">
            <h2 className="text-5xl font-black mb-10 tracking-tighter">准备好让毛孩子<br/><span className="text-brand-orange title-serif">兴奋到摇尾巴了吗？</span></h2>
            <a href="/" className="inline-block bg-brand-charcoal text-white px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-orange shadow-2xl transition-all hover:scale-105 duration-300">
              立即探索甄选作品 &rarr;
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-brand-charcoal text-white border-t border-white/5 py-12 text-center text-stone-500 text-[10px] font-black uppercase tracking-[0.2em]">
        © 2026 TailWag (摇尾精选). THE ART OF PET CARE.
      </footer>
    </div>
  );
};

export default SelectionProcess;

import React from 'react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

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

  const auditData = [
    { label: "VOC 覆盖品牌", value: "1,200+", trend: "↑ 12%" },
    { label: "原材料通过率", value: "8.4%", trend: "↓ 2%" },
    { label: "实地验厂次数", value: "450+", trend: "↑ 25%" },
    { label: "平均淘汰率", value: "92%", trend: "保持稳定" }
  ];

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-orange selection:text-white pb-20 md:pb-0">
      <Navbar />
      
      <main>
        {/* Header Section */}
        <section className="bg-white py-48 px-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-stone-200"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-block px-6 py-3 bg-brand-warm rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-12 shadow-sm">The TailWag Protocol</div>
            <h1 className="text-6xl md:text-[100px] font-black text-brand-charcoal mb-12 tracking-tighter leading-[0.85]">
              我们如何定义<br/><span className="title-serif text-brand-orange">“全球优选”？</span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-stone leading-loose font-medium max-w-2xl mx-auto mb-16">
              在 TailWag，我们不只是在销售。我们是在为您和您的爱宠筛选一份跨越时间与空间的安心感。
            </p>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-50 rounded-full blur-[120px] opacity-50"></div>
        </section>

        {/* Audit Metrics - Hardcore Data Section */}
        <section className="py-24 bg-brand-charcoal overflow-hidden">
          <div className="max-w-7xl mx-auto px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {auditData.map((data, i) => (
                <div key={i} className="p-10 border border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md">
                  <div className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em] mb-4">{data.label}</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{data.value}</div>
                  <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{data.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-48 max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group p-12 bg-white rounded-[4rem] shadow-premium hover:-translate-y-4 transition-all duration-700 border border-stone-50 overflow-hidden">
                <div className="text-8xl mb-12 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative z-10">
                  {step.icon}
                </div>
                <div className="absolute top-12 right-12 text-stone-50 text-[120px] font-black leading-none select-none group-hover:text-brand-orange/5 transition-colors">
                  0{index + 1}
                </div>
                <h3 className="text-2xl font-black text-brand-charcoal mb-6 tracking-tight relative z-10">{step.title}</h3>
                <p className="text-brand-stone leading-loose font-medium text-sm relative z-10">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* VOC Intelligence Section */}
        <section className="py-48 bg-white px-10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-square bg-brand-warm rounded-[5rem] overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&w=1200&q=80" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" 
                  alt="Data Analysis"
                />
                <div className="absolute inset-0 bg-brand-orange/20 mix-blend-multiply opacity-30"></div>
                
                {/* Float Card */}
                <div className="absolute bottom-12 left-12 right-12 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50">
                  <h4 className="text-lg font-black text-brand-charcoal mb-4 italic">实时情感监测网 (Sentiment Map)</h4>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-orange w-[85%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-stone">
                      <span>Positive Emotion</span>
                      <span>85.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-8 block">Intelligence System</span>
              <h2 className="text-5xl md:text-7xl font-black text-brand-charcoal mb-10 tracking-tighter leading-tight">
                数据驱动的<br/><span className="title-serif text-brand-orange">终极淘汰制。</span>
              </h2>
              <p className="text-lg text-brand-stone leading-loose font-medium mb-12">
                我们建立了一套名为「TailEye」的 VOC (Voice of Customer) 实时监控系统。它能够每秒分析来自全球各大电商平台的 50,000+ 条反馈。
              </p>
              <ul className="space-y-8">
                {[
                  { t: "12层多维度剔除", d: "任何在 3 个月内 VOC 满意度低于 90% 的单品，将被永久移出 TailWag 精选清单。" },
                  { t: "供应链反向压测", d: "通过数据分析倒逼源头工厂进行 0.1mm 级别的工艺优化，从根源上消灭差评点。" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-6">
                    <div className="h-8 w-8 rounded-xl bg-brand-charcoal flex items-center justify-center text-white text-xs mt-1">✓</div>
                    <div>
                      <h5 className="font-black text-brand-charcoal mb-2 tracking-tight">{item.t}</h5>
                      <p className="text-sm text-brand-stone leading-relaxed font-medium">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Rejection Principles */}
        <section className="bg-brand-charcoal text-white py-48 px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 transform translate-x-1/2"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-6xl font-black mb-24 text-center tracking-tighter leading-none">
              我们的 <span className="title-serif text-brand-orange italic underline decoration-1 underline-offset-8">拒绝原则</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "拒绝成分不明的廉价宠粮 (No Mystery Ingredients)",
                "拒绝存在安全隐患的劣质玩具 (Zero Safety Compromise)",
                "拒绝虚假宣传的功能性装备 (Science Over Hype)",
                "拒绝无法提供完整售后保障的供应商 (Full Accountability)",
                "拒绝任何可能引起宠物不适的设计缺陷 (Pet-First Design)"
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-8 bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 hover:border-brand-orange hover:bg-white/10 transition-all group cursor-default">
                  <div className="h-12 w-12 flex-shrink-0 bg-brand-orange/20 rounded-2xl flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-lg font-black tracking-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-60 text-center px-10 bg-brand-cream relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-white -rotate-6 -z-10"></div>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black mb-16 tracking-tighter leading-[0.85]">
              准备好让毛孩子<br/><span className="text-brand-orange title-serif italic">兴奋到摇尾巴了吗？</span>
            </h2>
            <a href="/#products" className="inline-block bg-brand-charcoal text-white px-16 py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange shadow-premium hover:-translate-y-2 transition-all duration-500">
              立即探索甄选作品 — Begin Journey &rarr;
            </a>
          </div>
        </section>
      </main>

      <footer className="py-20 text-center bg-brand-charcoal border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600">
          © 2026 TAILWAG SELECTION. THE ART OF CURATION.
        </p>
      </footer>

      <MobileNav />
    </div>
  );
};

export default SelectionProcess;

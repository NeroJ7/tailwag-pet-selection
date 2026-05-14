import React from 'react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

const BrandRecruitment = () => {
  const criteria = [
    {
      title: "品质极致",
      desc: "产品必须符合国际安全标准（如FDA, CE, RoHS），并愿意接受 TailWag 的第三方实验室抽检。",
      icon: "🏆"
    },
    {
      title: "设计驱动",
      desc: "我们偏好具有独特设计语言、能够提升现代家居美感、或在宠物行为学上有创新的产品。",
      icon: "🎨"
    },
    {
      title: "价值观一致",
      desc: "品牌方需承诺不添加任何争议性成分，注重环保可持续发展，并能提供完整的售后保障体系。",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-orange selection:text-white pb-20 md:pb-0">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1920&q=80" 
              className="w-full h-full object-cover brightness-[0.6]" 
              alt="Partnership" 
            />
            <div className="absolute inset-0 bg-brand-charcoal/30"></div>
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-brand-orange mb-8 block">Partner With Us</span>
            <h1 className="text-5xl md:text-[100px] font-black text-white mb-10 tracking-tighter leading-[0.85]">
              寻找下一个 <span className="title-serif text-brand-orange italic">“优选”</span> 品牌
            </h1>
            <p className="text-xl text-white/80 font-medium leading-loose">
              TailWag (摇尾精选) 诚邀全球优质宠物品牌加入我们的行列。在这里，我们不只是在销售产品，更是在共同建立一种高品质的养宠生活方式。
            </p>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-40 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-6 block">Why TailWag?</span>
              <h2 className="text-5xl md:text-6xl font-black text-brand-charcoal mb-10 tracking-tighter leading-tight">
                为什么选择与<br />
                <span className="title-serif text-brand-orange">TailWag</span> 合作？
              </h2>
              <div className="space-y-12 mt-16">
                {[
                  { q: "精准客群", a: "直达全球数百万追求品质生活的“新一代”养宠家庭。我们的用户不只是购买者，更是生活方式的信徒。" },
                  { q: "品牌溢价", a: "入驻 TailWag 意味着您的产品已通过最严苛的行业筛选标准。我们为品牌提供稀缺的背书价值。" },
                  { q: "内容赋能", a: "我们的专业团队将为入驻品牌制作深度测评及多维度传播内容，讲好每一个品牌背后的故事。" }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-8">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-orange font-black text-xl">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-brand-charcoal mb-3">{item.q}</h4>
                      <p className="text-brand-stone text-sm leading-loose font-medium">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-[4rem] p-16 shadow-premium border border-stone-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-2xl font-black text-brand-charcoal mb-12 tracking-tight italic">入驻准则 (Protocol)</h3>
              <div className="space-y-12">
                {criteria.map((item, index) => (
                  <div key={index} className="flex items-start space-x-8">
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <h4 className="text-lg font-black text-brand-charcoal mb-2 uppercase tracking-wide">{item.title}</h4>
                      <p className="text-brand-stone text-xs leading-loose font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="bg-brand-charcoal py-40 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black text-white mb-8 tracking-tighter">提交合作<span className="title-serif text-brand-orange">意向</span></h2>
              <p className="text-stone-400 font-medium">请填写基础信息，我们的选品委员会将在 3 个工作日内进行初步审核。</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('申请已提交，请等待委员会审核。'); }} className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">品牌名称 / Brand Name</label>
                  <input required type="text" className="w-full bg-white/5 border-b border-white/20 py-4 px-0 text-white focus:border-brand-orange focus:ring-0 transition-all placeholder:text-stone-700 font-black text-sm" placeholder="NAME" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">主营品类 / Category</label>
                  <select className="w-full bg-transparent border-b border-white/20 py-4 px-0 text-stone-400 focus:border-brand-orange focus:ring-0 transition-all font-black text-sm uppercase">
                    <option>智能硬件</option>
                    <option>极地冻干</option>
                    <option>宠物家居</option>
                    <option>户外出行</option>
                    <option>其他创新</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">联系邮箱 / Email</label>
                  <input required type="email" className="w-full bg-white/5 border-b border-white/20 py-4 px-0 text-white focus:border-brand-orange focus:ring-0 transition-all placeholder:text-stone-700 font-black text-sm" placeholder="EMAIL" />
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">品牌亮点 / Brand Values</label>
                  <textarea required className="w-full bg-white/5 border-b border-white/20 py-4 px-0 text-white focus:border-brand-orange focus:ring-0 transition-all placeholder:text-stone-700 font-black text-sm h-[208px] resize-none" placeholder="DESCRIBE YOUR INNOVATION..."></textarea>
                </div>
              </div>
              
              <div className="md:col-span-2 pt-12">
                <button type="submit" className="w-full bg-brand-orange text-white py-10 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-brand-charcoal transition-all shadow-xl">
                  提交申请 — Send Request &rarr;
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="py-20 text-center bg-brand-cream border-t border-stone-100">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-stone">
          TailWag Curation Committee: <a href="mailto:brands@tailwag.com" className="text-brand-orange hover:underline ml-2">brands@tailwag.com</a>
        </p>
      </footer>

      <MobileNav />
    </div>
  );
};

export default BrandRecruitment;

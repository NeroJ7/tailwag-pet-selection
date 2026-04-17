import React from 'react';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1920&q=80" 
              className="w-full h-full object-cover brightness-[0.4]" 
              alt="Partnership" 
            />
          </div>
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              寻找下一个 <span className="text-orange-500 italic">“优选”</span> 品牌
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              TailWag (摇尾精选) 诚邀全球优质宠物品牌加入我们的行列。
              在这里，我们不只是在销售产品，更是在共同建立一种高品质的养宠生活方式。
            </p>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">
                为什么选择与 <br />
                <span className="text-orange-500">TailWag</span> 合作？
              </h2>
              <ul className="space-y-6">
                {[
                  { q: "精准客群", a: "直达全球数百万追求品质生活的“新一代”养宠家庭。" },
                  { q: "品牌溢价", a: "入驻 TailWag 意味着您的产品已通过最严苛的行业筛选标准。" },
                  { q: "内容赋能", a: "我们的专业团队将为入驻品牌制作深度测评及多维度传播内容。" }
                ].map((item, i) => (
                  <li key={i} className="flex space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.q}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.a}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-inner">
              <h3 className="text-2xl font-bold mb-6">入驻标准</h3>
              <div className="space-y-8">
                {criteria.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Mockup */}
        <section className="bg-orange-50 py-24 px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-4">立即提交合作意向</h2>
                <p className="text-gray-400">请填写基础信息，我们的选品团队将在 3 个工作日内回复您</p>
              </div>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">品牌名称</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition" placeholder="例如: TailWag" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">所属国家/地区</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition" placeholder="例如: 中国" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">主营品类</label>
                  <select className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition">
                    <option>智能用品</option>
                    <option>食品/零食</option>
                    <option>宠物家居</option>
                    <option>洗护/清洁</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">联系人姓名及电话</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition" placeholder="请输入您的联系方式" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">品牌简介 / 产品亮点</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition h-32" placeholder="请简要介绍您的品牌及核心竞争力..."></textarea>
                </div>
                <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-500 shadow-lg transition-all">
                  提交申请
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-gray-400 text-sm">
        TailWag 选品团队联系方式: <span className="text-orange-500 underline font-bold">brands@tailwag.com</span>
      </footer>
    </div>
  );
};

export default BrandRecruitment;

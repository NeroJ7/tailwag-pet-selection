import React from 'react';
import Navbar from '../components/Navbar';

const SelectionProcess = () => {
  const steps = [
    {
      title: "全球溯源",
      desc: "我们的买手团队走遍全球，与顶级供应链直接合作，确保每一件产品都有迹可循。",
      icon: "🌍"
    },
    {
      title: "实验室测评",
      desc: "每一款入库产品都必须经过内部实验室的耐用性测试、安全成分分析和宠物行为适应性测试。",
      icon: "🔬"
    },
    {
      title: "实地试用",
      desc: "由 50+ 位专业养宠博主和资深兽医组成的“摇尾评审团”进行为期 30 天的深度试用。",
      icon: "🐾"
    },
    {
      title: "严苛淘汰",
      desc: "在初选中，只有评分前 10% 的商品才能进入 TailWag 最终优选清单。",
      icon: "🚫"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Header Section */}
        <section className="bg-orange-50 py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">我们如何定义“优选”？</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              在 TailWag，我们不只是在卖商品，我们是在为您和您的爱宠筛选一份安心。
              我们相信，只有通过最严苛考验的产品，才配得上毛孩子们的每一次摇尾。
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-4 -left-4 text-gray-100 text-8xl font-black -z-10">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Standard Details */}
        <section className="bg-gray-900 text-white py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-orange-500">我们的五大拒绝原则</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "拒绝成分不明的廉价宠粮",
                "拒绝存在安全隐患的劣质玩具",
                "拒绝虚假宣传的功能性装备",
                "拒绝无法提供完整售后保障的供应商",
                "拒绝任何可能引起宠物不适的设计缺陷"
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-4 bg-gray-800 p-6 rounded-xl">
                  <span className="text-red-500 text-2xl">✕</span>
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-8">准备好让您的毛孩子开心了吗？</h2>
          <button className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 shadow-xl transition-all">
            前往选购优选好物
          </button>
        </section>
      </main>

      <footer className="bg-white border-t py-12 text-center text-gray-400 text-sm">
        © 2026 TailWag (摇尾精选). 严苛选品，只为那一次摇尾。
      </footer>
    </div>
  );
};

export default SelectionProcess;

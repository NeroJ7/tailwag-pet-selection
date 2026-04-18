import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-orange-50 py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tighter">
            每一次摇尾，<br />
            <span className="text-orange-500 underline decoration-gray-200 underline-offset-8">都是对我们的信任。</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
            TailWag (摇尾精选) 走遍全球，为您严选每一件宠物好物。我们拒绝平庸，只选那些能让毛孩子兴奋到摇尾巴的精品。
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <button className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-600 shadow-lg transition">
              开始选购
            </button>
            <button className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition">
              了解选品标准
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          {/* 这里可以放一个可爱的宠物插画或照片 */}
          <div className="w-80 h-80 bg-orange-200 rounded-full absolute -top-10 -right-10 opacity-50 blur-3xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Happy pets" 
            className="relative rounded-2xl shadow-2xl z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

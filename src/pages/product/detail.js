import React from 'react';
import Navbar from '../../components/Navbar';
import products from '../../data/products.json';

const ProductDetail = ({ productId }) => {
  // 模拟从数据中获取商品
  const product = products.find(p => p.id === productId) || products[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* 面包屑导航 */}
        <div className="text-sm text-gray-400 mb-8">
          首页 / {product.category} / <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-sm">
          {/* 左侧：图片展示 */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border-2 border-orange-500 cursor-pointer">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：商品信息 */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                {product.tag}
              </span>
              <h1 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-400 font-medium">{product.brand} 系列</p>
            </div>

            <div className="text-4xl font-black text-gray-900 mb-8">
              <span className="text-xl font-normal mr-1">¥</span>{product.price}
            </div>

            {/* 核心价值：为什么选择 */}
            <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <h3 className="flex items-center text-orange-700 font-bold mb-3">
                <span className="mr-2">✨</span> TailWag 优选理由
              </h3>
              <p className="text-orange-800 text-sm leading-relaxed font-medium">
                {product.selectionReason}
              </p>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* 规格 */}
            <div className="border-t border-gray-100 pt-8 mb-8">
              <h4 className="font-bold text-gray-900 mb-4">产品参数</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-400">{spec.label}</span>
                    <span className="text-gray-900 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-auto flex space-x-4">
              <button className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg">
                立即购买
              </button>
              <button className="flex-1 border-2 border-gray-900 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                加入购物车
              </button>
            </div>
          </div>
        </div>

        {/* 底部详细评测区 */}
        <section className="mt-12 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 pb-4 border-b">详细评测</h3>
              <div className="prose text-gray-600">
                <p className="mb-4">经过我们的实机测试，这款产品在细节处理上非常到位...</p>
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" className="rounded-xl mb-4" />
                <p>其核心优势在于其材质的耐用性和对宠物行为习惯的深度研究。</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">真实评价</h3>
              {product.reviews.length > 0 ? (
                product.reviews.map((rev, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-sm text-gray-900">{rev.user}</span>
                      <span className="text-orange-500">★★★★★</span>
                    </div>
                    <p className="text-gray-500 text-sm italic">“{rev.comment}”</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">暂无评价，快来抢首评吧！</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;

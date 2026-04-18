import React from 'react';
import Navbar from '../components/Navbar';
import products from '../data/products.json';

const CartPage = () => {
  // 模拟购物车中的前两项商品
  const cartItems = products.slice(0, 2).map(p => ({ ...p, quantity: 1 }));
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-8">您的购物车 ({cartItems.length})</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl flex items-center space-x-6 shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{item.brand}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border rounded-lg">
                      <button className="px-3 py-1 hover:bg-gray-50">-</button>
                      <span className="px-3 py-1 font-medium">{item.quantity}</span>
                      <button className="px-3 py-1 hover:bg-gray-50">+</button>
                    </div>
                    <div className="font-bold text-lg text-gray-900">¥{item.price}</div>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-red-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="bg-white p-20 rounded-2xl text-center shadow-sm border border-dashed border-gray-200">
                <p className="text-gray-400 mb-6">购物车还是空的呢...</p>
                <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold">去逛逛</button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">订单摘要</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>商品小计</span>
                  <span>¥{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>运费</span>
                  <span className="text-green-500">免费</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-black text-gray-900">
                  <span>总计</span>
                  <span>¥{subtotal}</span>
                </div>
              </div>
              <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transition-all mb-4">
                去结算
              </button>
              <p className="text-center text-xs text-gray-400 leading-relaxed">
                下单即视为同意我们的《服务条款》与《隐私政策》
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;

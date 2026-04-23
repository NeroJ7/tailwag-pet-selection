import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getCart, removeFromCart, placeOrder } from '../utils/cart-util';
import { useRouter } from 'next/router';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Checkout, 3: Success
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' });
  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
    const handleCartUpdate = () => setCart(getCart());
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const order = placeOrder(customer);
    if (order) {
      setCheckoutStep(3);
    }
  };

  if (checkoutStep === 3) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 pt-48 pb-32 text-center">
          <div className="bg-white p-20 rounded-[4rem] shadow-premium border border-stone-50">
            <div className="text-7xl mb-12">🎉</div>
            <h1 className="text-5xl font-black text-brand-charcoal mb-8 tracking-tighter">甄选订单已确认</h1>
            <p className="text-xl text-brand-stone leading-loose font-medium mb-12">
              感谢您的信任。我们的选品委员会已收到您的需求，正在为您从全球顶级供应链中进行最后的质检与分拣。
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => router.push('/')}
                className="bg-brand-charcoal text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange transition-all shadow-xl"
              >
                继续探索
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-white text-brand-charcoal border-2 border-stone-100 px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:border-brand-charcoal transition-all"
              >
                查看溯源状态
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
        <div className="mb-20">
          <h1 className="text-6xl font-black text-brand-charcoal tracking-tighter mb-4">甄选清单</h1>
          <div className="h-1 w-24 bg-brand-orange"></div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-premium border border-stone-50">
            <p className="text-2xl text-brand-stone font-medium mb-12 italic">“您的清单空空如也，生活需要一点摇尾巴的惊喜。”</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-brand-charcoal text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange transition-all shadow-xl"
            >
              去探索甄选作品
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-8 space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-stone-50 flex items-center group hover:shadow-premium transition-all duration-700">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 bg-brand-cream">
                    <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="ml-10 flex-grow">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2">{item.brand}</div>
                    <h3 className="text-xl font-black text-brand-charcoal tracking-tight">{item.name}</h3>
                    <div className="mt-4 flex items-center space-x-6">
                      <span className="text-lg font-black text-brand-charcoal">¥{item.price}</span>
                      <span className="text-xs font-medium text-brand-stone">数量: {item.quantity}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-4 text-brand-stone hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-brand-charcoal text-white p-12 rounded-[3rem] shadow-premium sticky top-40">
                <h3 className="text-2xl font-black mb-10 tracking-tight italic text-brand-orange">结算中心</h3>
                
                {checkoutStep === 1 ? (
                  <>
                    <div className="space-y-6 mb-12">
                      <div className="flex justify-between items-center py-4 border-b border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">商品总计</span>
                        <span className="text-lg font-black tracking-tighter">¥{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">甄选服务费</span>
                        <span className="text-lg font-black tracking-tighter">¥0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">应付总额</span>
                        <span className="text-3xl font-black tracking-tighter">¥{total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setCheckoutStep(2)}
                      className="w-full bg-brand-orange text-white py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-brand-charcoal transition-all shadow-xl"
                    >
                      确认并填写地址 &rarr;
                    </button>
                  </>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">收货人姓名</label>
                      <input 
                        required
                        type="text" 
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                        className="w-full bg-white/5 border-b border-white/20 py-4 px-0 text-white focus:border-brand-orange focus:ring-0 transition-all placeholder:text-white/20 font-black text-sm" 
                        placeholder="NAME"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">电子邮箱</label>
                      <input 
                        required
                        type="email" 
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                        className="w-full bg-white/5 border-b border-white/20 py-4 px-0 text-white focus:border-brand-orange focus:ring-0 transition-all placeholder:text-white/20 font-black text-sm" 
                        placeholder="EMAIL"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">配送地址</label>
                      <textarea 
                        required
                        value={customer.address}
                        onChange={(e) => setCustomer({...customer, address: e.target.value})}
                        className="w-full bg-white/5 border-b border-white/20 py-4 px-0 text-white focus:border-brand-orange focus:ring-0 transition-all placeholder:text-white/20 font-black text-sm h-24 resize-none" 
                        placeholder="ADDRESS"
                      ></textarea>
                    </div>
                    <div className="pt-6 flex space-x-4">
                      <button 
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="flex-1 border-2 border-white/20 text-white py-6 rounded-full font-black text-[10px] uppercase tracking-widest hover:border-white transition-all"
                      >
                        返回
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] bg-brand-orange text-white py-6 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-brand-charcoal transition-all"
                      >
                        确认下单 &rarr;
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;

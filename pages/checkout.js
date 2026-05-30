import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getCart, clearCart } from '../utils/cart-util';
import { fetchWithCsrf } from '../lib/csrf-client';
import { useRouter } from 'next/router';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' });
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'failed'
  const [showPayment, setShowPayment] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // 调用 API 创建订单到数据库
    try {
      const res = await fetchWithCsrf('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity || 1,
          })),
          shippingAddress: customer,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '创建订单失败');
      }

      const newOrder = await res.json();
      
      // 保存到 localStorage（兼容 dashboard.js 的读取）
      const existingOrders = JSON.parse(localStorage.getItem('tailwag_orders') || '[]');
      // 确保订单有 total 字段
      if (!newOrder.total) {
        newOrder.total = newOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || total;
      }
      existingOrders.push(newOrder);
      localStorage.setItem('tailwag_orders', JSON.stringify(existingOrders));
      
      // 清空购物车
      clearCart();
      
      // 显示支付引导页面（而不是简单的成功页面）
      setOrder(newOrder);
      setShowPayment(true); // 显示支付引导
      setSubmitted(true);
    } catch (error) {
      alert('下单失败：' + error.message);
    }
  };

  if (submitted && order && showPayment) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 pt-48 pb-32 text-center">
          <div className="bg-white p-20 rounded-[4rem] shadow-premium border border-stone-50">
            <div className="text-7xl mb-12">💳</div>
            <h1 className="text-5xl font-black text-brand-charcoal mb-8 tracking-tighter">请完成支付</h1>
            <p className="text-xl text-brand-stone leading-loose font-medium mb-12">
              订单 #{order.orderNumber || order.id?.slice(0, 8)} 已创建成功，请完成支付。
            </p>
            
            {paymentStatus === 'processing' && (
              <div className="mb-12 p-6 bg-blue-50 rounded-2xl">
                <p className="text-brand-charcoal font-black">支付处理中...</p>
              </div>
            )}
            
            {paymentStatus === 'success' && (
              <div className="mb-12 p-6 bg-green-50 rounded-2xl">
                <p className="text-green-600 font-black">✅ 支付成功！</p>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="mb-12 p-6 bg-red-50 rounded-2xl">
                <p className="text-red-600 font-black">❌ 支付失败，请重试</p>
              </div>
            )}
            
            <div className="bg-brand-cream p-8 rounded-2xl mb-12 text-left">
              <h3 className="font-black text-brand-charcoal mb-4">订单金额</h3>
              <p className="text-3xl font-black text-brand-orange">¥{order.total?.toFixed(2) || total.toFixed(2)}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={async () => {
                  setPaymentStatus('processing');
                  try {
                    const payRes = await fetchWithCsrf('/api/orders/pay', {
                      method: 'POST',
                      body: JSON.stringify({
                        orderId: order.id,
                        paymentMethod: 'sandbox', // 使用模拟支付
                      }),
                    });
                    
                    if (payRes.ok) {
                      setPaymentStatus('success');
                      setTimeout(() => {
                        router.push(`/orders/${order.id}`);
                      }, 2000);
                    } else {
                      setPaymentStatus('failed');
                    }
                  } catch (err) {
                    setPaymentStatus('failed');
                  }
                }}
                disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                className="bg-brand-orange text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-charcoal transition-all shadow-xl disabled:opacity-50"
              >
                {paymentStatus === 'processing' ? '支付处理中...' : paymentStatus === 'success' ? '✅ 支付成功' : '💳 立即支付（模拟）'}
              </button>
              
              <button 
                onClick={() => router.push('/orders')}
                className="bg-white text-brand-charcoal border-2 border-stone-100 px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:border-brand-charcoal transition-all"
              >
                稍后支付
              </button>
            </div>
            
            <p className="text-xs text-stone-400 mt-8">
              💡 当前使用模拟支付模式。配置真实支付后，此处将显示支付宝/微信支付选项。
            </p>
          </div>
        </main>
      </div>
    );
  }
  
  if (submitted && order && !showPayment) {
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
                onClick={() => router.push('/orders')}
                className="bg-white text-brand-charcoal border-2 border-stone-100 px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:border-brand-charcoal transition-all"
              >
                查看订单
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  if (cart.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 pt-48 pb-32 text-center">
          <div className="bg-white p-20 rounded-[4rem] shadow-premium border border-stone-50">
            <p className="text-2xl text-brand-stone font-medium mb-12 italic">"您的清单空空如也，生活需要一点摇尾巴的惊喜。"</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-brand-charcoal text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange transition-all shadow-xl"
            >
              去探索甄选作品
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 md:px-12 pt-40 pb-32">
        <div className="mb-20">
          <h1 className="text-6xl font-black text-brand-charcoal tracking-tighter mb-4">结账</h1>
          <div className="h-1 w-24 bg-brand-orange"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-20 items-start">
          {/* 结账表单 */}
          <div className="lg:col-span-8">
            <form onSubmit={handlePlaceOrder} className="bg-white p-12 rounded-[3rem] shadow-premium border border-stone-50 space-y-8">
              <h2 className="text-2xl font-black text-brand-charcoal mb-6">收货信息</h2>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">收货人姓名</label>
                <input 
                  required
                  type="text" 
                  value={customer.name}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  className="w-full bg-brand-cream border-b-2 border-stone-100 py-4 px-0 text-brand-charcoal focus:border-brand-orange focus:ring-0 transition-all placeholder:text-stone-300 font-black text-sm" 
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
                  className="w-full bg-brand-cream border-b-2 border-stone-100 py-4 px-0 text-brand-charcoal focus:border-brand-orange focus:ring-0 transition-all placeholder:text-stone-300 font-black text-sm" 
                  placeholder="EMAIL"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">配送地址</label>
                <textarea 
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  className="w-full bg-brand-cream border-b-2 border-stone-100 py-4 px-0 text-brand-charcoal focus:border-brand-orange focus:ring-0 transition-all placeholder:text-stone-300 font-black text-sm h-24 resize-none" 
                  placeholder="ADDRESS"
                ></textarea>
              </div>

              <div className="pt-6 flex space-x-4">
                <button 
                  type="button"
                  onClick={() => router.push('/cart')}
                  className="flex-1 border-2 border-stone-200 text-brand-charcoal py-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:border-brand-charcoal transition-all"
                >
                  返回购物车
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-brand-orange text-white py-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-charcoal transition-all"
                >
                  确认下单 →
                </button>
              </div>
            </form>
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-4">
            <div className="bg-brand-charcoal text-white p-12 rounded-[3rem] shadow-premium sticky top-40">
              <h3 className="text-2xl font-black mb-10 tracking-tight italic text-brand-orange">订单摘要</h3>
              
              <div className="space-y-6 mb-12">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b border-white/10">
                    <div className="flex-1">
                      <div className="font-black text-sm">{item.name}</div>
                      <div className="text-[10px] opacity-60 mt-1">Qty: {item.quantity}</div>
                    </div>
                    <span className="font-black">¥{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">应付总额</span>
                <span className="text-3xl font-black tracking-tighter">¥{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadedOrders = JSON.parse(localStorage.getItem('tailwag_orders') || '[]');
    setOrders(loadedOrders);
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-40 pb-32">
        <div className="mb-20">
          <h1 className="text-6xl font-black text-brand-charcoal tracking-tighter mb-4">我的甄选订单</h1>
          <p className="text-brand-stone font-medium italic">“追踪每一份跨越山海的爱。”</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-premium border border-stone-50">
            <p className="text-xl text-brand-stone font-medium mb-10">您还没有任何甄选记录。</p>
            <button onClick={() => router.push('/')} className="btn-primary">开始探索</button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-12 rounded-[3rem] shadow-premium border border-stone-50 group">
                <div className="flex flex-col md:flex-row justify-between mb-10 pb-10 border-b border-stone-100">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-2">Order ID</div>
                    <div className="text-2xl font-black text-brand-charcoal tracking-tighter">{order.id}</div>
                  </div>
                  <div className="mt-6 md:mt-0 text-right">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-stone mb-2">Status</div>
                    <div className={`text-sm font-black uppercase tracking-widest ${
                      order.status === 'Pending' ? 'text-brand-orange' : 'text-green-600'
                    }`}>
                      {order.status === 'Pending' ? '正在准备中 (Preparing)' : 
                       order.status === 'Sourced' ? '已完成质检 (Sourced & Verified)' : 
                       '正在全球配送中 (In Transit)'}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-stone mb-6 opacity-60">甄选商品</h4>
                    <div className="space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center font-bold text-brand-charcoal">
                          <span>{item.name} <span className="text-brand-stone font-medium">x {item.quantity}</span></span>
                          <span>¥{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xl font-black">
                        <span>总计</span>
                        <span>¥{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-brand-cream/50 p-8 rounded-3xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-stone mb-6 opacity-60">甄选进度追踪</h4>
                    <div className="space-y-6">
                      {[
                        { label: "订单已确认", status: true },
                        { label: "全球货源匹配与质检", status: order.status !== 'Pending' },
                        { label: "国际物流分拣", status: order.status === 'Shipped' || order.status === 'Delivered' },
                        { label: "最后 1km 配送", status: order.status === 'Delivered' }
                      ].map((step, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${step.status ? 'bg-brand-orange' : 'bg-stone-200'}`}></div>
                          <span className={`text-xs font-black uppercase tracking-widest ${step.status ? 'text-brand-charcoal' : 'text-brand-stone opacity-30'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerOrdersPage;

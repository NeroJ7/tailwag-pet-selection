import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import products from '../data/products.json';

const SourcingDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, margin: 0, orders: 0 });

  useEffect(() => {
    const loadedOrders = JSON.parse(localStorage.getItem('tailwag_orders') || '[]');
    setOrders(loadedOrders);
    
    const totalRev = loadedOrders.reduce((sum, o) => sum + o.total, 0);
    setStats({
      revenue: totalRev,
      margin: (totalRev * 0.62).toFixed(2), // Mock 62% average margin
      orders: loadedOrders.length
    });
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) return { ...o, status: newStatus };
      return o;
    });
    setOrders(updated);
    localStorage.setItem('tailwag_orders', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 space-y-8 lg:space-y-0">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4">Operations Dashboard</div>
            <h1 className="text-6xl font-black text-brand-charcoal tracking-tighter">供应链<span className="italic text-brand-orange">实时看板</span></h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 min-w-[180px]">
              <div className="text-[8px] font-black uppercase tracking-widest text-brand-stone mb-2">累计销售</div>
              <div className="text-3xl font-black text-brand-charcoal tracking-tighter">¥{stats.revenue.toFixed(2)}</div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 min-w-[180px]">
              <div className="text-[8px] font-black uppercase tracking-widest text-brand-stone mb-2">预估净利</div>
              <div className="text-3xl font-black text-brand-orange tracking-tighter">¥{stats.margin}</div>
            </div>
            <div className="hidden md:block bg-brand-charcoal p-8 rounded-3xl shadow-xl min-w-[180px]">
              <div className="text-[8px] font-black uppercase tracking-widest text-white/50 mb-2">待处理订单</div>
              <div className="text-3xl font-black text-white tracking-tighter">{orders.filter(o => o.status === 'Pending').length}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Recent Orders - Demand Side */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[3rem] p-12 shadow-premium border border-stone-50">
              <h2 className="text-2xl font-black mb-10 tracking-tight flex items-center">
                <span className="mr-4">📦</span> 最新订单 (客户需求)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-brand-stone border-b border-stone-100">
                      <th className="pb-6">订单号</th>
                      <th className="pb-6">客户信息</th>
                      <th className="pb-6">商品清单</th>
                      <th className="pb-6">总额</th>
                      <th className="pb-6">状态</th>
                      <th className="pb-6">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-20 text-center text-brand-stone italic font-medium">暂无订单数据，等待市场爆发...</td>
                      </tr>
                    ) : orders.map(order => (
                      <tr key={order.id} className="border-b border-stone-50 group hover:bg-stone-50/50 transition-colors">
                        <td className="py-8 align-top">
                          <span className="text-[10px] font-black text-brand-charcoal bg-stone-100 px-3 py-1 rounded-full">{order.id}</span>
                          <div className="text-[8px] text-brand-stone mt-2 font-bold uppercase">{new Date(order.date).toLocaleDateString()}</div>
                        </td>
                        <td className="py-8 align-top">
                          <div className="text-xs font-black text-brand-charcoal">{order.customer.name}</div>
                          <div className="text-[10px] text-brand-stone font-medium mt-1">{order.customer.email}</div>
                        </td>
                        <td className="py-8 align-top">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-[10px] font-bold text-brand-charcoal mb-1">
                              • {item.name} x {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="py-8 align-top font-black text-brand-charcoal">¥{order.total.toFixed(2)}</td>
                        <td className="py-8 align-top">
                          <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                            order.status === 'Pending' ? 'bg-orange-100 text-brand-orange' : 
                            order.status === 'Sourced' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-8 align-top space-y-2 flex flex-col">
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Sourced')}
                              className="text-[8px] font-black uppercase tracking-widest text-brand-orange hover:underline text-left"
                            >
                              标记已采购 (1688) &rarr;
                            </button>
                          )}
                          {order.status === 'Sourced' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Shipped')}
                              className="text-[8px] font-black uppercase tracking-widest text-blue-600 hover:underline text-left"
                            >
                              填写国际单号 &rarr;
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* VOC Analysis */}
            <div className="bg-brand-charcoal text-white rounded-[3rem] p-12 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h2 className="text-2xl font-black mb-10 tracking-tight flex items-center relative z-10">
                <span className="mr-4">✨</span> 选品审计 (VOC & 供应链)
              </h2>
              <div className="space-y-6 relative z-10">
                {products.map(p => (
                  <div key={p.id} className="bg-white/5 border border-white/10 p-8 rounded-3xl flex justify-between items-center group hover:border-brand-orange transition-colors">
                    <div>
                      <h4 className="font-black text-lg mb-2">{p.name}</h4>
                      <div className="flex space-x-4">
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-orange">毛利: {p.margin}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-green-400">直供: {p.brand}</span>
                      </div>
                    </div>
                    <a href={p.sourcingUrl} target="_blank" className="bg-white text-brand-charcoal px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all">
                      1688 深度溯源 &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sourcing Side - Supply Side */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-stone-50">
              <h2 className="text-xl font-black mb-8 tracking-tight">国际物流追踪</h2>
              <div className="space-y-8">
                {[
                  { route: "深圳盐田港 → LAX (海运)", status: "运输中", date: "预计 12天到达", color: "blue" },
                  { route: "香港机场 → JFK (空运)", status: "已清关", date: "派送中", color: "green" }
                ].map((log, i) => (
                  <div key={i} className="relative pl-10 border-l-2 border-stone-100 pb-2">
                    <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm bg-${log.color}-500`}></div>
                    <div className="text-[10px] font-black text-brand-charcoal uppercase mb-1">{log.route}</div>
                    <div className="text-[8px] font-black text-brand-stone uppercase tracking-widest mb-2">{log.status} · {log.date}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 border-2 border-stone-100 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-stone hover:border-brand-charcoal transition-all">
                同步所有物流数据
              </button>
            </div>

            <div className="bg-brand-orange p-10 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <h3 className="text-xl font-black mb-6 relative z-10">利润优化建议</h3>
              <p className="text-xs font-bold leading-loose mb-8 opacity-80 relative z-10">
                当前“极地冻干”系列海运成本上涨 12%，建议将零售价上调 $2.00 以维持 650% 毛利，或切换至宁波港出口。
              </p>
              <button className="bg-brand-charcoal text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-charcoal transition-all relative z-10">
                生成详细策略报告
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SourcingDashboard;

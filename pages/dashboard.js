import React from 'react';
import Navbar from '../components/Navbar';
import products from '../data/products.json';

const SourcingDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">TailWag 运营看板 (选-供-销)</h1>
            <p className="text-gray-500">实时追踪 1688 供应链状态与跨境利润率</p>
          </div>
          <div className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold">
            当前预估月利润: $12,450.00
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">待采购任务 (1688)</h3>
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">{p.name}</span>
                  <a href={p.sourcingUrl} target="_blank" className="text-xs text-orange-500 font-bold hover:underline">去1688下单 &rarr;</a>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">物流状态 (国际站)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs">深圳盐田港 {"->"} LAX</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">海运中 (12天)</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">销售转化 (TailWag)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center font-bold">
                <span className="text-sm text-gray-900">访客转化率</span>
                <span className="text-green-500">4.25%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-8">选品审计报告 (VOC 驱动)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b">
                  <th className="pb-4">商品名称</th>
                  <th className="pb-4">采购价(CNY)</th>
                  <th className="pb-4">零售价(USD)</th>
                  <th className="pb-4">预估毛利</th>
                  <th className="pb-4">针对性改进 (VOC)</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-6 font-bold">{p.name}</td>
                    <td className="py-6 text-gray-500">¥28.50</td>
                    <td className="py-6 text-gray-900 font-bold">${p.price}</td>
                    <td className="py-6 text-green-500 font-black">{p.margin}</td>
                    <td className="py-6">
                      {p.vocHighlights.map((v, i) => (
                        <span key={i} className="inline-block bg-orange-50 text-orange-600 text-[10px] px-2 py-1 rounded mr-2 mb-1">{v}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SourcingDashboard;

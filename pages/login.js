import React from 'react';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      
      <div className="max-w-md mx-auto mt-20 px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">欢迎回来</h1>
              <p className="text-gray-400">加入 TailWag 会员，享受专属优选特权</p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">手机号 / 邮箱</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="请输入您的账号"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">验证码 / 密码</label>
                <div className="flex space-x-2">
                  <input 
                    type="password" 
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                    placeholder="请输入"
                  />
                  <button type="button" className="text-orange-500 text-sm font-bold px-4 hover:text-orange-600 transition">
                    获取验证码
                  </button>
                </div>
              </div>

              <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all">
                立即登录
              </button>
            </form>

            <div className="mt-8 pt-8 border-t flex items-center justify-between text-sm">
              <span className="text-gray-400">还没有账号？</span>
              <a href="#" className="text-orange-500 font-bold hover:underline">立即注册</a>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 text-center">
            <p className="text-xs text-gray-400 mb-4 tracking-widest uppercase">第三方账号登录</p>
            <div className="flex justify-center space-x-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition">💬</div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition">🍎</div>
            </div>
          </div>
        </div>

        {/* 会员权益预览 */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: "🎁", title: "首单礼包" },
            { icon: "🚚", title: "全年免邮" },
            { icon: "💎", title: "专属客服" }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

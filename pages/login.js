import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  // 预获取 CSRF token
  useEffect(() => {
    if (typeof fetch !== 'undefined') {
      fetch('/api/csrf', { method: 'GET', credentials: 'include' }).catch(() => {});
    }
  }, []);
  const router = useRouter();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);
  
  // Email validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!loginEmail.trim()) errors.email = '请输入邮箱';
    else if (!isValidEmail(loginEmail)) errors.email = '请输入有效的邮箱格式';
    if (!loginPassword) errors.password = '请输入密码';
    if (loginPassword.length > 0 && loginPassword.length < 6) errors.password = '密码不少于6位';

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginLoading(true);
    setLoginErrors({});

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });

      setLoginLoading(false);

      if (res?.error) {
        setLoginErrors({ general: '邮箱或密码错误' });
      } else {
        router.push('/');
      }
    } catch (err) {
      setLoginLoading(false);
      setLoginErrors({ general: '登录失败，请稍后重试' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!regName.trim()) errors.name = '请输入姓名';
    if (regName.trim().length > 0 && regName.trim().length < 2) errors.name = '姓名至少2个字符';
    
    if (!regEmail.trim()) errors.email = '请输入邮箱';
    else if (!isValidEmail(regEmail)) errors.email = '请输入有效的邮箱地址';
    
    if (!regPassword) errors.password = '请设置密码';
    if (regPassword && regPassword.length < 6) errors.password = '密码不少于6位字符';
    if (regConfirm !== regPassword) errors.confirm = '两次密码不一致';

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegLoading(true);
    setRegErrors({});

    try {
      // 获取 CSRF token（如果没有则主动获取）
      let csrfToken = '';
      const csrfMatch = document.cookie.match(/(^|;)\s*csrf_token=([^;]+)/);
      if (csrfMatch) {
        csrfToken = decodeURIComponent(csrfMatch[2]);
      } else {
        // 主动获取 CSRF token
        const csrfRes = await fetch('/api/csrf', { method: 'GET', credentials: 'include' });
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          if (csrfData.token) csrfToken = csrfData.token;
        }
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
      });

      const data = await res.json();
      setRegLoading(false);

      if (!res.ok) {
        setRegErrors({ general: data.error || '注册失败' });
      } else {
        // 注册成功，自动登录
        const loginRes = await signIn("credentials", {
          redirect: false,
          email: regEmail,
          password: regPassword,
        });

        if (loginRes?.error) {
          // 注册成功但自动登录失败，跳转到登录页
          router.push("/auth/signin?registered=true");
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setRegLoading(false);
      setRegErrors({ general: '注册失败，请稍后重试' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <div className="max-w-6xl mx-auto mt-20 px-6 md:px-12 pb-32">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left: Brand Declaration */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-premium relative group">
              <img 
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=90" 
                alt="TailWag Brand" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-charcoal/50"></div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-14 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4">Welcome Back</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                  加入<br/><span className="title-serif text-brand-orange italic">摇尾精选</span><br/>会员社区
                </h2>
                <p className="text-stone-300 leading-loose font-medium max-w-sm">
                  每一次摇尾，皆是礼赞。成为 TailWag 会员，享受全球甄选好物的优先权与专属权益。
                </p>

                {/* Member Benefits */}
                <div className="grid grid-cols-3 gap-4 mt-10">
                  {[
                    { icon: "🎁", title: "首单礼包", desc: "新人专属优惠" },
                    { icon: "🚚", title: "全年免邮", desc: "顺丰/联邦直达" },
                    { icon: "💎", title: "专属客服", desc: "1对1 选品顾问" }
                  ].map((item, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <p className="text-[10px] font-black uppercase tracking-wider">{item.title}</p>
                      <p className="text-[8px] text-stone-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Auth Form */}
          <div className="lg:col-span-7 lg:pl-8">
            {/* Tab Switcher */}
            <div className="flex space-x-2 mb-12 bg-white rounded-full p-1.5 w-fit shadow-premium">
              <button
                onClick={() => { setTab('login'); setLoginErrors({}); }}
                className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  tab === 'login'
                    ? 'bg-brand-charcoal text-white shadow-md'
                    : 'text-brand-stone hover:text-brand-charcoal'
                }`}
              >
                登录
              </button>
              <button
                onClick={() => { setTab('register'); setRegErrors({}); }}
                className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  tab === 'register'
                    ? 'bg-brand-charcoal text-white shadow-md'
                    : 'text-brand-stone hover:text-brand-charcoal'
                }`}
              >
                注册新账号
              </button>
            </div>

            {/* Login Form */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-8 max-w-lg" autoComplete="off">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">邮箱</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginErrors({...loginErrors, email: ''}); }}
                    placeholder="your@email.com"
                    className={`w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all ${loginErrors.email ? 'border-red-400' : 'border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10'}`}
                  />
                  {loginErrors.email && <p className="mt-2 text-xs text-red-500 font-bold ml-2">{loginErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">密码</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginErrors({...loginErrors, password: ''}); }}
                    placeholder="••••••"
                    className={`w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all ${loginErrors.password ? 'border-red-400' : 'border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10'}`}
                  />
                  {loginErrors.password && <p className="mt-2 text-xs text-red-500 font-bold ml-2">{loginErrors.password}</p>}
                </div>

                {loginErrors.general && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-800">{loginErrors.general}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-brand-charcoal text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange hover:shadow-2xl hover:shadow-orange-200 transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {loginLoading ? '登录中...' : '立即登录 — Sign In'}
                </button>
              </form>
            )}

            {/* Register Form */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-8 max-w-lg" autoComplete="off">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">您的姓名</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => { setRegName(e.target.value); setRegErrors({...regErrors, name: ''}); }}
                    placeholder="您的称呼"
                    className={`w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all ${regErrors.name ? 'border-red-400' : 'border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10'}`}
                  />
                  {regErrors.name && <p className="mt-2 text-xs text-red-500 font-bold ml-2">{regErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">电子邮箱</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => { setRegEmail(e.target.value); setRegErrors({...regErrors, email: ''}); }}
                    placeholder="your@email.com"
                    className={`w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all ${regErrors.email ? 'border-red-400' : 'border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10'}`}
                  />
                  {regErrors.email && <p className="mt-2 text-xs text-red-500 font-bold ml-2">{regErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">设置密码</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => { setRegPassword(e.target.value); setRegErrors({...regErrors, password: ''}); }}
                    placeholder="不少于 6 位字符"
                    className={`w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all ${regErrors.password ? 'border-red-400' : 'border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10'}`}
                  />
                  {regErrors.password && <p className="mt-2 text-xs text-red-500 font-bold ml-2">{regErrors.password}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">确认密码</label>
                  <input
                    type="password"
                    value={regConfirm}
                    onChange={(e) => { setRegConfirm(e.target.value); setRegErrors({...regErrors, confirm: ''}); }}
                    placeholder="再次输入密码"
                    className={`w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all ${regErrors.confirm ? 'border-red-400' : 'border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10'}`}
                  />
                  {regErrors.confirm && <p className="mt-2 text-xs text-red-500 font-bold ml-2">{regErrors.confirm}</p>}
                </div>

                {regErrors.general && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-800">{regErrors.general}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-brand-orange text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-charcoal hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {regLoading ? '注册中...' : '创建账号 — Create Account'}
                </button>
              </form>
            )}

            {/* Third-party Login */}
            <div className="mt-12 pt-8 border-t border-stone-100 max-w-lg">
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-brand-stone opacity-40 mb-6">或通过以下方式登录</p>
              <div className="flex justify-center space-x-6">
                <button 
                  onClick={() => alert('微信登录功能开发中，敬请期待！')}
                  className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl cursor-pointer hover:bg-green-500 hover:scale-110 hover:-rotate-3 transition-all duration-300 border border-stone-50"
                  title="微信登录"
                >
                  💬
                </button>
                <button 
                  onClick={() => alert('Apple ID 登录功能开发中，敬请期待！')}
                  className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl cursor-pointer hover:bg-black hover:text-white hover:scale-110 hover:rotate-3 transition-all duration-300 border border-stone-50"
                  title="Apple ID 登录"
                >
                  🍎
                </button>
                <button 
                  onClick={() => alert('Google 登录功能开发中，敬请期待！')}
                  className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl cursor-pointer hover:bg-blue-600 hover:text-white hover:scale-110 hover:-rotate-3 transition-all duration-300 border border-stone-50"
                  title="Google 登录"
                >
                  🔷
                </button>
              </div>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden grid grid-cols-3 gap-4 mt-12">
              {[
                { icon: "🎁", title: "首单礼包", desc: "新人专享" },
                { icon: "🚚", title: "全年免邮", desc: "极速送达" },
                { icon: "💎", title: "专属客服", desc: "1v1 服务" }
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-white rounded-3xl shadow-sm">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-brand-charcoal">{item.title}</p>
                  <p className="text-[8px] text-brand-stone mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

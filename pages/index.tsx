import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Head from "next/head";

const features = [
  {
    icon: "🐾",
    title: "宠物档案",
    desc: "记录每一只毛孩子的成长足迹",
    href: "/pets",
    color: "from-orange-50 to-amber-50",
    iconBg: "bg-orange-100",
  },
  {
    icon: "🎯",
    title: "偏好测试",
    desc: "发现宠物的独特喜好",
    href: "/recommendations",
    color: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: "📦",
    title: "严选好物",
    desc: "全球12层筛选工序认证",
    href: "/products",
    color: "from-sky-50 to-blue-50",
    iconBg: "bg-sky-100",
  },
  {
    icon: "📊",
    title: "健康记录",
    desc: "跟踪疫苗、体检、用药",
    href: "/dashboard",
    color: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
  },
];

const stats = [
  { value: "12", label: "层筛选工序", suffix: "" },
  { value: "500+", label: "严选品牌", suffix: "" },
  { value: "98", label: "用户满意度", suffix: "%" },
  { value: "24h", label: "极速发货", suffix: "" },
];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR时默认显示未登录状态，避免闪烁
  const isLoggedIn = mounted && !!session;

  return (
    <div className="min-h-screen bg-brand-cream">
      <Head>
        <title>TailWag | 摇尾精选 — 全球宠物好物严选</title>
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="order-2 lg:order-1">
              {isLoggedIn ? (
                <>
                  <span className="inline-block text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-6">
                    Welcome Back
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-black text-brand-charcoal tracking-tighter leading-[0.95] mb-8">
                    欢迎回来，
                    <br />
                    <span className="title-serif text-brand-orange">
                      {session?.user?.name || session?.user?.email?.split("@")[0]}
                    </span>
                  </h1>
                  <p className="text-lg text-brand-stone leading-relaxed max-w-md mb-10">
                    您的宠物伙伴正在等您。查看档案、浏览推荐，或记录健康点滴。
                  </p>
                </>
              ) : (
                <>
                  <span className="inline-block text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-6">
                    TailWag Selection
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-black text-brand-charcoal tracking-tighter leading-[0.95] mb-8">
                    为追求
                    <br />
                    <span className="title-serif text-brand-orange">生活艺术</span>
                    <br />
                    的宠物家庭
                  </h1>
                  <p className="text-lg text-brand-stone leading-relaxed max-w-md mb-10">
                    我们跨越国界，为您严选每一件具有革新精神与高尚质感的宠物生活作品。
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => router.push("/login")}
                      className="btn-primary"
                    >
                      立即加入
                    </button>
                    <button
                      onClick={() => router.push("/products")}
                      className="btn-secondary"
                    >
                      浏览好物
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right: Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-premium">
                  <img
                    src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&w=1200&q=90"
                    alt="TailWag"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-6 shadow-premium animate-float">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-brand-orange rounded-2xl flex items-center justify-center text-2xl">
                      🏆
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand-charcoal">严选认证</p>
                      <p className="text-[10px] text-brand-stone mt-1">12层筛选工序</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl lg:text-5xl font-black text-brand-charcoal tracking-tighter">
                  {stat.value}
                  <span className="text-brand-orange">{stat.suffix}</span>
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-brand-charcoal tracking-tighter">
              为<span className="title-serif text-brand-orange">爱宠</span>而生
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                onClick={() => router.push(feature.href)}
                className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-premium transition-all duration-700 hover:-translate-y-3 cursor-pointer border border-stone-100"
              >
                <div
                  className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black text-brand-charcoal mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-brand-stone leading-relaxed">
                  {feature.desc}
                </p>
                <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  进入
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isLoggedIn && (
        <section className="py-24 px-6 md:px-12 bg-brand-charcoal relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-6 block">
              Join Us
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-8">
              每一次摇尾
              <br />
              <span className="title-serif text-brand-orange">皆是礼赞</span>
            </h2>
            <p className="text-lg text-stone-300 leading-relaxed max-w-xl mx-auto mb-12">
              成为 TailWag 会员，享受全球甄选好物的优先权与专属权益。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="bg-brand-orange text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-brand-charcoal transition-all duration-500 hover:-translate-y-1 active:scale-95"
              >
                免费注册
              </button>
              <button
                onClick={() => router.push("/selection-process")}
                className="border-2 border-white/30 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-brand-charcoal transition-all duration-500 hover:-translate-y-1 active:scale-95"
              >
                了解选品标准
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Logged-in Quick Actions */}
      {isLoggedIn && (
        <section className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
                Quick Actions
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-brand-charcoal tracking-tighter">
                快捷<span className="title-serif text-brand-orange">入口</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => router.push("/pets")}
                className="group bg-brand-cream rounded-[2rem] p-8 text-left hover:bg-brand-charcoal transition-all duration-700 border border-stone-100"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">🐶</div>
                <h3 className="text-lg font-black text-brand-charcoal group-hover:text-white mb-2 transition-colors">我的宠物</h3>
                <p className="text-sm text-brand-stone group-hover:text-stone-300 transition-colors">管理宠物档案和健康记录</p>
              </button>

              <button
                onClick={() => router.push("/products")}
                className="group bg-brand-cream rounded-[2rem] p-8 text-left hover:bg-brand-charcoal transition-all duration-700 border border-stone-100"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">🛒</div>
                <h3 className="text-lg font-black text-brand-charcoal group-hover:text-white mb-2 transition-colors">浏览商品</h3>
                <p className="text-sm text-brand-stone group-hover:text-stone-300 transition-colors">发现全球严选宠物好物</p>
              </button>

              <button
                onClick={() => router.push("/recommendations")}
                className="group bg-brand-cream rounded-[2rem] p-8 text-left hover:bg-brand-charcoal transition-all duration-700 border border-stone-100"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">✨</div>
                <h3 className="text-lg font-black text-brand-charcoal group-hover:text-white mb-2 transition-colors">智能推荐</h3>
                <p className="text-sm text-brand-stone group-hover:text-stone-300 transition-colors">基于宠物档案个性化推荐</p>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 bg-brand-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-black text-white italic tracking-tighter mb-4">TailWag</h3>
              <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
                为追求生活艺术的宠物家庭，严选全球顶级宠物用品。每一件都经12层筛选工序认证。
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-6">导航</h4>
              <ul className="space-y-3">
                {["首页", "选品标准", "我的订单", "溯源看板"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-stone-400 hover:text-brand-orange transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-6">服务</h4>
              <ul className="space-y-3">
                {["宠物档案", "健康记录", "偏好测试", "推荐好物"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-stone-400 hover:text-brand-orange transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[10px] text-stone-600 font-bold tracking-wider">
              &copy; 2024 TailWag Selection. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["微信", "微博", "小红书"].map((social) => (
                <a key={social} href="#" className="text-[10px] text-stone-600 hover:text-brand-orange transition-colors font-bold tracking-wider">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("邮箱或密码错误");
    } else {
      router.push("/pets");
    }
  }

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
                alt="可爱的金毛犬" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-charcoal/50"></div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-14 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4">Welcome Back</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                  欢迎回来<br/><span className="title-serif text-brand-orange italic">摇尾精选</span><br/>会员社区
                </h2>
                <p className="text-stone-300 leading-loose font-medium max-w-sm">
                  每一次摇尾，皆是礼赞。成为 TailWag 会员，享受全球甄选好物的优先权与专属权益。
                </p>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="lg:col-span-7 lg:pl-8">
            <h1 className="text-5xl font-black tracking-tighter mb-12">登录</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg" autoComplete="off">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-charcoal text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange hover:shadow-2xl hover:shadow-orange-200 transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? '登录中...' : '立即登录 — Sign In'}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-stone-100 max-w-lg">
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-brand-stone opacity-40 mb-6">还没有账号？</p>
              <button
                onClick={() => router.push("/auth/signup")}
                className="w-full bg-brand-orange text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-charcoal hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95"
              >
                注册新账号 — Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

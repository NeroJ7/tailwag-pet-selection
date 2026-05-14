import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("两次密码不一致");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("密码长度至少 8 位，且必须包含大小写字母、数字和特殊字符");
      setLoading(false);
      return;
    }

    try {
      // 调用注册 API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "注册失败，请重试");
        setLoading(false);
        return;
      }

      // 自动登录
      await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      router.push("/pets");
    } catch (err: any) {
      console.error("注册失败:", err);
      setError("注册失败，请重试");
    } finally {
      setLoading(false);
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
                src="https://images.unsplash.com/photo-1548199975-cc70d3d350b1?auto=format&fit=crop&w=1200&q=90" 
                alt="TailWag Brand" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-charcoal/50"></div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-14 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4">Join Us</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                  加入<br/><span className="title-serif text-brand-orange italic">摇尾精选</span><br/>会员社区
                </h2>
                <p className="text-stone-300 leading-loose font-medium max-w-sm">
                  每一次摇尾，皆是礼赞。成为 TailWag 会员，享受全球甄选好物的优先权与专属权益。
                </p>
              </div>
            </div>
          </div>

          {/* Right: Register Form */}
          <div className="lg:col-span-7 lg:pl-8">
            <h1 className="text-5xl font-black tracking-tighter mb-12">注册新账号</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg" autoComplete="off">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">您的姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="您的称呼"
                  className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">电子邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">设置密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="不少于8位字符"
                  className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
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
                className="w-full bg-brand-orange text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-charcoal hover:shadow-2xl hover:shadow-orange-200 transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? '注册中...' : '创建账号 — Create Account'}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-stone-100 max-w-lg">
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-brand-stone opacity-40 mb-6">已有账号？</p>
              <button
                onClick={() => router.push("/auth/signin")}
                className="w-full bg-brand-charcoal text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95"
              >
                立即登录 — Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

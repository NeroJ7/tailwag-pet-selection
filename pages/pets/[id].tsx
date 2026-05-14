import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Head from "next/head";

export default function PetDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [pet, setPet] = useState<any>(null);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (id && session) {
      fetchPetDetails();
    }
  }, [id, session]);

  async function fetchPetDetails() {
    try {
      // 获取宠物信息
      const petRes = await fetch(`/api/pets?id=${id}`);
      if (petRes.status === 401) {
        router.push("/auth/signin");
        return;
      }
      if (petRes.status === 404) {
        setError("宠物不存在或无权限");
        setLoading(false);
        return;
      }
      const petData = await petRes.json();
      setPet(petData);

      // 获取健康记录
      const healthRes = await fetch(`/api/health-records?petId=${id}`);
      const healthData = await healthRes.json();
      setHealthRecords(healthData);

      // 获取偏好
      const prefRes = await fetch(`/api/preferences?petId=${id}`);
      const prefData = await prefRes.json();
      setPreferences(prefData);
    } catch (err) {
      console.error("获取宠物详情失败:", err);
      setError("获取宠物详情失败");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <>
      <Head>
        <title>{pet.name} | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 md:px-12 pt-40 pb-32">
          {/* 返回按钮 + 标题 */}
          <div className="mb-12">
            <button
              onClick={() => router.back()}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone hover:text-brand-orange transition-all duration-300 mb-4 block"
            >
              ← 返回
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Pet Profile
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              {pet.name}
            </h1>
          </div>

          {/* 宠物基本信息卡片 */}
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-stone-100 mb-12">
            <div className="flex items-start justify-between mb-8">
              <div className="w-24 h-24 bg-brand-cream rounded-2xl flex items-center justify-center text-6xl">
                {pet.species === "狗" ? "🐶" : pet.species === "猫" ? "🐱" : "🐾"}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push(`/pets/edit/${pet.id}`)}
                  className="bg-brand-cream text-brand-charcoal px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-charcoal hover:text-white transition-all duration-500"
                >
                  编辑
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-stone">物种</span>
                <p className="text-lg font-bold text-brand-charcoal mt-1">{pet.species}</p>
              </div>
              {pet.breed && (
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-stone">品种</span>
                  <p className="text-lg font-bold text-brand-charcoal mt-1">{pet.breed}</p>
                </div>
              )}
              {pet.gender && (
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-stone">性别</span>
                  <p className="text-lg font-bold text-brand-charcoal mt-1">{pet.gender}</p>
                </div>
              )}
              {pet.weight && (
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-stone">体重</span>
                  <p className="text-lg font-bold text-brand-charcoal mt-1">{pet.weight} kg</p>
                </div>
              )}
              {pet.is_neutered && (
                <div>
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    已绝育
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 健康记录部分 */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-2 block">
                  Health Records
                </span>
                <h2 className="text-3xl font-black text-brand-charcoal">健康记录</h2>
              </div>
              <button
                onClick={() => router.push(`/pets/${pet.id}/health-records`)}
                className="bg-brand-charcoal text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-orange transition-all duration-500"
              >
                添加记录
              </button>
            </div>

            {healthRecords.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 text-center">
                <p className="text-brand-stone">还没有健康记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {healthRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-premium transition-all duration-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-brand-charcoal">{record.title}</h3>
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-stone">{record.record_type}</span>
                      </div>
                      <span className="text-[10px] text-brand-stone">
                        {new Date(record.record_date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    {record.next_due_date && (
                      <p className="text-[10px] text-brand-orange mt-2">
                        下次到期: {new Date(record.next_due_date).toLocaleDateString('zh-CN')}
                      </p>
                    )}
                  </div>
                ))}
                {healthRecords.length > 3 && (
                  <button
                    onClick={() => router.push(`/pets/${pet.id}/health-records`)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange hover:text-brand-charcoal transition-all duration-300"
                  >
                    查看全部 {healthRecords.length} 条记录 →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 偏好设置部分 */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-2 block">
                  Preferences
                </span>
                <h2 className="text-3xl font-black text-brand-charcoal">偏好设置</h2>
              </div>
              <button
                onClick={() => alert("添加偏好功能即将上线")}
                className="bg-brand-charcoal text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-orange transition-all duration-500"
              >
                添加偏好
              </button>
            </div>

            {preferences.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 text-center">
                <p className="text-brand-stone">还没有偏好记录</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {preferences.map((pref) => (
                  <div key={pref.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                    <h3 className="font-bold text-brand-charcoal mb-2">{pref.category}</h3>
                    {pref.preference_score && (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= pref.preference_score ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    {pref.notes && (
                      <p className="text-[10px] text-brand-stone mt-2">{pref.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

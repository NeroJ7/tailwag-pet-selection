import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";
import Head from "next/head";

export default function HealthRecordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: petId } = router.query;
  
  const [pet, setPet] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (petId && session) {
      fetchData();
    }
  }, [petId, session]);

  async function fetchData() {
    try {
      // 获取宠物信息
      const petRes = await fetch(`/api/pets?id=${petId}`);
      if (petRes.ok) {
        const petData = await petRes.json();
        setPet(petData);
      }

      // 获取健康记录
      const recordsRes = await fetch(`/api/health-records?petId=${petId}`);
      if (recordsRes.ok) {
        const recordsData = await recordsRes.json();
        setRecords(recordsData);
      }
    } catch (err) {
      console.error("获取数据失败:", err);
      setError("获取数据失败");
    } finally {
      setLoading(false);
    }
  }

  async function deleteRecord(id: string) {
    if (!confirm("确定要删除这条记录吗？")) return;

    try {
      const res = await fetch(`/api/health-records?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData(); // 重新加载
      }
    } catch (err) {
      console.error("删除记录失败:", err);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>健康记录 | TailWag</title>
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
              Health Records
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              {pet?.name} 的<span className="title-serif text-brand-orange">健康记录</span>
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm">
              {error}
            </div>
          )}

          {/* 添加按钮 */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/pets/${petId}/health-records/add`)}
              className="bg-brand-charcoal text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-orange transition-all duration-500 hover:-translate-y-1 active:scale-95"
            >
              添加记录
            </button>
          </div>

          {/* 记录列表 */}
          {records.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 shadow-sm text-center border border-stone-100">
              <div className="text-6xl mb-6">🏥</div>
              <h3 className="text-2xl font-black text-brand-charcoal mb-4">还没有健康记录</h3>
              <p className="text-brand-stone mb-8">点击"添加记录"开始记录您爱宠的健康信息</p>
            </div>
          ) : (
            <div className="space-y-6">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 hover:shadow-premium transition-all duration-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black text-brand-charcoal mb-2">{record.title}</h3>
                      <span className="text-[8px] font-black uppercase tracking-widest text-brand-stone bg-stone-100 px-3 py-1 rounded-full">
                        {record.record_type}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 px-3 py-1 rounded-full transition-all duration-500"
                    >
                      删除
                    </button>
                  </div>

                  {record.description && (
                    <p className="text-sm text-brand-stone mb-4">{record.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-[10px] text-brand-stone">
                    <div>
                      <span className="font-bold">记录日期：</span>
                      {new Date(record.record_date).toLocaleDateString('zh-CN')}
                    </div>
                    {record.next_due_date && (
                      <div>
                        <span className="font-bold">下次到期：</span>
                        <span className="text-brand-orange">
                          {new Date(record.next_due_date).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    )}
                    {record.veterinarian && (
                      <div>
                        <span className="font-bold">兽医：</span>{record.veterinarian}
                      </div>
                    )}
                    {record.clinic_name && (
                      <div>
                        <span className="font-bold">诊所：</span>{record.clinic_name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

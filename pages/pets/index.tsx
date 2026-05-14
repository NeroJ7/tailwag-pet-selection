import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Head from "next/head";

export default function PetsPage() {
  const { data: session, status } = useSession();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetchPets();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status]);

  async function fetchPets() {
    try {
      const res = await fetch("/api/pets");
      if (res.status === 401) {
        router.push("/auth/signin");
        return;
      }
      const data = await res.json();
      setPets(data);
    } catch (err) {
      console.error("获取宠物列表失败:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deletePet(id: string) {
    if (!confirm("确定要删除这个宠物吗？")) return;

    try {
      const res = await fetch(`/api/pets?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPets();
      }
    } catch (err) {
      console.error("删除宠物失败:", err);
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
        <title>我的宠物 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
                My Pets
              </span>
              <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
                我的<span className="title-serif text-brand-orange">宠物</span>
              </h1>
            </div>
            <button
              onClick={() => router.push("/pets/add")}
              className="bg-brand-charcoal text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-orange transition-all duration-500 hover:-translate-y-1 active:scale-95"
            >
              添加宠物
            </button>
          </div>

          {pets.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 shadow-sm text-center border border-stone-100">
              <div className="text-6xl mb-6">🐾</div>
              <h3 className="text-2xl font-black text-brand-charcoal mb-4">还没有添加宠物</h3>
              <p className="text-brand-stone mb-8">点击"添加宠物"开始建立您爱宠的档案</p>
              <button
                onClick={() => router.push("/pets/add")}
                className="btn-primary"
              >
                添加第一只宠物
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-premium transition-all duration-700 border border-stone-100 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
                      {pet.species === "狗" ? "🐶" : pet.species === "猫" ? "🐱" : "🐾"}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-stone bg-stone-100 px-3 py-1 rounded-full">
                      {pet.species}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-brand-charcoal mb-2">{pet.name}</h3>

                  <div className="space-y-2 mb-6">
                    {pet.breed && (
                      <p className="text-xs text-brand-stone">
                        <span className="font-bold">品种：</span>{pet.breed}
                      </p>
                    )}
                    {pet.gender && (
                      <p className="text-xs text-brand-stone">
                        <span className="font-bold">性别：</span>{pet.gender}
                      </p>
                    )}
                    {pet.age && (
                      <p className="text-xs text-brand-stone">
                        <span className="font-bold">年龄：</span>{pet.age}岁
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => router.push(`/pets/${pet.id}`)}
                      className="flex-1 bg-brand-cream text-brand-charcoal py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-charcoal hover:text-white transition-all duration-500"
                    >
                      查看详情
                    </button>
                    <button
                      onClick={() => deletePet(pet.id)}
                      className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 rounded-full transition-all duration-500"
                    >
                      删除
                    </button>
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

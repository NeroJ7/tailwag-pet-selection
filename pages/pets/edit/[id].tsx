import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";
import Head from "next/head";

export default function EditPetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    species: "狗",
    breed: "",
    gender: "",
    birthday: "",
    weight: "",
    photoUrls: "",
    microchipId: "",
    isNeutered: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (id && session) {
      fetchPet();
    }
  }, [id, session]);

  async function fetchPet() {
    try {
      const res = await fetch(`/api/pets?id=${id}`);
      if (res.status === 401) {
        router.push("/auth/signin");
        return;
      }
      if (res.status === 404) {
        setError("宠物不存在或无权限");
        setFetchLoading(false);
        return;
      }
      const pet = await res.json();
      
      setFormData({
        id: pet.id,
        name: pet.name || "",
        species: pet.species || "狗",
        breed: pet.breed || "",
        gender: pet.gender || "",
        birthday: pet.birthday ? pet.birthday.split('T')[0] : "",
        weight: pet.weight || "",
        photoUrls: pet.photoUrls && pet.photoUrls.length > 0 ? pet.photoUrls[0] : "",
        microchipId: pet.microchip_id || "",
        isNeutered: pet.is_neutered || false,
      });
    } catch (err) {
      console.error("获取宠物详情失败:", err);
      setError("获取宠物详情失败");
    } finally {
      setFetchLoading(false);
    }
  }

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: any = {
        id: formData.id,
      };

      // 只发送修改的字段（简单处理：发送所有字段）
      payload.name = formData.name;
      payload.species = formData.species;
      if (formData.breed) payload.breed = formData.breed;
      if (formData.gender) payload.gender = formData.gender;
      if (formData.birthday) payload.birthday = new Date(formData.birthday).toISOString();
      if (formData.weight) payload.weight = parseFloat(formData.weight);
      if (formData.photoUrls) payload.photoUrls = [formData.photoUrls];
      if (formData.microchipId) payload.microchipId = formData.microchipId;
      payload.isNeutered = formData.isNeutered;

      const res = await fetch("/api/pets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/pets/${formData.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "更新失败");
      }
    } catch (err: any) {
      console.error("更新宠物失败:", err);
      setError("更新失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || fetchLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>编辑宠物 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-2xl mx-auto px-6 md:px-12 pt-40 pb-32">
          <div className="mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Edit Pet
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              编辑<span className="title-serif text-brand-orange">宠物</span>
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 宠物名字 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                宠物名字 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="请输入宠物的名字"
              />
            </div>

            {/* 物种 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                物种 *
              </label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="狗">🐶 狗</option>
                <option value="猫">🐱 猫</option>
                <option value="兔">🐰 兔</option>
                <option value="其他">🐾 其他</option>
              </select>
            </div>

            {/* 品种 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                品种
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="请输入宠物品种（可选）"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                性别
              </label>
              <div className="flex space-x-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="gender"
                    value="公"
                    checked={formData.gender === "公"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`px-6 py-4 border-2 rounded-2xl text-center cursor-pointer transition-all duration-300 ${
                    formData.gender === "公"
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-stone-200 bg-white text-brand-stone hover:border-brand-orange"
                  }`}>
                    公
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="gender"
                    value="母"
                    checked={formData.gender === "母"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`px-6 py-4 border-2 rounded-2xl text-center cursor-pointer transition-all duration-300 ${
                    formData.gender === "母"
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-stone-200 bg-white text-brand-stone hover:border-brand-orange"
                  }`}>
                    母
                  </div>
                </label>
              </div>
            </div>

            {/* 出生日期 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                出生日期
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
              />
            </div>

            {/* 体重 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                体重 (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="0.0"
              />
            </div>

            {/* 照片 URL */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                照片 URL
              </label>
              <input
                type="text"
                name="photoUrls"
                value={formData.photoUrls}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="https://..."
              />
              <p className="text-[10px] text-brand-stone mt-2 ml-2">
                Phase 2 将支持直接上传照片
              </p>
            </div>

            {/* 芯片 ID */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                芯片 ID
              </label>
              <input
                type="text"
                name="microchipId"
                value={formData.microchipId}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="请输入宠物芯片 ID（可选）"
              />
            </div>

            {/* 是否绝育 */}
            <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-stone-200">
              <input
                type="checkbox"
                name="isNeutered"
                checked={formData.isNeutered}
                onChange={handleChange}
                className="w-6 h-6 rounded-lg border-2 border-stone-300 text-brand-orange focus:ring-brand-orange cursor-pointer"
              />
              <label className="text-sm font-bold text-brand-charcoal cursor-pointer">
                已绝育
              </label>
            </div>

            {/* 按钮 */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-charcoal text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-orange transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "保存中..." : "保存修改"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-white text-brand-charcoal py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border-2 border-stone-200 hover:border-brand-charcoal transition-all duration-500 hover:-translate-y-1 active:scale-95"
              >
                取消
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

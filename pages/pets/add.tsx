import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Head from "next/head";
import ImageUpload from "../../components/ImageUpload";
import { fetchWithCsrf, fetchCsrfToken } from "../../lib/csrf-client";

export default function AddPetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    species: "狗",
    breed: "",
    gender: "",
    birthday: "",
    weight: "",
    photoUrls: [] as string[],
    microchipId: "",
    isNeutered: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    // 获取 CSRF token
    fetchCsrfToken();
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">加载中...</div>
      </div>
    );
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
      const payload = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        photoUrls: formData.photoUrls,
        birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null,
      };

      const res = await fetchWithCsrf("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/pets");
      } else {
        const data = await res.json();
        setError(data.error || "添加失败");
      }
    } catch (err: any) {
      console.error("添加宠物失败:", err);
      setError("添加失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>添加宠物 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-2xl mx-auto px-6 md:px-12 pt-40 pb-32">
          <div className="mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Add Pet
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              添加<span className="title-serif text-brand-orange">宠物</span>
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

            {/* 宠物照片 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                宠物照片
              </label>
              <ImageUpload
                onUpload={(url) =>
                  setFormData({ ...formData, photoUrls: [...formData.photoUrls, url] })
                }
              />
              {formData.photoUrls.length > 0 && (
                <p className="text-[10px] text-brand-stone mt-2">
                  已上传 {formData.photoUrls.length} 张照片
                </p>
              )}
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
                id="isNeutered"
                name="isNeutered"
                checked={formData.isNeutered}
                onChange={handleChange}
                className="w-6 h-6 rounded-lg border-2 border-stone-300 text-brand-orange focus:ring-brand-orange cursor-pointer"
              />
              <label htmlFor="isNeutered" className="text-sm font-bold text-brand-charcoal cursor-pointer">
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
                {loading ? "添加中..." : "添加宠物"}
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

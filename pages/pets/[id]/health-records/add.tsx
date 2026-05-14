import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../../../components/Navbar";
import Head from "next/head";

export default function AddHealthRecordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: petId } = router.query;
  
  const [formData, setFormData] = useState({
    petId: "",
    recordType: "疫苗",
    title: "",
    description: "",
    recordDate: "",
    nextDueDate: "",
    veterinarian: "",
    clinicName: "",
    documentUrls: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (petId) {
      setFormData(prev => ({ ...prev, petId: petId as string }));
    }
  }, [petId]);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.petId || !formData.recordType || !formData.title || !formData.recordDate) {
      setError("宠物、记录类型、标题、记录日期为必填项");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        petId: formData.petId,
        recordType: formData.recordType,
        title: formData.title,
        description: formData.description || null,
        recordDate: new Date(formData.recordDate).toISOString(),
        nextDueDate: formData.nextDueDate ? new Date(formData.nextDueDate).toISOString() : null,
        veterinarian: formData.veterinarian || null,
        clinicName: formData.clinicName || null,
        documentUrls: formData.documentUrls ? [formData.documentUrls] : [],
      };

      const res = await fetch("/api/health-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/pets/${formData.petId}/health-records`);
      } else {
        const data = await res.json();
        setError(data.error || "添加失败");
      }
    } catch (err: any) {
      console.error("添加健康记录失败:", err);
      setError("添加失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>添加健康记录 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-2xl mx-auto px-6 md:px-12 pt-40 pb-32">
          <div className="mb-12">
            <button
              onClick={() => router.back()}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone hover:text-brand-orange transition-all duration-300 mb-4 block"
            >
              ← 返回
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Add Health Record
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              添加<span className="title-serif text-brand-orange">健康记录</span>
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 记录类型 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                记录类型 *
              </label>
              <select
                name="recordType"
                value={formData.recordType}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="疫苗">💉 疫苗</option>
                <option value="体检">🏥 体检</option>
                <option value="疾病">🤒 疾病</option>
                <option value="手术">🔪 手术</option>
                <option value="其他">📋 其他</option>
              </select>
            </div>

            {/* 标题 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                标题 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="请输入记录标题"
              />
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                描述
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300 resize-none"
                placeholder="请输入详细描述（可选）"
              />
            </div>

            {/* 记录日期 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                记录日期 *
              </label>
              <input
                type="date"
                name="recordDate"
                value={formData.recordDate}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
              />
            </div>

            {/* 下次到期日期 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                下次到期日期
              </label>
              <input
                type="date"
                name="nextDueDate"
                value={formData.nextDueDate}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
              />
            </div>

            {/* 兽医 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                兽医
              </label>
              <input
                type="text"
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="请输入兽医姓名（可选）"
              />
            </div>

            {/* 诊所名称 */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                诊所名称
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="请输入诊所名称（可选）"
              />
            </div>

            {/* 文档 URL */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone mb-3">
                文档 URL
              </label>
              <input
                type="text"
                name="documentUrls"
                value={formData.documentUrls}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl text-brand-charcoal focus:outline-none focus:border-brand-orange transition-all duration-300"
                placeholder="https://...（可选）"
              />
              <p className="text-[10px] text-brand-stone mt-2 ml-2">
                Phase 2 将支持直接上传文档
              </p>
            </div>

            {/* 按钮 */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-charcoal text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-orange transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "添加中..." : "添加记录"}
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

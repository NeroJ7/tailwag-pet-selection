import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Link from 'next/link';

interface Recommendation {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    images: string[];
    tag: string;
    category_name: string;
  };
  score: number;
  pet_name: string;
  reason: string;
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [basedOn, setBasedOn] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchRecommendations();
  }, [session, status]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();

      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setBasedOn(data.based_on);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>专属推荐 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
          {/* Header */}
          <div className="mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              For You
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter mb-4">
              专属<span className="title-serif text-brand-orange">推荐</span>
            </h1>
            <p className="text-brand-stone">
              {basedOn === 'pet_profile'
                ? '根据您宠物的档案信息（物种、年龄、健康记录等）智能推荐'
                : '热门产品推荐'}
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 shadow-sm text-center border border-stone-100">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-black text-brand-charcoal mb-4">暂无推荐产品</h3>
              <p className="text-brand-stone mb-8">添加宠物以获取个性化推荐</p>
              <Link href="/pets/add">
                <button className="btn-primary">
                  添加宠物
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec, index) => (
                <Link key={rec.product.id} href={`/products/${rec.product.id}`}>
                  <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-premium transition-all duration-700 hover:-translate-y-3 cursor-pointer border border-stone-100 overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={rec.product.images?.[0] || 'https://via.placeholder.com/400'}
                        alt={rec.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {rec.score > 50 && (
                        <div className="absolute top-4 right-4 bg-brand-orange text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                          匹配度 {rec.score}%
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {rec.product.tag && (
                        <span className="inline-block px-3 py-1 text-[8px] font-black uppercase tracking-widest text-brand-orange bg-orange-50 rounded-full mb-3">
                          {rec.product.tag}
                        </span>
                      )}
                      <h3 className="text-lg font-black text-brand-charcoal mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
                        {rec.product.name}
                      </h3>
                      <p className="text-xs text-brand-stone mb-2">{rec.product.brand}</p>
                      <p className="text-xs text-brand-stone mb-4 line-clamp-2">{rec.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-brand-orange">
                          ¥{rec.product.price}
                        </span>
                        <span className="text-[10px] font-black text-brand-stone uppercase tracking-widest">{rec.product.category_name}</span>
                      </div>
                      {rec.pet_name && (
                        <p className="text-[10px] text-brand-stone mt-3 font-bold">推荐给 {rec.pet_name}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

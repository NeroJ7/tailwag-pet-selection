import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  tag: string;
  category_name: string;
  selection_reason: string;
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [category, search]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        const cats = [...new Set(data.products.map((p: Product) => p.category_name))] as string[];
        setCategories(cats);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?';
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>严选好物 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
          {/* Header */}
          <div className="mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Premium Selection
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              严选<span className="title-serif text-brand-orange">好物</span>
            </h1>
            <p className="text-brand-stone mt-4 max-w-2xl">
              每一件产品都经过12层筛选工序认证，为您和爱宠带来最高品质的生活体验。
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <input
              type="text"
              placeholder="搜索产品..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-6 py-4 rounded-full bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm text-brand-charcoal"
            >
              <option value="">全部分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="text-brand-stone text-lg">加载中...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 shadow-sm text-center border border-stone-100">
              <div className="text-6xl mb-6">📦</div>
              <p className="text-brand-stone">暂无产品</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-premium transition-all duration-700 hover:-translate-y-3 cursor-pointer border border-stone-100 overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.tag && (
                        <div className="absolute top-4 left-4 bg-brand-orange text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                          {product.tag}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-black text-brand-charcoal mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-brand-stone mb-2">{product.brand}</p>
                      <p className="text-xs text-brand-stone mb-4 line-clamp-2">{product.selection_reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-brand-orange">
                          ¥{product.price}
                        </span>
                        <span className="text-[10px] font-black text-brand-stone uppercase tracking-widest">{product.category_name}</span>
                      </div>
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

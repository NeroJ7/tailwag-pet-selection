import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { fetchWithCsrf, fetchCsrfToken } from '../../lib/csrf-client';

interface Product {
  id: string;
  name: string;
  brand: string | null;
  category_name: string | null;
  price: string;
  is_active: boolean;
  created_at: string;
  tag: string | null;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryName: '',
    price: '',
    description: '',
    tag: '',
    selectionReason: '',
    sourcingUrl: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    // 获取 CSRF token
    fetchCsrfToken();
    fetchProducts();
  }, [session, status]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();

      if (res.ok) {
        setProducts(data);
      } else {
        setError(data.error || '获取商品列表失败');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct
        ? { ...formData, id: editingProduct.id, price: parseFloat(formData.price) }
        : { ...formData, price: parseFloat(formData.price) };

      const res = await fetchWithCsrf(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          brand: '',
          categoryName: '',
          price: '',
          description: '',
          tag: '',
          selectionReason: '',
          sourcingUrl: '',
        });
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || '操作失败');
      }
    } catch (err) {
      console.error('操作失败:', err);
      alert('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个商品吗？')) return;

    try {
      const res = await fetchWithCsrf(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      categoryName: product.category_name || '',
      price: product.price,
      description: '',
      tag: product.tag || '',
      selectionReason: '',
      sourcingUrl: '',
    });
    setShowForm(true);
  };

  if (status === 'loading' || loading) {
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

  return (
    <>
      <Head>
        <title>商品管理 | TailWag Admin</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
          {/* Header */}
          <div className="mb-16 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
                Admin
              </span>
              <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
                商品<span className="title-serif text-brand-orange">管理</span>
              </h1>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: '',
                  brand: '',
                  categoryName: '',
                  price: '',
                  description: '',
                  tag: '',
                  selectionReason: '',
                  sourcingUrl: '',
                });
                setShowForm(!showForm);
              }}
              className="bg-brand-charcoal text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-orange transition-all duration-500"
            >
              {showForm ? '取消' : '添加商品'}
            </button>
          </div>

          {/* 添加/编辑表单 */}
          {showForm && (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 mb-8">
              <h2 className="text-2xl font-black text-brand-charcoal mb-8">
                {editingProduct ? '编辑商品' : '添加商品'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    商品名称 *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label htmlFor="brand" className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    品牌
                  </label>
                  <input
                    id="brand"
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label htmlFor="categoryName" className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    分类
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    价格 *
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    描述
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="tag" className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    标签
                  </label>
                  <input
                    id="tag"
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label htmlFor="sourcingUrl" className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    货源链接
                  </label>
                  <input
                    id="sourcingUrl"
                    type="url"
                    value={formData.sourcingUrl}
                    onChange={(e) => setFormData({ ...formData, sourcingUrl: e.target.value })}
                    className="w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-brand-orange text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-charcoal transition-all duration-500"
                  >
                    {editingProduct ? '更新商品' : '创建商品'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 商品列表 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-stone">商品名称</th>
                  <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-stone">品牌</th>
                  <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-stone">分类</th>
                  <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-stone">价格</th>
                  <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-stone">状态</th>
                  <th className="text-right px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-stone">操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-8 py-4 font-bold text-brand-charcoal">{product.name}</td>
                    <td className="px-8 py-4 text-brand-stone">{product.brand || '-'}</td>
                    <td className="px-8 py-4 text-brand-stone">{product.category_name || '-'}</td>
                    <td className="px-8 py-4 font-black text-brand-orange">¥{product.price}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.is_active ? '上架' : '下架'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-brand-orange hover:text-brand-charcoal transition-colors mr-4 text-[10px] font-black uppercase tracking-widest"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors text-[10px] font-black uppercase tracking-widest"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📦</div>
                <h3 className="text-2xl font-black text-brand-charcoal mb-4">还没有商品</h3>
                <p className="text-brand-stone">点击"添加商品"创建第一个商品</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
  description: string;
  specs: Array<{ label: string; value: string }>;
  reviews: Array<{ user: string; rating: number; comment: string }>;
  margin: string;
  sourcing_url: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products?id=${id}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">产品不存在</div>;
  }

  return (
    <>
      <Head>
        <title>{product.name} | TailWag</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-orange-600">
                  TailWag
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* 产品详情 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 图片展示 */}
            <div>
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={product.images?.[currentImageIndex] || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        index === currentImageIndex ? 'border-orange-600' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 产品信息 */}
            <div>
              {product.tag && (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded mb-4">
                  {product.tag}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.brand}</p>

              <div className="text-4xl font-bold text-orange-600 mb-6">¥{product.price}</div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 mb-6">
                <h3 className="font-semibold text-orange-800 mb-2">入选理由</h3>
                <p className="text-sm text-orange-700">{product.selection_reason}</p>
              </div>

              {/* 规格 */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">规格参数</h3>
                  <div className="bg-white rounded-lg border">
                    {product.specs.map((spec, index) => (
                      <div
                        key={index}
                        className={`flex py-3 px-4 ${
                          index !== product.specs.length - 1 ? 'border-b' : ''
                        }`}
                      >
                        <span className="text-gray-500 w-24">{spec.label}</span>
                        <span className="text-gray-900 flex-1">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 购买按钮 */}
              <div className="flex gap-4 mb-8">
                <a
                  href={product.sourcing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-orange-600 text-white text-center py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                >
                  查看货源（1688）
                </a>
                <button className="flex-1 border-2 border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition font-semibold">
                  加入购物车
                </button>
              </div>

              {/* 利润率 */}
              {product.margin && (
                <div className="text-sm text-gray-500">
                  利润率: <span className="text-green-600 font-semibold">{product.margin}</span>
                </div>
              )}
            </div>
          </div>

          {/* 详细描述 */}
          <div className="mt-12 bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">产品描述</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* 用户评价 */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-12 bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">用户评价</h2>
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{review.user}</span>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

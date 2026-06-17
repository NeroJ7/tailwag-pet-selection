import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { addToCart } from '../../utils/cart-util';
import { fetchWithCsrf } from '../../lib/csrf-client';

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
  const { data: session, status } = useSession();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  const handleAddToCart = async () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: Number(product.price),
      images: product.images,
      quantity: 1,
    });
    setAddToCartSuccess(true);
    setTimeout(() => setAddToCartSuccess(false), 3000);

    if (status === 'authenticated' && session?.user) {
      try {
        await fetchWithCsrf('/api/cart', {
          method: 'POST',
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        });
      } catch (err) {
        console.error('服务端购物车同步失败:', err);
      }
    }
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">产品不存在</div>;
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex] || '/placeholder.png';

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
              {/* 主图区域 */}
              <div className="relative bg-white rounded-lg overflow-hidden group">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-96 object-cover cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                />
                
                {/* 图片计数器 */}
                {images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* 左右切换箭头 */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* 缩略图 */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-orange-600 ring-2 ring-orange-200'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
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
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition font-semibold"
                >
                  加入购物车
                </button>
              </div>

              {/* 成功提示 */}
              {addToCartSuccess && (
                <div className="mt-2 text-sm text-green-600">已成功加入购物车！</div>
              )}

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

      {/* 图片放大查看 Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute top-4 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
          <button
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 bg-black/50 rounded-full hover:bg-black/70 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // 从 localStorage 获取购物车数据
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        if (items.length === 0) {
          router.push('/cart');
          return;
        }
        setCartItems(items);
      } catch {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }

    setLoading(false);
  }, [session, status, router]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingAddress,
        }),
      });

      const data = await res.json();

      if (res.ok && data.order) {
        // 清空购物车
        localStorage.removeItem('cart');
        // 跳转到支付页面
        router.push(`/orders/${data.order.id}`);
      } else {
        alert(data.error || '创建订单失败');
      }
    } catch (err) {
      console.error('创建订单失败:', err);
      alert('创建订单失败');
    } finally {
      setSubmitting(false);
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
        <title>结算 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
          {/* Header */}
          <div className="mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Checkout
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              订单<span className="title-serif text-brand-orange">结算</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 收货信息表单 */}
            <div>
              <h2 className="text-2xl font-black text-brand-charcoal mb-8">收货信息</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    收件人姓名
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    required
                    className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                    placeholder="请输入收件人姓名"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                    className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                    placeholder="请输入联系电话"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                    收货地址
                  </label>
                  <textarea
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 resize-none"
                    placeholder="请输入详细收货地址"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                      城市
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                      className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                      placeholder="城市"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-brand-stone mb-3">
                      邮政编码
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-8 py-5 bg-white border-2 rounded-2xl outline-none font-bold text-sm transition-all border-stone-100 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                      placeholder="邮政编码"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-orange text-white py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-charcoal hover:shadow-2xl hover:shadow-orange-200 transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? '创建订单中...' : '提交订单'}
                </button>
              </form>
            </div>

            {/* 订单摘要 */}
            <div>
              <h2 className="text-2xl font-black text-brand-charcoal mb-8">订单摘要</h2>
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-brand-charcoal text-sm">{item.name}</h4>
                        <p className="text-xs text-brand-stone">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-brand-orange">¥{item.price}</p>
                        <p className="text-xs text-brand-stone">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brand-stone">商品总额</span>
                    <span className="font-bold">¥{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-stone">运费</span>
                    <span className="font-bold">¥0</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-stone-100">
                    <span className="font-bold text-brand-charcoal">应付总额</span>
                    <span className="text-3xl font-black text-brand-orange">¥{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

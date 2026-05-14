import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: string;
  product_name: string;
  product_image: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  items: OrderItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: '已支付', color: 'bg-green-100 text-green-800' },
  shipped: { label: '已发货', color: 'bg-blue-100 text-blue-800' },
  delivered: { label: '已完成', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('确定要取消这个订单吗？')) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('取消订单失败:', err);
    }
  };

  const handlePay = async (orderId: string) => {
    const paymentMethod = window.confirm('点击确定使用支付宝支付，取消使用微信支付') ? 'alipay' : 'wechat_pay';

    try {
      const res = await fetch('/api/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentMethod }),
      });

      if (res.ok) {
        alert('支付成功！');
        fetchOrders();
      } else {
        alert('支付失败');
      }
    } catch (err) {
      console.error('支付失败:', err);
      alert('支付失败');
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
        <title>我的订单 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
          {/* Header */}
          <div className="mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Orders
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter mb-4">
              我的<span className="title-serif text-brand-orange">订单</span>
            </h1>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 shadow-sm text-center border border-stone-100">
              <div className="text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-black text-brand-charcoal mb-4">还没有订单</h3>
              <p className="text-brand-stone mb-8">去购物车结算，创建您的第一个订单</p>
              <Link href="/cart">
                <button className="btn-primary">
                  去购物车
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100"
                  >
                    {/* 订单头部 */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-stone mb-2">
                          订单号: {order.order_number}
                        </p>
                        <p className="text-sm text-brand-stone">
                          {new Date(order.created_at).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* 订单商品 */}
                    <div className="space-y-4 mb-6">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                            <img
                              src={item.product_image || '/placeholder.png'}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-brand-charcoal">{item.product_name}</h4>
                            <p className="text-sm text-brand-stone">数量: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-brand-orange">¥{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 订单底部 */}
                    <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                      <div>
                        <p className="text-sm text-brand-stone">
                          共 {order.items?.length || 0} 件商品
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-brand-stone mb-2">
                          实付金额: <span className="text-2xl font-black text-brand-orange">¥{order.total_amount}</span>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Link href={`/orders/${order.id}`}>
                            <button className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all duration-500">
                              查看详情
                            </button>
                          </Link>
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handlePay(order.id)}
                                className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-brand-orange text-white hover:bg-brand-charcoal transition-all duration-500"
                              >
                                立即支付
                              </button>
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 border-red-200 text-red-500 hover:bg-red-50 transition-all duration-500"
                              >
                                取消订单
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

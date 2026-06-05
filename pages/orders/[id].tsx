import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import DOMPurify from 'isomorphic-dompurify';
import { fetchWithCsrf, fetchCsrfToken } from '../../lib/csrf-client';

const PayPalButton = dynamic(() => import('../../components/PayPalButton'), { ssr: false });

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: string;
  product_name: string;
  product_images: string[];
  product_brand: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: string;
  payment_method: string | null;
  paid_at: string | null;
  shipping_address: any;
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

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    // 获取 CSRF token
    fetchCsrfToken();
    if (id) {
      fetchOrder();
    }
  }, [session, status, id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const [paying, setPaying] = useState(false);

  const handlePay = async (paymentMethod: string) => {
    if (!order) return;
    setPaying(true);

    try {
      const res = await fetchWithCsrf('/api/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || '支付失败');
        return;
      }

      // 支付宝返回 form HTML，自动提交
      if (data.formHtml) {
        const cleanHtml = DOMPurify.sanitize(data.formHtml, {
          ADD_TAGS: ['form', 'input', 'button'],
          ADD_ATTR: ['action', 'method', 'type', 'name', 'value', 'charset', 'target'],
        });
        const div = document.createElement('div');
        div.innerHTML = cleanHtml;
        const form = div.querySelector('form');
        if (form) {
          document.body.appendChild(form);
          form.submit();
        }
        return;
      }

      // 模拟支付成功
      if (data.sandbox) {
        alert(data.message || '支付成功（沙箱环境）');
      } else {
        alert('支付成功！');
      }
      fetchOrder();
    } catch (err) {
      console.error('支付失败:', err);
      alert('支付失败');
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('确定要取消这个订单吗？')) return;

    try {
      const res = await fetchWithCsrf(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        alert('订单已取消');
        fetchOrder();
      }
    } catch (err) {
      console.error('取消订单失败:', err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">加载中...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-brand-stone text-lg">订单不存在</div>
      </div>
    );
  }

  const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

  return (
    <>
      <Head>
        <title>订单详情 | TailWag</title>
      </Head>

      <div className="min-h-screen bg-brand-cream">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 md:px-12 pt-40 pb-32">
          {/* 返回按钮 + 标题 */}
          <div className="mb-12">
            <button
              onClick={() => router.back()}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-stone hover:text-brand-orange transition-all duration-300 mb-4 block"
            >
              ← 返回订单列表
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-4 block">
              Order Details
            </span>
            <h1 className="text-5xl font-black text-brand-charcoal tracking-tighter">
              订单<span className="title-serif text-brand-orange">详情</span>
            </h1>
          </div>

          {/* 订单信息卡片 */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-stone mb-2">
                  订单号: {order.order_number}
                </p>
                <p className="text-sm text-brand-stone">
                  创建时间: {new Date(order.created_at).toLocaleDateString('zh-CN', {
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

            {/* 订单商品列表 */}
            <div className="space-y-4 mb-6">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <img
                      src={item.product_images?.[0] || '/placeholder.png'}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-charcoal">{item.product_name}</h4>
                    <p className="text-sm text-brand-stone">{item.product_brand}</p>
                    <p className="text-sm text-brand-stone">数量: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-orange">¥{item.price}</p>
                    <p className="text-sm text-brand-stone">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 订单金额 */}
            <div className="border-t border-stone-100 pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-brand-stone">商品总额</span>
                <span className="font-bold">¥{order.total_amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-brand-stone">运费</span>
                <span className="font-bold">¥0</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-stone-100">
                <span className="font-bold text-brand-charcoal">实付金额</span>
                <span className="text-2xl font-black text-brand-orange">¥{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* 收货地址 */}
          {order.shipping_address && (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 mb-6">
              <h3 className="text-lg font-black text-brand-charcoal mb-4">收货地址</h3>
              <p className="text-brand-stone">{JSON.stringify(order.shipping_address)}</p>
            </div>
          )}

          {/* 操作按钮 */}
          {order.status === 'pending' && (
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-stone mb-2">
                选择支付方式
              </p>
              {/* 支付宝 */}
              <button
                onClick={() => handlePay('alipay')}
                disabled={paying}
                className="w-full bg-[#1677FF] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#0056D4] transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {paying ? '跳转中...' : '支付宝支付 Alipay'}
              </button>
              {/* PayPal */}
              <div className="bg-white rounded-2xl p-4 border border-stone-100">
                <PayPalButton
                  orderId={order.id}
                  totalAmount={order.total_amount}
                  onSuccess={() => {
                    setPaying(false);
                    alert('PayPal 支付成功！');
                    fetchOrder();
                  }}
                  onError={(msg) => {
                    setPaying(false);
                    alert(msg);
                  }}
                />
              </div>
              {/* 微信支付（模拟） */}
              <button
                onClick={() => handlePay('wechat_pay')}
                disabled={paying}
                className="w-full bg-[#07C160] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#06AD56] transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {paying ? '处理中...' : '微信支付（模拟）'}
              </button>
              <button
                onClick={handleCancel}
                className="w-full border-2 border-red-200 text-red-500 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-50 transition-all duration-500"
              >
                取消订单
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

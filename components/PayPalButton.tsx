import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

interface PayPalButtonProps {
  orderId: string;
  totalAmount: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export default function PayPalButton({ orderId, totalAmount, onSuccess, onError }: PayPalButtonProps) {
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);

  const createOrder = async () => {
    try {
      const res = await fetch('/api/orders/paypal-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '创建 PayPal 订单失败');
      }

      if (data.sandbox) {
        // 模拟模式：直接调用捕获接口
        await captureOrder(data.orderID || 'mock-paypal-id');
        return data.orderID || 'mock';
      }

      setPaypalOrderId(data.orderID);
      return data.orderID;
    } catch (err: any) {
      onError(err.message);
      throw err;
    }
  };

  const captureOrder = async (id: string) => {
    try {
      const res = await fetch('/api/orders/paypal-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paypalOrderId: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '捕获 PayPal 支付失败');
      }

      onSuccess();
    } catch (err: any) {
      onError(err.message);
    }
  };

  const onApprove = async (data: any) => {
    await captureOrder(data.orderID);
  };

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  if (!paypalClientId) {
    return (
      <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-xl">
        PayPal Client ID 未配置，使用模拟模式
        <button
          onClick={async () => {
            await captureOrder('mock-paypal-id');
          }}
          className="ml-2 underline"
        >
          点击模拟支付
        </button>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical', color: 'blue', shape: 'pill' }}
        createOrder={async () => {
          const id = await createOrder();
          return id;
        }}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal 支付错误:', err);
          onError('PayPal 支付失败，请重试');
        }}
        onCancel={() => {
          onError('用户取消了 PayPal 支付');
        }}
      />
    </PayPalScriptProvider>
  );
}

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { query } from "../../../lib/db";

// 动态导入 PayPal SDK
let PayPalClient: any = null;
try {
  const sdk = require("@paypal/paypal-server-sdk");
  PayPalClient = sdk.Client;
} catch {
  // SDK 未安装
}

function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!PayPalClient || !clientId || !clientSecret) {
    return null;
  }

  const Environment = require("@paypal/paypal-server-sdk").Environment;
  const isLive = process.env.PAYPAL_ENV === "live";
  const environment = isLive ? Environment.Production : Environment.Sandbox;

  return new PayPalClient({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    environment,
  });
}

// 获取当前登录用户
async function getSessionUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return null;

  const result = await query(
    'SELECT id FROM "users" WHERE email = $1 LIMIT 1',
    [session.user.email]
  );
  return result.rows[0]?.id || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getSessionUser(req, res);
  if (!userId) return res.status(401).json({ error: "未登录" });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: "订单ID不能为空" });

  try {
    // 获取订单
    const orderResult = await query(
      `SELECT * FROM "orders" WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "订单不存在" });
    }

    const order = orderResult.rows[0];
    if (order.status !== "pending") {
      return res.status(400).json({ error: "订单状态不正确" });
    }

    const client = getPayPalClient();
    if (!client) {
      // 未配置 PayPal，返回模拟响应
      return res.status(200).json({
        success: true,
        sandbox: true,
        message: "PayPal 未配置，使用模拟模式",
        orderID: `MOCK-PAYPAL-${Date.now()}`,
      });
    }

    // 创建 PayPal 订单
    const ordersController = new (require("@paypal/paypal-server-sdk").OrdersController)(client);

    const collect = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            referenceId: order.order_number,
            amount: {
              currencyCode: "USD",
              value: parseFloat(order.total_amount).toFixed(2),
            },
            description: `TailWag Order #${order.order_number}`,
          },
        ],
        applicationContext: {
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}?paypal=success`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}?paypal=cancelled`,
          userAction: "PAY_NOW",
          shippingPreference: "NO_SHIPPING",
        },
      },
    };

    const response = await ordersController.createOrder(collect);

    return res.status(200).json({
      success: true,
      orderID: response.result.id,
      status: response.result.status,
      sandbox: process.env.PAYPAL_ENV !== "live",
    });
  } catch (err: any) {
    console.error("创建 PayPal 订单失败:", err);
    return res.status(500).json({
      error: err.message || "创建 PayPal 订单失败",
    });
  }
}

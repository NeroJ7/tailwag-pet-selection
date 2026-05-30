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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getSessionUser(req, res);
  if (!userId) return res.status(401).json({ error: "未登录" });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, paypalOrderId } = req.body;
  if (!orderId || !paypalOrderId) {
    return res.status(400).json({ error: "订单ID和PayPal订单ID不能为空" });
  }

  try {
    // 验证订单属于当前用户
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
      // 模拟捕获
      await query(
        `UPDATE "orders" SET
          status = 'paid',
          payment_id = $1,
          payment_method = 'paypal',
          paid_at = NOW(),
          updated_at = NOW()
        WHERE id = $2`,
        [paypalOrderId, orderId]
      );
      return res.status(200).json({
        success: true,
        sandbox: true,
        message: "PayPal 模拟支付成功（未配置真实密钥）",
      });
    }

    // 捕获 PayPal 订单
    const ordersController = new (require("@paypal/paypal-server-sdk").OrdersController)(client);

    const response = await ordersController.captureOrder({
      id: paypalOrderId,
      prefer: "return=minimal",
    });

    if (response.result.status === "COMPLETED") {
      // 更新订单状态
      await query(
        `UPDATE "orders" SET
          status = 'paid',
          payment_id = $1,
          payment_method = 'paypal',
          paid_at = NOW(),
          updated_at = NOW()
        WHERE id = $2`,
        [paypalOrderId, orderId]
      );

      return res.status(200).json({
        success: true,
        captureId: response.result.id,
        status: response.result.status,
      });
    }

    return res.status(400).json({
      error: `PayPal 支付未完成，状态: ${response.result.status}`,
    });
  } catch (err: any) {
    console.error("捕获 PayPal 订单失败:", err);
    return res.status(500).json({
      error: "捕获 PayPal 订单失败，请稍后重试",
    });
  }
}

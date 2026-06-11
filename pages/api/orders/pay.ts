import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { query } from "../../../lib/db";
import { verifyCsrfToken, getCsrfTokenFromRequest } from "../../../lib/csrf";
import { createWechatPayV3 } from "../../../lib/wechat-pay-v3";
import { withRateLimit } from "../../../lib/rate-limit";

// 动态导入支付宝 SDK（避免未配置时报错）
let AlipaySdk: any = null;
try {
  AlipaySdk = require("alipay-sdk").default;
} catch {
  // SDK 未安装
}

// 获取当前登录用户
async function getSessionUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return null;
  }

  const result = await query(
    'SELECT id FROM "users" WHERE email = $1 LIMIT 1',
    [session.user.email]
  );

  return result.rows[0]?.id || null;
}

// 初始化支付宝 SDK
function getAlipaySdk() {
  if (!AlipaySdk) return null;

  const appId = process.env.ALIPAY_APP_ID;
  const privateKey = process.env.ALIPAY_PRIVATE_KEY;
  const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;

  if (!appId || !privateKey || !alipayPublicKey) {
    return null;
  }

  return new AlipaySdk({
    appId,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    alipayPublicKey: alipayPublicKey.replace(/\\n/g, "\n"),
    gateway: process.env.ALIPAY_GATEWAY || "https://openapi.alipaydev.com/gateway.do",
    signType: "RSA2",
  });
}

// 模拟支付（未配置真实支付时回退）
async function simulatePayment(orderId: string, paymentMethod: string, amount: number) {
  const paymentId = `PAY${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    success: true,
    paymentId,
    paymentMethod,
    amount,
    paidAt: new Date().toISOString(),
    sandbox: true,
  };
}

// 创建支付宝支付订单（PC网页支付）
async function createAlipayOrder(order: any, returnUrl: string) {
  const alipaySdk = getAlipaySdk();
  if (!alipaySdk) {
    return { success: false, useSandbox: true };
  }

  try {
    const result = await alipaySdk.exec("alipay.trade.page.pay", {
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/orders/alipay-notify`,
      return_url: returnUrl,
      bizContent: {
        out_trade_no: order.order_number,
        total_amount: parseFloat(order.total_amount).toFixed(2),
        subject: `TailWag 订单 #${order.order_number}`,
        product_code: "FAST_INSTANT_TRADE_PAY",
      },
    });

    // 支付宝返回的是一个 form 表单 HTML
    return {
      success: true,
      formHtml: result,
      sandbox: process.env.ALIPAY_GATEWAY?.includes("alipaydev") || false,
    };
  } catch (err: any) {
    console.error("支付宝下单失败:", err);
    return { success: false, error: "支付宝下单失败，请稍后重试" };
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getSessionUser(req, res);

  if (!userId) {
    return res.status(401).json({ error: "未登录" });
  }

  // POST: 支付订单
  if (req.method === "POST") {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
      return res.status(400).json({ error: "订单ID和支付方式不能为空" });
    }

    if (!["alipay", "wechat_pay", "sandbox"].includes(paymentMethod)) {
      return res.status(400).json({ error: "不支持的支付方式" });
    }

    try {
      // 获取订单信息
      const orderResult = await query(
        `SELECT * FROM "orders" WHERE id = $1 AND user_id = $2`,
        [orderId, userId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: "订单不存在" });
      }

      const order = orderResult.rows[0];

      if (order.status !== "pending") {
        return res.status(400).json({ error: "订单状态不正确，无法支付" });
      }

      // 支付宝支付
      if (paymentMethod === "alipay") {
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/orders/${orderId}?payment=success`;
        const payResult = await createAlipayOrder(order, returnUrl);

        if (payResult.success && payResult.formHtml) {
          return res.status(200).json({
            success: true,
            paymentMethod: "alipay",
            formHtml: payResult.formHtml,
            sandbox: payResult.sandbox,
          });
        }

        // 未配置支付宝或下单失败，回退到模拟支付
        if (payResult.useSandbox) {
          const paymentResult = await simulatePayment(orderId, "alipay", order.total_amount);
          await query(
            `UPDATE "orders" SET
              status = $1,
              payment_id = $2,
              payment_method = $3,
              paid_at = NOW(),
              updated_at = NOW()
            WHERE id = $4`,
            ["paid", paymentResult.paymentId, "alipay(sandbox)", orderId]
          );

          return res.status(200).json({
            success: true,
            message: "模拟支付成功（未配置真实支付宝密钥）",
            sandbox: true,
            payment: paymentResult,
          });
        }

        return res.status(400).json({ error: "支付宝下单失败，请稍后重试" });
      }

      // 微信支付（API v3）
      if (paymentMethod === "wechat_pay") {
        const wechatPay = createWechatPayV3();
        
        // 未配置微信支付，回退到模拟支付
        if (!wechatPay) {
          console.log("微信支付未配置，使用模拟支付");
          const paymentResult = await simulatePayment(orderId, "wechat_pay(sandbox)", order.total_amount);
          
          await query(
            `UPDATE "orders" SET
              status = $1,
              payment_id = $2,
              payment_method = $3,
              paid_at = NOW(),
              updated_at = NOW()
            WHERE id = $4`,
            ["paid", paymentResult.paymentId, "wechat_pay(sandbox)", orderId]
          );
          
          return res.status(200).json({
            success: true,
            message: "微信支付成功（模拟，未配置真实微信支付）",
            sandbox: true,
            payment: paymentResult,
          });
        }
        
        // 真实微信支付：Native 支付（扫码支付）
        try {
          const notifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://pet-selection-site.vercel.app'}/api/orders/wechat-notify-v3`;
          const amountInCents = Math.round(parseFloat(order.total_amount) * 100);
          
          const payResult = await wechatPay.createOrder({
            orderNumber: order.order_number,
            description: `TailWag 订单 #${order.order_number}`,
            amount: amountInCents,
            notifyUrl: notifyUrl,
            tradeType: 'NATIVE', // 扫码支付
          });
          
          if (payResult.code_url) {
            // 返回二维码链接给前端
            return res.status(200).json({
              success: true,
              paymentMethod: "wechat_pay",
              codeUrl: payResult.code_url,
              orderNumber: order.order_number,
              message: "请使用微信扫描二维码完成支付",
            });
          } else {
            console.error("微信支付下单失败:", payResult);
            return res.status(400).json({ 
              error: `微信支付下单失败: ${payResult.message || '未知错误'}` 
            });
          }
        } catch (err: any) {
          console.error("微信支付下单异常:", err);
          return res.status(500).json({ error: `微信支付下单异常: ${err.message}` });
        }
      }

      // 模拟支付（sandbox）
      if (paymentMethod === "sandbox") {
        const paymentResult = await simulatePayment(orderId, paymentMethod, order.total_amount);
        
        await query(
          `UPDATE "orders" SET
            status = $1,
            payment_id = $2,
            payment_method = $3,
            paid_at = NOW(),
            updated_at = NOW()
          WHERE id = $4`,
          ["paid", paymentResult.paymentId, paymentMethod, orderId]
        );

        return res.status(200).json({
          success: true,
          message: "模拟支付成功",
          sandbox: true,
          payment: paymentResult,
        });
      }

      // 不支持的支付方式
      return res.status(400).json({ error: "不支持的支付方式" });
    } catch (err: any) {
      console.error("支付订单失败:", err);
      return res.status(500).json({ error: "支付订单失败" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRateLimit(handler, 'payment');

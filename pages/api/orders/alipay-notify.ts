import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../lib/db";
import { withRateLimit } from "../../../lib/rate-limit";

// 动态导入支付宝 SDK
let AlipaySdk: any = null;
try {
  AlipaySdk = require("alipay-sdk").default;
} catch {
  // SDK 未安装
}

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const alipaySdk = getAlipaySdk();
  if (!alipaySdk) {
    console.error("支付宝 SDK 未配置，无法处理通知");
    return res.status(200).send("success");
  }

  try {
    // 验证签名
    const signVerified = alipaySdk.checkNotifySign(req.body);
    if (!signVerified) {
      console.error("支付宝通知签名验证失败");
      return res.status(400).send("fail");
    }

    const { out_trade_no, trade_no, trade_status } = req.body;

    if (trade_status === "TRADE_SUCCESS" || trade_status === "TRADE_FINISHED") {
      // 更新订单状态
      await query(
        `UPDATE "orders" SET
          status = 'paid',
          payment_id = $1,
          payment_method = 'alipay',
          paid_at = NOW(),
          updated_at = NOW()
        WHERE order_number = $2 AND status = 'pending'`,
        [trade_no, out_trade_no]
      );

      console.log(`支付宝支付成功: 订单=${out_trade_no}, 流水号=${trade_no}`);
    }

    // 必须返回 success，否则支付宝会重复通知
    return res.status(200).send("success");
  } catch (err: any) {
    console.error("处理支付宝通知失败:", err);
    return res.status(500).send("fail");
  }
}

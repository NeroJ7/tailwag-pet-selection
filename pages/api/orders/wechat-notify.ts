import { NextApiRequest, NextApiResponse } from 'next';
import { createWechatPay } from '../../../lib/wechat-pay';
import { query } from '../../../lib/db';
import { withRateLimit } from '../../../lib/rate-limit';

// 禁用默认 body 解析（微信回调是 XML）
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 读取 XML 数据
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    
    await new Promise<void>((resolve) => req.on('end', () => resolve()));

    const xmlData = Buffer.concat(chunks).toString('utf8');
    
    // 解析 XML（简化版，生产环境应使用 xml2js）
    const wechatPay = createWechatPay();
    if (!wechatPay) {
      console.error('微信支付未配置');
      return res.status(500).send('FAIL');
    }

    // 转换 XML 为 JSON
    const jsonData = wechatPay['xmlToJson'](xmlData);
    
    // 验证签名
    if (!wechatPay.verifyNotifySignature(jsonData)) {
      console.error('微信支付回调签名验证失败');
      return res.status(401).send(`
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[签名失败]]></return_msg>
        </xml>
      `);
    }

    // 处理支付成功
    if (jsonData.return_code === 'SUCCESS' && jsonData.result_code === 'SUCCESS') {
      const orderNumber = jsonData.out_trade_no;
      const transactionId = jsonData.transaction_id;
      const paidAt = new Date();

      // 更新订单状态
      await query(
        `UPDATE "orders" SET
          status = $1,
          payment_id = $2,
          payment_method = $3,
          paid_at = $4,
          updated_at = NOW()
        WHERE order_number = $5`,
        ['paid', transactionId, 'wechat_pay', paidAt, orderNumber]
      );

      console.log(`订单 ${orderNumber} 支付成功，交易ID: ${transactionId}`);
    } else {
      console.error('微信支付失败:', jsonData.err_code_des);
    }

    // 返回成功响应
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(`
      <xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
      </xml>
    `);
  } catch (err: any) {
    console.error('微信支付回调处理失败:', err);
    
    res.setHeader('Content-Type', 'application/xml');
    return res.status(500).send(`
      <xml>
        <return_code><![CDATA[FAIL]]></return_code>
        <return_msg><![CDATA[服务器错误]]></return_msg>
      </xml>
    `);
  }
}

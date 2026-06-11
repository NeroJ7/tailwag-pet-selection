// 微信支付 API v3 通知接口
import { NextApiRequest, NextApiResponse } from 'next';
import { createWechatPayV3 } from '../../../lib/wechat-pay-v3';
import { query } from '../../../lib/db';
import crypto from 'crypto';

// 禁用默认 body 解析（需要原始 body 验证签名）
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
    // 读取原始数据
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    
    await new Promise<void>((resolve) => req.on('end', () => resolve()));
    
    const rawBody = Buffer.concat(chunks).toString('utf8');
    const body = JSON.parse(rawBody);
    
    // 获取微信支付签名头
    const timestamp = req.headers['wechatpay-timestamp'] as string;
    const nonce = req.headers['wechatpay-nonce'] as string;
    const signature = req.headers['wechatpay-signature'] as string;
    const serial = req.headers['wechatpay-serial'] as string;
    
    // 验证签名（简化版，生产环境应使用微信平台证书验证）
    const wechatPay = createWechatPayV3();
    if (!wechatPay) {
      console.error('微信支付未配置');
      return res.status(500).json({ code: 'FAIL', message: '微信支付未配置' });
    }
    
    // 构造验签名串
    const signMessage = `${timestamp}\n${nonce}\n${rawBody}\n`;
    
    // TODO: 使用微信平台证书验证签名
    // 当前简化版：跳过签名验证（生产环境必须验证）
    
    // 解密通知数据
    const { event_type, resource } = body;
    
    if (event_type === 'TRANSACTION.SUCCESS') {
      // 解密 resource
      const { associated_data, nonce: resourceNonce, ciphertext } = resource;
      
      const apiV3Key = process.env.WECHAT_PAY_API_V3_KEY;
      if (!apiV3Key) {
        throw new Error('WECHAT_PAY_API_V3_KEY 未配置');
      }
      
      const key = Buffer.from(apiV3Key, 'utf-8');
      const iv = Buffer.from(resourceNonce, 'utf-8');
      const encryptedBuffer = Buffer.from(ciphertext, 'base64');
      
      const authTag = encryptedBuffer.subarray(encryptedBuffer.length - 16);
      const data = encryptedBuffer.subarray(0, encryptedBuffer.length - 16);
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      decipher.setAAD(Buffer.from(associated_data, 'utf-8'));
      
      const decrypted = Buffer.concat([
        decipher.update(data),
        decipher.final(),
      ]);
      
      const notifyData = JSON.parse(decrypted.toString('utf-8'));
      
      const orderNumber = notifyData.out_trade_no;
      const transactionId = notifyData.transaction_id;
      const tradeState = notifyData.trade_state;
      
      if (tradeState === 'SUCCESS') {
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
        
        console.log(`订单 ${orderNumber} 微信支付成功，交易ID: ${transactionId}`);
      }
    }
    
    // 返回成功响应
    return res.status(200).json({ code: 'SUCCESS', message: '成功' });
  } catch (err: any) {
    console.error('微信支付回调处理失败:', err);
    return res.status(500).json({ code: 'FAIL', message: err.message });
  }
}

export default handler;

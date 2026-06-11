// 微信支付 API v3 工具库
import crypto from 'crypto';

interface WechatPayConfig {
  appId: string; // 公众号/小程序 AppID（wx 开头）
  mchId: string; // 商户号
  apiV3Key: string; // APIv3 密钥
  privateKey: string; // 私钥（PEM 格式）
  certSerial: string; // 商户证书序列号
}

interface CreateOrderParams {
  orderNumber: string; // 商户订单号
  description: string; // 商品描述
  amount: number; // 金额（分）
  notifyUrl: string; // 回调 URL
  payerOpenId?: string; // 用户 OpenID（JSAPI 支付必需）
  tradeType: 'JSAPI' | 'NATIVE' | 'MWEB' | 'APP';
}

export class WechatPayV3 {
  private config: WechatPayConfig;
  private baseUrl: string;

  constructor(config: WechatPayConfig) {
    this.config = config;
    this.baseUrl = 'https://api.mch.weixin.qq.com';
  }

  // 生成签名
  private generateSignature(method: string, url: string, timestamp: string, nonceStr: string, body: string = ''): string {
    const signMessage = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${body}\n`;
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signMessage);
    const signature = sign.sign(this.config.privateKey, 'base64');
    
    return signature;
  }

  // 生成 Authorization 头
  private generateAuthorization(method: string, url: string, body: string = ''): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = crypto.randomBytes(16).toString('hex');
    
    const signature = this.generateSignature(method, url, timestamp, nonceStr, body);
    
    const tokenParts = [
      `mchid="${this.config.mchId}"`,
      `nonce_str="${nonceStr}"`,
      `signature="${signature}"`,
      `timestamp="${timestamp}"`,
      `serial_no="${this.config.certSerial}"`,
    ];
    
    return `WECHATPAY2-SHA256-RSA2048 ${tokenParts.join(',')}`;
  }

  // 创建订单
  async createOrder(params: CreateOrderParams): Promise<any> {
    let endpoint = '';
    
    switch (params.tradeType) {
      case 'JSAPI':
        endpoint = '/v3/pay/transactions/jsapi';
        break;
      case 'NATIVE':
        endpoint = '/v3/pay/transactions/native';
        break;
      case 'MWEB':
        endpoint = '/v3/pay/transactions/mweb';
        break;
      case 'APP':
        endpoint = '/v3/pay/transactions/app';
        break;
    }
    
    const body = JSON.stringify({
      appid: this.config.appId,
      mchid: this.config.mchId,
      description: params.description,
      out_trade_no: params.orderNumber,
      notify_url: params.notifyUrl,
      amount: {
        total: params.amount,
        currency: 'CNY',
      },
      ...(params.payerOpenId ? { payer: { openid: params.payerOpenId } } : {}),
    });
    
    const authorization = this.generateAuthorization('POST', endpoint, body);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authorization,
        'User-Agent': 'WechatPay-SDK/1.0',
      },
      body,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`微信支付创建订单失败: ${response.status} ${errorText}`);
    }
    
    return response.json();
  }

  // 查询订单
  async queryOrder(orderNumber: string): Promise<any> {
    const endpoint = `/v3/pay/transactions/out-trade-no/${orderNumber}?mchid=${this.config.mchId}`;
    const authorization = this.generateAuthorization('GET', endpoint);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': authorization,
        'User-Agent': 'WechatPay-SDK/1.0',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`查询订单失败: ${response.status} ${errorText}`);
    }
    
    return response.json();
  }

  // 关闭订单
  async closeOrder(orderNumber: string): Promise<any> {
    const endpoint = `/v3/pay/transactions/out-trade-no/${orderNumber}/close`;
    const body = JSON.stringify({
      mchid: this.config.mchId,
    });
    
    const authorization = this.generateAuthorization('POST', endpoint, body);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authorization,
        'User-Agent': 'WechatPay-SDK/1.0',
      },
      body,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`关闭订单失败: ${response.status} ${errorText}`);
    }
    
    return { success: true };
  }

  // 申请退款
  async refund(params: {
    orderNumber: string;
    refundNumber: string;
    reason?: string;
    refundAmount: number;
    totalAmount: number;
  }): Promise<any> {
    const endpoint = '/v3/refund/domestic/refunds';
    const body = JSON.stringify({
      out_trade_no: params.orderNumber,
      out_refund_no: params.refundNumber,
      reason: params.reason || '商品退款',
      amount: {
        refund: params.refundAmount,
        total: params.totalAmount,
        currency: 'CNY',
      },
    });
    
    const authorization = this.generateAuthorization('POST', endpoint, body);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authorization,
        'User-Agent': 'WechatPay-SDK/1.0',
      },
      body,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`申请退款失败: ${response.status} ${errorText}`);
    }
    
    return response.json();
  }

  // 解密回调数据（API v3 回调是加密的）
  decryptNotifyData(associatedData: string, nonce: string, ciphertext: string): any {
    const key = Buffer.from(this.config.apiV3Key, 'utf-8');
    const iv = Buffer.from(nonce, 'utf-8');
    const encryptedBuffer = Buffer.from(ciphertext, 'base64');
    
    const authTag = encryptedBuffer.subarray(encryptedBuffer.length - 16);
    const data = encryptedBuffer.subarray(0, encryptedBuffer.length - 16);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(associatedData, 'utf-8'));
    
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);
    
    return JSON.parse(decrypted.toString('utf-8'));
  }

  // 生成 JSAPI 支付参数（前端调起支付用）
  generateJsApiParams(prepayId: string): any {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = crypto.randomBytes(16).toString('hex');
    
    const signMessage = `${this.config.appId}\n${timestamp}\n${nonceStr}\nprepay_id=${prepayId}\n`;
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signMessage);
    const signature = sign.sign(this.config.privateKey, 'base64');
    
    return {
      appId: this.config.appId,
      timeStamp: timestamp,
      nonceStr: nonceStr,
      package: `prepay_id=${prepayId}`,
      signType: 'RSA',
      paySign: signature,
    };
  }
}

// 创建微信支付实例
export function createWechatPayV3(): WechatPayV3 | null {
  const appId = process.env.WECHAT_PAY_APP_ID;
  const mchId = process.env.WECHAT_PAY_MCH_ID;
  const apiV3Key = process.env.WECHAT_PAY_API_V3_KEY;
  const privateKey = process.env.WECHAT_PAY_PRIVATE_KEY;
  const certSerial = process.env.WECHAT_PAY_CERT_SERIAL;
  
  if (!appId || !mchId || !apiV3Key || !privateKey || !certSerial) {
    console.warn('微信支付未配置或配置不完整');
    return null;
  }
  
  // 处理私钥中的 \n（环境变量存储时会转义）
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
  
  return new WechatPayV3({
    appId,
    mchId,
    apiV3Key,
    privateKey: formattedPrivateKey,
    certSerial,
  });
}

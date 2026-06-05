// 微信支付工具库
import crypto from 'crypto';

interface WechatPayConfig {
  appId: string;
  mchId: string;
  apiKey: string;
  certPath?: string;
  privateKey?: string;
}

interface UnifiedOrderParams {
  orderNumber: string;
  description: string;
  amount: number; // 单位：分
  notifyUrl: string;
  openId?: string; // JSAPI 支付需要
  tradeType: 'JSAPI' | 'NATIVE' | 'MWEB' | 'APP';
}

interface NativePayResponse {
  codeUrl: string; // 二维码链接
}

export class WechatPay {
  private config: WechatPayConfig;
  private baseUrl: string;

  constructor(config: WechatPayConfig) {
    this.config = config;
    // 微信支付 API v3 端点
    this.baseUrl = 'https://api.mch.weixin.qq.com';
  }

  // 生成签名
  private generateSignature(data: Record<string, any>): string {
    const stringA = Object.keys(data)
      .sort()
      .filter(key => data[key] !== '' && key !== 'sign')
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    const stringSignTemp = `${stringA}&key=${this.config.apiKey}`;
    return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
  }

  // 统一下单
  async unifiedOrder(params: UnifiedOrderParams): Promise<NativePayResponse | any> {
    const url = `${this.baseUrl}/pay/unifiedorder`;
    
    const data: Record<string, any> = {
      appid: this.config.appId,
      mch_id: this.config.mchId,
      nonce_str: crypto.randomBytes(16).toString('hex'),
      body: params.description,
      out_trade_no: params.orderNumber,
      total_fee: params.amount,
      spbill_create_ip: '127.0.0.1',
      notify_url: params.notifyUrl,
      trade_type: params.tradeType,
    };

    // JSAPI 支付需要 openid
    if (params.tradeType === 'JSAPI' && params.openId) {
      data.openid = params.openId;
    }

    data.sign = this.generateSignature(data);

    // 转换为 XML
    const xmlData = this.jsonToXml(data);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xmlData,
    });

    const result = await response.text();
    return this.xmlToJson(result);
  }

  // 查询订单
  async queryOrder(orderNumber: string): Promise<any> {
    const url = `${this.baseUrl}/pay/orderquery`;
    
    const data: Record<string, any> = {
      appid: this.config.appId,
      mch_id: this.config.mchId,
      out_trade_no: orderNumber,
      nonce_str: crypto.randomBytes(16).toString('hex'),
    };

    data.sign = this.generateSignature(data);

    const xmlData = this.jsonToXml(data);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xmlData,
    });

    const result = await response.text();
    return this.xmlToJson(result);
  }

  // 关闭订单
  async closeOrder(orderNumber: string): Promise<any> {
    const url = `${this.baseUrl}/pay/closeorder`;
    
    const data: Record<string, any> = {
      appid: this.config.appId,
      mch_id: this.config.mchId,
      out_trade_no: orderNumber,
      nonce_str: crypto.randomBytes(16).toString('hex'),
    };

    data.sign = this.generateSignature(data);

    const xmlData = this.jsonToXml(data);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xmlData,
    });

    const result = await response.text();
    return this.xmlToJson(result);
  }

  // 申请退款
  async refund(params: {
    orderNumber: string;
    refundNumber: string;
    totalAmount: number;
    refundAmount: number;
    reason?: string;
  }): Promise<any> {
    const url = `${this.baseUrl}/secapi/pay/refund`;
    
    const data: Record<string, any> = {
      appid: this.config.appId,
      mch_id: this.config.mchId,
      out_trade_no: params.orderNumber,
      out_refund_no: params.refundNumber,
      total_fee: params.totalAmount,
      refund_fee: params.refundAmount,
      nonce_str: crypto.randomBytes(16).toString('hex'),
    };

    if (params.reason) {
      data.refund_desc = params.reason;
    }

    data.sign = this.generateSignature(data);

    const xmlData = this.jsonToXml(data);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xmlData,
    });

    const result = await response.text();
    return this.xmlToJson(result);
  }

  // JSON 转 XML
  private jsonToXml(data: Record<string, any>): string {
    let xml = '<xml>';
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined && data[key] !== null) {
        xml += `<${key}>${data[key]}</${key}>`;
      }
    }
    xml += '</xml>';
    return xml;
  }

  // XML 转 JSON
  private xmlToJson(xml: string): any {
    // 简化版 XML 解析（生产环境应使用 xml2js 等库）
    const result: Record<string, any> = {};
    const matches = xml.match(/<(\w+)>(.*?)<\/\1>/g);
    
    if (matches) {
      for (const match of matches) {
        const keyMatch = match.match(/<(\w+)>/);
        const valueMatch = match.match(/>([^<]+)</);
        
        if (keyMatch && valueMatch) {
          result[keyMatch[1]] = valueMatch[1];
        }
      }
    }
    
    return result;
  }

  // 验证回调签名
  verifyNotifySignature(data: Record<string, any>): boolean {
    const sign = data.sign;
    delete data.sign;
    
    const calculatedSign = this.generateSignature(data);
    return sign === calculatedSign;
  }
}

// 创建微信支付实例（根据环境变量）
export function createWechatPay(): WechatPay | null {
  const appId = process.env.WECHAT_PAY_APP_ID;
  const mchId = process.env.WECHAT_PAY_MCH_ID;
  const apiKey = process.env.WECHAT_PAY_API_KEY;

  if (!appId || !mchId || !apiKey) {
    return null;
  }

  return new WechatPay({
    appId,
    mchId,
    apiKey,
  });
}

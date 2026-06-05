import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>服务条款 - TailWag</title>
        <meta name="description" content="TailWag服务条款" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← 返回首页
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">服务条款</h1>
          <p className="text-sm text-gray-500 mb-8">生效日期：2026年1月1日</p>

          <div className="prose max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 服务说明</h2>
              <p>TailWag（以下简称"我们"）提供宠物用品电商平台服务，包括：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>宠物食品、玩具、用品的在线销售</li>
                <li>宠物健康记录管理</li>
                <li>个性化宠物用品推荐</li>
                <li>订单跟踪和售后服务</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 账户注册</h2>
              <p>使用我们的服务需要注册账户。您同意：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>提供真实、准确、完整的注册信息</li>
                <li>妥善保管账户和密码，对账户所有活动负责</li>
                <li>发现未授权使用应立即通知我们</li>
                <li>年满18岁或具有完全民事行为能力</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 订单与支付</h2>
              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">3.1 订单确认</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>下单后您将收到订单确认邮件</li>
                <li>我们保留因库存不足、价格错误等原因取消订单的权利</li>
                <li>订单取消后，退款将在7个工作日内处理</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">3.2 支付方式</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>支持支付宝、微信支付、PayPal等支付方式</li>
                <li>支付成功后才会进入发货流程</li>
                <li>支付失败或超时，订单将自动取消</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">3.3 价格与税费</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>所有价格均已包含增值税</li>
                <li>运费根据收货地址和订单金额计算</li>
                <li>我们保留调整价格的权利，已下单商品价格不受影响</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. 配送与退货</h2>
              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.1 配送</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>正常订单将在1-3个工作日内发货</li>
                <li>配送时间根据收货地址和物流公司而定</li>
                <li>物流信息将通过邮件或短信通知</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.2 退货政策</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>收到商品后<strong>7天内</strong>可申请无理由退货</li>
                <li>商品必须未使用、未损坏、包装完整</li>
                <li>退货运费由买家承担（质量问题除外）</li>
                <li>退款将在收到退货并确认无误后3-7个工作日内处理</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.3 换货政策</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>收到商品后<strong>15天内</strong>可申请换货</li>
                <li>换货仅适用于尺寸、颜色、款式不符的情况</li>
                <li>商品必须未使用、未损坏、包装完整</li>
                <li>换货运费由买家承担（质量问题除外）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. 知识产权</h2>
              <p>本平台所有内容（包括但不限于文字、图片、Logo、代码）均为TailWag或其许可方所有，受著作权法、商标法等法律保护。未经授权，不得复制、修改、传播。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 禁止行为</h2>
              <p>您不得：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>使用本平台进行任何违法活动</li>
                <li>干扰或破坏本平台的正常运行</li>
                <li>未经授权访问或篡改我们的系统</li>
                <li>利用本平台侵犯他人权益</li>
                <li>发布虚假信息或进行欺诈</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. 免责声明</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>本平台按"原样"提供，不保证服务不间断或无错误</li>
                <li>对于因不可抗力（如自然灾害、网络故障）导致的服务中断，我们不承担责任</li>
                <li>对于因您自身原因（如密码泄露）导致的损失，我们不承担责任</li>
                <li>我们的责任限额不超过您最近一笔订单的金额</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. 争议解决</h2>
              <p>因本服务条款引起的或与本服务条款有关的任何争议，双方应友好协商解决；协商不成的，任何一方均可向<strong>杭州市西湖区人民法院</strong>提起诉讼。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. 条款修改</h2>
              <p>我们保留随时修改本服务条款的权利。修改后的条款将在本页面发布，并标注新的生效日期。继续使用我们的服务即表示您接受修改后的条款。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. 联系我们</h2>
              <p>如有任何疑问，请联系我们：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>邮箱：legal@tailwag.com</li>
                <li>地址：中国浙江省杭州市西湖区</li>
                <li>客服时间：周一至周五 9:00-18:00</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2026 TailWag. 保留所有权利。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

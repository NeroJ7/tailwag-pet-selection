import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>隐私政策 - TailWag</title>
        <meta name="description" content="TailWag隐私政策" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← 返回首页
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">隐私政策</h1>
          <p className="text-sm text-gray-500 mb-8">生效日期：2026年1月1日</p>

          <div className="prose max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 信息收集</h2>
              <p>我们收集以下信息：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>账户信息</strong>：姓名、邮箱、密码（加密存储）</li>
                <li><strong>宠物信息</strong>：宠物名称、品种、年龄、健康记录</li>
                <li><strong>订单信息</strong>：收货地址、支付方式、购买记录</li>
                <li><strong>设备信息</strong>：IP地址、浏览器类型、访问时间</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 信息使用</h2>
              <p>我们使用您的信息用于：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>处理订单和发货</li>
                <li>提供个性化宠物用品推荐</li>
                <li>发送订单确认和物流通知</li>
                <li>改进我们的产品和服务</li>
                <li>防止欺诈和保护账户安全</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 信息分享</h2>
              <p>我们<strong>不会</strong>出售您的个人信息。仅在以下情况分享：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>支付处理</strong>：与支付宝、微信支付、PayPal等支付平台分享必要信息</li>
                <li><strong>物流配送</strong>：与快递公司分享收货地址和联系方式</li>
                <li><strong>法律要求</strong>：根据法律法规要求提供信息</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookie使用</h2>
              <p>我们使用Cookie用于：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>保持登录状态</li>
                <li>记住购物车内容</li>
                <li>分析网站流量（使用NextAuth.js会话管理）</li>
              </ul>
              <p className="mt-2">您可以通过浏览器设置禁用Cookie，但可能会影响网站功能。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. 数据安全</h2>
              <p>我们采取以下措施保护您的数据：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>密码使用bcrypt加密存储</li>
                <li>使用HTTPS加密传输数据</li>
                <li>数据库使用PostgreSQL，配备访问权限控制</li>
                <li>定期安全审计和漏洞修复</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 您的权利</h2>
              <p>根据《个人信息保护法》，您有权：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>查看我们收集的您的个人信息</li>
                <li>要求更正不准确的信息</li>
                <li>要求删除您的个人信息</li>
                <li>撤回同意（联系我们）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. 儿童隐私</h2>
              <p>我们的服务主要面向成年人。如果我们发现无意中收集了16岁以下儿童的个人信息，将立即删除。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. 政策更新</h2>
              <p>我们可能会不时更新本隐私政策。更新后将在本页面发布，并标注新的生效日期。重大变更将通过邮箱通知。</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. 联系我们</h2>
              <p>如有任何疑问，请联系我们：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>邮箱：privacy@tailwag.com</li>
                <li>地址：中国浙江省杭州市西湖区</li>
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

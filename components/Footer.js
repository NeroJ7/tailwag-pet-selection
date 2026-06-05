import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-white">TailWag</span>
            </Link>
            <p className="text-sm text-gray-400">
              全球宠物好物严选，为追求生活艺术的宠物家庭提供顶级用品。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm hover:text-white transition-colors">
                  所有商品
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-sm hover:text-white transition-colors">
                  个性化推荐
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm hover:text-white transition-colors">
                  购物车
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm hover:text-white transition-colors">
                  我的账户
                </Link>
              </li>
            </ul>
          </div>

          {/* 客户服务 */}
          <div>
            <h3 className="text-white font-semibold mb-4">客户服务</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/orders" className="text-sm hover:text-white transition-colors">
                  订单查询
                </Link>
              </li>
              <li>
                <a href="mailto:support@tailwag.com" className="text-sm hover:text-white transition-colors">
                  联系客服
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  服务条款
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:support@tailwag.com" className="hover:text-white transition-colors">
                  support@tailwag.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>中国浙江省杭州市西湖区</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🕐</span>
                <span>客服时间：周一至周五 9:00-18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} TailWag. 保留所有权利。
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

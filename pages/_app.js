import '../styles/globals.css'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="min-h-screen flex flex-col">
        <Head>
        <title>TailWag | 摇尾精选 — 全球宠物好物严选</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="TailWag 摇尾精选 — 为追求生活艺术的宠物家庭，严选全球顶级宠物用品。智能硬件、极地冻干、宠物家居，每一件都经12层筛选工序认证。" />
        <meta name="keywords" content="宠物用品,宠物严选,高端宠物,冻干零食,智能喂食器,猫爬架,宠物床,TailWag,摇尾精选" />
        <meta name="author" content="TailWag Selection" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TailWag | 摇尾精选 — 全球宠物好物严选" />
        <meta property="og:description" content="为追求生活艺术的少数派而生。我们跨越国界，为您严选每一件具有革新精神与高尚质感的宠物生活作品。" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:site_name" content="TailWag 摇尾精选" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TailWag | 摇尾精选 — 全球宠物好物严选" />
        <meta name="twitter:description" content="为追求生活艺术的宠物家庭，严选全球顶级宠物用品。" />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80" />
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <meta name="theme-color" content="#f97316" />
        </Head>
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
  </SessionProvider>
)
}

export default MyApp

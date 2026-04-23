import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import products from '../../data/products.json';
import { addToCart } from '../../utils/cart-util';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Find product by id from query, fallback to first product if not found
  const product = products.find(p => p.id === id) || products[0];

  const handleAddToCart = () => {
    addToCart(product);
    alert('已加入甄选清单');
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/cart');
  };

  if (!product) return <div className="min-h-screen bg-brand-cream flex items-center justify-center font-black uppercase tracking-widest">Loading...</div>;

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-orange selection:text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
        {/* Breadcrumbs */}
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-stone mb-12 flex items-center space-x-4">
          <a href="/" className="hover:text-brand-orange transition-colors">Home</a>
          <span className="opacity-30">/</span>
          <span className="opacity-30">{product.category}</span>
          <span className="opacity-30">/</span>
          <span className="text-brand-charcoal">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-20 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-premium relative group">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute top-10 left-10">
                <span className="bg-brand-charcoal text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.3em]">
                  {product.tag}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {product.images.map((img, i) => (
                <div key={i} className={`aspect-square rounded-3xl overflow-hidden border-2 transition-all duration-500 cursor-pointer hover:scale-105 ${i === 0 ? 'border-brand-orange' : 'border-transparent bg-white shadow-sm'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col sticky top-40">
            <div className="mb-12">
              <div className="text-xs font-black uppercase tracking-[0.5em] text-brand-orange mb-6">{product.brand} Selection</div>
              <h1 className="text-5xl md:text-6xl font-black text-brand-charcoal mb-6 tracking-tighter leading-none">{product.name}</h1>
              <div className="h-1 w-20 bg-brand-orange mb-10"></div>
              <div className="text-5xl font-black text-brand-charcoal tracking-tighter">
                <span className="text-2xl font-normal mr-2">¥</span>{product.price}
              </div>
            </div>

            {/* Core Value: Why TailWag */}
            <div className="bg-white rounded-[2.5rem] p-10 mb-10 shadow-premium border border-stone-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="flex items-center text-brand-charcoal font-black text-xs uppercase tracking-widest mb-6">
                <span className="mr-3 text-lg">✨</span> TailWag 优选理由
              </h3>
              <p className="text-brand-stone text-sm leading-loose font-medium italic relative z-10">
                “{product.selectionReason}”
              </p>
            </div>

            <p className="text-brand-stone mb-12 leading-loose font-medium text-lg">
              {product.description}
            </p>

            {/* Specs */}
            <div className="space-y-6 mb-12">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-stone-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-stone opacity-60">{spec.label}</span>
                  <span className="text-sm font-black text-brand-charcoal uppercase tracking-widest">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-6">
              <button 
                onClick={handleBuyNow}
                className="w-full bg-brand-charcoal text-white py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-orange hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95 shadow-premium"
              >
                立即甄选 — ¥{product.price}
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-full bg-white text-brand-charcoal border-2 border-stone-100 py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:border-brand-charcoal transition-all duration-500 active:scale-95"
              >
                加入购物车
              </button>
            </div>

            {/* Transparency Commitment */}
            <div className="mt-16 grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-stone-50 shadow-sm flex flex-col items-center text-center">
                <span className="text-2xl mb-4">🛡️</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal mb-2">产地溯源</p>
                <p className="text-[8px] text-brand-stone font-bold leading-tight">100% 透明供应链</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-stone-50 shadow-sm flex flex-col items-center text-center">
                <span className="text-2xl mb-4">✈️</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal mb-2">极速配送</p>
                <p className="text-[8px] text-brand-stone font-bold leading-tight">顺丰/联邦快递直达</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-32 pt-32 border-t border-stone-100">
          <div className="grid lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8">
              <h3 className="text-4xl font-black text-brand-charcoal mb-16 tracking-tighter">生命之礼 · <span className="title-serif text-brand-orange">用户回响</span></h3>
              <div className="space-y-12">
                {product.reviews.map((rev, i) => (
                  <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm border border-stone-50 relative group hover:shadow-premium transition-all duration-700">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center font-black text-brand-orange text-xs uppercase">
                          {rev.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-brand-charcoal text-xs uppercase tracking-widest">{rev.user}</p>
                          <p className="text-[8px] font-black text-brand-stone uppercase tracking-[0.3em] opacity-40">Verified Purchase</p>
                        </div>
                      </div>
                      <div className="flex text-brand-orange text-[10px]">
                        {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                      </div>
                    </div>
                    <p className="text-lg text-brand-charcoal font-medium leading-relaxed italic">
                      “{rev.comment}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-brand-charcoal text-white p-12 rounded-[3rem] sticky top-40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <h4 className="text-xl font-black mb-8 relative z-10">关于选品委员会</h4>
                <p className="text-stone-400 text-sm leading-loose mb-10 font-medium relative z-10">
                  TailWag 每一款入驻商品均需经过由 12 位资深兽医、5 位宠物行为学专家及 100 位真实用户组成的委员会严苛投票。
                </p>
                <a href="/selection-process" className="inline-block text-brand-orange font-black text-[10px] uppercase tracking-[0.4em] hover:text-white transition-colors">了解更多选品标准 &rarr;</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;

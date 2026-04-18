import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="premium-card group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Hover overlay with action */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 w-3/4">
          <button className="w-full bg-white text-brand-charcoal py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-brand-orange hover:text-white transition-colors">
            立即抢购 — ¥{product.price}
          </button>
        </div>

        <div className="absolute top-6 left-6">
          <span className="bg-white/90 backdrop-blur-sm text-brand-charcoal text-[10px] font-black px-4 py-2 rounded-full shadow-sm tracking-widest uppercase border border-white/50">
            {product.tag}
          </span>
        </div>
      </div>
      
      <div className="py-8 px-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] text-brand-stone mb-1 font-black uppercase tracking-[0.2em]">{product.brand}</div>
            <h3 className="text-xl font-bold text-brand-charcoal group-hover:text-brand-orange transition-colors duration-300 tracking-tight">{product.name}</h3>
          </div>
        </div>
        
        <div className="mb-6 relative">
          <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-orange-200 group-hover:bg-brand-orange transition-colors"></div>
          <p className="pl-4 text-xs text-brand-stone leading-relaxed font-medium italic">
            “{product.selectionReason}”
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">In Stock / Premium Quality</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

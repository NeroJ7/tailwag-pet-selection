import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="premium-card group relative flex flex-col items-center text-center">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] w-full mb-10 group-hover:shadow-premium transition-all duration-700 hover:shadow-2xl">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-in-out"
        />
        
        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="absolute bottom-10 left-10 right-10 translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out z-20">
          <button className="w-full bg-white text-brand-charcoal py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-orange hover:text-white transition-all duration-500 hover:scale-105 active:scale-95">
            Purchase — ¥{product.price}
          </button>
        </div>

        <div className="absolute top-8 left-8">
          <span className="bg-white/95 backdrop-blur-md text-brand-charcoal text-[9px] font-black px-6 py-2 rounded-full shadow-sm tracking-[0.3em] uppercase border border-white/50 relative overflow-hidden group/tag">
            {product.tag}
            <div className="absolute inset-0 bg-brand-orange/10 -translate-x-full group-hover/tag:translate-x-0 transition-transform duration-500"></div>
          </span>
        </div>
      </div>
      
      <div className="w-full px-6 flex flex-col items-center">
        <div className="text-[9px] text-brand-stone mb-3 font-black uppercase tracking-[0.5em] opacity-60">{product.brand}</div>
        <h3 className="text-2xl font-black text-brand-charcoal group-hover:text-brand-orange transition-colors duration-500 tracking-tight leading-tight mb-6">
          {product.name}
        </h3>
        
        <div className="relative w-full max-w-[200px] mb-8">
          <div className="h-[1px] w-12 bg-stone-100 mx-auto group-hover:w-full group-hover:bg-brand-orange transition-all duration-700"></div>
        </div>
        
        <div className="mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
          <p className="text-sm text-brand-stone leading-loose font-medium italic italic">
            “{product.selectionReason}”
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-auto">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Curation / Verified</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

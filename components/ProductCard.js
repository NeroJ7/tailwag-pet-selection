import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {product.tag}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{product.brand}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
        
        <div className="bg-orange-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-orange-800 leading-relaxed italic">
            “{product.selectionReason}”
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-2xl font-black text-gray-900">
            <span className="text-sm font-normal mr-1">¥</span>{product.price}
          </div>
          <button className="bg-gray-900 text-white p-2 rounded-lg hover:bg-orange-500 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

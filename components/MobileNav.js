import React, { useState, useEffect } from 'react';
import { getCart } from '../utils/cart-util';

const MobileNav = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    window.addEventListener('cart-updated', updateCartCount);
    updateCartCount();
    return () => window.removeEventListener('cart-updated', updateCartCount);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass px-10 py-4 flex justify-between items-center z-50 pb-8 rounded-t-[2.5rem] shadow-2xl">
      <a href="/" className="flex flex-col items-center space-y-1 text-brand-orange">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">首页</span>
      </a>
      <a href="/orders" className="flex flex-col items-center space-y-1 text-brand-stone hover:text-brand-orange transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">订单</span>
      </a>
      <a href="/cart" className="flex flex-col items-center space-y-1 text-brand-stone hover:text-brand-orange relative transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[8px] h-3 w-3 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-black uppercase tracking-tighter">清单</span>
      </a>
      <a href="/dashboard" className="flex flex-col items-center space-y-1 text-brand-stone hover:text-brand-orange transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">看板</span>
      </a>
    </div>
  );
};

export default MobileNav;

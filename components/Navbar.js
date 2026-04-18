import React, { useState } from 'react';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="glass py-6 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-3">
            <span className="text-3xl font-black text-brand-orange italic tracking-tighter hover:scale-105 transition-transform">TailWag</span>
            <span className="hidden sm:inline text-xs text-brand-stone font-semibold tracking-widest uppercase">/ PREMIUM SELECTION</span>
          </a>
        </div>
        
        <div className="hidden lg:flex space-x-12 text-brand-charcoal font-semibold text-sm tracking-wide">
          <a href="/" className="hover:text-brand-orange transition relative group">
            首页
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
          </a>
          <a href="/selection-process" className="hover:text-brand-orange transition relative group">
            选品标准
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-brand-orange transition relative group">
            所有商品
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-brand-orange transition relative group">
            智能用品
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-brand-charcoal hover:text-brand-orange transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <a href="/cart" className="text-brand-charcoal hover:text-brand-orange relative transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">2</span>
          </a>

          <a href="/login" className="hidden md:flex bg-brand-charcoal text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-brand-orange hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 items-center space-x-2">
            <span>会员中心</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

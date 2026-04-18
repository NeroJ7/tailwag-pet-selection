import React, { useState } from 'react';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black text-orange-500 italic tracking-tighter">TailWag</span>
            <span className="hidden sm:inline text-sm text-gray-400 font-medium">| 摇尾精选</span>
          </a>
        </div>
        
        <div className="hidden lg:flex space-x-8 text-gray-700 font-bold text-sm uppercase tracking-wide">
          <a href="/" className="hover:text-orange-500 transition">首页</a>
          <a href="/selection-process" className="hover:text-orange-500 transition">选品标准</a>
          <a href="#" className="hover:text-orange-500 transition">所有商品</a>
          <a href="#" className="hover:text-orange-500 transition">智能用品</a>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <a href="/cart" className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full relative transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">2</span>
          </a>

          <a href="/login" className="hidden md:block bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-200 transition-all">
            会员中心
          </a>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

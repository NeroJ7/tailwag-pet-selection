import React from 'react';

const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass px-10 py-4 flex justify-between items-center z-50 pb-8 rounded-t-[2.5rem] shadow-2xl">
      <a href="/" className="flex flex-col items-center space-y-1 text-brand-orange">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">首页</span>
      </a>
      <a href="/selection-process" className="flex flex-col items-center space-y-1 text-brand-stone hover:text-brand-orange transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">标准</span>
      </a>
      <a href="/cart" className="flex flex-col items-center space-y-1 text-brand-stone hover:text-brand-orange relative transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[8px] h-3 w-3 flex items-center justify-center rounded-full">2</span>
        <span className="text-[10px] font-black uppercase tracking-tighter">口袋</span>
      </a>
      <a href="/login" className="flex flex-col items-center space-y-1 text-brand-stone hover:text-brand-orange transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-tighter">账户</span>
      </a>
    </div>
  );
};

export default MobileNav;

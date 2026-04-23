import React, { useState, useEffect } from 'react';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 py-4 ${scrolled ? 'py-4 glass shadow-glass' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/" className="group flex items-center space-x-4">
              <span className="text-3xl md:text-4xl font-black text-brand-charcoal italic tracking-tighter group-hover:text-brand-orange transition-colors duration-500">TailWag</span>
              <div className="hidden lg:block h-8 w-[1px] bg-stone-200"></div>
              <span className="hidden lg:block text-[10px] font-black text-stone-400 tracking-[0.5em] uppercase">Selection</span>
            </a>
          </div>
          
          <div className="hidden lg:flex items-center space-x-16 text-brand-charcoal font-black text-[10px] uppercase tracking-[0.3em]">
            {[
              { label: '首页', href: '/' },
              { label: '选品标准', href: '/selection-process' },
              { label: '溯源看板', href: '/dashboard' },
              { label: '招商入驻', href: '/brand-recruitment' }
            ].map((item, i) => (
              <a key={i} href={item.href} className="hover:text-brand-orange transition-all duration-300 relative group">
                {item.label}
                <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-brand-orange transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-3 text-brand-charcoal hover:text-brand-orange hover:bg-white rounded-full transition-all duration-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <a href="/cart" className="p-3 text-brand-charcoal hover:text-brand-orange hover:bg-white rounded-full relative transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute top-2 right-2 bg-brand-orange text-white text-[8px] font-black h-4 w-4 flex items-center justify-center rounded-full ring-4 ring-white shadow-lg">2</span>
              </a>
            </div>

            <a href="/login" className="hidden md:flex bg-brand-charcoal text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-orange hover:shadow-2xl hover:shadow-orange-200 transition-all duration-500 hover:-translate-y-1 active:scale-95">
              Member Center
            </a>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

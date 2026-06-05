import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import products from '../data/products.json';

const HOT_TAGS = ['智能饮水机', '冻干三文鱼', '护脊宠物床', '全自动猫砂盆', '美毛营养'];

// Simple debounce hook
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Memoized product card to reduce re-renders
const ProductCard = React.memo(function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={() => onClick(product.id)}
      className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-brand-cream/80 transition-all duration-200 group"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-brand-charcoal truncate group-hover:text-brand-orange transition-colors">
          {product.name}
        </h4>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {product.brand}
        </p>
      </div>
      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="text-base font-black text-brand-orange">
          ¥{product.price}
        </p>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
          {product.category}
        </span>
      </div>
    </div>
  );
});

// Memoized mini product card for recommendations
const MiniProductCard = React.memo(function MiniProductCard({ product, onClick }) {
  return (
    <div
      onClick={() => onClick(product.id)}
      className="flex items-center gap-4 cursor-pointer hover:bg-brand-cream/80 p-2 rounded-xl transition-all duration-200 group"
    >
      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-brand-charcoal truncate group-hover:text-brand-orange transition-colors">
          {product.name}
        </p>
        <p className="text-xs text-gray-400">{product.brand}</p>
      </div>
      <span className="text-sm font-black text-brand-orange flex-shrink-0">
        ¥{product.price}
      </span>
    </div>
  );
});

export default function SearchModal({ isOpen, onClose, onProductClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Debounce search query to avoid excessive filtering
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Memoize search results to avoid re-computing on every render
  const results = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (!query) return [];

    return products.filter((p) =>
      [p.name, p.brand, p.category, p.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [debouncedQuery]);

  const handleTagClick = useCallback((tag) => {
    setSearchQuery(tag);
    inputRef.current?.focus();
  }, []);

  const handleProductClick = useCallback((id) => {
    onClose();
    if (onProductClick) {
      onProductClick(id);
    } else {
      window.location.assign(`/product/detail?id=${id}`);
    }
  }, [onClose, onProductClick]);

  if (!isOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const showResults = query.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 sm:p-8">
          {/* Search Input */}
          <div className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索优选好物（如：智能猫砂盆、冻干）…"
              className="w-full pl-12 pr-16 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange text-base outline-none placeholder:text-gray-300 transition-all"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-2 text-gray-400 hover:text-brand-charcoal font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              ESC
            </button>
          </div>

          {/* Debounce indicator */}
          {searchQuery !== debouncedQuery && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              正在输入...
            </div>
          )}

          {/* Search Results */}
          {showResults ? (
            <div className="mt-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                搜索结果 · {results.length} 件甄选好物
                {searchQuery !== debouncedQuery && ' (更新中...)'}
              </p>

              {results.length > 0 ? (
                <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {results.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-gray-400 font-semibold">暂无相关甄选作品</p>
                  <p className="text-xs text-gray-300 mt-1">换个关键词试试？</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Hot Tags */}
              <div className="mt-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  热门搜索
                </h4>
                <div className="flex flex-wrap gap-2">
                  {HOT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-4 py-2 bg-brand-cream hover:bg-brand-orange hover:text-white rounded-lg text-sm text-gray-600 font-semibold transition-all duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Preview - sample products */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  甄选推荐
                </h4>
                <div className="space-y-3">
                  {products.slice(0, 3).map((product) => (
                    <MiniProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

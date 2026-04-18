import React from 'react';

const SearchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="搜索优选好物（如：智能猫砂盆、冻干）..." 
              className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-lg outline-none"
              autoFocus
            />
            <button 
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 font-medium"
            >
              取消
            </button>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">热门搜索</h4>
            <div className="flex flex-wrap gap-2">
              {['智能饮水机', '冻干三文鱼', '护脊宠物床', '全自动猫砂盆', '美毛营养'].map((tag) => (
                <button key={tag} className="px-4 py-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm text-gray-600 transition">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">最近预览</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">智能恒温循环饮水机</p>
                  <p className="text-xs text-gray-400">¥299</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

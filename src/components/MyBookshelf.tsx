import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, BookOpen, Trash2, ExternalLink, Library } from 'lucide-react';
import { STATIC_BOOKS } from '../data/booksData';
import { BookItem } from '../types';

export const BOOKSHELF_SYNC_EVENT = 'my_bookshelf_sync';
const STORAGE_KEY = 'doc_va_tre_bookmarks';

export default function MyBookshelf({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedIds(JSON.parse(saved));
    };
    load();
    window.addEventListener(BOOKSHELF_SYNC_EVENT, load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener(BOOKSHELF_SYNC_EVENT, load);
      window.removeEventListener('storage', load);
    };
  }, []);

  const savedBooks = STATIC_BOOKS.filter(b => savedIds.includes(b.id));

  const removeBook = (id: string) => {
    const next = savedIds.filter(i => i !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSavedIds(next);
    window.dispatchEvent(new Event(BOOKSHELF_SYNC_EVENT));
  };

  const clearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ tủ sách cá nhân?')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setSavedIds([]);
      window.dispatchEvent(new Event(BOOKSHELF_SYNC_EVENT));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#FAF7F0] shadow-2xl z-50 flex flex-col border-l border-[#D6CDBF]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#D6CDBF] flex items-center justify-between bg-[#E3DCCF]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center shadow-sm">
                  <Library size={20} />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#3A3530]">Tủ Sách Của Tôi</h3>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#6B635A]">
                    {savedBooks.length} cuốn đã lưu
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#FAF7F0] rounded-full transition-colors cursor-pointer text-[#6B635A]"
              >
                <X size={22} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {savedBooks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                  <BookOpen size={48} className="mb-4 text-[#B56D4F]" />
                  <p className="font-lora text-sm">Tủ sách của bạn còn trống.<br/>Hãy lưu những cuốn sách bạn yêu thích từ Thư viện nhé!</p>
                </div>
              ) : (
                savedBooks.map(book => (
                  <div 
                    key={book.id}
                    className="bg-white p-4 rounded-2xl border border-[#D6CDBF] shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-[#D6CDBF]">
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543004629-ff569f872783?w=200'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair font-bold text-sm text-[#3A3530] truncate">{book.title}</h4>
                        <p className="text-[11px] text-[#6B635A] truncate mb-2">{book.author}</p>
                        <div className="flex items-center gap-2">
                          <a 
                            href={book.readUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-[#B56D4F] hover:underline flex items-center gap-1"
                          >
                            Đọc ngay <ExternalLink size={10} />
                          </a>
                          <span className="text-[#D6CDBF]">|</span>
                          <button 
                            onClick={() => removeBook(book.id)}
                            className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Xóa <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {savedBooks.length > 0 && (
              <div className="p-4 border-t border-[#D6CDBF] bg-[#FAF7F0]">
                <button
                  onClick={clearAll}
                  className="w-full py-3 border-2 border-[#D6CDBF] text-[#6B635A] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Xóa tất cả
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

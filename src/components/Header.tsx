import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, ArrowUpRight, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageId } from '../types';
import MyBookshelf, { BOOKSHELF_SYNC_EVENT } from './MyBookshelf';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isHeroOverlay?: boolean;
}

export default function Header({ currentPage, onNavigate, isHeroOverlay = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Sync scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync bookmark count
  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem('doc_va_tre_bookmarks');
      if (saved) {
        setBookmarkCount(JSON.parse(saved).length);
      } else {
        setBookmarkCount(0);
      }
    };
    updateCount();
    window.addEventListener(BOOKSHELF_SYNC_EVENT, updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener(BOOKSHELF_SYNC_EVENT, updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'reading-habits', label: 'Thói quen đọc' },
    { id: 'genres', label: 'Thể loại sách hot' },
    { id: 'library', label: 'Thư viện sách' },
    { id: 'survey', label: 'Khảo sát' },
    { id: 'about', label: 'Về chúng mình' },
  ];

  const handleLinkClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine header styling
  const isDarkTone = isHeroOverlay && !scrolled;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isDarkTone
            ? 'bg-[#010101]/60 backdrop-blur-md border-b border-white/10 text-white'
            : 'bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#D6CDBF] text-[#3A3530] shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Col 1: Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer shrink-0"
            aria-label="Về trang chủ Đọc & Trẻ"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                isDarkTone
                  ? 'bg-[#B56D4F]/20 text-[#B56D4F] border border-[#B56D4F]/30'
                  : 'bg-[#FAF7F0] text-[#B56D4F] border border-[#D6CDBF]'
              }`}
            >
              <BookOpen size={22} strokeWidth={2} />
            </div>
            <div>
              <span
                className={`font-playfair text-xl sm:text-2xl font-bold tracking-tight block ${
                  isDarkTone ? 'text-white' : 'text-[#3A3530]'
                }`}
              >
                Đọc & Trẻ
              </span>
              <span
                className={`text-[10px] tracking-wider uppercase block font-lora -mt-0.5 ${
                  isDarkTone ? 'text-white/60' : 'text-[#6B635A]'
                }`}
              >
                Văn hóa đọc giới trẻ
              </span>
            </div>
          </button>

          {/* Col 2: Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative py-1.5 font-lora text-[15px] transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? isDarkTone
                        ? 'text-white font-medium'
                        : 'text-[#B56D4F] font-semibold'
                      : isDarkTone
                      ? 'text-white/75 hover:text-white'
                      : 'text-[#3A3530] hover:text-[#B56D4F]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="header-active-pill"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B56D4F]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Col 3: Tools, CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Bookshelf Trigger */}
            <button
              onClick={() => setIsBookshelfOpen(true)}
              className={`p-2 rounded-lg transition-all cursor-pointer relative group ${
                isDarkTone ? 'text-white hover:bg-white/10' : 'text-[#3A3530] hover:bg-[#EBE5D9]'
              }`}
              title="Tủ sách cá nhân"
            >
              <Library size={20} />
              <AnimatePresence>
                {bookmarkCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#B56D4F] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#F5F1E8]"
                  >
                    {bookmarkCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* CTA Survey button */}
            <button
              onClick={() => handleLinkClick('survey')}
              className={`hidden md:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                currentPage === 'survey'
                  ? 'bg-[#9A5A3F] text-white shadow-sm ring-2 ring-[#B56D4F]/40'
                  : 'bg-[#B56D4F] text-white hover:bg-[#9A5A3F] shadow-xs active:scale-95'
              }`}
            >
              <span>Làm khảo sát</span>
              <ArrowUpRight size={15} />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                isDarkTone
                  ? 'text-white hover:bg-white/10'
                  : 'text-[#3A3530] hover:bg-[#EBE5D9]'
              }`}
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Persistent Tools */}
      <MyBookshelf 
        isOpen={isBookshelfOpen} 
        onClose={() => setIsBookshelfOpen(false)} 
      />

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-20 left-4 right-4 z-50 lg:hidden mobile-menu-glass rounded-2xl p-6 flex flex-col gap-4 text-center bg-[#FAF7F0]/95 backdrop-blur-md border border-[#D6CDBF] shadow-2xl text-[#3A3530]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D6CDBF]">
              <span className="font-playfair text-lg text-[#3A3530] font-semibold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#6B635A] hover:text-[#3A3530] p-1 cursor-pointer"
                aria-label="Đóng menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`py-2 text-base font-lora rounded-lg transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-[#B56D4F] text-white font-medium'
                      : 'text-[#3A3530] hover:bg-[#EBE5D9]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => handleLinkClick('survey')}
              className="w-full py-3 bg-[#B56D4F] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Tham gia khảo sát</span>
              <ArrowUpRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

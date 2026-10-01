import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, ArrowUpRight, Library, User, LogOut, ChevronDown, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageId } from '../types';
import MyBookshelf, { BOOKSHELF_SYNC_EVENT } from './MyBookshelf';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isHeroOverlay?: boolean;
}

export default function Header({ currentPage, onNavigate, isHeroOverlay = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Sync scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to auth changes and fetch custom avatar
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (currentUser) {
        // Listen to Firestore for custom profile data
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCustomAvatar(data.avatarBase64 || null);
            setCustomName(data.displayName || null);
          } else {
            setCustomAvatar(null);
            setCustomName(null);
          }
        });
      } else {
        setCustomAvatar(null);
        setCustomName(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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
            {/* User Profile / Auth Trigger */}
            <div className="relative">
              {user ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isDarkTone ? 'hover:bg-white/10' : 'hover:bg-[#EBE5D9]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#B56D4F] flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-white/20 shadow-sm">
                      {customAvatar ? (
                        <img src={customAvatar} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                      ) : user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        user.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={16} />
                      )}
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#D6CDBF] overflow-hidden py-2"
                      >
                        <div className="px-4 py-3 border-b border-[#F5F1E8] mb-1">
                          <p className="text-xs font-bold text-[#6B635A] uppercase tracking-widest mb-1">Tài khoản</p>
                          <p className="text-sm font-semibold text-[#3A3530] truncate">
                            {user.isAnonymous ? 'Khách ẩn danh' : (customName || user.displayName || user.email)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setIsProfileModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#3A3530] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                        >
                          <User size={16} />
                          <span>Chỉnh sửa hồ sơ</span>
                        </button>

                        <button
                          onClick={() => {
                            signOut(auth);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={16} />
                          <span>Đăng xuất</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isDarkTone 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-[#EBE5D9] text-[#3A3530] hover:bg-[#D6CDBF]'
                  }`}
                >
                  <LogIn size={16} />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              )}
            </div>

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

            {/* My Bookshelf Trigger */}
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

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {user && (
        <ProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
        />
      )}

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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

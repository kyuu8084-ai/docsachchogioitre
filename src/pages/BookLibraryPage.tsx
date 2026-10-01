import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  SlidersHorizontal,
  ExternalLink,
  BookMarked,
  Sparkles,
  Smile,
  Skull,
  GraduationCap,
  Layers,
  Star,
  MessageSquareQuote,
  Lightbulb,
  Compass,
  Award,
  BookCheck,
  ShieldCheck,
  Brain,
  Tag,
  Globe
} from 'lucide-react';
import { BookItem, Category, PageId } from '../types';
import { STATIC_BOOKS } from '../data/booksData';
import MostarParallaxBackground from '../components/MostarParallaxBackground';
import { BOOKSHELF_SYNC_EVENT } from '../components/MyBookshelf';

const STORAGE_KEY = 'doc_va_tre_bookmarks';

interface BookLibraryPageProps {
  onNavigate: (page: PageId) => void;
}

export default function BookLibraryPage({ onNavigate }: BookLibraryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState<'all' | 'title' | 'author'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'title'>('title');
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [feedbackToast, setFeedbackToast] = useState<string>('');
  const [isReviewsLoaded, setIsReviewsLoaded] = useState<boolean>(false);

  // Load bookmarks on mount and listen for sync events
  useEffect(() => {
    const loadBookmarks = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedBookIds(JSON.parse(saved));
    };
    loadBookmarks();
    window.addEventListener(BOOKSHELF_SYNC_EVENT, loadBookmarks);
    window.addEventListener('storage', loadBookmarks);
    return () => {
      window.removeEventListener(BOOKSHELF_SYNC_EVENT, loadBookmarks);
      window.removeEventListener('storage', loadBookmarks);
    };
  }, []);

  // Fetch reviews and verified metadata from backend API on mount
  useEffect(() => {
    fetch('/api/books/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsReviewsLoaded(true);
        }
      })
      .catch((err) => {
        console.warn('Fetched local reviews fallback:', err);
        setIsReviewsLoaded(true);
      });
  }, []);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast('');
    }, 2800);
  };

  const toggleBookmark = (e: React.MouseEvent, book: BookItem) => {
    e.stopPropagation();
    let next: string[];
    if (savedBookIds.includes(book.id)) {
      next = savedBookIds.filter((id) => id !== book.id);
      triggerToast(`Đã gỡ "${book.title}" khỏi tủ sách của bạn`);
    } else {
      next = [...savedBookIds, book.id];
      triggerToast(`Đã lưu "${book.title}" vào tủ sách yêu thích!`);
    }
    setSavedBookIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(BOOKSHELF_SYNC_EVENT));
  };

  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-amber-300 text-stone-900 rounded-xs px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const categories = [
    { id: 'all', label: 'Tất cả sách', icon: BookOpen, count: STATIC_BOOKS.length },
    { id: Category.COMEDY, label: 'Hài hước (Comedy)', icon: Smile, count: STATIC_BOOKS.filter(b => b.category === Category.COMEDY).length },
    { id: Category.HORROR, label: 'Kinh dị (Horror)', icon: Skull, count: STATIC_BOOKS.filter(b => b.category === Category.HORROR).length },
    { id: Category.EDUCATION, label: 'Học tập (Education)', icon: GraduationCap, count: STATIC_BOOKS.filter(b => b.category === Category.EDUCATION).length },
    { id: Category.COMICS, label: 'Truyện tranh (Comics)', icon: Layers, count: STATIC_BOOKS.filter(b => b.category === Category.COMICS).length },
  ];

  const getCategoryLabel = (category: Category) => {
    switch (category) {
      case Category.COMEDY: return 'Hài hước';
      case Category.HORROR: return 'Kinh dị';
      case Category.EDUCATION: return 'Học tập';
      case Category.COMICS: return 'Truyện tranh';
      default: return category;
    }
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case Category.COMEDY: return 'bg-amber-600';
      case Category.HORROR: return 'bg-rose-700';
      case Category.EDUCATION: return 'bg-emerald-700';
      case Category.COMICS: return 'bg-sky-600';
      default: return 'bg-[#B56D4F]';
    }
  };

  // Remove Vietnamese diacritics for ultra-tolerant fuzzy matching (e.g., "doraemon", "doremon", "nguyen nhat anh", "nguyễn nhật ánh")
  const normalizeStr = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
  };

  const filteredBooks = useMemo(() => {
    const rawQ = searchQuery.trim();
    const qLower = rawQ.toLowerCase();
    const qNorm = normalizeStr(rawQ);

    return STATIC_BOOKS.filter((book) => {
      const matchCat = selectedCategory === 'all' || book.category === selectedCategory;
      if (!rawQ) return matchCat;

      const titleLower = book.title.toLowerCase();
      const titleNorm = normalizeStr(book.title);
      const authorLower = book.author.toLowerCase();
      const authorNorm = normalizeStr(book.author);

      let matchSearch = false;
      if (searchTarget === 'title') {
        matchSearch = titleLower.includes(qLower) || titleNorm.includes(qNorm);
      } else if (searchTarget === 'author') {
        matchSearch = authorLower.includes(qLower) || authorNorm.includes(qNorm);
      } else {
        // 'all': Match either title OR author (or relevant description fallback)
        matchSearch =
          titleLower.includes(qLower) ||
          titleNorm.includes(qNorm) ||
          authorLower.includes(qLower) ||
          authorNorm.includes(qNorm) ||
          book.description.toLowerCase().includes(qLower) ||
          getCategoryLabel(book.category).toLowerCase().includes(qLower);
      }

      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      const yearA = parseInt(a.publishedYear, 10) || 0;
      const yearB = parseInt(b.publishedYear, 10) || 0;
      if (sortBy === 'year-desc') return yearB - yearA;
      if (sortBy === 'year-asc') return yearA - yearB;
      return 0;
    });
  }, [searchQuery, searchTarget, selectedCategory, sortBy]);

  return (
    <div className="relative w-full min-h-screen font-lora overflow-hidden">
      {/* Cinematic Mostar parallax layered background */}
      <MostarParallaxBackground />

      {/* Main Content Layer (Z-10 over the background) */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Toast Feedback Notification */}
        <AnimatePresence>
          {feedbackToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-6 z-50 bg-[#111411]/95 text-[#fdf1e1] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#fdf1e1]/20 text-xs sm:text-sm font-sans backdrop-blur-md"
            >
              <Check size={16} className="text-[#fdf1e1]" />
              <span>{feedbackToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Banner - Semi-transparent and clear to showcase the Mostar background */}
        <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-transparent text-[#fdf1e1]">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#fdf1e1] bg-black/40 border border-white/25 backdrop-blur-md shadow-lg mb-4">
              <BookMarked size={14} className="text-[#fdf1e1]" />
              <span className="font-sans">CHUYÊN ĐỀ 03 · THƯ VIỆN SÁCH & TRI THỨC TUYỂN CHỌN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-emerald-300 font-sans font-medium lowercase">đã xác thực nguồn đọc</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-[#fdf1e1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]" style={{ fontFamily: '"Ogg Medium", Georgia, serif' }}>
              Thư Viện Sách
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#fdf1e1] font-lora leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
              Tuyển tập 40 tác phẩm kinh điển — Phân tích chi tiết <strong>Giá trị giáo dục</strong>, <strong>Chủ đề cốt lõi</strong> và các bài học thực tế dành riêng cho độc giả trẻ.
            </p>

            {/* Real-time Search Bar & Filter Options */}
            <div className="max-w-2xl mx-auto relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={20} />
                <input
                  type="text"
                  placeholder={
                    searchTarget === 'title'
                      ? 'Lọc thời gian thực theo Tên sách (VD: Đắc Nhân Tâm, Rừng Na Uy, Harry Potter...)'
                      : searchTarget === 'author'
                      ? 'Lọc thời gian thực theo Tác giả (VD: Nguyễn Nhật Ánh, Stephen King, Haruki Murakami...)'
                      : 'Lọc thời gian thực theo Tên sách hoặc Tác giả (VD: Conan, Dale Carnegie, Sapiens...)'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-black/40 hover:bg-black/50 focus:bg-black/65 backdrop-blur-sm rounded-2xl border border-white/35 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-300/80 focus:border-transparent shadow-xl transition-all text-[#fdf1e1] placeholder-white/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              {/* Scope filter selector & suggestion keywords */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
                {/* Search Target Mode Toggle */}
                <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/20">
                  <button
                    type="button"
                    onClick={() => setSearchTarget('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      searchTarget === 'all'
                        ? 'bg-[#fdf1e1] text-[#111411] font-bold shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchTarget('title')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      searchTarget === 'title'
                        ? 'bg-[#fdf1e1] text-[#111411] font-bold shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Theo tựa sách
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchTarget('author')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      searchTarget === 'author'
                        ? 'bg-[#fdf1e1] text-[#111411] font-bold shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Theo tác giả
                  </button>
                </div>

                {/* Instant Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-white/60 text-[11px]">Gợi ý:</span>
                  {['Nguyễn Nhật Ánh', 'Stephen King', 'Doraemon', 'Atomic Habits'].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setSearchQuery(kw)}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-white/10 hover:bg-white/25 border border-white/20 text-[#fdf1e1] transition-all cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {searchQuery && (
                <div className="mt-2 text-xs text-white/90 font-sans flex items-center justify-between px-2 bg-black/30 py-1.5 rounded-lg border border-white/15">
                  <span>
                    Đang lọc {searchTarget === 'title' ? 'tựa sách' : searchTarget === 'author' ? 'tác giả' : 'sách'} với từ khóa: <strong className="text-amber-300">"{searchQuery}"</strong> ({filteredBooks.length} kết quả)
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="underline text-amber-200 hover:text-white cursor-pointer ml-2 text-[11px]"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer font-sans flex items-center gap-2 backdrop-blur-sm ${
                      selectedCategory === cat.id
                        ? 'bg-[#fdf1e1] text-[#111411] shadow-xl font-bold border border-white scale-105'
                        : 'bg-black/30 hover:bg-black/50 text-[#fdf1e1] border border-white/20 shadow-md'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{cat.label}</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.id ? 'bg-[#111411]/15 text-[#111411]' : 'bg-white/20 text-white'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* NEW: General Recommended Websites Section */}
            <div className="mt-12 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center md:text-left space-y-2 flex-1">
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                    <Sparkles className="text-amber-300" size={24} />
                    <span>Kho Website Đọc Sách Đề Xuất</span>
                  </h3>
                  <p className="text-sm text-white/80 font-lora">
                    Dự án Đọc & Trẻ đề xuất các nền tảng uy tín nhất để bạn tìm kiếm và trải nghiệm trọn vẹn tri thức từ các đầu sách trong thư viện.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto shrink-0">
                  {[
                    { name: 'DTV-eBook', url: 'https://dtv-ebook.com.vn', icon: BookOpen },
                    { name: 'TruyenQQ', url: 'https://truyenqqviet.com', icon: Layers },
                    { name: 'SachVui', url: 'https://sachvui.vn', icon: Smile },
                    { name: 'Vukhoa', url: 'https://vukhoa.com', icon: GraduationCap }
                  ].map((site) => (
                    <a 
                      key={site.name}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all hover:scale-105 group"
                    >
                      <site.icon size={20} className="text-amber-300 group-hover:text-white transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">{site.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Main Grid Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Results Counter & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/20">
          <div className="text-sm text-[#fdf1e1]/90 font-lora">
            Hiển thị <span className="font-bold text-[#fdf1e1]">{filteredBooks.length}</span> tác phẩm
            {savedBookIds.length > 0 && (
              <span className="ml-3 text-xs text-[#111411] font-semibold bg-[#fdf1e1] px-2.5 py-1 rounded-lg">
                Đã lưu: {savedBookIds.length} cuốn
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#fdf1e1]/90 font-sans">
            <SlidersHorizontal size={14} />
            <span>Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/50 text-[#fdf1e1] border border-white/30 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-white/60"
            >
              <option value="title">Tên sách (A-Z)</option>
              <option value="year-desc">Năm xuất bản (Mới nhất)</option>
              <option value="year-asc">Năm xuất bản (Cổ điển nhất)</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 p-8 max-w-lg mx-auto text-[#fdf1e1]">
            <BookOpen size={40} className="mx-auto text-white/60 mb-3 opacity-60" />
            <h3 className="font-playfair text-xl font-bold text-white mb-2">
              Không tìm thấy sách phù hợp
            </h3>
            <p className="text-sm text-white/70 mb-5">
              Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc thể loại.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchTarget('all');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 bg-[#fdf1e1] text-[#111411] text-xs font-semibold rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Đặt lại toàn bộ bộ lọc
            </button>
          </div>
        ) : (
          /* Book Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredBooks.map((book) => {
              const isSaved = savedBookIds.includes(book.id);

              return (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedBook(book)}
                  className="bg-[#fdf1e1]/95 backdrop-blur-md rounded-2xl border border-[#fdf1e1]/50 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
                >
                  {/* Top Cover Image banner */}
                  <div className="relative h-60 w-full overflow-hidden bg-[#1a1412] flex items-center justify-center">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    
                    {/* Shadow overlay at bottom for ultra-crisp tag & rating readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />

                    {/* Bookmark Button in Top Right */}
                    <button
                      onClick={(e) => toggleBookmark(e, book)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer z-20 ${
                        isSaved
                          ? 'bg-[#B56D4F] text-white shadow-lg'
                          : 'bg-black/50 text-white hover:bg-white hover:text-[#B56D4F]'
                      }`}
                      title={isSaved ? 'Gỡ khỏi danh sách lưu' : 'Lưu vào danh sách'}
                      aria-label="Lưu sách"
                    >
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>

                    {/* Meta tags directly on the image bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      {/* Left: Category Pill */}
                      <span className={`font-semibold text-[11px] text-white px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider font-sans ${getCategoryColor(book.category)}`}>
                        {getCategoryLabel(book.category)}
                      </span>

                      {/* Right: Published Year */}
                      <span className="text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/15 font-sans font-medium">
                        Năm {book.publishedYear}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating and Reviews Counter */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1 text-amber-600 text-xs font-bold font-sans">
                          <Star size={13} className="fill-amber-500 text-amber-500" />
                          <span>{book.rating ? book.rating.toFixed(1) : '4.8'}</span>
                          <span className="text-[#8a8075] text-[11px] font-normal">
                            ({book.reviewCount || 150}+ đánh giá)
                          </span>
                        </div>

                        <span className="text-[10px] text-[#B56D4F] font-bold uppercase tracking-wider bg-[#B56D4F]/10 px-2 py-0.5 rounded-full font-sans">
                          Review tuyển chọn
                        </span>
                      </div>

                      <h3 className="font-playfair text-lg font-bold text-[#111411] group-hover:text-[#B56D4F] transition-colors leading-snug line-clamp-1 mb-1">
                        {renderHighlightedText(book.title, searchQuery)}
                      </h3>
                      
                      <div className="text-xs font-lora text-[#5c544d] mb-2.5">
                        Tác giả: <strong className="text-[#111411] font-semibold">{renderHighlightedText(book.author, searchQuery)}</strong>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs sm:text-[13px] text-[#5c544d] font-lora leading-relaxed line-clamp-2 mb-3">
                        {book.description}
                      </p>

                      {/* Highlight: Sách giúp ích gì cho bạn */}
                      {book.howItHelpsYou && (
                        <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#d8cdb8] mb-3 text-[11px] leading-relaxed">
                          <div className="flex items-center gap-1.5 font-bold text-[#2D7F60] font-sans uppercase tracking-wider text-[10px] mb-1">
                            <Lightbulb size={12} className="shrink-0" />
                            <span>Giúp gì cho bạn:</span>
                          </div>
                          <p className="text-[#3A3530] font-lora line-clamp-2 italic">
                            "{book.howItHelpsYou}"
                          </p>
                        </div>
                      )}

                      {/* Theme chips */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-3">
                        {(book.coreThemes || ['Tri thức', 'Kỹ năng']).slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-sans font-medium bg-[#EBE5D9] text-[#5c544d] border border-[#d8cdb8]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-[#d8cdb8] flex items-center justify-between text-xs">
                      <span className="text-xs font-semibold text-[#5c544d] group-hover:text-[#B56D4F] flex items-center gap-1 transition-colors">
                        <span>Chi tiết tác phẩm</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom invitation */}
        <div className="mt-16 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center max-w-3xl mx-auto shadow-2xl text-[#fdf1e1]">
          <h4 className="font-playfair text-xl sm:text-2xl font-bold mb-2 text-[#fdf1e1]">
            Bạn có tựa sách nào tâm đắc muốn đề xuất thêm?
          </h4>
          <p className="text-sm text-white/80 font-lora mb-6 max-w-xl mx-auto">
            Chia sẻ cảm nhận và đề xuất cuốn sách bạn yêu thích nhất để cùng xây dựng thư viện phong phú hơn cho độc giả trẻ.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('survey')}
              className="px-6 py-2.5 bg-[#fdf1e1] hover:bg-white text-[#111411] text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Gửi đề xuất sách qua Khảo Sát</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('genres')}
              className="px-6 py-2.5 bg-black/40 hover:bg-black/60 text-[#fdf1e1] border border-white/30 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer backdrop-blur-sm"
            >
              Xem phân tích thể loại
            </button>
          </div>
        </div>
      </section>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-[#FAF7F0] w-full max-w-2xl rounded-2xl border-2 border-[#D6CDBF] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-5 right-5 text-[#6B635A] hover:text-[#3A3530] p-1.5 rounded-lg hover:bg-[#EBE5D9] transition-colors cursor-pointer"
                aria-label="Đóng modal"
              >
                <X size={20} />
              </button>

              {/* Cover Banner inside Modal */}
              <div className="relative h-56 sm:h-64 w-full rounded-xl overflow-hidden mb-5 border border-[#D6CDBF] bg-[#1a1816] flex items-center justify-center">
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-full h-full object-contain sm:object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className={`px-3 py-1 rounded-md font-semibold text-xs shadow-md ${getCategoryColor(selectedBook.category)}`}>
                    {getCategoryLabel(selectedBook.category)}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md font-sans text-xs">
                    Xuất bản: Năm {selectedBook.publishedYear}
                  </span>
                </div>
              </div>

              {/* Title & Author */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#3A3530] mb-1">
                    {selectedBook.title}
                  </h3>
                  <div className="text-sm font-semibold text-[#B56D4F]">
                    Tác giả: {selectedBook.author}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-700">
                    <Star size={15} className="fill-amber-500 text-amber-500" />
                    <span className="font-bold text-sm font-sans">{selectedBook.rating ? selectedBook.rating.toFixed(1) : '4.8'}</span>
                  </div>
                  <span className="text-[11px] text-[#8a8075] mt-0.5">
                    {selectedBook.reviewCount || 200}+ bạn đọc đánh giá
                  </span>
                </div>
              </div>

              {/* SECTION: TỔNG QUAN REVIEW & GIÁ TRỊ TÁC PHẨM (Nói về điều gì & Giúp gì cho bạn) */}
              <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Khối 1: Sách nói về cái gì? */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-600/20">
                  <div className="flex items-center gap-2 font-bold text-amber-800 text-xs uppercase tracking-wider font-sans mb-1.5">
                    <Compass size={16} className="text-amber-700" />
                    <span>Cuốn sách nói về điều gì?</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#3A3530] font-lora leading-relaxed">
                    {selectedBook.whatItIsAbout || selectedBook.description}
                  </p>
                </div>

                {/* Khối 2: Sách giúp ích gì cho mình? */}
                <div className="p-4 rounded-2xl bg-[#2D7F60]/5 border border-[#2D7F60]/20">
                  <div className="flex items-center gap-2 font-bold text-[#2D7F60] text-xs uppercase tracking-wider font-sans mb-1.5">
                    <Lightbulb size={16} className="text-[#2D7F60]" />
                    <span>Cuốn sách giúp ích gì cho bạn?</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#3A3530] font-lora leading-relaxed">
                    {selectedBook.howItHelpsYou || 'Mở rộng thế giới quan, rèn luyện tư duy sâu sắc và mang lại những giây phút thư giãn quý giá sau những giờ học tập căng thẳng.'}
                  </p>
                </div>
              </div>

              {/* SECTION: GIÁ TRỊ GIÁO DỤC & CÁC CHỦ ĐỀ CỐT LÕI (Educational Value & Core Themes) */}
              <div className="mb-5 bg-gradient-to-r from-[#FAF7F0] to-[#F5EFE6] p-4 sm:p-5 rounded-2xl border border-[#D6CDBF] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A3530] font-sans">
                  <Brain size={16} className="text-[#B56D4F]" />
                  <span>Giá trị giáo dục & Rèn luyện kỹ năng tư duy</span>
                </div>

                <p className="text-xs sm:text-[13px] text-[#5c544d] font-lora leading-relaxed">
                  {selectedBook.educationalValue ||
                    (selectedBook.category === Category.EDUCATION
                      ? 'Nâng cao năng lực tự học, khai phóng tư duy phản biện, làm chủ kỹ năng quản lý thời gian và nâng tầm hiểu biết về cơ chế hoạt động của xã hội.'
                      : selectedBook.category === Category.COMEDY
                      ? 'Rèn luyện óc quan sát sắc sảo, khả năng châm biếm lành mạnh, nuôi dưỡng lòng bao dung và sự lạc quan đối diện trước những nghịch cảnh cuộc đời.'
                      : selectedBook.category === Category.HORROR
                      ? 'Khai thác tâm lý học hành vi, sự thấu hiểu về cơ chế nỗi sợ của con người, xây dựng bản lĩnh kiên cường và lòng dũng cảm khi đứng trước áp lực lớn.'
                      : 'Kích hoạt trí tưởng tượng vô hạn, tình yêu cái đẹp của nghệ thuật truyện tranh, bồi đắp lòng trắc ẩn, tình đồng đội và ý chí vượt khó vươn lên.')}
                </p>

                {/* Core Themes tags */}
                <div className="pt-2 border-t border-[#D6CDBF]/70 flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#6B635A] font-sans">
                    <Tag size={13} className="text-[#B56D4F]" />
                    <span>Chủ đề cốt lõi:</span>
                  </div>
                  {(selectedBook.coreThemes || [
                    'Bản lĩnh sống',
                    'Tư duy phản biện',
                    'Nuôi dưỡng tâm hồn',
                    'Kỷ luật tự thân'
                  ]).map((theme, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#B56D4F] border border-[#D6CDBF] shadow-2xs"
                    >
                      #{theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* Review thực tế từ độc giả tuyển chọn */}
              {selectedBook.review && (
                <div className="mb-5 bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#D6CDBF] shadow-2xs">
                  <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-[#EBE5D9]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#B56D4F] text-white flex items-center justify-center text-xs font-bold font-sans">
                        {selectedBook.review.reviewerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-sans font-bold text-xs sm:text-sm text-[#3A3530] block">
                          {selectedBook.review.reviewerName}
                        </span>
                        {selectedBook.review.reviewerRole && (
                          <span className="text-[11px] text-[#8a8075] font-lora block">
                            {selectedBook.review.reviewerRole}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {selectedBook.review.quote && (
                    <blockquote className="italic font-lora text-xs sm:text-[13px] text-[#B56D4F] font-semibold mb-2">
                      {selectedBook.review.quote}
                    </blockquote>
                  )}

                  <p className="text-xs sm:text-[13px] text-[#6B635A] font-lora leading-relaxed">
                    {selectedBook.review.howItHelpsYou}
                  </p>
                </div>
              )}

              {/* Bài học cốt lõi (Key Takeaway) */}
              {selectedBook.keyTakeaway && (
                <div className="mb-5 bg-[#FAF7F0] p-4 rounded-xl border-l-4 border-l-[#B56D4F] border border-[#D6CDBF]">
                  <div className="flex items-center gap-1.5 font-bold text-[#B56D4F] text-xs uppercase tracking-wider font-sans mb-1">
                    <Award size={15} />
                    <span>Bài học cốt lõi đọng lại:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3A3530] font-lora font-medium leading-relaxed">
                    "{selectedBook.keyTakeaway}"
                  </p>
                </div>
              )}

              {/* Article Summary Footer */}
              <div className="mb-6 bg-[#EBE5D9]/70 p-4 rounded-xl border border-[#D6CDBF]">
                <h4 className="font-playfair font-bold text-sm text-[#3A3530] uppercase tracking-wider mb-1.5">
                  Tóm tắt cốt truyện:
                </h4>
                <p className="text-sm text-[#3A3530] leading-relaxed font-lora">
                  {selectedBook.description}
                </p>
              </div>

              {/* Long Description if available */}
              {selectedBook.longDescription && (
                <div className="mb-6">
                  <h4 className="font-playfair font-bold text-base text-[#3A3530] mb-2">
                    Nội dung chi tiết & Bối cảnh:
                  </h4>
                  <p className="text-sm text-[#6B635A] leading-relaxed font-lora">
                    {selectedBook.longDescription}
                  </p>
                </div>
              )}

              {/* Recommended Reading Sources Box */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#D6CDBF] mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="text-[#B56D4F]" size={20} />
                  <h4 className="font-bold text-sm text-[#3A3530] uppercase tracking-wider font-sans">
                    Nguồn đọc đề xuất cho thể loại này:
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBook.category === Category.COMICS ? (
                    <>
                      <a href="https://truyenqqviet.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded-xl border border-[#D6CDBF] hover:border-[#B56D4F] transition-all group/link">
                        <span className="text-xs font-bold text-[#3A3530]">TruyenQQ (Manga/Comics)</span>
                        <ExternalLink size={14} className="text-[#6B635A] group-hover/link:text-[#B56D4F]" />
                      </a>
                      <a href="https://nettruyenco.vn" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded-xl border border-[#D6CDBF] hover:border-[#B56D4F] transition-all group/link">
                        <span className="text-xs font-bold text-[#3A3530]">NetTruyen (Truyện tranh)</span>
                        <ExternalLink size={14} className="text-[#6B635A] group-hover/link:text-[#B56D4F]" />
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="https://dtv-ebook.com.vn" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded-xl border border-[#D6CDBF] hover:border-[#B56D4F] transition-all group/link">
                        <span className="text-xs font-bold text-[#3A3530]">DTV-eBook (Kho sách lớn)</span>
                        <ExternalLink size={14} className="text-[#6B635A] group-hover/link:text-[#B56D4F]" />
                      </a>
                      <a href="https://vukhoa.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded-xl border border-[#D6CDBF] hover:border-[#B56D4F] transition-all group/link">
                        <span className="text-xs font-bold text-[#3A3530]">Vukhoa.com (Sách kỹ năng)</span>
                        <ExternalLink size={14} className="text-[#6B635A] group-hover/link:text-[#B56D4F]" />
                      </a>
                    </>
                  )}
                </div>
                <p className="mt-3 text-[10px] text-[#6B635A] italic font-lora">
                  * Vui lòng tìm kiếm tên sách trực tiếp trên các website trên để có trải nghiệm đọc tốt nhất.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#D6CDBF] flex items-center justify-between font-sans">
                <button
                  onClick={(e) => toggleBookmark(e, selectedBook)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                    savedBookIds.includes(selectedBook.id)
                      ? 'bg-[#B56D4F] text-white border-[#B56D4F]'
                      : 'bg-white text-[#3A3530] border-[#D6CDBF] hover:bg-[#EBE5D9]'
                  }`}
                >
                  <Bookmark size={15} />
                  <span>
                    {savedBookIds.includes(selectedBook.id) ? 'Đã lưu vào tủ sách' : 'Lưu vào tủ sách'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

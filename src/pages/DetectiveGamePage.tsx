import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SearchCode as MagnifyingGlass, 
  Map, 
  Calendar, 
  Award, 
  Trophy, 
  ChevronRight, 
  X, 
  Check, 
  Library, 
  User, 
  Flame, 
  RefreshCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Stamp,
  Ghost,
  Camera,
  Share2,
  Clock,
  Heart,
  ArrowRight
} from 'lucide-react';
import { PageId, BookItem } from '../types';
import { STATIC_BOOKS } from '../data/booksData';
import { GAME_HINTS, GameHint } from '../data/gameData';
import VintageSeparator from '../components/VintageSeparator';

interface DetectiveGamePageProps {
  onNavigate: (page: PageId) => void;
  onImmersiveChange?: (isImmersive: boolean) => void;
}

type GameState = 'home' | 'playing' | 'result';

export default function DetectiveGamePage({ onNavigate, onImmersiveChange }: DetectiveGamePageProps) {
  const [gameState, setGameState] = useState<GameState>('home');
  const [attempts, setAttempts] = useState(5);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [suggestions, setSuggestions] = useState<BookItem[]>([]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [dailyMystery, setDailyMystery] = useState<{ book: BookItem, gameHint: GameHint } | null>(null);
  const [streak, setStreak] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(() => {
    const saved = localStorage.getItem('detective_current_index');
    return saved ? parseInt(saved) : Math.floor(Math.random() * GAME_HINTS.length);
  });

  // Auto-suggestion ref
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Trigger immersive mode when playing
  useEffect(() => {
    if (onImmersiveChange) {
      onImmersiveChange(gameState === 'playing');
    }
    // Cleanup when component unmounts
    return () => {
      if (onImmersiveChange) onImmersiveChange(false);
    };
  }, [gameState, onImmersiveChange]);

  // Load the current mystery based on puzzleIndex
  useEffect(() => {
    const gameHint = GAME_HINTS[puzzleIndex];
    const book = STATIC_BOOKS.find(b => b.id === gameHint.id);
    if (book) {
      setDailyMystery({ book, gameHint });
    }
  }, [puzzleIndex]);

  // Handle auto-refresh countdown after solving
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'result' && isCorrect) {
      setTimeLeft(10);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next puzzle
            const nextIndex = (puzzleIndex + 1) % GAME_HINTS.length;
            setPuzzleIndex(nextIndex);
            localStorage.setItem('detective_current_index', nextIndex.toString());
            
            // Reset game state for next round
            setIsCorrect(false);
            setAttempts(5);
            setCurrentHintIndex(0);
            setGuess('');
            setHistory([]);
            setShowStamp(false);
            setShowSummaryModal(false);
            setGameState('playing');
            
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, isCorrect, puzzleIndex]);

  // Separate effect for one-time initialization
  useEffect(() => {
    // Load streak from localStorage
    const savedStreak = localStorage.getItem('detective_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  // Handle auto-suggestions
  useEffect(() => {
    if (guess.length > 1) {
      const filtered = STATIC_BOOKS.filter(b => 
        b.title.toLowerCase().includes(guess.toLowerCase()) || 
        b.author.toLowerCase().includes(guess.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [guess]);

  const startCase = () => {
    if (isCorrect) {
      setGameState('result');
      return;
    }
    setGameState('playing');
    setAttempts(5);
    setCurrentHintIndex(0);
    setIsCorrect(false);
    setGuess('');
    setScore(0);
    setShowStamp(false);
    setHistory([]);
  };

  const handleGuess = (selectedBook?: BookItem) => {
    const bookToGuess = selectedBook || STATIC_BOOKS.find(b => b.title.toLowerCase() === guess.toLowerCase());
    
    if (!bookToGuess) return;

    const now = new Date();
    const timeInSeconds = Math.floor(now.getTime() / 1000);
    const seed = Math.floor(timeInSeconds / 10);

    if (bookToGuess.id === dailyMystery?.book.id) {
      const finalScore = attempts * 20;
      setScore(finalScore);
      setIsCorrect(true);
      setShowStamp(true);
      setHistory([...history, bookToGuess.title]);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('detective_streak', newStreak.toString());
      localStorage.setItem(`solved_detective_seed_${seed}`, 'true');
      localStorage.setItem(`attempts_detective_seed_${seed}`, attempts.toString());
      localStorage.setItem('last_detective_play_seed', seed.toString());

      // Hide the big celebratory stamp after 4 seconds
      setTimeout(() => setShowStamp(false), 4000);

      setTimeout(() => {
        setGameState('result');
      }, 2000);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setHistory([...history, bookToGuess.title]);
      setGuess('');
      
      if (attempts > 1) {
        setAttempts(attempts - 1);
        setCurrentHintIndex(prev => Math.min(prev + 1, 4));
      } else {
        setAttempts(0);
        setGameState('result');
      }
    }
  };

  const shareResult = () => {
    const text = `Thám Tử Thư Viện 🔍\n${attempts}/5 Kính lúp\n${history.map(g => g === dailyMystery?.book.title ? '🟩' : '⬜').join('')}\nChuỗi ngày: ${streak} 🔥\nChơi tại: docvatre.vn`;
    if (navigator.share) {
      navigator.share({ title: 'Thám Tử Thư Viện', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Đã chép kết quả!');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-geist">
      {/* FULLSCREEN VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-[70%_center] pointer-events-none"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY FOR BETTER READABILITY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* SUBTLE BACK BUTTON */}
      <button 
        onClick={() => onNavigate('home')}
        className="absolute top-24 left-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
        title="Quay lại trang chủ"
      >
        <X size={20} />
      </button>

      {/* HERO CONTENT */}
      <main className="relative z-10 h-full w-full flex flex-col justify-between px-6 pb-20 pt-20 sm:pb-24 sm:pt-24 md:px-12 md:pb-28 md:pt-28 lg:px-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          {gameState === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full justify-between"
            >
              <div className="max-w-3xl">
                <p className="text-xs sm:text-sm text-[#D9A441] font-bold uppercase tracking-[0.2em] mb-4 sm:mb-6 animate-fadeSlideUp" style={{ animationDelay: '0.2s' }}>
                  Vụ Án Thư Viện · Khám Phá Văn Học
                </p>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-white animate-fadeSlideUp" style={{ animationDelay: '0.4s' }}>
                  Giải mã bí ẩn, <br/> lật mở tri thức, <br/> từng trang sách một.
                </h1>
              </div>

              <div className="max-w-xl mb-12">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/60 mb-5 sm:mb-6 animate-fadeSlideUp" style={{ animationDelay: '0.7s' }}>
                  {isCorrect 
                    ? "Hồ sơ hôm nay đã được giải mã thành công! Bạn có thể xem lại tóm tắt và bài học từ cuốn sách bí ẩn."
                    : "Hôm nay, thư viện có một bí ẩn mới. Bạn đã sẵn sàng để trở thành thám tử và giải mã cuốn sách của ngày hôm nay chưa?"}
                </p>
                <button
                  onClick={startCase}
                  className="rounded-lg bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium text-black hover:scale-105 transition-transform inline-flex items-center gap-2 animate-fadeSlideUp"
                  style={{ animationDelay: '0.9s' }}
                >
                  <span>{isCorrect ? "Xem hồ sơ đã giải" : "Mở hồ sơ vụ án"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-5xl mx-auto space-y-8 py-10"
            >
              {/* Game Status */}
              <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  {[...Array(5)].map((_, i) => (
                    <MagnifyingGlass 
                      key={i} 
                      size={20} 
                      className={i < attempts ? "text-[#D9A441]" : "text-white/10"} 
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-geist text-sm tracking-widest text-white/60">
                    STATUS: <span className="text-[#D9A441] font-bold uppercase">Đang điều tra</span>
                  </div>
                </div>
              </div>

              {/* Main Game Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Column 1: Hints */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D9A441]">Hồ sơ Manh mối</p>
                  <div className="space-y-3">
                    {dailyMystery?.gameHint.hints.slice(0, currentHintIndex + 1).map((hint, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-sm relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[#D9A441]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                        <p className="relative text-sm leading-relaxed text-white/90">
                          <span className="text-[#D9A441] font-bold mr-2">#{idx + 1}</span>
                          {hint}
                        </p>
                      </motion.div>
                    ))}
                    {currentHintIndex < 4 && (
                      <button
                        onClick={() => {
                          if (attempts > 1) {
                            setCurrentHintIndex(prev => prev + 1);
                            setAttempts(prev => prev - 1);
                          }
                        }}
                        className="w-full py-3 text-[10px] font-bold text-[#D9A441] border border-[#D9A441]/20 rounded-xl hover:bg-[#D9A441]/10 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
                      >
                        <RefreshCcw size={14} />
                        Thêm manh mối (Tốn 1 lượt)
                      </button>
                    )}
                  </div>
                </div>

                {/* Column 2: Final Case Submission */}
                <div className={`space-y-4 ${isShaking ? 'animate-shake' : ''}`}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D9A441]">Chốt Hồ Sơ</p>
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                          type="text"
                          value={guess}
                          onChange={(e) => setGuess(e.target.value)}
                          placeholder="Tên cuốn sách..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#D9A441] outline-none transition-all text-white placeholder:text-white/20"
                        />
                        
                        {suggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-[#F5ECD7] rounded-xl shadow-2xl overflow-hidden z-50">
                            {suggestions.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => handleGuess(s)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-[#D9A441]/10 text-[#3A2A1E] text-left transition-colors border-b border-[#D6CDBF]/30 last:border-0"
                              >
                                <img src={s.coverUrl} className="w-8 h-12 object-cover rounded" alt="" />
                                <div className="min-w-0">
                                  <p className="font-bold text-sm truncate">{s.title}</p>
                                  <p className="text-[10px] opacity-60">{s.author}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleGuess()}
                        disabled={!guess.trim()}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>XÁC NHẬN PHÁ ÁN</span>
                        <Check size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl mx-auto py-10"
            >
              <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-[#3A2A1E] relative overflow-hidden border border-white/20">
                <div className="absolute top-10 right-10 -rotate-12 border-4 border-[#B5432F] text-[#B5432F] px-4 py-2 font-black text-2xl uppercase tracking-tighter opacity-80">
                  ĐÃ GIẢI
                </div>
                
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
                      {isCorrect ? 'Tuyệt vời, Thám tử!' : 'Vụ án hóc búa...'}
                    </h2>
                    <p className="text-sm font-lora text-[#6B635A]">
                      {isCorrect 
                        ? 'Bạn đã giải mã thành công bí ẩn này. Hãy mở hồ sơ để xem chi tiết.' 
                        : 'Đừng nản lòng, thám tử vẫn đang học hỏi.'}
                    </p>
                  </div>
                  {isCorrect && (
                    <div className="px-4 py-2 bg-[#B5432F]/5 border border-[#B5432F]/20 rounded-xl">
                      <p className="text-[10px] font-bold text-[#B5432F] uppercase tracking-widest">Vụ án tiếp theo sau: {timeLeft}s</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-8 mb-10">
                  <div className="relative group">
                    <img src={dailyMystery?.book.coverUrl} className="w-full sm:w-40 aspect-[2/3] object-cover rounded-xl shadow-xl transition-transform group-hover:scale-[1.02]" alt="" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Search size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#B5432F] uppercase tracking-widest mb-1">Tác phẩm bí ẩn</p>
                      <h3 className="text-2xl font-bold font-playfair">{dailyMystery?.book.title}</h3>
                      <p className="text-sm opacity-60 italic">Tác giả: {dailyMystery?.book.author}</p>
                    </div>
                    
                    <button
                      onClick={() => setShowSummaryModal(true)}
                      className="w-full py-4 bg-[#B5432F]/10 text-[#B5432F] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#B5432F]/20 transition-all cursor-pointer group"
                    >
                      <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
                      XEM TÓM TẮT CHI TIẾT
                    </button>
                  </div>
                </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#D6CDBF]/50">
                    {isCorrect && (
                      <button
                        onClick={() => {
                          const nextIndex = (puzzleIndex + 1) % GAME_HINTS.length;
                          setPuzzleIndex(nextIndex);
                          localStorage.setItem('detective_current_index', nextIndex.toString());
                          setIsCorrect(false);
                          setAttempts(5);
                          setCurrentHintIndex(0);
                          setGuess('');
                          setHistory([]);
                          setShowStamp(false);
                          setShowSummaryModal(false);
                          setGameState('playing');
                        }}
                        className="flex-1 py-4 bg-[#B5432F] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
                      >
                        <ArrowRight size={18} />
                        VỤ ÁN TIẾP THEO
                      </button>
                    )}
                    <button
                      onClick={shareResult}
                      className="flex-1 py-4 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
                    >
                      <Share2 size={18} />
                      CHIA SẺ CHIẾN TÍCH
                    </button>
                    <button
                      onClick={() => {
                        setGameState('home');
                        setShowStamp(false);
                        setShowSummaryModal(false);
                      }}
                      className="px-8 py-4 border border-black/10 rounded-xl font-bold hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      Về Trang Chủ
                    </button>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer Assist */}
        <div className="flex items-center gap-4 text-white/40 mt-12 pb-16">
          <HelpCircle size={16} />
          <p className="text-[10px] uppercase tracking-widest font-medium">
            Game thám tử sách — Dựa trên trí tuệ & thói quen đọc giới trẻ
          </p>
        </div>
      </main>

      {/* BOOK SUMMARY MODAL */}
      <AnimatePresence>
        {showSummaryModal && dailyMystery && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSummaryModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-[#F5F1E8] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setShowSummaryModal(false)}
                className="absolute top-6 right-6 z-10 p-2 bg-black/5 hover:bg-black/10 rounded-full text-[#3A2A1E] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/3 bg-[#FAF7F0] p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#D6CDBF]">
                <img src={dailyMystery.book.coverUrl} className="w-full max-w-[180px] aspect-[2/3] object-cover rounded-xl shadow-2xl mb-6" alt="" />
                <div className="text-center">
                  <h4 className="font-playfair text-xl font-bold text-[#3A2A1E]">{dailyMystery.book.title}</h4>
                  <p className="text-sm text-[#B56D4F] font-medium">{dailyMystery.book.author}</p>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  <section>
                    <h5 className="text-[10px] font-bold text-[#B5432F] uppercase tracking-[0.2em] mb-3">Về tác phẩm</h5>
                    <p className="text-sm font-lora leading-relaxed text-[#3A2A1E]/90 italic">
                      {dailyMystery.book.description}
                    </p>
                  </section>

                  <section className="bg-white/50 p-6 rounded-2xl border border-white">
                    <h5 className="text-[10px] font-bold text-[#3A2A1E] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Search size={14} className="text-[#B5432F]" />
                      Nội dung cốt lõi
                    </h5>
                    <p className="text-sm font-lora leading-relaxed text-[#3A2A1E]/80">
                      {dailyMystery.book.whatItIsAbout}
                    </p>
                  </section>

                  <section>
                    <h5 className="text-[10px] font-bold text-[#3A2A1E] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Lightbulb size={14} className="text-[#B5432F]" />
                      Tại sao bạn nên đọc?
                    </h5>
                    <p className="text-sm font-lora leading-relaxed text-[#3A2A1E]/80">
                      {dailyMystery.book.howItHelpsYou}
                    </p>
                  </section>

                  {dailyMystery.book.keyTakeaway && (
                    <section className="pt-6 border-t border-[#D6CDBF]">
                      <p className="text-base font-playfair font-bold text-[#B5432F] italic text-center">
                        "{dailyMystery.book.keyTakeaway}"
                      </p>
                    </section>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STAMP EFFECT OVERLAY */}
      <AnimatePresence>
        {showStamp && (
          <motion.div
            initial={{ scale: 3, opacity: 0, rotate: 20 }}
            animate={{ scale: 1, opacity: 1, rotate: -15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-[#B5432F] text-white px-8 py-4 rounded border-4 border-double border-white shadow-2xl">
              <span className="text-4xl font-black uppercase tracking-tighter">ĐÃ GIẢI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

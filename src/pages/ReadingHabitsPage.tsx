import { useState, useRef, useMemo } from 'react';
import { 
  BookOpen, 
  Headphones, 
  Tablet, 
  TrendingUp, 
  Moon, 
  Bus, 
  Coffee, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Calculator, 
  ArrowRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Brain,
  Zap,
  Lightbulb,
  Search,
  ZapOff,
  UserCheck,
  Heart,
  Target,
  Calendar,
  Award,
  Flame,
  Globe,
  Quote as QuoteIcon,
  Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VintageSeparator from '../components/VintageSeparator';
import ReadingJournal from '../components/ReadingJournal';
import { PageId } from '../types';

interface ReadingHabitsPageProps {
  onNavigate: (page: PageId) => void;
}

type ReaderType = 'scholar' | 'butterfly' | 'practical' | 'escapist';

export default function ReadingHabitsPage({ onNavigate }: ReadingHabitsPageProps) {
  // Reading potential calculator state
  const [dailyMinutes, setDailyMinutes] = useState<number>(20);
  const [readingSpeed, setReadingSpeed] = useState<number>(1); // 1 = 1 trang/phút (trung bình ~250 từ/phút)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<ReaderType | null>(null);

  // Math: 20 mins * 1 page = 20 pages/day * 365 = 7300 pages / 250 pages per book ≈ 29 books/year
  const pagesPerDay = dailyMinutes * readingSpeed;
  const booksPerYear = Math.max(1, Math.round((pagesPerDay * 365) / 250));

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Quiz Logic
  const quizQuestions = [
    {
      question: 'Bạn thường chọn sách dựa trên tiêu chí nào?',
      options: [
        { label: 'Để giải quyết vấn đề cụ thể hoặc học kỹ năng mới', type: 'practical' },
        { label: 'Vì tò mò về một chủ đề sâu sắc hoặc học thuật', type: 'scholar' },
        { label: 'Để tạm quên đi thực tại và sống một cuộc đời khác', type: 'escapist' },
        { label: 'Theo gợi ý của bạn bè hoặc những gì đang hot trên BookTok', type: 'butterfly' }
      ]
    },
    {
      question: 'Không gian đọc lý tưởng của bạn là gì?',
      options: [
        { label: 'Bàn làm việc gọn gàng với sổ ghi chép', type: 'practical' },
        { label: 'Góc thư viện yên tĩnh tuyệt đối', type: 'scholar' },
        { label: 'Cuộn mình trong chăn hoặc bên cửa sổ lúc trời mưa', type: 'escapist' },
        { label: 'Quán cà phê đông đúc hoặc trên xe buýt', type: 'butterfly' }
      ]
    },
    {
      question: 'Bạn làm gì khi gặp một đoạn văn hay?',
      options: [
        { label: 'Ghi chú lại để áp dụng vào thực tế ngay', type: 'practical' },
        { label: 'Ngẫm nghĩ về tầng sâu ý nghĩa triết học của nó', type: 'scholar' },
        { label: 'Đắm chìm trong cảm xúc mà đoạn văn mang lại', type: 'escapist' },
        { label: 'Chụp ảnh khoe lên story ngay lập tức', type: 'butterfly' }
      ]
    }
  ];

  const handleQuizAnswer = (type: string) => {
    const newAnswers = [...quizAnswers, type];
    if (quizStep < quizQuestions.length - 1) {
      setQuizAnswers(newAnswers);
      setQuizStep(quizStep + 1);
    } else {
      // Calculate result
      const counts: Record<string, number> = {};
      newAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
      const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) as ReaderType;
      setQuizResult(winner);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const readerTypeData: Record<ReaderType, { title: string, desc: string, advice: string, icon: any }> = {
    scholar: {
      title: 'Độc giả Thông thái (The Scholar)',
      desc: 'Bạn đọc sách để tìm kiếm chân lý và chiều sâu tri thức. Bạn không ngại những cuốn sách dày và khó.',
      advice: 'Hãy thử đọc thêm truyện tranh hoặc tiểu thuyết nhẹ nhàng để tâm trí được nghỉ ngơi đôi chút.',
      icon: BookOpen
    },
    butterfly: {
      title: 'Độc giả Ngẫu hứng (The Social Butterfly)',
      desc: 'Bạn yêu thích sự kết nối và những trào lưu văn hóa. Đọc sách với bạn là một phần của trải nghiệm sống năng động.',
      advice: 'Hãy thử dành ra 15 phút mỗi ngày để đọc sâu mà không dùng điện thoại để tăng khả năng tập trung.',
      icon: Sparkles
    },
    practical: {
      title: 'Độc giả Thực dụng (The Practical Learner)',
      desc: 'Với bạn, sách là công cụ để nâng cấp bản thân. Bạn chỉ quan tâm đến những gì có thể áp dụng được.',
      advice: 'Đôi khi những cuốn tiểu thuyết viễn tưởng lại mang đến những bài học sáng tạo mà sách kỹ năng không có.',
      icon: Target
    },
    escapist: {
      title: 'Độc giả Mơ mộng (The Escapist)',
      desc: 'Bạn tìm thấy sự an ủi và những vũ trụ kỳ diệu trong từng trang sách. Sách là nơi trú ẩn an toàn nhất.',
      advice: 'Hãy thử tham gia một câu lạc bộ sách để chia sẻ những cảm xúc tuyệt vời đó với mọi người.',
      icon: Moon
    }
  };

  return (
    <div className="relative w-full min-h-[100svh] bg-[#F5F1E8] text-[#3A3530] overflow-x-hidden">
      {/* REQUIRED BACKGROUND VIDEO: Exact MP4 positioned full-page with high visibility */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260801_001207_ec20d138-aa45-4b2b-ab8c-bdc71607f240.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          opacity: 1,
          filter: 'contrast(1.05) brightness(1.15)',
        }}
      />

      {/* Floating Video Control Pill */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs text-white/90 shadow-lg">
        <button
          onClick={toggleVideoPlayback}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          title={isPlaying ? 'Tạm dừng video nền' : 'Tiếp tục phát'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span className="hidden sm:inline font-geist-mono-semibold text-[11px]">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>
        <span className="w-px h-3 bg-white/20" />
        <button
          onClick={toggleVideoMute}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>

      {/* CONTENT LAYER: Elevated above the video with high z-index */}
      <div className="relative z-10 w-full">
        {/* Row 3.1: Header trang */}
        <section className="py-16 sm:py-24 text-center px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <span
              className="text-xs uppercase tracking-[0.25em] text-[#EBE5D9] font-[600] block mb-3 font-mono"
            >
              CHUYÊN ĐỀ 01 · THÓI QUEN ĐỌC THỜI KỶ NGUYÊN SỐ
            </span>
            <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-2 drop-shadow-sm">
              Nâng tầm văn hóa đọc cá nhân
            </h1>
            <VintageSeparator color="#EBE5D9" width="w-28" />
            <p className="font-lora text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto mt-4 drop-shadow-xs">
              Đọc sách không chỉ là tiếp nhận thông tin, mà là một nghệ thuật rèn luyện tâm trí. Khám phá các phương pháp khoa học và xây dựng một thói quen bền vững giữa kỷ nguyên số ngập tràn xao nhãng.
            </p>
          </div>
        </section>

        {/* NEW SECTION: Reader Type Quiz */}
        <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-8 sm:p-12 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B56D4F]/5 rounded-bl-full pointer-events-none" />
            
            {!quizResult ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/20 mb-6 uppercase tracking-widest">
                  <UserCheck size={14} />
                  <span>Trắc nghiệm tương tác</span>
                </div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#3A3530] mb-8">
                  Bạn thuộc kiểu độc giả nào?
                </h2>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quizStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <p className="font-lora text-lg text-[#3A3530] mb-8 italic">
                      "{quizQuestions[quizStep].question}"
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {quizQuestions[quizStep].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizAnswer(opt.type)}
                          className="p-4 rounded-xl border border-[#D6CDBF] bg-white hover:border-[#B56D4F] hover:bg-[#FAF7F0] transition-all text-left text-sm font-lora cursor-pointer group"
                        >
                          <span className="text-[#6B635A] group-hover:text-[#B56D4F] transition-colors">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="mt-12 flex justify-center gap-2">
                  {quizQuestions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all ${i === quizStep ? 'w-6 bg-[#B56D4F]' : 'bg-[#D6CDBF]'}`} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#B56D4F] text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {(() => {
                    const Icon = readerTypeData[quizResult].icon;
                    return <Icon size={40} />;
                  })()}
                </div>
                <h2 className="font-playfair text-3xl font-bold text-[#3A3530] mb-2">
                  {readerTypeData[quizResult].title}
                </h2>
                <VintageSeparator color="#B56D4F" width="w-20" />
                <p className="font-lora text-base text-[#6B635A] mb-8 max-w-xl mx-auto leading-relaxed">
                  {readerTypeData[quizResult].desc}
                </p>
                <div className="bg-[#EBE5D9] p-6 rounded-2xl border border-[#D6CDBF] inline-block text-left max-w-lg mx-auto">
                  <h4 className="font-bold text-[#B56D4F] text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Lightbulb size={16} />
                    Lời khuyên dành cho bạn:
                  </h4>
                  <p className="text-sm font-lora text-[#3A3530]">
                    {readerTypeData[quizResult].advice}
                  </p>
                </div>
                <div className="mt-10">
                  <button
                    onClick={resetQuiz}
                    className="text-[#B56D4F] font-bold text-xs uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    Làm lại trắc nghiệm
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Row 3.2: Khối 1 - Hình thức đọc */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Col 1: Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20">
                <span className="font-mono">PHÂN LOẠI HÌNH THỨC</span>
              </div>
              <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-sm">
                Bạn trẻ đọc sách ở đâu và bằng gì?
              </h2>
              <p className="font-lora text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-xs">
                Sách giấy vẫn giữ vị thế đặc biệt nhờ cảm giác chạm lật, mùi thơm của mực in và trải nghiệm “rời xa màn hình điện tử”. Song song đó, các thiết bị đọc e-reader nhỏ gọn cùng ứng dụng sách nói đang mở ra lối đọc linh hoạt cho cuộc sống năng động.
              </p>

              <div className="space-y-4 pt-2">
                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-5 rounded-2xl border border-[#D6CDBF] shadow-lg flex items-start gap-4 hover:border-[#B56D4F] transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-base text-[#3A3530]">
                      Sách giấy truyền thống (~62% bạn trẻ ưa thích)
                    </h4>
                    <p className="font-lora text-xs sm:text-sm text-[#6B635A] mt-1 leading-relaxed">
                      Trải nghiệm “thật”, tăng khả năng ghi nhớ sâu và tạo cảm giác sở hữu trang trọng trên giá sách phòng ngủ.
                    </p>
                  </div>
                </div>

                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-5 rounded-2xl border border-[#D6CDBF] shadow-lg flex items-start gap-4 hover:border-[#6B7A6E] transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#EBE5D9] text-[#6B7A6E] flex items-center justify-center shrink-0 mt-0.5">
                    <Tablet size={20} />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-base text-[#3A3530]">
                      Ebook & E-reader (~48% sử dụng song song)
                    </h4>
                    <p className="font-lora text-xs sm:text-sm text-[#6B635A] mt-1 leading-relaxed">
                      Tiện lợi tột bậc: chứa hàng nghìn đầu sách chỉ trong một chiếc máy Kindle/Kobo nhẹ bằng nửa cuốn sách bỏ túi.
                    </p>
                  </div>
                </div>

                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-5 rounded-2xl border border-[#D6CDBF] shadow-lg flex items-start gap-4 hover:border-[#B56D4F] transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center shrink-0 mt-0.5">
                    <Headphones size={20} />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-base text-[#3A3530]">
                      Audiobook & Sách nói (~35% và tăng nhanh)
                    </h4>
                    <p className="font-lora text-xs sm:text-sm text-[#6B635A] mt-1 leading-relaxed">
                      “Đọc bằng tai” cực kỳ hiệu quả khi đang chạy bộ, nấu ăn hoặc ngồi xe buýt đến trường/công sở.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Vintage Graphical Card with Glass Elevation */}
            <div className="lg:col-span-5">
              <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-8 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl relative overflow-hidden">
                <div 
                  className="absolute top-4 right-4 px-2.5 py-1 bg-[#EBE5D9] border border-[#D6CDBF] rounded-md text-[10px] text-[#6B635A] uppercase tracking-wider font-mono"
                >
                  FIELD NOTE
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#B56D4F]/10 text-[#B56D4F] border border-[#B56D4F]/20 flex items-center justify-center mb-6">
                  <BookOpen size={28} />
                </div>

                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530] mb-3">
                  “Mùi của những trang sách cũ”
                </h3>
                <p className="font-lora text-sm text-[#6B635A] leading-relaxed mb-6 italic">
                  “Có những cảm xúc mà màn hình điện thoại hay ipad không bao giờ thay thế được: tiếng lật giòn tan của trang giấy trắng ngà, nét gạch chân bằng bút chì và mùi hương hoài niệm của hiệu sách cũ...”
                </p>

                <div className="border-t border-[#D6CDBF] pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-[#6B635A] font-lora">
                    <span>Tỷ lệ bạn trẻ thích mùi sách giấy</span>
                    <span 
                      className="font-bold text-[#B56D4F] font-mono"
                    >
                      78.4%
                    </span>
                  </div>
                  <div className="w-full bg-[#EBE5D9] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#B56D4F] h-full rounded-full" style={{ width: '78.4%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Effective Reading Methods */}
        <section className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm border-y border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B56D4F] mb-3 block drop-shadow-sm">Kỹ năng chuyên sâu</span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-md">Các phương pháp đọc hiệu quả</h2>
              <VintageSeparator color="#B56D4F" width="w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Phương pháp SQ3R',
                  desc: 'Survey (Khảo sát), Question (Đặt câu hỏi), Read (Đọc), Recite (Nhắc lại), Review (Ôn tập). Giúp nắm bắt nội dung cốt lõi nhanh chóng.',
                  icon: Search,
                  color: 'text-amber-400'
                },
                {
                  title: 'Active Reading',
                  desc: 'Đọc chủ động: Luôn cầm bút trên tay để gạch chân, đặt câu hỏi phản biện và liên hệ với trải nghiệm cá nhân ngay khi đang đọc.',
                  icon: Zap,
                  color: 'text-[#B56D4F]'
                },
                {
                  title: 'Marginalia',
                  desc: 'Nghệ thuật ghi chú bên lề sách. Đây là cách bạn đối thoại trực tiếp với tác giả, biến cuốn sách thành tài sản trí tuệ riêng.',
                  icon: Lightbulb,
                  color: 'text-emerald-400'
                }
              ].map((m, idx) => (
                <div key={idx} className="bg-black/60 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:bg-black/70 hover:border-[#B56D4F]/50 transition-all shadow-xl group">
                  <m.icon className={`${m.color} mb-6 group-hover:scale-110 transition-transform`} size={32} />
                  <h4 className="font-playfair font-bold text-white text-xl mb-3 drop-shadow-md">{m.title}</h4>
                  <p className="text-sm font-lora text-white/80 leading-relaxed drop-shadow-sm">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW SECTION: Scientific Benefits */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B56D4F] to-[#6B7A6E] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-black rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80" 
                    alt="Brain benefits of reading" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-3 text-[#B56D4F] mb-2 font-mono text-[10px] font-bold uppercase tracking-widest">
                      <Brain size={16} />
                      <span>Thần kinh học & Đọc sách</span>
                    </div>
                    <h3 className="text-white font-playfair text-2xl font-bold">
                      Bộ não thay đổi thế nào khi ta đọc?
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-6 drop-shadow-lg">Lợi ích khoa học của việc đọc sâu</h2>
                <div className="space-y-6">
                  {[
                    {
                      title: 'Tính dẻo thần kinh (Neuroplasticity)',
                      desc: 'Đọc những câu chuyện phức tạp buộc não bộ phải tạo ra những liên kết mới, giúp ngăn ngừa lão hóa và suy giảm trí nhớ.',
                      icon: Brain
                    },
                    {
                      title: 'Giảm Stress tức thì',
                      desc: 'Chỉ 6 phút đọc sách có thể giúp giảm mức độ căng thẳng đến 68%, hiệu quả hơn cả nghe nhạc hay đi dạo.',
                      icon: Heart
                    },
                    {
                      title: 'Tăng cường sự thấu cảm',
                      desc: 'Theo dõi tâm lý nhân vật giúp bạn hiểu được cảm xúc của người khác trong thực tế, cải thiện kỹ năng giao tiếp xã hội.',
                      icon: UserCheck
                    }
                  ].map((benefit, bIdx) => (
                    <motion.div 
                      key={bIdx} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: bIdx * 0.1 }}
                      className="flex gap-4 p-5 sm:p-6 rounded-2xl bg-black/50 backdrop-blur-lg border border-white/20 hover:border-[#B56D4F]/50 transition-all shadow-2xl group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <benefit.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold font-playfair text-lg mb-1 drop-shadow-md">{benefit.title}</h4>
                        <p className="text-xs sm:text-sm text-white/80 font-lora leading-relaxed drop-shadow-sm">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Reading Fun Facts */}
        <section className="py-16 sm:py-24 bg-[#EBE5D9]/30 border-y border-[#D6CDBF]/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B56D4F] mb-3 block font-mono">BẠN CÓ BIẾT?</span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#3A3530] mb-4">Những sự thật thú vị về thế giới sách</h2>
              <VintageSeparator color="#B56D4F" width="w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Thư viện lớn nhất',
                  value: '170 triệu',
                  unit: 'tài liệu',
                  desc: 'Thư viện Quốc hội Mỹ là nơi lưu trữ khổng lồ nhất thế giới hiện nay.',
                  icon: Library
                },
                {
                  title: 'Người đọc nhanh nhất',
                  value: '25,000',
                  unit: 'từ/phút',
                  desc: 'Kỷ lục thế giới thuộc về Howard Berg với tốc độ đọc kinh ngạc.',
                  icon: Flame
                },
                {
                  title: 'Cuốn sách bán chạy nhất',
                  value: '5 tỷ',
                  unit: 'bản',
                  desc: 'Kinh Thánh vẫn là cuốn sách có số lượng bản in lớn nhất lịch sử.',
                  icon: Globe
                },
                {
                  title: 'Từ ngữ mới',
                  value: '1,000+',
                  unit: 'từ mỗi năm',
                  desc: 'Sách là nguồn chính giúp làm giàu vốn từ vựng của chúng ta.',
                  icon: Sparkles
                }
              ].map((fact, fIdx) => (
                <div key={fIdx} className="vintage-card-bg bg-white/80 p-6 rounded-2xl border border-[#D6CDBF] text-center group hover:-translate-y-1 transition-all shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#B56D4F]/10 text-[#B56D4F] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#B56D4F] group-hover:text-white transition-colors">
                    <fact.icon size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-[#6B635A] uppercase tracking-wider mb-2">{fact.title}</h4>
                  <div className="font-playfair text-2xl font-black text-[#B56D4F] mb-1">
                    {fact.value} <span className="text-sm font-lora font-normal text-[#3A3530]">{fact.unit}</span>
                  </div>
                  <p className="text-xs font-lora text-[#6B635A] leading-relaxed">{fact.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW SECTION: 21-Day Habit Roadmap */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="vintage-card-bg bg-[#FAF7F0] p-8 sm:p-12 rounded-[2.5rem] border-2 border-[#D6CDBF] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B56D4F]/5 rounded-bl-[10rem] pointer-events-none" />
            
            <div className="text-center mb-12 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/20 mb-4 uppercase tracking-widest">
                <Calendar size={14} />
                <span>Habit Building</span>
              </div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#3A3530] mb-4">Lộ trình 21 ngày hình thành thói quen</h2>
              <p className="font-lora text-base text-[#6B635A] max-w-2xl mx-auto">
                Theo các nghiên cứu tâm lý, 21 ngày là khoảng thời gian tối thiểu để não bộ thích nghi với một hành động mới. Hãy bắt đầu ngay hôm nay!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  phase: 'Tuần 1: Khởi động',
                  goal: 'Chống lại sự trì hoãn',
                  tasks: ['Đọc 5-10 phút mỗi tối', 'Chọn cuốn sách cực kỳ dễ đọc', 'Chuẩn bị góc đọc yên tĩnh'],
                  icon: Flame,
                  color: 'bg-orange-500'
                },
                {
                  phase: 'Tuần 2: Duy trì',
                  goal: 'Xây dựng nhịp điệu',
                  tasks: ['Tăng lên 15-20 phút', 'Thử đọc vào các khung giờ khác', 'Ghi chú 1 câu tâm đắc mỗi ngày'],
                  icon: TrendingUp,
                  color: 'bg-[#B56D4F]'
                },
                {
                  phase: 'Tuần 3: Tăng tốc',
                  goal: 'Biến thành bản năng',
                  tasks: ['Đọc 30 phút không xao nhãng', 'Chia sẻ điều hay với bạn bè', 'Tìm kiếm cuốn sách tiếp theo'],
                  icon: Award,
                  color: 'bg-[#4A7C59]'
                }
              ].map((step, sIdx) => (
                <div key={sIdx} className="bg-white border border-[#D6CDBF] p-8 rounded-3xl relative group hover:shadow-xl transition-all">
                  <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <step.icon size={24} />
                  </div>
                  <h4 className="font-playfair font-bold text-xl text-[#3A3530] mt-4 mb-2">{step.phase}</h4>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#B56D4F] mb-6">{step.goal}</div>
                  <ul className="space-y-3">
                    {step.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-3 text-sm font-lora text-[#3A3530]">
                        <CheckCircle size={16} className="text-[#B56D4F] shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-[#B56D4F] text-white p-8 rounded-3xl text-center">
              <QuoteIcon className="mx-auto mb-4 opacity-50" size={32} />
              <p className="font-playfair text-xl sm:text-2xl italic font-medium leading-relaxed mb-4">
                "Thói quen giống như một sợi dây thừng. Chúng ta bện một sợi mỗi ngày và cuối cùng chúng ta không thể bẻ gãy nó."
              </p>
              <div className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-white/80">— Horace Mann</div>
            </div>
          </div>
        </section>

        {/* Row 3.3: Khối 2 - Thời gian & Tần suất */}
        <section className="w-full py-16 sm:py-24 border-y border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Col 1: Visual Metric Cards */}
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 rounded-2xl border border-[#D6CDBF] shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center shrink-0">
                    <Moon size={24} />
                  </div>
                  <div>
                    <span 
                      className="text-[10px] uppercase tracking-wider text-[#6B635A] font-semibold block font-mono"
                    >
                      GOLDEN TIME
                    </span>
                    <h4 className="font-playfair text-lg font-bold text-[#3A3530]">22:00 – 23:30 (Trước giờ ngủ)</h4>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5">Giúp thư giãn não bộ và ngủ ngon hơn</p>
                  </div>
                </div>

                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 rounded-2xl border border-[#D6CDBF] shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EBE5D9] text-[#6B7A6E] flex items-center justify-center shrink-0">
                    <Bus size={24} />
                  </div>
                  <div>
                    <span 
                      className="text-[10px] uppercase tracking-wider text-[#6B635A] font-semibold block font-mono"
                    >
                      COMMUTE TIME
                    </span>
                    <h4 className="font-playfair text-lg font-bold text-[#3A3530]">15–20 phút trên xe buýt / tàu điện</h4>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5">Thời điểm vàng cho ebook và audiobook</p>
                  </div>
                </div>

                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 rounded-2xl border border-[#D6CDBF] shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center shrink-0">
                    <Coffee size={24} />
                  </div>
                  <div>
                    <span 
                      className="text-[10px] uppercase tracking-wider text-[#6B635A] font-semibold block font-mono"
                    >
                      WEEKEND RITUAL
                    </span>
                    <h4 className="font-playfair text-lg font-bold text-[#3A3530]">Sáng thứ Bảy & Chủ Nhật</h4>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5">1–2 giờ đọc sâu liên tục cùng bạn bè</p>
                  </div>
                </div>
              </div>

              {/* Col 2: Text Description */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20">
                  <span className="font-mono">NHỊP ĐIỆU SINH HOẠT</span>
                </div>
                <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-sm">
                  Khi nào và bao lâu thì bạn trẻ đọc sách?
                </h2>
                <p className="font-lora text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-xs">
                  Đa số người trẻ không dành một khối thời gian liên tục 2–3 tiếng mỗi ngày để đọc. Thay vào đó, họ tận dụng những <strong>“khoảng vi thời gian” (micro-moments)</strong> rải rác: 10 phút đợi bạn ở quán cà phê, 15 phút trước khi tắt đèn ngủ, hoặc nửa tiếng nghỉ trưa.
                </p>

                <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-6 rounded-2xl border border-[#D6CDBF] shadow-lg space-y-3">
                  <h4 className="font-playfair font-bold text-[#3A3530] text-base">
                    3 đặc điểm tần suất điển hình:
                  </h4>
                  <ul className="space-y-2 text-sm text-[#3A3530] font-lora">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B56D4F] mt-2 shrink-0" />
                      <span><strong>15–30 phút/ngày:</strong> Thời lượng đọc phổ biến nhất của những bạn duy trì thói quen đọc hằng ngày.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B56D4F] mt-2 shrink-0" />
                      <span><strong>Đọc ngắt quãng:</strong> Thường đọc 2–3 cuốn song song tùy theo tâm trạng (1 cuốn kỹ năng ban ngày + 1 tiểu thuyết thư giãn buổi tối).</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B56D4F] mt-2 shrink-0" />
                      <span><strong>Cuối tuần & kỳ nghỉ:</strong> Là thời điểm “bùng nổ” số trang sách đọc được, chiếm đến 60% tổng lượng sách tiêu thụ trong tháng.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Row 3.4: Khối 3 - Động lực & Rào cản */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span 
              className="text-xs uppercase tracking-[0.2em] text-[#EBE5D9] font-[600] block mb-2 font-mono"
            >
              TÂM LÝ & ĐỘNG LỰC
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
              Vì sao đọc? Vì sao không?
            </h2>
            <VintageSeparator color="#EBE5D9" width="w-24" />
            <p className="font-lora text-sm sm:text-base text-white/80 drop-shadow-xs">
              Bóc tách hai mặt của thói quen: những ngọn lửa thôi thúc mở trang sách và những lực cản vô hình kéo bạn trẻ rời xa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Col 1: Động lực */}
            <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-8 rounded-3xl border-t-4 border-t-[#B56D4F] shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#B56D4F]/10 text-[#B56D4F] flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#B56D4F]">
                  Động lực đọc sách
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#B56D4F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Chữa lành & Tái tạo tinh thần (74%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      Tìm kiếm cảm giác bình yên, giải tỏa âu lo sau những giờ học tập và làm việc căng thẳng.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#B56D4F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Nâng cao kỹ năng & Kiến thức nghề (65%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      Học hỏi về quản lý tài chính cá nhân, giao tiếp, tư duy logic và công nghệ mới.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#B56D4F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Giải trí & Du ngoạn tưởng tượng (58%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      Đắm chìm vào các vũ trụ kỳ ảo, trinh thám hồi hộp hoặc truyện tranh đầy màu sắc.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#B56D4F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Cảm hứng từ mạng xã hội & Bạn bè (42%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      Được khích lệ từ trào lưu #BookTok, câu lạc bộ sách sinh viên hoặc chia sẻ của thần tượng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Rào cản */}
            <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-8 rounded-3xl border-t-4 border-t-[#6B7A6E] shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#6B7A6E]/10 text-[#6B7A6E] flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#6B7A6E]">
                  Rào cản khiến ít đọc
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#6B7A6E]/15 text-[#6B7A6E] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</div>
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Quá bận rộn & Kiệt sức (71%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      Lịch học thêm, deadline công việc dày đặc khiến bạn trẻ kiệt sức khi về đến nhà.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#6B7A6E]/15 text-[#6B7A6E] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</div>
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Cám dỗ Dopamine từ Mạng xã hội & Game (63%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      TikTok, Reels, Youtube Shorts mang lại niềm vui tức thì dễ dàng hơn việc tập trung đọc chữ.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#6B7A6E]/15 text-[#6B7A6E] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</div>
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Không biết bắt đầu từ cuốn sách nào (45%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      Choáng ngợp trước hàng vạn tựa sách trên thị trường hoặc từng chọn nhầm sách quá hàn lâm gây nản.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#6B7A6E]/15 text-[#6B7A6E] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</div>
                  <div>
                    <strong className="text-sm font-playfair text-[#3A3530] block">Mắt mỏi & Cảm giác “khó vào” (38%)</strong>
                    <p className="font-lora text-xs text-[#6B635A] mt-0.5 leading-relaxed">
                      Thiếu môi trường yên tĩnh, dễ buồn ngủ chỉ sau 5–10 trang đầu nếu chưa hình thành phản xạ đọc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reading Journal Section */}
        <ReadingJournal />

        {/* Interactive Habit Calculator: Tính toán tiềm năng đọc sách cá nhân */}
        <section className="w-full py-16 sm:py-24 border-t border-white/10 bg-black/50 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D6CDBF]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#B56D4F] text-white flex items-center justify-center shadow-xs">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
                      Máy tính tiềm năng đọc sách cá nhân
                    </h3>
                    <p className="font-lora text-xs sm:text-sm text-[#6B635A]">
                      Xem sức mạnh của việc tích lũy 15–30 phút mỗi ngày trong 1 năm
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 items-center">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-lora mb-2">
                      <span className="font-semibold text-[#3A3530]">Thời gian bạn rảnh mỗi ngày:</span>
                      <span 
                        className="font-bold text-[#B56D4F] text-base font-mono"
                      >
                        {dailyMinutes} phút
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={dailyMinutes}
                      onChange={(e) => setDailyMinutes(Number(e.target.value))}
                      className="w-full accent-[#B56D4F] cursor-pointer"
                    />
                    <div 
                      className="flex justify-between text-[11px] text-[#6B635A] mt-1 font-mono"
                    >
                      <span>5m</span>
                      <span>15m</span>
                      <span>30m</span>
                      <span>60m</span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-sm font-semibold text-[#3A3530] mb-2 font-lora">
                      Tốc độ đọc của bạn:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setReadingSpeed(0.7)}
                        className={`py-2 px-3 text-xs rounded-lg border transition-all cursor-pointer font-lora ${
                          readingSpeed === 0.7
                            ? 'bg-[#B56D4F] text-white border-[#9A5A3F]'
                            : 'bg-[#FAF7F0] text-[#3A3530] border-[#D6CDBF] hover:bg-[#EBE5D9]'
                        }`}
                      >
                        Thư thả (ngẫm nghĩ)
                      </button>
                      <button
                        onClick={() => setReadingSpeed(1)}
                        className={`py-2 px-3 text-xs rounded-lg border transition-all cursor-pointer font-lora ${
                          readingSpeed === 1
                            ? 'bg-[#B56D4F] text-white border-[#9A5A3F]'
                            : 'bg-[#FAF7F0] text-[#3A3530] border-[#D6CDBF] hover:bg-[#EBE5D9]'
                        }`}
                      >
                        Bình thường (1 tr/phút)
                      </button>
                      <button
                        onClick={() => setReadingSpeed(1.4)}
                        className={`py-2 px-3 text-xs rounded-lg border transition-all cursor-pointer font-lora ${
                          readingSpeed === 1.4
                            ? 'bg-[#B56D4F] text-white border-[#9A5A3F]'
                            : 'bg-[#FAF7F0] text-[#3A3530] border-[#D6CDBF] hover:bg-[#EBE5D9]'
                        }`}
                      >
                        Đọc nhanh
                      </button>
                    </div>
                  </div>
                </div>

                {/* Result Preview Box */}
                <div className="bg-[#EBE5D9] p-6 rounded-2xl border border-[#D6CDBF] text-center space-y-3">
                  <span 
                    className="text-[11px] uppercase tracking-wider text-[#6B635A] font-semibold block font-mono"
                  >
                    KẾT QUẢ DỰ KIẾN TRONG 1 NĂM:
                  </span>
                  <div 
                    className="text-5xl sm:text-6xl font-[600] text-[#B56D4F] tracking-tight font-mono"
                  >
                    ~{booksPerYear}
                  </div>
                  <div className="font-lora text-sm font-bold text-[#3A3530]">
                    cuốn sách hoàn thành
                  </div>
                  <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                    Tương đương <strong className="font-semibold text-[#3A3530]">{Math.round(pagesPerDay * 365).toLocaleString('vi-VN')} trang sách</strong>. Chỉ cần đều đặn {dailyMinutes} phút mỗi ngày, bạn đã vượt qua mức trung bình của 85% người trẻ!
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('genres')}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#B56D4F] hover:text-[#9A5A3F] transition-colors cursor-pointer"
                    >
                      <span>Khám phá ngay các thể loại sách phù hợp</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: The 2-minute rule & Environment */}
        <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-[#D6CDBF] shadow-lg">
                <div className="flex items-center gap-3 mb-4 text-[#B56D4F]">
                  <Zap size={24} />
                  <h4 className="font-playfair font-bold text-xl">Quy tắc 2 phút</h4>
                </div>
                <p className="text-sm font-lora text-[#6B635A] leading-relaxed">
                  Để bắt đầu một thói quen, hãy cam kết thực hiện nó chỉ trong 2 phút. Đừng ép mình đọc 50 trang, hãy cam kết <strong>đọc chỉ 1 trang</strong> hoặc chỉ cần <strong>mở sách ra</strong>. Khi đã bắt đầu, lực quán tính sẽ giúp bạn đi xa hơn.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-[#D6CDBF] shadow-lg">
                <div className="flex items-center gap-3 mb-4 text-[#6B7A6E]">
                  <Coffee size={24} />
                  <h4 className="font-playfair font-bold text-xl">Kiến tạo không gian</h4>
                </div>
                <p className="text-sm font-lora text-[#6B635A] leading-relaxed">
                  Môi trường quyết định hành vi. Hãy để một cuốn sách ngay trên gối hoặc bàn làm việc thay vì chiếc điện thoại. Một chiếc đèn vàng ấm và một tách trà nhỏ sẽ kích hoạt tín hiệu "đã đến lúc đọc sách" cho não bộ của bạn.
                </p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}


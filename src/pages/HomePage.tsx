import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Smartphone, Sparkles, TrendingUp, Volume2, VolumeX, Pause, Play, Compass, CheckCircle2, Users, SearchCode as MagnifyingGlass, Newspaper, ExternalLink, Maximize2, ChevronRight, X } from 'lucide-react';
import StaggeredFade from '../components/StaggeredFade';
import VintageSeparator from '../components/VintageSeparator';
import DailyQuote from '../components/DailyQuote';
import ConfessionCorner from '../components/ConfessionCorner';
import SurveyDeductionBanner from '../components/SurveyDeductionBanner';
import { PageId } from '../types';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full">
      {/* Row 2.1: Cinematic Hero Section with Looping Background Video */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 bg-[#010101]">
        {/* Full-screen looping background video with full visibility */}
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-100 scale-100 transition-opacity duration-500"
          style={{
            filter: 'contrast(1.05) brightness(1.1)',
          }}
        />

        {/* Minimalist scrim: soft top/bottom fade only, allowing the video background to be fully vivid and visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Video Controls Pill */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs text-white/90 shadow-xl">
          <button
            onClick={togglePlay}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title={isPlaying ? 'Tạm dừng video nền' : 'Phát video nền'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span className="hidden sm:inline font-lora text-[11px]">{isPlaying ? 'Dừng' : 'Phát'}</span>
          </button>
          <span className="w-px h-3 bg-white/25" />
          <button
            onClick={toggleMute}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>

        {/* Hero Content Box with crisp drop shadows for perfect readability */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pt-8 sm:pt-12">
            {/* Subtle Category Kicker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-lora uppercase tracking-[0.25em] text-[#EBE5D9] bg-black/40 border border-white/20 backdrop-blur-md shadow-lg"
          >
            <Compass size={13} className="text-[#B56D4F]" />
            <span>Dự án số hóa phát triển từ kết quả khảo sát 100 bạn đọc trẻ</span>
          </motion.div>

          {/* Staggered Heading with high-contrast text shadow */}
          <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.08] mb-4 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            <span className="block drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              <StaggeredFade text="GIỚI TRẺ VIỆT" delayOffset={0.2} />
            </span>
            <span className="block italic font-medium text-[#F5F1E8] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              <StaggeredFade text="ĐANG ĐỌC GÌ?" delayOffset={0.6} />
            </span>
          </h1>

          {/* Separator under H1 */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            <VintageSeparator color="#EBE5D9" width="w-20 sm:w-28" />
          </motion.div>

          {/* Subtitle with soft background scrim for 100% readability */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="font-lora text-white font-normal text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 px-6 py-2 rounded-2xl bg-black/35 backdrop-blur-xs border border-white/10 shadow-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            Sau khi thực hiện cuộc khảo sát thực tế với 100 bạn trẻ về thói quen và những rào cản thời đại số, chúng mình kiến tạo website Đọc & Trẻ như một hệ sinh thái giải pháp đồng hành, thấu cảm và đưa sách trở lại cuộc sống thường nhật.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => onNavigate('library')}
              className="liquid-glass rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer group shadow-2xl bg-[#B56D4F]/85 hover:bg-[#B56D4F] border border-white/30"
            >
              <BookOpen size={16} />
              <span>Khám phá Thư viện sách</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('reading-habits')}
              className="px-8 py-3.5 sm:py-4 rounded-full text-white hover:text-white text-xs sm:text-sm uppercase tracking-[0.18em] border border-white/30 hover:border-white/60 bg-black/35 hover:bg-black/50 backdrop-blur-sm transition-all w-full sm:w-auto cursor-pointer shadow-lg"
            >
              Xem thói quen đọc
            </button>
          </motion.div>
        </div>

        {/* Bottom subtle indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/50 text-[11px] font-lora tracking-widest uppercase">
          <span>Khám phá các chuyên mục tuyển chọn</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/40 to-transparent mt-2 animate-pulse" />
        </div>
      </section>

      {/* Row 2.2: Giới thiệu nhanh (Teaser) with Vintage Paper Background */}
      <section className="w-full vintage-paper-alt py-16 sm:py-24 border-y border-[#D6CDBF] text-[#3A3530]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B56D4F] font-semibold block mb-2 font-lora">
            Từ kết quả khảo sát đến giải pháp thực tế
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3A3530] mb-3">
            Website ra đời từ tiếng nói của 100 bạn đọc trẻ
          </h2>
          <VintageSeparator color="#B56D4F" width="w-24" />

          {/* BANNER ĐỐI CHIẾU KHẢO SÁT SUY RA THÀNH PHẦN WEBSITE */}
          <div className="mt-8 mb-6">
            <SurveyDeductionBanner
              topicNumber="TỔNG QUAN DỰ ÁN"
              surveyQuestionSource="Phân tích tổng hợp 100 mẫu phiếu khảo sát"
              surveyMetricHighlight="32,3% online vs 31,2% sách giấy · 36,3% cần gợi ý đúng gu"
              surveyQuote="Giới trẻ đọc song song truyện online (32,3%) và sách giấy (31,2%). 76,6% tìm đến nguồn miễn phí, nhưng 39,1% bị phân tâm bởi điện thoại & video ngắn. Điểm nghẽn không phải là thiếu sách ('không biết đọc gì' chỉ 4,8%), mà 36,3% cần gợi ý đúng gu cá nhân và 27,5% cần không gian yên tĩnh."
              deducedComponentTitle="Kiến tạo hệ sinh thái 5 chuyên đề giải quyết từng điểm nghẽn"
              deducedComponentDescription="Từ các phát hiện trọng yếu, website xây dựng lộ trình hoàn chỉnh: từ phương pháp đọc vi mô chống xao nhãng (CĐ 01), bản đồ gu đọc đa dạng (CĐ 02), thư viện 40 kiệt tác miễn phí (CĐ 03), đến trung tâm dữ liệu D3.js (CĐ 04) và mini-game giải mã tương tác."
              solutionTags={[
                'Giải pháp xao nhãng số',
                'Bản đồ gu đọc cá nhân',
                'Thư viện 40 sách miễn phí',
                'D3.js Dashboard 11 câu hỏi',
                'Gamification tương tác',
              ]}
              variant="light"
            />
          </div>

          <p className="font-lora text-base sm:text-lg text-[#3A3530] max-w-3xl mx-auto leading-relaxed mt-4">
            Khảo sát 100 bạn trẻ cho thấy: <strong>39,1%</strong> bị xao nhãng bởi điện thoại & video ngắn, <strong>20,4%</strong> thiếu thời gian, <strong>76,6%</strong> tiếp cận sách từ nguồn miễn phí và tới <strong>36,3%</strong> khẳng định sẽ đọc nhiều hơn nếu có gợi ý đúng gu. Website <strong>Đọc & Trẻ</strong> được thiết kế để biến từng trăn trở đó thành giải pháp thực tế, bền vững.
          </p>

          {/* 5 Quick Navigation Action Cards: Đầy đủ 5 chuyên đề */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mt-12 text-left">
            {/* Chuyên đề 01 */}
            <div
              onClick={() => onNavigate('reading-habits')}
              className="vintage-card-bg p-5 sm:p-6 rounded-2xl hover:border-[#B56D4F] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border border-[#D6CDBF]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B56D4F] block mb-1">
                  Chuyên đề 01
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] mb-2 group-hover:text-[#B56D4F] transition-colors leading-snug">
                  Thói quen đọc sách
                </h3>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Giải pháp cho 24,1% bị điện thoại phân tâm & 20,4% thiếu thời gian: Phương pháp đọc vi mô 15–30 phút và quy tắc 2 phút.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center gap-1.5 text-xs font-semibold text-[#B56D4F] group-hover:underline">
                <span>Khám phá</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Chuyên đề 02 */}
            <div
              onClick={() => onNavigate('genres')}
              className="vintage-card-bg p-5 sm:p-6 rounded-2xl hover:border-[#B56D4F] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border border-[#D6CDBF]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBE5D9] text-[#6B7A6E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BookOpen size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7A6E] block mb-1">
                  Chuyên đề 02
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] mb-2 group-hover:text-[#B56D4F] transition-colors leading-snug">
                  Thể loại sách hot
                </h3>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Bắt nhịp gu đọc từ khảo sát: Top Manga (17,2%), Văn học (15,5%), Tâm lý học (14,5%) & Viễn tưởng (13,7%).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center gap-1.5 text-xs font-semibold text-[#B56D4F] group-hover:underline">
                <span>Khám phá</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Chuyên đề 03 */}
            <div
              onClick={() => onNavigate('library')}
              className="vintage-card-bg p-5 sm:p-6 rounded-2xl hover:border-[#B56D4F] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border-2 border-[#B56D4F]/40 shadow-xs"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#B56D4F]/15 text-[#B56D4F] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B56D4F] block mb-1">
                  Chuyên đề 03
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] mb-2 group-hover:text-[#B56D4F] transition-colors leading-snug">
                  Thư viện sách mở
                </h3>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Phục vụ 76,6% tiếp cận từ nguồn miễn phí: Tuyển tập 40 kiệt tác chọn lọc kèm link đọc online không tốn phí.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center gap-1.5 text-xs font-semibold text-[#B56D4F] group-hover:underline">
                <span>Khám phá</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Chuyên đề 04 */}
            <div
              onClick={() => onNavigate('survey')}
              className="vintage-card-bg p-5 sm:p-6 rounded-2xl hover:border-[#B56D4F] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border border-[#B56D4F]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B56D4F] block mb-1">
                  Chuyên đề 04
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] mb-2 group-hover:text-[#B56D4F] transition-colors leading-snug">
                  Kết quả khảo sát
                </h3>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Điểm khởi nguồn dự án: Video báo cáo và bảng phân tích 11 câu hỏi thực tế của 100 bạn trẻ.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center gap-1.5 text-xs font-semibold text-[#B56D4F] group-hover:underline">
                <span>Khám phá</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Chuyên đề 05 */}
            <div
              onClick={() => onNavigate('about')}
              className="vintage-card-bg p-5 sm:p-6 rounded-2xl hover:border-[#B56D4F] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border border-[#D6CDBF]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Users size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B56D4F] block mb-1">
                  Chuyên đề 05
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] mb-2 group-hover:text-[#B56D4F] transition-colors leading-snug">
                  Về chúng mình
                </h3>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Hành trình sáng lập Đọc & Trẻ: Biến những số liệu khảo sát thành nền tảng đồng hành cùng độc giả trẻ.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center gap-1.5 text-xs font-semibold text-[#B56D4F] group-hover:underline">
                <span>Khám phá</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Chuyên đề GIẢI TRÍ: Game */}
            <div
              onClick={() => onNavigate('detective-game')}
              className="vintage-card-bg p-5 sm:p-6 rounded-2xl bg-[#1F3B34] border-[#D9A441]/30 hover:border-[#D9A441] hover:shadow-[0_10px_30px_rgba(217,164,65,0.2)] transition-all cursor-pointer group flex flex-col justify-between border shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#D9A441]/20 text-[#D9A441] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(217,164,65,0.3)]">
                  <MagnifyingGlass size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block mb-1">
                  Giải trí bí ẩn
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#FBF6E9] mb-2 group-hover:text-[#D9A441] transition-colors leading-snug">
                  Thám Tử Thư Viện
                </h3>
                <p className="font-lora text-xs text-[#FBF6E9]/60 leading-relaxed">
                  Thử thách suy luận: Giải mã cuốn sách bí ẩn từ những manh mối cổ xưa mỗi ngày.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs font-semibold text-[#D9A441] group-hover:underline">
                <span>Vào phá án</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* SƠ ĐỒ CHUYỂN HÓA: TỪ VẤN ĐỀ KHẢO SÁT -> GIẢI PHÁP WEBSITE */}
          <div className="mt-20 pt-16 border-t-2 border-[#D6CDBF]/70 text-left">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/30 font-sans mb-3">
                <Compass size={13} />
                <span>Mối liên hệ cốt lõi</span>
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#3A3530] mb-3">
                Từ Tiếng Nói Khảo Sát Đến Từng Trang Website
              </h3>
              <p className="font-lora text-sm sm:text-base text-[#6B635A] leading-relaxed">
                Sau khi hoàn tất khảo sát 100 bạn trẻ, chúng mình không để các số liệu nằm im trong báo cáo. Từng trang nội dung trên website này được thiết kế như một lời giải đáp thực tế cho những khó khăn mà chính các bạn đã chia sẻ:
              </p>
            </div>

            {/* 4 Khối liên kết Vấn đề -> Giải pháp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cặp 1: Xao nhãng & Thời gian -> Chuyên đề 01 */}
              <div className="vintage-card-bg p-6 sm:p-7 rounded-3xl border-2 border-[#D6CDBF] bg-[#FAF7F0] shadow-sm flex flex-col justify-between hover:border-[#B56D4F] transition-all">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[#D6CDBF]/70">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-sans">
                      ⚠️ Vấn đề từ khảo sát (Câu 4 & 5)
                    </span>
                    <span className="text-xs font-bold text-rose-700 font-sans">66% bị phân tâm</span>
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#3A3530] mb-2">
                    Bị điện thoại xao nhãng & Cảm giác không có thời gian đọc
                  </h4>
                  <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed mb-4">
                    66% bạn trẻ thừa nhận thông báo mạng xã hội và video ngắn khiến họ mất tập trung; 56% cảm thấy quá bận rộn để hoàn thành một cuốn sách.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border border-[#D6CDBF] mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] block font-sans mb-1">
                      💡 Giải pháp website: Chuyên đề 01
                    </span>
                    <p className="font-lora text-xs text-[#3A3530] leading-relaxed">
                      Cung cấp phương pháp <strong>đọc vi mô 15–20 phút/ngày</strong>, quy tắc 2 phút khởi động, bảng tính tiềm năng đọc và trắc nghiệm tìm phong cách đọc bền vững.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('reading-habits')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Xem phương pháp đọc vi mô</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Cặp 2: Chi phí & Tìm nguồn sách -> Chuyên đề 03 */}
              <div className="vintage-card-bg p-6 sm:p-7 rounded-3xl border-2 border-[#D6CDBF] bg-[#FAF7F0] shadow-sm flex flex-col justify-between hover:border-[#B56D4F] transition-all">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[#D6CDBF]/70">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-sans">
                      ⚠️ Vấn đề từ khảo sát (Câu 6 & 7)
                    </span>
                    <span className="text-xs font-bold text-rose-700 font-sans">75% tìm sách free</span>
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#3A3530] mb-2">
                    Rào cản giá sách giấy & Khó tiếp cận nguồn đọc uy tín
                  </h4>
                  <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed mb-4">
                    75% bạn đọc trẻ tìm kiếm các nguồn sách miễn phí hoặc gặp áp lực tài chính khi mua sách mới; nhiều bạn đọc lúng túng giữa nguồn sách lậu kém chất lượng.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border border-[#D6CDBF] mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] block font-sans mb-1">
                      💡 Giải pháp website: Chuyên đề 03
                    </span>
                    <p className="font-lora text-xs text-[#3A3530] leading-relaxed">
                      Tuyển tập <strong>40 kiệt tác kinh điển</strong> đã phân tích thông điệp giáo dục, trích dẫn hay và tích hợp sẵn <strong>link đọc online miễn phí</strong> hợp pháp.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('library')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Khám phá 40 cuốn sách miễn phí</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Cặp 3: Khó tìm sách đúng gu -> Chuyên đề 02 */}
              <div className="vintage-card-bg p-6 sm:p-7 rounded-3xl border-2 border-[#D6CDBF] bg-[#FAF7F0] shadow-sm flex flex-col justify-between hover:border-[#B56D4F] transition-all">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[#D6CDBF]/70">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-sans">
                      ⚠️ Vấn đề từ khảo sát (Câu 8 & 9)
                    </span>
                    <span className="text-xs font-bold text-rose-700 font-sans">Top Manga & Văn học</span>
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#3A3530] mb-2">
                    Lạc giữa ma trận sách & Cần gợi ý đúng thị hiếu
                  </h4>
                  <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed mb-4">
                    57% chọn sách từ review mạng xã hội nhưng hay thất vọng; giới trẻ rất chuộng Manga (51%), Văn học (46%) và Tâm lý (43%) nhưng thiếu bản đồ phân tích có chiều sâu.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border border-[#D6CDBF] mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] block font-sans mb-1">
                      💡 Giải pháp website: Chuyên đề 02
                    </span>
                    <p className="font-lora text-xs text-[#3A3530] leading-relaxed">
                      Xây dựng <strong>Bản đồ 6 thể loại sách hot</strong>, giải mã tâm lý vì sao người trẻ chuộng từng dòng sách và bộ lọc tìm sách theo tâm trạng cảm xúc.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('genres')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Khám phá bản đồ gu đọc</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Cặp 4: Đọc sách đơn độc, thiếu động lực -> Thám tử Game & Góc tâm sự */}
              <div className="vintage-card-bg p-6 sm:p-7 rounded-3xl border-2 border-[#D6CDBF] bg-[#FAF7F0] shadow-sm flex flex-col justify-between hover:border-[#B56D4F] transition-all">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[#D6CDBF]/70">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-sans">
                      ⚠️ Vấn đề từ khảo sát (Câu 10 & 11)
                    </span>
                    <span className="text-xs font-bold text-rose-700 font-sans">70% muốn người gợi ý</span>
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#3A3530] mb-2">
                    Thiếu môi trường tương tác & Cần động lực gắn kết
                  </h4>
                  <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed mb-4">
                    70% người trẻ khẳng định sẽ đọc nhiều hơn nếu có người gợi mở đúng lúc, có không gian tương tác nhẹ nhàng và hoạt động kích thích trí tò mò thay vì ép buộc.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border border-[#D6CDBF] mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] block font-sans mb-1">
                      💡 Giải pháp website: Tương tác & Game hóa
                    </span>
                    <p className="font-lora text-xs text-[#3A3530] leading-relaxed">
                      Ra mắt <strong>Game Thám Tử Thư Viện</strong> giải mã sách bí ẩn, <strong>Trích dẫn mỗi ngày</strong> và <strong>Góc tâm sự bạn đọc</strong> để cùng nhau trải lòng.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('detective-game')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1F3B34] hover:bg-[#162A25] text-[#D9A441] border border-[#D9A441]/40 text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Chơi Thám tử Thư viện</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2.2.5: Daily Quote Section */}
      <DailyQuote />

      {/* Row 2.2.8: Confession Corner Section */}
      <ConfessionCorner />

      {/* Row 2.3: Một vài con số đáng chú ý & Góc nhìn báo chí */}
      <section className="w-full vintage-paper-bg py-16 sm:py-24 text-[#3A3530]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6B7A6E] font-semibold block mb-2 font-lora">
              Bức tranh toàn cảnh từ khảo sát & Báo chí
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-[#3A3530]">
              Một vài con số đáng chú ý
            </h2>
            <VintageSeparator color="#6B7A6E" width="w-20" />
            <p className="font-lora text-sm sm:text-base text-[#6B635A]">
              Các số liệu thực tế được đúc kết từ 100 phiếu phản hồi của độc giả trẻ và các báo cáo, bài viết uy tín về văn hóa đọc trong kỷ nguyên số.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Stat Card 1 */}
            <div className="vintage-card-bg p-8 rounded-2xl text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#B56D4F]" />
              <div className="font-playfair text-5xl sm:text-6xl font-black text-[#B56D4F] tracking-tight mb-2">
                82%
              </div>
              <div className="font-lora font-semibold text-base sm:text-lg text-[#3A3530] mb-2">
                Độ tuổi 18–23 tuổi (Gen Z)
              </div>
              <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed">
                Lực lượng bạn đọc trẻ áp đảo trong khảo sát, đang tìm kiếm phong cách tiếp cận tri thức nhanh nhạy và tự chủ.
              </p>
            </div>

            {/* Stat Card 2 */}
            <div className="vintage-card-bg p-8 rounded-2xl text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B7A6E]" />
              <div className="font-playfair text-5xl sm:text-6xl font-black text-[#6B7A6E] tracking-tight mb-2">
                15–30'
              </div>
              <div className="font-lora font-semibold text-base sm:text-lg text-[#3A3530] mb-2">
                Thời lượng đọc lý tưởng / lần
              </div>
              <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed">
                43% bạn trẻ chọn khung thời gian tập trung này, giúp chúng mình định hình phương pháp đọc vi mô không áp lực.
              </p>
            </div>

            {/* Stat Card 3 */}
            <div className="vintage-card-bg p-8 rounded-2xl text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#B56D4F]" />
              <div className="font-playfair text-5xl sm:text-6xl font-black text-[#B56D4F] tracking-tight mb-2">
                70%
              </div>
              <div className="font-lora font-semibold text-base sm:text-lg text-[#3A3530] mb-2">
                Sẽ đọc nhiều hơn nếu có gợi ý đúng gu
              </div>
              <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed">
                Nhu cầu cấp thiết nhất của người trẻ: một người bạn đồng hành thấu hiểu tâm trạng để gợi mở cuốn sách phù hợp.
              </p>
            </div>
          </div>

          {/* Deep Insight Spotlight Banner */}
          <div className="mt-10 vintage-card-bg p-8 rounded-2xl border-2 border-[#D6CDBF] bg-[#FAF7F0] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                  57% Bạn trẻ chọn sách từ Review trên Mạng Xã Hội (#BookTok & Facebook)
                </h4>
                <p className="font-lora text-sm text-[#6B635A] mt-1 leading-relaxed">
                  Từ khảo sát thực tế, mạng xã hội là kênh tìm kiếm sách số 1. Nhưng 66% cũng thừa nhận điện thoại là rào cản xao nhãng lớn nhất. Chúng mình ở đây để giúp bạn cân bằng hai thái cực này.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('survey')}
              className="shrink-0 px-6 py-3 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Xem toàn bộ kết quả khảo sát</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* 2 BÀI BÁO THAM KHẢO VỀ VĂN HÓA ĐỌC TRONG KỶ NGUYÊN SỐ */}
          <div className="mt-10 pt-8 border-t border-[#D6CDBF]/80">
            <div className="flex items-center gap-2.5 mb-5">
              <Newspaper size={20} className="text-[#B56D4F]" />
              <div>
                <h4 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
                  Tài Liệu Báo Chí Tham Khảo: Văn Hóa Đọc Trong Kỷ Nguyên Số
                </h4>
                <p className="font-lora text-xs sm:text-sm text-[#6B635A]">
                  Số liệu bổ trợ từ các cơ quan báo chí uy tín phân tích về sự trỗi dậy của sách số và văn hóa đọc thế hệ trẻ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Bài báo 1: VietTimes */}
              <a
                href="https://viettimes.vn/thi-truong-sach-so-tang-nhanh-nho-gioi-tre-doanh-thu-ebook-chiem-ty-le-bao-nhieu-post186839.html"
                target="_blank"
                rel="noopener noreferrer"
                className="vintage-card-bg p-6 rounded-2xl border-2 border-[#D6CDBF] bg-[#FAF7F0] hover:border-[#B56D4F] hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#5B50E5]/10 text-[#5B50E5] border border-[#5B50E5]/20 font-sans">
                      Tạp chí VietTimes · Xu hướng thị trường
                    </span>
                    <ExternalLink size={15} className="text-[#6B635A] group-hover:text-[#B56D4F] transition-colors" />
                  </div>
                  <h5 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] group-hover:text-[#B56D4F] transition-colors leading-snug mb-2">
                    Thị trường sách số tăng nhanh nhờ giới trẻ - Doanh thu ebook chiếm tỷ lệ bao nhiêu?
                  </h5>
                  <p className="font-lora text-xs sm:text-sm text-[#5C554E] leading-relaxed">
                    Bài viết phân tích các số liệu thực tế về sự tăng trưởng vượt bậc của sách điện tử (Ebook), sách nói và các nền tảng đọc trực tuyến do chính lực lượng độc giả trẻ dẫn dắt tại Việt Nam.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center justify-between text-xs font-sans text-[#B56D4F] font-bold group-hover:underline">
                  <span>Xem bài viết trên VietTimes</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* Bài báo 2: Báo Quân đội nhân dân */}
              <a
                href="https://www.qdnd.vn/van-hoa/doi-song/van-hoa-doc-trong-ky-nguyen-so-837751"
                target="_blank"
                rel="noopener noreferrer"
                className="vintage-card-bg p-6 rounded-2xl border-2 border-[#D6CDBF] bg-[#FAF7F0] hover:border-[#B56D4F] hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#B56D4F]/10 text-[#B56D4F] border border-[#B56D4F]/20 font-sans">
                      Báo Quân Đội Nhân Dân · Văn hóa & Đời sống
                    </span>
                    <ExternalLink size={15} className="text-[#6B635A] group-hover:text-[#B56D4F] transition-colors" />
                  </div>
                  <h5 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] group-hover:text-[#B56D4F] transition-colors leading-snug mb-2">
                    Văn hóa đọc trong kỷ nguyên số
                  </h5>
                  <p className="font-lora text-xs sm:text-sm text-[#5C554E] leading-relaxed italic">
                    “Giữa kỷ nguyên số, khi mạng xã hội và các phương tiện nghe nhìn bùng nổ, việc nuôi dưỡng tình yêu với sách và định hình văn hóa đọc sâu là thách thức nhưng cũng mở ra cơ hội lớn cho giới trẻ để bồi đắp tri thức.”
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center justify-between text-xs font-sans text-[#B56D4F] font-bold group-hover:underline">
                  <span>Xem bài viết trên Báo QĐND</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

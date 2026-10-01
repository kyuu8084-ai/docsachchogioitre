import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Smartphone, Sparkles, TrendingUp, Volume2, VolumeX, Pause, Play, Compass, CheckCircle2, Users } from 'lucide-react';
import StaggeredFade from '../components/StaggeredFade';
import VintageSeparator from '../components/VintageSeparator';
import DailyQuote from '../components/DailyQuote';
import ConfessionCorner from '../components/ConfessionCorner';
import MoodBookSuggestions from '../components/MoodBookSuggestions';
import { PageId } from '../types';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
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
            <span>Nghiên cứu văn hóa đọc thế hệ trẻ</span>
          </motion.div>

          {/* Staggered Heading with high-contrast text shadow */}
          <h1 className="font-garamond text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.08] mb-4 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            <span className="block drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              <StaggeredFade text="GIỚI TRẺ VIỆT" delayOffset={0.2} />
            </span>
            <span className="block italic text-[#F5F1E8] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
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
            Khám phá thói quen, tâm lý và những thể loại sách mà các bạn trẻ Việt Nam đang tìm kiếm giữa kỷ nguyên số ngập tràn kích thích.
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
              className="px-7 py-3.5 rounded-full text-white hover:text-white text-xs sm:text-sm uppercase tracking-[0.18em] border border-white/30 hover:border-white/60 bg-black/35 hover:bg-black/50 backdrop-blur-sm transition-all w-full sm:w-auto cursor-pointer shadow-lg"
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
            Góc nhìn thực tế
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3A3530] mb-3">
            Văn hóa đọc trong giới trẻ hôm nay
          </h2>
          <VintageSeparator color="#B56D4F" width="w-24" />

          <p className="font-lora text-base sm:text-lg text-[#3A3530] max-w-3xl mx-auto leading-relaxed mt-4">
            Dù mạng xã hội, video ngắn và thông tin tức thời đang chiếm nhiều thời gian biểu, thế hệ trẻ vẫn tìm thấy trong từng trang sách một khoảng trời tĩnh lặng để <strong>“ngắt kết nối”</strong>, nâng cao kỹ năng nghề nghiệp và tìm kiếm sự cân bằng nội tâm. Cùng chúng mình bóc tách góc nhìn này qua các phần chuyên sâu bên dưới.
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
                  Phân tích hình thức sách giấy vs ebook, thời lượng 15–30 phút mỗi ngày và rào cản số.
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
                  Top 13 nhóm sách được săn đón: Self-help, Chữa lành, Fiction, Comics, Kinh tế, Lịch sử...
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
                  Thư viện sách
                </h3>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Tuyển tập 40 tác phẩm kinh điển được yêu thích nhất kèm tóm tắt và giá trị giáo dục.
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
              className="vintage-card-bg p-5 sm:p-6 rounded-2xl hover:border-[#B56D4F] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border border-[#D6CDBF]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B56D4F] block mb-1">
                  Chuyên đề 04
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#3A3530] mb-2 group-hover:text-[#B56D4F] transition-colors leading-snug">
                  Khảo sát bạn đọc
                </h3>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Chia sẻ hành vi đọc chỉ 2 phút, xem đối chiếu biểu đồ tròn & tỷ lệ phần trăm trực tiếp.
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
                  Câu chuyện sáng lập dự án Đọc & Trẻ, sứ mệnh kết nối tri thức và không gian giao lưu.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D6CDBF]/60 flex items-center gap-1.5 text-xs font-semibold text-[#B56D4F] group-hover:underline">
                <span>Khám phá</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2.2.5: Daily Quote Section */}
      <DailyQuote />

      {/* Row 2.2.8: Confession Corner Section */}
      <ConfessionCorner />

      {/* Row 2.2.9: Mood-based Book Suggestions Section (AI Powered) */}
      <MoodBookSuggestions />

      {/* Row 2.3: Số liệu nổi bật (Infographic Teaser) */}
      <section className="w-full vintage-paper-bg py-16 sm:py-24 text-[#3A3530]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6B7A6E] font-semibold block mb-2 font-lora">
              Bức tranh toàn cảnh
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-[#3A3530]">
              Một vài con số đáng chú ý
            </h2>
            <VintageSeparator color="#6B7A6E" width="w-20" />
            <p className="font-lora text-sm sm:text-base text-[#6B635A]">
              Dữ liệu tổng hợp từ các báo cáo xuất bản và khảo sát thực tế thói quen tiếp nhận tri thức của bạn trẻ Việt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Stat Card 1 */}
            <div className="vintage-card-bg p-8 rounded-2xl text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#B56D4F]" />
              <div className="font-playfair text-5xl sm:text-6xl font-black text-[#B56D4F] tracking-tight mb-2">
                1–4
              </div>
              <div className="font-lora font-semibold text-base sm:text-lg text-[#3A3530] mb-2">
                cuốn sách / năm
              </div>
              <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed">
                Mức đọc trung bình của người trẻ nói chung (chưa tính sách giáo trình học đường bắt buộc).
              </p>
            </div>

            {/* Stat Card 2 */}
            <div className="vintage-card-bg p-8 rounded-2xl text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B7A6E]" />
              <div className="font-playfair text-5xl sm:text-6xl font-black text-[#6B7A6E] tracking-tight mb-2">
                30–40%
              </div>
              <div className="font-lora font-semibold text-base sm:text-lg text-[#3A3530] mb-2">
                bạn trẻ đọc thường xuyên
              </div>
              <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed">
                Duy trì việc đọc ít nhất 15–30 phút mỗi ngày hoặc đều đặn hàng tuần như một thói quen cố định.
              </p>
            </div>

            {/* Stat Card 3 */}
            <div className="vintage-card-bg p-8 rounded-2xl text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#B56D4F]" />
              <div className="font-playfair text-4xl sm:text-5xl font-black text-[#B56D4F] tracking-tight mb-2 pt-2">
                +45%
              </div>
              <div className="font-lora font-semibold text-base sm:text-lg text-[#3A3530] mb-2">
                Ebook & Audiobook
              </div>
              <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed">
                Mức tăng trưởng ấn tượng trong 2 năm qua ở các ứng dụng nghe sách nói và đọc sách kỹ thuật số tiện lợi.
              </p>
            </div>
          </div>

          {/* Deep Insight Spotlight Banner */}
          <div className="mt-12 vintage-card-bg p-8 rounded-2xl border-2 border-[#D6CDBF] bg-[#FAF7F0] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBE5D9] text-[#B56D4F] flex items-center justify-center shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                  Xu hướng lan tỏa văn hóa đọc trên #BookTok & Podcast
                </h4>
                <p className="font-lora text-sm text-[#6B635A] mt-1 leading-relaxed">
                  Có tới 68% bạn trẻ cho biết họ chọn mua cuốn sách tiếp theo dựa trên những video chia sẻ chân thật từ các cộng đồng review sách, trích dẫn truyền cảm hứng trên TikTok và Instagram.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('genres')}
              className="shrink-0 px-6 py-3 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Xem các sách thịnh hành</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

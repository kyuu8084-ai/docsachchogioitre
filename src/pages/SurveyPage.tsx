import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, ArrowLeft, BookOpen, Compass, Pause, Play, Volume2, VolumeX, ExternalLink, Sparkles, ClipboardList, Lightbulb, BarChart3 } from 'lucide-react';
import VintageSeparator from '../components/VintageSeparator';
import SurveyAnalysisDashboard from '../components/SurveyAnalysisDashboard';
import SurveyInsightsSection from '../components/SurveyInsightsSection';
import SurveyDeductionBanner from '../components/SurveyDeductionBanner';
import { PageId } from '../types';

interface SurveyPageProps {
  onNavigate: (page: PageId) => void;
}

const SURVEY_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd8cuYvyqvNlRHCEBMAgt7qxz60k9IDRrBGz9VO_V9kUXkOpg/viewform?usp=publish-editor";

export default function SurveyPage({ onNavigate }: SurveyPageProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoBgRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlayback = () => {
    if (videoBgRef.current) {
      if (isPlaying) {
        videoBgRef.current.pause();
      } else {
        videoBgRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoBgRef.current) {
      videoBgRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full min-h-[100svh] bg-black text-[#3A3530] overflow-x-hidden">
      {/* BACKGROUND VIDEO: Nền video gốc của trang khảo sát */}
      <video
        ref={videoBgRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          opacity: 1,
          filter: 'contrast(1.05) brightness(1.08)',
        }}
      />

      {/* Lớp phủ tối mờ tinh tế giúp video nền hiển thị rõ nét */}
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-0" />

      {/* Nút điều khiển video nền góc dưới phải */}
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

      {/* LỚP NỘI DUNG CHÍNH */}
      <div className="relative z-10 w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl w-full mx-auto text-center">
          {/* Badge chuyên đề */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#EBE5D9] bg-black/50 border border-white/25 backdrop-blur-md shadow-lg mb-4"
          >
            <Compass size={14} className="text-[#B56D4F]" />
            <span className="font-sans">CHUYÊN ĐỀ 04 · BÁO CÁO TỔNG HỢP</span>
          </motion.div>

          {/* Tiêu đề trang: Kết quả khảo sát */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md"
          >
            Kết quả khảo sát
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <VintageSeparator color="#EBE5D9" width="w-28" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-lora text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto mt-4 mb-6 drop-shadow-xs"
          >
            Điểm khởi nguồn của toàn bộ dự án: Sau khi thực hiện cuộc khảo sát thực tế với 100 bạn trẻ, nhóm chúng mình đã phân tích từng khó khăn và kiến tạo nên website <strong>Đọc & Trẻ</strong> như một giải pháp số đồng hành toàn diện.
          </motion.p>

          {/* BANNER TỪ KẾT QUẢ KHẢO SÁT SUY RA THÀNH PHẦN CHUYÊN ĐỀ 04 */}
          <div className="mb-8">
            <SurveyDeductionBanner
              topicNumber="CHUYÊN ĐỀ 04"
              surveyQuestionSource="Bộ dữ liệu gốc 11 câu hỏi từ 100 độc giả trẻ"
              surveyMetricHighlight="100 phản hồi thực tế · 6 biểu đồ trọng yếu · 11 phân tích sâu"
              surveyQuote="Khi khảo sát 100 bạn trẻ, dữ liệu chỉ ra rõ: 39,1% rào cản đến từ thiết bị số & video ngắn, 76,6% dựa vào nguồn miễn phí, và 36,3% đọc nhiều hơn nếu có gợi ý đúng gu. 'Không biết đọc gì' chỉ chiếm 4,8%, chứng minh người trẻ không hề thiếu sách mà thiếu định hướng cá nhân và giải pháp vượt xao nhãng."
              deducedComponentTitle="Dashboard Dữ liệu D3.js & Trung tâm Phân tích Thực tế Khảo sát"
              deducedComponentDescription="Toàn bộ 11 câu hỏi khảo sát được số hóa thành biểu đồ trực quan D3.js tương tác kèm nhận xét phân tích chuyên sâu cho từng chỉ số, chứng minh tính khoa học và minh bạch đằng sau từng tính năng của website Đọc & Trẻ."
              solutionTags={[
                'Dashboard D3.js 11 câu hỏi',
                'Nhận xét chuyên sâu 6 biểu đồ',
                'Video báo cáo tổng kết',
                'Liên kết biểu mẫu gốc',
              ]}
              variant="glass"
            />
          </div>

          {/* BANNER: Link chứa câu hỏi khảo sát */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#FAF7F0]/95 backdrop-blur-md border-2 border-[#B56D4F] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B56D4F] text-white flex items-center justify-center shrink-0 shadow-md">
                <ClipboardList size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B56D4F] block font-sans">
                  Biểu mẫu dữ liệu gốc
                </span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530] leading-snug">
                  Link chứa câu hỏi khảo sát
                </h3>
                <p className="text-xs text-[#6B635A] font-lora mt-0.5">
                  Biểu mẫu chứa các câu hỏi khảo sát thực tế, là cơ sở để thu thập dữ liệu và rút ra kết quả phân tích bên dưới.
                </p>
              </div>
            </div>

            <a
              href={SURVEY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Xem câu hỏi</span>
              <ExternalLink size={14} />
            </a>
          </motion.div>

          {/* THANH ĐIỀU HƯỚNG NHANH CÁC KHỐI NỘI DUNG */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto"
          >
            <a
              href="#survey-video"
              className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5"
            >
              <Video size={13} className="text-[#B56D4F]" />
              <span>1. Video khảo sát</span>
            </a>
            <a
              href="#survey-origin"
              className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-[#D9A441]" />
              <span>2. Sứ mệnh dự án</span>
            </a>
            <a
              href="#survey-charts"
              className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5"
            >
              <BarChart3 size={13} className="text-[#2563EB]" />
              <span>3. Biểu đồ 11 câu hỏi</span>
            </a>
            <a
              href="#survey-insights"
              className="px-4 py-2 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Lightbulb size={13} className="text-amber-300" />
              <span>4. Insights: Thẻ Ghi Chú Vấn Đề Xã Hội</span>
            </a>
          </motion.div>

          {/* Khung chứa Video Player Google Drive */}
          <motion.div
            id="survey-video"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="w-full max-w-3xl mx-auto bg-[#FAF7F0]/95 backdrop-blur-md p-4 sm:p-8 rounded-3xl border-2 border-[#D6CDBF] shadow-2xl flex flex-col items-center mb-6"
          >
            <div className="w-full flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B56D4F] font-bold font-sans">
                <Video size={16} />
                <span>Video Kết quả khảo sát</span>
              </div>
              <a
                href="https://drive.google.com/file/d/1c_qQtV6FJvPNIYFG69qcJJaZzBvtuu0H/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#B56D4F] hover:text-[#9A5A3F] font-semibold hover:underline"
              >
                <span>Mở trong Google Drive</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Trình phát Video Google Drive nhúng chính thức */}
            <div className="w-full aspect-video max-w-[640px] flex justify-center items-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#D6CDBF]">
              <iframe
                src="https://drive.google.com/file/d/1c_qQtV6FJvPNIYFG69qcJJaZzBvtuu0H/preview"
                width="640"
                height="360"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
                title="Video kết quả khảo sát thói quen đọc sách"
              />
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#6B635A] font-lora italic text-center">
              Trình phát video kết quả khảo sát từ Google Drive
            </p>
          </motion.div>

          {/* KHỐI NỘI DUNG: TỪ KẾT QUẢ KHẢO SÁT ĐẾN SỰ RA ĐỜI CỦA WEBSITE */}
          <motion.div
            id="survey-origin"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto my-8 bg-[#FAF7F0] p-6 sm:p-10 rounded-3xl border-2 border-[#B56D4F] shadow-2xl text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B56D4F] block font-sans">
                  Sứ mệnh dự án
                </span>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
                  Vì Sao Website Đọc & Trẻ Ra Đời Sau Cuộc Khảo Sát Này?
                </h3>
              </div>
            </div>

            <p className="font-lora text-sm sm:text-base text-[#4A433D] leading-relaxed mb-6">
              Khi thực hiện khảo sát 100 bạn trẻ về thói quen và gu đọc sách, chúng mình nhận ra một thực tế sâu sắc: <em>người trẻ không hề thờ ơ với tri thức, nhưng đang chịu áp lực quá lớn từ nhịp sống gấp gáp, sự bủa vây của video ngắn và nỗi hoang mang khi không biết chọn cuốn sách nào phù hợp</em>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white border border-[#D6CDBF] shadow-2xs">
                <span className="w-7 h-7 rounded-lg bg-[#EBE5D9] text-[#B56D4F] font-bold text-xs flex items-center justify-center font-sans mb-2">01</span>
                <h4 className="font-playfair text-sm font-bold text-[#3A3530] mb-1">Khảo sát & Lắng nghe</h4>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Thu thập 100 phản hồi chân thực từ biểu mẫu Google Forms về thời gian, gu sách và những cám dỗ từ thiết bị số.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D6CDBF] shadow-2xs">
                <span className="w-7 h-7 rounded-lg bg-[#EBE5D9] text-[#B56D4F] font-bold text-xs flex items-center justify-center font-sans mb-2">02</span>
                <h4 className="font-playfair text-sm font-bold text-[#3A3530] mb-1">Nhận diện điểm nghẽn</h4>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Rút ra 4 trở ngại lớn nhất: thiếu thời gian, xao nhãng bởi smartphone, rào cản tài chính và thiếu người gợi ý đúng gu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D6CDBF] shadow-2xs">
                <span className="w-7 h-7 rounded-lg bg-[#B56D4F] text-white font-bold text-xs flex items-center justify-center font-sans mb-2">03</span>
                <h4 className="font-playfair text-sm font-bold text-[#3A3530] mb-1">Kiến tạo website giải pháp</h4>
                <p className="font-lora text-xs text-[#6B635A] leading-relaxed">
                  Biến từng số liệu thành các trang chuyên đề thiết thực: phương pháp đọc vi mô, thư viện miễn phí và game tương tác.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D6CDBF] flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
              <span className="text-[#6B635A] font-medium font-lora">
                Từng chuyên đề trên website đều là lời giải đáp cho 11 câu hỏi khảo sát bên dưới.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('reading-habits')}
                  className="px-3 py-1.5 rounded-lg bg-[#B56D4F]/10 hover:bg-[#B56D4F]/20 text-[#B56D4F] font-bold transition-colors cursor-pointer"
                >
                  Xem Chuyên đề 01
                </button>
                <button
                  onClick={() => onNavigate('library')}
                  className="px-3 py-1.5 rounded-lg bg-[#B56D4F]/10 hover:bg-[#B56D4F]/20 text-[#B56D4F] font-bold transition-colors cursor-pointer"
                >
                  Xem Chuyên đề 03
                </button>
              </div>
            </div>
          </motion.div>

          {/* BẢNG PHÂN TÍCH KẾT QUẢ KHẢO SÁT 11 CÂU HỎI */}
          <div id="survey-charts">
            <SurveyAnalysisDashboard />
          </div>

          {/* THÀNH PHẦN INSIGHTS CHUYÊN SÂU: THẺ GHI CHÚ PHÂN TÍCH VẤN ĐỀ XÃ HỘI */}
          <SurveyInsightsSection onNavigate={onNavigate} />

          {/* Nút điều hướng cuối trang */}
          <div className="mt-14 pt-8 border-t border-white/20 w-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <a
              href={SURVEY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <ClipboardList size={15} />
              <span>Link chứa câu hỏi khảo sát</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/30 bg-black/40 hover:bg-black/60 text-white text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Về trang chủ</span>
            </button>

            <button
              onClick={() => onNavigate('library')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <BookOpen size={14} />
              <span>Khám phá thư viện sách</span>
            </button>

            <button
              onClick={() => onNavigate('genres')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles size={14} />
              <span>Xem các thể loại sách hot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

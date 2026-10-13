import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Mail, 
  Sparkles, 
  Feather, 
  Users, 
  MapPin, 
  ArrowUpRight,
  Activity,
  Layers,
  CheckCircle2,
  Compass,
  ArrowRight,
  BookmarkCheck,
  Flame,
  Award
} from 'lucide-react';
import SellixCosmicBackground from '../components/SellixCosmicBackground';
import TeamMembersSection from '../components/TeamMembersSection';
import { PageId } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

interface ThemeTopicItem {
  id: string;
  number: string;
  categoryTag: string;
  title: string;
  tagline: string;
  description: string;
  keyMetric: string;
  highlights: string[];
  pageId: PageId;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const THEME_TOPICS: ThemeTopicItem[] = [
  {
    id: 'habits',
    number: '01',
    categoryTag: 'CHUYÊN ĐỀ 01 · GIẢI PHÁP THỜI LƯỢNG & PHƯƠNG THỨC',
    title: 'Thói quen đọc thời kỷ nguyên số',
    tagline: 'Lời giải cho 39,1% rào cản thiết bị số & 20,4% thiếu thời gian',
    description: 'Từ kết quả khảo sát câu hỏi số 1 & 5, chuyên đề xây dựng phương pháp đọc vi mô 15–20 phút mỗi ngày, quy tắc 2 phút và bộ tính toán tiềm năng đọc giúp người trẻ vượt qua bẫy dopamine từ màn hình thông minh.',
    keyMetric: 'Giải pháp cho 39,1% bị xao nhãng số',
    highlights: ['Phương pháp đọc vi mô 15–20 phút', 'Quy tắc 2 phút vượt qua lười biếng', 'Trắc nghiệm 4 kiểu độc giả cá nhân'],
    pageId: 'reading-habits',
    icon: Activity,
  },
  {
    id: 'genres',
    number: '02',
    categoryTag: 'CHUYÊN ĐỀ 02 · GIẢI PHÁP GU ĐỌC & TÂM LÝ',
    title: 'Bản đồ gu đọc đa sắc màu',
    tagline: 'Phản ánh trực tiếp thị hiếu từ 100 phiếu khảo sát thực tế',
    description: 'Bắt nhịp từ câu hỏi số 2 trong khảo sát: Giới trẻ đọc đa dạng, dẫn đầu là Manga / Light novel (17,2%), Tiểu thuyết văn học (15,5%) và Tâm lý học (14,5%). Chuyên đề đi sâu giải mã tâm lý và gợi ý tác phẩm đúng gu từng tâm trạng.',
    keyMetric: 'Top Manga, Văn học & Tâm lý học',
    highlights: ['Giải mã tâm lý độc giả trẻ', 'Phân tích sâu Manga, Văn học & Tâm lý', 'Bộ lọc sách theo cảm xúc tâm trạng'],
    pageId: 'genres',
    icon: Layers,
  },
  {
    id: 'library',
    number: '03',
    categoryTag: 'CHUYÊN ĐỀ 03 · GIẢI PHÁP NGUỒN SÁCH MIỄN PHÍ',
    title: 'Thư viện sách & Tri thức tinh hoa',
    tagline: 'Phục vụ 76,6% bạn đọc tìm kiếm nguồn sách miễn phí chất lượng',
    description: 'Đáp ứng nhu cầu cấp thiết từ câu hỏi số 4 & 6 trong khảo sát: Tuyển chọn 40 kiệt tác kinh điển đa thể loại, tóm tắt thông điệp giáo dục, trích dẫn truyền cảm hứng và tích hợp sẵn link đọc trực tuyến hoàn toàn miễn phí.',
    keyMetric: '40 tác phẩm kèm link đọc online miễn phí',
    highlights: ['Phân loại 4 thể loại rõ ràng', 'Thông điệp & bài học cốt lõi từng cuốn', 'Đọc online miễn phí, không rào cản chi phí'],
    pageId: 'library',
    icon: BookOpen,
  },
  {
    id: 'survey',
    number: '04',
    categoryTag: 'CHUYÊN ĐỀ 04 · KHỞI NGUỒN & DỮ LIỆU GỐC',
    title: 'Kết quả khảo sát bạn đọc trẻ',
    tagline: 'Video tổng hợp & bảng phân tích 11 câu hỏi khởi sinh website',
    description: 'Nền tảng khởi nguồn của toàn bộ dự án Đọc & Trẻ: Video báo cáo tổng kết, bảng trực quan hóa 11 câu hỏi khảo sát thực tế và liên kết đến biểu mẫu câu hỏi thu thập dữ liệu ban đầu từ 100 bạn trẻ.',
    keyMetric: '100 phiếu khảo sát & Video báo cáo',
    highlights: ['Video kết quả khảo sát từ Google Drive', 'Biểu đồ trực quan 11 câu hỏi thực tế', 'Link biểu mẫu câu hỏi khảo sát gốc'],
    pageId: 'survey',
    icon: CheckCircle2,
  },
];

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <SellixCosmicBackground className="min-h-screen font-pjs">
      {/* ========================================================================= */}
      {/* SECTION 1: COSMIC HERO HEADER (Sellix Video Background & Dot-Matrix Earth) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Hero Kicker Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.25em] uppercase text-[#ededed] bg-[#181818]/85 border border-white/15 backdrop-blur-md mb-6 shadow-sm"
          >
            <Sparkles size={13} className="text-[#a855f7]" />
            <span>Chuyên đề 05 · Về chúng mình & Đội ngũ Đọc & Trẻ</span>
          </motion.div>

          {/* Main Hero Heading: Plus Jakarta Sans / Display */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.08] mb-6 drop-shadow-2xl"
          >
            Về dự án Đọc & Trẻ
          </motion.h1>

          {/* Accent Glow Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-[2px] bg-gradient-to-r from-purple-500 via-white to-purple-500 mb-6 shadow-[0_0_16px_rgba(168,85,247,0.7)]"
          />

          {/* Hero Paragraph with High Visibility and Crisp Contrast */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="text-base sm:text-lg md:text-[20px] font-light text-[#ededed] leading-relaxed max-w-2xl mx-auto drop-shadow-md mb-6"
          >
            Khởi nguồn từ niềm tin rằng: Dù công nghệ biến chuyển nhanh đến đâu, việc đọc sâu vẫn là chiếc mỏ neo vững chãi nhất cho tâm hồn người trẻ.
          </motion.p>

          {/* Quick Nav Button to Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              onClick={() => {
                const el = document.getElementById('team-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-[#fdfdfd] hover:bg-white active:scale-95 text-[#050505] text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer"
            >
              <Users size={15} />
              <span>Giới thiệu thành viên nhóm</span>
              <svg className="w-3 h-2.5 ml-0.5" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <path d="M0.8 5h10M7.1 1.4 10.9 5l-3.8 3.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => onNavigate('survey')}
              className="px-6 py-3 rounded-full bg-[#181818]/90 hover:bg-[#232323] active:scale-95 text-[#ededed] hover:text-white text-xs font-semibold border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 size={15} className="text-purple-400" />
              <span>Xem kết quả khảo sát</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: SỨ MỆNH & CÂU CHUYỆN KHỞI NGUỒN (High Text Clarity)          */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Cột Trái: Nội dung giới thiệu */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#c2ba9b] bg-black/50 border border-[#c2ba9b]/30 backdrop-blur-md">
              <Feather size={14} className="text-[#c2ba9b]" />
              <span className="uppercase tracking-[0.15em] font-sans">Sứ mệnh & Hành trình</span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl font-medium text-[#fdfbf6] leading-tight drop-shadow-sm">
              Lan tỏa tình yêu sách và văn hóa đọc sâu
            </h2>

            {/* Văn bản được đóng khung thẻ kính mờ cao cấp với độ nét tối đa */}
            <div className="bg-black/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 space-y-4 shadow-xl">
              <p className="text-sm sm:text-base text-white/95 font-light leading-relaxed">
                Website <strong className="text-white font-medium">Đọc & Trẻ</strong> được thực hiện và ra đời ngay sau khi nhóm hoàn thành cuộc khảo sát thực tế với 100 bạn đọc trẻ Việt Nam về thói quen đọc sách và những rào cản trong thời đại số.
              </p>

              <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed">
                Khi phân tích 100 phiếu phản hồi, chúng mình nhận thấy một thực tế sâu sắc: <strong>66%</strong> bạn trẻ bị điện thoại và mạng xã hội làm xao nhãng, <strong>56%</strong> cảm thấy thiếu thời gian, <strong>75%</strong> tìm kiếm nguồn đọc miễn phí và tới <strong>70%</strong> mong muốn có người gợi ý đúng gu. Thay vì để khảo sát chỉ dừng lại ở một bài thuyết trình trên giấy, chúng mình đã quyết định xây dựng toàn bộ website này như một nền tảng giải pháp số hóa sống động.
              </p>

              <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed">
                Mỗi chuyên đề trên trang web—từ phương pháp đọc vi mô 15–20 phút, bản đồ 6 dòng sách hot, tủ sách 40 tác phẩm kinh điển đọc miễn phí cho đến game Thám tử thư viện—đều được kiến tạo để trả lời trực tiếp từng câu hỏi và giải tỏa từng trăn trở của bạn đọc trẻ.
              </p>
            </div>

            {/* 3 Giá trị cốt lõi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-black/35 backdrop-blur-xl p-5 rounded-2xl border border-white/10 hover:border-[#c2ba9b]/50 transition-all duration-300">
                <div className="text-[#c2ba9b] font-playfair font-medium text-lg mb-1">01. Chân thực</div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">Phản ánh trung thực số liệu và thói quen đọc của giới trẻ Việt Nam.</p>
              </div>
              <div className="bg-black/35 backdrop-blur-xl p-5 rounded-2xl border border-white/10 hover:border-[#c2ba9b]/50 transition-all duration-300">
                <div className="text-[#c2ba9b] font-playfair font-medium text-lg mb-1">02. Thấu cảm</div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">Đồng hành cùng những băn khoăn, rào cản tâm lý của độc giả trẻ.</p>
              </div>
              <div className="bg-black/35 backdrop-blur-xl p-5 rounded-2xl border border-white/10 hover:border-[#c2ba9b]/50 transition-all duration-300">
                <div className="text-[#c2ba9b] font-playfair font-medium text-lg mb-1">03. Cảm hứng</div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">Lan tỏa niềm vui đọc từng ngày với phương pháp 15–20 phút bền bỉ.</p>
              </div>
            </div>
          </motion.div>

          {/* Cột Phải: Thẻ kính nghệ thuật Aura Glass Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="lg:col-span-5 space-y-6"
          >

            <div className="bg-black/45 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden group hover:border-[#c2ba9b]/40 transition-all duration-300">
              {/* Corner Stamp */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#c2ba9b] text-black flex items-center justify-center shadow-lg">
                  <BookOpen size={24} />
                </div>
                <div className="border border-dashed border-[#c2ba9b]/60 px-3.5 py-1 rounded-full text-[11px] font-mono text-[#c2ba9b] tracking-wider uppercase bg-[#c2ba9b]/10">
                  EST. 2026
                </div>
              </div>

              <h3 className="font-playfair text-2xl font-medium text-[#fdfbf6] mb-3 leading-snug">
                “Từng trang sách là một cuộc hẹn hò với chính mình”
              </h3>

              <p className="text-sm text-white/80 font-light leading-relaxed mb-6">
                Khi khép lại chiếc điện thoại và mở ra một cuốn sách, bạn đang tự tặng cho mình món quà quý giá nhất của thời hiện đại: <strong className="text-[#fdfbf6] font-medium">Sự tập trung trọn vẹn và tĩnh lặng</strong>.
              </p>

              {/* Stat Details */}
              <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3 mb-6">
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <Users size={16} className="text-[#c2ba9b] shrink-0" />
                  <span>Khảo sát tương tác kết nối dữ liệu đa thiết bị</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <Compass size={16} className="text-[#c2ba9b] shrink-0" />
                  <span><strong className="text-white font-medium">6</strong> nhóm thể loại sách được nghiên cứu sâu</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <Sparkles size={16} className="text-[#c2ba9b] shrink-0" />
                  <span><strong className="text-white font-medium">100%</strong> phi thương mại & vì cộng đồng bạn đọc</span>
                </div>
              </div>

              {/* Action Button: Aura Style Gold Pill */}
              <button
                onClick={() => onNavigate('survey')}
                className="w-full py-3.5 bg-[#c2ba9b] hover:bg-[#d4ccad] active:scale-95 text-black text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(194,186,155,0.25)] group"
              >
                <span>Xem kết quả khảo sát & dữ liệu gốc</span>
                <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
              </button>
            </div>

            {/* Thư ngỏ ký tên */}
            <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
              <p className="text-xs sm:text-sm text-white/85 italic font-serif">
                “Chúc bạn luôn tìm thấy niềm hứng khởi mỗi khi lật mở một trang sách mới.”
              </p>
              <div className="mt-3 font-playfair font-medium text-[#c2ba9b] text-sm tracking-wide">
                — Nhóm sáng lập Đọc & Trẻ
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: GIỚI THIỆU THÀNH VIÊN NHÓM (Video, Ảnh nhóm & 5 Thành viên)    */}
      {/* ========================================================================= */}
      <TeamMembersSection />

      {/* ========================================================================= */}
      {/* SECTION 4: 5 CHUYÊN ĐỀ TRỌNG TÂM (Aura Refined List & Typography)         */}
      {/* ========================================================================= */}
      <section className="relative py-24 sm:py-32 border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header: Clear, refined typography, and high contrast */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.25em] text-[#c2ba9b] bg-white/5 border border-white/10 backdrop-blur-md mb-4 shadow-sm">
              <Layers size={13} className="text-[#c2ba9b]" />
              <span className="font-sans">HỆ THỐNG NỘI DUNG TOÀN DIỆN</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-5xl font-medium tracking-tight text-[#fdfbf6] mb-4">
              5 Chuyên Đề Trọng Tâm Của Dự Án
            </h2>
            <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-2xl mx-auto font-sans">
              Hệ thống 5 trụ cột nội dung được nghiên cứu và cấu trúc bài bản nhằm mang đến bức tranh chân thực, sắc nét và truyền cảm hứng nhất về văn hóa đọc thế hệ trẻ.
            </p>
            <div className="w-20 h-[2px] bg-[#c2ba9b] mx-auto mt-6 shadow-[0_0_10px_rgba(194,186,155,0.4)]" />
          </div>

          {/* List of 5 Distinct Organizational Themes: Refined Cards with Distinctive Numbers & Details */}
          <div className="space-y-6">
            {THEME_TOPICS.map((topic, index) => {
              const IconComponent = topic.icon;

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ 
                    y: -4, 
                    borderColor: 'rgba(194, 186, 155, 0.45)',
                    boxShadow: '0 24px 50px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(194, 186, 155, 0.12)' 
                  }}
                  className="bg-black/50 backdrop-blur-2xl p-6 sm:p-8 md:p-9 rounded-3xl border border-white/20 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Subtle Accent Glow on Hover */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#c2ba9b]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#c2ba9b]/10 transition-colors" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Left: Number, Icon & Category Kicker */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-[#c2ba9b] group-hover:bg-[#c2ba9b] group-hover:text-black transition-all duration-300 shrink-0 shadow-sm">
                          <IconComponent size={22} strokeWidth={2} />
                        </div>
                        <span className="text-3xl sm:text-4xl font-serif font-light text-[#c2ba9b] tracking-tight">
                          {topic.number}
                        </span>
                      </div>

                      <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c2ba9b] font-sans">
                        {topic.categoryTag}
                      </div>

                      <h3 className="font-playfair text-xl sm:text-2xl font-medium text-[#fdfbf6] leading-snug group-hover:text-[#c2ba9b] transition-colors">
                        {topic.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#c2ba9b]/90 font-medium italic font-serif">
                        {topic.tagline}
                      </p>
                    </div>

                    {/* Center: Sharp Description & Bullet Highlights */}
                    <div className="lg:col-span-5 space-y-4">
                      <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {topic.highlights.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-white/90 bg-white/5 border border-white/10"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c2ba9b]" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Key Metric & Direct Navigation Button */}
                    <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col justify-between items-start lg:items-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block font-sans">
                          Chỉ số tiêu biểu
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white/95 mt-0.5 block">
                          {topic.keyMetric}
                        </span>
                      </div>

                      {topic.pageId !== 'about' ? (
                        <button
                          onClick={() => onNavigate(topic.pageId)}
                          className="px-6 py-2.5 bg-white/5 hover:bg-[#c2ba9b] text-white hover:text-black border border-white/20 hover:border-[#c2ba9b] text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all flex items-center gap-2 cursor-pointer group/btn shadow-sm"
                        >
                          <span>Xem chuyên đề</span>
                          <ArrowUpRight size={14} className="transition-transform group-hover/btn:rotate-45" />
                        </button>
                      ) : (
                        <span className="px-5 py-2 bg-[#c2ba9b]/15 text-[#c2ba9b] border border-[#c2ba9b]/30 rounded-full text-xs font-semibold tracking-wider uppercase font-sans">
                          Đang hiển thị
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM AURA CTA BANNER                                                    */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-black/90 via-black/75 to-black/90 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border border-[#c2ba9b]/35 text-center max-w-3xl mx-auto shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c2ba9b] bg-white/5 border border-white/10 mb-4">
              <span>ĐỒNG HÀNH & KẾT NỐI</span>
            </div>

            <h4 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-medium text-[#fdfbf6] mb-3 leading-snug">
              Cùng chúng mình lan tỏa tình yêu sách
            </h4>

            <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed mb-8 max-w-xl mx-auto">
              Bạn có bài viết cảm nhận, đề xuất tựa sách hay ý tưởng hợp tác lan tỏa văn hóa đọc? Hãy kết nối với nhóm sáng lập Đọc & Trẻ ngay hôm nay.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:docvatre@example.com"
                className="px-8 py-3.5 bg-[#c2ba9b] hover:bg-[#d4ccad] active:scale-95 text-black text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all inline-flex items-center gap-2 shadow-[0_0_35px_rgba(194,186,155,0.3)]"
              >
                <Mail size={15} />
                <span>Gửi thư kết nối</span>
              </a>

              <button
                onClick={() => onNavigate('library')}
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-[0.15em] rounded-full border border-white/25 hover:border-white/50 transition-all cursor-pointer"
              >
                Ghé thăm Thư viện
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </SellixCosmicBackground>
  );
}

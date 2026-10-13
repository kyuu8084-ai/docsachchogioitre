import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Shield, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  Heart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  badge: string;
  image: string;
  bio: string;
  favoriteBookOrQuote: string;
  skills: string[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ngoc-qui',
    name: 'Nguyễn Ngọc Quí',
    role: 'Project Director & Operations Lead (Giám Đốc Dự Án & Quản Lý Vận Hành)',
    badge: 'Giám Đốc Dự Án',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791876563/Nguy%E1%BB%85n_Ng%E1%BB%8Dc_Qu%C3%AD_rpjggf.jpg',
    bio: 'Chủ trì quản trị toàn diện tiến độ (deadline), phân công nhiệm vụ chuyên trách các bộ phận, điều hành các phiên họp nhóm chiến lược, kiểm duyệt chất lượng bản cuối và quản lý quy trình nộp ấn phẩm hoàn thiện.',
    favoriteBookOrQuote: '“Kỷ luật tiến độ và tầm nhìn chiến lược là chìa khóa đưa mọi dự án lớn về đích xuất sắc.”',
    skills: ['Quản lý dự án (PM)', 'Điều phối tiến độ & Deadline', 'Quản trị nhân lực', 'Kiểm duyệt chất lượng cuối']
  },
  {
    id: 'minh-thien',
    name: 'Nguyễn Minh Thiện',
    role: 'Chief Technical Officer & Web Experience Architect (Giám Đốc Kỹ Thuật & Kiến Trúc Nền Tảng Web)',
    badge: 'Kiến Trúc Web & Kỹ Thuật',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791815225/nguy%E1%BB%85n_minh_thi%E1%BB%87n_osw7lq.jpg',
    bio: 'Chịu trách nhiệm toàn quyền phát triển hệ thống website Đọc & Trẻ, kiến tạo trải nghiệm người dùng tương tác cao, thiết kế cấu trúc dữ liệu và tổ chức hệ sinh thái nội dung số hoá đa nền tảng.',
    favoriteBookOrQuote: '“Từng dòng mã lệnh cũng như từng trang sách: cần sự chính xác, mạch lạc và lắng đọng cái tâm.”',
    skills: ['Phát triển Web Frontend/Fullstack', 'Kiến trúc trải nghiệm UI/UX', 'Thiết kế nội dung số', 'Tối ưu hiệu năng']
  },
  {
    id: 'hai-nam',
    name: 'Nguyễn Hải Nam',
    role: 'Head of Creative Media & Cinematography (Trưởng Ban Sáng Tạo Truyền Thông & Đạo Diễn Hình Ảnh)',
    badge: 'Đạo Diễn Hình Ảnh',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791814504/Nguy%E1%BB%85n_H%E1%BA%A3i_Nam_hqczou.jpg',
    bio: 'Chỉ đạo nghệ thuật nghe nhìn, phụ trách ghi hình và quay phim tư liệu thực tế, xây dựng kịch bản phỏng vấn chuyên sâu với bạn đọc trẻ và định hình bố cục mỹ thuật cho toàn bộ chuỗi video dự án.',
    favoriteBookOrQuote: '“Ống kính máy quay nắm bắt ánh nhìn thực tại, còn trang sách mở ra chân trời vô tận của tâm hồn.”',
    skills: ['Đạo diễn hình ảnh', 'Kịch bản phỏng vấn', 'Quay phim tư liệu', 'Bố cục mỹ thuật điện ảnh']
  },
  {
    id: 'hoang-phuc',
    name: 'Đặng Hoàng Phúc',
    role: 'Senior Post-Production Specialist & Audio-Visual Editor (Trưởng Ban Hậu Kỳ & Kỹ Thuật Dựng Video Chuyên Nghiệp)',
    badge: 'Chuyên Viên Hậu Kỳ',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791814503/%C4%90%E1%BA%B7ng_Ho%C3%A0ng_Ph%C3%BAc_qo3ahw.jpg',
    bio: 'Quản lý quy trình hậu kỳ toàn diện: biên tập cắt ghép nhịp điệu video, tạo phụ đề động chuẩn xác, phối trộn âm thanh & nhạc nền cảm xúc, thiết kế đồ họa tiêu đề và xuất bản file chất lượng cao.',
    favoriteBookOrQuote: '“Nghệ thuật hậu kỳ là biết gọt giũa từng giây khung hình để câu chuyện chạm đến trái tim người xem.”',
    skills: ['Dựng phim hậu kỳ', 'Xử lý âm thanh & Nhạc nền', 'Thiết kế phụ đề & Motion', 'Kỹ thuật xuất file chuẩn phát sóng']
  },
  {
    id: 'khanh-minh',
    name: 'Nguyễn Hoàng Khánh Minh',
    role: 'Head of User Research & Concept Strategist (Trưởng Ban Nghiên Cứu Người Dùng & Chiến Lược Ý Tưởng Phỏng Vấn)',
    badge: 'Nghiên Cứu Người Dùng',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791814503/Nguy%E1%BB%85n_Ho%C3%A0ng_Kh%C3%A1nh_Minh_z5htju.jpg',
    bio: 'Chủ trì khảo sát thói quen và tâm lý bạn đọc trẻ, phát triển các góc nhìn tiếp cận phỏng vấn độc đáo, tìm kiếm insight đắt giá để chuyển hóa thành các định hướng nội dung và truyền thông thực tế.',
    favoriteBookOrQuote: '“Lắng nghe độc giả chân thành là bước khởi đầu vững chắc nhất của mọi sáng tạo.”',
    skills: ['Nghiên cứu hành vi độc giả', 'Sáng tạo ý tưởng phỏng vấn', 'Khai thác Insight người dùng', 'Phân tích định tính']
  },
  {
    id: 'nha-yen',
    name: 'Nguyễn Nhã Yên',
    role: 'Community Outreach & Field Research Lead (Trưởng Ban Kết Nối Cộng Đồng & Tiếp Cận Độc Giả Thực Địa)',
    badge: 'Điều Phối Cộng Đồng',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791814504/Nguy%E1%BB%85n_Nh%C3%A3_Y%C3%AAn_sew2vb.jpg',
    bio: 'Điều phối mạng lưới kết nối độc giả trẻ, tìm kiếm và phân loại đa dạng đối tượng học sinh - sinh viên phỏng vấn sâu, trực tiếp thực hiện công tác tiếp cận thực địa và hỗ trợ khảo sát phỏng vấn.',
    favoriteBookOrQuote: '“Mỗi người bạn trẻ là một thế giới riêng biệt đang chờ được thấu hiểu qua từng trang sách.”',
    skills: ['Kết nối cộng đồng', 'Khai thác đối tượng phỏng vấn', 'Quan hệ công chúng (PR)', 'Thực địa xã hội học']
  },
  {
    id: 'the-hao',
    name: 'Nguyễn Thế Hào',
    role: 'Chief Content Strategist & Senior Report Specialist (Trưởng Ban Biên Tập Báo Cáo Chiến Lược & Tổng Hợp Nội Dung)',
    badge: 'Biên Tập Báo Cáo',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791876563/Nguy%E1%BB%85n_Th%E1%BA%BF_H%C3%A0o_zh4sy7.jpg',
    bio: 'Phụ trách cấu trúc hóa văn bản và biên soạn hồ sơ báo cáo khoa học tổng kết, chắt lọc dữ liệu thành các phân tích chuyên sâu và hoàn thiện toàn bộ hệ thống nội dung dự án.',
    favoriteBookOrQuote: '“Một bản báo cáo giá trị không chỉ có số liệu, mà phải mang hơi thở thời đại và giải pháp thiết thực.”',
    skills: ['Biên soạn báo cáo chuyên sâu', 'Chiến lược nội dung', 'Văn phong học thuật', 'Tổng hợp & phân tích luận điểm']
  },
  {
    id: 'bao-an',
    name: 'Dương Ngọc Bảo An',
    role: 'Head of Research Methodology & Data Intelligence (Trưởng Ban Phương Pháp Nghiên Cứu & Dữ Liệu Khảo Sát)',
    badge: 'Phương Pháp & Dữ Liệu',
    image: 'https://res.cloudinary.com/avv55uce/image/upload/v1791876564/D%C6%B0%C6%A1ng_Ng%E1%BB%8Dc_B%E1%BA%A3o_An_v0afdb.jpg',
    bio: 'Nghiên cứu tài liệu chủ đề văn hóa đọc số, trực tiếp soạn thảo bộ câu hỏi phỏng vấn và khảo sát định lượng, tìm kiếm nguồn số liệu uy tín và triển khai biểu mẫu phỏng vấn trực tuyến.',
    favoriteBookOrQuote: '“Phương pháp nghiên cứu chuẩn xác tạo nên nền móng vững chắc cho mọi tri thức.”',
    skills: ['Thiết kế bảng hỏi nghiên cứu', 'Khai phá dữ liệu & tài liệu', 'Phương pháp nghiên cứu định lượng', 'Thiết lập biểu mẫu khảo sát số']
  }
];

export const GROUP_PHOTO_URL = 'https://res.cloudinary.com/avv55uce/image/upload/v1791814912/%E1%BA%A3nh_nh%C3%B3m_x9gnve.jpg';
export const GROUP_VIDEO_URL = 'https://res.cloudinary.com/avv55uce/video/upload/v1791796277/Nh%C3%B3m_an_to%C3%A0n_th%C3%B4ng_tin_ohdbj7.mp4';

export default function TeamMembersSection() {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const filteredMembers = activeTab === 'all' 
    ? TEAM_MEMBERS 
    : TEAM_MEMBERS.filter(m => m.id === activeTab);

  return (
    <section id="team-section" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-transparent text-[#fdfbf6]">
      {/* Subtle purple-cosmic ambient glow effects complementing Sellix background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* 1. SECTION HEADER                                                        */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.25em] uppercase text-[#c2ba9b] bg-black/60 border border-[#c2ba9b]/40 backdrop-blur-md mb-5 shadow-sm"
          >
            <Shield size={13} className="text-[#c2ba9b]" />
            <span>NHÓM AN TOÀN THÔNG TIN · DỰ ÁN ĐỌC & TRẺ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-5xl font-medium tracking-tight text-[#fdfbf6] leading-tight mb-5"
          >
            Giới Thiệu Thành Viên Nhóm
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-white/85 font-light leading-relaxed font-sans max-w-2xl mx-auto"
          >
            Đội ngũ sinh viên nhiệt huyết thuộc chuyên ngành <strong>An Toàn Thông Tin</strong> — những người cùng chung niềm đam mê công nghệ và mong muốn lan tỏa văn hóa đọc sâu đến cộng đồng người trẻ Việt Nam.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-20 h-[2px] bg-[#c2ba9b] mx-auto mt-6 shadow-[0_0_12px_rgba(194,186,155,0.4)]"
          />
        </div>

        {/* ========================================================================= */}
        {/* 2. VIDEO NHÓM ĐẶT Ở ĐẦU (Group Video at the Top as requested)             */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-black/60 border border-[#c2ba9b]/30 shadow-2xl p-4 sm:p-7 md:p-8 backdrop-blur-2xl"
        >
          {/* Header of Video Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c2ba9b]/15 border border-[#c2ba9b]/35 flex items-center justify-center text-[#c2ba9b] shadow-inner">
                <Play size={18} className="fill-[#c2ba9b]/30" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2ba9b] font-mono">
                    VIDEO CHÍNH THỨC
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="font-playfair text-lg sm:text-xl font-medium text-[#fdfbf6]">
                  Video Giới Thiệu Nhóm An Toàn Thông Tin
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                Full HD · Âm thanh sống động
              </span>
            </div>
          </div>

          {/* Video Player Frame */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90 border border-white/15 shadow-inner group">
            <video
              ref={videoRef}
              src={GROUP_VIDEO_URL}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              className="w-full h-full object-cover sm:object-contain bg-black"
            />
          </div>

          {/* Video Footer Caption */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-white/80 font-light">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#c2ba9b] shrink-0" />
              <span>Ghi lại quá trình cộng tác, làm việc nhóm và những kỷ niệm đáng nhớ của các thành viên.</span>
            </div>
            <div className="text-[11px] font-mono text-[#c2ba9b] shrink-0">
              Nhóm An toàn thông tin · 2026
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3. ẢNH NHÓM ĐẦU TIÊN (Group Photo Showcase as requested)                  */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-black/50 border border-white/20 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl group hover:border-[#c2ba9b]/40 transition-all duration-300"
        >
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Ảnh tập thể với hiệu ứng khung tranh & zoom modal */}
            <div className="w-full lg:col-span-7">
              <div 
                onClick={() => setSelectedPhoto({ 
                  url: GROUP_PHOTO_URL, 
                  title: 'Ảnh Tập Thể Nhóm An Toàn Thông Tin', 
                  subtitle: 'Đội ngũ 8 thành viên thực hiện dự án Đọc & Trẻ' 
                })}
                className="relative rounded-2xl overflow-hidden border border-white/20 shadow-xl cursor-pointer group/img aspect-[16/10] bg-black/40"
              >
                <img 
                  src={GROUP_PHOTO_URL} 
                  alt="Ảnh tập thể nhóm An Toàn Thông Tin" 
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover/img:opacity-40 transition-opacity" />
                
                {/* Overlay hover prompt */}
                <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs text-white/90 flex items-center gap-1.5 transition-transform group-hover/img:scale-105">
                  <Maximize2 size={13} className="text-[#c2ba9b]" />
                  <span>Phóng to ảnh</span>
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#c2ba9b]/40 text-[11px] font-semibold text-[#c2ba9b] uppercase tracking-wider">
                  Ảnh Nhóm Tập Thể
                </div>
              </div>
            </div>

            {/* Thông tin & Tinh thần đồng đội */}
            <div className="w-full lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#c2ba9b] bg-[#c2ba9b]/10 border border-[#c2ba9b]/30">
                <Users size={14} />
                <span className="uppercase tracking-wider">Tập Thể Gắn Kết · 8 Thành Viên</span>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl font-medium text-[#fdfbf6] leading-snug">
                Sức Mạnh Của Sự Đồng Lòng & Chia Sẻ
              </h3>

              <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed">
                Từ những buổi thảo luận đầu tiên về mẫu khảo sát đến những đêm thức cùng nhau hoàn thiện giao diện, video và phân tích dữ liệu, 8 thành viên nhóm An Toàn Thông Tin luôn phối hợp chặt chẽ, phát huy tối đa thế mạnh chuyên môn của từng người để kiến tạo một sản phẩm trọn vẹn, chuyên nghiệp và giàu giá trị cho cộng đồng.
              </p>

              {/* Điểm nhấn dự án */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-[#c2ba9b] font-playfair">8 Bạn Trẻ</div>
                  <div className="text-[11px] text-white/70">Cùng chí hướng & đam mê</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-[#c2ba9b] font-playfair">100 Khảo Sát</div>
                  <div className="text-[11px] text-white/70">Phân tích chuyên sâu thực tế</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPhoto({ 
                  url: GROUP_PHOTO_URL, 
                  title: 'Ảnh Tập Thể Nhóm An Toàn Thông Tin', 
                  subtitle: '5 thành viên sáng lập và thực hiện dự án Đọc & Trẻ' 
                })}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-[#c2ba9b] text-white hover:text-black border border-white/20 hover:border-[#c2ba9b] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Maximize2 size={14} />
                <span>Xem ảnh tập thể kích thước gốc</span>
              </button>
            </div>

          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3. TIẾP THEO LÀ CÁC THÀNH VIÊN NHÓM (Individual Team Members)             */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c2ba9b] mb-2 font-mono">
                <Users size={14} />
                <span>TỪNG THÀNH VIÊN TRONG NHÓM</span>
              </div>
              <h3 className="font-playfair text-2xl sm:text-3xl font-medium text-[#fdfbf6]">
                Gương Mặt Các Thành Viên
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#c2ba9b] text-black font-semibold shadow-md'
                    : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                Tất cả (8)
              </button>
              {TEAM_MEMBERS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    activeTab === m.id
                      ? 'bg-[#c2ba9b] text-black font-semibold shadow-md'
                      : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {m.name.split(' ').slice(-2).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Grid các thành viên */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl bg-black/55 backdrop-blur-xl border border-white/15 hover:border-[#c2ba9b]/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#c2ba9b]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#c2ba9b]/15 transition-colors" />

                <div className="space-y-5">
                  {/* Avatar Frame with Click to Lightbox */}
                  <div 
                    onClick={() => setSelectedPhoto({ 
                      url: member.image, 
                      title: member.name, 
                      subtitle: member.role 
                    })}
                    className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 group-hover:border-[#c2ba9b]/60 transition-colors cursor-pointer bg-black/60 shadow-lg"
                  >
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Member role badge floating */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#c2ba9b]/40 text-[10px] font-semibold text-[#c2ba9b] uppercase tracking-wider shadow">
                      {member.badge}
                    </div>

                    {/* Zoom button on hover */}
                    <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/75 backdrop-blur-md text-white/80 group-hover:text-[#c2ba9b] border border-white/20 transition-all opacity-80 group-hover:opacity-100">
                      <Maximize2 size={13} />
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div>
                    <h4 className="font-playfair text-2xl font-medium text-[#fdfbf6] group-hover:text-[#c2ba9b] transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-xs font-sans text-[#c2ba9b] font-medium mt-1 leading-snug">
                      {member.role}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-[13px] text-white/80 font-light leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Member quote */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 italic text-xs text-white/90 font-serif leading-relaxed">
                    {member.favoriteBookOrQuote}
                  </div>
                </div>

                {/* Skills tags & bottom details */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] text-white/75 bg-white/5 border border-white/10 font-sans"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. LIGHTBOX MODAL                                                        */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-black/90 border border-[#c2ba9b]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/15 bg-black/60">
                  <div>
                    <h4 className="font-playfair text-lg sm:text-xl font-medium text-[#fdfbf6]">
                      {selectedPhoto.title}
                    </h4>
                    {selectedPhoto.subtitle && (
                      <p className="text-xs text-[#c2ba9b] font-sans mt-0.5">
                        {selectedPhoto.subtitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Đóng (Esc)"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Image */}
                <div className="relative max-h-[75vh] w-full flex items-center justify-center bg-black/95 p-2 sm:p-4 overflow-hidden">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                  />
                </div>

                {/* Modal Footer */}
                <div className="p-3.5 bg-black/80 border-t border-white/10 text-center text-xs text-white/60">
                  Bấm phím Esc hoặc bấm ra ngoài để đóng xem ảnh
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Lightbulb, 
  Sparkles, 
  Share2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Quote, 
  Compass, 
  BookOpen, 
  Layers, 
  LayoutGrid, 
  ListFilter, 
  ShieldCheck,
  TrendingUp,
  Brain,
  Briefcase,
  Users2,
  Globe2,
  GraduationCap,
  Eye,
  Flame
} from 'lucide-react';
import { SURVEY_INSIGHTS_NOTES, InsightSocialNote } from '../data/surveyInsightsData';
import { PageId } from '../types';

interface SurveyInsightsSectionProps {
  onNavigate?: (page: PageId) => void;
}

type FilterCategory = 'all' | 'mental-health' | 'career-anxiety' | 'critical-thinking' | 'community' | 'cultural-identity' | 'knowledge-equity';

// Framer Motion Variants for Staggered Entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.94,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.85
    }
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 24,
    transition: { duration: 0.22 }
  }
};

export default function SurveyInsightsSection({ onNavigate }: SurveyInsightsSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'journal'>('grid');

  const filteredNotes = SURVEY_INSIGHTS_NOTES.filter((note) => {
    if (selectedFilter === 'all') return true;
    return note.socialIssueCategory === selectedFilter;
  });

  const handleCopyNote = (note: InsightSocialNote) => {
    const textToCopy = `[GHI CHÚ KHẢO SÁT #${note.noteNumber}] ${note.title}\n` +
      `• Vấn đề xã hội: ${note.socialIssue}\n` +
      `• Dữ liệu khảo sát: ${note.surveyEvidence.statistic}\n` +
      `• Trích dẫn: ${note.takeaway.quote}\n` +
      `• Hành động gợi ý: ${note.takeaway.actionableAdvice}\n` +
      `— Nguồn: Dự án Đọc & Trẻ (Khảo sát 100 bạn đọc trẻ Việt Nam)`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(note.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mental-health':
        return Brain;
      case 'career-anxiety':
        return Briefcase;
      case 'critical-thinking':
        return TrendingUp;
      case 'community':
        return Users2;
      case 'cultural-identity':
        return Globe2;
      case 'knowledge-equity':
        return GraduationCap;
      default:
        return Sparkles;
    }
  };

  return (
    <section className="w-full my-12 sm:my-16 text-left" id="survey-insights">
      {/* KHUNG TIÊU ĐỀ SECTION: INSIGHTS CHUYÊN SÂU */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#FAF7F0] p-6 sm:p-10 rounded-3xl border-2 border-[#D6CDBF] shadow-xl relative overflow-hidden mb-8"
      >
        {/* Subtle vintage watermark / decorative texture */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#B56D4F]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#D6CDBF]">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/30 mb-3.5 font-sans"
            >
              <Lightbulb size={14} className="text-[#B56D4F] animate-pulse" />
              <span>GÓC NHÌN CHUYÊN SÂU · SURVEY DEEP INSIGHTS</span>
            </motion.div>

            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#3A3530] leading-tight">
              Mối Liên Hệ Giữa Thói Quen Đọc Sách & Các Vấn Đề Xã Hội Của Giới Trẻ
            </h2>

            <p className="font-lora text-sm sm:text-base text-[#6B635A] mt-3 leading-relaxed">
              Từ dữ liệu khảo sát 100 bạn trẻ, nhóm nghiên cứu đã tổng hợp <strong>6 thẻ ghi chú phân tích chuyên sâu</strong>. Những thẻ ghi chú này mổ xẻ sự tương tác hai chiều giữa hành vi đọc với các vấn đề xã hội nóng bỏng: từ hội chứng kiệt sức số, áp lực nghề nghiệp trước làn sóng AI, cho tới khủng hoảng tư duy phản biện và bình đẳng tiếp cận tri thức.
            </p>
          </div>

          {/* Toggle View Mode & Stats badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="bg-white/90 px-4 py-2.5 rounded-2xl border border-[#D6CDBF] text-xs font-lora shadow-2xs flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B56D4F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B56D4F]"></span>
              </span>
              <span className="text-[#6B635A]">Dữ liệu thực tế:</span>{' '}
              <strong className="text-[#3A3530] font-sans font-bold text-sm">06 Chủ đề xã hội</strong>
            </div>

            <div className="relative flex items-center bg-white/90 p-1 rounded-2xl border border-[#D6CDBF] shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
                  viewMode === 'grid' ? 'text-white' : 'text-[#6B635A] hover:text-[#3A3530]'
                }`}
                title="Xem dạng lưới thẻ ghi chú"
              >
                {viewMode === 'grid' && (
                  <motion.div
                    layoutId="activeViewModeBg"
                    className="absolute inset-0 bg-[#B56D4F] rounded-xl shadow-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <LayoutGrid size={13} />
                  <span>Thẻ ghi chú</span>
                </span>
              </button>

              <button
                onClick={() => setViewMode('journal')}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
                  viewMode === 'journal' ? 'text-white' : 'text-[#6B635A] hover:text-[#3A3530]'
                }`}
                title="Xem dạng sổ tay chi tiết"
              >
                {viewMode === 'journal' && (
                  <motion.div
                    layoutId="activeViewModeBg"
                    className="absolute inset-0 bg-[#B56D4F] rounded-xl shadow-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Layers size={13} />
                  <span>Sổ tay chi tiết</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* BỘ LỌC CHỦ ĐỀ XÃ HỘI (CATEGORY TABS VỚI SMOOTH MOTION PILL) */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-[#6B635A] font-semibold mr-2 font-sans">
            <ListFilter size={14} className="text-[#B56D4F]" />
            <span>Lọc theo vấn đề:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1">
            {[
              { id: 'all', label: 'Tất cả (6 thẻ)' },
              { id: 'mental-health', label: 'Sức khỏe tinh thần & FOMO' },
              { id: 'career-anxiety', label: 'Áp lực sự nghiệp & AI' },
              { id: 'critical-thinking', label: 'Ô nhiễm thông tin & Tư duy sâu' },
              { id: 'community', label: 'Kết nối cộng đồng' },
              { id: 'cultural-identity', label: 'Bản sắc & Trắc ẩn' },
              { id: 'knowledge-equity', label: 'Bình đẳng tri thức' },
            ].map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as FilterCategory)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-medium font-sans transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'bg-white hover:bg-[#EBE5D9] text-[#5C554E] border border-[#D6CDBF]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryFilterBg"
                      className="absolute inset-0 bg-[#3A3530] rounded-xl shadow-xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HINT CHÚ Ý TƯƠNG TÁC */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 pt-3 border-t border-[#D6CDBF]/50 flex items-center justify-between text-xs font-lora text-[#6B635A] flex-wrap gap-2"
        >
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-[#B56D4F]" />
            <span>Mẹo quan sát: Mỗi thẻ ghi chú đại diện cho 1 điểm chạm thực tế giữa giới trẻ và xã hội đương đại.</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-sans text-[#B56D4F] font-semibold">
            <Eye size={12} />
            <span>Hiệu ứng trực quan hóa tương tác đa chiều</span>
          </div>
        </motion.div>
      </motion.div>

      {/* DANH SÁCH THẺ GHI CHÚ (STAGGERED SMOOTH FRAMER MOTION CARDS) */}
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 lg:grid-cols-2 gap-8'
            : 'space-y-8 max-w-4xl mx-auto'
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note, index) => {
            const isExpanded = expandedNoteId === note.id;
            const isCopied = copiedId === note.id;
            const Icon = getCategoryIcon(note.socialIssueCategory);

            return (
              <motion.article
                layout
                key={note.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.025,
                  boxShadow: "0 30px 60px -12px rgba(45, 38, 30, 0.24), 0 18px 28px -8px rgba(181, 109, 79, 0.22), 0 0 0 2px rgba(181, 109, 79, 0.45)",
                  transition: { type: "spring", stiffness: 320, damping: 22, mass: 0.7 }
                }}
                whileTap={{ scale: 0.99, y: -4 }}
                className="bg-[#FAF7F0] rounded-3xl border-2 border-[#D6CDBF] shadow-xl relative z-0 hover:z-30 flex flex-col justify-between overflow-hidden group transition-[border-color,box-shadow] hover:border-[#B56D4F] cursor-default"
              >
                {/* HIỆU ỨNG VỆT SÁNG QUÉT QUA KHI XUẤT HIỆN (SHIMMER LIGHT SHEEN) */}
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  whileInView={{ x: '250%', opacity: 0.4 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1.3, 
                    delay: 0.18 + index * 0.08, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none -skew-x-20 z-10"
                />

                {/* VINTAGE WASHI TAPE ACCENT VỚI HIỆU ỨNG RƠI NHẸ ĐẬM CHẤT THỦ CÔNG */}
                <motion.div 
                  initial={{ y: -16, opacity: 0, rotate: index % 2 === 0 ? -3 : 3 }}
                  whileInView={{ y: 0, opacity: 0.9, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20, 
                    delay: 0.15 + index * 0.06 
                  }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-32 rounded-b-md shadow-xs z-20 pointer-events-none group-hover:scale-105 group-hover:brightness-105 transition-transform duration-300"
                  style={{ 
                    backgroundColor: note.colorTheme.tapeColor,
                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                  }}
                />

                {/* CARD TOP BAR & METADATA */}
                <div className="p-6 sm:p-7 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4 pt-1">
                    <div className="flex items-center gap-2">
                      {/* Spring-popping Note Number badge */}
                      <motion.span 
                        initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 18, 
                          delay: 0.12 + index * 0.06 
                        }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-sans font-bold text-xs text-white shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                        style={{ backgroundColor: note.colorTheme.accentColor }}
                      >
                        #{note.noteNumber}
                      </motion.span>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#B56D4F] block font-sans">
                          THẺ GHI CHÚ THỰC ĐỊA · FIELD NOTE
                        </span>
                        <span className="text-xs font-lora font-medium text-[#6B635A]">
                          {note.socialIssueBadge}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Nút Sao Chép Ghi Chú với hiệu ứng tương tác */}
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleCopyNote(note)}
                        className="p-2 rounded-xl bg-white hover:bg-[#EBE5D9] text-[#6B635A] hover:text-[#3A3530] border border-[#D6CDBF] transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-2xs"
                        title="Sao chép nội dung thẻ ghi chú"
                      >
                        {isCopied ? (
                          <motion.div 
                            initial={{ scale: 0.8 }} 
                            animate={{ scale: 1 }} 
                            className="flex items-center gap-1 text-[#059669]"
                          >
                            <Check size={14} className="text-[#059669]" />
                            <span className="text-[10px] font-bold">Đã chép!</span>
                          </motion.div>
                        ) : (
                          <>
                            <Share2 size={14} />
                            <span className="hidden sm:inline text-[10px] font-sans">Chia sẻ</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* TIÊU ĐỀ PHÂN TÍCH */}
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530] leading-snug group-hover:text-[#B56D4F] transition-colors mb-2">
                    {note.title}
                  </h3>
                  <p className="font-lora text-xs sm:text-sm text-[#6B635A] leading-relaxed mb-4">
                    {note.subtitle}
                  </p>

                  {/* KHUNG HÌNH ẢNH MINH HỌA (POLAROID FRAME VỚI SMOOTH HOVER ZOOM) */}
                  <div className="my-4 bg-white p-2.5 sm:p-3 rounded-2xl border border-[#D6CDBF] shadow-md group-hover:shadow-xl group-hover:border-[#B56D4F]/40 transition-all duration-300">
                    <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-[#EBE5D9]">
                      <motion.img
                        src={note.image.url}
                        alt={note.image.alt}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Badge tag góc ảnh */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 font-sans flex items-center gap-1 shadow-sm">
                          <Icon size={11} />
                          <span>{note.image.tag}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left pointer-events-none">
                        <p className="text-white text-xs font-lora font-medium drop-shadow-md line-clamp-1">
                          📷 {note.image.caption}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 px-1 text-[11px] text-[#6B635A] font-lora italic text-left">
                      Minh họa thực địa: {note.image.caption}
                    </p>
                  </div>

                  {/* BẢO CHỨNG DỮ LIỆU KHẢO SÁT (VỚI HIỆU ỨNG PULSE CHÚ Ý) */}
                  <motion.div 
                    whileInView={{ scale: [0.98, 1.01, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                    className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#D6CDBF] space-y-1 mb-4 group-hover:border-[#B56D4F]/40 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#B56D4F] font-sans">
                      <ShieldCheck size={14} className="text-[#B56D4F]" />
                      <span>Dữ liệu khảo sát bảo chứng: {note.surveyEvidence.questionRef}</span>
                    </div>
                    <div className="font-playfair text-sm sm:text-base font-bold text-[#3A3530]">
                      📊 {note.surveyEvidence.statistic}
                    </div>
                    <p className="text-xs font-lora text-[#6B635A] leading-relaxed">
                      {note.surveyEvidence.interpretation}
                    </p>
                  </motion.div>

                  {/* TÓM TẮT PHÂN TÍCH CHUYÊN SÂU */}
                  <div className="space-y-2.5 font-lora text-xs sm:text-sm text-[#4A433D] leading-relaxed">
                    <p>
                      <strong className="text-[#3A3530] font-sans uppercase text-[11px] tracking-wider block mb-0.5">
                        1. Bối cảnh xã hội thực tế:
                      </strong>
                      {note.analysis.problemContext}
                    </p>
                    
                    <p>
                      <strong className="text-[#3A3530] font-sans uppercase text-[11px] tracking-wider block mb-0.5">
                        2. Mối liên hệ với thói quen đọc:
                      </strong>
                      {note.analysis.readingCorrelation}
                    </p>
                  </div>

                  {/* PHẦN MỞ RỘNG (EXPANDABLE DETAILS VỚI SMOOTH HEIGHT & OPACITY ANIMATION) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ 
                          duration: 0.35, 
                          ease: [0.04, 0.62, 0.23, 0.98] 
                        }}
                        className="overflow-hidden pt-3 space-y-4"
                      >
                        {/* Chiều sâu xã hội học */}
                        <div className="p-3.5 rounded-2xl bg-white border border-[#D6CDBF] shadow-2xs">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A3530] block font-sans mb-1">
                            3. Chiều sâu xã hội học:
                          </span>
                          <p className="font-lora text-xs sm:text-sm text-[#5C554E] leading-relaxed">
                            {note.analysis.sociologicalDepth}
                          </p>
                        </div>

                        {/* Gợi ý sách liên quan */}
                        {note.suggestedBooks && note.suggestedBooks.length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D6CDBF] shadow-2xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B56D4F] block font-sans mb-2 flex items-center gap-1.5">
                              <BookOpen size={13} />
                              <span>Tác phẩm gợi ý đọc đối thoại:</span>
                            </span>
                            <div className="space-y-2">
                              {note.suggestedBooks.map((b, i) => (
                                <div key={i} className="text-xs font-lora">
                                  <strong className="text-[#3A3530] font-playfair">{b.title}</strong>{' '}
                                  <span className="text-[#6B635A]">({b.author}):</span>{' '}
                                  <span className="text-[#5C554E]">{b.whyRelevant}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CARD FOOTER: POST-IT GHI CHÚ HÀNH ĐỘNG & NÚT TƯƠNG TÁC */}
                <div className="p-6 sm:p-7 pt-0 border-t border-[#D6CDBF]/60 mt-4">
                  {/* Khung ghi chú kiểu Post-it vàng ấm với micro-tilt */}
                  <motion.div 
                    whileHover={{ scale: 1.01, rotate: index % 2 === 0 ? 0.3 : -0.3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="my-4 p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] shadow-xs relative"
                  >
                    <div className="flex items-start gap-2.5">
                      <Quote size={18} className="text-[#D97706] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-lora text-xs sm:text-sm italic text-[#78350F] font-medium leading-relaxed">
                          {note.takeaway.quote}
                        </p>
                        {note.takeaway.quoteAuthor && (
                          <span className="text-[10px] uppercase font-sans tracking-wider text-[#B45309] block mt-1 font-bold">
                            — {note.takeaway.quoteAuthor}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#FDE68A] text-xs font-lora text-[#92400E] flex items-start gap-1.5">
                      <strong className="shrink-0 font-sans uppercase text-[10px] tracking-wider text-[#B45309]">
                        Hành động:
                      </strong>
                      <span>{note.takeaway.actionableAdvice}</span>
                    </div>
                  </motion.div>

                  {/* Hàng nút tương tác chân thẻ */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleExpand(note.id)}
                      className="text-xs font-sans font-semibold text-[#B56D4F] hover:text-[#9A5A3F] flex items-center gap-1 transition-colors cursor-pointer py-1"
                    >
                      <span>{isExpanded ? 'Thu gọn phân tích' : 'Đọc thêm chi tiết'}</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="inline-flex items-center"
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </motion.button>

                    {note.relatedPage && onNavigate && (
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ scale: 1.04, x: 2 }}
                        onClick={() => onNavigate(note.relatedPage!)}
                        className="px-3 py-1.5 rounded-xl bg-[#B56D4F]/10 hover:bg-[#B56D4F]/20 text-[#B56D4F] text-xs font-bold font-sans transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{note.relatedPageLabel || 'Xem giải pháp'}</span>
                        <ArrowRight size={12} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* TỔNG KẾT ĐÚC KẾT: SỨ MỆNH XÃ HỘI CỦA ĐỌC SÁCH */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          scale: 1.015,
          y: -4,
          boxShadow: "0 30px 60px -12px rgba(45, 38, 30, 0.22), 0 16px 28px -6px rgba(181, 109, 79, 0.2)"
        }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 p-6 sm:p-10 rounded-3xl bg-[#FAF7F0] border-2 border-[#B56D4F] shadow-2xl relative overflow-hidden transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B56D4F] block font-sans mb-1">
              Thông điệp bế mạc phân tích
            </span>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
              Đọc Sách Không Phải Trốn Chạy Xã Hội — Đọc Sách Để Thấu Hiểu & Thay Đổi Nó
            </h3>
            <p className="font-lora text-sm text-[#5C554E] mt-2 leading-relaxed">
              Những phát hiện trên khẳng định: văn hóa đọc của người trẻ Việt không hề mai một. Khi được tháo gỡ rào cản thời gian, chi phí và cung cấp đúng cuốn sách chạm tới những trăn trở của thời đại, trang sách sẽ trở thành bệ phóng tư duy mạnh mẽ nhất để thế hệ trẻ tự tin định hình tương lai.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {onNavigate && (
              <>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('reading-habits')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Compass size={14} />
                  <span>Xem chuyên đề 01</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('library')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#3A3530] border border-[#D6CDBF] text-xs uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <BookOpen size={14} />
                  <span>Vào thư viện miễn phí</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BarChart3, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';

export interface SurveyDeductionBannerProps {
  topicNumber?: string;
  surveyQuestionSource?: string;
  surveyMetricHighlight?: string;
  surveyQuote: string;
  deducedComponentTitle: string;
  deducedComponentDescription: string;
  solutionTags?: string[];
  variant?: 'light' | 'dark' | 'glass';
  className?: string;
}

export default function SurveyDeductionBanner({
  topicNumber = 'KHỞI NGUỒN THỰC TẾ',
  surveyQuestionSource = 'Dữ liệu khảo sát 100 bạn trẻ',
  surveyMetricHighlight,
  surveyQuote,
  deducedComponentTitle,
  deducedComponentDescription,
  solutionTags = [],
  variant = 'light',
  className = '',
}: SurveyDeductionBannerProps) {
  const isDark = variant === 'dark';
  const isGlass = variant === 'glass';

  // Styling presets
  const containerClasses = isDark
    ? 'bg-[#181614]/90 border border-white/15 text-[#F5F1E8] shadow-2xl backdrop-blur-md'
    : isGlass
    ? 'bg-black/50 border border-white/20 text-[#FAF7F0] shadow-2xl backdrop-blur-md'
    : 'vintage-card-bg bg-[#FAF7F0]/95 border-2 border-[#D6CDBF] text-[#3A3530] shadow-lg';

  const badgeClasses = isDark || isGlass
    ? 'bg-[#B56D4F]/25 text-[#E8A588] border border-[#B56D4F]/40'
    : 'bg-[#B56D4F]/10 text-[#B56D4F] border border-[#B56D4F]/25';

  const surveyBoxClasses = isDark || isGlass
    ? 'bg-white/5 border border-white/10 text-white/90'
    : 'bg-white/80 border border-[#D6CDBF]/80 text-[#3A3530]';

  const solutionBoxClasses = isDark || isGlass
    ? 'bg-[#B56D4F]/15 border border-[#B56D4F]/30 text-white'
    : 'bg-[#B56D4F]/5 border border-[#B56D4F]/20 text-[#3A3530]';

  const tagClasses = isDark || isGlass
    ? 'bg-white/10 text-white/90 border border-white/15'
    : 'bg-white text-[#6B635A] border border-[#D6CDBF]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`w-full max-w-5xl mx-auto rounded-3xl p-5 sm:p-7 md:p-8 my-6 sm:my-8 text-left ${containerClasses} ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-current/10">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-sans ${badgeClasses}`}>
            <BarChart3 size={13} className="shrink-0" />
            <span>{topicNumber}</span>
          </span>
          <span className="text-xs font-lora italic opacity-75 hidden sm:inline">
            · {surveyQuestionSource}
          </span>
        </div>

        {surveyMetricHighlight && (
          <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#B56D4F] bg-[#B56D4F]/10 px-3 py-1 rounded-full border border-[#B56D4F]/20">
            <Sparkles size={12} />
            <span>{surveyMetricHighlight}</span>
          </div>
        )}
      </div>

      {/* Main Deduction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Survey Findings / Voice of Youth */}
        <div className={`lg:col-span-6 rounded-2xl p-4 sm:p-5 flex flex-col justify-between ${surveyBoxClasses}`}>
          <div>
            <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#B56D4F] font-sans">
              <span className="w-5 h-5 rounded-full bg-[#B56D4F] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Kết quả khảo sát chỉ ra</span>
            </div>
            <p className="font-lora text-sm sm:text-base leading-relaxed italic">
              "{surveyQuote}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-current/10 flex items-center gap-2 text-xs opacity-75 font-sans">
            <Compass size={13} className="text-[#B56D4F] shrink-0" />
            <span>Phát hiện từ 100 mẫu phiếu khảo sát thực tế</span>
          </div>
        </div>

        {/* Center Arrow Connector for large screens */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#B56D4F] text-white flex items-center justify-center shadow-md shrink-0">
            <ArrowRight size={18} />
          </div>
        </div>

        {/* Right: Deduced Web Component & Solution */}
        <div className={`lg:col-span-5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between ${solutionBoxClasses}`}>
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#B56D4F] font-sans">
              <Lightbulb size={14} className="shrink-0" />
              <span>Suy ra thành phần website</span>
            </div>
            <h3 className="font-playfair text-base sm:text-lg font-bold mb-2 leading-snug">
              {deducedComponentTitle}
            </h3>
            <p className="font-lora text-xs sm:text-sm leading-relaxed opacity-90">
              {deducedComponentDescription}
            </p>
          </div>

          {solutionTags.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-current/10 flex flex-wrap gap-1.5">
              {solutionTags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 text-[11px] font-sans font-medium px-2 py-0.5 rounded-md ${tagClasses}`}
                >
                  <CheckCircle2 size={11} className="text-[#B56D4F]" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Compass, 
  Smartphone, 
  TrendingUp, 
  Layers,
  Flame,
  Search,
  Filter,
  ExternalLink,
  ClipboardList,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Target,
  Newspaper
} from 'lucide-react';
import { SURVEY_RESULTS_100, SurveyQuestionItem } from '../data/surveyResults100';
import D3SurveyChart from './D3SurveyChart';
import D3SurveyComparisonChart from './D3SurveyComparisonChart';

type CategoryFilter = 'all' | 'habits' | 'preferences' | 'barriers';

export default function SurveyAnalysisDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = SURVEY_RESULTS_100.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'habits' && (item.category === 'habits' || item.category === 'demographics')) ||
      (selectedCategory === 'preferences' && item.category === 'preferences') ||
      (selectedCategory === 'barriers' && item.category === 'barriers');

    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commentary.analysis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.options.some((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full mt-12 sm:mt-16 text-left">
      {/* HEADER SECTION CỦA BẢNG PHÂN TÍCH */}
      <div className="bg-[#FAF7F0] p-6 sm:p-10 rounded-3xl border-2 border-[#D6CDBF] shadow-xl mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D6CDBF]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/30 mb-3">
              <BarChart3 size={14} />
              <span>DỮ LIỆU THỰC TẾ · 100 PHIẾU KHẢO SÁT BẠN ĐỌC</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#3A3530]">
              Bảng Phân Tích Kết Quả Khảo Sát
            </h2>
            <p className="font-lora text-sm sm:text-base text-[#6B635A] mt-2 max-w-2xl">
              Tổng hợp trực quan 11 câu hỏi khảo sát thực tế về hành vi, rào cản và gu đọc sách của người trẻ Việt, đi kèm các nhận xét chuyên sâu được suy ra từ số liệu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto shrink-0">
            <div className="flex items-center gap-4 bg-white/80 p-3.5 sm:p-4 rounded-2xl border border-[#D6CDBF] shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#6B635A] font-bold block">
                  Tổng mẫu khảo sát
                </span>
                <span className="font-playfair text-2xl font-black text-[#3A3530]">
                  100 <span className="text-sm font-lora font-normal text-[#6B635A]">phiếu</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="#survey-insights"
                className="px-4 py-3 bg-[#FAF7F0] hover:bg-white text-[#B56D4F] border border-[#B56D4F]/40 rounded-2xl font-sans text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center"
                title="Xem thẻ ghi chú phân tích chuyên sâu các vấn đề xã hội"
              >
                <Lightbulb size={16} className="text-[#B56D4F]" />
                <span>Xem Insights Xã Hội</span>
              </a>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd8cuYvyqvNlRHCEBMAgt7qxz60k9IDRrBGz9VO_V9kUXkOpg/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white rounded-2xl font-sans text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center"
                title="Mở biểu mẫu câu hỏi khảo sát gốc"
              >
                <ClipboardList size={16} />
                <span>Link chứa câu hỏi</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* 4 THỐNG KÊ NỔI BẬT NHẤT (HIGHLIGHT STATS) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-white rounded-2xl border border-[#D6CDBF] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#B56D4F] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Độ tuổi chủ đạo</span>
              <Users size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-playfair text-[#3A3530]">82%</div>
            <div className="text-xs text-[#6B635A] font-lora mt-1">Thuộc nhóm 18–23 tuổi (Gen Z trẻ)</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#D6CDBF] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#2563EB] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Thời gian đọc</span>
              <Clock size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-playfair text-[#3A3530]">15–30'</div>
            <div className="text-xs text-[#6B635A] font-lora mt-1">43% chọn khung giờ đọc tập trung này</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#D6CDBF] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#DC2626] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Rào cản số 1</span>
              <Smartphone size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-playfair text-[#3A3530]">66%</div>
            <div className="text-xs text-[#6B635A] font-lora mt-1">Bị phân tâm bởi điện thoại & video ngắn</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#D6CDBF] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#059669] mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Kỳ vọng lớn nhất</span>
              <Sparkles size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-playfair text-[#3A3530]">70%</div>
            <div className="text-xs text-[#6B635A] font-lora mt-1">Sẽ đọc nhiều hơn nếu có gợi ý đúng gu</div>
          </div>
        </div>

        {/* TÀI LIỆU BÁO CHÍ THAM KHẢO VỀ VĂN HÓA ĐỌC & SÁCH SỐ */}
        <div className="mt-6 pt-5 border-t border-[#D6CDBF]/70">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={16} className="text-[#B56D4F]" />
            <h4 className="font-playfair text-sm sm:text-base font-bold text-[#3A3530]">
              Tài Liệu Báo Chí Tham Khảo: Văn Hóa Đọc Trong Kỷ Nguyên Số
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <a
              href="https://viettimes.vn/thi-truong-sach-so-tang-nhanh-nho-gioi-tre-doanh-thu-ebook-chiem-ty-le-bao-nhieu-post186839.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-white/90 border border-[#D6CDBF] hover:border-[#B56D4F] transition-all group flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#5B50E5]/10 text-[#5B50E5] font-sans">
                    VietTimes · Số liệu thị trường
                  </span>
                  <ExternalLink size={13} className="text-[#6B635A] group-hover:text-[#B56D4F] transition-colors" />
                </div>
                <h5 className="font-playfair text-xs sm:text-sm font-bold text-[#3A3530] group-hover:text-[#B56D4F] transition-colors leading-snug line-clamp-2">
                  Thị trường sách số tăng nhanh nhờ giới trẻ - Doanh thu ebook chiếm tỷ lệ bao nhiêu?
                </h5>
                <p className="font-lora text-[11px] text-[#6B635A] mt-1 line-clamp-2 leading-relaxed">
                  Phân tích sự bùng nổ của ebook, sách nói và xu hướng đọc số hóa của giới trẻ Việt Nam.
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#D6CDBF]/50 flex items-center justify-between text-[11px] font-sans text-[#B56D4F] font-bold group-hover:underline">
                <span>Xem trên VietTimes</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <a
              href="https://www.qdnd.vn/van-hoa/doi-song/van-hoa-doc-trong-ky-nguyen-so-837751"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-white/90 border border-[#D6CDBF] hover:border-[#B56D4F] transition-all group flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B56D4F]/10 text-[#B56D4F] font-sans">
                    Báo Quân Đội Nhân Dân · Văn hóa đời sống
                  </span>
                  <ExternalLink size={13} className="text-[#6B635A] group-hover:text-[#B56D4F] transition-colors" />
                </div>
                <h5 className="font-playfair text-xs sm:text-sm font-bold text-[#3A3530] group-hover:text-[#B56D4F] transition-colors leading-snug">
                  Văn hóa đọc trong kỷ nguyên số
                </h5>
                <p className="font-lora text-[11px] text-[#6B635A] mt-1 line-clamp-2 leading-relaxed italic">
                  “Giữa kỷ nguyên số, khi mạng xã hội và phương tiện nghe nhìn bùng nổ, việc nuôi dưỡng tình yêu với sách là thách thức nhưng cũng mở ra cơ hội lớn...”
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#D6CDBF]/50 flex items-center justify-between text-[11px] font-sans text-[#B56D4F] font-bold group-hover:underline">
                <span>Xem trên Báo QĐND</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </div>

        {/* BỘ LỌC CHUYÊN ĐỀ & Ô TÌM KIẾM */}
        <div className="mt-8 pt-6 border-t border-[#D6CDBF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'Tất cả (11 câu)', icon: BarChart3 },
              { id: 'habits', label: 'Thói quen & Tần suất', icon: Clock },
              { id: 'preferences', label: 'Gu sách & Nguồn sách', icon: BookOpen },
              { id: 'barriers', label: 'Rào cản & Mạng xã hội', icon: Smartphone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#B56D4F] text-white shadow-xs'
                      : 'bg-white hover:bg-[#EBE5D9] text-[#3A3530] border border-[#D6CDBF]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B635A]" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#D6CDBF] text-xs font-lora text-[#3A3530] placeholder:text-[#6B635A]/70 focus:outline-hidden focus:border-[#B56D4F]"
            />
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ SO SÁNH TỔNG HỢP D3.JS (MACRO COMPARISON CHART) */}
      <D3SurveyComparisonChart />

      {/* DANH SÁCH 11 CÂU HỎI KÈM BIỂU ĐỒ TƯƠNG TÁC D3.JS & NHẬN XÉT */}
      <div className="space-y-10">
        {filteredQuestions.map((q) => (
          <QuestionCard key={q.id} item={q} />
        ))}

        {filteredQuestions.length === 0 && (
          <div className="p-12 text-center bg-[#FAF7F0] rounded-3xl border border-[#D6CDBF]">
            <p className="font-lora text-[#6B635A] text-sm">
              Không tìm thấy câu hỏi nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>

      {/* BANNER GỌI MỞ ĐẾN THÀNH PHẦN INSIGHTS CHUYÊN SÂU */}
      <motion.div 
        whileHover={{ 
          scale: 1.015, 
          y: -4, 
          boxShadow: "0 25px 45px -8px rgba(0, 0, 0, 0.12), 0 12px 20px -6px rgba(181, 109, 79, 0.15)" 
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#D6CDBF] hover:border-[#B56D4F] shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B56D4F] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B56D4F] block font-sans">
              TIẾP TỤC KHÁM PHÁ
            </span>
            <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
              6 Thẻ Ghi Chú 'Insights' Phân Tích Vấn Đề Xã Hội Của Giới Trẻ
            </h4>
            <p className="font-lora text-xs sm:text-sm text-[#6B635A] mt-0.5">
              Mối liên hệ giữa thói quen đọc với kiệt sức số, áp lực sự nghiệp, khủng hoảng tư duy phản biện và bình đẳng tri thức.
            </p>
          </div>
        </div>

        <a
          href="#survey-insights"
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Xem 6 thẻ Insights</span>
          <ArrowRight size={14} />
        </a>
      </motion.div>
    </div>
  );
}

// Sub-component hiển thị từng thẻ câu hỏi với Biểu đồ tương tác D3.js
function QuestionCard({ item }: { item: SurveyQuestionItem }) {
  return (
    <motion.div
      id={item.id}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="bg-[#FAF7F0] rounded-3xl border-2 border-[#D6CDBF] shadow-lg overflow-hidden scroll-mt-24"
    >
      {/* Header câu hỏi */}
      <div className="p-5 sm:p-6 bg-white/70 border-b border-[#D6CDBF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center text-xs font-bold font-sans shrink-0">
            {item.number < 10 ? `0${item.number}` : item.number}
          </span>
          <div>
            <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530] leading-snug">
              {item.question}
            </h3>
            <span className="text-[11px] text-[#6B635A] font-lora">
              {item.totalResponses} câu trả lời · Chuyên đề {item.categoryLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-md bg-[#FAF7F0] border border-[#D6CDBF] text-[10px] font-bold uppercase tracking-wider text-[#6B635A] font-sans">
            {item.type === 'pie' ? 'Biểu đồ D3 (Chọn 1)' : 'Biểu đồ D3 (Đa lựa chọn)'}
          </span>
        </div>
      </div>

      {/* VÙNG HIỂN THỊ BIỂU ĐỒ TƯƠNG TÁC D3.JS (DI CHUỘT VÀO CỘT ĐỂ XEM THÔNG SỐ) */}
      <div className="p-5 sm:p-8 border-b border-[#D6CDBF] bg-[#FAF7F0]/40">
        <D3SurveyChart
          options={item.options}
          total={item.totalResponses}
          initialType={item.type === 'pie' ? 'donut' : 'bar'}
          questionId={item.id}
          allowTypeSwitch={true}
        />
      </div>

      {/* Vùng nhận xét & phân tích chuyên sâu */}
      <div className="p-5 sm:p-7 bg-[#FAF7F0] space-y-4">
        {/* Nhận xét phân tích riêng biệt cho 6 biểu đồ trọng tâm */}
        {item.specificChartAnalysis && (
          <div className="p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 font-sans">
                <Sparkles size={15} className="text-amber-600" />
                <span>Nhận xét phân tích biểu đồ · {item.specificChartAnalysis.chartTitle}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 uppercase font-sans">
                Báo cáo chính thức
              </span>
            </div>
            <p className="font-lora text-xs sm:text-sm text-[#3A3530] leading-relaxed font-medium">
              {item.specificChartAnalysis.analysis}
            </p>
            {item.specificChartAnalysis.keyStats && (
              <div className="flex flex-wrap gap-2 pt-2.5 border-t border-amber-200">
                {item.specificChartAnalysis.keyStats.map((st, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-sans">
                    <span className="text-[#6B635A]">{st.label}:</span>
                    <strong className="text-[#B56D4F] font-bold">{st.value}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-5 rounded-2xl bg-white border-l-4 border-l-[#B56D4F] border border-[#D6CDBF] shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B56D4F] font-sans">
            <Lightbulb size={16} className="text-[#B56D4F]" />
            <span>Đúc kết & Hành động từ khảo sát</span>
          </div>

          <p className="font-lora text-xs sm:text-sm font-semibold text-[#3A3530]">
            🌟 {item.commentary.highlight}
          </p>

          <p className="font-lora text-xs sm:text-sm text-[#5C554E] leading-relaxed">
            {item.commentary.analysis}
          </p>

          <div className="pt-2 border-t border-[#D6CDBF]/50 flex items-start gap-2">
            <CheckCircle2 size={15} className="text-[#059669] shrink-0 mt-0.5" />
            <p className="font-lora text-xs text-[#059669] font-medium leading-relaxed">
              <strong className="text-[#047857]">Góc nhìn giải pháp:</strong> {item.commentary.takeaway}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

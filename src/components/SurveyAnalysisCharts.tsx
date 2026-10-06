import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Sparkles, 
  Wifi
} from 'lucide-react';
import { SurveyStatsData } from '../data/surveyStatsData';
import { SurveyAnswer, PageId } from '../types';
import RechartsCircularChart, { RechartsPieItem } from './RechartsCircularChart';

interface SurveyAnalysisChartsProps {
  stats: SurveyStatsData;
  userAnswer?: SurveyAnswer | null;
  onNavigate?: (page: PageId) => void;
}

export default function SurveyAnalysisCharts({
  stats,
  userAnswer,
}: SurveyAnalysisChartsProps) {
  const [chartViewMode, setChartViewMode] = useState<'both' | 'pie' | 'bar'>('both');
  const total = stats.totalParticipants;

  // Helper to calculate percentage
  const calcPercent = (count: number) => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((count / total) * 100));
  };

  // Pie chart datasets with harmonic vintage colors
  const ageColors = ['#D4A373', '#B56D4F', '#6B7A6E', '#4A5568'];
  const booksColors = ['#E07A5F', '#3D405B', '#81B29A', '#F2CC8F'];
  const formatColors = ['#B56D4F', '#6B7A6E', '#D4A373', '#7F5539', '#588157'];
  const genreColors = ['#B56D4F', '#C08552', '#6B7A6E', '#8C5E58', '#4A7C59', '#3D405B'];
  const motivationColors = ['#B56D4F', '#4A7C59', '#D4A373', '#3D405B'];
  const barrierColors = ['#B56D4F', '#8C5E58', '#6B7A6E', '#D4A373'];
  const habitColors = ['#7F5539', '#588157', '#C08552', '#3D405B', '#8C5E58'];

  // 1. Age (Recharts dataset)
  const ageRechartsData: RechartsPieItem[] = [
    { name: 'Dưới 18', value: stats.ageGroup['under-18'], color: ageColors[0], isUserChoice: userAnswer?.ageGroup === 'under-18' },
    { name: '18–22 tuổi', value: stats.ageGroup['18-22'], color: ageColors[1], isUserChoice: userAnswer?.ageGroup === '18-22' },
    { name: '23–30 tuổi', value: stats.ageGroup['23-30'], color: ageColors[2], isUserChoice: userAnswer?.ageGroup === '23-30' },
    { name: 'Trên 30', value: stats.ageGroup['above-30'], color: ageColors[3], isUserChoice: userAnswer?.ageGroup === 'above-30' },
  ];

  // 2. Books (Recharts dataset)
  const booksRechartsData: RechartsPieItem[] = [
    { name: '< 2 cuốn/năm', value: stats.booksPerYear['under-2'], color: booksColors[0], isUserChoice: userAnswer?.booksPerYear === 'under-2' },
    { name: '2–5 cuốn/năm', value: stats.booksPerYear['2-5'], color: booksColors[1], isUserChoice: userAnswer?.booksPerYear === '2-5' },
    { name: '6–12 cuốn/năm', value: stats.booksPerYear['6-12'], color: booksColors[2], isUserChoice: userAnswer?.booksPerYear === '6-12' },
    { name: '> 12 cuốn/năm', value: stats.booksPerYear['above-12'], color: booksColors[3], isUserChoice: userAnswer?.booksPerYear === 'above-12' },
  ];

  // 3. Format (Recharts dataset)
  const formatRechartsData: RechartsPieItem[] = Object.entries(stats.readingFormats || {}).map(([format, count], i) => ({
    name: format,
    value: count,
    color: formatColors[i % formatColors.length],
    isUserChoice: userAnswer?.readingFormats?.includes(format),
  }));

  // 4. Genres (Recharts dataset)
  const genreRechartsData: RechartsPieItem[] = Object.entries(stats.favoriteGenres || {}).map(([genre, count], i) => ({
    name: genre,
    value: count,
    color: genreColors[i % genreColors.length],
    isUserChoice: userAnswer?.favoriteGenres?.includes(genre),
  }));

  // 5. Motivations (Recharts dataset)
  const motivationRechartsData: RechartsPieItem[] = Object.entries(stats.readingMotivations || {}).map(([mot, count], i) => ({
    name: mot,
    value: count,
    color: motivationColors[i % motivationColors.length],
    isUserChoice: userAnswer?.readingMotivations?.includes(mot),
  }));

  // 6. Barriers (Recharts dataset)
  const barrierRechartsData: RechartsPieItem[] = Object.entries(stats.readingBarriers || {}).map(([barrier, count], i) => ({
    name: barrier,
    value: count,
    color: barrierColors[i % barrierColors.length],
    isUserChoice: userAnswer?.readingBarriers?.includes(barrier),
  }));

  // 7. Buying Habits (Recharts dataset)
  const habitRechartsData: RechartsPieItem[] = Object.entries(stats.buyingHabits || {}).map(([habit, count], i) => ({
    name: habit,
    value: count,
    color: habitColors[i % habitColors.length],
    isUserChoice: userAnswer?.buyingHabits?.includes(habit),
  }));

  const totalFormatSelections = Object.values(stats.readingFormats || {}).reduce((a, b) => a + b, 0);
  const totalGenreSelections = Object.values(stats.favoriteGenres || {}).reduce((a, b) => a + b, 0);
  const totalMotivationSelections = Object.values(stats.readingMotivations || {}).reduce((a, b) => a + b, 0);
  const totalBarrierSelections = Object.values(stats.readingBarriers || {}).reduce((a, b) => a + b, 0);
  const totalHabitSelections = Object.values(stats.buyingHabits || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full space-y-10">
      {/* 1. Header Thống kê tổng quan */}
      <div className="bg-gradient-to-br from-[#FAF7F0] to-[#F2ECE1] p-5 sm:p-8 rounded-3xl border-2 border-[#D6CDBF] shadow-lg text-center relative overflow-hidden">
        {/* Device Sync & Realtime live badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/20 font-sans">
            <Users size={14} />
            <span>Dữ Liệu Khảo Sát Đa Thiết Bị</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#4A7C59] bg-[#4A7C59]/10 border border-[#4A7C59]/20 font-sans">
            <Wifi size={13} className="animate-pulse" />
            <span>Đồng bộ máy chủ</span>
          </div>
        </div>

        <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#3A3530] mb-3">
          Báo Cáo & Biểu Đồ Thống Kê Khảo Sát
        </h3>

        <p className="font-lora text-xs sm:text-sm text-[#6B635A] max-w-xl mx-auto mb-6 leading-relaxed">
          Biểu đồ tròn được hiển thị chuẩn xác bằng thư viện <strong>Recharts</strong> chuyên nghiệp, tự động cập nhật ngay khi bạn hoặc cộng đồng gửi khảo sát mới.
        </p>

        {/* Big Counter Callout - Displayed Prominently Above Charts */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#B56D4F]/30 shadow-md mb-6 max-w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#B56D4F] text-white flex items-center justify-center shadow-sm shrink-0">
              <Users size={28} />
            </div>
            <div className="text-left">
              <span className="text-[12px] font-bold text-[#6B635A] uppercase tracking-wider block font-sans">
                TỔNG SỐ NGƯỜI ĐÃ THAM GIA KHẢO SÁT
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-playfair text-4xl sm:text-5xl font-black text-[#B56D4F]">
                  {total.toLocaleString('vi-VN')}
                </span>
                <span className="text-sm sm:text-base font-lora text-[#3A3530] font-bold">
                  {total === 0 ? 'người tham gia (Hãy là người đầu tiên!)' : 'bạn trẻ đã đóng góp'}
                </span>
              </div>
            </div>
          </div>

          {userAnswer && (
            <>
              <div className="h-px sm:h-12 w-full sm:w-px bg-[#D6CDBF]" />
              <div className="flex items-center gap-2 text-xs sm:text-sm font-lora text-[#4A7C59] font-bold bg-[#4A7C59]/10 px-4 py-2.5 rounded-xl border border-[#4A7C59]/20">
                <Sparkles size={18} />
                <span>Đã ghi nhận câu trả lời của bạn!</span>
              </div>
            </>
          )}
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-[#6B635A] uppercase tracking-wider font-sans mr-1">
            Hiển thị:
          </span>
          <div className="inline-flex p-1 bg-[#EBE5D9] rounded-xl border border-[#D6CDBF]">
            <button
              onClick={() => setChartViewMode('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartViewMode === 'both'
                  ? 'bg-white text-[#B56D4F] shadow-xs'
                  : 'text-[#6B635A] hover:text-[#3A3530]'
              }`}
            >
              Cả hai biểu đồ
            </button>
            <button
              onClick={() => setChartViewMode('pie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartViewMode === 'pie'
                  ? 'bg-white text-[#B56D4F] shadow-xs'
                  : 'text-[#6B635A] hover:text-[#3A3530]'
              }`}
            >
              <PieChartIcon size={14} />
              <span>Biểu đồ tròn (Recharts)</span>
            </button>
            <button
              onClick={() => setChartViewMode('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartViewMode === 'bar'
                  ? 'bg-white text-[#B56D4F] shadow-xs'
                  : 'text-[#6B635A] hover:text-[#3A3530]'
              }`}
            >
              <BarChart3 size={14} />
              <span>Biểu đồ thanh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Biểu đồ từng câu hỏi - RECHARTS CIRCULAR CHARTS CHO TOÀN BỘ 6 CÂU HỎI */}
      <div className="space-y-8">
        {/* CÂU 1: ĐỘ TUỔI */}
        <div className="vintage-card-bg bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#D6CDBF] shadow-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D6CDBF]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#B56D4F]/15 text-[#B56D4F] text-sm font-bold font-sans flex items-center justify-center">
                01
              </span>
              <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                1. Phân bố theo độ tuổi
              </h4>
            </div>
            <span className="text-xs text-[#6B635A] font-lora">Đơn lựa chọn</span>
          </div>

          {/* Recharts Circular/Pie Chart */}
          {(chartViewMode === 'both' || chartViewMode === 'pie') && (
            <div className="mb-8 pb-8 border-b border-[#D6CDBF]/70">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block mb-4 font-sans text-center">
                Biểu đồ tròn phân bố độ tuổi (Recharts):
              </span>
              <RechartsCircularChart
                title="Độ tuổi"
                data={ageRechartsData}
                total={total}
              />
            </div>
          )}

          {/* Biểu đồ thanh phần trăm */}
          {(chartViewMode === 'both' || chartViewMode === 'bar') && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block font-sans">
                Chi tiết thanh phần trăm (%):
              </span>
              {[
                { key: 'under-18', label: 'Dưới 18 tuổi', count: stats.ageGroup['under-18'], color: ageColors[0] },
                { key: '18-22', label: '18 – 22 tuổi (Học sinh, sinh viên)', count: stats.ageGroup['18-22'], color: ageColors[1] },
                { key: '23-30', label: '23 – 30 tuổi (Người trẻ đi làm)', count: stats.ageGroup['23-30'], color: ageColors[2] },
                { key: 'above-30', label: 'Trên 30 tuổi', count: stats.ageGroup['above-30'], color: ageColors[3] },
              ].map((item) => {
                const pct = calcPercent(item.count);
                const isUserChoice = userAnswer?.ageGroup === item.key;

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.label}
                        {isUserChoice && (
                          <span className="px-2 py-0.5 bg-[#B56D4F] text-white text-[10px] font-sans font-bold rounded-sm">
                            Lựa chọn của bạn
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm sm:text-base text-[#3A3530]">{pct}%</span>
                        <span className="text-xs text-[#6B635A] ml-1">({item.count} người)</span>
                      </div>
                    </div>
                    <div className="w-full h-3.5 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CÂU 2: SỐ SÁCH ĐỌC MỖI NĂM */}
        <div className="vintage-card-bg bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#D6CDBF] shadow-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D6CDBF]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#B56D4F]/15 text-[#B56D4F] text-sm font-bold font-sans flex items-center justify-center">
                02
              </span>
              <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                2. Số cuốn sách đọc trung bình/năm
              </h4>
            </div>
            <span className="text-xs text-[#6B635A] font-lora">Tần suất đọc</span>
          </div>

          {/* Recharts Circular/Pie Chart */}
          {(chartViewMode === 'both' || chartViewMode === 'pie') && (
            <div className="mb-8 pb-8 border-b border-[#D6CDBF]/70">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block mb-4 font-sans text-center">
                Biểu đồ tròn tần suất đọc (Recharts):
              </span>
              <RechartsCircularChart
                title="Số sách"
                data={booksRechartsData}
                total={total}
              />
            </div>
          )}

          {/* Biểu đồ thanh phần trăm */}
          {(chartViewMode === 'both' || chartViewMode === 'bar') && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block font-sans">
                Chi tiết thanh phần trăm (%):
              </span>
              {[
                { key: 'under-2', label: 'Dưới 2 cuốn/năm', count: stats.booksPerYear['under-2'], color: booksColors[0] },
                { key: '2-5', label: '2 – 5 cuốn/năm', count: stats.booksPerYear['2-5'], color: booksColors[1] },
                { key: '6-12', label: '6 – 12 cuốn/năm', count: stats.booksPerYear['6-12'], color: booksColors[2] },
                { key: 'above-12', label: 'Trên 12 cuốn/năm (Mọt sách)', count: stats.booksPerYear['above-12'], color: booksColors[3] },
              ].map((item) => {
                const pct = calcPercent(item.count);
                const isUserChoice = userAnswer?.booksPerYear === item.key;

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.label}
                        {isUserChoice && (
                          <span className="px-2 py-0.5 bg-[#B56D4F] text-white text-[10px] font-sans font-bold rounded-sm">
                            Lựa chọn của bạn
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm sm:text-base text-[#3A3530]">{pct}%</span>
                        <span className="text-xs text-[#6B635A] ml-1">({item.count} người)</span>
                      </div>
                    </div>
                    <div className="w-full h-3.5 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CÂU 3: HÌNH THỨC ĐỌC */}
        <div className="vintage-card-bg bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#D6CDBF] shadow-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D6CDBF]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#B56D4F]/15 text-[#B56D4F] text-sm font-bold font-sans flex items-center justify-center">
                03
              </span>
              <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                3. Hình thức đọc được ưa chuộng
              </h4>
            </div>
            <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
          </div>

          {/* Recharts Circular/Pie Chart */}
          {(chartViewMode === 'both' || chartViewMode === 'pie') && (
            <div className="mb-8 pb-8 border-b border-[#D6CDBF]/70">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block mb-4 font-sans text-center">
                Biểu đồ tròn cơ cấu hình thức đọc (Recharts):
              </span>
              <RechartsCircularChart
                title="Hình thức"
                data={formatRechartsData}
                total={totalFormatSelections || 1}
              />
            </div>
          )}

          {/* Biểu đồ thanh phần trăm */}
          {(chartViewMode === 'both' || chartViewMode === 'bar') && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block font-sans">
                Tỷ lệ % trên tổng số người tham gia:
              </span>
              {Object.entries(stats.readingFormats).map(([format, count], i) => {
                const pct = calcPercent(count);
                const isUserChoice = userAnswer?.readingFormats?.includes(format);
                const color = formatColors[i % formatColors.length];

                return (
                  <div key={format} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        {format}
                        {isUserChoice && (
                          <span className="px-2 py-0.5 bg-[#B56D4F] text-white text-[10px] font-sans font-bold rounded-sm">
                            Bạn đã chọn
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm sm:text-base text-[#3A3530]">{pct}%</span>
                        <span className="text-xs text-[#6B635A] ml-1">({count} người)</span>
                      </div>
                    </div>
                    <div className="w-full h-3.5 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CÂU 4: THỂ LOẠI SÁCH QUAN TÂM */}
        <div className="vintage-card-bg bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#D6CDBF] shadow-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D6CDBF]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#B56D4F]/15 text-[#B56D4F] text-sm font-bold font-sans flex items-center justify-center">
                04
              </span>
              <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                4. Thể loại sách quan tâm hàng đầu
              </h4>
            </div>
            <span className="text-xs text-[#6B635A] font-lora">(Chọn tối đa 3)</span>
          </div>

          {/* Recharts Circular/Pie Chart */}
          {(chartViewMode === 'both' || chartViewMode === 'pie') && (
            <div className="mb-8 pb-8 border-b border-[#D6CDBF]/70">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block mb-4 font-sans text-center">
                Biểu đồ tròn cơ cấu thể loại sách (Recharts):
              </span>
              <RechartsCircularChart
                title="Thể loại"
                data={genreRechartsData}
                total={totalGenreSelections || 1}
              />
            </div>
          )}

          {/* Biểu đồ thanh phần trăm */}
          {(chartViewMode === 'both' || chartViewMode === 'bar') && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block font-sans">
                Tỷ lệ % trên tổng số người tham gia:
              </span>
              {Object.entries(stats.favoriteGenres).map(([genre, count], i) => {
                const pct = calcPercent(count);
                const isUserChoice = userAnswer?.favoriteGenres?.includes(genre);
                const color = genreColors[i % genreColors.length];

                return (
                  <div key={genre} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        {genre}
                        {isUserChoice && (
                          <span className="px-2 py-0.5 bg-[#B56D4F] text-white text-[10px] font-sans font-bold rounded-sm">
                            Bạn đã chọn
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm sm:text-base text-[#3A3530]">{pct}%</span>
                        <span className="text-xs text-[#6B635A] ml-1">({count} người)</span>
                      </div>
                    </div>
                    <div className="w-full h-3.5 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CÂU 5: ĐỘNG LỰC ĐỌC SÁCH */}
        <div className="vintage-card-bg bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#D6CDBF] shadow-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D6CDBF]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#B56D4F]/15 text-[#B56D4F] text-sm font-bold font-sans flex items-center justify-center">
                05
              </span>
              <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                5. Động lực thôi thúc bạn đọc sách
              </h4>
            </div>
            <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
          </div>

          {/* Recharts Circular/Pie Chart */}
          {(chartViewMode === 'both' || chartViewMode === 'pie') && (
            <div className="mb-8 pb-8 border-b border-[#D6CDBF]/70">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block mb-4 font-sans text-center">
                Biểu đồ tròn cơ cấu động lực đọc (Recharts):
              </span>
              <RechartsCircularChart
                title="Động lực"
                data={motivationRechartsData}
                total={totalMotivationSelections || 1}
              />
            </div>
          )}

          {/* Biểu đồ thanh phần trăm */}
          {(chartViewMode === 'both' || chartViewMode === 'bar') && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block font-sans">
                Tỷ lệ % trên tổng số người tham gia:
              </span>
              {Object.entries(stats.readingMotivations).map(([mot, count], i) => {
                const pct = calcPercent(count);
                const isUserChoice = userAnswer?.readingMotivations?.includes(mot);
                const color = motivationColors[i % motivationColors.length];

                return (
                  <div key={mot} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        {mot}
                        {isUserChoice && (
                          <span className="px-2 py-0.5 bg-[#B56D4F] text-white text-[10px] font-sans font-bold rounded-sm">
                            Bạn đã chọn
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm sm:text-base text-[#3A3530]">{pct}%</span>
                        <span className="text-xs text-[#6B635A] ml-1">({count} người)</span>
                      </div>
                    </div>
                    <div className="w-full h-3.5 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CÂU 6: RÀO CẢN ĐỌC */}
        <div className="vintage-card-bg bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#D6CDBF] shadow-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D6CDBF]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#B56D4F]/15 text-[#B56D4F] text-sm font-bold font-sans flex items-center justify-center">
                06
              </span>
              <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#3A3530]">
                6. Rào cản lớn nhất khi duy trì thói quen đọc
              </h4>
            </div>
            <span className="text-xs text-[#6B635A] font-lora">(Chọn nhiều)</span>
          </div>

          {/* Recharts Circular/Pie Chart */}
          {(chartViewMode === 'both' || chartViewMode === 'pie') && (
            <div className="mb-8 pb-8 border-b border-[#D6CDBF]/70">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block mb-4 font-sans text-center">
                Biểu đồ tròn cơ cấu rào cản đọc (Recharts):
              </span>
              <RechartsCircularChart
                title="Rào cản"
                data={barrierRechartsData}
                total={totalBarrierSelections || 1}
              />
            </div>
          )}

          {/* Biểu đồ thanh phần trăm */}
          {(chartViewMode === 'both' || chartViewMode === 'bar') && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635A] block font-sans">
                Tỷ lệ % trên tổng số người tham gia:
              </span>
              {Object.entries(stats.readingBarriers).map(([barrier, count], i) => {
                const pct = calcPercent(count);
                const isUserChoice = userAnswer?.readingBarriers?.includes(barrier);
                const color = barrierColors[i % barrierColors.length];

                return (
                  <div key={barrier} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        {barrier}
                        {isUserChoice && (
                          <span className="px-2 py-0.5 bg-[#B56D4F] text-white text-[10px] font-sans font-bold rounded-sm">
                            Bạn đã chọn
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm sm:text-base text-[#3A3530]">{pct}%</span>
                        <span className="text-xs text-[#6B635A] ml-1">({count} người)</span>
                      </div>
                    </div>
                    <div className="w-full h-3.5 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. Buying Habits Analysis Chart */}
        <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#D6CDBF] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#7F5539] text-white flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-lg text-[#3A3530]">Cách thức sở hữu sách</h3>
              <p className="text-[10px] text-[#6B635A] font-lora uppercase tracking-wider">Cộng đồng chọn sách như thế nào</p>
            </div>
          </div>

          {chartViewMode !== 'bar' && (
            <div className="h-[220px] mb-8">
              <RechartsCircularChart 
                data={habitRechartsData} 
                total={totalHabitSelections}
                title="Cách thức sở hữu sách"
              />
            </div>
          )}

          {chartViewMode !== 'pie' && (
            <div className="space-y-4">
              {Object.entries(stats.buyingHabits || {}).map(([habit, count], i) => {
                const pct = totalHabitSelections === 0 ? 0 : Math.round((count / totalHabitSelections) * 100);
                const isUserChoice = userAnswer?.buyingHabits?.includes(habit);
                const color = habitColors[i % habitColors.length];

                return (
                  <div key={habit} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-lora">
                      <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        {habit}
                        {isUserChoice && (
                          <span className="px-2 py-0.5 bg-[#B56D4F] text-white text-[10px] font-sans font-bold rounded-sm">
                            Bạn đã chọn
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm sm:text-base text-[#3A3530]">{pct}%</span>
                        <span className="text-xs text-[#6B635A] ml-1">({count} người)</span>
                      </div>
                    </div>
                    <div className="w-full h-3.5 bg-[#EBE5D9] rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

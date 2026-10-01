import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  PieChart as PieIcon, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  Wifi,
  BookmarkCheck,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { SurveyStatsData, INITIAL_SURVEY_STATS } from '../data/surveyStatsData';
import { PageId } from '../types';
import VintageSeparator from './VintageSeparator';

interface ReadingTrendsChartSectionProps {
  onNavigate: (page: PageId) => void;
}

type TabType = 'formats' | 'genres' | 'frequency' | 'psychology';

export default function ReadingTrendsChartSection({ onNavigate }: ReadingTrendsChartSectionProps) {
  const [stats, setStats] = useState<SurveyStatsData>(INITIAL_SURVEY_STATS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('formats');
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Sync real-time data from Firestore
  useEffect(() => {
    const docRef = doc(db, 'stats', 'global');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SurveyStatsData;
        setStats(data);
      }
      setIsLoading(false);
    }, (err) => {
      console.warn("Failed to listen to stats/global from Firestore:", err);
      setIsLoading(false);
    });

    // Check if current user has already taken the survey
    const savedLocal = localStorage.getItem('doc_va_tre_survey_data_v1');
    if (savedLocal || auth.currentUser) {
      setHasVoted(true);
    }

    return () => unsubscribe();
  }, []);

  const total = stats.totalParticipants || 0;

  // Custom Recharts Tooltip styled with vintage palette
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      const count = payload[0].value;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      return (
        <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#D6CDBF] shadow-xl text-xs font-lora">
          <div className="font-playfair font-bold text-[#3A3530] text-sm mb-1">{label || dataItem.name}</div>
          <div className="flex items-center gap-2 text-[#6B635A]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dataItem.color || '#B56D4F' }} />
            <span>Số lượt chọn: <strong className="text-[#3A3530]">{count.toLocaleString('vi-VN')} bạn</strong></span>
          </div>
          <div className="text-[#B56D4F] font-bold mt-0.5">
            Tỷ lệ quan tâm: {pct}%
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Pie Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      const count = dataItem.value;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      return (
        <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#D6CDBF] shadow-xl text-xs font-lora">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dataItem.color }} />
            <strong className="text-[#3A3530] font-sans">{dataItem.name}</strong>
          </div>
          <div className="text-[#6B635A]">
            Số lượng: <strong className="text-[#3A3530]">{count} người</strong> ({pct}%)
          </div>
        </div>
      );
    }
    return null;
  };

  // 1. Data for Reading Formats
  const formatColors = ['#B56D4F', '#6B7A6E', '#D4A373', '#7F5539', '#588157'];
  const formatsData = Object.entries(stats.readingFormats || {}).map(([name, value], i) => ({
    name,
    shortName: name.length > 25 ? name.substring(0, 23) + '…' : name,
    value,
    color: formatColors[i % formatColors.length],
  })).sort((a, b) => b.value - a.value);

  // 2. Data for Genres
  const genreColors = ['#B56D4F', '#C08552', '#6B7A6E', '#8C5E58', '#4A7C59', '#3D405B'];
  const genresData = Object.entries(stats.favoriteGenres || {}).map(([name, value], i) => ({
    name,
    shortName: name.split('/')[0].trim(),
    value,
    color: genreColors[i % genreColors.length],
  })).sort((a, b) => b.value - a.value);

  // 3. Data for Reading Frequency (Books per year)
  const booksColors = ['#E07A5F', '#3D405B', '#81B29A', '#F2CC8F'];
  const booksYearData = [
    { name: '< 2 cuốn/năm', value: stats.booksPerYear?.['under-2'] || 0, color: booksColors[0] },
    { name: '2–5 cuốn/năm', value: stats.booksPerYear?.['2-5'] || 0, color: booksColors[1] },
    { name: '6–12 cuốn/năm', value: stats.booksPerYear?.['6-12'] || 0, color: booksColors[2] },
    { name: '> 12 cuốn/năm', value: stats.booksPerYear?.['above-12'] || 0, color: booksColors[3] },
  ];

  // Age Group Data
  const ageColors = ['#D4A373', '#B56D4F', '#6B7A6E', '#4A5568'];
  const ageData = [
    { name: 'Dưới 18 tuổi', value: stats.ageGroup?.['under-18'] || 0, color: ageColors[0] },
    { name: '18–22 tuổi', value: stats.ageGroup?.['18-22'] || 0, color: ageColors[1] },
    { name: '23–30 tuổi', value: stats.ageGroup?.['23-30'] || 0, color: ageColors[2] },
    { name: 'Trên 30 tuổi', value: stats.ageGroup?.['above-30'] || 0, color: ageColors[3] },
  ];

  // 4. Data for Barriers & Motivations
  const barriersData = Object.entries(stats.readingBarriers || {}).map(([name, value], i) => ({
    name,
    shortName: name.length > 28 ? name.substring(0, 26) + '…' : name,
    value,
    color: ['#B56D4F', '#8C5E58', '#6B7A6E', '#D4A373'][i % 4],
  })).sort((a, b) => b.value - a.value);

  const motivationsData = Object.entries(stats.readingMotivations || {}).map(([name, value], i) => ({
    name,
    shortName: name.length > 28 ? name.substring(0, 26) + '…' : name,
    value,
    color: ['#4A7C59', '#D4A373', '#B56D4F', '#3D405B'][i % 4],
  })).sort((a, b) => b.value - a.value);

  return (
    <section className="w-full vintage-paper-bg py-16 sm:py-24 border-t border-[#D6CDBF] text-[#3A3530] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/25 shadow-xs mb-3 font-sans">
            <TrendingUp size={14} />
            <span>SỐ LIỆU KHẢO SÁT THỰC TẾ · REALTIME FIRESTORE</span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3A3530] mb-3">
            Biểu đồ xu hướng đọc sách của giới trẻ
          </h2>
          <VintageSeparator color="#B56D4F" width="w-24" />

          <p className="font-lora text-sm sm:text-base text-[#6B635A] leading-relaxed mt-4">
            Dữ liệu trực quan hóa bằng thư viện <strong>Recharts</strong>, đồng bộ tự động từ phiếu đóng góp của độc giả trẻ trên khắp cả nước.
          </p>

          {/* Real-time Community Count Header Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white/90 border border-[#D6CDBF] px-5 py-2.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-[#6B635A] uppercase tracking-wider font-sans">
                Đang trực tuyến:
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 font-sans">
              <span className="font-playfair text-xl sm:text-2xl font-black text-[#B56D4F]">
                {total.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs font-lora text-[#3A3530] font-medium">
                bạn đọc đã gửi ý kiến
              </span>
            </div>
            <span className="hidden sm:inline text-[#D6CDBF]">•</span>
            <div className="flex items-center gap-1 text-xs text-[#4A7C59] font-sans font-medium">
              <Wifi size={13} />
              <span>Cập nhật qua Cloud Firestore</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#D6CDBF] shadow-sm inline-flex gap-1.5">
            {[
              { id: 'formats', label: '1. Hình thức đọc', icon: BookOpen },
              { id: 'genres', label: '2. Thể loại được chuộng', icon: Sparkles },
              { id: 'frequency', label: '3. Tần suất & Độ tuổi', icon: BarChart3 },
              { id: 'psychology', label: '4. Động lực & Rào cản', icon: Compass },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-lora font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#B56D4F] text-white shadow-md'
                      : 'text-[#6B635A] hover:text-[#3A3530] hover:bg-white/60'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Viewport Container */}
        <div className="vintage-card-bg bg-[#FAF7F0]/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-2 border-[#D6CDBF] shadow-xl relative min-h-[480px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 space-y-4">
              <div className="w-12 h-12 border-4 border-[#B56D4F]/20 border-t-[#B56D4F] rounded-full animate-spin" />
              <p className="font-lora text-sm text-[#6B635A]">Đang nạp dữ liệu thống kê từ Firestore...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* TAB 1: READING FORMATS */}
              {activeTab === 'formats' && (
                <motion.div
                  key="formats"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6CDBF]/70 pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#B56D4F] uppercase tracking-wider font-sans block mb-1">
                        PHÂN BỔ THEO KÊNH TIẾP NHẬN SÁCH
                      </span>
                      <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
                        Sách giấy truyền thống vs Sách điện tử & Audio
                      </h3>
                    </div>
                    <span className="text-xs font-lora text-[#6B635A] italic">
                      (Độc giả có thể chọn nhiều hình thức cùng lúc)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Recharts Horizontal Bar Chart */}
                    <div className="lg:col-span-7 h-72 sm:h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={formatsData}
                          layout="vertical"
                          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBE5D9" />
                          <XAxis type="number" tick={{ fill: '#6B635A', fontSize: 11 }} />
                          <YAxis 
                            dataKey="shortName" 
                            type="category" 
                            width={160}
                            tick={{ fill: '#3A3530', fontSize: 12, fontFamily: 'Lora' }}
                          />
                          <Tooltip content={<CustomBarTooltip />} />
                          <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={900}>
                            {formatsData.map((entry, index) => (
                              <Cell key={`cell-fmt-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Donut Distribution Breakdown */}
                    <div className="lg:col-span-5 bg-white/70 p-6 rounded-2xl border border-[#D6CDBF] flex flex-col items-center">
                      <h4 className="font-playfair font-bold text-base text-[#3A3530] mb-2 text-center">
                        Tỷ trọng các hình thức
                      </h4>
                      <div className="w-48 h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={formatsData}
                              innerRadius={45}
                              outerRadius={70}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {formatsData.map((entry, index) => (
                                <Cell key={`cell-pie-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                          <span className="font-playfair text-xl font-bold text-[#3A3530]">
                            {formatsData.reduce((a, b) => a + b.value, 0)}
                          </span>
                          <span className="text-[10px] text-[#6B635A] uppercase font-sans">Lựa chọn</span>
                        </div>
                      </div>

                      {/* Mini Key Insights */}
                      <div className="w-full mt-4 space-y-2 border-t border-[#D6CDBF]/60 pt-3 text-xs font-lora">
                        <div className="flex items-center justify-between text-[#3A3530]">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#B56D4F]" />
                            Sách giấy truyền thống
                          </span>
                          <span className="font-bold font-sans">
                            {total > 0 ? Math.round(((stats.readingFormats?.['Sách giấy truyền thống'] || 0) / total) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#3A3530]">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#6B7A6E]" />
                            Máy đọc sách chuyên dụng
                          </span>
                          <span className="font-bold font-sans">
                            {total > 0 ? Math.round(((stats.readingFormats?.['Máy đọc sách chuyên dụng (Kindle, Kobo)'] || 0) / total) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#3A3530]">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#7F5539]" />
                            Audiobook & Podcast
                          </span>
                          <span className="font-bold font-sans">
                            {total > 0 ? Math.round(((stats.readingFormats?.['Sách nói (Audiobook qua Voiz FM, Fonos...)'] || 0) / total) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: FAVORITE GENRES */}
              {activeTab === 'genres' && (
                <motion.div
                  key="genres"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6CDBF]/70 pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#B56D4F] uppercase tracking-wider font-sans block mb-1">
                        BẢNG XẾP HẠNG THỂ LOẠI SÁCH ĐƯỢC QUAN TÂM NHẤT
                      </span>
                      <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
                        Gu sách nổi bật: Tâm lý chữa lành & Phát triển bản thân
                      </h3>
                    </div>
                    <button
                      onClick={() => onNavigate('genres')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B56D4F] hover:underline uppercase tracking-wider font-sans cursor-pointer"
                    >
                      <span>Xem tuyển tập sách theo thể loại</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Recharts Bar Chart for Genres */}
                  <div className="h-80 sm:h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={genresData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE5D9" />
                        <XAxis 
                          dataKey="shortName" 
                          tick={{ fill: '#3A3530', fontSize: 12, fontFamily: 'Lora' }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis tick={{ fill: '#6B635A', fontSize: 11 }} />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1000}>
                          {genresData.map((entry, index) => (
                            <Cell key={`cell-gnr-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Highlight pill cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {genresData.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white/80 p-3.5 rounded-xl border border-[#D6CDBF] text-center hover:border-[#B56D4F] transition-colors"
                      >
                        <span className="text-[10px] font-sans font-bold text-[#8C5E58] uppercase block">
                          Top {idx + 1}
                        </span>
                        <div className="font-playfair font-bold text-sm text-[#3A3530] truncate mt-1">
                          {item.shortName}
                        </div>
                        <div className="font-sans font-bold text-base text-[#B56D4F] mt-0.5">
                          {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                        </div>
                        <span className="text-[10px] text-[#6B635A] font-lora">
                          ({item.value} phiếu)
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: READING FREQUENCY & AGE */}
              {activeTab === 'frequency' && (
                <motion.div
                  key="frequency"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="border-b border-[#D6CDBF]/70 pb-4">
                    <span className="text-[11px] font-bold text-[#B56D4F] uppercase tracking-wider font-sans block mb-1">
                      SỨC ĐỌC & ĐỘ TUỔI THAM GIA
                    </span>
                    <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
                      Số cuốn sách trung bình mỗi năm & Cơ cấu lứa tuổi
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Books Per Year Pie Chart */}
                    <div className="bg-white/70 p-6 rounded-2xl border border-[#D6CDBF] flex flex-col items-center">
                      <div className="text-center mb-3">
                        <h4 className="font-playfair font-bold text-lg text-[#3A3530]">
                          Số cuốn sách đọc / năm
                        </h4>
                        <span className="text-xs font-lora text-[#6B635A]">
                          Tỷ lệ người đọc ít (&lt;2 cuốn) vs mọt sách (&gt;12 cuốn)
                        </span>
                      </div>
                      
                      <div className="w-56 h-56 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={booksYearData}
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {booksYearData.map((entry, index) => (
                                <Cell key={`cell-bk-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                          <span className="font-playfair text-2xl font-black text-[#B56D4F]">
                            {total}
                          </span>
                          <span className="text-[10px] text-[#6B635A] uppercase font-sans">Độc giả</span>
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#D6CDBF]/60 text-xs font-lora">
                        {booksYearData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-white/60">
                            <span className="flex items-center gap-1.5 text-[#3A3530]">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="truncate">{item.name}</span>
                            </span>
                            <span className="font-sans font-bold text-[#B56D4F] shrink-0">
                              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Age Group Bar Chart */}
                    <div className="bg-white/70 p-6 rounded-2xl border border-[#D6CDBF] flex flex-col items-center">
                      <div className="text-center mb-3">
                        <h4 className="font-playfair font-bold text-lg text-[#3A3530]">
                          Nhóm tuổi độc giả
                        </h4>
                        <span className="text-xs font-lora text-[#6B635A]">
                          Học sinh, sinh viên (18–22) và người trẻ đi làm (23–30)
                        </span>
                      </div>

                      <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ageData} margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE5D9" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: '#3A3530', fontSize: 11, fontFamily: 'Lora' }}
                            />
                            <YAxis tick={{ fill: '#6B635A', fontSize: 11 }} />
                            <Tooltip content={<CustomBarTooltip />} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                              {ageData.map((entry, index) => (
                                <Cell key={`cell-age-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#D6CDBF]/60 text-xs font-lora">
                        {ageData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-white/60">
                            <span className="flex items-center gap-1.5 text-[#3A3530]">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="truncate">{item.name}</span>
                            </span>
                            <span className="font-sans font-bold text-[#6B7A6E] shrink-0">
                              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: MOTIVATIONS & BARRIERS */}
              {activeTab === 'psychology' && (
                <motion.div
                  key="psychology"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="border-b border-[#D6CDBF]/70 pb-4">
                    <span className="text-[11px] font-bold text-[#B56D4F] uppercase tracking-wider font-sans block mb-1">
                      TÂM LÝ & THÓI QUEN ĐỜI SỐNG
                    </span>
                    <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
                      Động lực lớn nhất thôi thúc đọc & Rào cản số cản trở
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Motivations */}
                    <div className="bg-white/70 p-6 rounded-2xl border border-[#D6CDBF]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#4A7C59]/15 text-[#4A7C59] flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-playfair font-bold text-base text-[#3A3530]">
                            Động lực đọc sách
                          </h4>
                          <span className="text-[11px] font-lora text-[#6B635A]">Tại sao người trẻ tìm đến sách?</span>
                        </div>
                      </div>

                      <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={motivationsData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBE5D9" />
                            <XAxis type="number" tick={{ fill: '#6B635A', fontSize: 10 }} />
                            <YAxis 
                              dataKey="shortName" 
                              type="category" 
                              width={150}
                              tick={{ fill: '#3A3530', fontSize: 11, fontFamily: 'Lora' }}
                            />
                            <Tooltip content={<CustomBarTooltip />} />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                              {motivationsData.map((entry, index) => (
                                <Cell key={`cell-mot-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Barriers */}
                    <div className="bg-white/70 p-6 rounded-2xl border border-[#D6CDBF]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#B56D4F]/15 text-[#B56D4F] flex items-center justify-center font-bold">
                          !
                        </div>
                        <div>
                          <h4 className="font-playfair font-bold text-base text-[#3A3530]">
                            Rào cản lớn nhất
                          </h4>
                          <span className="text-[11px] font-lora text-[#6B635A]">Điều gì khiến việc đọc bị gián đoạn?</span>
                        </div>
                      </div>

                      <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barriersData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBE5D9" />
                            <XAxis type="number" tick={{ fill: '#6B635A', fontSize: 10 }} />
                            <YAxis 
                              dataKey="shortName" 
                              type="category" 
                              width={150}
                              tick={{ fill: '#3A3530', fontSize: 11, fontFamily: 'Lora' }}
                            />
                            <Tooltip content={<CustomBarTooltip />} />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                              {barriersData.map((entry, index) => (
                                <Cell key={`cell-barr-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Bottom Interactive CTA Card */}
          <div className="mt-10 pt-6 border-t border-[#D6CDBF]/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#FAF7F0] via-white/80 to-[#FAF7F0] p-5 rounded-2xl border border-[#D6CDBF]/60">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-[#B56D4F] text-white flex items-center justify-center shrink-0 shadow-xs">
                {hasVoted ? <BookmarkCheck size={22} /> : <Compass size={22} />}
              </div>
              <div>
                <h5 className="font-playfair font-bold text-base text-[#3A3530]">
                  {hasVoted 
                    ? 'Bạn đã đóng góp phiếu khảo sát vào hệ thống!' 
                    : 'Góp phần xây dựng bức tranh đọc sách của thế hệ trẻ?'}
                </h5>
                <p className="font-lora text-xs text-[#6B635A]">
                  {hasVoted 
                    ? 'Bạn có thể xem lại hoặc cập nhật câu trả lời bất kỳ lúc nào.' 
                    : 'Chỉ mất 2 phút. Dữ liệu của bạn sẽ được cộng dồn trực tiếp vào các biểu đồ Recharts phía trên!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('survey')}
              className="shrink-0 px-6 py-3 bg-[#B56D4F] hover:bg-[#9A5A3F] text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>{hasVoted ? 'Xem chi tiết phiếu của bạn' : 'Tham gia khảo sát ngay'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

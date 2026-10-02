import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { INITIAL_SURVEY_STATS, SurveyStatsData } from '../data/surveyStatsData';
import { BarChart3, PieChart as PieIcon, Info } from 'lucide-react';

export default function GenreSurveyChart() {
  const [stats, setStats] = useState<SurveyStatsData>(INITIAL_SURVEY_STATS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    const docRef = doc(db, 'stats', 'global');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data() as SurveyStatsData);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const chartData = Object.entries(stats.favoriteGenres)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#B56D4F', '#6B7A6E', '#C05C6E', '#367B99', '#2D7F60', '#6B5490', '#4A5568', '#D69E2E', '#3182CE', '#805AD5'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#D6CDBF]">
        <div className="w-10 h-10 border-4 border-[#B56D4F]/20 border-t-[#B56D4F] rounded-full animate-spin mb-4" />
        <p className="font-lora text-sm text-[#6B635A]">Đang tải dữ liệu khảo sát thực tế...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[2.5rem] border border-[#D6CDBF] p-6 sm:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#B56D4F]" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/20 mb-3 uppercase tracking-widest">
            <BarChart3 size={14} />
            <span>Dữ liệu thực tế từ cộng đồng</span>
          </div>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#3A3530]">
            Thể loại nào đang "lên ngôi"?
          </h3>
          <p className="font-lora text-sm text-[#6B635A] mt-2 max-w-xl">
            Biểu đồ tổng hợp từ {stats.totalParticipants.toLocaleString('vi-VN')} bạn trẻ đã tham gia khảo sát. Số liệu được cập nhật theo thời gian thực.
          </p>
        </div>

        <div className="flex bg-[#EBE5D9]/50 p-1 rounded-xl border border-[#D6CDBF]">
          <button
            onClick={() => setViewMode('bar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'bar' ? 'bg-white text-[#B56D4F] shadow-sm' : 'text-[#6B635A] hover:text-[#3A3530]'
            }`}
          >
            <BarChart3 size={14} />
            <span>Cột</span>
          </button>
          <button
            onClick={() => setViewMode('pie')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'pie' ? 'bg-white text-[#B56D4F] shadow-sm' : 'text-[#6B635A] hover:text-[#3A3530]'
            }`}
          >
            <PieIcon size={14} />
            <span>Tròn</span>
          </button>
        </div>
      </div>

      <div className="h-[400px] sm:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'bar' ? (
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#D6CDBF" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fontSize: 11, fill: '#3A3530', fontFamily: 'Lora' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#F5F1E8' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #D6CDBF', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  fontFamily: 'Lora',
                  fontSize: '13px'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]} 
                barSize={24}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={window.innerWidth < 640 ? 60 : 100}
                outerRadius={window.innerWidth < 640 ? 100 : 160}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-8 flex items-start gap-3 p-4 bg-[#FAF7F0] border border-[#D6CDBF] rounded-2xl">
        <Info size={18} className="text-[#B56D4F] shrink-0 mt-0.5" />
        <p className="text-xs text-[#6B635A] font-lora italic leading-relaxed">
          Ghi chú: Số liệu trên phản ánh xu hướng quan tâm đa dạng của thế hệ mới. Một người dùng có thể chọn tối đa 3 thể loại yêu thích nhất, do đó tổng tỉ lệ có thể vượt quá 100% nếu tính theo đầu người.
        </p>
      </div>
    </div>
  );
}

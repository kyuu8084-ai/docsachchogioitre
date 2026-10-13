import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';

interface MetricItem {
  id: string;
  category: 'barrier' | 'preference' | 'enabler' | 'habit';
  categoryLabel: string;
  label: string;
  questionSource: string;
  count: number;
  percent: number;
  color: string;
  description: string;
}

const COMPARATIVE_METRICS: MetricItem[] = [
  {
    id: 'm1',
    category: 'enabler',
    categoryLabel: 'Động lực',
    label: 'Có gợi ý đúng gu',
    questionSource: 'Câu 10: Điều giúp bạn đọc nhiều hơn',
    count: 36.3,
    percent: 36.3,
    color: '#059669',
    description: '36,3% bạn trẻ khẳng định sẽ đọc nhiều hơn nếu có người hoặc công cụ gợi ý cuốn sách chạm đúng gu sở thích.'
  },
  {
    id: 'm2',
    category: 'preference',
    categoryLabel: 'Nguồn đọc',
    label: 'Đọc miễn phí trên mạng',
    questionSource: 'Câu 06: Nguồn lấy sách',
    count: 42.9,
    percent: 42.9,
    color: '#5B50E5',
    description: '42,9% độc giả trẻ tìm đến các nguồn sách/truyện miễn phí trên mạng, gần gấp đôi so với mua online (23,4%).'
  },
  {
    id: 'm3',
    category: 'preference',
    categoryLabel: 'Hình thức',
    label: 'Truyện online',
    questionSource: 'Câu 05: Hình thức đọc sách',
    count: 32.3,
    percent: 32.3,
    color: '#6366F1',
    description: '32,3% bạn trẻ chọn truyện online, cạnh tranh sít sao với sách giấy truyền thống (31,2%).'
  },
  {
    id: 'm4',
    category: 'preference',
    categoryLabel: 'Hình thức',
    label: 'Sách giấy truyền thống',
    questionSource: 'Câu 05: Hình thức đọc sách',
    count: 31.2,
    percent: 31.2,
    color: '#B56D4F',
    description: '31,2% vẫn trung thành với sách giấy, chứng minh giới trẻ không hề quay lưng với trang sách in.'
  },
  {
    id: 'm5',
    category: 'enabler',
    categoryLabel: 'Không gian',
    label: 'Không gian đọc yên tĩnh',
    questionSource: 'Câu 10: Điều giúp bạn đọc nhiều hơn',
    count: 27.5,
    percent: 27.5,
    color: '#0891B2',
    description: '27,5% khao khát một góc không gian tĩnh lặng để đắm chìm vào từng trang sách mà không bị xao nhãng.'
  },
  {
    id: 'm6',
    category: 'barrier',
    categoryLabel: 'Rào cản',
    label: 'Phân tâm bởi điện thoại',
    questionSource: 'Câu 09: Điều gì cản bạn đọc nhiều hơn',
    count: 24.1,
    percent: 24.1,
    color: '#DC2626',
    description: '24,1% thừa nhận thông báo điện thoại thông minh là rào cản xao nhãng lớn nhất kéo họ khỏi trang sách.'
  },
  {
    id: 'm7',
    category: 'preference',
    categoryLabel: 'Động lực chọn',
    label: 'Review TikTok/FB/YouTube',
    questionSource: 'Câu 08: Điều khiến chọn một cuốn sách',
    count: 21.5,
    percent: 21.5,
    color: '#D97706',
    description: '21,5% bạn trẻ quyết định chọn đọc một cuốn sách sau khi xem video review trên BookTok và mạng xã hội.'
  },
  {
    id: 'm8',
    category: 'barrier',
    categoryLabel: 'Rào cản',
    label: 'Thiếu thời gian',
    questionSource: 'Câu 09: Điều gì cản bạn đọc nhiều hơn',
    count: 20.4,
    percent: 20.4,
    color: '#E11D48',
    description: '20,4% cảm thấy thiếu thời gian do lịch học tập và công việc bận rộn hằng ngày.'
  }
];

export default function D3SurveyComparisonChart() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'barrier' | 'enabler' | 'preference'>('all');
  const [hoveredMetric, setHoveredMetric] = useState<MetricItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(720);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) setContainerWidth(w);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredData = useMemo(() => {
    if (selectedFilter === 'all') return COMPARATIVE_METRICS;
    return COMPARATIVE_METRICS.filter(m => m.category === selectedFilter);
  }, [selectedFilter]);

  // Chart Dimensions
  const height = Math.max(340, Math.min(400, containerWidth * 0.55));
  const margin = {
    top: 35,
    right: 25,
    bottom: containerWidth < 500 ? 80 : 65,
    left: 45
  };
  const innerWidth = Math.max(containerWidth - margin.left - margin.right, 240);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 180);

  // D3 Scales
  const xScale = useMemo(() => {
    return d3.scaleBand()
      .domain(filteredData.map(d => d.id))
      .range([0, innerWidth])
      .padding(0.3);
  }, [filteredData, innerWidth]);

  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);
  }, [innerHeight]);

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div className="w-full bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border-2 border-[#D6CDBF] shadow-xl mb-12 text-left" ref={containerRef}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#D6CDBF]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#B56D4F] bg-[#B56D4F]/10 border border-[#B56D4F]/30 mb-2 font-sans">
            <Sparkles size={13} className="text-[#D9A441]" />
            <span>BIỂU ĐỒ SO SÁNH TỔNG HỢP D3.JS</span>
          </div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#3A3530]">
            Các Chỉ Số Quyết Định Hành Vi Đọc Của 100 Bạn Trẻ
          </h3>
          <p className="font-lora text-xs sm:text-sm text-[#6B635A] mt-1">
            Di chuột vào từng cột để xem phân tích cụ thể về rào cản, sở thích và giải pháp mong đợi.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 flex-wrap bg-white p-1 rounded-2xl border border-[#D6CDBF] shadow-2xs self-start md:self-auto">
          {[
            { id: 'all', label: 'Tất cả 8 chỉ số' },
            { id: 'barrier', label: 'Rào cản' },
            { id: 'enabler', label: 'Động lực' },
            { id: 'preference', label: 'Gu đọc & Nguồn' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#B56D4F] text-white shadow-xs'
                  : 'text-[#6B635A] hover:text-[#3A3530]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden flex flex-col items-center justify-center my-4">
        <svg
          width={containerWidth}
          height={height}
          className="overflow-visible font-sans select-none"
          aria-label="Biểu đồ cột so sánh tổng hợp D3"
        >
          <defs>
            {filteredData.map((d, i) => (
              <linearGradient
                key={`comp-grad-${d.id}`}
                id={`comp-grad-${d.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={d.color} stopOpacity="1" />
                <stop offset="100%" stopColor={d.color} stopOpacity="0.7" />
              </linearGradient>
            ))}
            <filter id="comp-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Horizontal Grid lines */}
            {yTicks.map((tick) => {
              const y = yScale(tick);
              return (
                <g key={`comp-tick-${tick}`} className="opacity-40">
                  <line
                    x1={0}
                    x2={innerWidth}
                    y1={y}
                    y2={y}
                    stroke="#D6CDBF"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  <text
                    x={-10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-[#6B635A] font-mono"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Base line */}
            <line
              x1={0}
              x2={innerWidth}
              y1={innerHeight}
              y2={innerHeight}
              stroke="#8C7A6B"
              strokeWidth={1.5}
            />

            {/* D3 Columns */}
            {filteredData.map((d, i) => {
              const x = xScale(d.id) || 0;
              const barWidth = xScale.bandwidth();
              const barHeight = innerHeight - yScale(d.percent);
              const y = yScale(d.percent);
              const isHovered = hoveredMetric?.id === d.id;
              const isDimmed = hoveredMetric !== null && !isHovered;

              return (
                <g
                  key={`comp-col-${d.id}`}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={(e) => {
                    setHoveredMetric(d);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parent = e.currentTarget.closest('svg')?.getBoundingClientRect();
                    setTooltipPos({
                      x: (rect.left + rect.width / 2) - (parent?.left || 0),
                      y: rect.top - (parent?.top || 0)
                    });
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parent = e.currentTarget.closest('svg')?.getBoundingClientRect();
                    setTooltipPos({
                      x: (rect.left + rect.width / 2) - (parent?.left || 0),
                      y: rect.top - (parent?.top || 0)
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredMetric(null);
                    setTooltipPos(null);
                  }}
                >
                  {/* Cột SVG */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barHeight, 4)}
                    rx={6}
                    ry={6}
                    fill={`url(#comp-grad-${d.id})`}
                    stroke={isHovered ? '#FFFFFF' : '#FAF7F0'}
                    strokeWidth={isHovered ? 2.5 : 1}
                    filter={isHovered ? 'url(#comp-glow)' : undefined}
                    opacity={isDimmed ? 0.35 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Nhãn % trên đỉnh cột */}
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(y - 8, 12)}
                    textAnchor="middle"
                    className={`font-sans font-black transition-all ${
                      isHovered ? 'fill-[#B56D4F] text-xs' : 'fill-[#3A3530] text-[11px]'
                    }`}
                    opacity={isDimmed ? 0.3 : 1}
                  >
                    {String(d.percent).replace('.', ',')}%
                  </text>

                  {/* Label dưới cột */}
                  <g transform={`translate(${x + barWidth / 2}, ${innerHeight + 14})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      className={`text-[10px] font-lora ${
                        isHovered ? 'fill-[#B56D4F] font-bold' : 'fill-[#5A524A]'
                      }`}
                      opacity={isDimmed ? 0.4 : 1}
                    >
                      {d.label.length > (containerWidth < 500 ? 10 : 16)
                        ? `${d.label.slice(0, containerWidth < 500 ? 9 : 14)}...`
                        : d.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {hoveredMetric && tooltipPos && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute z-30 p-3.5 sm:p-4 rounded-2xl bg-[#3A3530]/95 backdrop-blur-md text-white border border-white/20 shadow-2xl max-w-xs text-left"
              style={{
                left: `${Math.min(Math.max(tooltipPos.x, 120), containerWidth - 120)}px`,
                top: `${Math.max(tooltipPos.y - 130, 10)}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-white/15">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-sans text-white"
                  style={{ backgroundColor: hoveredMetric.color }}
                >
                  {hoveredMetric.categoryLabel}
                </span>
                <span className="text-[10px] text-white/70 font-mono">
                  {hoveredMetric.count}/100 phiếu
                </span>
              </div>

              <div className="font-playfair text-sm font-bold text-white mb-1">
                {hoveredMetric.label}
              </div>

              <div className="text-[11px] text-amber-300 font-sans font-bold mb-1">
                {hoveredMetric.questionSource}
              </div>

              <p className="text-xs text-white/80 font-lora leading-relaxed mb-2">
                {hoveredMetric.description}
              </p>

              <div className="flex items-center justify-between bg-white/10 px-2.5 py-1.5 rounded-xl text-xs font-sans">
                <span className="text-white/70">Tỷ lệ chiếm:</span>
                <span className="text-base font-black text-amber-300">{String(hoveredMetric.percent).replace('.', ',')}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

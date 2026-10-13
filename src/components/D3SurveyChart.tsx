import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  BarChart2, 
  PieChart as PieIcon, 
  ArrowUpDown, 
  HelpCircle,
  Eye,
  Percent,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { SurveyQuestionOption } from '../data/surveyResults100';

export type D3ChartType = 'column' | 'bar' | 'donut';
export type SortOption = 'default' | 'desc' | 'asc';

export const formatVietnamesePercent = (val: number): string => {
  return Number.isInteger(val) ? `${val}%` : `${String(val.toFixed(1)).replace('.', ',')}%`;
};

interface D3SurveyChartProps {
  options: SurveyQuestionOption[];
  total: number;
  initialType?: D3ChartType;
  questionId?: string;
  allowTypeSwitch?: boolean;
}

interface TooltipData {
  label: string;
  count: number;
  percent: number;
  color: string;
  rank: number;
  total: number;
  x: number;
  y: number;
}

export default function D3SurveyChart({
  options,
  total,
  initialType = 'column',
  questionId = 'chart',
  allowTypeSwitch = true
}: D3SurveyChartProps) {
  const [chartType, setChartType] = useState<D3ChartType>(initialType);
  const [sortOption, setSortOption] = useState<SortOption>('desc');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(640);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize observer to maintain responsive SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) setContainerWidth(width);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Process data with sorting
  const processedData = useMemo(() => {
    const list = [...options];
    if (sortOption === 'desc') {
      return list.sort((a, b) => b.count - a.count);
    } else if (sortOption === 'asc') {
      return list.sort((a, b) => a.count - b.count);
    }
    return list;
  }, [options, sortOption]);

  // Determine ranks
  const sortedByCount = useMemo(() => {
    return [...options].sort((a, b) => b.count - a.count);
  }, [options]);

  const getRank = (label: string) => {
    const idx = sortedByCount.findIndex(o => o.label === label);
    return idx >= 0 ? idx + 1 : 1;
  };

  const highestOption = sortedByCount[0];

  return (
    <div className="w-full flex flex-col items-center select-none" ref={containerRef}>
      {/* THANH ĐIỀU KHIỂN BIỂU ĐỒ D3 (TÙY CHỌN DẠNG BIỂU ĐỒ & SẮP XẾP) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#D6CDBF]/70">
        {/* Nhãn chế độ biểu đồ tương tác D3 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#D6CDBF] text-[11px] font-bold text-[#B56D4F] font-sans">
            <Sparkles size={12} className="text-[#D9A441]" />
            <span>Biểu đồ tương tác D3.js</span>
          </span>
          <span className="text-[11px] text-[#6B635A] font-lora hidden sm:inline">
            (Di chuột vào cột để xem chi tiết)
          </span>
        </div>

        {/* Nút chuyển đổi chế độ xem */}
        <div className="flex items-center gap-2 flex-wrap">
          {allowTypeSwitch && (
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#D6CDBF] shadow-2xs">
              <button
                type="button"
                onClick={() => setChartType('column')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  chartType === 'column'
                    ? 'bg-[#B56D4F] text-white shadow-xs'
                    : 'text-[#6B635A] hover:text-[#3A3530]'
                }`}
                title="Biểu đồ cột đứng D3"
              >
                <BarChart2 size={13} className="rotate-90" />
                <span className="hidden xs:inline">Cột đứng</span>
              </button>

              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-[#B56D4F] text-white shadow-xs'
                    : 'text-[#6B635A] hover:text-[#3A3530]'
                }`}
                title="Biểu đồ thanh ngang D3"
              >
                <BarChart3 size={13} />
                <span className="hidden xs:inline">Thanh ngang</span>
              </button>

              <button
                type="button"
                onClick={() => setChartType('donut')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  chartType === 'donut'
                    ? 'bg-[#B56D4F] text-white shadow-xs'
                    : 'text-[#6B635A] hover:text-[#3A3530]'
                }`}
                title="Biểu đồ tròn Donut D3"
              >
                <PieIcon size={13} />
                <span className="hidden xs:inline">Tròn</span>
              </button>
            </div>
          )}

          {/* Sắp xếp thứ tự cột */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#D6CDBF] shadow-2xs">
            <button
              type="button"
              onClick={() => {
                if (sortOption === 'desc') setSortOption('asc');
                else if (sortOption === 'asc') setSortOption('default');
                else setSortOption('desc');
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#6B635A] hover:text-[#3A3530] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Đổi thứ tự sắp xếp"
            >
              <ArrowUpDown size={12} />
              <span>
                {sortOption === 'desc' ? 'Giảm dần' : sortOption === 'asc' ? 'Tăng dần' : 'Mặc định'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* KHUNG HIỂN THỊ BIỂU ĐỒ D3 */}
      <div className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
        {chartType === 'column' && (
          <D3VerticalColumnChart
            data={processedData}
            total={total}
            width={containerWidth}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            setTooltip={setTooltip}
            getRank={getRank}
            chartId={questionId}
          />
        )}

        {chartType === 'bar' && (
          <D3HorizontalBarChart
            data={processedData}
            total={total}
            width={containerWidth}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            setTooltip={setTooltip}
            getRank={getRank}
            chartId={questionId}
          />
        )}

        {chartType === 'donut' && (
          <D3DonutSliceChart
            data={processedData}
            total={total}
            width={containerWidth}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            setTooltip={setTooltip}
            getRank={getRank}
            chartId={questionId}
          />
        )}

        {/* TOOLTIP NỔI TƯƠNG TÁC D3 (INTERACTIVE POPUP TOOLTIP) */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="pointer-events-none absolute z-30 p-3 sm:p-4 rounded-2xl bg-[#3A3530]/95 backdrop-blur-md text-white border border-white/20 shadow-2xl max-w-xs text-left"
              style={{
                left: `${Math.min(Math.max(tooltip.x, 110), containerWidth - 110)}px`,
                top: `${Math.max(tooltip.y - 120, 10)}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {/* Header Tooltip */}
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/15">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full ring-2 ring-white/40 shrink-0"
                    style={{ backgroundColor: tooltip.color }}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-sans">
                    Hạng #{tooltip.rank}
                  </span>
                </div>
                <span className="text-[10px] text-white/70 font-mono">
                  {tooltip.count}/{tooltip.total} phiếu
                </span>
              </div>

              {/* Tên lựa chọn */}
              <div className="font-playfair text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                {tooltip.label}
              </div>

              {/* Thông số cụ thể */}
              <div className="flex items-baseline justify-between gap-3 bg-white/10 px-2.5 py-1.5 rounded-xl mb-2">
                <span className="text-xs text-white/80 font-lora">Tỷ lệ chọn:</span>
                <span className="text-lg font-black text-amber-300 font-sans tracking-tight">
                  {formatVietnamesePercent(tooltip.percent)}
                </span>
              </div>

              {/* Thanh so sánh tương đối */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${tooltip.percent}%`,
                    backgroundColor: tooltip.color || '#B56D4F',
                  }}
                />
              </div>

              <div className="mt-2 text-[10px] text-white/60 italic font-lora text-center">
                {tooltip.rank === 1 ? '⭐ Lựa chọn có tỷ lệ cao nhất' : `Chiếm ${formatVietnamesePercent(tooltip.percent)} tổng lượt bình chọn`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CHÚ THÍCH DỮ LIỆU TƯƠNG TÁC DƯỚI CHÂN BIỂU ĐỒ (LEGEND LIST) */}
      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 pt-4 border-t border-[#D6CDBF]/70">
        {processedData.map((opt, i) => {
          const isHovered = hoveredIndex === i;
          const rank = getRank(opt.label);
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-lora ${
                isHovered
                  ? 'bg-white border-[#B56D4F] shadow-md scale-[1.02] ring-2 ring-[#B56D4F]/20'
                  : 'bg-white/70 hover:bg-white border-[#D6CDBF]'
              }`}
            >
              <div className="flex items-center gap-2 truncate mr-2">
                <span
                  className="w-3 h-3 rounded-md shrink-0 transition-transform"
                  style={{
                    backgroundColor: opt.color || '#B56D4F',
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
                <span className="font-semibold text-[#3A3530] truncate" title={opt.label}>
                  {opt.label}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 shrink-0 font-sans">
                <span className="font-bold text-sm text-[#3A3530]">{formatVietnamesePercent(opt.percent)}</span>
                <span className="text-[10px] text-[#6B635A]">({opt.count})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: BIỂU ĐỒ CỘT ĐỨNG D3 (VERTICAL COLUMN CHART)
// ----------------------------------------------------
interface D3SubChartProps {
  data: SurveyQuestionOption[];
  total: number;
  width: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  setTooltip: (tooltip: TooltipData | null) => void;
  getRank: (label: string) => number;
  chartId: string;
}

function D3VerticalColumnChart({
  data,
  total,
  width,
  hoveredIndex,
  setHoveredIndex,
  setTooltip,
  getRank,
  chartId
}: D3SubChartProps) {
  const height = Math.max(320, Math.min(380, width * 0.65));
  const margin = {
    top: 35,
    right: 25,
    bottom: width < 480 ? 65 : 55,
    left: 45
  };

  const innerWidth = Math.max(width - margin.left - margin.right, 240);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 180);

  // D3 Scales
  const xScale = useMemo(() => {
    return d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(data.length > 5 ? 0.25 : 0.35);
  }, [data, innerWidth]);

  const maxVal = d3.max(data, d => d.count) || 10;
  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, Math.max(10, Math.ceil(maxVal * 1.15))])
      .range([innerHeight, 0])
      .nice();
  }, [maxVal, innerHeight]);

  const yTicks = yScale.ticks(5);

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible font-sans"
      aria-label="Biểu đồ cột đứng tương tác D3"
    >
      <defs>
        {data.map((d, i) => {
          const baseColor = d.color || '#B56D4F';
          return (
            <linearGradient
              key={`grad-${chartId}-${i}`}
              id={`grad-${chartId}-${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={baseColor} stopOpacity="1" />
              <stop offset="100%" stopColor={baseColor} stopOpacity="0.75" />
            </linearGradient>
          );
        })}
        {/* Glow filter cho cột khi hover */}
        <filter id={`glow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* ĐƯỜNG LƯỚI NGANG (HORIZONTAL GRID LINES) */}
        {yTicks.map((tick, i) => {
          const y = yScale(tick);
          return (
            <g key={`grid-${i}`} className="opacity-40">
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
                className="text-[10px] fill-[#6B635A] font-lora"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* ĐƯỜNG TRỤC X GỐC */}
        <line
          x1={0}
          x2={innerWidth}
          y1={innerHeight}
          y2={innerHeight}
          stroke="#8C7A6B"
          strokeWidth={1.5}
        />

        {/* CÁC CỘT D3 (INTERACTIVE SVG RECTS) */}
        {data.map((d, i) => {
          const x = xScale(d.label) || 0;
          const barWidth = xScale.bandwidth();
          const barHeight = innerHeight - yScale(d.count);
          const y = yScale(d.count);
          const isHovered = hoveredIndex === i;
          const isDimmed = hoveredIndex !== null && !isHovered;
          const rank = getRank(d.label);

          return (
            <g
              key={`col-${i}`}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={(e) => {
                setHoveredIndex(i);
                const rect = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget.closest('svg')?.getBoundingClientRect();
                const relativeX = (rect.left + rect.width / 2) - (parent?.left || 0);
                const relativeY = (rect.top) - (parent?.top || 0);
                setTooltip({
                  label: d.label,
                  count: d.count,
                  percent: d.percent,
                  color: d.color || '#B56D4F',
                  rank,
                  total,
                  x: relativeX,
                  y: relativeY
                });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget.closest('svg')?.getBoundingClientRect();
                const relativeX = (rect.left + rect.width / 2) - (parent?.left || 0);
                const relativeY = (rect.top) - (parent?.top || 0);
                setTooltip({
                  label: d.label,
                  count: d.count,
                  percent: d.percent,
                  color: d.color || '#B56D4F',
                  rank,
                  total,
                  x: relativeX,
                  y: relativeY
                });
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setTooltip(null);
              }}
            >
              {/* Cột hiển thị */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 3)}
                rx={6}
                ry={6}
                fill={`url(#grad-${chartId}-${i})`}
                stroke={isHovered ? '#FFFFFF' : '#FAF7F0'}
                strokeWidth={isHovered ? 2.5 : 1}
                filter={isHovered ? `url(#glow-${chartId})` : undefined}
                opacity={isDimmed ? 0.35 : 1}
                className="transition-all duration-200"
                style={{
                  transformOrigin: `${x + barWidth / 2}px ${innerHeight}px`,
                  transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                }}
              />

              {/* Nhãn số liệu phần trăm và số người trên đỉnh cột */}
              <text
                x={x + barWidth / 2}
                y={Math.max(y - 8, 12)}
                textAnchor="middle"
                className={`font-sans font-bold transition-all duration-200 ${
                  isHovered ? 'fill-[#B56D4F] text-xs' : 'fill-[#3A3530] text-[11px]'
                }`}
                opacity={isDimmed ? 0.3 : 1}
              >
                {d.percent}%
              </text>

              {/* Tên danh mục trên trục X (Labels) */}
              <g transform={`translate(${x + barWidth / 2}, ${innerHeight + 14})`}>
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  className={`text-[11px] font-lora transition-colors ${
                    isHovered ? 'fill-[#B56D4F] font-bold' : 'fill-[#5A524A]'
                  }`}
                  opacity={isDimmed ? 0.4 : 1}
                >
                  {/* Cắt ngắn chữ nếu dài quá khi hiển thị trên mobile */}
                  {d.label.length > (width < 500 ? 12 : 20)
                    ? `${d.label.slice(0, width < 500 ? 10 : 18)}...`
                    : d.label}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: BIỂU ĐỒ THANH NGANG D3 (HORIZONTAL BAR CHART)
// ----------------------------------------------------
function D3HorizontalBarChart({
  data,
  total,
  width,
  hoveredIndex,
  setHoveredIndex,
  setTooltip,
  getRank,
  chartId
}: D3SubChartProps) {
  const itemHeight = Math.max(38, Math.min(48, 380 / data.length));
  const height = Math.max(280, data.length * itemHeight + 90);
  const margin = {
    top: 36,
    right: 65,
    bottom: 52,
    left: width < 480 ? 120 : 185
  };

  const innerWidth = Math.max(width - margin.left - margin.right, 180);
  const innerHeight = height - margin.top - margin.bottom;

  // D3 Scales
  const yScale = useMemo(() => {
    return d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerHeight])
      .padding(0.28);
  }, [data, innerHeight]);

  const maxVal = d3.max(data, d => d.percent) || 10;
  // Calculate a clean max domain that matches the image scales (e.g. 25, 40, 50)
  const maxDomain = useMemo(() => {
    if (maxVal <= 20) return 20;
    if (maxVal <= 25) return 25;
    if (maxVal <= 35) return 35;
    if (maxVal <= 40) return 40;
    return 50;
  }, [maxVal]);

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, maxDomain])
      .range([0, innerWidth]);
  }, [maxDomain, innerWidth]);

  // Vạch chia theo bước 5 hoặc 10 như ảnh gốc
  const xTicks = useMemo(() => {
    const step = maxDomain >= 40 ? 10 : (maxDomain <= 20 ? 2.5 : 5);
    const ticks: number[] = [];
    for (let i = 0; i <= maxDomain + 0.001; i += step) {
      ticks.push(Number(i.toFixed(1)));
    }
    return ticks;
  }, [maxDomain]);

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible font-sans"
      aria-label="Biểu đồ thanh ngang tương tác D3"
    >
      {/* Phụ đề chuẩn xác như ảnh gốc: n = 100 người trả lời · tổng các cột = 100% */}
      <text
        x={width / 2}
        y={18}
        textAnchor="middle"
        className="text-[12px] fill-[#6B635A] font-lora"
      >
        n = 100 người trả lời · tổng các cột = 100%
      </text>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* ĐƯỜNG TRỤC DỌC Y (MÀU ĐEN NHẸ NHƯ ẢNH) */}
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={innerHeight}
          stroke="#2A2826"
          strokeWidth={1.5}
        />

        {/* ĐƯỜNG TRỤC NGANG X DƯỚI CÙNG */}
        <line
          x1={0}
          x2={innerWidth}
          y1={innerHeight}
          y2={innerHeight}
          stroke="#2A2826"
          strokeWidth={1.5}
        />

        {/* CÁC VẠCH CHIA & NHÃN SỐ TRỤC X DƯỚI CÙNG */}
        {xTicks.map((tick, i) => {
          const x = xScale(tick);
          return (
            <g key={`xtick-${i}`} transform={`translate(${x}, ${innerHeight})`}>
              <line
                x1={0}
                x2={0}
                y1={0}
                y2={5}
                stroke="#2A2826"
                strokeWidth={1.2}
              />
              <text
                x={0}
                y={18}
                textAnchor="middle"
                className="text-[11px] fill-[#2A2826] font-sans font-normal"
              >
                {tick % 1 === 0 ? tick : String(tick).replace('.', ',')}
              </text>
            </g>
          );
        })}

        {/* NHÃN TIÊU ĐỀ TRỤC X NHƯ TRONG ẢNH GỐC: "Tỉ lệ trên tổng lượt chọn (%)" */}
        <text
          x={innerWidth / 2}
          y={innerHeight + 36}
          textAnchor="middle"
          className="text-xs fill-[#3A3530] font-lora font-normal"
        >
          Tỉ lệ trên tổng lượt chọn (%)
        </text>

        {/* CÁC THANH D3 */}
        {data.map((d, i) => {
          const y = yScale(d.label) || 0;
          const barHeight = yScale.bandwidth();
          const barWidth = Math.max(0, xScale(d.percent));
          const isHovered = hoveredIndex === i;
          const isDimmed = hoveredIndex !== null && !isHovered;
          const rank = getRank(d.label);

          return (
            <g
              key={`hbar-${i}`}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={(e) => {
                setHoveredIndex(i);
                const rect = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget.closest('svg')?.getBoundingClientRect();
                const relativeX = (rect.left + barWidth) - (parent?.left || 0);
                const relativeY = (rect.top + barHeight / 2) - (parent?.top || 0);
                setTooltip({
                  label: d.label,
                  count: d.count,
                  percent: d.percent,
                  color: d.color || '#5B50E5',
                  rank,
                  total,
                  x: relativeX,
                  y: relativeY
                });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget.closest('svg')?.getBoundingClientRect();
                const relativeX = (rect.left + barWidth) - (parent?.left || 0);
                const relativeY = (rect.top + barHeight / 2) - (parent?.top || 0);
                setTooltip({
                  label: d.label,
                  count: d.count,
                  percent: d.percent,
                  color: d.color || '#5B50E5',
                  rank,
                  total,
                  x: relativeX,
                  y: relativeY
                });
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setTooltip(null);
              }}
            >
              {/* Nhãn bên trái (Y-axis Label) */}
              <text
                x={-12}
                y={y + barHeight / 2 + 4}
                textAnchor="end"
                className={`text-[12px] font-lora transition-colors ${
                  isHovered ? 'fill-[#5B50E5] font-bold' : 'fill-[#2B2825]'
                }`}
                opacity={isDimmed ? 0.35 : 1}
              >
                {d.label.length > (width < 480 ? 16 : 28)
                  ? `${d.label.slice(0, width < 480 ? 14 : 26)}...`
                  : d.label}
              </text>

              {/* Thanh D3 chính (màu tím xanh sắc nét #5B50E5 như ảnh gốc) */}
              <rect
                x={0}
                y={y}
                width={Math.max(barWidth, 2)}
                height={barHeight}
                fill="#5B50E5"
                stroke={isHovered ? '#3730A3' : 'none'}
                strokeWidth={isHovered ? 1.5 : 0}
                opacity={isDimmed ? 0.35 : 1}
                className="transition-all duration-200"
              />

              {/* Giá trị phần trăm bên phải thanh (định dạng 36,3% với dấu phẩy như ảnh) */}
              <text
                x={barWidth + 8}
                y={y + barHeight / 2 + 4}
                textAnchor="start"
                className={`font-sans font-medium text-xs transition-colors ${
                  isHovered ? 'fill-[#5B50E5] font-bold' : 'fill-[#2B2825]'
                }`}
                opacity={isDimmed ? 0.35 : 1}
              >
                {formatVietnamesePercent(d.percent)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: BIỂU ĐỒ TRÒN DONUT D3 (DONUT SLICE CHART)
// ----------------------------------------------------
function D3DonutSliceChart({
  data,
  total,
  width,
  hoveredIndex,
  setHoveredIndex,
  setTooltip,
  getRank,
  chartId
}: D3SubChartProps) {
  const height = 300;
  const radius = Math.min(width, height) / 2 - 25;
  const innerRadius = radius * 0.58;

  // D3 Pie Generator
  const pieGenerator = useMemo(() => {
    return d3.pie<SurveyQuestionOption>()
      .value(d => d.count)
      .sort(null)
      .padAngle(0.03);
  }, []);

  const pieArcs = useMemo(() => {
    return pieGenerator(data);
  }, [pieGenerator, data]);

  // D3 Arc Generator
  const arcGenerator = useMemo(() => {
    return d3.arc<d3.PieArcDatum<SurveyQuestionOption>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(6);
  }, [innerRadius, radius]);

  const hoveredArcGenerator = useMemo(() => {
    return d3.arc<d3.PieArcDatum<SurveyQuestionOption>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 8)
      .cornerRadius(8);
  }, [innerRadius, radius]);

  const activeHoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={width}
        height={height}
        className="overflow-visible font-sans"
        aria-label="Biểu đồ tròn Donut tương tác D3"
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {pieArcs.map((arcDatum, i) => {
            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && !isHovered;
            const d = arcDatum.data;
            const rank = getRank(d.label);
            const pathData = (isHovered ? hoveredArcGenerator(arcDatum) : arcGenerator(arcDatum)) || '';

            return (
              <path
                key={`arc-${i}`}
                d={pathData}
                fill={d.color || '#B56D4F'}
                stroke="#FAF7F0"
                strokeWidth={2}
                opacity={isDimmed ? 0.35 : 1}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => {
                  setHoveredIndex(i);
                  const parent = e.currentTarget.closest('svg')?.getBoundingClientRect();
                  const [centroidX, centroidY] = arcGenerator.centroid(arcDatum);
                  const relativeX = width / 2 + centroidX;
                  const relativeY = height / 2 + centroidY;
                  setTooltip({
                    label: d.label,
                    count: d.count,
                    percent: d.percent,
                    color: d.color || '#B56D4F',
                    rank,
                    total,
                    x: relativeX,
                    y: relativeY
                  });
                }}
                onMouseMove={(e) => {
                  const [centroidX, centroidY] = arcGenerator.centroid(arcDatum);
                  const relativeX = width / 2 + centroidX;
                  const relativeY = height / 2 + centroidY;
                  setTooltip({
                    label: d.label,
                    count: d.count,
                    percent: d.percent,
                    color: d.color || '#B56D4F',
                    rank,
                    total,
                    x: relativeX,
                    y: relativeY
                  });
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltip(null);
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* TÂM DONUT HIỂN THỊ THÔNG SỐ TỔNG HOẶC MỤC HOVER */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        {activeHoveredItem ? (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-2xl font-black font-sans text-[#B56D4F]">
              {activeHoveredItem.percent}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A3530] font-sans">
              {activeHoveredItem.count} phiếu
            </span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-playfair text-[#3A3530]">
              {total}
            </span>
            <span className="text-[10px] text-[#6B635A] uppercase tracking-wider font-sans">
              Tổng phiếu
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

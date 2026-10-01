import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface PieChartItem {
  label: string;
  count: number;
  color: string;
  isUserChoice?: boolean;
}

interface SvgDonutPieChartProps {
  title: string;
  subtitle?: string;
  items: PieChartItem[];
  total: number;
}

export default function SvgDonutPieChart({
  items,
  total,
}: SvgDonutPieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // If no data
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-[#6B635A]">
        <div className="w-24 h-24 rounded-full border-3 border-dashed border-[#D6CDBF] flex items-center justify-center mb-2">
          <span className="text-xs font-mono">0%</span>
        </div>
        <span className="text-xs italic">Chưa có lượt bình chọn nào</span>
      </div>
    );
  }

  // Calculate SVG arc paths
  const radius = 54;
  const strokeWidth = 22;
  const center = 70;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 py-2">
      {/* SVG Donut Circle */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          {/* Base empty ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#EBE5D9"
            strokeWidth={strokeWidth}
          />

          {items.map((item, idx) => {
            const pct = item.count / total;
            if (pct <= 0) return null;

            const strokeDasharray = `${pct * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle * circumference;
            cumulativeAngle += pct;

            const isHovered = hoveredIndex === idx;

            return (
              <motion.circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  filter: isHovered ? 'drop-shadow(0 0 6px rgba(0,0,0,0.35))' : 'none',
                }}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
          {hoveredIndex !== null && items[hoveredIndex] ? (
            <>
              <span className="text-sm font-bold text-[#3A3530] font-sans">
                {Math.round((items[hoveredIndex].count / total) * 100)}%
              </span>
              <span className="text-[10px] text-[#6B635A] max-w-[65px] truncate font-lora">
                {items[hoveredIndex].label}
              </span>
            </>
          ) : (
            <>
              <span className="text-base font-bold font-playfair text-[#3A3530]">
                {total}
              </span>
              <span className="text-[10px] text-[#6B635A] uppercase tracking-wider font-sans">
                Bình chọn
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Column with clear spacing & wrap protection */}
      <div className="space-y-1.5 flex-1 w-full max-w-sm text-xs font-lora">
        {items.map((item, idx) => {
          const pct = Math.round((item.count / total) * 100);
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-all ${
                isHovered ? 'bg-white shadow-xs' : 'hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-2 truncate mr-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className={`truncate ${item.isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                  {item.label}
                  {item.isUserChoice && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.2 bg-[#B56D4F] text-white rounded-xs font-sans font-bold">
                      Bạn chọn
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 font-sans text-right">
                <span className="font-bold text-[#3A3530]">{pct}%</span>
                <span className="text-[10px] text-[#6B635A]">({item.count})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface RechartsPieItem {
  name: string;
  value: number;
  color: string;
  isUserChoice?: boolean;
}

interface RechartsCircularChartProps {
  title: string;
  data: RechartsPieItem[];
  total: number;
}

// Custom Tooltip with styled vintage design
const CustomTooltip = ({ active, payload, total }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as RechartsPieItem;
    const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;

    return (
      <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#D6CDBF] shadow-lg text-xs font-lora">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <strong className="text-[#3A3530] font-sans">{item.name}</strong>
          {item.isUserChoice && (
            <span className="px-1.5 py-0.2 bg-[#B56D4F] text-white text-[9px] rounded font-bold">
              Bạn chọn
            </span>
          )}
        </div>
        <div className="text-[#6B635A]">
          Số lượng: <span className="font-bold text-[#3A3530]">{item.value} người</span> ({pct}%)
        </div>
      </div>
    );
  }
  return null;
};

// Custom Legend renderer with clear percentages and "Bạn chọn" indicator
const renderCustomLegend = (props: any, total: number) => {
  const { payload } = props;
  if (!payload) return null;

  return (
    <ul className="flex flex-col gap-1.5 w-full text-xs font-lora mt-2">
      {payload.map((entry: any, index: number) => {
        const item = entry.payload as RechartsPieItem;
        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;

        return (
          <li
            key={`legend-item-${index}`}
            className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <div className="flex items-center gap-2 truncate mr-3">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: item.color }}
              />
              <span className={`truncate ${item.isUserChoice ? 'font-bold text-[#B56D4F]' : 'text-[#3A3530]'}`}>
                {item.name}
                {item.isUserChoice && (
                  <span className="ml-1.5 text-[9px] px-1.5 py-0.5 bg-[#B56D4F] text-white rounded font-sans font-bold">
                    Bạn chọn
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 font-sans text-right">
              <span className="font-bold text-[#3A3530]">{pct}%</span>
              <span className="text-[10px] text-[#6B635A]">({item.value})</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default function RechartsCircularChart({
  data,
  total,
}: RechartsCircularChartProps) {
  // If no responses at all
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[#6B635A]">
        <div className="w-24 h-24 rounded-full border-3 border-dashed border-[#D6CDBF] flex items-center justify-center mb-2">
          <span className="text-xs font-mono">0%</span>
        </div>
        <span className="text-xs italic font-lora">Chưa có lượt bình chọn nào</span>
      </div>
    );
  }

  // Filter non-zero items for clean Recharts arc drawing, but if all zero, display dummy ring
  const activeData = data.filter((d) => d.value > 0);
  const chartData = activeData.length > 0 ? activeData : [{ name: 'Chưa có', value: 1, color: '#EBE5D9' }];

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 py-2">
      {/* Recharts Pie Chart in ResponsiveContainer with fixed height */}
      <div className="w-full md:w-56 h-56 shrink-0 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={74}
              paddingAngle={activeData.length > 1 ? 3 : 0}
              dataKey="value"
              animationDuration={800}
              animationEasing="ease-out"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                if (midAngle === undefined || percent === undefined) return null;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return percent > 0.1 ? (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[10px] font-bold font-sans pointer-events-none"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                ) : null;
              }}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#FAF7F0"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center count in Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-lg font-bold font-playfair text-[#3A3530]">
            {total}
          </span>
          <span className="text-[10px] text-[#6B635A] uppercase tracking-wider font-sans">
            Bình chọn
          </span>
        </div>
      </div>

      {/* Structured Legend with Percentages */}
      <div className="w-full md:flex-1 max-w-sm">
        {renderCustomLegend({ payload: data.map((d) => ({ payload: d })) }, total)}
      </div>
    </div>
  );
}

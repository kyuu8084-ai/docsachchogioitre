import { BookOpen } from 'lucide-react';

interface VintageSeparatorProps {
  color?: string;
  width?: string;
  className?: string;
  withIcon?: boolean;
}

export default function VintageSeparator({
  color = '#B56D4F',
  width = 'w-28',
  className = '',
  withIcon = true,
}: VintageSeparatorProps) {
  return (
    <div className={`flex items-center justify-center gap-3 my-4 ${className}`}>
      <span
        className={`h-[1.5px] ${width} transition-all`}
        style={{ backgroundColor: color, opacity: 0.7 }}
      />
      {withIcon && (
        <span className="shrink-0 transition-transform hover:scale-110" style={{ color }}>
          <BookOpen size={16} strokeWidth={1.75} />
        </span>
      )}
      <span
        className={`h-[1.5px] ${width} transition-all`}
        style={{ backgroundColor: color, opacity: 0.7 }}
      />
    </div>
  );
}

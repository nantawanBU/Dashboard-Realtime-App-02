import React, { useState } from 'react';

interface CircularGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  colors: [string, string];
  label?: string;
  subLabel?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  maxScore = 5,
  size = 110,
  strokeWidth = 10,
  gradientId,
  colors,
  label,
  subLabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(maxScore, score));
  const percent = maxScore > 0 ? safeScore / maxScore : 0;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
            <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={colors[0]} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={strokeWidth}
          />

          {/* Active progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={`url(#glow-${gradientId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center text display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-none">
            {score.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            / {maxScore.toFixed(1)}
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200 text-center">
          {label}
        </span>
      )}
      {subLabel && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
          {subLabel}
        </span>
      )}
    </div>
  );
};

interface SliceData {
  score: number;
  label: string;
  count: number;
  color: string;
  gradientColors: [string, string];
  emoji: string;
}

interface DonutDistributionChartProps {
  slices: SliceData[];
  totalCount: number;
  overallAverage: number;
}

export const DonutDistributionChart: React.FC<DonutDistributionChartProps> = ({
  slices,
  totalCount,
  overallAverage,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 260;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate angles and offsets for each slice
  let accumulatedPercent = 0;

  const totalSlicesCount = slices.reduce((sum, s) => sum + s.count, 0);

  const sliceSegments = slices.map((slice, index) => {
    const fraction = totalSlicesCount > 0 ? slice.count / totalSlicesCount : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += fraction;

    const percent = Math.round(fraction * 100);

    return {
      ...slice,
      index,
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSlice = hoveredIndex !== null ? sliceSegments[hoveredIndex] : null;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-around gap-6">
      {/* SVG Donut */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            {slices.map((slice) => (
              <linearGradient
                key={slice.score}
                id={`slice-grad-${slice.score}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={slice.gradientColors[0]} />
                <stop offset="100%" stopColor={slice.gradientColors[1]} />
              </linearGradient>
            ))}
          </defs>

          {/* Empty state gray ring if no responses */}
          {totalCount === 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeWidth={strokeWidth}
            />
          )}

          {/* Donut Segments */}
          {totalCount > 0 &&
            sliceSegments.map((segment) => {
              if (segment.count === 0) return null;
              const isHovered = hoveredIndex === segment.index;

              return (
                <circle
                  key={segment.score}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={`url(#slice-grad-${segment.score})`}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(segment.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
        </svg>

        {/* Center Content Inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
          {activeSlice ? (
            <>
              <span className="text-2xl">{activeSlice.emoji}</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                {activeSlice.count} คน ({activeSlice.percent}%)
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                ระดับ {activeSlice.label} ({activeSlice.score} ดาว)
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                คะแนนเฉลี่ยรวม
              </span>
              <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {totalCount > 0 ? overallAverage.toFixed(2) : '0.00'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className={overallAverage >= 4.5 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}>
                  ★
                </span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">
                จากผู้ตอบ {totalCount} คน
              </span>
            </>
          )}
        </div>
      </div>

      {/* Slices Legend List with vibrant badges */}
      <div className="flex-1 w-full max-w-sm space-y-2">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          สัดส่วนการให้คะแนน (5 ระดับ)
        </div>
        {sliceSegments.map((segment) => {
          const isHovered = hoveredIndex === segment.index;
          return (
            <div
              key={segment.score}
              onMouseEnter={() => setHoveredIndex(segment.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-300 dark:border-slate-600 shadow-md scale-102'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{segment.emoji}</span>
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${segment.gradientColors[0]}, ${segment.gradientColors[1]})`,
                  }}
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {segment.score} ดาว ({segment.label})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {segment.count} คน
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 tabular-nums">
                  {segment.percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

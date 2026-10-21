import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricDelta } from '../types';

interface MetricCardProps {
  label: string;
  metric: MetricDelta;
  prefix?: string;
  suffix?: string;
  target?: number;
  targetLabel?: string;
  trendData?: number[];
  tooltip?: string;
  inversePositive?: boolean; // e.g. lower CPL is positive
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  metric,
  prefix = '',
  suffix = '',
  target,
  targetLabel,
  trendData = [],
  tooltip,
  inversePositive = false,
}) => {
  const isPositive = inversePositive ? metric.deltaPercent <= 0 : metric.deltaPercent >= 0;
  const formattedValue = typeof metric.value === 'number'
    ? (metric.value >= 1000 ? metric.value.toLocaleString('en-US') : metric.value)
    : metric.value;

  // Mini sparkline math
  const sparkPoints = trendData.length > 0 ? trendData : [20, 24, 22, 28, 30, 35, 33, 40, 42, 48];
  const minVal = Math.min(...sparkPoints);
  const maxVal = Math.max(...sparkPoints);
  const range = maxVal - minVal || 1;
  const svgWidth = 84;
  const svgHeight = 28;
  const polylineCoords = sparkPoints
    .map((val, idx) => {
      const x = (idx / (sparkPoints.length - 1)) * svgWidth;
      const y = svgHeight - ((val - minVal) / range) * (svgHeight - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const progressPercent = target ? Math.min(100, Math.round((metric.value / target) * 100)) : null;

  return (
    <div className="relative rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 transition-all hover:border-slate-700/80 hover:bg-slate-900/90 shadow-sm group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
            {label}
          </span>
          {tooltip && (
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{tooltip}</p>
          )}
        </div>

        {/* Mini sparkline */}
        <div className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg width={svgWidth} height={svgHeight} className="overflow-visible">
            <polyline
              fill="none"
              stroke={isPositive ? '#10B981' : '#F43F5E'}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineCoords}
            />
          </svg>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-lg font-semibold text-slate-400">{prefix}</span>}
          <span className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            {formattedValue}
          </span>
          {suffix && <span className="text-sm font-medium text-slate-400">{suffix}</span>}
        </div>

        {/* Delta indicator */}
        <div
          className={`flex items-center gap-0.5 text-xs font-medium tabular-nums ${
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{Math.abs(metric.deltaPercent).toFixed(1)}%</span>
        </div>
      </div>

      {/* Delta contextual narrative (no pills) */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2.5">
        <span className="truncate">
          {metric.deltaValueFormatted ? metric.deltaValueFormatted : `${metric.deltaPercent >= 0 ? '+' : ''}${metric.deltaPercent}%`} vs prior
        </span>
        {metric.previousValueFormatted && (
          <span className="font-mono text-slate-500 shrink-0">
            Prev: {metric.previousValueFormatted}
          </span>
        )}
      </div>

      {/* Target Progress Bar if target configured */}
      {target && progressPercent !== null && (
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>{targetLabel || 'Target'}: {target}</span>
            <span className="font-mono text-slate-300 font-medium">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { ChartDataPoint } from '../types';

interface InteractiveChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
}

type MetricMode = 'traffic' | 'channels' | 'leads' | 'revenue';

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  title = 'Traffic & Acquisition Velocity',
  subtitle = 'Daily volume and multi-channel attribution trendline',
}) => {
  const [mode, setMode] = useState<MetricMode>('traffic');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG coordinate dimensions
  const width = 860;
  const height = 260;
  const padding = { top: 20, right: 24, bottom: 32, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max calculations
  const { maxValue, seriesList } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 100, seriesList: [] };
    }

    if (mode === 'traffic') {
      const max = Math.max(...data.map((d) => d.total));
      return {
        maxValue: Math.ceil(max * 1.15) || 100,
        seriesList: [
          { key: 'total', label: 'Total Sessions', color: '#6366F1', strokeWidth: 2.5 },
        ],
      };
    }

    if (mode === 'channels') {
      const max = Math.max(...data.map((d) => Math.max(d.organic, d.paid, d.direct)));
      return {
        maxValue: Math.ceil(max * 1.2) || 100,
        seriesList: [
          { key: 'organic', label: 'Organic Search', color: '#10B981', strokeWidth: 2 },
          { key: 'paid', label: 'Paid Media', color: '#3B82F6', strokeWidth: 2 },
          { key: 'direct', label: 'Direct / GBP', color: '#F59E0B', strokeWidth: 1.75 },
        ],
      };
    }

    if (mode === 'leads') {
      const max = Math.max(...data.map((d) => d.leads));
      return {
        maxValue: Math.ceil(max * 1.25) || 10,
        seriesList: [
          { key: 'leads', label: 'Inbound Leads', color: '#EC4899', strokeWidth: 2.5 },
        ],
      };
    }

    // revenue
    const max = Math.max(...data.map((d) => d.revenue));
    return {
      maxValue: Math.ceil(max * 1.15) || 1000,
      seriesList: [
        { key: 'revenue', label: 'Attributed Revenue ($)', color: '#10B981', strokeWidth: 2.5 },
        { key: 'cost', label: 'Ad Spend ($)', color: '#94A3B8', strokeWidth: 1.75 },
      ],
    };
  }, [data, mode]);

  // Generate SVG polyline path string
  const getCoordinates = (key: string) => {
    if (!data || data.length === 0) return '';
    return data
      .map((d, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const val = (d as any)[key] || 0;
        const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Generate Area polygon
  const getAreaPath = (key: string) => {
    if (!data || data.length === 0) return '';
    const points = data.map((d, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const val = (d as any)[key] || 0;
      const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const firstX = padding.left;
    const lastX = padding.left + chartWidth;
    const bottomY = padding.top + chartHeight;
    return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
  };

  // Active hover point data
  const activeItem = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Mode Segmented Controls (functional buttons with click handlers) */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/50 self-start sm:self-auto">
          <button
            onClick={() => setMode('traffic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'traffic'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Traffic
          </button>
          <button
            onClick={() => setMode('channels')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'channels'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Channels
          </button>
          <button
            onClick={() => setMode('leads')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'leads'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inbound Leads
          </button>
          <button
            onClick={() => setMode('revenue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'revenue'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ROAS / Revenue
          </button>
        </div>
      </div>

      {/* Series Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs mb-4">
        {seriesList.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-slate-300">
            <span
              className="w-2.5 h-2.5 rounded-xs"
              style={{ backgroundColor: s.color }}
            />
            <span className="font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradientPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="areaGradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="areaGradientPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines & Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + chartHeight * (1 - pct);
            const val = Math.round(maxValue * pct);
            const labelStr =
              mode === 'revenue'
                ? `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`
                : val >= 1000
                ? (val / 1000).toFixed(1) + 'k'
                : val.toString();
            return (
              <g key={pct}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeOpacity="0.6"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="font-mono text-[10px] fill-slate-500 tabular-nums"
                >
                  {labelStr}
                </text>
              </g>
            );
          })}

          {/* Render Area fills */}
          {mode === 'traffic' && (
            <path d={getAreaPath('total')} fill="url(#areaGradientPrimary)" />
          )}
          {mode === 'leads' && (
            <path d={getAreaPath('leads')} fill="url(#areaGradientPink)" />
          )}
          {mode === 'revenue' && (
            <path d={getAreaPath('revenue')} fill="url(#areaGradientGreen)" />
          )}

          {/* Render Polyline strokes for each series */}
          {seriesList.map((s) => (
            <polyline
              key={s.key}
              fill="none"
              stroke={s.color}
              strokeWidth={s.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={getCoordinates(s.key)}
            />
          ))}

          {/* X Axis Date labels (spaced intervals) */}
          {data.map((d, index) => {
            // Show every ~5th label
            const interval = Math.ceil(data.length / 6);
            if (index % interval !== 0 && index !== data.length - 1) return null;
            const x = padding.left + (index / (data.length - 1)) * chartWidth;
            return (
              <text
                key={index}
                x={x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className="font-mono text-[10px] fill-slate-400 tabular-nums"
              >
                {d.label}
              </text>
            );
          })}

          {/* Interactive vertical hover line */}
          {hoverIndex !== null && (
            <line
              x1={padding.left + (hoverIndex / (data.length - 1)) * chartWidth}
              y1={padding.top}
              x2={padding.left + (hoverIndex / (data.length - 1)) * chartWidth}
              y2={padding.top + chartHeight}
              stroke="#818CF8"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {/* Invisible interactive columns for smooth hover detection */}
          {data.map((_, index) => {
            const colWidth = chartWidth / data.length;
            const x = padding.left + index * colWidth - colWidth / 2;
            return (
              <rect
                key={index}
                x={x}
                y={padding.top}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(index)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {activeItem && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border border-slate-700 bg-slate-950/95 p-3 shadow-xl backdrop-blur-sm text-xs"
            style={{
              left: `${Math.min(
                80,
                Math.max(
                  15,
                  ((padding.left + (hoverIndex / (data.length - 1)) * chartWidth) / width) * 100
                )
              )}%`,
              top: '12px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-white border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between gap-4">
              <span>{activeItem.date}</span>
              <span className="font-mono text-[11px] text-indigo-400 tabular-nums">
                {activeItem.total} Sessions
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px] tabular-nums">
              <div className="flex items-center justify-between gap-4 text-emerald-400">
                <span className="text-slate-400 font-sans">Organic Search:</span>
                <span>{activeItem.organic}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-blue-400">
                <span className="text-slate-400 font-sans">Paid Media:</span>
                <span>{activeItem.paid}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-amber-400">
                <span className="text-slate-400 font-sans">Direct / GBP:</span>
                <span>{activeItem.direct}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-pink-400 border-t border-slate-800/80 pt-1 mt-1">
                <span className="text-slate-300 font-sans">Leads Generated:</span>
                <span className="font-bold">{activeItem.leads}</span>
              </div>
              {mode === 'revenue' && (
                <div className="flex items-center justify-between gap-4 text-emerald-300 font-bold">
                  <span className="text-slate-300 font-sans">Attributed Rev:</span>
                  <span>${activeItem.revenue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

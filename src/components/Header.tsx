import React from 'react';
import { FileText, Eye, ShieldCheck, ChevronRight, Share2 } from 'lucide-react';
import { ClientProfile, TabId, TimeframeId, ViewMode } from '../types';

interface HeaderProps {
  currentClient: ClientProfile;
  currentTab: TabId;
  timeframe: TimeframeId;
  setTimeframe: (tf: TimeframeId) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenReportModal: () => void;
  tabLabels: Record<TabId, string>;
}

export const Header: React.FC<HeaderProps> = ({
  currentClient,
  currentTab,
  timeframe,
  setTimeframe,
  viewMode,
  setViewMode,
  onOpenReportModal,
  tabLabels,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur-md">
      {/* Zone 1: Breadcrumb trail */}
      <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
        <span className="text-slate-500 whitespace-nowrap shrink-0">Clients</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="font-medium text-slate-300 truncate max-w-[160px] sm:max-w-xs">
          {currentClient.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="font-semibold text-white whitespace-nowrap shrink-0">
          {tabLabels[currentTab]}
        </span>
      </div>

      {/* Zone 2: Timeframe selector & View Mode switch */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Timeframe segmented buttons */}
        <div className="flex items-center gap-0.5 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
          {(
            [
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'last_quarter', label: 'Last Quarter' },
            ] as const
          ).map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                timeframe === tf.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* View mode toggle (Agency vs Client Portal) */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => setViewMode('client')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'client'
                ? 'bg-emerald-600/90 text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Preview dashboard as seen by your client (simplified, agency metrics hidden)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Client View</span>
          </button>
          <button
            onClick={() => setViewMode('agency')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'agency'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Agency Admin mode with retainer margins, internal notes, and technical drill-downs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Agency Admin</span>
          </button>
        </div>
      </div>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-indigo-600/20 active:scale-98"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Executive Report</span>
        </button>
      </div>
    </header>
  );
};

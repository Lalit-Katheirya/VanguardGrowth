import React from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Search,
  Megaphone,
  Award,
} from 'lucide-react';
import { ClientDataBundle, TimeframeId } from '../../types';

interface ClientReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: ClientDataBundle;
  timeframe: TimeframeId;
}

export const ClientReportModal: React.FC<ClientReportModalProps> = ({
  isOpen,
  onClose,
  bundle,
  timeframe,
}) => {
  if (!isOpen) return null;

  const { profile, brief, keywords, paidCampaigns } = bundle;
  const metrics = bundle.metrics[timeframe] || bundle.metrics['30d'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-10 my-8 overflow-hidden">
        {/* Action Bar (Top) */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Executive Presentation View
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-400 font-mono">Ready for Client Review</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 md:p-12 space-y-10 bg-slate-900 text-slate-100 print:bg-white print:text-slate-900 print:p-6">
          {/* Document Header Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-800 print:border-slate-300 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 print:text-indigo-700 uppercase tracking-wider">
                <span>Vanguard Growth Agency</span>
                <span>·</span>
                <span>Monthly Client Performance Report</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-slate-900">
                {profile.name}
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Reporting Window: Last 30 Days Cycle · Generated on {brief.lastUpdated}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-slate-950/60 print:bg-slate-100 p-3 rounded-xl border border-slate-800 print:border-slate-300">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.contactName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white print:text-slate-900 block">{profile.contactName}</span>
                <span className="text-[11px] text-slate-400 print:text-slate-600 block">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
              01. Executive Overview & Strategist Brief
            </h2>
            <div className="rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50 p-6">
              <p className="text-sm text-slate-200 print:text-slate-800 leading-relaxed font-normal">
                {brief.executiveSummary}
              </p>
            </div>
          </div>

          {/* Section 2: Core KPI Performance Scorecard */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
              02. North Star KPI Performance Scorecard
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50">
                <span className="text-xs text-slate-400 print:text-slate-600">Total Leads Captured</span>
                <p className="font-mono text-2xl font-bold text-white print:text-slate-900 mt-1 tabular-nums">
                  {metrics.totalLeads.value}
                </p>
                <span className="text-xs text-emerald-400 print:text-emerald-700 font-medium">
                  {metrics.totalLeads.deltaValueFormatted} ({metrics.totalLeads.deltaPercent}%)
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50">
                <span className="text-xs text-slate-400 print:text-slate-600">Blended Cost per Lead</span>
                <p className="font-mono text-2xl font-bold text-white print:text-slate-900 mt-1 tabular-nums">
                  ${metrics.blendedCpl.value.toFixed(2)}
                </p>
                <span className="text-xs text-emerald-400 print:text-emerald-700 font-medium">
                  {metrics.blendedCpl.deltaValueFormatted} ({metrics.blendedCpl.deltaPercent}%)
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50">
                <span className="text-xs text-slate-400 print:text-slate-600">Attributed Client Revenue</span>
                <p className="font-mono text-2xl font-bold text-emerald-400 print:text-emerald-700 mt-1 tabular-nums">
                  ${metrics.attributedRevenue.value.toLocaleString()}
                </p>
                <span className="text-xs text-emerald-400 print:text-emerald-700 font-medium">
                  {metrics.attributedRevenue.deltaValueFormatted}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50">
                <span className="text-xs text-slate-400 print:text-slate-600">Blended Marketing ROAS</span>
                <p className="font-mono text-2xl font-bold text-white print:text-slate-900 mt-1 tabular-nums">
                  {metrics.blendedRoas.value}x
                </p>
                <span className="text-xs text-emerald-400 print:text-emerald-700 font-medium">
                  Target: {profile.targetBlendedRoas}x (Surpassed)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Wins & Key Milestones */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
              03. Top Wins & Campaign Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brief.topWins.map((win, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/30 print:bg-slate-50 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-slate-200 print:text-slate-800 leading-snug">{win}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Priority Next Steps */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
              04. Strategic Growth Roadmap for Next 30 Days
            </h2>
            <div className="rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50 p-5 space-y-3">
              {brief.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-300 print:text-slate-800">
                  <span className="font-mono text-indigo-400 font-bold shrink-0">0{idx + 1}.</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="pt-8 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400 print:text-slate-600">
            <div>
              <p className="font-semibold text-white print:text-slate-900">{brief.strategistName}</p>
              <p className="text-[11px]">Vanguard Growth Agency · Confidential Client Performance Record</p>
            </div>
            <div className="font-mono text-[11px]">
              Approved & Distributed: {brief.lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

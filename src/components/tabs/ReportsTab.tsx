import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Send,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Settings,
} from 'lucide-react';
import { ClientDataBundle, TimeframeId } from '../../types';

interface ReportsTabProps {
  bundle: ClientDataBundle;
  timeframe: TimeframeId;
  onOpenReportModal: () => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  bundle,
  timeframe,
  onOpenReportModal,
}) => {
  const { profile, brief } = bundle;
  const [scheduleCadence, setScheduleCadence] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly');
  const [recipientEmail, setRecipientEmail] = useState(profile.contactEmail);
  const [whiteLabelDomain, setWhiteLabelDomain] = useState(`reports.${profile.domain}`);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const pastReports = [
    {
      id: 'rep-oct-26',
      title: 'October 2026 Executive Performance Digest',
      period: 'Oct 1 - Oct 21, 2026',
      leads: bundle.metrics['30d'].totalLeads.value,
      roas: bundle.metrics['30d'].blendedRoas.value,
      status: 'Ready / Sent',
      date: 'Oct 21, 2026',
    },
    {
      id: 'rep-sep-26',
      title: 'September 2026 Full Monthly Growth Review',
      period: 'Sep 1 - Sep 30, 2026',
      leads: bundle.metrics['last_month'].totalLeads.value,
      roas: bundle.metrics['last_month'].blendedRoas.value,
      status: 'Archived',
      date: 'Oct 1, 2026',
    },
    {
      id: 'rep-q3-26',
      title: 'Q3 2026 Executive Strategy Presentation',
      period: 'Jul 1 - Sep 30, 2026',
      leads: bundle.metrics['last_quarter'].totalLeads.value,
      roas: bundle.metrics['last_quarter'].blendedRoas.value,
      status: 'Archived',
      date: 'Oct 3, 2026',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Automated Client Reporting Engine</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Client Presentations & Scheduled Digests
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Generate print-ready executive summaries, customize white-labeled reporting portals, and manage automated monthly performance digests delivered straight to your client&apos;s leadership team.
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap self-start md:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>Generate & Preview Full Report</span>
          </button>
        </div>
      </div>

      {/* Grid: Automated Schedule Config & Past Reports Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Past Reports List (2 Columns on lg) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Client Performance Archives
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Past executive digests and presentations for {profile.name}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pastReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-white text-xs">{report.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{report.period}</span>
                    <span>·</span>
                    <span><strong className="text-white font-mono">{report.leads}</strong> Leads</span>
                    <span>·</span>
                    <span><strong className="text-emerald-400 font-mono">{report.roas}x</strong> ROAS</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={onOpenReportModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                  >
                    <span>View Report</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* White-Label & Automated Delivery Settings (1 Column on lg) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>White-Label Delivery Rules</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Configure automated report dispatches and custom client subdomains.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Scheduled Dispatch Frequency
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700">
                {(['monthly', 'biweekly', 'weekly'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setScheduleCadence(c)}
                    className={`py-1 text-center font-medium capitalize rounded-md transition-colors ${
                      scheduleCadence === c ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                White-Label Portal Host
              </label>
              <input
                type="text"
                value={whiteLabelDomain}
                onChange={(e) => setWhiteLabelDomain(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg font-medium transition-colors border border-slate-700"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Dispatch Rules</span>
            </button>

            {saveSuccess && (
              <p className="text-[11px] text-emerald-400 text-center font-medium">
                Settings updated successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

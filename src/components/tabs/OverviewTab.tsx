import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  MapPin,
  Megaphone,
} from 'lucide-react';
import { ClientDataBundle, TabId, TimeframeId, ViewMode } from '../../types';
import { MetricCard } from '../MetricCard';
import { InteractiveChart } from '../InteractiveChart';

interface OverviewTabProps {
  bundle: ClientDataBundle;
  timeframe: TimeframeId;
  viewMode: ViewMode;
  onNavigateTab: (tab: TabId) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  bundle,
  timeframe,
  viewMode,
  onNavigateTab,
}) => {
  const currentMetrics = bundle.metrics[timeframe] || bundle.metrics['30d'];
  const chartData = bundle.chartHistory[timeframe] || bundle.chartHistory['30d'];
  const { profile, brief, leads } = bundle;

  // Channel traffic breakdown percentages
  const totalTraffic = currentMetrics.organicSessions.value * 1.85;
  const organicPercent = Math.round((currentMetrics.organicSessions.value / totalTraffic) * 100);
  const paidPercent = 32;
  const gbpPercent = 14;
  const directPercent = 100 - organicPercent - paidPercent - gbpPercent;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Executive Summary & Strategist Brief Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 md:p-7 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Executive Performance Brief</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">{brief.lastUpdated}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {profile.name} Growth Overview
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {brief.executiveSummary}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2 bg-slate-900/80 border border-slate-800 rounded-xl p-4 self-start md:min-w-[240px]">
            <span className="text-[11px] text-slate-400 font-medium">Growth Strategist</span>
            <span className="text-xs font-bold text-white">{brief.strategistName}</span>
            <span className="text-[11px] text-slate-400">Target Monthly Leads: <strong className="text-white font-mono">{profile.targetMonthlyLeads}</strong></span>
            <span className="text-[11px] text-slate-400">Target Blended ROAS: <strong className="text-emerald-400 font-mono">{profile.targetBlendedRoas}x</strong></span>
          </div>
        </div>

        {/* Top 3 Wins Pill-Free Editorial List */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {brief.topWins.slice(0, 4).map((win, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{win}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid (North Star Performance Indicators) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            North Star Conversion & Revenue Indicators
          </h2>
          <span className="text-[11px] text-slate-400">
            Selected Period vs Preceding Cycle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Inbound Leads"
            metric={currentMetrics.totalLeads}
            target={profile.targetMonthlyLeads}
            targetLabel="Goal"
            tooltip="Verified form submissions, call tracking calls, & bookings"
          />
          <MetricCard
            label="Blended Cost per Lead (CPL)"
            metric={currentMetrics.blendedCpl}
            prefix="$"
            inversePositive={true}
            tooltip="Total ad investment divided by total qualified leads"
          />
          <MetricCard
            label="Attributed Client Revenue"
            metric={currentMetrics.attributedRevenue}
            prefix="$"
            tooltip="Closed revenue directly mapped to inbound marketing channels"
          />
          <MetricCard
            label="Blended Marketing ROAS"
            metric={currentMetrics.blendedRoas}
            suffix="x"
            tooltip="Total revenue returned per $1 of paid media expenditure"
          />
        </div>
      </div>

      {/* Secondary KPI Grid (Channel Performance Foundation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Paid Ad Spend"
          metric={currentMetrics.totalAdSpend}
          prefix="$"
          tooltip="Combined Google Ads and Meta Ads media deployment"
        />
        <MetricCard
          label="Organic Traffic Sessions"
          metric={currentMetrics.organicSessions}
          tooltip="Google Search clicks & direct organic search visits"
        />
        <MetricCard
          label="Google Business Profile Actions"
          metric={currentMetrics.gbpCustomerActions}
          tooltip="Customer calls, direction routes, & Google Maps clicks"
        />
        <MetricCard
          label="Average Keyword Position"
          metric={currentMetrics.avgPosition}
          suffix="pos"
          inversePositive={true}
          tooltip="Weighted average SERP rank across tracked search terms"
        />
      </div>

      {/* Interactive Main Chart */}
      <InteractiveChart
        data={chartData}
        title="Acquisition Velocity & Channel Growth"
        subtitle="Track multi-channel session growth, daily inbound lead generation, and revenue return"
      />

      {/* Channel Attribution Matrix & Inbound Pipeline Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Share Breakdown (2 Cols on lg) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Channel Attribution Breakdown
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Relative performance and conversion efficiency across acquisition channels
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>View Full Attribution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Channel Row: Organic Search */}
            <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Organic Search (Google / Bing)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">
                    <strong className="text-white font-mono">{currentMetrics.organicSessions.value.toLocaleString()}</strong> sessions
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">{organicPercent}% share</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${organicPercent}%` }} />
              </div>
            </div>

            {/* Channel Row: Paid Advertising */}
            <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">Paid Media (Google Ads + Meta)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">
                    <strong className="text-white font-mono">${currentMetrics.totalAdSpend.value.toLocaleString()}</strong> spend
                  </span>
                  <span className="font-mono text-blue-400 font-semibold">{paidPercent}% share</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${paidPercent}%` }} />
              </div>
            </div>

            {/* Channel Row: Google Business Profile & Local */}
            <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">Google Maps & Business Profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">
                    <strong className="text-white font-mono">{currentMetrics.gbpCustomerActions.value}</strong> high-intent actions
                  </span>
                  <span className="font-mono text-amber-400 font-semibold">{gbpPercent}% share</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${gbpPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Live Inbound Leads Feed (1 Col on lg) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">Recent Inbound Leads</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time incoming customer inquiries</p>
              </div>
              <button
                onClick={() => onNavigateTab('leads')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-lg border border-slate-800/60 bg-slate-950/40 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{lead.name}</span>
                    <span className="font-mono text-[11px] text-slate-400">{lead.timestamp}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mb-2 truncate">
                    {lead.serviceInterest}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-850">
                    <span className="text-indigo-400 font-medium">{lead.channel}</span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                      ${lead.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Pipeline Conversion Rate</span>
            <span className="font-mono font-bold text-white tabular-nums">28.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

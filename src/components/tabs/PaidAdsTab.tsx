import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  TrendingUp,
  DollarSign,
  Target,
  MousePointerClick,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ClientDataBundle, PaidCampaign, TimeframeId } from '../../types';
import { MetricCard } from '../MetricCard';

interface PaidAdsTabProps {
  bundle: ClientDataBundle;
  timeframe: TimeframeId;
}

export const PaidAdsTab: React.FC<PaidAdsTabProps> = ({ bundle, timeframe }) => {
  const currentMetrics = bundle.metrics[timeframe] || bundle.metrics['30d'];
  const { paidCampaigns, profile } = bundle;

  const [platformFilter, setPlatformFilter] = useState<'all' | 'google' | 'meta' | 'linkedin'>('all');
  const [sortBy, setSortBy] = useState<'spend' | 'conversions' | 'cpa' | 'roas'>('spend');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered & sorted campaigns
  const filteredCampaigns = useMemo(() => {
    return paidCampaigns
      .filter((camp) => platformFilter === 'all' || camp.platform === platformFilter)
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [paidCampaigns, platformFilter, sortBy, sortOrder]);

  const handleSort = (field: 'spend' | 'conversions' | 'cpa' | 'roas') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'cpa' ? 'asc' : 'desc');
    }
  };

  const totalImpressions = paidCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = paidCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const blendedCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const totalConversions = paidCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalSpend = currentMetrics.totalAdSpend.value;
  const blendedCpc = totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : '0';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Paid Ads Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Paid Media Spend"
          metric={currentMetrics.totalAdSpend}
          prefix="$"
          tooltip="Combined Google Ads & Meta advertising spend"
        />
        <MetricCard
          label="Blended Paid ROAS"
          metric={currentMetrics.blendedRoas}
          suffix="x"
          target={profile.targetBlendedRoas}
          targetLabel="Target"
          tooltip="Total return on ad spend across all active campaigns"
        />
        <MetricCard
          label="Paid Conversions / Leads"
          metric={{
            value: totalConversions,
            deltaPercent: 21.6,
            isPositive: true,
            deltaValueFormatted: `+${Math.round(totalConversions * 0.22)} conv`,
          }}
          tooltip="Direct consultation submissions, calls, or sales attributed to ads"
        />
        <MetricCard
          label="Blended Cost per Conversion"
          metric={{
            value: Number((totalSpend / (totalConversions || 1)).toFixed(2)),
            deltaPercent: -11.4,
            isPositive: true,
            deltaValueFormatted: '-$4.20 vs prior',
          }}
          prefix="$"
          inversePositive={true}
          tooltip="Average cost paid per verified lead or purchase"
        />
      </div>

      {/* Network Split & Traffic Efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Click-Through Rate (CTR)</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">{blendedCtr}%</span>
            <span className="text-xs text-emerald-400 font-medium">+0.45% vs benchmark</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Total Impressions: <strong className="font-mono text-white">{totalImpressions.toLocaleString()}</strong>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Average Cost per Click (CPC)</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">${blendedCpc}</span>
            <span className="text-xs text-emerald-400 font-medium">-$0.18 vs benchmark</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Total Clicks: <strong className="font-mono text-white">{totalClicks.toLocaleString()}</strong>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Attributed Campaign Revenue</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
              ${currentMetrics.attributedRevenue.value.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Return Multiple: <strong className="font-mono text-white">{currentMetrics.blendedRoas.value}x ROAS</strong>
          </p>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-tight">Active Paid Media Campaigns</h2>
          </div>

          {/* Platform Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60 self-start sm:self-auto">
            {(['all', 'google', 'meta', 'linkedin'] as const).map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                  platformFilter === plat
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {plat === 'all' ? 'All Platforms' : plat === 'google' ? 'Google Ads' : plat === 'meta' ? 'Meta Ads' : 'LinkedIn'}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Campaign Name & Type</th>
                <th className="py-3 px-4">Platform</th>
                <th
                  onClick={() => handleSort('spend')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Spend</span>
                    {sortBy === 'spend' && <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th className="py-3 px-4">Clicks & CTR</th>
                <th
                  onClick={() => handleSort('conversions')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Conversions</span>
                    {sortBy === 'conversions' && <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cpa')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>CPA / Cost</span>
                    {sortBy === 'cpa' && <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('roas')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>ROAS</span>
                    {sortBy === 'roas' && <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <span className="font-semibold text-white block truncate">{camp.name}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Type: {camp.campaignType} · Status: <strong className="text-emerald-400 font-normal">Active</strong>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] uppercase text-slate-300">
                      {camp.platform}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-white tabular-nums">
                    ${camp.spend.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    <div>{camp.clicks.toLocaleString()} clicks</div>
                    <div className="text-[11px] text-slate-500">{camp.ctr}% CTR (${camp.cpc} CPC)</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                    {camp.conversions}
                  </td>

                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    ${camp.cpa.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                    {camp.roas.toFixed(1)}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

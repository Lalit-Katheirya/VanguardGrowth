import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ExternalLink,
  SlidersHorizontal,
  Download,
  Flame,
  Globe,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { ClientDataBundle, KeywordRanking, TimeframeId } from '../../types';
import { MetricCard } from '../MetricCard';

interface SeoTabProps {
  bundle: ClientDataBundle;
  timeframe: TimeframeId;
}

export const SeoTab: React.FC<SeoTabProps> = ({ bundle, timeframe }) => {
  const currentMetrics = bundle.metrics[timeframe] || bundle.metrics['30d'];
  const { keywords } = bundle;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'volume' | 'change' | 'clicks'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Distribution counts
  const rankBuckets = useMemo(() => {
    let top3 = 0;
    let top10 = 0;
    let top20 = 0;
    let striking = 0;

    keywords.forEach((kw) => {
      if (kw.currentRank <= 3) top3++;
      else if (kw.currentRank <= 10) top10++;
      else if (kw.currentRank <= 20) top20++;
      else striking++;
    });

    return { top3, top10, top20, striking, total: keywords.length };
  }, [keywords]);

  // Filtered & Sorted Keywords
  const filteredKeywords = useMemo(() => {
    return keywords
      .filter((item) => {
        const matchesQuery = item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.targetUrl.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIntent = selectedIntent === 'all' || item.intent === selectedIntent;
        return matchesQuery && matchesIntent;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'rank') {
          valA = a.currentRank;
          valB = b.currentRank;
        } else if (sortBy === 'volume') {
          valA = a.searchVolume;
          valB = b.searchVolume;
        } else if (sortBy === 'change') {
          valA = a.change;
          valB = b.change;
        } else if (sortBy === 'clicks') {
          valA = a.monthlyClicks;
          valB = b.monthlyClicks;
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [keywords, searchQuery, selectedIntent, sortBy, sortOrder]);

  const handleSort = (field: 'rank' | 'volume' | 'change' | 'clicks') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      // For rank, ascending (1, 2, 3...) is best by default; for volume/change/clicks, desc is natural
      setSortOrder(field === 'rank' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top SEO KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Organic Traffic Sessions"
          metric={currentMetrics.organicSessions}
          tooltip="Google Search clicks & direct organic search visitors"
        />
        <MetricCard
          label="Average Keyword Rank"
          metric={currentMetrics.avgPosition}
          suffix="pos"
          inversePositive={true}
          tooltip="Average Google search position across core target queries"
        />
        <MetricCard
          label="Keywords in Top 3 (#1-3)"
          metric={{
            value: rankBuckets.top3,
            deltaPercent: 33.3,
            isPositive: true,
            deltaValueFormatted: '+2 keywords',
          }}
          tooltip="Keywords ranking on the premier positions with highest CTR"
        />
        <MetricCard
          label="Keywords in Top 10 (#4-10)"
          metric={{
            value: rankBuckets.top10,
            deltaPercent: 16.7,
            isPositive: true,
            deltaValueFormatted: '+1 keyword',
          }}
          tooltip="Keywords ranking on page 1 of Google Search"
        />
      </div>

      {/* SERP Position Distribution & Visibility Score */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Google Search Position Distribution
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of tracked queries across Google Search page 1 and striking distance
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Search Visibility Index: <strong className="font-mono text-white text-sm font-bold">78.4%</strong> (+6.2%)</span>
          </div>
        </div>

        {/* Stacked Distribution Bar */}
        <div className="space-y-2">
          <div className="h-5 w-full rounded-lg bg-slate-800 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${(rankBuckets.top3 / (rankBuckets.total || 1)) * 100}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`Top 1-3: ${rankBuckets.top3} keywords`}
            />
            <div
              style={{ width: `${(rankBuckets.top10 / (rankBuckets.total || 1)) * 100}%` }}
              className="bg-indigo-500 h-full transition-all"
              title={`Top 4-10: ${rankBuckets.top10} keywords`}
            />
            <div
              style={{ width: `${(rankBuckets.top20 / (rankBuckets.total || 1)) * 100}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Positions 11-20: ${rankBuckets.top20} keywords`}
            />
            <div
              style={{ width: `${(rankBuckets.striking / (rankBuckets.total || 1)) * 100}%` }}
              className="bg-slate-600 h-full transition-all"
              title={`Positions 21+: ${rankBuckets.striking} keywords`}
            />
          </div>

          {/* Clean Legend (No pills, clean typography) */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <span className="text-slate-300 font-medium">Top 3 (#1–3):</span>
              <span className="font-mono text-white font-bold">{rankBuckets.top3}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
              <span className="text-slate-300 font-medium">Page 1 (#4–10):</span>
              <span className="font-mono text-white font-bold">{rankBuckets.top10}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
              <span className="text-slate-300 font-medium">Page 2 (#11–20):</span>
              <span className="font-mono text-white font-bold">{rankBuckets.top20}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-600" />
              <span className="text-slate-300 font-medium">Striking Distance (21+):</span>
              <span className="font-mono text-white font-bold">{rankBuckets.striking}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Keyword Tracking Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm overflow-hidden">
        {/* Table Controls Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tracked keyword or target URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Intent Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60 self-start">
              {(['all', 'transactional', 'commercial', 'informational'] as const).map((intent) => (
                <button
                  key={intent}
                  onClick={() => setSelectedIntent(intent)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                    selectedIntent === intent
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
            <span>Showing <strong className="font-mono text-white">{filteredKeywords.length}</strong> keywords</span>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Search Query & Target URL</th>
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Current Rank</span>
                    {sortBy === 'rank' && (
                      <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('change')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Rank Movement</span>
                    {sortBy === 'change' && (
                      <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Search Volume</span>
                    {sortBy === 'volume' && (
                      <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4">SERP Features Won</th>
                <th
                  onClick={() => handleSort('clicks')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Est. Clicks</span>
                    {sortBy === 'clicks' && (
                      <span className="font-mono text-indigo-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No keywords found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* Keyword & URL */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {kw.keyword}
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">
                          · {kw.intent}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate flex items-center gap-1">
                        <span>{kw.targetUrl}</span>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm tabular-nums">
                      <span
                        className={
                          kw.currentRank <= 3
                            ? 'text-emerald-400'
                            : kw.currentRank <= 10
                            ? 'text-indigo-300'
                            : 'text-slate-300'
                        }
                      >
                        #{kw.currentRank}
                      </span>
                    </td>

                    {/* Rank Movement */}
                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      {kw.change > 0 ? (
                        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>+{kw.change} ranks</span>
                        </div>
                      ) : kw.change < 0 ? (
                        <div className="flex items-center gap-1 text-rose-400 font-semibold">
                          <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{kw.change} ranks</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Minus className="w-3.5 h-3.5" />
                          <span>Unchanged</span>
                        </div>
                      )}
                    </td>

                    {/* Search Volume */}
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                      {kw.searchVolume.toLocaleString()} /mo
                    </td>

                    {/* SERP Features Won */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
                        {kw.serpFeatures.map((f, i) => (
                          <span
                            key={i}
                            className="bg-slate-800/80 px-2 py-0.5 rounded-sm border border-slate-700/60 font-mono text-[10px]"
                          >
                            {f.label}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Monthly Clicks */}
                    <td className="py-3.5 px-4 font-mono font-medium text-white tabular-nums">
                      {kw.monthlyClicks.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

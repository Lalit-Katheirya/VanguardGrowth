import React, { useState, useMemo } from 'react';
import {
  Target,
  CheckCircle2,
  Clock,
  PhoneCall,
  FileSpreadsheet,
  CalendarCheck,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ClientDataBundle, LeadItem, TimeframeId } from '../../types';
import { MetricCard } from '../MetricCard';

interface LeadsTabProps {
  bundle: ClientDataBundle;
  timeframe: TimeframeId;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({ bundle, timeframe }) => {
  const currentMetrics = bundle.metrics[timeframe] || bundle.metrics['30d'];
  const [leadsList, setLeadsList] = useState<LeadItem[]>(bundle.leads);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Funnel calculations
  const totalVisitors = currentMetrics.organicSessions.value + currentMetrics.totalAdSpend.value * 2.2;
  const totalLeads = currentMetrics.totalLeads.value;
  const qualifiedLeads = Math.round(totalLeads * 0.72);
  const wonClients = Math.round(totalLeads * 0.38);

  const filteredLeads = useMemo(() => {
    return leadsList.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.serviceInterest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.companyOrLocation && lead.companyOrLocation.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesChannel = channelFilter === 'all' || lead.channel === channelFilter;
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [leadsList, searchQuery, channelFilter, statusFilter]);

  const updateLeadStatus = (leadId: string, newStatus: LeadItem['status']) => {
    setLeadsList((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  const totalPipelineValue = leadsList.reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Conversion KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Leads Captured"
          metric={currentMetrics.totalLeads}
          tooltip="Verified phone calls, forms, & appointment bookings"
        />
        <MetricCard
          label="Blended Cost per Lead (CPL)"
          metric={currentMetrics.blendedCpl}
          prefix="$"
          inversePositive={true}
          tooltip="Total advertising investment divided by all inbound leads"
        />
        <MetricCard
          label="Estimated Pipeline Value"
          metric={{
            value: totalPipelineValue,
            deltaPercent: 26.5,
            isPositive: true,
            deltaValueFormatted: '+$14,200',
          }}
          prefix="$"
          tooltip="Combined value of all prospective client consultations"
        />
        <MetricCard
          label="Lead-to-Patient Conversion"
          metric={{
            value: 38.4,
            deltaPercent: 5.2,
            isPositive: true,
            deltaValueFormatted: '+2.1% win rate',
          }}
          suffix="%"
          tooltip="Percentage of qualified leads that convert into paid revenue"
        />
      </div>

      {/* Visual Conversion Funnel Stages */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Full-Funnel Acquisition Journey
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking conversion velocity from first touch impression down to retained customer
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Overall Funnel Velocity: <strong className="text-emerald-400 font-mono">Top 5% Industry Benchmark</strong>
          </span>
        </div>

        {/* 4-Stage Connected Funnel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Stage 01 · Impressions & Traffic
              </span>
              <p className="font-mono text-2xl font-bold text-white mt-1 tabular-nums">
                {Math.round(totalVisitors).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">Multi-channel site sessions</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
              <span>Traffic Volume</span>
              <span className="text-indigo-400 font-mono">100%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Stage 02 · Inbound Inquiries
              </span>
              <p className="font-mono text-2xl font-bold text-indigo-400 mt-1 tabular-nums">
                {totalLeads}
              </p>
              <p className="text-xs text-slate-400 mt-1">Verified phone & form inquiries</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
              <span>Conv Rate</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {((totalLeads / totalVisitors) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Stage 03 · Sales Qualified (SQL)
              </span>
              <p className="font-mono text-2xl font-bold text-blue-400 mt-1 tabular-nums">
                {qualifiedLeads}
              </p>
              <p className="text-xs text-slate-400 mt-1">High-intent consultations scheduled</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
              <span>Qualification Rate</span>
              <span className="text-blue-400 font-mono font-semibold">
                {((qualifiedLeads / totalLeads) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                Stage 04 · Closed Revenue
              </span>
              <p className="font-mono text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                {wonClients}
              </p>
              <p className="text-xs text-emerald-200/80 mt-1">Active paying client treatments</p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between text-[11px] text-emerald-300">
              <span>Attributed Revenue</span>
              <span className="text-white font-mono font-bold">
                ${currentMetrics.attributedRevenue.value.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table with Real-time Filters & Interactive Status */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lead name, service, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Channel filter */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Channels</option>
              <option value="Google Business Profile">Google Business Profile</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="Organic Search">Organic Search</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed Won">Closed Won</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="font-mono text-white">{filteredLeads.length}</strong> inquiries
          </div>
        </div>

        {/* Lead Rows Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Lead Name & Received</th>
                <th className="py-3 px-4">Attribution Channel</th>
                <th className="py-3 px-4">Inquiry Type</th>
                <th className="py-3 px-4">Service Interest</th>
                <th className="py-3 px-4">Est. Value</th>
                <th className="py-3 px-4">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{lead.name}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {lead.timestamp} {lead.companyOrLocation ? `· ${lead.companyOrLocation}` : ''}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 font-medium">{lead.channel}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {lead.type}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-slate-200 truncate">
                    {lead.serviceInterest}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                    ${lead.estimatedValue.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`text-xs px-2 py-1 rounded-md border font-medium focus:outline-none transition-colors ${
                        lead.status === 'Closed Won'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : lead.status === 'Qualified' || lead.status === 'Proposal Sent'
                          ? 'bg-blue-950/40 border-blue-800 text-blue-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Disqualified">Disqualified</option>
                    </select>
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

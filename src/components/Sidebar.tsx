import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  MapPin,
  Megaphone,
  Target,
  FileCheck,
  ChevronDown,
  ExternalLink,
  Mail,
  X,
  Sparkles,
} from 'lucide-react';
import { ClientProfile, TabId, ViewMode } from '../types';

interface SidebarProps {
  clients: ClientProfile[];
  currentClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  viewMode: ViewMode;
  currentLeadsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  clients,
  currentClient,
  onSelectClient,
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  viewMode,
  currentLeadsCount,
}) => {
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  const navItems: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Executive Summary', icon: BarChart3 },
    { id: 'seo', label: 'SEO & Organic Ranks', icon: Search },
    { id: 'gbp', label: 'Google Business Profile', icon: MapPin },
    { id: 'paid_ads', label: 'Paid Media & Ads', icon: Megaphone },
    { id: 'leads', label: 'Inbound Leads Pipeline', icon: Target },
    { id: 'reports', label: 'Client Reports & Schedule', icon: FileCheck },
  ];

  const leadsTarget = currentClient.targetMonthlyLeads;
  const leadProgress = Math.min(100, Math.round((currentLeadsCount / leadsTarget) * 100));

  const content = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-slate-950 px-4 py-5 border-r border-slate-800">
      <div>
        {/* Agency Wordmark & Identity */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0 shadow-sm flex items-center justify-center">
              <img
                src="/src/assets/images/agency_logo_mark_1792606735361.jpg"
                alt="Vanguard Growth Logo"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block">
                Vanguard Growth
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                Client Intelligence Portal
              </span>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Switcher Selector */}
        <div className="relative mb-6">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5 block">
            Active Client Account
          </label>
          <button
            type="button"
            onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-850 hover:border-slate-700 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-800">
                <img
                  src={currentClient.avatarUrl}
                  alt={currentClient.contactName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {currentClient.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentClient.location}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                clientDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Client switcher dropdown menu */}
          {clientDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden py-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Switch Client Dashboard
              </div>
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    onSelectClient(client);
                    setClientDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                    client.id === currentClient.id ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 shrink-0">
                    <img
                      src={client.avatarUrl}
                      alt={client.contactName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{client.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{client.industry}</p>
                  </div>
                  {client.id === currentClient.id && (
                    <span className="text-[10px] text-indigo-400 font-mono">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Reporting Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono text-indigo-300">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Monthly Target Health Widget */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Monthly Goal Target</span>
            <span className="font-mono text-xs text-white tabular-nums font-semibold">
              {leadProgress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                leadProgress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${leadProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            <span className="font-mono text-white tabular-nums font-semibold">{currentLeadsCount}</span> of {leadsTarget} leads acquired this cycle.
          </p>
        </div>

        {/* Agency Admin view notes if in Agency Mode */}
        {viewMode === 'agency' && (
          <div className="mt-4 rounded-xl border border-amber-900/40 bg-amber-950/20 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agency Retainer Plan</span>
            </div>
            <p className="text-[11px] text-amber-200/80 mb-1">
              Monthly Retainer: <strong className="font-mono tabular-nums text-white">${currentClient.monthlyRetainer.toLocaleString()}</strong>/mo
            </p>
            <p className="text-[10px] text-amber-300/60">
              Contract active since {currentClient.startDate}
            </p>
          </div>
        )}
      </div>

      {/* Footer Client Quick Info & Contact */}
      <div className="border-t border-slate-800/80 pt-4 mt-6">
        <div className="flex items-center justify-between text-xs mb-2 text-slate-400">
          <span className="truncate">Client Contact:</span>
          <a
            href={`mailto:${currentClient.contactEmail}`}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
            title={`Email ${currentClient.contactName}`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="text-[11px]">Email</span>
          </a>
        </div>
        <p className="text-xs font-medium text-white truncate">{currentClient.contactName}</p>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
          <a
            href={`https://${currentClient.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 flex items-center gap-1 transition-colors"
          >
            <span>{currentClient.domain}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="font-mono text-[10px] text-emerald-400">Live Client</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 h-screen sticky top-0 z-20">
        {content}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

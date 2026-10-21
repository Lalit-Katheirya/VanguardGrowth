import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { CLIENT_PROFILES, CLIENT_DATA_MAP } from './data/reportingData';
import { ClientProfile, TabId, TimeframeId, ViewMode } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/tabs/OverviewTab';
import { SeoTab } from './components/tabs/SeoTab';
import { GbpTab } from './components/tabs/GbpTab';
import { PaidAdsTab } from './components/tabs/PaidAdsTab';
import { LeadsTab } from './components/tabs/LeadsTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { ClientReportModal } from './components/modals/ClientReportModal';

const TAB_LABELS: Record<TabId, string> = {
  overview: 'Executive Summary',
  seo: 'SEO & Organic Ranks',
  gbp: 'Google Business Profile',
  paid_ads: 'Paid Media & Ads',
  leads: 'Inbound Leads Pipeline',
  reports: 'Client Reports & Schedule',
};

export default function App() {
  const [currentClient, setCurrentClient] = useState<ClientProfile>(CLIENT_PROFILES[0]);
  const [currentTab, setCurrentTab] = useState<TabId>('overview');
  const [timeframe, setTimeframe] = useState<TimeframeId>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('client');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBundle = CLIENT_DATA_MAP[currentClient.id] || CLIENT_DATA_MAP['evelyn-aesthetics'];
  const currentLeadsCount = activeBundle.metrics[timeframe]?.totalLeads?.value || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        clients={CLIENT_PROFILES}
        currentClient={currentClient}
        onSelectClient={setCurrentClient}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        viewMode={viewMode}
        currentLeadsCount={currentLeadsCount}
      />

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar with Hamburger */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-white truncate max-w-[200px]">
            {currentClient.name}
          </span>

          <button
            onClick={() => setReportModalOpen(true)}
            className="text-xs font-medium text-indigo-400"
          >
            Report
          </button>
        </div>

        {/* Top Header Bar */}
        <Header
          currentClient={currentClient}
          currentTab={currentTab}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenReportModal={() => setReportModalOpen(true)}
          tabLabels={TAB_LABELS}
        />

        {/* Client View Notification Banner if in Client Mode */}
        {viewMode === 'client' && (
          <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-6 py-2 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200">
                Client View Active
              </span>
              <span>Showing sanitized, executive-ready presentation view without internal agency margins.</span>
            </div>
            <button
              onClick={() => setViewMode('agency')}
              className="text-[11px] underline hover:text-white shrink-0 hidden sm:inline"
            >
              Switch to Agency Admin Mode
            </button>
          </div>
        )}

        {/* Active Tab Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <OverviewTab
              bundle={activeBundle}
              timeframe={timeframe}
              viewMode={viewMode}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'seo' && (
            <SeoTab bundle={activeBundle} timeframe={timeframe} />
          )}

          {currentTab === 'gbp' && (
            <GbpTab bundle={activeBundle} timeframe={timeframe} />
          )}

          {currentTab === 'paid_ads' && (
            <PaidAdsTab bundle={activeBundle} timeframe={timeframe} />
          )}

          {currentTab === 'leads' && (
            <LeadsTab bundle={activeBundle} timeframe={timeframe} />
          )}

          {currentTab === 'reports' && (
            <ReportsTab
              bundle={activeBundle}
              timeframe={timeframe}
              onOpenReportModal={() => setReportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Printable Client Report Modal */}
      <ClientReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        bundle={activeBundle}
        timeframe={timeframe}
      />
    </div>
  );
}

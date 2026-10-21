export type TimeframeId = '7d' | '30d' | 'this_month' | 'last_month' | 'last_quarter';

export type TabId = 'overview' | 'seo' | 'gbp' | 'paid_ads' | 'leads' | 'reports';

export type ViewMode = 'agency' | 'client';

export interface ClientProfile {
  id: string;
  name: string;
  domain: string;
  industry: string;
  location: string;
  contactName: string;
  contactEmail: string;
  avatarUrl: string;
  monthlyRetainer: number;
  startDate: string;
  targetMonthlyLeads: number;
  targetBlendedRoas: number;
  targetMaxCpl: number;
}

export interface MetricDelta {
  value: number;
  deltaPercent: number; // e.g. +18.4%
  isPositive: boolean;
  deltaValueFormatted?: string;
  previousValueFormatted?: string;
}

export interface OverviewMetrics {
  totalLeads: MetricDelta;
  blendedCpl: MetricDelta;
  totalAdSpend: MetricDelta;
  attributedRevenue: MetricDelta;
  blendedRoas: MetricDelta;
  organicSessions: MetricDelta;
  gbpCustomerActions: MetricDelta;
  avgPosition: MetricDelta;
}

export interface ChartDataPoint {
  date: string;
  label: string;
  organic: number;
  paid: number;
  direct: number;
  social: number;
  referral: number;
  total: number;
  leads: number;
  cost: number;
  revenue: number;
}

export interface SerpFeature {
  type: 'local_pack' | 'featured_snippet' | 'sitelinks' | 'people_also_ask' | 'video';
  label: string;
}

export interface KeywordRanking {
  id: string;
  keyword: string;
  currentRank: number;
  previousRank: number;
  change: number; // positive is improvement, negative is drop
  searchVolume: number;
  difficulty: number; // 0 - 100
  intent: 'commercial' | 'transactional' | 'informational' | 'navigational';
  serpFeatures: SerpFeature[];
  targetUrl: string;
  monthlyClicks: number;
  impressions: number;
}

export interface GbpActionMetrics {
  phoneCalls: MetricDelta;
  directions: MetricDelta;
  websiteVisits: MetricDelta;
  bookings: MetricDelta;
}

export interface GbpReview {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  text: string;
  serviceMentioned?: string;
  hasAgencyReplied: boolean;
  replyText?: string;
  replyDate?: string;
}

export interface PaidCampaign {
  id: string;
  name: string;
  platform: 'google' | 'meta' | 'linkedin' | 'tiktok';
  campaignType: string;
  status: 'active' | 'paused' | 'completed';
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export interface LeadItem {
  id: string;
  timestamp: string;
  name: string;
  companyOrLocation?: string;
  channel: 'Organic Search' | 'Google Ads' | 'Meta Ads' | 'Google Business Profile' | 'LinkedIn Ads' | 'Direct / Referral';
  type: 'Form Submission' | 'Call Tracking' | 'Schedule Booking' | 'Chat Inquiry';
  serviceInterest: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Closed Won' | 'Disqualified';
  estimatedValue: number;
  assignedTo?: string;
}

export interface StrategicBrief {
  executiveSummary: string;
  topWins: string[];
  growthOpportunities: string[];
  recommendedActions: string[];
  strategistName: string;
  lastUpdated: string;
}

export interface ClientDataBundle {
  profile: ClientProfile;
  metrics: Record<TimeframeId, OverviewMetrics>;
  chartHistory: Record<TimeframeId, ChartDataPoint[]>;
  keywords: KeywordRanking[];
  gbpActions: Record<TimeframeId, GbpActionMetrics>;
  gbpViewsSplit: { searchPercent: number; mapsPercent: number; totalViews: number; viewsDelta: number };
  reviews: GbpReview[];
  paidCampaigns: PaidCampaign[];
  leads: LeadItem[];
  brief: StrategicBrief;
}

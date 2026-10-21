import React, { useState } from 'react';
import {
  PhoneCall,
  Navigation,
  Globe,
  CalendarCheck,
  Star,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Reply,
  Send,
  Eye,
  Camera,
} from 'lucide-react';
import { ClientDataBundle, GbpReview, TimeframeId } from '../../types';
import { MetricCard } from '../MetricCard';

interface GbpTabProps {
  bundle: ClientDataBundle;
  timeframe: TimeframeId;
}

export const GbpTab: React.FC<GbpTabProps> = ({ bundle, timeframe }) => {
  const currentActions = bundle.gbpActions[timeframe] || bundle.gbpActions['30d'];
  const { gbpViewsSplit, profile } = bundle;
  const [reviewsList, setReviewsList] = useState<GbpReview[]>(bundle.reviews);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // Handle submitting review response
  const handleSendReply = (reviewId: string) => {
    if (!replyInput.trim()) return;
    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              hasAgencyReplied: true,
              replyText: replyInput.trim(),
              replyDate: 'Just now by Agency Strategist',
            }
          : r
      )
    );
    setReplyingToId(null);
    setReplyInput('');
  };

  const totalActions =
    currentActions.phoneCalls.value +
    currentActions.directions.value +
    currentActions.websiteVisits.value +
    currentActions.bookings.value;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* GBP Header Overview */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Google Business Profile Insights
                </h1>
                <span className="font-mono text-xs text-emerald-400">Verified Location</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.name} · {profile.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-950/60 border border-slate-800/80 px-4 py-2.5 rounded-xl self-start md:self-auto">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-mono text-base font-bold text-white tabular-nums">4.9</span>
              <span className="text-xs text-slate-400 font-sans">(182 Verified Reviews)</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="text-xs text-emerald-400 font-medium">
              +4 new 5-star reviews this month
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Action Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            High-Intent Customer Actions on Google
          </h2>
          <span className="text-[11px] text-slate-400">
            Total Combined Direct Actions: <strong className="font-mono text-white">{totalActions}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Inbound Phone Calls"
            metric={currentActions.phoneCalls}
            tooltip="Taps on the 'Call' button directly from Google Maps & Search"
          />
          <MetricCard
            label="Driving Direction Requests"
            metric={currentActions.directions}
            tooltip="Customers navigating turn-by-turn routes to clinic doors"
          />
          <MetricCard
            label="Website Clicks from GBP"
            metric={currentActions.websiteVisits}
            tooltip="Direct visits referred from the GBP listing button"
          />
          <MetricCard
            label="Online Consultation Bookings"
            metric={currentActions.bookings}
            tooltip="Bookings initiated via Google Reserve / Book Online button"
          />
        </div>
      </div>

      {/* Discovery Split & Photo Visibility Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Search vs Maps Views */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Impression Discovery Channels
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Where prospective clients discover your business listing
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-semibold tabular-nums">
              +{gbpViewsSplit.viewsDelta}% MoM
            </span>
          </div>

          <div className="my-5">
            <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${gbpViewsSplit.searchPercent}%` }}
                className="bg-indigo-500 h-full"
                title={`Google Search: ${gbpViewsSplit.searchPercent}%`}
              />
              <div
                style={{ width: `${gbpViewsSplit.mapsPercent}%` }}
                className="bg-emerald-500 h-full"
                title={`Google Maps: ${gbpViewsSplit.mapsPercent}%`}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
                <span className="text-slate-300 font-medium">Google Search Views:</span>
                <span className="font-mono text-white font-bold">{gbpViewsSplit.searchPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span className="text-slate-300 font-medium">Google Maps Navigation:</span>
                <span className="font-mono text-white font-bold">{gbpViewsSplit.mapsPercent}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Total Listing Impressions:</span>
              <span className="font-mono text-white font-bold tabular-nums">
                {gbpViewsSplit.totalViews.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Direct Branded Searches:</span>
              <span className="font-mono text-slate-400 tabular-nums">38% (High brand equity)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Discovery / Category Searches:</span>
              <span className="font-mono text-slate-400 tabular-nums">62% (New customer discovery)</span>
            </div>
          </div>
        </div>

        {/* Local Visibility & Photo Engagement */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Media & Photo Performance
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual engagement compared with top local competitors
                </p>
              </div>
              <Camera className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Your Clinic Photos Views:</span>
                  <span className="font-mono text-white font-bold tabular-nums">14,200 views</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Local Area Competitor Median:</span>
                  <span className="font-mono text-slate-400 tabular-nums">4,800 views</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-slate-600 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-300 leading-relaxed border-t border-slate-800">
                Your listings receive <strong className="text-emerald-400 font-mono">195% more photo views</strong> than similar businesses in your metro area. Verified treatment photos directly elevate map click-through conversions.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Listing Completeness Score</span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">100% Fully Optimized</span>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Reputation Stream */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Client Reputation & Google Reviews
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live feedback monitoring with agency response management
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Response Rate: <strong className="font-mono text-white font-bold">100%</strong>
          </div>
        </div>

        <div className="space-y-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">{rev.author}</span>
                    <span className="text-[11px] text-slate-500">· {rev.date}</span>
                  </div>
                  {rev.serviceMentioned && (
                    <span className="text-[11px] text-indigo-400 font-medium block mt-0.5">
                      Service: {rev.serviceMentioned}
                    </span>
                  )}
                </div>

                {/* Star rating icons */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-800 text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rev.text}</p>

              {/* Agency response if replied */}
              {rev.hasAgencyReplied && rev.replyText ? (
                <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Response from Business</span>
                    </div>
                    {rev.replyDate && <span className="text-slate-500">{rev.replyDate}</span>}
                  </div>
                  <p className="text-slate-300 italic">&ldquo;{rev.replyText}&rdquo;</p>
                </div>
              ) : replyingToId === rev.id ? (
                <div className="mt-2 space-y-2 pt-2 border-t border-slate-800">
                  <textarea
                    rows={2}
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Write a professional owner reply on Google..."
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setReplyingToId(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Reply to Google</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setReplyingToId(rev.id);
                    setReplyInput(`Thank you so much for your feedback, ${rev.author}! We truly appreciate your support.`);
                  }}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors pt-1"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Draft Official Google Response</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

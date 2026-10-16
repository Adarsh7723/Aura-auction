import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CountdownTimer } from './CountdownTimer';
import { 
  TrendingUp, 
  Trophy, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Zap,
  Filter
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { auctions, invoices, setSelectedLot, setActiveInvoice, user } = useAuctions();
  const [historyFilter, setHistoryFilter] = useState<'all' | 'leading' | 'outbid' | 'won'>('all');

  // Compute live real-time statistics
  const userBidsAll = auctions.flatMap((lot) =>
    lot.bids.filter((b) => b.isUser).map((b) => ({ ...b, lot }))
  );

  const activeLots = auctions.filter((a) => a.status !== 'closed');
  const userActiveLots = activeLots.filter((a) => a.bids.some((b) => b.isUser));
  
  const userLeadingLots = userActiveLots.filter((a) => a.bids[0]?.isUser);
  const userOutbidLots = userActiveLots.filter((a) => !a.bids[0]?.isUser);

  // Won lots
  const wonLots = auctions.filter((a) => a.winner?.isUser);
  const closedLotsWithUserBids = auctions.filter(
    (a) => a.status === 'closed' && a.bids.some((b) => b.isUser)
  );

  // Success rate: won / (closed user auctions) or default historical rate
  const historicalConcluded = 4;
  const historicalWins = 3;
  const totalConcluded = closedLotsWithUserBids.length + historicalConcluded;
  const totalWins = wonLots.length + historicalWins;
  const winRate = Math.round((totalWins / Math.max(1, totalConcluded)) * 100);

  // Total committed capital on active bids
  const totalCommitted = userLeadingLots.reduce((acc, lot) => acc + lot.currentBid, 0);

  // Total spent on settled invoices
  const totalSettled = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);

  // Filter history entries
  const filteredHistory = userBidsAll.filter(({ lot }) => {
    if (historyFilter === 'leading') return lot.status !== 'closed' && lot.bids[0]?.isUser;
    if (historyFilter === 'outbid') return lot.status !== 'closed' && !lot.bids[0]?.isUser;
    if (historyFilter === 'won') return lot.winner?.isUser;
    return true;
  });

  // Category breakdown
  const categoryStats = [
    { name: 'Fine Horology', value: 44500, count: 1, percent: 55 },
    { name: 'Modernist Design', value: 15500, count: 2, percent: 25 },
    { name: 'Contemporary Art', value: 24000, count: 1, percent: 15 },
    { name: 'Vintage Optics', value: 7800, count: 1, percent: 5 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-sky-800 tracking-wider uppercase mb-1">
            <span>Bidder ID: {user.bidderId}</span>
            <span aria-hidden="true">·</span>
            <span>Escrow Verified</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">Real-Time Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Real-Time Bidding Dashboard & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Available Vault Limit</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {formatCurrency(user.vaultBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI 4-Card Executive Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Active Committed Bids */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Lots Committed</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(totalCommitted)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{userLeadingLots.length} Leading Lots</span>
            <span className="text-sky-700 font-medium">Floor Active</span>
          </div>
        </div>

        {/* KPI 2: Success Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Auction Win Rate</span>
            <Trophy className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 flex items-baseline gap-1.5">
            <span>{winRate}%</span>
            <span className="text-xs font-normal text-slate-500">success</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{totalWins} won of {totalConcluded} concluded</span>
            <span className="text-emerald-700 font-medium">+12% vs avg</span>
          </div>
        </div>

        {/* KPI 3: Outbid Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Outbid Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${userOutbidLots.length > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 flex items-baseline gap-2">
            <span>{userOutbidLots.length}</span>
            <span className="text-xs font-normal text-slate-500">items</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            {userOutbidLots.length > 0 ? (
              <span className="text-amber-700 font-semibold">Immediate Action Recommended</span>
            ) : (
              <span className="text-emerald-700">All Bids In Lead Position</span>
            )}
          </div>
        </div>

        {/* KPI 4: Total Settled Acquisitions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Settled Volume</span>
            <ShieldCheck className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(totalSettled)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{invoices.filter((i) => i.status === 'paid').length} Paid Invoices</span>
            <span className="text-slate-700">Escrow Cleared</span>
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Card 1: Bidding Performance & Win Rate Analytics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Floor Efficiency & Outcomes</h3>
              <span className="text-xs text-slate-500 font-mono">Live Ratios</span>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Clean SVG Donut Chart */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="3.5"
                  />
                  {/* Win Arc (sky-600) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="3.5"
                    strokeDasharray={`${winRate * 0.942} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-mono text-slate-900">{winRate}%</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Win Rate</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  Concluded Wins
                </span>
                <span className="font-mono font-semibold text-slate-900">{totalWins} Lots</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Currently Outbid
                </span>
                <span className="font-mono font-semibold text-slate-900">{userOutbidLots.length} Lots</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Currently Leading
                </span>
                <span className="font-mono font-semibold text-slate-900">{userLeadingLots.length} Lots</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Card 2: Bidding Allocation by Category */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Bidding Allocation by Discipline</h3>
              <span className="text-xs text-slate-500 font-mono">Portfolio Spread</span>
            </div>

            <div className="mt-5 space-y-4">
              {categoryStats.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{cat.count} Lots</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Escrow Settlement Guarantee: 100% Insured Transit</span>
            <span className="font-mono">Zurich & Geneva Vault Clearing</span>
          </div>
        </div>

      </div>

      {/* Real-Time Bidding History Stream */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Real-Time Bidding History & Floor Activity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of all bids placed under bidder profile {user.bidderId}
            </p>
          </div>

          {/* Filter Tabs (Interactive Segmented Buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setHistoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                historyFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Bids ({userBidsAll.length})
            </button>
            <button
              onClick={() => setHistoryFilter('leading')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                historyFilter === 'leading'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leading ({userLeadingLots.length})
            </button>
            <button
              onClick={() => setHistoryFilter('outbid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                historyFilter === 'outbid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Outbid ({userOutbidLots.length})
            </button>
            <button
              onClick={() => setHistoryFilter('won')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                historyFilter === 'won'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Won ({wonLots.length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No bids matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Lot & Item</th>
                  <th className="py-3 px-4">Your Bid</th>
                  <th className="py-3 px-4">Current High</th>
                  <th className="py-3 px-4">Remaining</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map(({ id, amount, timestamp, lot }) => {
                  const isCurrentHigh = lot.currentBid === amount && lot.bids[0]?.isUser;
                  const isLotClosed = lot.status === 'closed';
                  const isWonByUser = lot.winner?.isUser;

                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Lot title & thumb */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={lot.imageUrl}
                            alt={lot.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-mono text-slate-500 text-[11px] block">
                              {lot.lotNumber} · {lot.category}
                            </span>
                            <span
                              onClick={() => setSelectedLot(lot)}
                              className="font-semibold text-slate-900 hover:text-sky-700 cursor-pointer transition-colors line-clamp-1"
                            >
                              {lot.title}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Your bid */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                        {formatCurrency(amount)}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {formatDate(timestamp).split(',')[1]?.trim()}
                        </span>
                      </td>

                      {/* Current highest */}
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                        {formatCurrency(lot.currentBid)}
                      </td>

                      {/* Time remaining */}
                      <td className="py-3.5 px-4">
                        <CountdownTimer endTime={lot.endTime} />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isWonByUser ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Won — Settling
                          </span>
                        ) : isLotClosed ? (
                          <span className="text-slate-500">Lot Closed</span>
                        ) : isCurrentHigh ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Leading Bid
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Outbid
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isLotClosed && !isCurrentHigh && (
                            <button
                              onClick={() => setSelectedLot(lot)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                            >
                              Rebid
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedLot(lot)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Inspect lot details"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

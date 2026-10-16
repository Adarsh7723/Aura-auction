import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { AuctionItem } from '../types/auction';
import { CountdownTimer } from './CountdownTimer';
import { formatCurrency } from '../utils/formatters';
import { Search, ArrowUpRight, Zap, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const AuctionsView: React.FC = () => {
  const { auctions, setSelectedLot, placeBid, simulateOutbid, simulateEndLot, user } = useAuctions();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Fine Horology', 'Modernist Design', 'Contemporary Art', 'Vintage Cameras', 'Studio Glass'];

  const filteredAuctions = auctions.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Minimalist Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-transparent pt-10 pb-12 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-800 tracking-wider uppercase mb-3">
              <span>Curated Evening Sale</span>
              <span aria-hidden="true">·</span>
              <span>Geneva & Zurich Catalog</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">256-Bit Escrow Vault</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 text-balance leading-tight">
              Exceptional Provenance. Real-Time Floor Bidding.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Bid live on museum-grade horology, design icons, and fine art. Winners receive instant automated escrow invoices with fully insured courier dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lots, makers, archives..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAuctions.map((lot) => {
            const highestBid = lot.bids[0];
            const isHighestUser = highestBid?.isUser;
            const hasUserBid = lot.bids.some((b) => b.isUser);
            const isOutbid = hasUserBid && !isHighestUser;
            const isClosed = lot.status === 'closed';

            return (
              <article
                key={lot.id}
                className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:border-slate-300 transition-all duration-200 flex flex-col"
              >
                {/* 4:3 Image Container with Resilient Fallback */}
                <div
                  className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedLot(lot)}
                >
                  <img
                    src={lot.imageUrl}
                    alt={lot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Clean unboxed overlay timer */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/80 shadow-xs">
                    <CountdownTimer endTime={lot.endTime} />
                  </div>

                  {/* User Bidding Status Tag */}
                  {isHighestUser && !isClosed && (
                    <div className="absolute top-3 left-3 bg-emerald-50/95 backdrop-blur-xs border border-emerald-200/80 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Highest Bidder</span>
                    </div>
                  )}

                  {isOutbid && !isClosed && (
                    <div className="absolute top-3 left-3 bg-amber-50/95 backdrop-blur-xs border border-amber-200/80 px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Outbid</span>
                    </div>
                  )}

                  {isClosed && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-lg text-xs font-semibold text-slate-900 shadow-md">
                        {lot.winner?.isUser ? 'Won by You' : 'Auction Closed'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata Line (Zero-Pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>{lot.lotNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lot.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Est. {formatCurrency(lot.details.estimateMin)}–{formatCurrency(lot.details.estimateMax)}</span>
                    </div>

                    {/* Lot Title */}
                    <h3
                      onClick={() => setSelectedLot(lot)}
                      className="mt-2 text-base font-semibold text-slate-900 hover:text-sky-700 cursor-pointer line-clamp-1 transition-colors"
                      title={lot.title}
                    >
                      {lot.title}
                    </h3>

                    {/* Brief description */}
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {lot.description}
                    </p>
                  </div>

                  {/* Bidding Summary Strip */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                          {isClosed ? 'Hammer Price' : 'Current Bid'}
                        </span>
                        <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                          {formatCurrency(lot.currentBid)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                          Floor Activity
                        </span>
                        <span className="text-xs font-medium text-slate-700 font-mono">
                          {lot.bidCount} Bids placed
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedLot(lot)}
                        className="flex-1 py-2 px-3 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>{isClosed ? 'Inspect Lot Archive' : 'Inspect & Bid'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {!isClosed && (
                        <button
                          onClick={() => placeBid(lot.id, lot.currentBid + lot.minIncrement)}
                          title={`Fast bid +${formatCurrency(lot.minIncrement)}`}
                          className="py-2 px-3 text-xs font-medium text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-lg transition-colors whitespace-nowrap"
                        >
                          +{formatCurrency(lot.minIncrement)}
                        </button>
                      )}
                    </div>

                    {/* Quick Simulation Testing Toolbar (allows testing outbid & win right away) */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">Simulation:</span>
                      <div className="flex items-center gap-3">
                        {!isClosed && (
                          <button
                            onClick={() => simulateOutbid(lot.id)}
                            className="hover:text-amber-700 transition-colors flex items-center gap-1 text-[11px]"
                            title="Simulate a rival collector outbidding you to trigger outbid alerts"
                          >
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>Simulate Outbid</span>
                          </button>
                        )}
                        {!isClosed && (
                          <button
                            onClick={() => simulateEndLot(lot.id)}
                            className="hover:text-sky-700 transition-colors flex items-center gap-1 text-[11px]"
                            title="Instant hammer drop: if you are highest bidder, automatically triggers official invoice & secure payment"
                          >
                            <Sparkles className="w-3 h-3 text-sky-600" />
                            <span>Instant End (Test Win)</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { CountdownTimer } from './CountdownTimer';
import { formatCurrency, formatDate } from '../utils/formatters';
import { X, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight, Zap, Sparkles, Clock, History } from 'lucide-react';

export const LotDetailModal: React.FC = () => {
  const { selectedLot, setSelectedLot, placeBid, simulateOutbid, simulateEndLot, user } = useAuctions();
  
  if (!selectedLot) return null;

  const minRequired = selectedLot.currentBid + selectedLot.minIncrement;
  const [customBidAmount, setCustomBidAmount] = useState<number>(minRequired);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const highestBid = selectedLot.bids[0];
  const isHighestUser = highestBid?.isUser;
  const isClosed = selectedLot.status === 'closed';

  const handleCustomBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBidAmount < minRequired) {
      setErrorMsg(`Bid must be at least ${formatCurrency(minRequired)}.`);
      return;
    }
    setErrorMsg('');
    const res = placeBid(selectedLot.id, customBidAmount);
    if (res.success) {
      setCustomBidAmount(customBidAmount + selectedLot.minIncrement);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleIncrementClick = (increment: number) => {
    const nextAmount = selectedLot.currentBid + increment;
    setCustomBidAmount(nextAmount);
    setErrorMsg('');
    placeBid(selectedLot.id, nextAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-sky-800 tracking-wider">
              {selectedLot.lotNumber}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">
              {selectedLot.category}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <CountdownTimer endTime={selectedLot.endTime} className="text-sm font-semibold" />
            <button
              onClick={() => setSelectedLot(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image and Archival Specifications */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 relative">
              <img
                src={selectedLot.imageUrl}
                alt={selectedLot.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isClosed && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center text-white font-semibold text-sm">
                  {selectedLot.winner?.isUser ? '🏆 Hammer Dropped — Won by You!' : 'Auction Closed'}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {selectedLot.title}
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {selectedLot.description}
              </p>
            </div>

            {/* Catalog Details Table */}
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50/50 font-semibold text-slate-700">
                Archival Provenance & Verification
              </div>
              <div className="p-3 flex justify-between gap-4">
                <span className="text-slate-500">Year of Origin</span>
                <span className="font-medium text-slate-900">{selectedLot.details.year}</span>
              </div>
              <div className="p-3 flex justify-between gap-4">
                <span className="text-slate-500">Provenance</span>
                <span className="font-medium text-slate-900 text-right">{selectedLot.details.provenance}</span>
              </div>
              <div className="p-3 flex justify-between gap-4">
                <span className="text-slate-500">Condition Report</span>
                <span className="font-medium text-slate-900 text-right">{selectedLot.details.condition}</span>
              </div>
              <div className="p-3 flex justify-between gap-4">
                <span className="text-slate-500">Authentication</span>
                <span className="font-medium text-sky-800 flex items-center gap-1.5 text-right">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  {selectedLot.details.authentication}
                </span>
              </div>
              <div className="p-3 flex justify-between gap-4">
                <span className="text-slate-500">Auction Estimate</span>
                <span className="font-mono font-medium text-slate-900">
                  {formatCurrency(selectedLot.details.estimateMin)} — {formatCurrency(selectedLot.details.estimateMax)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Floor Bidding Module */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Live Pricing Box */}
            <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{isClosed ? 'Winning Hammer' : 'Current Leading Bid'}</span>
                <span>{selectedLot.bidCount} Floor Bids</span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(selectedLot.currentBid)}
                </span>
                <span className="text-xs text-slate-500">USD</span>
              </div>

              {/* Status indicator */}
              <div className="mt-3 pt-3 border-t border-sky-200/50 flex items-center justify-between text-xs">
                {isHighestUser ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You hold the highest bid
                  </span>
                ) : (
                  <span className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Minimum next: {formatCurrency(minRequired)}
                  </span>
                )}
                <span className="text-slate-500 text-[11px]">
                  Reserve met
                </span>
              </div>
            </div>

            {/* Bidding Controls (if open) */}
            {!isClosed ? (
              <div className="space-y-4">
                {/* Fast Increment Quick Buttons */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Quick Bid Increments
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[selectedLot.minIncrement, selectedLot.minIncrement * 2, selectedLot.minIncrement * 4, selectedLot.minIncrement * 10].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handleIncrementClick(inc)}
                        className="py-2 px-3 text-xs font-semibold text-sky-900 bg-sky-50/80 hover:bg-sky-100 border border-sky-200/60 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>+{formatCurrency(inc)}</span>
                        <span className="font-mono text-[11px] text-sky-700">
                          {formatCurrency(selectedLot.currentBid + inc)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Bid Input */}
                <form onSubmit={handleCustomBid} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Custom Bid Amount (Min: {formatCurrency(minRequired)})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min={minRequired}
                        step={selectedLot.minIncrement}
                        value={customBidAmount}
                        onChange={(e) => {
                          setCustomBidAmount(Number(e.target.value));
                          setErrorMsg('');
                        }}
                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    {errorMsg && (
                      <p className="mt-1 text-xs text-rose-600">{errorMsg}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Place Guaranteed Bid</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Simulation actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => simulateOutbid(selectedLot.id)}
                    className="text-amber-700 hover:text-amber-900 flex items-center gap-1 text-xs transition-colors"
                    title="Simulate someone outbidding you to test outbid notifications"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Test Outbid Alert</span>
                  </button>

                  <button
                    onClick={() => simulateEndLot(selectedLot.id)}
                    className="text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1 text-xs transition-colors"
                    title="Instant hammer drop: tests automatic invoice generation and secure payment gateway"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Hammer (Test Win)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold text-slate-900">This Lot is Closed</p>
                <p className="text-xs text-slate-500 mt-1">
                  Hammer dropped at {formatCurrency(selectedLot.currentBid)}.
                  {selectedLot.winner?.isUser ? ' You are the confirmed winner!' : ''}
                </p>
              </div>
            )}

            {/* Live Floor Bid History Stream */}
            <div className="border border-slate-200 rounded-xl p-4 flex-1 flex flex-col min-h-[180px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Live Bid Floor Log
                </span>
                <span className="text-[11px] text-slate-400">Authenticated Bidders</span>
              </div>

              <div className="mt-3 space-y-2 overflow-y-auto max-h-44 pr-1">
                {selectedLot.bids.map((b, i) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-md ${
                      i === 0
                        ? 'bg-sky-50/70 border border-sky-100 font-medium text-slate-900'
                        : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400">
                        {formatDate(b.timestamp).split(',')[1]?.trim() || 'Floor'}
                      </span>
                      <span className={b.isUser ? 'font-semibold text-sky-800' : ''}>
                        {b.bidderMasked}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-slate-900">
                      {formatCurrency(b.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

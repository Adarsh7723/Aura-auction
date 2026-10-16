import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ShieldCheck, CheckCircle2, Clock, ArrowRight, Printer, FileText } from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { invoices, setActiveInvoice, user } = useAuctions();
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === 'unpaid') return inv.status === 'unpaid';
    if (filter === 'paid') return inv.status === 'paid';
    return true;
  });

  const unpaidCount = invoices.filter((i) => i.status === 'unpaid').length;
  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-sky-800 tracking-wider uppercase mb-1">
            <span>Official Billing Records</span>
            <span aria-hidden="true">·</span>
            <span>Escrow Guarantee</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">Aura Depository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Invoices & Payment Confirmations
          </h1>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-500 block">Pending Invoices</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {unpaidCount}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Settled Total</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatCurrency(totalPaid)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('unpaid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filter === 'unpaid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Awaiting Payment ({unpaidCount})</span>
            {unpaidCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'paid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settled & Paid ({invoices.length - unpaidCount})
          </button>
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">No invoices in this view</p>
          <p className="text-xs text-slate-500 mt-1">
            When you win an auction lot, the system automatically triggers an official invoice here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((inv) => {
            const isPaid = inv.status === 'paid';

            return (
              <div
                key={inv.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Item information */}
                <div className="flex items-start gap-4">
                  <img
                    src={inv.imageUrl}
                    alt={inv.auctionTitle}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-800">
                        {inv.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {inv.lotNumber}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        Issued {formatDate(inv.issuedAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900">
                      {inv.auctionTitle}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Hammer: {formatCurrency(inv.hammerPrice)}</span>
                      <span>Premium (10%): {formatCurrency(inv.buyersPremium)}</span>
                      <span>Transport: {formatCurrency(inv.shippingFee)}</span>
                      <span>Tax: {formatCurrency(inv.tax)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Settlement Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                      Total Due
                    </span>
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </span>
                    <div className="mt-0.5">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Escrow Settled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Payment Required (Within 72h)
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {isPaid ? (
                      <button
                        onClick={() => setActiveInvoice(inv)}
                        className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveInvoice(inv)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                      >
                        <span>Secure Checkout</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

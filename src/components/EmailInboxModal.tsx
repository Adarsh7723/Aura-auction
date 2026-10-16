import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { formatDate, formatCurrency } from '../utils/formatters';
import { X, Mail, Zap, Trophy, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const EmailInboxModal: React.FC = () => {
  const { 
    emailModalOpen, 
    setEmailModalOpen, 
    emails, 
    markEmailAsRead, 
    setSelectedLot, 
    setActiveInvoice, 
    auctions, 
    invoices,
    user 
  } = useAuctions();

  const [activeEmailId, setActiveEmailId] = useState<string>(emails[0]?.id || '');

  if (!emailModalOpen) return null;

  const currentEmail = emails.find((e) => e.id === activeEmailId) || emails[0];

  const handleSelect = (id: string) => {
    setActiveEmailId(id);
    markEmailAsRead(id);
  };

  const handleEmailAction = () => {
    if (!currentEmail) return;

    if (currentEmail.actionType === 'rebid' || currentEmail.actionType === 'view_lot') {
      const lot = auctions.find((a) => a.id === currentEmail.auctionId);
      if (lot) {
        setEmailModalOpen(false);
        setSelectedLot(lot);
      }
    } else if (currentEmail.actionType === 'pay_invoice' || currentEmail.actionType === 'view_invoice') {
      const inv = invoices.find((i) => i.auctionId === currentEmail.auctionId) || invoices[0];
      if (inv) {
        setEmailModalOpen(false);
        setActiveInvoice(inv);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-sky-600" />
            <div>
              <span className="text-sm font-bold text-slate-900">
                Transactional Email Dispatch Center
              </span>
              <span className="text-xs text-slate-500 block">
                Delivered to: <strong className="text-slate-700 font-mono">{user.email}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => setEmailModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close email inbox modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Master/Detail View */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          
          {/* Email List Column */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 bg-slate-50/30">
            {emails.map((e) => {
              const isSelected = e.id === currentEmail?.id;
              return (
                <div
                  key={e.id}
                  onClick={() => handleSelect(e.id)}
                  className={`p-4 cursor-pointer transition-colors text-xs ${
                    isSelected ? 'bg-sky-50/80 border-l-2 border-l-sky-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      {e.type === 'outbid' && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                      {e.type === 'winner' && <Trophy className="w-3.5 h-3.5 text-emerald-600" />}
                      {e.type === 'payment_confirmed' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                      {e.type === 'bid_confirmed' && <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />}
                      {e.type === 'outbid' ? 'Outbid Alert' : e.type === 'winner' ? 'Auction Won' : 'Confirmation'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(e.timestamp).split(',')[1]?.trim()}
                    </span>
                  </div>

                  <p className="font-medium text-slate-800 line-clamp-1">{e.subject}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {e.previewText}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Email Reader Column */}
          <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto p-6 bg-white">
            {currentEmail ? (
              <div className="space-y-6">
                
                {/* Email Header Meta */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Aura Automated Mail Dispatch</span>
                    <span className="font-mono">{formatDate(currentEmail.timestamp)}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {currentEmail.subject}
                  </h3>

                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                    <span>From: <strong>settlements@aura-auctions.com</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>To: <strong>{currentEmail.recipientEmail}</strong></span>
                  </div>
                </div>

                {/* Email Body Content */}
                <div
                  className="prose prose-sm max-w-none text-slate-700 text-xs"
                  dangerouslySetInnerHTML={{ __html: currentEmail.bodyHtml }}
                />

                {/* Action CTA inside the email */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleEmailAction}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {currentEmail.actionType === 'rebid' && (
                      <>
                        <span>Place Immediate Rebid</span>
                        <Zap className="w-4 h-4 text-amber-400" />
                      </>
                    )}
                    {currentEmail.actionType === 'pay_invoice' && (
                      <>
                        <span>Review & Pay Invoice Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                    {currentEmail.actionType === 'view_invoice' && (
                      <>
                        <span>View Official Escrow Receipt</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                    {currentEmail.actionType === 'view_lot' && (
                      <>
                        <span>Inspect Live Floor Lot</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Select an email to view contents.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

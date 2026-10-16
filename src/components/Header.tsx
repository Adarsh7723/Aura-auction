import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { Bell, ShieldCheck, Menu, X, Wallet, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Header: React.FC = () => {
  const { currentTab, setCurrentTab, user, emails, setEmailModalOpen, invoices } = useAuctions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadEmailsCount = emails.filter((e) => !e.read).length;
  const unpaidInvoicesCount = invoices.filter((i) => i.status === 'unpaid').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => setCurrentTab('auctions')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                AURA
              </span>
              <span className="text-xs font-medium tracking-widest text-slate-400 uppercase">
                Auctions
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, clean text hover underlines) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('auctions')}
              className={`whitespace-nowrap transition-colors py-1 relative ${
                currentTab === 'auctions'
                  ? 'text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Lots
              {currentTab === 'auctions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard & Analytics
              {currentTab === 'dashboard' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('invoices')}
              className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
                currentTab === 'invoices'
                  ? 'text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Invoices
              {unpaidInvoicesCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
              {currentTab === 'invoices' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`whitespace-nowrap transition-colors py-1 relative ${
                currentTab === 'profile'
                  ? 'text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bidder Profile & Settings
              {currentTab === 'profile' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Escrow Balance, Email Alerts, Mobile Trigger) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Email Notification Inbox Trigger */}
            <button
              onClick={() => setEmailModalOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none"
              title="Transactional Emails (Outbid & Winning Notices)"
            >
              <Bell className="w-5 h-5" />
              {unreadEmailsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadEmailsCount}
                </span>
              )}
            </button>

            {/* Escrow Balance Pill/Button */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-200/60 rounded-lg transition-colors text-xs text-sky-900"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-medium text-slate-600">Vault:</span>
              <span className="font-mono font-semibold text-sky-800">
                {formatCurrency(user.vaultBalance)}
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => { setCurrentTab('auctions'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
              currentTab === 'auctions' ? 'bg-sky-50 text-sky-800' : 'text-slate-700'
            }`}
          >
            Live Lots
          </button>
          <button
            onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
              currentTab === 'dashboard' ? 'bg-sky-50 text-sky-800' : 'text-slate-700'
            }`}
          >
            Dashboard & Real-Time Stats
          </button>
          <button
            onClick={() => { setCurrentTab('invoices'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center justify-between ${
              currentTab === 'invoices' ? 'bg-sky-50 text-sky-800' : 'text-slate-700'
            }`}
          >
            <span>Invoices & Payments</span>
            {unpaidInvoicesCount > 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                {unpaidInvoicesCount} Pending
              </span>
            )}
          </button>
          <button
            onClick={() => { setCurrentTab('profile'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
              currentTab === 'profile' ? 'bg-sky-50 text-sky-800' : 'text-slate-700'
            }`}
          >
            Bidder Profile & Settings
          </button>
          <button
            onClick={() => { setEmailModalOpen(true); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 flex items-center justify-between border-t border-slate-100 pt-3"
          >
            <span>Email Alert Inbox</span>
            {unreadEmailsCount > 0 && (
              <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">
                {unreadEmailsCount} Unread
              </span>
            )}
          </button>
          <div className="pt-2 px-3 text-xs text-slate-500 flex items-center justify-between">
            <span>Escrow Vault Balance</span>
            <span className="font-mono font-semibold text-slate-800">
              {formatCurrency(user.vaultBalance)}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

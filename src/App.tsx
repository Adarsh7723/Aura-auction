import React from 'react';
import { AuctionProvider, useAuctions } from './context/AuctionContext';
import { Header } from './components/Header';
import { AuctionsView } from './components/AuctionsView';
import { DashboardView } from './components/DashboardView';
import { InvoicesView } from './components/InvoicesView';
import { ProfileView } from './components/ProfileView';
import { LotDetailModal } from './components/LotDetailModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { EmailInboxModal } from './components/EmailInboxModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentTab } = useAuctions();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {currentTab === 'auctions' && <AuctionsView />}
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'invoices' && <InvoicesView />}
        {currentTab === 'profile' && <ProfileView />}
      </main>

      <Footer />

      {/* Global interactive modals */}
      <LotDetailModal />
      <PaymentGatewayModal />
      <EmailInboxModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuctionProvider>
      <AppContent />
    </AuctionProvider>
  );
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuctionItem, Invoice, EmailNotification, UserProfile, Bid } from '../types/auction';
import { INITIAL_AUCTIONS, INITIAL_INVOICES, INITIAL_NOTIFICATIONS, INITIAL_USER } from '../data/mockData';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AuctionContextType {
  auctions: AuctionItem[];
  user: UserProfile;
  invoices: Invoice[];
  emails: EmailNotification[];
  selectedLot: AuctionItem | null;
  activeInvoice: Invoice | null;
  emailModalOpen: boolean;
  selectedEmail: EmailNotification | null;
  toasts: Toast[];
  currentTab: 'auctions' | 'dashboard' | 'invoices' | 'profile';
  setCurrentTab: (tab: 'auctions' | 'dashboard' | 'invoices' | 'profile') => void;
  setSelectedLot: (lot: AuctionItem | null) => void;
  setActiveInvoice: (invoice: Invoice | null) => void;
  setEmailModalOpen: (open: boolean) => void;
  setSelectedEmail: (email: EmailNotification | null) => void;
  placeBid: (lotId: string, amount: number) => { success: boolean; message: string };
  simulateOutbid: (lotId: string) => void;
  simulateEndLot: (lotId: string) => void;
  processPayment: (invoiceId: string, paymentMethod: string) => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (prefs: Partial<UserProfile['preferences']>) => void;
  depositFunds: (amount: number) => void;
  markEmailAsRead: (emailId: string) => void;
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  resetDemoData: () => void;
}

const AuctionContext = createContext<AuctionContextType | null>(null);

const STORAGE_KEY_AUCTIONS = 'aura_auctions_data_v2';
const STORAGE_KEY_INVOICES = 'aura_invoices_data_v2';
const STORAGE_KEY_NOTIFS = 'aura_notifications_data_v2';
const STORAGE_KEY_USER = 'aura_user_data_v2';

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUCTIONS);
      return saved ? JSON.parse(saved) : INITIAL_AUCTIONS;
    } catch {
      return INITIAL_AUCTIONS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [emails, setEmails] = useState<EmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [currentTab, setCurrentTab] = useState<'auctions' | 'dashboard' | 'invoices' | 'profile'>('auctions');
  const [selectedLot, setSelectedLot] = useState<AuctionItem | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUCTIONS, JSON.stringify(auctions));
  }, [auctions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...toastData, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync selected lot with auction updates
  useEffect(() => {
    if (selectedLot) {
      const updated = auctions.find((a) => a.id === selectedLot.id);
      if (updated && updated !== selectedLot) {
        setSelectedLot(updated);
      }
    }
  }, [auctions, selectedLot]);

  // Automated Invoicing trigger function
  const triggerWinningInvoice = useCallback((lot: AuctionItem, winningBid: number) => {
    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const buyersPremium = Math.round(winningBid * 0.10);
    const shippingFee = 180; // White-glove insured delivery
    const tax = Math.round(winningBid * 0.0825);
    const totalAmount = winningBid + buyersPremium + shippingFee + tax;

    const newInvoice: Invoice = {
      id: invoiceId,
      auctionId: lot.id,
      auctionTitle: lot.title,
      lotNumber: lot.lotNumber,
      imageUrl: lot.imageUrl,
      issuedAt: Date.now(),
      dueDate: Date.now() + 72 * 3600 * 1000,
      hammerPrice: winningBid,
      buyersPremium,
      shippingFee,
      tax,
      totalAmount,
      status: 'unpaid',
      escrowReference: `ESCROW-AURA-${Math.floor(100000 + Math.random() * 900000)}`,
      shippingAddress: { ...user.shippingAddress }
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Send winning confirmation transactional email
    const newEmail: EmailNotification = {
      id: 'email-' + Math.random().toString(36).slice(2, 9),
      type: 'winner',
      subject: `🏆 Winning Confirmation: You won ${lot.lotNumber} — ${lot.title}!`,
      recipientEmail: user.email,
      timestamp: Date.now(),
      read: false,
      auctionId: lot.id,
      auctionTitle: lot.title,
      amount: totalAmount,
      actionType: 'pay_invoice',
      previewText: `Congratulations! You are the winning bidder with a hammer price of $${winningBid.toLocaleString()}. Invoice #${invoiceId} generated.`,
      bodyHtml: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="color: #0284c7; margin-top: 0;">Auction Won — Hammer Price $${winningBid.toLocaleString()}</h2>
          <p>Dear ${user.name},</p>
          <p>We are delighted to confirm that you have won <strong>${lot.lotNumber} — ${lot.title}</strong> at the Aura Evening Sale.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="color: #64748b; padding: 4px 0;">Hammer Price:</td><td style="text-align: right; font-weight: 600;">$${winningBid.toLocaleString()}</td></tr>
              <tr><td style="color: #64748b; padding: 4px 0;">Buyer's Premium (10%):</td><td style="text-align: right; font-weight: 600;">$${buyersPremium.toLocaleString()}</td></tr>
              <tr><td style="color: #64748b; padding: 4px 0;">Insured White-Glove Transport:</td><td style="text-align: right; font-weight: 600;">$${shippingFee.toLocaleString()}</td></tr>
              <tr><td style="color: #64748b; padding: 4px 0;">Applicable VAT/Tax:</td><td style="text-align: right; font-weight: 600;">$${tax.toLocaleString()}</td></tr>
              <tr style="border-top: 1px solid #cbd5e1;"><td style="padding: 10px 0 4px 0; font-weight: 700; font-size: 16px;">Total Settlement Due:</td><td style="text-align: right; padding: 10px 0 4px 0; font-weight: 700; font-size: 16px; color: #0284c7;">$${totalAmount.toLocaleString()}</td></tr>
            </table>
          </div>
          <p style="font-size: 14px; color: #475569;">To release the lot for insured white-glove transport, please complete the secure escrow payment within 72 hours.</p>
        </div>
      `
    };

    setEmails((prev) => [newEmail, ...prev]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    addToast({
      type: 'success',
      title: '🏆 You Won the Auction!',
      message: `Hammer fell on ${lot.lotNumber} at $${winningBid.toLocaleString()}. Official invoice #${invoiceId} generated.`,
      action: {
        label: 'Pay Invoice',
        onClick: () => setActiveInvoice(newInvoice)
      }
    });

    if (user.preferences.autoTriggerInvoiceModal) {
      setTimeout(() => {
        setActiveInvoice(newInvoice);
      }, 900);
    }
  }, [user, addToast]);

  // Place bid handler
  const placeBid = useCallback((lotId: string, amount: number) => {
    const lot = auctions.find((a) => a.id === lotId);
    if (!lot) return { success: false, message: 'Auction lot not found.' };

    const minRequired = lot.currentBid + lot.minIncrement;
    if (amount < minRequired) {
      return {
        success: false,
        message: `Minimum acceptable bid is $${minRequired.toLocaleString()}.`
      };
    }

    const newBid: Bid = {
      id: 'b-' + Math.random().toString(36).slice(2, 9),
      bidder: `You (${user.name})`,
      bidderMasked: `${user.name} (You)`,
      amount,
      timestamp: Date.now(),
      isUser: true
    };

    setAuctions((prev) =>
      prev.map((item) => {
        if (item.id === lotId) {
          return {
            ...item,
            currentBid: amount,
            bidCount: item.bidCount + 1,
            bids: [newBid, ...item.bids]
          };
        }
        return item;
      })
    );

    addToast({
      type: 'success',
      title: 'Bid Placed Successfully',
      message: `You are now the highest bidder at $${amount.toLocaleString()} on ${lot.lotNumber}.`
    });

    // Send email notification for bid placement confirmation
    const emailConfirm: EmailNotification = {
      id: 'email-' + Math.random().toString(36).slice(2, 9),
      type: 'bid_confirmed',
      subject: `✓ Bid Confirmed: $${amount.toLocaleString()} on ${lot.lotNumber} (${lot.title})`,
      recipientEmail: user.email,
      timestamp: Date.now(),
      read: true,
      auctionId: lot.id,
      auctionTitle: lot.title,
      amount,
      actionType: 'view_lot',
      previewText: `Your bid of $${amount.toLocaleString()} was accepted and is currently the leading bid.`,
      bodyHtml: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; line-height: 1.6;">
          <p>Dear ${user.name},</p>
          <p>Your bid of <strong>$${amount.toLocaleString()}</strong> on <strong>${lot.lotNumber} — ${lot.title}</strong> has been confirmed on the live bidding floor.</p>
          <p>You currently hold the leading bid. We will notify you immediately if another collector places a counter-bid.</p>
        </div>
      `
    };
    setEmails((prev) => [emailConfirm, ...prev]);

    return { success: true, message: 'Bid registered successfully.' };
  }, [auctions, user, addToast]);

  // Simulate an outbid on a lot where user is highest bidder
  const simulateOutbid = useCallback((lotId: string) => {
    const lot = auctions.find((a) => a.id === lotId);
    if (!lot) return;

    const counterBidders = ['GenevaCollector', 'AtelierNordic', 'VanguardPatron', 'SovereignBid', 'TokyoArchival'];
    const randomBidder = counterBidders[Math.floor(Math.random() * counterBidders.length)];
    const counterAmount = lot.currentBid + lot.minIncrement;

    const counterBid: Bid = {
      id: 'b-' + Math.random().toString(36).slice(2, 9),
      bidder: randomBidder,
      bidderMasked: `${randomBidder.slice(0, 3)}***_${randomBidder.slice(-2)}`,
      amount: counterAmount,
      timestamp: Date.now(),
      isUser: false
    };

    setAuctions((prev) =>
      prev.map((item) => {
        if (item.id === lotId) {
          return {
            ...item,
            currentBid: counterAmount,
            bidCount: item.bidCount + 1,
            bids: [counterBid, ...item.bids]
          };
        }
        return item;
      })
    );

    // If user's alerts are enabled, send outbid email & toast
    if (user.preferences.emailOutbidAlerts) {
      const outbidEmail: EmailNotification = {
        id: 'email-' + Math.random().toString(36).slice(2, 9),
        type: 'outbid',
        subject: `⚡ Outbid Alert: ${lot.lotNumber} — ${lot.title}`,
        recipientEmail: user.email,
        timestamp: Date.now(),
        read: false,
        auctionId: lot.id,
        auctionTitle: lot.title,
        amount: counterAmount,
        actionType: 'rebid',
        previewText: `Another collector just placed a higher bid of $${counterAmount.toLocaleString()} on ${lot.lotNumber}.`,
        bodyHtml: `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; line-height: 1.6;">
            <p>Dear ${user.name},</p>
            <p>You have been outbid on <strong>${lot.lotNumber} — ${lot.title}</strong>.</p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin: 16px 0;">
              <p style="margin: 0; font-size: 13px; color: #1d4ed8;">Current Leading Bid: $${counterAmount.toLocaleString()}</p>
              <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #1e3a8a;">Suggested Counter Bid: $${(counterAmount + lot.minIncrement).toLocaleString()}</p>
            </div>
            <p style="font-size: 14px; color: #64748b;">The auction remains open. Click the rebid button to reclaim the winning position.</p>
          </div>
        `
      };

      setEmails((prev) => [outbidEmail, ...prev]);

      addToast({
        type: 'alert',
        title: '⚡ Outbid Alert',
        message: `A new bid of $${counterAmount.toLocaleString()} was placed on ${lot.lotNumber}.`,
        action: {
          label: 'Counter Bid',
          onClick: () => {
            const currentLot = auctions.find((a) => a.id === lotId);
            if (currentLot) setSelectedLot(currentLot);
          }
        }
      });
    }
  }, [auctions, user, addToast]);

  // Simulate ending the lot immediately (test winning flow)
  const simulateEndLot = useCallback((lotId: string) => {
    const lot = auctions.find((a) => a.id === lotId);
    if (!lot) return;

    const highestBid = lot.bids[0];
    const isUserWinner = highestBid?.isUser ?? false;
    const finalAmount = highestBid ? highestBid.amount : lot.currentBid;

    setAuctions((prev) =>
      prev.map((item) => {
        if (item.id === lotId) {
          return {
            ...item,
            status: 'closed',
            endTime: Date.now() - 1000,
            winner: {
              bidder: isUserWinner ? user.name : (highestBid?.bidder || 'Collector_Private'),
              amount: finalAmount,
              isUser: isUserWinner,
              timestamp: Date.now()
            }
          };
        }
        return item;
      })
    );

    if (isUserWinner) {
      triggerWinningInvoice(lot, finalAmount);
    } else {
      addToast({
        type: 'info',
        title: 'Auction Ended',
        message: `${lot.lotNumber} closed at $${finalAmount.toLocaleString()}. Winner was ${highestBid?.bidderMasked || 'Private Collector'}.`
      });
    }
  }, [auctions, user, triggerWinningInvoice, addToast]);

  // Process secure escrow payment
  const processPayment = useCallback(async (invoiceId: string, paymentMethod: string): Promise<boolean> => {
    // Artificial 1.2s secure gateway processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return false;

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-ESCROW-${Date.now().toString().slice(-4)}`;

    // Update invoice status
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'paid',
            paidAt: Date.now(),
            paymentMethod,
            transactionId: txnId
          };
        }
        return inv;
      })
    );

    // If paying via vault balance, deduct
    if (paymentMethod.toLowerCase().includes('vault')) {
      setUser((prev) => ({
        ...prev,
        vaultBalance: Math.max(0, prev.vaultBalance - invoice.totalAmount)
      }));
    }

    // Send confirmation email
    const confirmEmail: EmailNotification = {
      id: 'email-' + Math.random().toString(36).slice(2, 9),
      type: 'payment_confirmed',
      subject: `✓ Payment Received & Escrow Secured: ${invoice.lotNumber} (${invoice.id})`,
      recipientEmail: user.email,
      timestamp: Date.now(),
      read: false,
      auctionId: invoice.auctionId,
      auctionTitle: invoice.auctionTitle,
      amount: invoice.totalAmount,
      actionType: 'view_invoice',
      previewText: `Settlement of $${invoice.totalAmount.toLocaleString()} confirmed. Certificate of Authenticity and White-Glove dispatch released.`,
      bodyHtml: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="color: #0284c7; margin-top: 0;">Payment Confirmation & Escrow Release</h2>
          <p>Dear ${user.name},</p>
          <p>Your payment of <strong>$${invoice.totalAmount.toLocaleString()}</strong> for <strong>${invoice.lotNumber} — ${invoice.auctionTitle}</strong> has been successfully verified through our 256-bit encrypted escrow settlement vault.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">Transaction Reference: <strong>${txnId}</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Payment Method: <strong>${paymentMethod}</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Escrow Contract: <strong>${invoice.escrowReference}</strong></p>
          </div>
          <p style="font-size: 14px; color: #475569;">Our fine art logistics team has initiated white-glove packaging. Delivery tracking will be updated within 24 hours.</p>
        </div>
      `
    };

    setEmails((prev) => [confirmEmail, ...prev]);

    addToast({
      type: 'success',
      title: 'Payment Secured & Confirmed',
      message: `Invoice #${invoiceId} settled. Carrier dispatch initiated.`
    });

    return true;
  }, [invoices, user, addToast]);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    addToast({
      type: 'info',
      title: 'Profile Updated',
      message: 'Your personal information was saved successfully.'
    });
  }, [addToast]);

  const updatePreferences = useCallback((prefs: Partial<UserProfile['preferences']>) => {
    setUser((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs }
    }));
    addToast({
      type: 'info',
      title: 'Preferences Saved',
      message: 'Notification and security settings updated.'
    });
  }, [addToast]);

  const depositFunds = useCallback((amount: number) => {
    setUser((prev) => ({ ...prev, vaultBalance: prev.vaultBalance + amount }));
    addToast({
      type: 'success',
      title: 'Funds Deposited',
      message: `$${amount.toLocaleString()} added to your Aura Vault Balance.`
    });
  }, [addToast]);

  const markEmailAsRead = useCallback((emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true } : e))
    );
  }, []);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_AUCTIONS);
    localStorage.removeItem(STORAGE_KEY_INVOICES);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    localStorage.removeItem(STORAGE_KEY_USER);
    setAuctions(INITIAL_AUCTIONS);
    setInvoices(INITIAL_INVOICES);
    setEmails(INITIAL_NOTIFICATIONS);
    setUser(INITIAL_USER);
    addToast({
      type: 'info',
      title: 'Demo State Reset',
      message: 'Auctions, bids, invoices, and notifications restored to original demo state.'
    });
  }, [addToast]);

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        user,
        invoices,
        emails,
        selectedLot,
        activeInvoice,
        emailModalOpen,
        selectedEmail,
        toasts,
        currentTab,
        setCurrentTab,
        setSelectedLot,
        setActiveInvoice,
        setEmailModalOpen,
        setSelectedEmail,
        placeBid,
        simulateOutbid,
        simulateEndLot,
        processPayment,
        updateUserProfile,
        updatePreferences,
        depositFunds,
        markEmailAsRead,
        dismissToast,
        addToast,
        resetDemoData
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuctions = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuctions must be used within an AuctionProvider');
  }
  return context;
};

export interface Bid {
  id: string;
  bidder: string;
  bidderMasked: string;
  amount: number;
  timestamp: number;
  isUser: boolean;
}

export interface AuctionItem {
  id: string;
  lotNumber: string;
  title: string;
  category: 'Fine Horology' | 'Modernist Design' | 'Contemporary Art' | 'Vintage Cameras' | 'Studio Glass';
  description: string;
  details: {
    provenance: string;
    condition: string;
    year: string;
    authentication: string;
    estimateMin: number;
    estimateMax: number;
    specifications: string;
  };
  startingBid: number;
  reservePrice: number;
  currentBid: number;
  bidCount: number;
  minIncrement: number;
  endTime: number; // Unix timestamp in ms
  status: 'live' | 'ending_soon' | 'closed';
  imageUrl: string;
  featured: boolean;
  bids: Bid[];
  winner?: {
    bidder: string;
    amount: number;
    isUser: boolean;
    timestamp: number;
  } | null;
}

export interface Invoice {
  id: string;
  auctionId: string;
  auctionTitle: string;
  lotNumber: string;
  imageUrl: string;
  issuedAt: number;
  dueDate: number;
  hammerPrice: number;
  buyersPremium: number; // 10%
  shippingFee: number;
  tax: number; // ~8%
  totalAmount: number;
  status: 'unpaid' | 'paid';
  transactionId?: string;
  paidAt?: number;
  paymentMethod?: string;
  escrowReference: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface EmailNotification {
  id: string;
  type: 'outbid' | 'winner' | 'bid_confirmed' | 'payment_confirmed';
  subject: string;
  recipientEmail: string;
  timestamp: number;
  read: boolean;
  auctionId: string;
  auctionTitle: string;
  amount: number;
  actionType: 'rebid' | 'pay_invoice' | 'view_invoice' | 'view_lot';
  previewText: string;
  bodyHtml: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bidderId: string;
  vaultBalance: number;
  verifiedIdentity: boolean;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethods: Array<{
    id: string;
    brand: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expiry: string;
    isDefault: boolean;
  }>;
  preferences: {
    emailOutbidAlerts: boolean;
    emailWinningAlerts: boolean;
    emailWeeklyDigest: boolean;
    smsAlerts: boolean;
    twoFactorAuth: boolean;
    autoTriggerInvoiceModal: boolean;
  };
}

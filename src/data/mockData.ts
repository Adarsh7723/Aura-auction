import { AuctionItem, Invoice, EmailNotification, UserProfile } from '../types/auction';

// High-fidelity image assets generated for Aura Auctions
import watchImg from '../assets/images/auction_chronograph_watch_1792169464942.jpg';
import chairImg from '../assets/images/auction_modernist_chair_1792169465994.jpg';
import canvasImg from '../assets/images/auction_abstract_canvas_1792169466997.jpg';
import cameraImg from '../assets/images/auction_vintage_camera_1792169467530.jpg';
import glassImg from '../assets/images/auction_sculptural_vase_1792169466885.jpg';

const now = Date.now();
const hour = 3600 * 1000;
const minute = 60 * 1000;

export const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: 'lot-101',
    lotNumber: 'LOT 101',
    title: 'Aethelred Tourbillon Chronograph No. 04',
    category: 'Fine Horology',
    description: 'Bespoke 41mm platinum case featuring a deep cobalt guilloché dial, manual-wind column wheel chronograph, and flying 60-second tourbillon escapement. Complete with original archival box, loupe, and factory certificate.',
    details: {
      provenance: 'Acquired directly from the Genevan atelier, private Zurich collection.',
      condition: 'Pristine, unworn with original protective case seal.',
      year: '2023',
      authentication: 'Certified by Fondation Horlogère Suisse & Escrow Inspected',
      estimateMin: 42000,
      estimateMax: 55000,
      specifications: 'Platinum 950, 41mm diameter, sapphire crystal caseback, alligator strap with deployant buckle.'
    },
    startingBid: 28000,
    reservePrice: 38000,
    currentBid: 44500,
    bidCount: 18,
    minIncrement: 1000,
    endTime: now + 4 * hour + 25 * minute,
    status: 'live',
    imageUrl: watchImg,
    featured: true,
    bids: [
      { id: 'b-101-5', bidder: 'You (Adarsh G.)', bidderMasked: 'Adarsh G. (You)', amount: 44500, timestamp: now - 8 * minute, isUser: true },
      { id: 'b-101-4', bidder: 'Collector_88', bidderMasked: 'Col***_88', amount: 43500, timestamp: now - 22 * minute, isUser: false },
      { id: 'b-101-3', bidder: 'GenevaVault', bidderMasked: 'Gen***ult', amount: 41000, timestamp: now - 50 * minute, isUser: false },
      { id: 'b-101-2', bidder: 'NordicBid', bidderMasked: 'Nor***Bid', amount: 38000, timestamp: now - 2 * hour, isUser: false },
      { id: 'b-101-1', bidder: 'SwissArchive', bidderMasked: 'Swi***ive', amount: 32000, timestamp: now - 3 * hour, isUser: false },
    ],
    winner: null
  },
  {
    id: 'lot-102',
    lotNumber: 'LOT 102',
    title: 'Original 1956 Eames 670 Lounge Chair & 671 Ottoman',
    category: 'Modernist Design',
    description: 'First-generation production in Brazilian rosewood veneer and patinated caramel aniline glove leather. Features five-star die-cast aluminum base with black enamel accents and original rectangular foil Herman Miller label intact.',
    details: {
      provenance: 'Commissioned by a prominent Chicago modernist architectural firm; held in single private family estate.',
      condition: 'Superb vintage condition, natural warm leather patina with no tears; original shock mounts fully stable.',
      year: '1956',
      authentication: 'Herman Miller Archival Reference verified & authenticated',
      estimateMin: 14000,
      estimateMax: 18500,
      specifications: 'Brazilian Rosewood plywood shells, die-cast aluminum, full-grain aniline leather.'
    },
    startingBid: 8500,
    reservePrice: 12000,
    currentBid: 15500,
    bidCount: 24,
    minIncrement: 500,
    endTime: now + 1 * hour + 12 * minute,
    status: 'ending_soon',
    imageUrl: chairImg,
    featured: false,
    bids: [
      { id: 'b-102-4', bidder: 'ArchDesign_NY', bidderMasked: 'Arc***_NY', amount: 15500, timestamp: now - 4 * minute, isUser: false },
      { id: 'b-102-3', bidder: 'You (Adarsh G.)', bidderMasked: 'Adarsh G. (You)', amount: 15000, timestamp: now - 15 * minute, isUser: true },
      { id: 'b-102-2', bidder: 'MidCenturyLord', bidderMasked: 'Mid***ord', amount: 14000, timestamp: now - 42 * minute, isUser: false },
      { id: 'b-102-1', bidder: 'BauhausHaven', bidderMasked: 'Bau***ven', amount: 12500, timestamp: now - 1 * hour, isUser: false },
    ],
    winner: null
  },
  {
    id: 'lot-103',
    lotNumber: 'LOT 103',
    title: 'Elena Vance — "Strata of Morning Sky", 2021',
    category: 'Contemporary Art',
    description: 'Large-scale oil, mineral pigment, and cold wax on Belgian linen. Demonstrating Vance’s signature quiet spatial resonance with graded cerulean, slate tones, and textured alabaster brushwork. Signed and dated verso.',
    details: {
      provenance: 'Private collection, Basel. Exhibited at Zurich Contemporary Biennial 2022.',
      condition: 'Excellent, unframed Belgian linen mounted on custom aluminum tension stretcher.',
      year: '2021',
      authentication: 'Direct studio certificate signed by the artist and Pace Gallery registry',
      estimateMin: 22000,
      estimateMax: 30000,
      specifications: '180 × 160 cm (70.8 × 63 in), Oil and mineral pigment on Belgian linen.'
    },
    startingBid: 16000,
    reservePrice: 20000,
    currentBid: 24000,
    bidCount: 14,
    minIncrement: 1000,
    endTime: now + 7 * hour + 45 * minute,
    status: 'live',
    imageUrl: canvasImg,
    featured: false,
    bids: [
      { id: 'b-103-3', bidder: 'ArtisGallery', bidderMasked: 'Art***ery', amount: 24000, timestamp: now - 35 * minute, isUser: false },
      { id: 'b-103-2', bidder: 'ModernPatron', bidderMasked: 'Mod***ron', amount: 22000, timestamp: now - 2 * hour, isUser: false },
      { id: 'b-103-1', bidder: 'Curator_West', bidderMasked: 'Cur***est', amount: 19000, timestamp: now - 4 * hour, isUser: false },
    ],
    winner: null
  },
  {
    id: 'lot-104',
    lotNumber: 'LOT 104',
    title: 'Leica M4 Chrome Rangefinder & Summicron 50mm f/2',
    category: 'Vintage Cameras',
    description: 'Rare 1968 Wetzlar production serial #1234567, accompanied by rigid Summicron 50mm f/2 dual-range lens with matching optical viewfinder attachment, original presentation packaging, and factory test target certificate.',
    details: {
      provenance: 'Single owner, renowned German architectural photographer estate.',
      condition: 'Near mint (A+); shutter speeds tested within 2% factory tolerance. Clean optics without haze.',
      year: '1968',
      authentication: 'Leica Historical Society Verification & Optical Bench Certificate',
      estimateMin: 6500,
      estimateMax: 9000,
      specifications: 'Mechanical 35mm rangefinder, 0.72x magnification viewfinder, M-mount.'
    },
    startingBid: 4200,
    reservePrice: 6000,
    currentBid: 7800,
    bidCount: 19,
    minIncrement: 250,
    endTime: now + 12 * minute, // Very close to ending! Ideal for live simulation
    status: 'ending_soon',
    imageUrl: cameraImg,
    featured: false,
    bids: [
      { id: 'b-104-3', bidder: 'You (Adarsh G.)', bidderMasked: 'Adarsh G. (You)', amount: 7800, timestamp: now - 2 * minute, isUser: true },
      { id: 'b-104-2', bidder: 'StreetAnalog', bidderMasked: 'Str***log', amount: 7500, timestamp: now - 9 * minute, isUser: false },
      { id: 'b-104-1', bidder: 'OptikMaster', bidderMasked: 'Opt***ter', amount: 6800, timestamp: now - 30 * minute, isUser: false },
    ],
    winner: null
  },
  {
    id: 'lot-105',
    lotNumber: 'LOT 105',
    title: 'Vincenzo Nason Atelier — "Aether Vessel" Murano 2024',
    category: 'Studio Glass',
    description: 'Free-form hand-blown sculptural vessel featuring Sommerso crystal layering with cobalt vapors and smoky quartz gradients. Unique one-of-a-kind museum exhibition masterpiece.',
    details: {
      provenance: 'Directly from the Murano furnace exhibition, Venice.',
      condition: 'Mint condition, pristine polished crystal base.',
      year: '2024',
      authentication: 'Consortium Promovetro Murano Seal of Origin #041',
      estimateMin: 8000,
      estimateMax: 11500,
      specifications: 'Hand-blown Sommerso lead crystal, 48 cm height, 6.4 kg.'
    },
    startingBid: 4500,
    reservePrice: 6500,
    currentBid: 9200,
    bidCount: 16,
    minIncrement: 500,
    endTime: now + 18 * hour,
    status: 'live',
    imageUrl: glassImg,
    featured: false,
    bids: [
      { id: 'b-105-3', bidder: 'VeniceLover', bidderMasked: 'Ven***ver', amount: 9200, timestamp: now - 18 * minute, isUser: false },
      { id: 'b-105-2', bidder: 'NordicGallery', bidderMasked: 'Nor***ery', amount: 8500, timestamp: now - 1 * hour, isUser: false },
      { id: 'b-105-1', bidder: 'GlassCollector', bidderMasked: 'Gla***tor', amount: 7500, timestamp: now - 3 * hour, isUser: false },
    ],
    winner: null
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Adarsh Goswami',
  email: 'adarshgoswami.work.7723@gmail.com',
  phone: '+1 (415) 890-4421',
  bidderId: 'AURA-8821-AG',
  vaultBalance: 65000,
  verifiedIdentity: true,
  shippingAddress: {
    name: 'Adarsh Goswami',
    street: '450 Sansome Street, Penthouse 12',
    city: 'San Francisco',
    postalCode: '94111',
    country: 'United States'
  },
  paymentMethods: [
    {
      id: 'pm-1',
      brand: 'visa',
      last4: '4242',
      expiry: '09/28',
      isDefault: true
    },
    {
      id: 'pm-2',
      brand: 'amex',
      last4: '8819',
      expiry: '12/29',
      isDefault: false
    }
  ],
  preferences: {
    emailOutbidAlerts: true,
    emailWinningAlerts: true,
    emailWeeklyDigest: false,
    smsAlerts: true,
    twoFactorAuth: true,
    autoTriggerInvoiceModal: true
  }
};

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-7821',
    auctionId: 'lot-archived-99',
    auctionTitle: 'Dieter Rams Braun Audio 1 M Collector Unit',
    lotNumber: 'LOT 084',
    imageUrl: cameraImg,
    issuedAt: now - 5 * 24 * hour,
    dueDate: now + 2 * 24 * hour,
    hammerPrice: 4200,
    buyersPremium: 420,
    shippingFee: 180,
    tax: 336,
    totalAmount: 5136,
    status: 'paid',
    transactionId: 'TXN-99428-SECURE-ESCROW',
    paidAt: now - 4 * 24 * hour,
    paymentMethod: 'Visa ending in 4242 (256-Bit Escrow)',
    escrowReference: 'ESCROW-AURA-US-99014',
    shippingAddress: {
      name: 'Adarsh Goswami',
      street: '450 Sansome Street, Penthouse 12',
      city: 'San Francisco',
      postalCode: '94111',
      country: 'United States'
    }
  }
];

export const INITIAL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: 'notif-1',
    type: 'outbid',
    subject: '⚡ Outbid Notice: Original 1956 Eames 670 Lounge Chair (LOT 102)',
    recipientEmail: 'adarshgoswami.work.7723@gmail.com',
    timestamp: now - 4 * minute,
    read: false,
    auctionId: 'lot-102',
    auctionTitle: 'Original 1956 Eames 670 Lounge Chair & 671 Ottoman',
    amount: 15500,
    actionType: 'rebid',
    previewText: 'A new bid of $15,500 has surpassed your bid of $15,000 on LOT 102.',
    bodyHtml: `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 560px; color: #1e293b;">
        <p style="font-size: 15px; line-height: 1.6;">Dear Adarsh Goswami,</p>
        <p style="font-size: 15px; line-height: 1.6;">Another verified collector has just placed a higher bid of <strong>$15,500</strong> on <strong>LOT 102 — Original 1956 Eames 670 Lounge Chair & 671 Ottoman</strong>.</p>
        <div style="background-color: #f0f7ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #0369a1;">Next Minimum Increment: $500</p>
          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 700; color: #0c4a6e;">Suggested Next Bid: $16,000</p>
        </div>
        <p style="font-size: 14px; color: #64748b;">The auction closes in approximately 1 hour. Click below to reclaim the winning position instantly.</p>
      </div>
    `
  },
  {
    id: 'notif-2',
    type: 'payment_confirmed',
    subject: '✓ Payment Confirmed: Dieter Rams Braun Audio 1 M (Invoice #INV-2026-7821)',
    recipientEmail: 'adarshgoswami.work.7723@gmail.com',
    timestamp: now - 4 * 24 * hour,
    read: true,
    auctionId: 'lot-archived-99',
    auctionTitle: 'Dieter Rams Braun Audio 1 M Collector Unit',
    amount: 5136,
    actionType: 'view_invoice',
    previewText: 'Escrow payment of $5,136.00 settled successfully. Insured delivery in progress.',
    bodyHtml: `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 560px; color: #1e293b;">
        <p style="font-size: 15px; line-height: 1.6;">Dear Adarsh,</p>
        <p style="font-size: 15px; line-height: 1.6;">Your payment of <strong>$5,136.00</strong> has cleared through Aura 256-bit Escrow Vault. White-glove insured carrier dispatch has been scheduled to your San Francisco address.</p>
        <p style="font-size: 13px; color: #64748b;">Transaction Reference: TXN-99428-SECURE-ESCROW · Certificate #COA-RAMS-1102</p>
      </div>
    `
  }
];

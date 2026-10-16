import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  Printer, 
  Download, 
  Truck, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PaymentGatewayModal: React.FC = () => {
  const { activeInvoice, setActiveInvoice, processPayment, user } = useAuctions();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'vault' | 'apple_pay' | 'wire'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(user.name);
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [agreedToEscrow, setAgreedToEscrow] = useState(true);

  if (!activeInvoice) return null;

  const isAlreadyPaid = activeInvoice.status === 'paid' || isCompleted;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    let methodDesc = 'Credit Card (Visa ending in 4242)';
    if (selectedMethod === 'vault') {
      methodDesc = 'Aura Vault Escrow Balance';
    } else if (selectedMethod === 'apple_pay') {
      methodDesc = 'Apple Pay / Tokenized Card';
    } else if (selectedMethod === 'wire') {
      methodDesc = 'Instant Bank Wire / Fedwire Escrow';
    }

    const success = await processPayment(activeInvoice.id, methodDesc);
    setIsProcessing(false);
    if (success) {
      setIsCompleted(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <div>
              <span className="text-sm font-bold text-slate-900">
                Aura Escrow Settlement Gateway
              </span>
              <span className="text-xs text-slate-500 block">
                Invoice {activeInvoice.id} · 256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveInvoice(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close invoice payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {isAlreadyPaid ? (
            /* ================= PAID CONFIRMATION STATE ================= */
            <div className="space-y-6">
              <div className="text-center py-4 border-b border-slate-100">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Payment Secured & Escrow Verified
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Transaction {activeInvoice.transactionId || 'TXN-99841-SECURE-ESCROW'} · Settled via {activeInvoice.paymentMethod || 'Aura Vault'}
                </p>
              </div>

              {/* Printable Official Invoice Card */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/40 space-y-6 print:border-none print:p-0">
                
                {/* Header Strip */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">
                      AURA AUCTIONS
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Settlement & Escrow Depository
                    </span>
                    <span className="text-xs text-slate-400 block font-mono">
                      Ref: {activeInvoice.escrowReference}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800 block">
                      {activeInvoice.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      Date: {formatDate(activeInvoice.issuedAt)}
                    </span>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PAID IN FULL
                    </span>
                  </div>
                </div>

                {/* Billed To / Shipping */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                      Billed & Consigned To
                    </span>
                    <span className="font-semibold text-slate-900 block">{user.name}</span>
                    <span className="text-slate-600 block">{user.shippingAddress.street}</span>
                    <span className="text-slate-600 block">{user.shippingAddress.city}, {user.shippingAddress.postalCode}</span>
                    <span className="text-slate-600 block">{user.shippingAddress.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                      Carrier Dispatch
                    </span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      White-Glove Insured Art Transport
                    </span>
                    <span className="text-slate-500 block mt-1">
                      Tracking: AURA-CARRIER-EXP-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                    <span className="text-slate-500 block">
                      Estimated Dispatch: Within 48 hours
                    </span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-4">Lot Description</th>
                        <th className="py-2.5 px-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">
                            {activeInvoice.lotNumber} — {activeInvoice.auctionTitle}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            Winning Hammer Price
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                          {formatCurrency(activeInvoice.hammerPrice)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-slate-600">
                          Buyer's Premium (10%)
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                          {formatCurrency(activeInvoice.buyersPremium)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-slate-600">
                          White-Glove Insured Courier Transport
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                          {formatCurrency(activeInvoice.shippingFee)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-slate-600">
                          Applicable VAT / State Tax (8.25%)
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                          {formatCurrency(activeInvoice.tax)}
                        </td>
                      </tr>
                      <tr className="bg-sky-50/50 font-bold border-t border-slate-200">
                        <td className="py-3 px-4 text-slate-900 text-sm">
                          Total Settled
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-sky-800 text-base">
                          {formatCurrency(activeInvoice.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Authentication & Escrow Seal Note */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="text-slate-600">
                      Escrow Vault Guarantee: Funds released to consignor only upon physical inspection.
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">SHA-256 Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInvoice(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ================= UNPAID PAYMENT GATEWAY FORM ================= */
            <form onSubmit={handlePay} className="space-y-6">
              
              {/* Invoice Breakdown Strip */}
              <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeInvoice.imageUrl}
                      alt={activeInvoice.auctionTitle}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-sky-800">
                        {activeInvoice.lotNumber}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {activeInvoice.auctionTitle}
                      </h3>
                      <span className="text-xs text-slate-500">
                        Winning Hammer: {formatCurrency(activeInvoice.hammerPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                      Total Due
                    </span>
                    <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                      {formatCurrency(activeInvoice.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Fee breakdown details */}
                <div className="mt-4 pt-3 border-t border-sky-200/50 grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Buyer's Premium</span>
                    <span className="font-mono font-medium">{formatCurrency(activeInvoice.buyersPremium)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Insured Transport</span>
                    <span className="font-mono font-medium">{formatCurrency(activeInvoice.shippingFee)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tax / VAT</span>
                    <span className="font-mono font-medium">{formatCurrency(activeInvoice.tax)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
                  Select Settlement Method
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Credit / Debit Card */}
                  <div
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'card'
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-semibold text-slate-900">Credit / Debit Card</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Visa / Amex / MC</span>
                    </div>
                  </div>

                  {/* Option 2: Aura Vault Balance */}
                  <div
                    onClick={() => setSelectedMethod('vault')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'vault'
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-900">Aura Vault Balance</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-700">
                        {formatCurrency(user.vaultBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Option 3: Apple Pay / Google Pay */}
                  <div
                    onClick={() => setSelectedMethod('apple_pay')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'apple_pay'
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-slate-700" />
                        <span className="text-xs font-semibold text-slate-900">Apple Pay / Google Pay</span>
                      </div>
                      <span className="text-[10px] text-slate-400">1-Touch Biometric</span>
                    </div>
                  </div>

                  {/* Option 4: Bank Wire / ACH */}
                  <div
                    onClick={() => setSelectedMethod('wire')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'wire'
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-slate-700" />
                        <span className="text-xs font-semibold text-slate-900">Instant Fedwire / ACH</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Same-Day Escrow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditional Payment Method Input fields */}
              {selectedMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Security CVV
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'vault' && (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Sufficient Escrow Vault Balance
                  </div>
                  <p className="text-emerald-800 text-[11px]">
                    ${activeInvoice.totalAmount.toLocaleString()} will be debited from your available balance of ${user.vaultBalance.toLocaleString()}. Instant clearance with zero card fees.
                  </p>
                </div>
              )}

              {/* Delivery Address Review */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    White-Glove Delivery Destination
                  </span>
                  <span className="font-semibold text-slate-900 block mt-0.5">
                    {user.shippingAddress.name}
                  </span>
                  <span className="text-slate-600 block">
                    {user.shippingAddress.street}, {user.shippingAddress.city}, {user.shippingAddress.postalCode}
                  </span>
                </div>
                <span className="text-[11px] text-sky-700 font-medium">Verified Address</span>
              </div>

              {/* Escrow Agreement Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToEscrow}
                  onChange={(e) => setAgreedToEscrow(e.target.checked)}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                />
                <span>
                  I authorize the 256-bit encrypted escrow settlement of {formatCurrency(activeInvoice.totalAmount)}. I acknowledge that payment remains safeguarded until authenticated delivery handover.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveInvoice(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Pay Later (Within 72 hrs)
                </button>

                <button
                  type="submit"
                  disabled={!agreedToEscrow || isProcessing}
                  className={`px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                    !agreedToEscrow || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-xs'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Encrypting & Securing Escrow...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize {formatCurrency(activeInvoice.totalAmount)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

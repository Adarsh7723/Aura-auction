import React, { useState } from 'react';
import { useAuctions } from '../context/AuctionContext';
import { formatCurrency } from '../utils/formatters';
import { 
  ShieldCheck, 
  CreditCard, 
  Bell, 
  Lock, 
  MapPin, 
  User, 
  Wallet, 
  CheckCircle2, 
  Plus, 
  RefreshCw 
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, updatePreferences, depositFunds, resetDemoData } = useAuctions();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const [street, setStreet] = useState(user.shippingAddress.street);
  const [city, setCity] = useState(user.shippingAddress.city);
  const [postalCode, setPostalCode] = useState(user.shippingAddress.postalCode);
  const [country, setCountry] = useState(user.shippingAddress.country);

  const [depositAmount, setDepositAmount] = useState<number>(10000);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      shippingAddress: {
        name,
        street,
        city,
        postalCode,
        country
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-sky-800 tracking-wider uppercase mb-1">
            <span>Bidder ID: {user.bidderId}</span>
            <span aria-hidden="true">·</span>
            <span>Identity Tier 1 Certified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Bidder Profile & Settings
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Authenticated Escrow Bidder</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Personal info & Shipping Address */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info Form */}
          <form onSubmit={handleSaveInfo} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-semibold text-slate-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Registered Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Receives outbid alerts & invoices</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bidder Classification</label>
                <input
                  type="text"
                  disabled
                  value="Private Collector / High-Net Escrow"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* White-Glove Shipping Address */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Insured Delivery & Consignment Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Save Profile & Address
              </button>
            </div>
          </form>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-semibold text-slate-900">Stored Settlement Methods</h2>
              </div>
              <span className="text-[11px] text-slate-400">256-Bit Tokenized</span>
            </div>

            <div className="space-y-3">
              {user.paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-6 bg-slate-800 text-white font-mono text-[10px] rounded flex items-center justify-center font-bold uppercase">
                      {pm.brand}
                    </div>
                    <div>
                      <span className="font-mono font-semibold text-slate-800 block">
                        •••• •••• •••• {pm.last4}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Expires {pm.expiry}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {pm.isDefault && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Vault Balance & Notification Preferences */}
        <div className="space-y-6">
          
          {/* Aura Vault Depository */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-700" />
                <h3 className="text-xs font-semibold text-sky-950 uppercase tracking-wider">
                  Escrow Vault Balance
                </h3>
              </div>
              <span className="text-[10px] font-mono font-semibold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                FDIC Insured Depository
              </span>
            </div>

            <div>
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {formatCurrency(user.vaultBalance)}
              </span>
              <p className="text-xs text-slate-600 mt-1">
                Zero-fee instant settlement on winning auction invoices.
              </p>
            </div>

            {/* Quick Deposit Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-medium text-slate-700 block">Quick Test Deposit:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => depositFunds(10000)}
                  className="py-1.5 px-3 bg-white hover:bg-sky-100/60 border border-sky-200 text-xs font-medium text-sky-900 rounded-md transition-colors"
                >
                  +$10,000
                </button>
                <button
                  type="button"
                  onClick={() => depositFunds(25000)}
                  className="py-1.5 px-3 bg-white hover:bg-sky-100/60 border border-sky-200 text-xs font-medium text-sky-900 rounded-md transition-colors"
                >
                  +$25,000
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bell className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-semibold text-slate-900">Notification Alerts</h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-start justify-between gap-3 cursor-pointer">
                <div>
                  <span className="font-medium text-slate-900 block">Outbid Alert Emails</span>
                  <span className="text-[11px] text-slate-500">Receive instant counter-bid link when outbid</span>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.emailOutbidAlerts}
                  onChange={(e) => updatePreferences({ emailOutbidAlerts: e.target.checked })}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                />
              </label>

              <label className="flex items-start justify-between gap-3 cursor-pointer border-t border-slate-100 pt-3">
                <div>
                  <span className="font-medium text-slate-900 block">Winning Invoice Emails</span>
                  <span className="text-[11px] text-slate-500">Auto-send official invoice & checkout link</span>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.emailWinningAlerts}
                  onChange={(e) => updatePreferences({ emailWinningAlerts: e.target.checked })}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                />
              </label>

              <label className="flex items-start justify-between gap-3 cursor-pointer border-t border-slate-100 pt-3">
                <div>
                  <span className="font-medium text-slate-900 block">Auto-Trigger Payment Gateway</span>
                  <span className="text-[11px] text-slate-500">Instantly open checkout modal upon winning</span>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.autoTriggerInvoiceModal}
                  onChange={(e) => updatePreferences({ autoTriggerInvoiceModal: e.target.checked })}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                />
              </label>

              <label className="flex items-start justify-between gap-3 cursor-pointer border-t border-slate-100 pt-3">
                <div>
                  <span className="font-medium text-slate-900 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-slate-500">Requires biometrics or security code for bids &gt; $50k</span>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences.twoFactorAuth}
                  onChange={(e) => updatePreferences({ twoFactorAuth: e.target.checked })}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                />
              </label>
            </div>
          </div>

          {/* Reset Demo State Button */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-800 block">Reset Interactive Demo</span>
              <span className="text-[11px] text-slate-500">Restore original lots, bids, and invoices</span>
            </div>
            <button
              type="button"
              onClick={resetDemoData}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { ShieldCheck, Lock, Award, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
          
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">AURA</span>
              <span className="text-xs font-medium tracking-widest text-slate-400 uppercase">Auctions</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated fine horology, modernist design icons, and museum-grade contemporary art. Floor bidding backed by 256-bit encrypted escrow vaults.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Catalog Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Fine Swiss Horology</li>
              <li>Mid-Century Modernist Design</li>
              <li>Contemporary Oil & Canvas</li>
              <li>Collector Mechanical Optics</li>
              <li>Sommerso Studio Glass</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Escrow & Security
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>256-Bit SSL Escrow Vault</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                <span>Encrypted Invoicing Gateway</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-sky-600" />
                <span>Fondation Certificate Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-sky-600" />
                <span>White-Glove Insured Transport</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Atelier & Salerooms
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zurich · Geneva · New York · San Francisco
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Inquiries: desk@aura-auctions.com
            </p>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Aura Auctions Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Terms of Bidding</span>
            <span>Escrow Guarantee</span>
            <span>White-Glove Delivery Protocol</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

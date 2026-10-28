import React from 'react';
import { Skull, ShieldAlert, Heart, Terminal, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t-4 border-[#ff0033] py-12 px-4 font-mono text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Skull className="w-6 h-6 text-[#ff0033]" />
            <span className="text-xl font-black uppercase text-white tracking-tighter">
              CARNAGE<span className="text-[#ff0033]">OPTIX</span>
            </span>
          </div>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            The world's most aggressive eyewear forge. Hand-poured oxblood acetate, cold-rolled surgical steel,
            and arterial red reflection lenses designed for the brutalist elite.
          </p>
          <div className="flex items-center space-x-2 text-[10px] text-red-500 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>BIOHAZARD & BALLISTIC APPROVED</span>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-2">
          <h4 className="text-white font-black uppercase text-sm border-b border-zinc-800 pb-1">
            CARNAGE TIERS
          </h4>
          <ul className="space-y-1 text-zinc-400">
            <li>CYBER-VISOR RADICALS</li>
            <li>RAZOR-EDGE SURGICAL STEEL</li>
            <li>NECROTIC AVIATOR MUTATIONS</li>
            <li>10MM CHUNKY MONOLITHS</li>
            <li>PERFORATED MORTUARY HEX</li>
          </ul>
        </div>

        {/* Flexi Project Specs */}
        <div className="space-y-2">
          <h4 className="text-white font-black uppercase text-sm border-b border-zinc-800 pb-1 flex items-center space-x-1.5">
            <Terminal className="w-4 h-4 text-[#ff0033]" />
            <span>FLEXI PROJECT SPECS</span>
          </h4>
          <ul className="space-y-1 text-zinc-400 text-[11px]">
            <li>• Frontend: React 19 + TypeScript + Vite</li>
            <li>• Backend: Node.js + Express 5 REST API</li>
            <li>• Database: MongoDB (MongoDB Compass)</li>
            <li>• Port: 5000 (API) / 5173 (Client)</li>
            <li>• Zero Mock Data in Production</li>
          </ul>
        </div>

        {/* MongoDB Compass Integration */}
        <div className="space-y-2">
          <h4 className="text-white font-black uppercase text-sm border-b border-zinc-800 pb-1 flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>MONGODB COMPASS</span>
          </h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Connect MongoDB Compass to <code className="text-[#ff0033]">mongodb://127.0.0.1:27017</code>.
            Explore database <code className="text-emerald-400">carnage_optix</code> with collections:
            <code className="text-zinc-300"> sunglasses</code>, <code className="text-zinc-300"> orders</code>, and <code className="text-zinc-300"> inquiries</code>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-600 text-[11px] gap-2">
        <p>© 2026 CARNAGE OPTIX. ALL RIGHTS RESERVED IN BLOOD.</p>
        <p className="flex items-center space-x-1">
          <span>FORGED FOR FLEXI PROJECT CA-03</span>
        </p>
      </div>
    </footer>
  );
};


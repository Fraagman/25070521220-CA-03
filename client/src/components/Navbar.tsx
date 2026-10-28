import React from 'react';
import { Skull, ShoppingBag, ShieldAlert, Flame, Crosshair, Wrench, Search } from 'lucide-react';
import type { HealthStatus } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeTab: 'shop' | 'about' | 'custom' | 'track' | 'admin';
  setActiveTab: (tab: 'shop' | 'about' | 'custom' | 'track' | 'admin') => void;
  health: HealthStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  health,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090507] border-b-4 border-[#ff0033] shadow-[0_4px_25px_rgba(255,0,51,0.25)]">
      {/* Ticker / Warning Banner */}
      <div className="bg-[#ff0033] text-black font-black text-xs uppercase tracking-widest py-1 px-4 flex justify-between items-center overflow-hidden border-b-2 border-black">
        <div className="flex items-center space-x-2 animate-pulse font-mono">
          <ShieldAlert className="w-4 h-4" />
          <span>LETHAL UV400 SHIELDING // SURGICAL STEEL & 10MM OXBLOOD ACETATE</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-[11px] font-bold">
          <span>USE CODE: <strong className="bg-black text-[#ff0033] px-1">GORE10</strong> FOR 10% OFF</span>
          <span>•</span>
          <span>MONGODB STATUS: {health?.database === 'connected' ? 'ONLINE (COMPASS READY)' : 'CONNECTING...'}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('shop')}
          className="cursor-pointer flex items-center space-x-3 group"
        >
          <div className="relative p-2 bg-black border-2 border-[#ff0033] shadow-[3px_3px_0px_#ff0033] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <Skull className="w-7 h-7 text-[#ff0033]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic drop-shadow-[2px_2px_0px_#ff0033]">
              CARNAGE<span className="text-[#ff0033]">OPTIX</span>
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-red-500 font-bold">
              OCULAR SLAUGHTER // EST. 2026
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 font-black uppercase text-sm tracking-wider border-2 transition-all ${
              activeTab === 'shop'
                ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-black uppercase text-sm tracking-wider border-2 transition-all ${
              activeTab === 'about'
                ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
            }`}
          >
            Bloodline
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 font-black uppercase text-sm tracking-wider border-2 transition-all ${
              activeTab === 'custom'
                ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
            }`}
          >
            Bespoke Forge
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 font-black uppercase text-sm tracking-wider border-2 transition-all ${
              activeTab === 'track'
                ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 font-black uppercase text-sm tracking-wider border-2 transition-all flex items-center space-x-1 ${
              activeTab === 'admin'
                ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                : 'text-red-400 border-red-900/60 hover:border-[#ff0033] hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Vault Admin</span>
          </button>
        </nav>

        {/* Right Action: Cart Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCart}
            data-testid="cart-button"
            className="relative flex items-center space-x-2 bg-black border-2 border-[#ff0033] text-white px-4 py-2 font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#ff0033] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-[#ff0033]" />
            <span className="hidden sm:inline">GORE BAG</span>
            <span
              data-testid="cart-count-badge"
              className="bg-[#ff0033] text-black font-black text-xs px-2 py-0.5 rounded-none font-mono"
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden flex justify-around bg-black/90 py-2 border-t border-red-900/50 text-xs font-bold uppercase">
        <button
          onClick={() => setActiveTab('shop')}
          className={`px-2 py-1 ${activeTab === 'shop' ? 'text-[#ff0033] underline' : 'text-zinc-400'}`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-2 py-1 ${activeTab === 'about' ? 'text-[#ff0033] underline' : 'text-zinc-400'}`}
        >
          Bloodline
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-2 py-1 ${activeTab === 'custom' ? 'text-[#ff0033] underline' : 'text-zinc-400'}`}
        >
          Forge
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`px-2 py-1 ${activeTab === 'track' ? 'text-[#ff0033] underline' : 'text-zinc-400'}`}
        >
          Track
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-2 py-1 ${activeTab === 'admin' ? 'text-[#ff0033] underline' : 'text-zinc-400'}`}
        >
          Admin
        </button>
      </div>
    </header>
  );
};


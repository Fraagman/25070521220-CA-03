import React from 'react';
import { Skull, Flame, ShieldAlert, Crosshair, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScrollToCatalog: () => void;
  onSelectFeatured: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToCatalog, onSelectFeatured }) => {
  return (
    <section className="relative overflow-hidden bg-[#0a0608] border-b-4 border-[#ff0033] py-16 px-4 md:py-24">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900 rounded-full blur-3xl" />
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, #ff0033 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Warning Badge */}
        <div className="inline-flex items-center space-x-2 bg-black border-2 border-[#ff0033] px-4 py-1.5 mb-6 text-red-500 font-mono text-xs uppercase tracking-widest font-black shadow-[4px_4px_0px_#ff0033]">
          <Flame className="w-4 h-4 text-red-500 animate-bounce" />
          <span>BALLISTIC GRADE EYEWEAR // CARNAGE FORGED</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none mb-6">
          FOR EYES THAT HAVE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0033] via-red-500 to-amber-500 drop-shadow-[0_5px_15px_rgba(255,0,51,0.5)]">
            SEEN TOO MUCH.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl text-zinc-300 text-base md:text-xl font-mono leading-relaxed mb-10 border-l-4 border-r-4 border-[#ff0033] px-6 py-2 bg-black/60">
          Precision sunglasses forged from cold-rolled surgical 316L steel, 10mm monolithic oxblood acetate,
          and arterial crimson polarized shields. Blinding sunlight is powerless against the abyss.
        </p>

        {/* Brutal CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          <button
            onClick={onScrollToCatalog}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-[#ff0033] text-black border-4 border-black font-black text-lg uppercase px-8 py-4 tracking-wider shadow-[6px_6px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-red-600"
          >
            <Crosshair className="w-5 h-5 text-black" />
            <span>ENTER THE CARNAGE</span>
            <ArrowDown className="w-5 h-5" />
          </button>

          <button
            onClick={onSelectFeatured}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-black text-white border-4 border-[#ff0033] font-black text-lg uppercase px-8 py-4 tracking-wider shadow-[6px_6px_0px_#ff0033] hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:bg-zinc-900 transition-all"
          >
            <Skull className="w-5 h-5 text-[#ff0033]" />
            <span>EXSANGUINATOR 3000</span>
          </button>
        </div>

        {/* Brutal Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mt-16 text-left">
          <div className="bg-black/80 border-2 border-red-900/60 p-4 shadow-[4px_4px_0px_#800010]">
            <span className="text-xs font-mono text-red-500 font-bold uppercase block">PROTECTION LEVEL</span>
            <p className="text-xl md:text-2xl font-black text-white mt-1">UV400 LETHAL</p>
            <span className="text-[11px] text-zinc-400 font-mono">100% UVA/UVB Radiation Defense</span>
          </div>

          <div className="bg-black/80 border-2 border-red-900/60 p-4 shadow-[4px_4px_0px_#800010]">
            <span className="text-xs font-mono text-red-500 font-bold uppercase block">FRAME STRENGTH</span>
            <p className="text-xl md:text-2xl font-black text-white mt-1">SURGICAL 316L</p>
            <span className="text-[11px] text-zinc-400 font-mono">Cold-rolled steel & 10mm acetate</span>
          </div>

          <div className="bg-black/80 border-2 border-red-900/60 p-4 shadow-[4px_4px_0px_#800010]">
            <span className="text-xs font-mono text-red-500 font-bold uppercase block">BLOOD DISCOUNT</span>
            <p className="text-xl md:text-2xl font-black text-[#ff0033] mt-1">CODE: GORE10</p>
            <span className="text-[11px] text-zinc-400 font-mono">10% Off All Carnage Purchases</span>
          </div>

          <div className="bg-black/80 border-2 border-red-900/60 p-4 shadow-[4px_4px_0px_#800010]">
            <span className="text-xs font-mono text-red-500 font-bold uppercase block">DATABASE STATUS</span>
            <p className="text-xl md:text-2xl font-black text-emerald-400 mt-1">LIVE MONGODB</p>
            <span className="text-[11px] text-zinc-400 font-mono">Compass Synced Collections</span>
          </div>
        </div>
      </div>
    </section>
  );
};


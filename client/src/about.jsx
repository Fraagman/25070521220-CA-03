import { Skull, ShieldAlert, Zap, Flame, Award } from 'lucide-react';
import './App.css';

const About = () => {
  return (
    <div className="about-cont min-h-screen bg-[#070406] text-white py-16 px-4 font-mono">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Top Header */}
        <div className="border-b-4 border-[#ff0033] pb-6 text-center">
          <span className="text-xs text-red-500 font-bold uppercase tracking-widest block mb-1">
            MANIFESTO // CODE OF CONDUCT
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            THE BLOODLINE PHILOSOPHY
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-zinc-400 mt-3 italic">
            "Standard eyewear is designed for mild afternoons. CARNAGE OPTIX is engineered for the scorched earth."
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-[#0e0a0d] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_#1a0408]">
          <h3 className="text-2xl font-black uppercase text-white mb-4 flex items-center space-x-3">
            <Skull className="w-7 h-7 text-[#ff0033]" />
            <span>FORGED IN VIOLENCE, HONED IN SHADOW</span>
          </h3>
          <p className="text-sm leading-relaxed mb-4 text-zinc-300">
            Founded in the bleak underbelly of neo-industrial cities, CARNAGE OPTIX was birthed out of frustration
            with fragile, pastel-colored, mass-produced plastic sunglasses. We reject the delicate. We embrace
            the unyielding. Every pair in our catalog is forged from surgical grade 316L stainless steel, titanium
            skeletons, or dense 10mm blocks of hand-milled oxblood cellulose acetate.
          </p>
          <p className="text-sm leading-relaxed text-zinc-400">
            Our lenses are treated with proprietary arterial red reflection layers that neutralize 100% of UVA, UVB,
            and lethal UV-C radiation. When you look through a pair of CARNAGE shades, the sun loses its fury, and the
            world transforms into high-contrast crimson obsidian.
          </p>
        </div>

        {/* Pillars / Materials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black border-2 border-red-900/60 p-6 shadow-[4px_4px_0px_#800010]">
            <Flame className="w-8 h-8 text-[#ff0033] mb-4" />
            <h4 className="text-lg font-black uppercase text-white mb-2">1. SURGICAL METALLURGY</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We employ cold-rolled 316L bio-compatible stainless steel and titanium alloy struts. Zero nickel, zero corrosion,
              and impervious to sweat, salt, and atmospheric acid.
            </p>
          </div>

          <div className="bg-black border-2 border-red-900/60 p-6 shadow-[4px_4px_0px_#800010]">
            <ShieldAlert className="w-8 h-8 text-[#ff0033] mb-4" />
            <h4 className="text-lg font-black uppercase text-white mb-2">2. BALLISTIC CERTIFICATION</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All lenses exceed ANSI Z87.1 high-mass and high-velocity impact standards. Tested against high-velocity
              projectiles, shrapnel, and blunt kinetic shocks.
            </p>
          </div>

          <div className="bg-black border-2 border-red-900/60 p-6 shadow-[4px_4px_0px_#800010]">
            <Zap className="w-8 h-8 text-[#ff0033] mb-4" />
            <h4 className="text-lg font-black uppercase text-white mb-2">3. ARTERIAL TINT SCIENCE</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Multi-layer vacuum vapor deposition produces our signature blood-red mirror finish. It blocks blinding glare
              while intensifying depth perception and target contrast.
            </p>
          </div>
        </div>

        {/* Technical Architecture for FLEXI CA-03 */}
        <div className="bg-black border-2 border-zinc-800 p-6 md:p-8 text-xs space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase">
            <Award className="w-5 h-5" />
            <span>FLEXI PROJECT SPECIFICATION // TECH ARCHITECTURE</span>
          </div>
          <p className="text-zinc-400">
            This web application implements a full-stack architecture tailored for the FLEXI project:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-zinc-300">
            <li className="bg-zinc-950 p-3 border border-zinc-800">
              <strong className="text-white block mb-1">FRONTEND:</strong>
              React 19 + JavaScript/JSX + Vite with brutalist styling and custom SVG vector rendering.
            </li>
            <li className="bg-zinc-950 p-3 border border-zinc-800">
              <strong className="text-white block mb-1">BACKEND:</strong>
              Node.js + Express 5 REST API with complete CRUD, filtering, reviews, and order tracking.
            </li>
            <li className="bg-zinc-950 p-3 border border-zinc-800">
              <strong className="text-white block mb-1">DATABASE:</strong>
              MongoDB (MongoDB Compass compatible) holding <code className="text-[#ff0033]">sunglasses</code>,{' '}
              <code className="text-[#ff0033]">orders</code>, and <code className="text-[#ff0033]">inquiries</code>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;


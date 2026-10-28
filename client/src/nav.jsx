import { Link, useLocation } from 'react-router-dom';
import { Skull, ShoppingBag, ShieldAlert } from 'lucide-react';
import './App.css';

const Nav = ({ cartCount = 0, onOpenCart, isConnected = true }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="my-nav sticky top-0 z-40 bg-[#090507] border-b-4 border-[#ff0033] shadow-[0_4px_25px_rgba(255,0,51,0.25)]">
      {/* Ticker / Warning Ribbon */}
      <div className="bg-[#ff0033] text-black font-black text-xs uppercase tracking-widest py-1 px-4 flex justify-between items-center overflow-hidden border-b-2 border-black">
        <div className="flex items-center space-x-2 animate-pulse font-mono">
          <ShieldAlert className="w-4 h-4" />
          <span>LETHAL UV400 SHIELDING // SURGICAL STEEL & 10MM OXBLOOD ACETATE</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-[11px] font-bold font-mono">
          <span>CODE: <strong className="bg-black text-[#ff0033] px-1">GORE10</strong> FOR 10% OFF</span>
          <span>•</span>
          <span>MONGODB COMPASS: {isConnected ? 'ONLINE (PORT 27017)' : 'CONNECTING...'}</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-3 group text-decoration-none">
          <div className="p-2 bg-black border-2 border-[#ff0033] shadow-[3px_3px_0px_#ff0033] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <Skull className="w-7 h-7 text-[#ff0033]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic drop-shadow-[2px_2px_0px_#ff0033] m-0">
              CARNAGE<span className="text-[#ff0033]">OPTIX</span>
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-red-500 font-bold m-0">
              BRUTAL EYEWEAR FORGE
            </p>
          </div>
        </Link>

        {/* Links */}
        <ul className="d-flex items-center space-x-2 m-0 p-0" style={{ listStyle: 'none' }}>
          <li>
            <Link
              to="/"
              className={`px-4 py-2 font-black uppercase text-xs md:text-sm tracking-wider border-2 transition-all block ${
                isActive('/')
                  ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                  : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`px-4 py-2 font-black uppercase text-xs md:text-sm tracking-wider border-2 transition-all block ${
                isActive('/about')
                  ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                  : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`px-4 py-2 font-black uppercase text-xs md:text-sm tracking-wider border-2 transition-all block ${
                isActive('/services')
                  ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                  : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
              }`}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`px-4 py-2 font-black uppercase text-xs md:text-sm tracking-wider border-2 transition-all block ${
                isActive('/contact')
                  ? 'bg-[#ff0033] text-black border-white shadow-[3px_3px_0px_#fff]'
                  : 'text-zinc-300 border-transparent hover:border-[#ff0033] hover:text-white'
              }`}
            >
              Contact!
            </Link>
          </li>
        </ul>

        {/* Gore Bag Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCart}
            data-testid="cart-button"
            className="flex items-center space-x-2 bg-black border-2 border-[#ff0033] text-white px-3 md:px-4 py-2 font-black text-xs md:text-sm uppercase tracking-wider shadow-[4px_4px_0px_#ff0033] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-[#ff0033]" />
            <span className="hidden sm:inline">GORE BAG</span>
            <span
              data-testid="cart-count-badge"
              className="bg-[#ff0033] text-black font-black text-xs px-2 py-0.5 font-mono"
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;


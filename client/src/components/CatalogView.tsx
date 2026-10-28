import React from 'react';
import { Search, Filter, Flame, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import type { Sunglasses, SunglassesCategory, SplatterLevel, FilterOptions } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  products: Sunglasses[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onAddToCart: (product: Sunglasses) => void;
  onViewDetails: (product: Sunglasses) => void;
  onRefresh: () => void;
}

const CATEGORIES: SunglassesCategory[] = [
  'ALL',
  'Cyber-Visor',
  'Razor-Edge',
  'Aviator',
  'Brutal Acetate',
  'Spiked Cat-Eye',
  'Sports Shield',
  'Geometric Wire',
];

const SPLATTER_LEVELS: Array<'ALL' | SplatterLevel> = [
  'ALL',
  'Moderate',
  'Brutal',
  'Lethal',
  'Extreme',
  'Catastrophic',
  'Apocalyptic',
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  loading,
  error,
  filters,
  onFilterChange,
  onAddToCart,
  onViewDetails,
  onRefresh,
}) => {
  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-[#ff0033] pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff0033] font-bold uppercase mb-2">
            <Flame className="w-4 h-4" />
            <span>PRIMARY INVENTORY // MONGODB SYNCED</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            THE CARNAGE CATALOG
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 bg-black border-2 border-zinc-700 hover:border-[#ff0033] text-zinc-300 hover:text-white px-3 py-2 text-xs font-mono uppercase transition-colors"
            title="Fetch fresh data from MongoDB"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ff0033]' : ''}`} />
            <span>SYNC MONGODB</span>
          </button>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-2 border border-zinc-800">
            {products.length} SPECIMENS
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#0e0a0d] border-2 border-zinc-800 p-4 md:p-6 mb-8 space-y-4">
        {/* Search & Sort Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="SEARCH BY WEAPON NAME, SPEC, OR LENS (e.g. VISOR, SCALPEL)..."
              data-testid="search-input"
              className="w-full bg-black border-2 border-zinc-800 focus:border-[#ff0033] text-white pl-10 pr-4 py-2 text-xs font-mono uppercase tracking-wider outline-none transition-colors"
            />
          </div>

          <div>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as FilterOptions['sortBy'],
                })
              }
              className="w-full bg-black border-2 border-zinc-800 focus:border-[#ff0033] text-white px-3 py-2 text-xs font-mono uppercase tracking-wider outline-none"
            >
              <option value="newest">SORT: NEWEST IN VAULT</option>
              <option value="price-asc">SORT: PRICE (LOW TO HIGH)</option>
              <option value="price-desc">SORT: PRICE (HIGH TO LOW)</option>
              <option value="rating">SORT: HIGHEST RATED</option>
              <option value="name">SORT: ALPHABETICAL</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div>
          <label className="block text-[11px] font-mono uppercase text-zinc-400 font-bold mb-2">
            FRAME ARCHITECTURE / CATEGORY:
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat })}
                className={`px-3 py-1 font-mono text-xs uppercase font-bold border transition-all ${
                  (filters.category || 'ALL') === cat
                    ? 'bg-[#ff0033] text-black border-white shadow-[2px_2px_0px_#fff]'
                    : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Splatter Level Pills */}
        <div>
          <label className="block text-[11px] font-mono uppercase text-zinc-400 font-bold mb-2">
            SPLATTER & CARNAGE RATING:
          </label>
          <div className="flex flex-wrap gap-2">
            {SPLATTER_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onFilterChange({ splatterLevel: lvl })}
                className={`px-3 py-1 font-mono text-[11px] uppercase font-bold border transition-all ${
                  (filters.splatterLevel || 'ALL') === lvl
                    ? 'bg-red-800 text-white border-red-500 shadow-[2px_2px_0px_#ff0033]'
                    : 'bg-black text-zinc-500 border-zinc-800 hover:border-red-900 hover:text-zinc-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/80 border-2 border-red-600 text-red-200 mb-8 font-mono text-xs space-y-1">
          <p className="font-bold uppercase">Database Query Notice:</p>
          <p>{error}</p>
          <p className="text-[11px] text-zinc-400 pt-1">
            Ensure your local MongoDB Compass or mongod process is running on port 27017.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20 font-mono space-y-4">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-[#ff0033] rounded-full animate-spin mx-auto" />
          <p className="text-sm uppercase text-zinc-400 tracking-widest font-black">
            QUERYING CARNAGE ARCHIVES FROM MONGODB...
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-20 border-2 border-dashed border-zinc-800 bg-black/40 font-mono space-y-3">
          <p className="text-lg font-black uppercase text-zinc-400">
            NO SPECIMENS MATCH YOUR CRITERIA.
          </p>
          <p className="text-xs text-zinc-600">
            Try resetting your filters or search terms.
          </p>
          <button
            onClick={() => onFilterChange({ search: '', category: 'ALL', splatterLevel: 'ALL' })}
            className="mt-4 bg-[#ff0033] text-black font-bold uppercase text-xs px-4 py-2 border border-black shadow-[2px_2px_0px_#fff]"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}
    </section>
  );
};


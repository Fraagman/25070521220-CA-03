import { useState, useEffect, useCallback } from 'react';
import { Search, Flame, RefreshCcw, Package, Wrench } from 'lucide-react';
import { fetchSunglasses } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderTracker } from '../components/OrderTracker';
import { AdminVault } from '../components/AdminVault';

const CATEGORIES = [
  'ALL',
  'Cyber-Visor',
  'Razor-Edge',
  'Aviator',
  'Brutal Acetate',
  'Spiked Cat-Eye',
  'Sports Shield',
  'Geometric Wire',
];

const SPLATTER_LEVELS = [
  'ALL',
  'Moderate',
  'Brutal',
  'Lethal',
  'Extreme',
  'Catastrophic',
  'Apocalyptic',
];

const MainContentCont = ({
  cart,
  isCartOpen,
  setIsCartOpen,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedPromo,
  setAppliedPromo,
  selectedProduct,
  setSelectedProduct,
  currentUser,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [splatterLevel, setSplatterLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showOrderTracker, setShowOrderTracker] = useState(false);
  const [showAdminVault, setShowAdminVault] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchSunglasses({
      search,
      category,
      splatterLevel,
      sortBy,
    })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to query MongoDB database.');
        setLoading(false);
      });
  }, [search, category, splatterLevel, sortBy]);

  useEffect(() => {
    let ignore = false;
    fetchSunglasses({
      search,
      category,
      splatterLevel,
      sortBy,
    })
      .then((data) => {
        if (!ignore) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to query MongoDB database.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [search, category, splatterLevel, sortBy]);

  const handleProductUpdated = (updatedProduct) => {
    setSelectedProduct(updatedProduct);
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  const handleOrderSuccess = () => {
    onClearCart();
    loadData();
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 py-12">
      {/* View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between border-b-4 border-[#ff0033] pb-4 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff0033] font-bold uppercase mb-1">
            <Flame className="w-4 h-4" />
            <span>PRIMARY INVENTORY // MONGODB COMPASS CONNECTED</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            THE CARNAGE CATALOG
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setShowOrderTracker(!showOrderTracker);
              setShowAdminVault(false);
            }}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase border-2 transition-all flex items-center space-x-1 ${
              showOrderTracker
                ? 'bg-[#ff0033] text-black border-white shadow-[2px_2px_0px_#fff]'
                : 'bg-black text-zinc-300 border-zinc-700 hover:border-[#ff0033] hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{showOrderTracker ? 'HIDE TRACKER' : 'TRACK SHIPMENT'}</span>
          </button>

          <button
            onClick={() => {
              setShowAdminVault(!showAdminVault);
              setShowOrderTracker(false);
            }}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase border-2 transition-all flex items-center space-x-1 ${
              showAdminVault
                ? 'bg-[#ff0033] text-black border-white shadow-[2px_2px_0px_#fff]'
                : 'bg-black text-red-400 border-red-900 hover:border-[#ff0033] hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{showAdminVault ? 'CLOSE VAULT' : 'VAULT ADMIN'}</span>
          </button>

          <button
            onClick={loadData}
            className="flex items-center space-x-1.5 bg-black border-2 border-zinc-700 hover:border-[#ff0033] text-zinc-300 hover:text-white px-3 py-2 text-xs font-mono uppercase transition-colors"
            title="Fetch fresh data from MongoDB"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ff0033]' : ''}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Subviews */}
      {showOrderTracker && (
        <div className="mb-12">
          <OrderTracker onBackToShop={() => setShowOrderTracker(false)} />
        </div>
      )}

      {showAdminVault && (
        <div className="mb-12">
          <AdminVault products={products} onRefreshData={loadData} />
        </div>
      )}

      {/* Primary Catalog Controls */}
      <div className="bg-[#0e0a0d] border-2 border-zinc-800 p-4 md:p-6 mb-8 space-y-4">
        {/* Search & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH BY SPECIMEN NAME, SPEC, OR LENS (e.g. VISOR, SCALPEL)..."
              data-testid="search-input"
              className="w-full bg-black border-2 border-zinc-800 focus:border-[#ff0033] text-white pl-10 pr-4 py-2 text-xs font-mono uppercase tracking-wider outline-none transition-colors"
            />
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 font-mono text-xs uppercase font-bold border transition-all ${
                  category === cat
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
                onClick={() => setSplatterLevel(lvl)}
                className={`px-3 py-1 font-mono text-[11px] uppercase font-bold border transition-all ${
                  splatterLevel === lvl
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

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-red-950/80 border-2 border-red-600 text-red-200 mb-8 font-mono text-xs space-y-1">
          <p className="font-bold uppercase">MongoDB Query Warning:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loading Spinner */}
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
              onViewDetails={setSelectedProduct}
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
          <button
            onClick={() => {
              setSearch('');
              setCategory('ALL');
              setSplatterLevel('ALL');
            }}
            className="mt-4 bg-[#ff0033] text-black font-bold uppercase text-xs px-4 py-2 border border-black shadow-[2px_2px_0px_#fff]"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
        onProductUpdated={handleProductUpdated}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
        appliedPromo={appliedPromo}
        currentUser={currentUser}
      />
    </section>
  );
};

export default MainContentCont;

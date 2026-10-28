import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Trash2,
  RefreshCw,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Database,
  Eye,
} from 'lucide-react';
import type { Sunglasses, Order, StoreStats, NewSunglassesInput } from '../types';
import {
  createSunglasses,
  deleteSunglasses,
  updateSunglasses,
  fetchAllOrders,
  fetchStoreStats,
  reseedDatabase,
} from '../services/api';

interface AdminVaultProps {
  products: Sunglasses[];
  onRefreshData: () => void;
}

export const AdminVault: React.FC<AdminVaultProps> = ({ products, onRefreshData }) => {
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New product form state
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Cyber-Visor');
  const [price, setPrice] = useState('189.99');
  const [inStock, setInStock] = useState('10');
  const [splatterLevel, setSplatterLevel] = useState<'Moderate' | 'Brutal' | 'Lethal' | 'Extreme' | 'Catastrophic' | 'Apocalyptic'>('Brutal');
  const [description, setDescription] = useState('');
  const [frameMaterial, setFrameMaterial] = useState('316L Surgical Steel');
  const [lensSpecs, setLensSpecs] = useState('Arterial Crimson Polarized UV400');
  const [svgVariant, setSvgVariant] = useState('visor');
  const [badge, setBadge] = useState('NEW DROP');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const [fetchedStats, fetchedOrders] = await Promise.all([
        fetchStoreStats(),
        fetchAllOrders(),
      ]);
      setStats(fetchedStats);
      setOrders(fetchedOrders);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to query admin telemetry from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !description.trim()) {
      setErrorMsg('Product name, price, and description are required.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const input: NewSunglassesInput = {
        name: name.trim(),
        tagline: tagline.trim() || 'Hand-crafted brutal eyewear.',
        category,
        price: parseFloat(price),
        inStock: parseInt(inStock, 10),
        splatterLevel,
        description: description.trim(),
        frameMaterial,
        lensSpecs,
        badge,
        svgVariant,
      };

      await createSunglasses(input);
      setActionMsg(`Successfully forged "${name}" into MongoDB collection "sunglasses"!`);
      setName('');
      setTagline('');
      setDescription('');
      onRefreshData();
      loadAdminData();
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error creating sunglasses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!window.confirm(`Permanently eradicate "${prodName}" from MongoDB?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteSunglasses(id);
      setActionMsg(`Eradicated "${prodName}" from MongoDB.`);
      onRefreshData();
      loadAdminData();
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete sunglasses');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await updateSunglasses(id, { inStock: newStock });
      onRefreshData();
      loadAdminData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update stock');
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reset and re-seed the MongoDB database with the default catalog?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await reseedDatabase();
      setActionMsg(res.message);
      onRefreshData();
      loadAdminData();
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to reseed database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 font-mono text-xs text-white">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-[#ff0033] pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-bold uppercase mb-1">
            <Wrench className="w-4 h-4" />
            <span>COMMAND CONSOLE // MONGODB COMPASS LINK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            ADMIN CARNAGE VAULT
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReseed}
            className="bg-red-950 border border-red-600 hover:bg-[#ff0033] hover:text-black text-red-200 px-3 py-2 uppercase font-bold flex items-center space-x-2 transition-colors"
          >
            <Database className="w-4 h-4" />
            <span>RE-SEED MONGODB</span>
          </button>
          <button
            onClick={loadAdminData}
            className="bg-black border border-zinc-700 hover:border-[#ff0033] text-zinc-300 hover:text-white px-3 py-2 uppercase font-bold flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>REFRESH TELEMETRY</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 mb-6 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-950 border border-red-600 text-red-300 mb-6 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Real-time KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-black border-2 border-zinc-800 p-4 shadow-[3px_3px_0px_#ff0033]">
          <span className="text-zinc-500 uppercase block mb-1">CATALOG SPECIMENS</span>
          <p className="text-2xl font-black text-white">{stats?.totalProducts ?? products.length}</p>
          <span className="text-[10px] text-zinc-400">In MongoDB collection</span>
        </div>

        <div className="bg-black border-2 border-zinc-800 p-4 shadow-[3px_3px_0px_#ff0033]">
          <span className="text-zinc-500 uppercase block mb-1">LOW INVENTORY CRITICAL</span>
          <p className="text-2xl font-black text-amber-500">{stats?.lowStockCount ?? 0}</p>
          <span className="text-[10px] text-zinc-400">&lt; 8 specimens left</span>
        </div>

        <div className="bg-black border-2 border-zinc-800 p-4 shadow-[3px_3px_0px_#ff0033]">
          <span className="text-zinc-500 uppercase block mb-1">TOTAL ORDERS FORGED</span>
          <p className="text-2xl font-black text-white">{stats?.totalOrders ?? orders.length}</p>
          <span className="text-[10px] text-zinc-400">Stored in orders collection</span>
        </div>

        <div className="bg-black border-2 border-zinc-800 p-4 shadow-[3px_3px_0px_#ff0033]">
          <span className="text-zinc-500 uppercase block mb-1">BLOOD REVENUE</span>
          <p className="text-2xl font-black text-[#ff0033]">${stats?.totalRevenue?.toFixed(2) ?? '0.00'}</p>
          <span className="text-[10px] text-zinc-400">Total processed</span>
        </div>
      </div>

      {/* Forge New Sunglasses Specimen Form */}
      <div className="bg-[#0e0a0d] border-2 border-zinc-800 p-6 mb-12 shadow-[6px_6px_0px_#180306]">
        <h3 className="text-base font-black uppercase text-white mb-4 flex items-center space-x-2 border-b border-zinc-800 pb-2">
          <Plus className="w-5 h-5 text-[#ff0033]" />
          <span>FORGE NEW SUNGLASSES SPECIMEN (INSERTS INTO MONGODB)</span>
        </h3>

        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase mb-1">MODEL NAME *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VISCERA OVERLORD"
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">TAGLINE</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Monolithic shadow eyewear..."
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
              >
                <option value="Cyber-Visor">Cyber-Visor</option>
                <option value="Razor-Edge">Razor-Edge</option>
                <option value="Aviator">Aviator</option>
                <option value="Brutal Acetate">Brutal Acetate</option>
                <option value="Spiked Cat-Eye">Spiked Cat-Eye</option>
                <option value="Sports Shield">Sports Shield</option>
                <option value="Geometric Wire">Geometric Wire</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase mb-1">PRICE ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">INITIAL STOCK *</label>
              <input
                type="number"
                value={inStock}
                onChange={(e) => setInStock(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">SPLATTER TIER</label>
              <select
                value={splatterLevel}
                onChange={(e) => setSplatterLevel(e.target.value as any)}
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
              >
                <option value="Moderate">Moderate</option>
                <option value="Brutal">Brutal</option>
                <option value="Lethal">Lethal</option>
                <option value="Extreme">Extreme</option>
                <option value="Catastrophic">Catastrophic</option>
                <option value="Apocalyptic">Apocalyptic</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">SVG VECTOR STYLE</label>
              <select
                value={svgVariant}
                onChange={(e) => setSvgVariant(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
              >
                <option value="visor">Cyber Visor</option>
                <option value="polygonal">Razor Polygonal</option>
                <option value="aviator">Necrotic Aviator</option>
                <option value="chunky">Chunky Acetate</option>
                <option value="cateye">Spiked Cat-Eye</option>
                <option value="shield">Speed Shield</option>
                <option value="hex">Mortuary Hex</option>
                <option value="monolith">Bone Monolith</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 uppercase mb-1">DESCRIPTION *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full gory description and ballistic specifications..."
              rows={2}
              className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-2 text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 font-black uppercase text-xs px-6 py-3 border border-black shadow-[3px_3px_0px_#fff]"
          >
            {loading ? 'COMMITTING TO MONGODB...' : 'FORGE SPECIMEN TO MONGODB'}
          </button>
        </form>
      </div>

      {/* Live Inventory Table */}
      <div className="bg-[#0e0a0d] border-2 border-zinc-800 p-6 mb-12 shadow-[6px_6px_0px_#180306]">
        <h3 className="text-base font-black uppercase text-white mb-4 border-b border-zinc-800 pb-2">
          LIVE MONGODB SUNGLASSES INVENTORY ({products.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-black text-zinc-400 text-[10px] uppercase">
                <th className="p-2">SPECIMEN</th>
                <th className="p-2">CATEGORY</th>
                <th className="p-2">PRICE</th>
                <th className="p-2">SPLATTER TIER</th>
                <th className="p-2">STOCK (MONGODB)</th>
                <th className="p-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-black/50">
                  <td className="p-2 font-bold text-white">{p.name}</td>
                  <td className="p-2 text-zinc-400">{p.category}</td>
                  <td className="p-2 text-[#ff0033] font-bold">${p.price.toFixed(2)}</td>
                  <td className="p-2 text-zinc-400">{p.splatterLevel}</td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateStock(p._id, p.inStock, -1)}
                        className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white"
                      >
                        -
                      </button>
                      <span className={`font-bold ${p.inStock < 8 ? 'text-amber-500' : 'text-emerald-400'}`}>
                        {p.inStock}
                      </span>
                      <button
                        onClick={() => handleUpdateStock(p._id, p.inStock, 1)}
                        className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleDeleteProduct(p._id, p.name)}
                      className="text-red-500 hover:text-red-400 p-1"
                      title="Delete from MongoDB"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0e0a0d] border-2 border-zinc-800 p-6 shadow-[6px_6px_0px_#180306]">
        <h3 className="text-base font-black uppercase text-white mb-4 border-b border-zinc-800 pb-2">
          MONGODB ORDERS ARCHIVE ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <p className="text-zinc-500 italic py-4">No customer orders recorded in MongoDB yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-800 bg-black text-zinc-400 text-[10px] uppercase">
                  <th className="p-2">ORDER ID</th>
                  <th className="p-2">CUSTOMER</th>
                  <th className="p-2">EMAIL</th>
                  <th className="p-2">SPECIMENS</th>
                  <th className="p-2">TOTAL</th>
                  <th className="p-2">STATUS</th>
                  <th className="p-2">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-black/50">
                    <td className="p-2 text-[#ff0033] font-bold">{o.orderNumber}</td>
                    <td className="p-2 text-white font-bold">{o.customerName}</td>
                    <td className="p-2 text-zinc-400">{o.email}</td>
                    <td className="p-2 text-zinc-300">
                      {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="p-2 text-[#ff0033] font-bold">${o.total.toFixed(2)}</td>
                    <td className="p-2">
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 text-[10px]">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-2 text-zinc-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};


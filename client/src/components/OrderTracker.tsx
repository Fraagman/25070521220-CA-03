import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldAlert, ArrowLeft } from 'lucide-react';
import type { Order } from '../types';
import { fetchOrderById } from '../services/api';

interface OrderTrackerProps {
  onBackToShop: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ onBackToShop }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) {
      setError('Please provide a valid Order ID (e.g. CRNG-123456).');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrderById(orderQuery.trim());
      setOrder(data);
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : 'Order not found in MongoDB database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="border-b-4 border-[#ff0033] pb-6 mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-red-500 font-bold uppercase tracking-widest block mb-1">
            MONGODB ORDER ARCHIVES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            TRACK CARNAGE SHIPMENT
          </h2>
        </div>

        <button
          onClick={onBackToShop}
          className="bg-black border border-zinc-700 hover:border-[#ff0033] text-zinc-300 hover:text-white px-3 py-2 text-xs font-mono uppercase flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO CATALOG</span>
        </button>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-[#0e0a0d] border-2 border-zinc-800 p-6 mb-8 space-y-4">
        <label className="block text-xs font-mono uppercase text-zinc-300 font-bold">
          ENTER YOUR 9-DIGIT ORDER ID (e.g. CRNG-492019):
        </label>
        <div className="flex space-x-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="CRNG-XXXXXX"
              className="w-full bg-black border-2 border-zinc-800 focus:border-[#ff0033] text-white pl-10 pr-4 py-3 text-sm font-mono uppercase tracking-widest outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 font-black text-sm uppercase px-6 py-3 border-2 border-black shadow-[4px_4px_0px_#fff] transition-all flex items-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>{loading ? 'LOCATING...' : 'QUERY MONGODB'}</span>
          </button>
        </div>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-red-950/80 border-2 border-red-600 text-red-200 mb-8 font-mono text-xs flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Results Card */}
      {order && (
        <div className="bg-[#0e0a0d] border-4 border-[#ff0033] shadow-[8px_8px_0px_#000] p-6 md:p-8 space-y-6 font-mono text-xs text-white">
          {/* Top Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-zinc-800 pb-4 gap-3">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase block">TRACKING IDENTIFIER:</span>
              <h3 className="text-2xl font-black text-[#ff0033] tracking-widest">{order.orderNumber}</h3>
            </div>

            <div className="inline-flex items-center space-x-2 bg-emerald-950 border border-emerald-500 px-3 py-1.5 text-emerald-300 font-black uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>STATUS: {order.status}</span>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="grid grid-cols-3 gap-2 text-center py-4 border-y border-zinc-800 bg-black/60">
            <div className="space-y-1">
              <Clock className="w-5 h-5 text-emerald-400 mx-auto" />
              <span className="font-bold text-white block">1. ORDER FORGED</span>
              <span className="text-[10px] text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="space-y-1">
              <Package className="w-5 h-5 text-[#ff0033] mx-auto animate-pulse" />
              <span className="font-bold text-white block">2. BALLISTIC PACK</span>
              <span className="text-[10px] text-emerald-400">IN PROGRESS</span>
            </div>
            <div className="space-y-1 opacity-50">
              <Truck className="w-5 h-5 text-zinc-500 mx-auto" />
              <span className="font-bold text-zinc-400 block">3. DISPATCHED</span>
              <span className="text-[10px] text-zinc-600">COURIER EN ROUTE</span>
            </div>
          </div>

          {/* Recipient & Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black border border-zinc-800 p-4 space-y-2">
              <h4 className="text-red-500 font-bold uppercase text-[11px]">DESTINATION COORDINATES:</h4>
              <p className="text-white font-bold">{order.customerName}</p>
              <p className="text-zinc-400">{order.email}</p>
              <p className="text-zinc-400">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} {order.shippingAddress.zip},{' '}
                {order.shippingAddress.country}
              </p>
              <p className="text-zinc-500 italic pt-1 border-t border-zinc-900">
                Blood Oath: "{order.bloodPledge}"
              </p>
            </div>

            <div className="bg-black border border-zinc-800 p-4 space-y-2">
              <h4 className="text-red-500 font-bold uppercase text-[11px]">CLAIMED SPECIMENS:</h4>
              <div className="space-y-1">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-zinc-300">
                    <span>
                      {i.name} (x{i.quantity})
                    </span>
                    <span className="text-white font-bold">${(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-2 text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[#ff0033]">
                    <span>DISCOUNT</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-zinc-800">
                  <span>TOTAL TRANSACTION</span>
                  <span className="text-[#ff0033]">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


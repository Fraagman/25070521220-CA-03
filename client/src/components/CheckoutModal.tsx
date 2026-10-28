import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Skull, ArrowRight, Printer, Copy } from 'lucide-react';
import type { CartItem, OrderConfirmation, Order } from '../types';
import { createOrder } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderSuccess: (order: Order) => void;
  appliedPromo: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderSuccess,
  appliedPromo,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('USA');
  const [bloodPledge, setBloodPledge] = useState('By arterial steel and obsidian glass, I claim these shades.');
  const [promoCode, setPromoCode] = useState(appliedPromo);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let discountRate = 0;
  if (promoCode.toUpperCase() === 'GORE10') discountRate = 0.10;
  if (promoCode.toUpperCase() === 'BLOODOATH') discountRate = 0.20;
  const discountAmount = subtotal * discountRate;
  const shippingFee = subtotal >= 150 || cart.length === 0 ? 0 : 15.0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !street || !city || !zip) {
      setError('All shipping destination fields and recipient moniker are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        customerName,
        email,
        shippingAddress: { street, city, state, zip, country },
        bloodPledge,
        promoCode: promoCode || undefined,
        items: cart.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
      };

      const result = await createOrder(payload);
      setConfirmation(result);
      onOrderSuccess(result.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize order in MongoDB');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderId = () => {
    if (confirmation?.orderNumber) {
      navigator.clipboard.writeText(confirmation.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#0d090b] border-4 border-[#ff0033] shadow-[12px_12px_0px_#000] text-white my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black border-b-2 border-red-900/80 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Skull className="w-5 h-5 text-[#ff0033]" />
            <h2 className="text-lg font-black uppercase tracking-wider text-white">
              {confirmation ? 'CARNAGE ORDER CONFIRMATION' : 'BLOOD OATH FINAL CHECKOUT'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-zinc-700 hover:border-[#ff0033] text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {confirmation ? (
          /* Confirmation Screen */
          <div className="p-6 md:p-8 space-y-6 font-mono text-xs">
            <div className="bg-black border-2 border-emerald-500 p-6 text-center space-y-3 shadow-[6px_6px_0px_#064e3b]">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                ORDER RECORDED IN MONGODB
              </h3>
              <p className="text-zinc-300">
                Your order document has been officially committed to the MongoDB database{' '}
                <strong className="text-emerald-400">carnage_optix.orders</strong> and inventory
                has been decremented!
              </p>

              {/* Order Number Box */}
              <div className="inline-flex items-center space-x-3 bg-zinc-950 border-2 border-[#ff0033] px-4 py-2 mt-2">
                <span className="text-zinc-400 font-bold">ORDER ID:</span>
                <span className="text-lg font-black text-[#ff0033] tracking-widest">
                  {confirmation.orderNumber}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Copy Order ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-emerald-400 text-[11px]">Copied to clipboard!</p>}
            </div>

            {/* Order Details Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black border border-zinc-800 p-4 space-y-2">
                <h4 className="text-red-500 font-bold uppercase text-[11px]">DISPATCH TO:</h4>
                <p className="text-white font-bold">{confirmation.order.customerName}</p>
                <p className="text-zinc-400">{confirmation.order.email}</p>
                <p className="text-zinc-400">
                  {confirmation.order.shippingAddress.street}, {confirmation.order.shippingAddress.city},{' '}
                  {confirmation.order.shippingAddress.state} {confirmation.order.shippingAddress.zip},{' '}
                  {confirmation.order.shippingAddress.country}
                </p>
                <p className="text-zinc-500 italic pt-1">
                  Pledge: "{confirmation.order.bloodPledge}"
                </p>
              </div>

              <div className="bg-black border border-zinc-800 p-4 space-y-2">
                <h4 className="text-red-500 font-bold uppercase text-[11px]">PURCHASE SUMMARY:</h4>
                <div className="space-y-1">
                  {confirmation.order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-zinc-300">
                      <span>
                        {i.name} (x{i.quantity})
                      </span>
                      <span>${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-800 pt-2 space-y-1 text-zinc-400">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span>${confirmation.order.subtotal.toFixed(2)}</span>
                  </div>
                  {confirmation.order.discount > 0 && (
                    <div className="flex justify-between text-[#ff0033]">
                      <span>DISCOUNT</span>
                      <span>-${confirmation.order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>SHIPPING</span>
                    <span>${confirmation.order.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-zinc-700">
                    <span>TOTAL PAID</span>
                    <span className="text-[#ff0033]">${confirmation.order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => window.print()}
                className="bg-black border border-zinc-700 text-zinc-300 hover:text-white px-4 py-2 font-bold uppercase flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT CARNAGE INVOICE</span>
              </button>
              <button
                onClick={onClose}
                className="bg-[#ff0033] text-black font-black uppercase px-6 py-2 shadow-[3px_3px_0px_#fff]"
              >
                CLOSE & RETURN TO STORE
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 font-mono text-xs">
            {error && (
              <div className="p-3 bg-red-950 border-2 border-red-600 text-red-200 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recipient Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-red-500 border-b border-red-900/60 pb-2">
                  1. RECIPIENT INFORMATION
                </h3>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">
                    FULL NAME / ALIAS *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Victor Cross"
                    className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">
                    TRANSMISSION EMAIL *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="victor@carnage.realm"
                    className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="742 Crimson Boulevard"
                    className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">CITY *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Necropolis"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-2 py-2 text-white outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">STATE</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-2 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">ZIP *</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="90210"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-2 py-2 text-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">BLOOD PLEDGE</label>
                  <input
                    type="text"
                    value={bloodPledge}
                    onChange={(e) => setBloodPledge(e.target.value)}
                    className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-zinc-300 outline-none italic"
                  />
                </div>
              </div>

              {/* Order Items & Totals */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-red-500 border-b border-red-900/60 pb-2">
                  2. ORDER SPECIMENS
                </h3>

                <div className="bg-black border border-zinc-800 p-3 max-h-48 overflow-y-auto space-y-2">
                  {cart.map((i) => (
                    <div key={i.product._id} className="flex justify-between items-center text-zinc-300">
                      <div>
                        <strong className="text-white block">{i.product.name}</strong>
                        <span className="text-[10px] text-zinc-500">
                          Qty: {i.quantity} @ ${i.product.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="font-bold text-white">
                        ${(i.product.price * i.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-black border border-zinc-800 p-4 space-y-2">
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">
                      PROMO CODE (TRY: GORE10)
                    </label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="GORE10"
                      className="w-full bg-zinc-950 border border-zinc-800 uppercase px-3 py-1.5 text-white outline-none focus:border-[#ff0033]"
                    />
                  </div>

                  <div className="border-t border-zinc-800 pt-3 space-y-1 text-zinc-400">
                    <div className="flex justify-between">
                      <span>SUBTOTAL</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#ff0033]">
                        <span>DISCOUNT ({Math.round(discountRate * 100)}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>BALLISTIC COURIER</span>
                      <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-700">
                      <span>TOTAL DUE</span>
                      <span className="text-[#ff0033]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  data-testid="submit-order-button"
                  className="w-full bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 font-black uppercase text-sm py-4 tracking-wider flex items-center justify-center space-x-2 shadow-[6px_6px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  <Skull className="w-5 h-5 text-black" />
                  <span>{loading ? 'COMMITTING TO MONGODB...' : 'SEAL BLOOD OATH & PLACE ORDER'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


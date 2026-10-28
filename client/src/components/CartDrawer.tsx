import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldAlert, Tag } from 'lucide-react';
import type { CartItem } from '../types';
import { SunglassesSVG } from './SunglassesSVG';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  setAppliedPromo: (code: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  setAppliedPromo,
}) => {
  const [promoInput, setPromoInput] = useState(appliedPromo);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountRate = 0;
  if (appliedPromo.toUpperCase() === 'GORE10') {
    discountRate = 0.10;
  } else if (appliedPromo.toUpperCase() === 'BLOODOATH') {
    discountRate = 0.20;
  }

  const discountAmount = subtotal * discountRate;
  const shippingFee = subtotal >= 150 || cart.length === 0 ? 0 : 15.0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'GORE10' || clean === 'BLOODOATH') {
      setAppliedPromo(clean);
      setPromoError(null);
    } else {
      setPromoError('Invalid blood code. Try GORE10 (10% off) or BLOODOATH (20% off).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0b080a] border-l-4 border-[#ff0033] h-full flex flex-col justify-between text-white shadow-[-10px_0px_30px_rgba(255,0,51,0.25)]">
        {/* Header */}
        <div className="p-4 bg-black border-b-2 border-red-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#ff0033]" />
            <h2 className="text-lg font-black uppercase tracking-wider text-white">
              GORE BAG ({cart.reduce((c, i) => c + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-zinc-700 hover:border-[#ff0033] text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShieldAlert className="w-12 h-12 text-zinc-700 mx-auto" />
              <p className="text-sm font-mono text-zinc-500 uppercase">
                YOUR GORE BAG IS CURRENTLY EMPTY.
              </p>
              <p className="text-xs font-mono text-zinc-600">
                Claim brutal eyewear from the catalog to prepare for daylight.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product._id}
                data-testid={`cart-item-${item.product._id}`}
                className="bg-black border-2 border-zinc-900 p-3 flex items-center space-x-3 shadow-[3px_3px_0px_#180306]"
              >
                {/* Mini SVG */}
                <div className="w-20 h-16 bg-zinc-950 border border-zinc-800 flex-shrink-0 flex items-center justify-center p-1">
                  <SunglassesSVG variant={item.product.svgVariant} className="w-full h-full" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black uppercase text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs font-mono text-[#ff0033] font-bold">
                    ${item.product.price.toFixed(2)} each
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center border border-zinc-700 bg-zinc-950">
                      <button
                        onClick={() => onUpdateQuantity(item.product._id, -1)}
                        className="px-2 py-0.5 text-xs font-mono text-zinc-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product._id, 1)}
                        disabled={item.quantity >= item.product.inStock}
                        className="px-2 py-0.5 text-xs font-mono text-zinc-400 hover:text-white disabled:text-zinc-700"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product._id)}
                      className="text-zinc-500 hover:text-red-500 p-1"
                      title="Eradicate item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right font-mono text-xs font-black text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Calculations */}
        {cart.length > 0 && (
          <div className="p-4 bg-black border-t-2 border-red-900/80 space-y-3 font-mono text-xs">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex space-x-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="PROMO (GORE10)"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-8 pr-2 py-1.5 uppercase text-xs outline-none focus:border-[#ff0033]"
                />
              </div>
              <button
                type="submit"
                className="bg-zinc-800 hover:bg-[#ff0033] hover:text-black text-white font-bold px-3 py-1.5 uppercase text-[11px] transition-colors"
              >
                APPLY
              </button>
            </form>

            {promoError && (
              <p className="text-[10px] text-red-400">{promoError}</p>
            )}

            {appliedPromo && (
              <div className="flex justify-between text-emerald-400 text-[11px]">
                <span>PROMO APPLIED: {appliedPromo}</span>
                <span>-{Math.round(discountRate * 100)}%</span>
              </div>
            )}

            {/* Subtotals */}
            <div className="space-y-1 pt-2 border-t border-zinc-900 text-zinc-400">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#ff0033]">
                  <span>DISCOUNT</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>SHIPPING</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-400">FREE OVER $150</strong>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                <span>TOTAL DUE</span>
                <span className="text-[#ff0033]">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              data-testid="proceed-checkout-button"
              className="w-full bg-[#ff0033] text-black hover:bg-red-600 font-black uppercase text-sm py-3.5 tracking-wider flex items-center justify-center space-x-2 shadow-[4px_4px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <span>PROCEED TO BLOOD OATH CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


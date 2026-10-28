import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Ruler, CheckCircle2, MessageSquarePlus, AlertTriangle } from 'lucide-react';
import type { Sunglasses } from '../types';
import { SunglassesSVG } from './SunglassesSVG';
import { submitReview } from '../services/api';

interface ProductDetailModalProps {
  product: Sunglasses | null;
  onClose: () => void;
  onAddToCart: (product: Sunglasses, quantity: number) => void;
  onProductUpdated: (updatedProduct: Sunglasses) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onProductUpdated,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      setReviewError('Both author moniker and gory comment are required.');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError(null);
      const updated = await submitReview(product._id, {
        author: reviewAuthor.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      onProductUpdated(updated);
      setReviewAuthor('');
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review to MongoDB');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#0d090b] border-4 border-[#ff0033] shadow-[12px_12px_0px_#000] text-white my-8 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black border-b-2 border-red-900/80">
          <div className="flex items-center space-x-3">
            <span className="bg-[#ff0033] text-black font-black text-xs uppercase px-2 py-1 font-mono">
              SPECIMEN: {product.slug.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              CATEGORY: {product.category}
            </span>
          </div>

          <button
            onClick={onClose}
            data-testid="close-detail-modal"
            className="p-1.5 bg-black border-2 border-zinc-700 hover:border-[#ff0033] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Main Visual & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* SVG Illustration Container */}
            <div className="border-4 border-black bg-zinc-950 p-6 shadow-[6px_6px_0px_#ff0033]">
              <SunglassesSVG variant={product.svgVariant} className="w-full h-64" />
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800 pt-3">
                <span>BALLISTIC: ANSI Z87.1</span>
                <span>SPLATTER: {product.splatterLevel.toUpperCase()}</span>
                <span>UV400 RATED</span>
              </div>
            </div>

            {/* Product Purchase Column */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono bg-red-950/80 text-red-400 border border-red-800 px-2 py-0.5 uppercase">
                  {product.splatterLevel} Tier
                </span>
                {product.badge && (
                  <span className="text-xs font-mono bg-[#ff0033] text-black font-black px-2 py-0.5 uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2">
                {product.name}
              </h2>

              <p className="text-sm font-mono text-zinc-300 italic mb-4">
                "{product.tagline}"
              </p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between py-3 border-y border-zinc-800 mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-[#ff0033] font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base font-mono text-zinc-600 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <div className="flex text-[#ff0033]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-[#ff0033] text-[#ff0033]'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    ({product.rating.toFixed(1)} / {product.reviewCount})
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-zinc-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock and Quantity */}
              <div className="bg-black/70 border-2 border-zinc-800 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-zinc-400">INVENTORY STATE:</span>
                  <span
                    className={`text-xs font-mono font-black uppercase ${
                      product.inStock < 8 ? 'text-amber-500 animate-pulse' : 'text-emerald-400'
                    }`}
                  >
                    {product.inStock} SPECIMENS REMAINING
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-zinc-700 bg-black">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 font-mono text-base font-black hover:bg-zinc-800 text-zinc-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-mono text-sm font-black text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.inStock, q + 1))}
                      disabled={quantity >= product.inStock}
                      className="px-3 py-1.5 font-mono text-base font-black hover:bg-zinc-800 text-zinc-300 disabled:text-zinc-600"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    disabled={product.inStock <= 0}
                    data-testid="modal-add-to-cart"
                    className="flex-1 bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 border-2 border-black font-black uppercase py-2.5 px-4 text-sm tracking-wider flex items-center justify-center space-x-2 shadow-[4px_4px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    <ShoppingBag className="w-5 h-5 text-black" />
                    <span>CLAIM {quantity} IN GORE BAG</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs & Dimensions */}
          <div className="border-t-2 border-red-900/60 pt-6">
            <h3 className="text-lg font-black uppercase tracking-wider text-white mb-4 flex items-center space-x-2">
              <Ruler className="w-5 h-5 text-[#ff0033]" />
              <span>CARNAGE SPECIFICATIONS & METRICS</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-mono text-xs">
              <div className="bg-black border border-zinc-800 p-3">
                <span className="text-zinc-500 uppercase block mb-1">FRAME ALLOY</span>
                <p className="text-zinc-200 font-bold">{product.frameMaterial}</p>
              </div>
              <div className="bg-black border border-zinc-800 p-3">
                <span className="text-zinc-500 uppercase block mb-1">LENS OPTICS</span>
                <p className="text-zinc-200 font-bold">{product.lensSpecs}</p>
              </div>
              <div className="bg-black border border-zinc-800 p-3">
                <span className="text-zinc-500 uppercase block mb-1">DIMENSIONS</span>
                <p className="text-zinc-200 font-bold">
                  {product.dimensions.lensWidth}mm lens • {product.dimensions.bridge}mm bridge • {product.dimensions.temple}mm temple
                </p>
              </div>
              <div className="bg-black border border-zinc-800 p-3">
                <span className="text-zinc-500 uppercase block mb-1">FRAME WEIGHT</span>
                <p className="text-zinc-200 font-bold">{product.dimensions.weightGrams} grams</p>
              </div>
            </div>

            {/* Features Bullet List */}
            <div className="bg-black/50 border border-zinc-800 p-4">
              <h4 className="text-xs font-mono font-bold uppercase text-red-500 mb-2">BALLISTIC FEATURES:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#ff0033] font-black">✦</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t-2 border-red-900/60 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center space-x-2">
                <Star className="w-5 h-5 text-[#ff0033] fill-[#ff0033]" />
                <span>CUSTOMER CARNAGE TESTIMONIALS ({product.reviews?.length || 0})</span>
              </h3>
            </div>

            {/* Review List */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-black border border-zinc-800 p-3.5 text-xs font-mono">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <strong className="text-red-400 font-bold">{rev.author}</strong>
                        {rev.verifiedGore && (
                          <span className="bg-zinc-800 text-[10px] text-emerald-400 px-1.5 py-0.5 border border-zinc-700">
                            ✓ VERIFIED GORE
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-600">{rev.date}</span>
                    </div>
                    <div className="flex text-[#ff0033] mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-[#ff0033] text-[#ff0033]' : 'text-zinc-800'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-zinc-300 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-zinc-500 italic">No reviews recorded yet for this model.</p>
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-black/80 border-2 border-red-900/50 p-4">
              <h4 className="text-xs font-mono font-black uppercase text-red-400 mb-3 flex items-center space-x-1.5">
                <MessageSquarePlus className="w-4 h-4" />
                <span>LOG A NEW TESTIMONIAL (STORED IN MONGODB)</span>
              </h4>

              {reviewSuccess && (
                <div className="mb-3 p-2 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono">
                  ✓ Review successfully recorded into MongoDB!
                </div>
              )}

              {reviewError && (
                <div className="mb-3 p-2 bg-red-950 border border-red-500 text-red-300 text-xs font-mono">
                  {reviewError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    YOUR MONIKER
                  </label>
                  <input
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. SanguineHunter"
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#ff0033] px-3 py-1.5 text-xs font-mono text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    GORE RATING (1-5 STARS)
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#ff0033] px-3 py-1.5 text-xs font-mono text-white outline-none"
                  >
                    <option value={5}>★★★★★ (5 - Apocalyptic)</option>
                    <option value={4}>★★★★☆ (4 - Lethal)</option>
                    <option value={3}>★★★☆☆ (3 - Brutal)</option>
                    <option value={2}>★★☆☆☆ (2 - Moderate)</option>
                    <option value={1}>★☆☆☆☆ (1 - Weak)</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  BRUTAL TESTIMONIAL
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe optical clarity under harsh conditions..."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#ff0033] px-3 py-1.5 text-xs font-mono text-white outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 font-black text-xs uppercase px-4 py-2 border border-black shadow-[2px_2px_0px_#fff] transition-all"
              >
                {submittingReview ? 'RECORDING TO MONGODB...' : 'TRANSMIT TESTIMONIAL'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


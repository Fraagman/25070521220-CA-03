import React from 'react';
import { ShoppingBag, Eye, Star, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Sunglasses } from '../types';
import { SunglassesSVG } from './SunglassesSVG';

interface ProductCardProps {
  product: Sunglasses;
  onAddToCart: (product: Sunglasses) => void;
  onViewDetails: (product: Sunglasses) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const getSplatterBadgeColor = (level: string) => {
    switch (level) {
      case 'Catastrophic':
      case 'Apocalyptic':
        return 'bg-red-700 text-white border-red-500';
      case 'Lethal':
      case 'Extreme':
        return 'bg-[#ff0033] text-black border-black font-black';
      case 'Brutal':
        return 'bg-amber-600 text-black border-amber-300';
      default:
        return 'bg-zinc-800 text-zinc-200 border-zinc-600';
    }
  };

  const isLowStock = product.inStock < 8;

  return (
    <div
      data-testid={`product-card-${product._id}`}
      className="group relative bg-[#0e0a0d] border-4 border-black hover:border-[#ff0033] transition-all duration-200 shadow-[6px_6px_0px_#1a0508] hover:shadow-[8px_8px_0px_#ff0033] flex flex-col justify-between"
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between p-3 border-b-2 border-zinc-900 bg-black/80 font-mono text-xs">
        <span className="uppercase text-zinc-400 font-bold tracking-wider">
          {product.category}
        </span>
        <span
          className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border ${getSplatterBadgeColor(
            product.splatterLevel
          )}`}
        >
          {product.splatterLevel}
        </span>
      </div>

      {/* SVG Image Container */}
      <div
        onClick={() => onViewDetails(product)}
        className="cursor-pointer relative overflow-hidden group-hover:bg-zinc-950/80 transition-colors"
      >
        <SunglassesSVG variant={product.svgVariant} animated={true} />

        {product.badge && (
          <div className="absolute top-3 left-3 bg-[#ff0033] text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 shadow-[2px_2px_0px_#000]">
            {product.badge}
          </div>
        )}

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="flex items-center space-x-2 bg-white text-black font-black text-xs uppercase px-4 py-2 shadow-[3px_3px_0px_#ff0033]">
            <Eye className="w-4 h-4" />
            <span>INSPECT SPECIMEN</span>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex text-[#ff0033]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#ff0033] text-[#ff0033]'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-400">
              ({product.rating.toFixed(1)} / {product.reviewCount} reviews)
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product)}
            className="cursor-pointer text-lg font-black uppercase text-white tracking-tight hover:text-[#ff0033] transition-colors mb-1"
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs font-mono text-zinc-400 line-clamp-2 mb-3">
            {product.tagline}
          </p>

          {/* Key Materials */}
          <div className="text-[11px] font-mono text-zinc-500 space-y-0.5 mb-3 border-t border-zinc-900 pt-2">
            <p className="truncate">
              <strong className="text-zinc-400">FRAME:</strong> {product.frameMaterial}
            </p>
            <p className="truncate">
              <strong className="text-zinc-400">LENS:</strong> {product.lensSpecs}
            </p>
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-baseline justify-between mb-3 pt-2 border-t border-zinc-800">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#ff0033] font-mono">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-mono text-zinc-600 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <span
              className={`text-[10px] font-mono font-bold uppercase ${
                isLowStock ? 'text-amber-500 animate-pulse' : 'text-zinc-400'
              }`}
            >
              {isLowStock ? `⚠ ONLY ${product.inStock} LEFT` : `${product.inStock} IN STOCK`}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="col-span-1 bg-black text-zinc-300 hover:text-white border-2 border-zinc-700 hover:border-[#ff0033] p-2 text-xs font-black uppercase tracking-wider flex items-center justify-center transition-all"
              title="View Specifications"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onAddToCart(product)}
              disabled={product.inStock <= 0}
              data-testid={`add-to-cart-${product._id}`}
              className="col-span-2 bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 border-2 border-black font-black text-xs uppercase tracking-wider py-2.5 px-3 flex items-center justify-center space-x-1.5 shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.inStock > 0 ? 'CLAIM IN BAG' : 'DEPLETED'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


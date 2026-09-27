import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  ShoppingCart,
  Heart,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite = false,
  onToggleFavorite
}) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product, product.minimum_order_quantity || 1);
    } finally {
      setTimeout(() => setAdding(false), 500);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.minimum_order_quantity || 1);
    navigate('/checkout');
  };

  // Resolve image URL
  const imgUrl = imageError
    ? '/products/default-craft.svg'
    : product.image_url || '/products/default-craft.svg';

  const isLowStock = product.available_stock <= 5;
  const isCriticalStock = product.available_stock <= 2;

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col justify-between">
      {/* Top Image Section with Overlays */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={imgUrl}
            alt={product.product_name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.gi_registration_status && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/40 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>{t('gi_verified') || 'GI VERIFIED'}</span>
            </span>
          )}

          {isCriticalStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-950/80 backdrop-blur-md text-rose-400 border border-rose-500/40">
              {t('critical_stock') || 'CRITICAL STOCK'}: {product.available_stock}
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/80 backdrop-blur-md text-amber-400 border border-amber-500/40">
              {t('low_stock') || 'LOW STOCK'}: {product.available_stock}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              {t('in_stock') || 'IN STOCK'}: {product.available_stock} {product.unit}s
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all duration-200 z-10 ${
            favorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-950/60 text-slate-300 hover:text-rose-400 hover:bg-slate-950/90'
          }`}
          title={favorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-white' : ''}`} />
        </button>

        {/* Global Demand Score Pill Overlay */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Demand: {product.global_demand_score}%</span>
          </div>

          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/85 backdrop-blur-md text-slate-300 border border-slate-700">
            <span>MOQ: {product.minimum_order_quantity}</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* State / District & Craft Type */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="flex items-center space-x-1 font-medium text-cyan-400/90">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{product.district}, {product.state}</span>
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              {product.craft_type}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.slug}`} className="block group-hover:text-cyan-300 transition-colors">
            <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug">
              {product.product_name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>

          {/* Ratings & Artisan Cluster */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center space-x-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal text-[10px]">
                ({product.review_count})
              </span>
            </div>
            <span className="text-slate-400 text-[10px] truncate max-w-[140px]" title={product.artisan_cluster}>
              Guild: {product.artisan_name}
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Wholesale Export Rate
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-extrabold text-white">
                  ${product.wholesale_price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ${product.target_price.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">/ {product.unit}</span>
              </div>
            </div>

            <Link
              to={`/negotiator?product_id=${product.id}`}
              className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/60 transition-colors"
              title="Open AI Price Negotiation Desk"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product.slug}`}
              className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              <span>{t('view_details') || 'Details'}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={adding || product.available_stock === 0}
              className={`flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                product.available_stock === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : adding
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{adding ? 'Added!' : t('add_to_cart') || 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

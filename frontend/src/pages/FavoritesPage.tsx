import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, ArrowRight, ShoppingCart } from 'lucide-react';
import * as api from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const FavoritesPage: React.FC = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load first 6 high demand products as demo favorites or user favorites
    api.getProducts({ size: 6, sort_by: 'demand' }).then((res) => {
      setFavoriteProducts(res.items.slice(0, 4));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleToggleFavorite = (id: number) => {
    setFavoriteProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
          <span>Curated Wishlist</span>
          <span>•</span>
          <span>{favoriteProducts.length} Saved Crafts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Saved Regional GI Crafts
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Bookmarked craft consignments and master artisan creations for future wholesale procurement.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl h-80 animate-pulse"></div>
          ))}
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No saved crafts in your wishlist</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the heart icon on any product card in the marketplace to save it here.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

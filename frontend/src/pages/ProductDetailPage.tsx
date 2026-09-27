import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  ShoppingCart,
  Heart,
  Share2,
  PhoneCall,
  MessageCircle,
  Truck,
  Layers,
  Award,
  Leaf,
  FileText,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Check,
  ArrowRight,
  Globe,
  DollarSign
} from 'lucide-react';
import * as api from '../services/api';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Order quantity
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Active Deep Dive Tab
  const [activeTab, setActiveTab] = useState<'heritage' | 'artisan' | 'sustainability' | 'trade' | 'ai_demand' | 'reviews'>('heritage');

  // Load product by slug or id
  const loadProduct = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      let data: Product;
      if (!isNaN(Number(slug))) {
        data = await api.getProductById(Number(slug));
      } else {
        data = await api.getProductBySlug(slug);
      }
      setProduct(data);
      setQuantity(data.minimum_order_quantity || 1);
    } catch (err: any) {
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading Product Heritage & Specs...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'The requested GI craft could not be located in our registry.'}</p>
        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  // Setup gallery images
  const galleryImages = product.images && product.images.length > 0
    ? product.images.map((img) => img.image_url)
    : [product.image_url || '/products/default-craft.svg'];

  const currentImg = galleryImages[activeImageIndex] || galleryImages[0];

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
    } finally {
      setTimeout(() => setAddingToCart(false), 500);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShareWhatsApp = () => {
    const text = `Explore authentic Indian GI craft: *${product.product_name}* from ${product.district}, ${product.state} on GlobalBridge.AI. Wholesale rate: $${product.wholesale_price} USD (MOQ: ${product.minimum_order_quantity} units). View: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const isLowStock = product.available_stock <= 5;
  const isCriticalStock = product.available_stock <= 2;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
        <span>/</span>
        <Link to={`/marketplace?state=${encodeURIComponent(product.state)}`} className="hover:text-cyan-400 transition-colors">{product.state}</Link>
        <span>/</span>
        <span className="text-slate-200 font-semibold truncate max-w-xs">{product.product_name}</span>
      </nav>

      {/* Main Top Grid: Gallery (Left) & Core Details / Commercials (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Viewer */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            <img
              src={currentImg}
              alt={product.product_name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-slate-950/85 backdrop-blur-md text-cyan-400 border border-cyan-500/40 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>GI CERTIFIED #{product.gi_tag || 'GI-INDIA-2026'}</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{product.quality_grade}</span>
              </span>
            </div>

            {/* Lightbox zoom button */}
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700 transition-all"
              title="Full Screen Zoom Viewer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center space-x-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 scale-105'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Quality Authenticity Guarantee Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Cluster Provenance Guarantee</span>
                <span className="text-[11px] text-slate-400">Directly sourced from registered master artisan workshops.</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
              100% HANDMADE
            </span>
          </div>
        </div>

        {/* Right Info & Pricing Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Location & Category Badges */}
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
              <span className="inline-flex items-center space-x-1 text-cyan-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.district}, {product.state}</span>
              </span>
              <span>•</span>
              <span className="text-slate-400 font-medium">{product.category}</span>
            </div>

            {/* Main Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {product.product_name}
            </h1>

            {/* Ratings & Artisan Cluster Guild */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
              <div className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-900/50">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.review_count} verified export reviews)</span>
              </div>

              <div className="text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-medium">
                Artisan: <strong className="text-white">{product.artisan_name}</strong>
              </div>

              <div className="text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-900/50 font-bold">
                Demand Score: {product.global_demand_score}%
              </div>
            </div>
          </div>

          {/* Pricing Matrix Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                  Wholesale Bulk Rate
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-white">
                    ${product.wholesale_price.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ${product.target_price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ {product.unit}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                  Minimum Order (MOQ)
                </span>
                <span className="text-2xl font-bold text-cyan-400">
                  {product.minimum_order_quantity} <span className="text-xs font-normal text-slate-400">{product.unit}s</span>
                </span>
              </div>
            </div>

            {/* Bulk Tier Discount notice */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs flex items-center justify-between text-slate-300">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Tier Discounts: {product.bulk_discount}</span>
              </div>
            </div>

            {/* Inventory Stock Status */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCriticalStock ? 'bg-rose-500 animate-ping' : isLowStock ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className="text-slate-300 font-medium">
                  {isCriticalStock ? (
                    <strong className="text-rose-400">Critical Stock: Only {product.available_stock} units left!</strong>
                  ) : isLowStock ? (
                    <strong className="text-amber-400">Low Stock: {product.available_stock} units left</strong>
                  ) : (
                    <strong className="text-emerald-400">In Stock: {product.available_stock} units available</strong>
                  )}
                </span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">Production time: {product.production_time}</span>
            </div>

            {/* Quantity Stepper & Add to Cart Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(product.minimum_order_quantity || 1, q - 1))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.available_stock, q + 1))}
                    disabled={quantity >= product.available_stock}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white font-bold transition-colors disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Estimated Value</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    ${(product.wholesale_price * quantity).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.available_stock === 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addingToCart ? 'Added to Cart!' : 'Add to Wholesale Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.available_stock === 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <span>Buy Now / Direct Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Secondary Actions: AI Negotiator & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <Link
                  to={`/negotiator?product_id=${product.id}`}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors text-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Negotiate</span>
                </Link>

                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 text-xs font-semibold border border-emerald-800/80 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? 'Link Shared!' : 'Share WhatsApp'}</span>
                </button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                    isFavorite
                      ? 'bg-rose-950 text-rose-400 border-rose-800'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
                  <span>Wishlist</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Material</span>
              <span className="font-semibold text-white truncate block">{product.material}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Technique</span>
              <span className="font-semibold text-white truncate block">{product.technique}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">HS Code</span>
              <span className="font-semibold text-cyan-400 truncate block">{product.hs_code}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Multitab Information Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Tabs Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { key: 'heritage', label: 'Heritage & Craft Lineage', icon: FileText },
            { key: 'artisan', label: 'Master Artisan Profile', icon: Award },
            { key: 'sustainability', label: 'Sustainability & Eco-Story', icon: Leaf },
            { key: 'trade', label: 'Trade & Customs Compliance', icon: Globe },
            { key: 'ai_demand', label: 'AI Global Demand Intelligence', icon: TrendingUp },
            { key: 'reviews', label: `Verified Reviews (${product.review_count})`, icon: Star },
          ].map((tItem) => {
            const Icon = tItem.icon;
            const isActive = activeTab === tItem.key;
            return (
              <button
                key={tItem.key}
                onClick={() => setActiveTab(tItem.key as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Heritage & Technique */}
        {activeTab === 'heritage' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white mb-2">Historical Lineage & Craft Provenance</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {product.heritage_story}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold">Traditional Technique</span>
                <p className="text-white font-medium">{product.technique}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold">Origin Location</span>
                <p className="text-white font-medium">{product.origin}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Artisan Profile */}
        {activeTab === 'artisan' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-xl">
                  {product.artisan_name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{product.artisan_name}</h3>
                <p className="text-xs text-cyan-400 font-medium">{product.artisan_cluster}</p>
                <p className="text-[11px] text-slate-400 mt-1">Verified GI Master Craftsman • {product.district}, {product.state}</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {product.artisan_story}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Artisan Cluster Contact: <strong className="text-white">{product.seller_contact}</strong></span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                WhatsApp Enabled
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Sustainability */}
        {activeTab === 'sustainability' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white mb-2">Sustainable Sourcing & Fair Trade Practices</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {product.sustainability_information}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">100% Zero Plastic</span>
                <span className="text-slate-400 text-[11px]">Biodegradable and export-compliant protective packaging.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold block">Ethical Fair Wage</span>
                <span className="text-slate-400 text-[11px]">Guaranteed direct compensation for artisan cooperative members.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-bold block">Natural Dyes</span>
                <span className="text-slate-400 text-[11px]">Pure organic pigments, mineral dyes and eco-certified materials.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Trade & Export */}
        {activeTab === 'trade' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white mb-2">International Trade & Harmonization Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Harmonized Tariff (HS Code)</span>
                <span className="text-cyan-400 font-mono font-bold text-sm">{product.hs_code}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Approved Export Markets</span>
                <span className="text-white font-medium">{product.export_markets}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Payment Terms</span>
                <span className="text-white font-medium">{product.payment_terms}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Estimated Freight Transit</span>
                <span className="text-emerald-400 font-bold">{product.estimated_delivery_days} Business Days via Air Express</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: AI Demand Intelligence */}
        {activeTab === 'ai_demand' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Global Demand Telemetry</h3>
                <p className="text-xs text-slate-400">Algorithmic export potential computed from international buyer requests</p>
              </div>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {product.global_demand_score}% Demand Index
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Buyer Interest Index</span>
                <span className="text-cyan-400 font-bold text-lg">{product.buyer_interest_score}%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Demand Growth Velocity</span>
                <span className="text-emerald-400 font-bold text-lg">↑ +14.8% Monthly</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Peak Commercial Season</span>
                <span className="text-white font-semibold">Q3-Q4 Festival Corridor</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-300 flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-bold mb-0.5">AI Export Pricing Recommendation</strong>
                <span>
                  Current target rate of ${product.target_price} USD provides high price competitiveness for boutique distributors in Singapore and Germany. Recommended wholesale negotiation boundary: ${product.minimum_price} to ${product.target_price} USD.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white mb-2">Verified Wholesale Buyer Reviews</h3>
            <div className="space-y-3">
              {[
                { name: 'Jonathan Tan', country: 'Singapore', rating: 5.0, comment: 'Exquisite craftsmanship! The GI tag documentation and packaging made customs clearance in Singapore seamless.' },
                { name: 'Elena Weber', country: 'Germany', rating: 5.0, comment: 'Unmatched quality and authenticity. The master weaver story resonated tremendously with our European retail buyers.' },
                { name: 'Marcus Vance', country: 'USA', rating: 4.9, comment: 'Consistent dimensions and superior material finish. We increased our recurring wholesale order.' }
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{rev.name}</span>
                      <span className="text-[10px] text-slate-400">({rev.country})</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800">
                        Verified Buyer
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Zoom Lightbox Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            ✕
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-slate-800">
            <img src={currentImg} alt={product.product_name} className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Package,
  Sparkles,
  RefreshCw,
  Tag,
  MapPin,
  DollarSign,
  TrendingUp,
  Check
} from 'lucide-react';
import * as api from '../services/api';
import { Product, ProductListResponse } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../contexts/LanguageContext';

export const MarketplacePage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [giOnly, setGiOnly] = useState(searchParams.get('gi_registered') === 'true');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [exportReady, setExportReady] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'demand');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Mobile Filter Drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, any> = {
        page,
        size: 24,
        sort_by: sortBy,
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedState !== 'ALL') params.state = selectedState;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (giOnly) params.gi_registered = true;
      if (verifiedOnly) params.verified_only = true;
      if (inStockOnly) params.in_stock_only = true;
      if (exportReady) params.export_ready = true;
      if (minPrice) params.min_price = parseFloat(minPrice);
      if (maxPrice) params.max_price = parseFloat(maxPrice);

      const res: ProductListResponse = await api.getProducts(params);
      setProducts(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err: any) {
      setError(err.message || 'Failed to load marketplace products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [
    page,
    debouncedSearch,
    selectedState,
    selectedCategory,
    giOnly,
    verifiedOnly,
    inStockOnly,
    exportReady,
    sortBy,
    minPrice,
    maxPrice
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedState('ALL');
    setSelectedCategory('ALL');
    setGiOnly(false);
    setVerifiedOnly(false);
    setInStockOnly(false);
    setExportReady(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('demand');
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch ||
    selectedState !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    giOnly ||
    verifiedOnly ||
    inStockOnly ||
    exportReady ||
    minPrice ||
    maxPrice;

  const states = ['ALL', 'Tamil Nadu', 'Uttar Pradesh', 'Andhra Pradesh'];
  const categories = [
    'ALL',
    'Handloom & Silk Textiles',
    'Brassware & Metal Craft',
    'Wood Carving & Marquetry',
    'Terracotta & Traditional Pottery',
    'Glassware & Heritage Crafts',
    'Carpet & Floor Textiles',
    'Stone Art & Architectural Relief'
  ];

  const sortOptions = [
    { value: 'demand', label: 'AI Global Demand (High to Low)' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'stock', label: 'Stock Available' }
  ];

  const startCount = (page - 1) * 24 + (products.length > 0 ? 1 : 0);
  const endCount = Math.min(page * 24, total);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Certified Indian GI Craft Registry</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('marketplace_title') || 'Regional MSME Marketplace'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('marketplace_desc') ||
              'Discover verified Indian crafts, GI-registered clusters, master artisan workshops, and export-ready wholesale products.'}
          </p>

          {/* Search Input Bar */}
          <div className="pt-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder') || 'Search products, crafts, GI tags, districts, artisans...'}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Filter Catalog
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* State Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Regional Cluster State</label>
              <div className="space-y-1">
                {states.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedState(st);
                      setPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedState === st
                        ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{st === 'ALL' ? 'All Indian States' : st}</span>
                    {selectedState === st && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Craft Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left truncate ${
                      selectedCategory === cat
                        ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate">{cat === 'ALL' ? 'All Categories' : cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Attributes */}
            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={giOnly}
                  onChange={(e) => {
                    setGiOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <span>GI Registered Only</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <span>In Stock Only (&gt; 0)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={exportReady}
                  onChange={(e) => {
                    setExportReady(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <span>Export Ready (HS Code Compliant)</span>
              </label>
            </div>

            {/* Price Range */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">Price Range ($ USD)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar: Sort, Count & Mobile Filter Button */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center justify-between sm:justify-start space-x-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '●'}</span>
              </button>

              <div className="text-xs text-slate-400">
                <span>{t('showing_products') || 'Showing'} </span>
                <strong className="text-white font-bold">{startCount}–{endCount}</strong>
                <span> {t('of_products') || 'of'} </span>
                <strong className="text-white font-bold">{total}</strong>
                <span> {t('products_label') || 'products'}</span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Active Filters:</span>
              {selectedState !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <span>State: {selectedState}</span>
                  <button onClick={() => setSelectedState('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {giOnly && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <span>GI Registered</span>
                  <button onClick={() => setGiOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                  <span>In Stock</span>
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {exportReady && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                  <span>Export Ready</span>
                  <button onClick={() => setExportReady(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-8 text-center space-y-3 my-6">
              <p className="text-sm text-rose-300">{error}</p>
              <button
                onClick={loadProducts}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 my-6">
              <Package className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No craft products match current filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search query, clearing specific state filters, or relaxing price criteria.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Navigation */}
          {pages > 1 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1.5">
                {[...Array(pages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        page === pNum
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">State</label>
                  <div className="space-y-1">
                    {states.map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedState(st)}
                        className={`w-full text-left p-2 rounded-lg text-xs ${
                          selectedState === st ? 'bg-cyan-950 text-cyan-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {st === 'ALL' ? 'All States' : st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left p-2 rounded-lg text-xs truncate ${
                          selectedCategory === cat ? 'bg-cyan-950 text-cyan-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Apply Filters ({total} Results)
                </button>
                <button
                  onClick={() => {
                    clearFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

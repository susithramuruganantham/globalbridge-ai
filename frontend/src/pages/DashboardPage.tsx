import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  AlertTriangle,
  Globe,
  PlusCircle,
  Sparkles,
  Sliders,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import * as api from '../services/api';
import { DashboardMetrics } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const STATE_COLORS: Record<string, string> = {
  'Tamil Nadu': '#06b6d4',      // cyan-500
  'Uttar Pradesh': '#8b5cf6',   // violet-500
  'Andhra Pradesh': '#10b981',  // emerald-500
};

const CATEGORY_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#f97316'];

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { role, user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load executive dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading Regional Trade Intelligence Dashboard...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Unable to load dashboard data</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Executive Command Center</span>
            <span>•</span>
            <span>Role: {role.replace('_', ' ')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MSME Trade & Inventory Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time export telemetry for 116+ GI-tagged crafts across Tamil Nadu, Uttar Pradesh, and Andhra Pradesh.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadData}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all"
            title="Refresh Live Metrics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync DB</span>
          </button>

          <Link
            to="/add-product"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add GI Product</span>
          </Link>
        </div>
      </div>

      {/* Low Stock Urgent Alert Banner */}
      {metrics.low_stock_products > 0 && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300">
                Critical Inventory Warning: {metrics.low_stock_products} Products Running Low
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Some GI crafts have dropped below the safe threshold of 5 units. Automated WhatsApp restock alerts were logged.
              </p>
            </div>
          </div>
          <Link
            to="/marketplace?in_stock_only=false"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap"
          >
            <span>Review Low Stock Items</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Top 10 Executive KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">{t('stat_products') || 'Total Products'}</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {metrics.total_products}
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">100% GI Authenticated</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">{t('stat_stock') || 'Available Stock'}</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {metrics.total_stock.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across 3 state clusters</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">{t('stat_valuation') || 'Inventory Valuation'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400">
            ${metrics.inventory_valuation.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Target wholesale value</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {metrics.total_orders}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {metrics.completed_orders} Delivered • {metrics.pending_orders} In Pipeline
          </p>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Global Demand</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400">
            {metrics.global_demand_score}%
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">↑ High International Traction</p>
        </div>

        {/* KPI 6 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Active Buyers</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {metrics.active_buyers}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">USA, Singapore, UAE, Germany</p>
        </div>

        {/* KPI 7 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Export Ready</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {metrics.export_opportunities}
          </div>
          <p className="text-[10px] text-cyan-400 mt-1">HS Code Harmonized</p>
        </div>

        {/* KPI 8 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-amber-400">
            {metrics.pending_orders}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Awaiting dispatch/customs</p>
        </div>

        {/* KPI 9 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {metrics.completed_orders}
          </div>
          <p className="text-[10px] text-emerald-400 mt-1">100% Fulfillment</p>
        </div>

        {/* KPI 10 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-xl font-extrabold ${metrics.low_stock_products > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {metrics.low_stock_products}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Threshold: &le; 5 units</p>
        </div>
      </div>

      {/* Primary Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Revenue Trend (Area Chart) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Export Revenue & Order Velocity</h3>
              <p className="text-[11px] text-slate-400">Monthly gross export volume (USD) and fulfilled shipments</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +28.4% YoY Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.revenue_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Export Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Inventory Valuation by State (Bar Chart) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Valuation by State</h3>
              <span className="text-[10px] text-slate-400 font-mono">3 Hubs</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Stock asset distribution across regional clusters</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.valuation_by_state} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <YAxis type="category" dataKey="state" stroke="#94a3b8" tick={{ fontSize: 10 }} width={75} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Inventory Value']}
                  />
                  <Bar dataKey="valuation" radius={[0, 6, 6, 0]}>
                    {metrics.valuation_by_state.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATE_COLORS[entry.state] || '#06b6d4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-[10px]">
            {metrics.valuation_by_state.map((s) => (
              <div key={s.state} className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block truncate">{s.state.replace(' Pradesh', ' P.')}</span>
                <span className="font-bold text-white">${(s.valuation / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Stock by Category & Global Buyer Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Stock by Category (Donut/Pie Chart) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Stock by Category</h3>
            <span className="text-[10px] text-cyan-400 font-medium">8 Crafts</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-4">Volume split across handloom, brass, stone & wood</p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.stock_by_category}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="stock"
                  nameKey="category"
                >
                  {metrics.stock_by_category.map((entry, index) => (
                    <Cell key={`cell-cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  formatter={(value: any, name: any) => [`${value} units`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 mt-2">
            {metrics.stock_by_category.slice(0, 6).map((c, i) => (
              <div key={c.category} className="flex items-center space-x-1.5 truncate">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}></span>
                <span className="truncate">{c.category}: <strong className="text-white">{c.stock}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products by Demand List */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Top High-Velocity GI Crafts</h3>
              <Link to="/marketplace?sort_by=demand" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Highest rated products ranked by Global Demand Score</p>

            <div className="divide-y divide-slate-800/80 space-y-2">
              {metrics.top_products.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="pt-2 flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-4">0{idx + 1}</span>
                    <img
                      src={p.image_url || '/products/default-craft.svg'}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                    />
                    <div>
                      <Link to={`/products/${p.id}`} className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {p.name}
                      </Link>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span>{p.state}</span>
                        <span>•</span>
                        <span className="text-emerald-400">${p.target_price} USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      {p.demand_score}% Demand
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-mono">
                      {p.available_stock} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Buyer Distribution */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Global Wholesale Buyers</h3>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Export destination corridor distribution</p>

            <div className="space-y-2.5">
              {metrics.buyer_distribution.map((b) => (
                <div key={b.country} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{b.country}</span>
                    <span className="text-cyan-400 font-mono font-bold">{b.count} Buyers</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (b.count / 20) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-800 text-center">
            <Link
              to="/orders"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center space-x-1"
            >
              <span>View All Export Shipments</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Trade OS Action Cards */}
      <div className="pt-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Trade OS Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/marketplace"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Browse Marketplace
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Explore 116+ authentic GI products with multi-attribute filtering.
              </p>
            </div>
          </Link>

          <Link
            to="/negotiator"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-start space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                AI Price Negotiator
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluate wholesale buyer counter-offers with guaranteed margin floor.
              </p>
            </div>
          </Link>

          <Link
            to="/campaign-simulator"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-start space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Campaign Simulator
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Model festival discounts, demand boost & inventory stockouts.
              </p>
            </div>
          </Link>

          <Link
            to="/copilot"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                Dialect RAG Copilot
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Query product inventory & export compliance in Tamil, Hindi, or Telugu.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

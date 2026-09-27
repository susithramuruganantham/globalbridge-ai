import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Eye,
  ChevronDown
} from 'lucide-react';
import * as api from '../services/api';
import { Order } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800' },
  CONFIRMED: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-800' },
  PROCESSING: { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-800' },
  PACKED: { bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-800' },
  SHIPPED: { bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-800' },
  DELIVERED: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800' },
  CANCELLED: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-800' }
};

export const OrdersPage: React.FC = () => {
  const { role } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForWhatsApp, setSelectedOrderForWhatsApp] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders(statusFilter !== 'ALL' ? statusFilter : undefined);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const updated = await api.updateOrderStatus(orderId, newStatus, `TRK-${Date.now().toString().slice(-6)}`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusTabs = [
    'ALL',
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.buyer_name.toLowerCase().includes(q) ||
      o.buyer_company.toLowerCase().includes(q) ||
      o.destination_country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Wholesale Orders Pipeline</span>
            <span>•</span>
            <span>Live Relational Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Export Consignments & Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track and manage international wholesale orders, status transitions, and automated WhatsApp delivery telemetry.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Controls Bar: Status Tabs & Search */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, buyer, company or country..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <p className="text-xs text-slate-400">Loading export shipments from database...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/40 border border-rose-900 rounded-2xl p-6 text-center space-y-3">
          <p className="text-xs text-rose-300">{error}</p>
          <button
            onClick={loadOrders}
            className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No orders match current filter</h3>
          <p className="text-xs text-slate-400">
            Try switching status tabs or placing a new test order from the marketplace.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const stStyle = STATUS_COLORS[order.order_status] || STATUS_COLORS.PENDING;
            return (
              <div
                key={order.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-slate-700 transition-all space-y-4"
              >
                {/* Top Row: Order Number, Date & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-base text-white font-mono">
                          {order.order_number}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({new Date(order.created_at).toLocaleDateString()})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Buyer: <strong className="text-white">{order.buyer_name}</strong> • {order.buyer_company} ({order.destination_country})
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown & WhatsApp Button */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedOrderForWhatsApp(order)}
                      className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/80 transition-colors flex items-center space-x-1 text-xs font-semibold"
                      title="Inspect Simulated WhatsApp Alert"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp Alert</span>
                    </button>

                    {/* Status Changer */}
                    <div className="relative">
                      <select
                        value={order.order_status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${stStyle.bg} ${stStyle.text} ${stStyle.border}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items & Financial Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Items List */}
                  <div className="md:col-span-8 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Consignment Items</span>
                    <div className="space-y-1.5">
                      {order.items?.map((it) => (
                        <div key={it.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                          <span className="text-slate-200 font-semibold">{it.product_name}</span>
                          <span className="text-slate-400 font-mono">
                            {it.quantity} units × ${it.unit_price} = <strong className="text-white">${it.total_price} USD</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logistics & Total */}
                  <div className="md:col-span-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Logistics & Tracking</span>
                      <div className="flex items-center space-x-1.5 text-cyan-400 font-mono text-xs mt-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{order.tracking_number || 'N/A'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{order.shipping_method}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                      <span className="text-slate-400 text-xs font-semibold">Total Consignment:</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        ${order.total_amount.toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WhatsApp Message Payload Inspector Modal */}
      {selectedOrderForWhatsApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp Owner Notification Telemetry</span>
              </div>
              <button
                onClick={() => setSelectedOrderForWhatsApp(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-900/40 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-line">
              {`━━━━━━━━━━━━━━━━━━━━
🚚 ORDER STATUS UPDATE — GlobalBridge.AI

Order: ${selectedOrderForWhatsApp.order_number}
Buyer: ${selectedOrderForWhatsApp.buyer_name} (${selectedOrderForWhatsApp.buyer_company})
Tracking Code: ${selectedOrderForWhatsApp.tracking_number}
Destination: ${selectedOrderForWhatsApp.destination_country}
Current Status: ${selectedOrderForWhatsApp.order_status}

👉 Open GlobalBridge dashboard to inspect export documentation.
━━━━━━━━━━━━━━━━━━━━`}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <span className="text-emerald-400 font-semibold">Status: Logged in Gateway</span>
              <button
                onClick={() => setSelectedOrderForWhatsApp(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

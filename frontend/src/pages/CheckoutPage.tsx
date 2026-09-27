import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  ArrowRight,
  Package,
  Sparkles,
  Smartphone,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Form State
  const [buyerName, setBuyerName] = useState(user?.full_name || 'Jonathan Tan');
  const [buyerCompany, setBuyerCompany] = useState(user?.company || 'Singapore Wholesale Imports Pte Ltd');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'buyer@globalbridge.ai');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '+65 6789 0123');
  const [destinationCountry, setDestinationCountry] = useState('Singapore');
  const [destinationAddress, setDestinationAddress] = useState('Changi Logistics Centre, 10 Airport Blvd');
  const [city, setCity] = useState('Singapore');
  const [postalCode, setPostalCode] = useState('819665');
  const [paymentMethod, setPaymentMethod] = useState('Letter of Credit (LC)');
  const [shippingMethod, setShippingMethod] = useState('Air Cargo Express');
  const [notes, setNotes] = useState('Please include GI certification seal on export crates.');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderPayload = {
        buyer_name: buyerName,
        buyer_company: buyerCompany,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        destination_country: destinationCountry,
        destination_address: destinationAddress,
        city,
        postal_code: postalCode,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        notes,
        items: cart.items.map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
          unit_price: it.unit_price
        }))
      };

      const res: Order = await api.createOrder(orderPayload);
      setCreatedOrder(res);
      await clearCart();
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.order_number);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  // If order was successfully placed, render Order Confirmation View
  if (createdOrder) {
    return (
      <div className="max-w-3xl mx-auto my-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Export Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Order #{createdOrder.order_number}
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your wholesale export consignment has been registered. Product inventory was automatically decremented and real-time WhatsApp owner notifications were dispatched.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 text-[10px] block">Order Date</span>
            <span className="font-semibold text-white">
              {new Date(createdOrder.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Destination</span>
            <span className="font-semibold text-white">{createdOrder.destination_country}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Total Amount</span>
            <span className="font-extrabold text-emerald-400">${createdOrder.total_amount.toLocaleString()} USD</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Tracking Code</span>
            <span className="font-mono text-cyan-400 font-bold">{createdOrder.tracking_number}</span>
          </div>
        </div>

        {/* Items Summary Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ordered Craft Items</h3>
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
            {createdOrder.items?.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{item.product_name}</span>
                  <span className="text-[11px] text-slate-400">Qty: {item.quantity} units @ ${item.unit_price}</span>
                </div>
                <span className="font-extrabold text-white font-mono">${item.total_price.toLocaleString()} USD</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated WhatsApp Notification Box */}
        <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <Smartphone className="w-4 h-4" />
              <span>Owner WhatsApp Notification Dispatched</span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              DEMO GATEWAY ACTIVE
            </span>
          </div>

          <div className="bg-slate-950/90 rounded-2xl p-4 text-xs font-mono text-slate-300 border border-emerald-900/40 leading-relaxed whitespace-pre-line">
            {`━━━━━━━━━━━━━━━━━━━━
📦 NEW ORDER — GlobalBridge.AI

Order ID: ${createdOrder.order_number}
Buyer: ${createdOrder.buyer_name} (${createdOrder.buyer_company})
Total Value: $${createdOrder.total_amount.toLocaleString()} USD
Destination: ${createdOrder.destination_country}
Status: PENDING FULFILLMENT
━━━━━━━━━━━━━━━━━━━━`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 text-center"
          >
            Manage Order in Portal
          </Link>

          <Link
            to="/marketplace"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 text-center"
          >
            Continue Sourcing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Checkout Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
          <span>International Export Checkout</span>
          <span>•</span>
          <span>GI Registry Verified</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Commercial Procurement Desk
        </h1>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-900 p-4 rounded-2xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Checkout Form & Summary Grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Fields Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Buyer Information */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">1</span>
              <span>International Buyer & Company Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Authorized Buyer Name *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Business Email *</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">WhatsApp Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Destination & Logistics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">2</span>
              <span>Export Destination & Customs Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Destination Country *</label>
                <select
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Singapore">Singapore (ASEAN Hub)</option>
                  <option value="United States">United States (USA)</option>
                  <option value="Germany">Germany (EU Central)</option>
                  <option value="United Arab Emirates">United Arab Emirates (Dubai)</option>
                  <option value="Australia">Australia</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">City / Port *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-slate-300 font-semibold block mb-1.5">Warehouse / Street Address *</label>
                <input
                  type="text"
                  required
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Terms */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">3</span>
              <span>Commercial Terms & Freight Mode</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Payment Instrument *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Letter of Credit (LC)">Irrevocable Letter of Credit (LC)</option>
                  <option value="Telegraphic Transfer (TT)">Telegraphic Transfer (30% Adv / 70% BL)</option>
                  <option value="Escrow Trade Shield">GlobalBridge Escrow Trade Shield</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Logistics Transit Mode *</label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Air Cargo Express">Air Cargo Priority (7-10 Days)</option>
                  <option value="Ocean Freight Container">Ocean Freight FCL/LCL (20-25 Days)</option>
                  <option value="DHL Express Trade">DHL Express Worldwide Air</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1.5">Special Packing or Certification Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl sticky top-24">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Procurement Summary
            </h3>

            {/* Items */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-800/60">
              {cart.items.map((it) => (
                <div key={it.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="pr-2 truncate">
                    <span className="font-semibold text-white block truncate">{it.product.product_name}</span>
                    <span className="text-[10px] text-slate-400">
                      {it.quantity} units @ ${it.unit_price}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white flex-shrink-0">
                    ${(it.unit_price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-mono font-bold">${cart.subtotal.toLocaleString()} USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Freight</span>
                <span className="text-white font-mono font-bold">${cart.estimated_shipping} USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>GI Certification Stamp</span>
                <span className="text-emerald-400 font-bold">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">Total Payable</span>
                  <span className="text-[10px] text-slate-500">Includes all export duties</span>
                </div>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ${cart.total.toLocaleString()} USD
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.items.length === 0}
              className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Export Contract...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Wholesale Export Order</span>
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-500">
              🔒 256-Bit Encrypted International Trade Gateway
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

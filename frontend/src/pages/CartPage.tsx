import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Package,
  Sparkles,
  Truck
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center space-y-5 shadow-2xl animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
          <ShoppingCart className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Your Wholesale Cart is Empty</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Discover verified GI-registered crafts and handmade export products from regional Indian master artisans.
          </p>
        </div>
        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <span>Explore Regional Marketplace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
            <span>Wholesale Procurement</span>
            <span>•</span>
            <span>{cart.total_items} Total Units</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Export Order Cart
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Cart Grid: Items (Left) + Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const p = item.product;
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={p.image_url || '/products/default-craft.svg'}
                    alt={p.product_name}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] text-cyan-400 font-semibold mb-0.5">
                      <span>{p.district}, {p.state}</span>
                      <span>•</span>
                      <span>{p.craft_type}</span>
                    </div>
                    <Link
                      to={`/products/${p.slug}`}
                      className="text-sm font-bold text-white hover:text-cyan-300 transition-colors line-clamp-1"
                    >
                      {p.product_name}
                    </Link>
                    <div className="text-xs text-slate-400 mt-1">
                      Rate: <strong className="text-white">${item.unit_price}</strong> / {p.unit} (MOQ: {p.minimum_order_quantity})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                  {/* Stepper */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-white font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, Math.min(p.available_stock || 100, item.quantity + 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      ${(item.unit_price * item.quantity).toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-500">USD</span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-950"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl sticky top-24">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Export Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Wholesale Subtotal</span>
                <span className="text-white font-mono font-bold">${cart.subtotal.toLocaleString()} USD</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Est. International Freight</span>
                </span>
                <span className="text-white font-mono font-bold">${cart.estimated_shipping} USD</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GI Customs Certification</span>
                </span>
                <span className="text-emerald-400 font-semibold font-mono">FREE (Subsidy)</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">Total Order Value</span>
                  <span className="text-[10px] text-slate-500">LC / TT Payment Terms</span>
                </div>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ${cart.total.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>Proceed to International Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/marketplace"
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors text-center"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Continue Browsing Crafts</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Smartphone,
  Copy,
  Check,
  Package,
  Layers,
  DollarSign,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import * as api from '../services/api';
import { Product, NegotiationResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const AINegotiatorPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialProductId = searchParams.get('product_id');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>(
    initialProductId ? Number(initialProductId) : ''
  );
  const [buyerName, setBuyerName] = useState('Jonathan Tan');
  const [buyerCompany, setBuyerCompany] = useState('Singapore Wholesale Imports Pte Ltd');
  const [buyerCountry, setBuyerCountry] = useState('Singapore');
  const [quantity, setQuantity] = useState<number>(20);
  const [buyerOffer, setBuyerOffer] = useState<number>(165);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [simulatedSend, setSimulatedSend] = useState(false);

  // Load products list for dropdown
  useEffect(() => {
    api.getProducts({ size: 100 }).then((res) => {
      setProducts(res.items);
      if (!selectedProductId && res.items.length > 0) {
        setSelectedProductId(res.items[0].id);
        setBuyerOffer(Math.round(res.items[0].target_price * 0.85));
        setQuantity(res.items[0].minimum_order_quantity * 2);
      }
    });
  }, []);

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId));

  // Update offer default when product changes
  const handleProductSelect = (id: number) => {
    setSelectedProductId(id);
    const p = products.find((prod) => prod.id === id);
    if (p) {
      setBuyerOffer(Math.round(p.target_price * 0.85));
      setQuantity(p.minimum_order_quantity * 2);
    }
  };

  const handleRunEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      setLoading(true);
      const res = await api.aiEvaluateNegotiation({
        product_id: Number(selectedProductId),
        buyer_name: buyerName,
        buyer_company: buyerCompany,
        buyer_country: buyerCountry,
        requested_quantity: Number(quantity),
        buyer_offer_price: Number(buyerOffer),
        notes
      });
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to evaluate negotiation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPitch = () => {
    if (result) {
      navigator.clipboard.writeText(result.whatsapp_pitch_draft);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    }
  };

  const handleSimulateWhatsAppPitch = async () => {
    if (!result || !selectedProduct) return;
    try {
      setSimulatedSend(true);
      await api.sendWhatsAppMessage({
        recipient_phone: '+6567890123',
        content: result.whatsapp_pitch_draft,
        message_type: 'NEGOTIATION_ALERT',
        template_name: 'globalbridge_negotiation_counter',
        product_id: selectedProduct.id
      });
      alert('WhatsApp counter-offer pitch successfully simulated in the gateway drawer!');
    } catch (e: any) {
      alert(e.message || 'Simulation error');
    } finally {
      setSimulatedSend(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>AI Trade Desk & Margin Protector</span>
          <span>•</span>
          <span>Zero Loss Safeguard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Intelligent Wholesale Price Negotiator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Dynamically evaluate wholesale export offers, protect artisan minimum pricing thresholds, and generate strategic counter-proposals with 1-click WhatsApp drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Selected Product Baseline Card */}
          {selectedProduct && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedProduct.image_url || '/products/default-craft.svg'}
                  alt={selectedProduct.product_name}
                  className="w-14 h-14 rounded-2xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                    {selectedProduct.district}, {selectedProduct.state}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {selectedProduct.product_name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Artisan: {selectedProduct.artisan_name}
                  </span>
                </div>
              </div>

              {/* Baseline Price Boundaries */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Target Rate</span>
                  <span className="font-extrabold text-white">${selectedProduct.target_price}</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-900/60">
                  <span className="text-rose-400 text-[10px] font-bold block">Hard Floor Min</span>
                  <span className="font-extrabold text-rose-300">${selectedProduct.minimum_price}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">MOQ / Stock</span>
                  <span className="font-bold text-cyan-400">{selectedProduct.minimum_order_quantity} / {selectedProduct.available_stock}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRunEvaluation} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Buyer Inbound Offer Parameters
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Select GI Craft Product *</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name} (${p.wholesale_price} USD • Min: ${p.minimum_price})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Buyer Name *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Buyer Company *</label>
                <input
                  type="text"
                  required
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Destination Country *</label>
                <input
                  type="text"
                  required
                  value={buyerCountry}
                  onChange={(e) => setBuyerCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Requested Units (Quantity) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-amber-400 block mb-1.5">
                Buyer Proposed Offer Price ($ USD / Unit) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={buyerOffer}
                  onChange={(e) => setBuyerOffer(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-extrabold text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Try testing an offer below ${selectedProduct?.minimum_price} to test the automated margin safety rejection!
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{loading ? 'Evaluating Strategic Margins...' : 'Run AI Margin & Elasticity Evaluation'}</span>
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-6 space-y-6">
          {!result ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">AI Trade Desk Standing By</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter the buyer's offer price and quantity on the left to evaluate commercial profitability and generate talking points.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
              {/* Decision Outcome Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Evaluation Outcome
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    {result.status === 'ACCEPTED' ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>OFFER ACCEPTED</span>
                      </span>
                    ) : result.status === 'COUNTER_OFFERED' ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-cyan-950 text-cyan-400 border border-cyan-800">
                        <Sparkles className="w-4 h-4" />
                        <span>COUNTER-OFFER RECOMMENDED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-950 text-rose-400 border border-rose-800">
                        <XCircle className="w-4 h-4" />
                        <span>OFFER REJECTED (BELOW FLOOR)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Suggested Rate</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    ${result.suggested_counter_price} <span className="text-xs text-slate-400">/ unit</span>
                  </span>
                </div>
              </div>

              {/* Deal Breakdown Matrix */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Total Deal Value</span>
                  <span className="font-extrabold text-white font-mono">${result.total_deal_value.toLocaleString()} USD</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">MSME Profit Margin</span>
                  <span className="font-extrabold text-emerald-400 font-mono">{result.profit_margin_pct}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Discount Allowed</span>
                  <span className="font-bold text-cyan-400 font-mono">{result.discount_pct}% off</span>
                </div>
              </div>

              {/* Strategic Rationale */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[10px]">
                  AI Elasticity & Margin Rationale
                </span>
                <p className="text-slate-300 leading-relaxed">{result.ai_rationale}</p>
              </div>

              {/* Recommended Talking Points */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  Strategic Negotiation Talking Points
                </span>
                <ul className="space-y-1.5">
                  {result.recommended_talking_points.map((pt, i) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WhatsApp Counter Pitch Draft */}
              <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <div className="flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4" />
                    <span>Formatted WhatsApp Pitch</span>
                  </div>
                  <button
                    onClick={handleCopyPitch}
                    className="flex items-center space-x-1 text-[11px] text-slate-300 hover:text-white"
                  >
                    {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPitch ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/40 text-xs text-slate-300 font-sans leading-relaxed">
                  {result.whatsapp_pitch_draft}
                </div>

                <button
                  onClick={handleSimulateWhatsAppPitch}
                  disabled={simulatedSend}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>{simulatedSend ? 'Simulating...' : 'Dispatch Counter Pitch via WhatsApp Gateway'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

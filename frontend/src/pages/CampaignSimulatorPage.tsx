import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import * as api from '../services/api';
import { CampaignSimulationResult } from '../types';

export const CampaignSimulatorPage: React.FC = () => {
  const [campaignName, setCampaignName] = useState('Diwali & Autumn Global Craft Expo');
  const [discountPercentage, setDiscountPercentage] = useState<number>(12);
  const [targetRegion, setTargetRegion] = useState('ALL');
  const [targetCategory, setTargetCategory] = useState('ALL');
  const [durationDays, setDurationDays] = useState(14);
  const [budget, setBudget] = useState(2500);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignSimulationResult | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.aiSimulateCampaign({
        campaign_name: campaignName,
        discount_percentage: Number(discountPercentage),
        target_region: targetRegion,
        target_category: targetCategory,
        duration_days: Number(durationDays),
        marketing_budget_usd: Number(budget)
      });
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to run campaign simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Cluster Revenue Engineering</span>
          <span>•</span>
          <span>Simulation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Export Campaign & Promotion Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Model festival discount elasticity, demand velocity, inventory depletion, and verify that discounted prices never breach artisan minimum cost floors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Simulator Controls */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSimulate} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Campaign Parameters
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Campaign Name *</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Discount Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Discount Percentage</span>
                <span className="text-cyan-400 font-mono text-base font-extrabold">{discountPercentage}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>1% (Conservative)</span>
                <span>35% (Aggressive)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Target Cluster State</label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="ALL">All States (116 Crafts)</option>
                  <option value="Tamil Nadu">Tamil Nadu (54 Crafts)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (32 Crafts)</option>
                  <option value="Andhra Pradesh">Andhra Pradesh (30 Crafts)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Target Category</label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Handloom & Silk Textiles">Handloom & Silk</option>
                  <option value="Brassware & Metal Craft">Brassware & Metal</option>
                  <option value="Wood Carving & Marquetry">Wood Carving</option>
                  <option value="Terracotta & Traditional Pottery">Terracotta</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Duration (Days)</label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Promo Budget ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Sliders className="w-4 h-4" />
              <span>{loading ? 'Running Predictive Models...' : 'Run Campaign Simulation'}</span>
            </button>
          </form>
        </div>

        {/* Right Simulation Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                <Sliders className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Campaign Simulator Ready</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Adjust discount rate, target craft category, and promotional budget to project revenue lift and inventory impact.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
              {/* Outcome Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">{result.campaign_name}</h3>
                  <span className="text-[11px] text-slate-400">Simulation Projections for {discountPercentage}% Discount</span>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                    result.risk_level === 'HIGH'
                      ? 'bg-rose-950 text-rose-400 border-rose-800'
                      : result.risk_level === 'MEDIUM'
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}
                >
                  {result.risk_level} RISK PROFILE
                </span>
              </div>

              {/* 4 KPI Impact Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Projected Demand</span>
                  <span className="text-lg font-extrabold text-cyan-400 font-mono">
                    +{result.projected_demand_increase_pct}%
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Projected Revenue</span>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono">
                    ${result.projected_gross_revenue_usd.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Units Depletion</span>
                  <span className="text-lg font-extrabold text-white font-mono">
                    {result.projected_inventory_depletion_units}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Conversion Rate</span>
                  <span className="text-lg font-extrabold text-indigo-400 font-mono">
                    {result.projected_conversion_rate_pct}%
                  </span>
                </div>
              </div>

              {/* AI Strategic Recommendation Box */}
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  result.risk_level === 'HIGH'
                    ? 'bg-rose-950/40 border-rose-900 text-rose-300'
                    : 'bg-emerald-950/30 border-emerald-900 text-emerald-300'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold mb-1">
                  {result.risk_level === 'HIGH' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Strategic Recommendation</span>
                </div>
                <p>{result.recommendation}</p>
              </div>

              {/* Top Impacted Products Preview Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Product Level Impact Sample
                </h4>
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80 text-xs">
                  {result.top_impacted_products.slice(0, 5).map((p) => (
                    <div key={p.product_id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{p.product_name}</span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                          <span>Orig: ${p.original_price}</span>
                          <span>→</span>
                          <span className="text-emerald-400 font-bold">Promo: ${p.discounted_price}</span>
                          <span>(Min: ${p.minimum_price})</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {p.is_below_minimum ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                            BELOW FLOOR
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            Est. +{p.projected_depletion_units} units sold
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

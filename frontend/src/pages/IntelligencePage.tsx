import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Globe,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  MapPin,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import * as api from '../services/api';

export const IntelligencePage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadIntelligence = async () => {
    try {
      setLoading(true);
      const res = await api.getDemandIntelligence();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntelligence();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="text-xs text-slate-400">Synthesizing Regional MSME Trade Telemetry...</p>
      </div>
    );
  }

  const categoryGrowthData = [
    { name: 'Kanchipuram Silk', growth: 24.8, demand: 94 },
    { name: 'Banarasi Brocade', growth: 21.2, demand: 92 },
    { name: 'Swamimalai Bronze', growth: 18.5, demand: 89 },
    { name: 'Kalamkari Handloom', growth: 19.4, demand: 88 },
    { name: 'Bhadohi Carpets', growth: 15.6, demand: 86 },
    { name: 'Kondapalli Toys', growth: 17.8, demand: 87 },
    { name: 'Moradabad Brass', growth: 16.2, demand: 85 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Global Demand Intelligence</span>
            <span>•</span>
            <span>Predictive AI Corridors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MSME Trade Velocity & Demand Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics forecasting international wholesale interest, market elasticity and export readiness.
          </p>
        </div>

        <button
          onClick={loadIntelligence}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Radar</span>
        </button>
      </div>

      {/* Top 3 Intelligence Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Global Average Demand</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {data.global_average_demand}%
          </div>
          <p className="text-xs text-slate-300">
            Peak export velocity across ASEAN, North American and European corridors.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Fastest Growing Craft</span>
          <div className="text-lg font-bold text-white leading-tight">
            {data.fastest_growing_craft}
          </div>
          <p className="text-xs text-cyan-400 font-semibold">
            ↑ +24.8% Monthly Inquiry Volume
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Primary Trade Corridor</span>
          <div className="text-lg font-bold text-white leading-tight">
            {data.top_export_corridor}
          </div>
          <p className="text-xs text-slate-300">
            Singapore Changi Logistics Hub & JFK Port New York
          </p>
        </div>
      </div>

      {/* Chart: Growth Rate by Craft Category */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Demand Growth by Craft Cluster (%)</h3>
            <p className="text-[11px] text-slate-400">Algorithmic velocity calculated from international inquiry surges</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            Q3-Q4 Festival Surge Active
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `+${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(val: any) => [`+${val}% Growth`, 'Velocity']}
              />
              <Bar dataKey="growth" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 12 High Demand Products Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Top Export-Ranked Craft Consignments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.insights.map((item: any) => (
            <div
              key={item.product_id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                    {item.district}, {item.state}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {item.global_demand_score}% Demand
                  </span>
                </div>

                <Link
                  to={`/products/${item.product_id}`}
                  className="text-sm font-bold text-white hover:text-cyan-300 transition-colors line-clamp-1 block"
                >
                  {item.product_name}
                </Link>

                <p className="text-[11px] text-slate-400">
                  Top Markets: <strong className="text-slate-200">{item.top_markets.join(', ')}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-400 font-mono">
                  ${item.target_price} USD
                </span>

                <Link
                  to={`/negotiator?product_id=${item.product_id}`}
                  className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>Evaluate Deal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

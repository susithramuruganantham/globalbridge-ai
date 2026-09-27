import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Award, MessageCircle, ArrowUpRight, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      {/* Upper Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 flex items-center justify-center">
                <Globe className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <span className="font-extrabold text-base text-white">
                GlobalBridge<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              AI-Powered Digital Trade Operating System connecting Indian MSMEs, GI-registered craft clusters, and regional artisans to international wholesale buyers across Singapore, USA, Europe, and UAE.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>116+ Verified GI Craft Registries</span>
            </div>
          </div>

          {/* Col 2: Regional Craft Clusters */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Regional MSME Clusters
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/marketplace?state=Tamil+Nadu" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Tamil Nadu (Kanchi, Madurai, Thanjavur)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/marketplace?state=Uttar+Pradesh" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Uttar Pradesh (Varanasi, Lucknow, Moradabad)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/marketplace?state=Andhra+Pradesh" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Andhra Pradesh (Kondapalli, Kalamkari, Uppada)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/marketplace?gi_registered=true" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  ✦ Explore All GI Tagged Crafts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Trade & AI Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              AI Trade Architecture
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/negotiator" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI Negotiation Engine</span>
                </Link>
              </li>
              <li>
                <Link to="/intelligence" className="hover:text-cyan-400 transition-colors">
                  Global Demand & Trade Flows
                </Link>
              </li>
              <li>
                <Link to="/campaign-simulator" className="hover:text-cyan-400 transition-colors">
                  Festival Campaign Simulator
                </Link>
              </li>
              <li>
                <Link to="/copilot" className="hover:text-cyan-400 transition-colors">
                  Dialect RAG Assistant (EN/TA/HI/TE)
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-cyan-400 transition-colors">
                  WhatsApp Cloud Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Verification & WhatsApp Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Trust & Compliance
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Geographical Indications Registry (GI) Compliant</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>HS Code & Customs Automated Harmonization</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-emerald-400">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>Meta WhatsApp Cloud API Verified Gateway</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span>© 2026 GlobalBridge.AI v3.0</span>
            <span>•</span>
            <span>Empowering 100,000+ Regional Indian Artisans</span>
          </div>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span>English</span>
            <span>•</span>
            <span>தமிழ்</span>
            <span>•</span>
            <span>हिन्दी</span>
            <span>•</span>
            <span>తెలుగు</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

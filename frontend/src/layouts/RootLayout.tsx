import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppSimulatorDrawer } from '../components/WhatsAppSimulatorDrawer';
import { MessageSquare, Smartphone, Sparkles } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const [whatsAppDrawerOpen, setWhatsAppDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Primary Navigation */}
      <Navbar onOpenWhatsAppDrawer={() => setWhatsAppDrawerOpen(true)} />

      {/* Main Page Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out WhatsApp Simulator Drawer */}
      <WhatsAppSimulatorDrawer
        isOpen={whatsAppDrawerOpen}
        onClose={() => setWhatsAppDrawerOpen(false)}
      />

      {/* Floating Action Buttons: WhatsApp & Copilot */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col space-y-2.5">
        <Link
          to="/copilot"
          className="group flex items-center space-x-2 px-3 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
          title="Open Regional RAG Copilot"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">RAG Copilot</span>
        </Link>

        <button
          onClick={() => setWhatsAppDrawerOpen(true)}
          className="group flex items-center space-x-2 px-3 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all"
          title="Open WhatsApp Cloud Alerts Simulator"
        >
          <Smartphone className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">WhatsApp Live</span>
        </button>
      </div>
    </div>
  );
};

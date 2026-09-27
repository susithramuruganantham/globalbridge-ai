import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Send,
  Globe,
  Trash2,
  Package,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Bot,
  User
} from 'lucide-react';
import * as api from '../services/api';
import { AIChatMessage, Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const RAGCopilotPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      sender: 'bot',
      text:
        'Vanakkam & Welcome to the GlobalBridge.AI Regional RAG Copilot! I am directly connected to the verified Indian GI craft database (116+ products across Tamil Nadu, Uttar Pradesh, and Andhra Pradesh). Ask me about products, export compliance, low stock alerts, or pricing in English, தமிழ், हिन्दी, or తెలుగు.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_queries: [
        'Show me GI silk products from Tamil Nadu',
        'Which products have the highest demand?',
        'Which products are export ready for Singapore?',
        'Which products have stock below 5 units?',
        'Show brass and metal crafts under $150'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (queryText: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: AIChatMessage = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.aiChatCopilot(q, language);
      const botMsg: AIChatMessage = {
        sender: 'bot',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        retrieved_products: res.retrieved_products,
        suggested_queries: res.suggested_queries
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Error retrieving database intelligence: ${e.message || 'Server connection issue'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Chat history cleared. How can I assist your regional trade exploration today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_queries: [
          'Show me GI silk products from Tamil Nadu',
          'Which products have the highest demand?',
          'Which products are export ready for Singapore?',
          'Which products have stock below 5 units?'
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Multilingual Database Intelligence</span>
            <span>•</span>
            <span>Dialect RAG Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Regional MSME Dialect Copilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Natural language trade query retrieval across 116+ GI crafts in English, Tamil, Hindi, and Telugu.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dialect Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['EN', 'TA', 'HI', 'TE'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  language === l
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/60">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-bold text-xs'
                    : 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={`max-w-2xl space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-950/80 border border-cyan-800 text-slate-100 rounded-2xl rounded-tr-sm p-4'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-800/60">
                  <span className="font-semibold text-cyan-400">
                    {msg.sender === 'user' ? 'Trade Inquirer' : 'GlobalBridge Dialect Engine'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-200 font-sans">
                  {msg.text}
                </p>

                {/* Embedded Retrieved Product Cards */}
                {msg.retrieved_products && msg.retrieved_products.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Live Relational Database Results ({msg.retrieved_products.length} Items)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.retrieved_products.map((p) => (
                        <div
                          key={p.id}
                          className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between space-x-3"
                        >
                          <img
                            src={p.image_url || '/products/default-craft.svg'}
                            alt={p.product_name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-cyan-400 font-medium block truncate">
                              {p.district}, {p.state}
                            </span>
                            <Link
                              to={`/products/${p.slug}`}
                              className="text-xs font-bold text-white hover:text-cyan-300 transition-colors line-clamp-1 block"
                            >
                              {p.product_name}
                            </Link>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="text-emerald-400 font-bold">${p.wholesale_price} USD</span>
                              <span>•</span>
                              <span>Stock: {p.available_stock}</span>
                            </div>
                          </div>
                          <Link
                            to={`/products/${p.slug}`}
                            className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 hover:bg-slate-800"
                            title="View Details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Queries Chips */}
                {msg.suggested_queries && msg.suggested_queries.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggested_queries.map((qText, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(qText)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors text-left"
                      >
                        ✦ {qText}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <span>Querying database vectors & regional craft schema...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about crafts, GI clusters, stocks or prices in English, தமிழ், हिन्दी, or తెలుగు..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

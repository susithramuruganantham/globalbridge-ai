import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Send,
  CheckCheck,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  PhoneCall,
  Smartphone
} from 'lucide-react';
import * as api from '../services/api';
import { WhatsAppMessage } from '../types';

interface WhatsAppSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSimulatorDrawer: React.FC<WhatsAppSimulatorDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [settings, setSettings] = useState<{ mode: string; owner_phone: string }>({
    mode: 'DEMO',
    owner_phone: '+919876543210'
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const [msgData, setData] = await Promise.all([
        api.getWhatsAppMessages(),
        api.getWhatsAppSettings().catch(() => ({ mode: 'DEMO', owner_phone: '+919876543210' }))
      ]);
      setMessages(msgData);
      setSettings(setData);
    } catch (e) {
      console.warn('Failed to load WhatsApp messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleSendTestAlert = async () => {
    try {
      setSendingTest(true);
      await api.sendWhatsAppMessage({
        recipient_phone: settings.owner_phone || '+919876543210',
        content:
          "━━━━━━━━━━━━━━━━━━━━\n" +
          "📦 *NEW ORDER — GlobalBridge.AI*\n\n" +
          "*Order ID:* GB-2026-TEST\n" +
          "*Product:* Kanchipuram Silk Saree — Temple Zari Border\n" +
          "*Buyer:* Singapore Wholesale Imports Pte Ltd\n" +
          "*Quantity:* 25 units\n" +
          "*Unit Price:* $189.00\n" +
          "*Order Value:* $4,725.00 USD\n" +
          "*Destination:* Singapore\n" +
          "*Payment:* Confirmed / Letter of Credit\n" +
          "*Status:* NEW ORDER\n\n" +
          "👉 Open GlobalBridge dashboard to manage this export order.\n" +
          "━━━━━━━━━━━━━━━━━━━━",
        message_type: 'ORDER_NOTIFICATION',
        template_name: 'globalbridge_order_alert'
      });
      await fetchMessages();
    } catch (e: any) {
      alert(e.message || 'Failed to dispatch test message');
    } finally {
      setSendingTest(false);
    }
  };

  const copyToClipboard = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">WhatsApp Gateway</h3>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      settings.mode === 'REAL'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {settings.mode === 'REAL' ? 'REAL CLOUD API' : 'DEMO MODE ACTIVE'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recipient: MSME Owner ({settings.owner_phone})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={fetchMessages}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Refresh Message Feed"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-token automated dispatch simulator</span>
            </div>
            <button
              onClick={handleSendTestAlert}
              disabled={sendingTest}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800"
            >
              {sendingTest ? 'Sending...' : '+ Send Test Alert'}
            </button>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
            {messages.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  No WhatsApp notifications recorded yet.
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  When you place an order, update order status, or encounter low stock, WhatsApp alerts will appear here.
                </p>
                <button
                  onClick={handleSendTestAlert}
                  disabled={sendingTest}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simulate First Order Alert</span>
                </button>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                    <span className="font-mono text-emerald-400">
                      {msg.message_type.replace('_', ' ')}
                    </span>
                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>

                  <div className="relative bg-emerald-950/40 border border-emerald-900/60 rounded-2xl p-3.5 text-xs text-slate-200 font-sans shadow-lg">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">
                      {msg.content}
                    </pre>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-emerald-900/40 text-[10px] text-slate-400">
                      <div className="flex items-center space-x-1 text-emerald-400">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {msg.is_simulated
                            ? 'Simulated in Gateway'
                            : msg.status === 'SENT'
                            ? 'Delivered via Meta API'
                            : 'Failed Delivery'}
                        </span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                        title="Copy Message Text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer controls */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
            <span className="text-[10px]">
              Meta Cloud API v19.0 Compatible
            </span>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/settings';
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center space-x-1"
            >
              <span>API Gateway Settings</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

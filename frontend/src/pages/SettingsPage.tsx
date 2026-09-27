import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Key,
  Globe,
  Database,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Lock,
  RefreshCw
} from 'lucide-react';
import * as api from '../services/api';

export const SettingsPage: React.FC = () => {
  const [mode, setMode] = useState<'DEMO' | 'REAL'>('DEMO');
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  const [verifyToken, setVerifyToken] = useState('globalbridge_verify_token_2026');
  const [ownerPhone, setOwnerPhone] = useState('+919876543210');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    api.getWhatsAppSettings().then((data) => {
      if (data) {
        setMode(data.mode || 'DEMO');
        setAccessToken(data.access_token || '');
        setPhoneNumberId(data.phone_number_id || '');
        setBusinessAccountId(data.business_account_id || '');
        setVerifyToken(data.verify_token || 'globalbridge_verify_token_2026');
        setOwnerPhone(data.owner_phone || '+919876543210');
      }
    }).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateWhatsAppSettings({
        mode,
        access_token: accessToken,
        phone_number_id: phoneNumberId,
        business_account_id: businessAccountId,
        verify_token: verifyToken,
        owner_phone: ownerPhone
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestMessage = async () => {
    try {
      setTestSending(true);
      setTestResult(null);
      const res = await api.sendWhatsAppMessage({
        recipient_phone: ownerPhone,
        content: `━━━━━━━━━━━━━━━━━━━━\n📦 *TEST NOTIFICATION — GlobalBridge.AI*\n\nGateway Mode: ${mode}\nStatus: Active & Operational\nTimestamp: ${new Date().toISOString()}\n━━━━━━━━━━━━━━━━━━━━`,
        message_type: 'ORDER_NOTIFICATION',
        template_name: 'test_alert'
      });
      setTestResult(`Message dispatched successfully! [Status: ${res.status}]`);
    } catch (e: any) {
      setTestResult(`Dispatch error: ${e.message}`);
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Enterprise System Configuration</span>
          <span>•</span>
          <span>Integrations & Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Platform Gateway & WhatsApp Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage Meta WhatsApp Cloud API credentials, webhook verification endpoints, and platform database connectivity.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Configuration saved successfully and reloaded into backend runtime.</span>
        </div>
      )}

      {/* WhatsApp Cloud Gateway Card */}
      <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Meta WhatsApp Cloud Gateway</h3>
              <p className="text-[11px] text-slate-400">Configure simulated demo mode or live production Meta Cloud API</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('DEMO')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'DEMO'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Demo Mode
            </button>
            <button
              type="button"
              onClick={() => setMode('REAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'REAL'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Real Cloud API
            </button>
          </div>
        </div>

        {mode === 'DEMO' ? (
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-900/40 text-xs text-amber-300 space-y-1">
            <span className="font-bold block">Demo Mode Active (Zero Token Cost)</span>
            <p className="text-slate-400 text-[11px]">
              All outgoing WhatsApp notifications (orders, status updates, low stock alerts) are safely rendered in the interactive slide-out WhatsApp drawer without invoking external billable APIs.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-900/60 text-xs text-emerald-300 space-y-1">
            <span className="font-bold block">Production Meta WhatsApp Cloud API Ready</span>
            <p className="text-slate-300 text-[11px]">
              Ensure you have provided your System User Access Token, Phone Number ID, and Business Account ID from Meta for Developers.
            </p>
          </div>
        )}

        {/* Credentials Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Owner WhatsApp Phone Number *</label>
            <input
              type="tel"
              required
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Webhook Verify Token *</label>
            <input
              type="text"
              required
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-300 font-semibold block mb-1.5">Meta Graph API Access Token (Permanent)</label>
            <div className="relative">
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="EAA..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Phone Number ID</label>
            <input
              type="text"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="e.g. 100654321987654"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">WhatsApp Business Account ID</label>
            <input
              type="text"
              value={businessAccountId}
              onChange={(e) => setBusinessAccountId(e.target.value)}
              placeholder="e.g. 200987654321098"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Webhook Documentation Strip */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
          <span className="text-slate-400 font-semibold block">Inbound Webhook Endpoint URL</span>
          <code className="text-cyan-400 font-mono text-xs block select-all">
            https://your-domain.com/api/whatsapp/webhook
          </code>
          <p className="text-[10px] text-slate-500">
            Supports Meta Webhook Verification challenge (GET) and incoming message delivery callbacks (POST).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSendTestMessage}
            disabled={testSending}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testSending ? 'Sending Test...' : 'Send Live Test Message'}</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>

        {testResult && (
          <p className="text-xs text-cyan-300 bg-cyan-950/60 p-3 rounded-xl border border-cyan-800">
            {testResult}
          </p>
        )}
      </form>

      {/* Database & Architecture Telemetry Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Relational Database & Seed Telemetry</h3>
            <p className="text-[11px] text-slate-400">SQLite Development Engine (PostgreSQL Compatible)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Unique Products</span>
            <span className="text-base font-extrabold text-white font-mono">116 Products</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Tamil Nadu</span>
            <span className="text-base font-extrabold text-cyan-400 font-mono">54 Products</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Uttar Pradesh</span>
            <span className="text-base font-extrabold text-indigo-400 font-mono">32 Products</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Andhra Pradesh</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">30 Products</span>
          </div>
        </div>
      </div>
    </div>
  );
};

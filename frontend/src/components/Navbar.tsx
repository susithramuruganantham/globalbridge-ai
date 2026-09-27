import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Globe,
  ShoppingCart,
  Bell,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Package,
  Layers,
  Heart,
  PlusCircle,
  UserCheck,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, Role } from '../types';
import * as api from '../services/api';

interface NavbarProps {
  onOpenWhatsAppDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWhatsAppDrawer }) => {
  const { role, switchRole, user } = useAuth();
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll notifications
  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.slice(0, 5));
      const unread = data.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      await fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { path: '/dashboard', label: t('nav_dashboard') || 'Dashboard', icon: Layers },
    { path: '/marketplace', label: t('nav_marketplace') || 'Marketplace', icon: Package },
    { path: '/orders', label: t('nav_orders') || 'Orders', icon: ShieldCheck },
    { path: '/intelligence', label: t('nav_intelligence') || 'Intelligence', icon: TrendingUp },
    { path: '/negotiator', label: t('nav_negotiator') || 'AI Negotiator', icon: Sparkles },
    { path: '/campaign-simulator', label: t('nav_campaign') || 'Campaigns', icon: Sliders },
    { path: '/copilot', label: t('nav_copilot') || 'RAG Copilot', icon: MessageSquare },
    { path: '/settings', label: t('nav_settings') || 'Settings', icon: Settings },
  ];

  const roleOptions: { role: Role; label: string; desc: string; badge: string }[] = [
    { role: 'MSME_OWNER', label: 'MSME Owner', desc: 'Manage catalog, orders & AI price negotiation', badge: 'bg-emerald-500/20 text-emerald-400' },
    { role: 'BUYER', label: 'Wholesale Buyer', desc: 'Browse GI crafts, negotiate & place bulk export orders', badge: 'bg-cyan-500/20 text-cyan-400' },
    { role: 'ARTISAN', label: 'Artisan Guild', desc: 'Craft registry, heritage stories & cluster stock', badge: 'bg-amber-500/20 text-amber-400' },
    { role: 'ADMIN', label: 'Platform Admin', desc: 'System governance, verify GI tags & monitor WhatsApp', badge: 'bg-purple-500/20 text-purple-400' }
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'TA', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'HI', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'TE', label: 'తెలుగు', flag: '🇮🇳' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-b border-emerald-900/30 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            LIVE CLUSTERS
          </span>
          <span className="hidden sm:inline text-slate-300">
            Connecting 116+ GI Crafts across Tamil Nadu, Uttar Pradesh & Andhra Pradesh to Global Markets
          </span>
          <span className="sm:hidden text-slate-300">116+ GI Verified MSME Crafts Online</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenWhatsAppDrawer}
            className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>WhatsApp Gateway</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    GlobalBridge<span className="text-cyan-400">.AI</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    v3.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium hidden md:block">
                  Trade Intelligence OS
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-all"
                title="Change Regional Language"
              >
                <span>{languages.find((l) => l.code === language)?.flag}</span>
                <span>{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Dialect
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                        language === l.code
                          ? 'bg-cyan-950/60 text-cyan-400 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="hidden sm:inline font-medium">
                  {roleOptions.find((r) => r.role === role)?.label || role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t('switch_role') || 'Switch Persona View'}
                  </div>
                  <div className="space-y-1 mt-1">
                    {roleOptions.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg transition-all flex flex-col ${
                          role === r.role
                            ? 'bg-slate-800 border border-cyan-500/30'
                            : 'hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{r.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${r.badge}`}>
                            {r.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5 leading-tight">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setRoleDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                title="Owner Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Owner Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2 space-y-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No new alerts</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded-lg transition-colors ${
                            n.is_read ? 'opacity-70' : 'bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center space-x-1"
                    >
                      <span>View All Notification Logs</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="View Wholesale Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-slate-700 transition-all hidden sm:block"
              title="Saved Crafts"
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-800">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800' : 'text-slate-300 bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <Link
              to="/add-product"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-xs font-medium text-emerald-400 p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Register New GI Product</span>
            </Link>
            <Link
              to="/register-artisan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-xs font-medium text-cyan-400 p-2 rounded-lg bg-cyan-950/40 border border-cyan-900/50"
            >
              <UserCheck className="w-4 h-4" />
              <span>+ Onboard Master Artisan</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

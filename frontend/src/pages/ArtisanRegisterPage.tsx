import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserCheck,
  Award,
  ShieldCheck,
  PhoneCall,
  MapPin,
  CheckCircle2,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import * as api from '../services/api';

export const ArtisanRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Kanchipuram');
  const [city, setCity] = useState('Kanchipuram');
  const [clusterName, setClusterName] = useState('Kanchipuram Traditional Silk Weavers Guild');
  const [craftType, setCraftType] = useState('Handloom Silk Weaving');
  const [giRegistrationNo, setGiRegistrationNo] = useState('GI-APPL-46-2005');
  const [experienceYears, setExperienceYears] = useState(25);
  const [artisanCount, setArtisanCount] = useState(40);
  const [contactPhone, setContactPhone] = useState('+91 94432 11001');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 94432 11001');
  const [story, setStory] = useState(
    'Practicing 4th-generation Korvai zari interlocking technique with pure mulberry silk and gold zari threads.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.registerArtisan({
        name,
        business_name: businessName,
        state,
        district,
        city,
        cluster_name: clusterName,
        craft_type: craftType,
        gi_registration_no: giRegistrationNo,
        experience_years: Number(experienceYears),
        artisan_count: Number(artisanCount),
        contact_phone: contactPhone,
        whatsapp_number: whatsappNumber,
        story,
        verified_status: 'GI_VERIFIED'
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to register artisan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-white">Master Artisan Onboarded!</h2>
        <p className="text-xs text-slate-400">
          <strong>{name}</strong> from {clusterName} has been successfully added to the verified GI artisan database.
        </p>
        <div className="flex items-center justify-center space-x-3 pt-4">
          <Link
            to="/add-product"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            + Register Products for Artisan
          </Link>
          <Link
            to="/marketplace"
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs"
          >
            View Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Guild Onboarding</span>
          <span>•</span>
          <span>GI Registry Provenance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Register Master Artisan Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Onboard regional master craftsmen, GI-registered cluster leads, and artisan guilds directly to the platform database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Master Artisan Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. K. Sundaramoorthy"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Guild / Workshop Business Name *</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Kanchi Handloom Silk Weavers Society"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">State *</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">District *</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">City / Town *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Cluster Name *</label>
            <input
              type="text"
              required
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Craft Type *</label>
            <input
              type="text"
              required
              value={craftType}
              onChange={(e) => setCraftType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">GI Registration Number</label>
            <input
              type="text"
              value={giRegistrationNo}
              onChange={(e) => setGiRegistrationNo(e.target.value)}
              placeholder="e.g. GI-INDIA-2026-TN"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Experience (Years) *</label>
            <input
              type="number"
              required
              min={1}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Number of Artisans in Guild *</label>
            <input
              type="number"
              required
              min={1}
              value={artisanCount}
              onChange={(e) => setArtisanCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Contact Phone *</label>
            <input
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">WhatsApp Order Number *</label>
            <input
              type="tel"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-300 font-semibold block mb-1.5">Artisan Heritage Story & Lineage *</label>
            <textarea
              required
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>{loading ? 'Saving to Database...' : 'Register Master Artisan'}</span>
        </button>
      </form>
    </div>
  );
};

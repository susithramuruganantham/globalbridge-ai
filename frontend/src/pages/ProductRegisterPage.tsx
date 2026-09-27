import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  ShieldCheck,
  Award,
  CheckCircle2,
  DollarSign,
  Layers,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import * as api from '../services/api';

export const ProductRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  // Form State with authentic MSME defaults
  const [productName, setProductName] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Madurai');
  const [city, setCity] = useState('Madurai');
  const [artisanCluster, setArtisanCluster] = useState('Madurai Sungudi Guild');
  const [artisanName, setArtisanName] = useState('R. Meenakshisundaram');
  const [category, setCategory] = useState('Handloom & Silk Textiles');
  const [subCategory, setSubCategory] = useState('Sarees & Handloom');
  const [craftType, setCraftType] = useState('Traditional Tie & Dye Sungudi');
  const [giTag, setGiTag] = useState('GI-APPL-189-TN');
  const [targetPrice, setTargetPrice] = useState<number>(75);
  const [minimumPrice, setMinimumPrice] = useState<number>(55);
  const [wholesalePrice, setWholesalePrice] = useState<number>(62);
  const [stockQuantity, setStockQuantity] = useState<number>(30);
  const [moq, setMoq] = useState<number>(5);
  const [unit, setUnit] = useState('Piece');
  const [productionTime, setProductionTime] = useState('10-14 Days');
  const [material, setMaterial] = useState('100% Fine Combed Cotton & Natural Vegetable Dye');
  const [technique, setTechnique] = useState('Traditional Knotting & Indigo Dip Dyeing');
  const [origin, setOrigin] = useState('Madurai, Tamil Nadu');
  const [shortDescription, setShortDescription] = useState(
    'Authentic GI-tagged Madurai Sungudi cotton saree hand-knotted with micro-circle pattern motifs and zari border.'
  );
  const [heritageStory, setHeritageStory] = useState(
    'Brought to Madurai by Saurashtrian weavers in the 16th century under Nayak patronage, Sungudi craftsmanship utilizes organic riverbank washings and intricate tied knot resist-dyeing.'
  );
  const [artisanStory, setArtisanStory] = useState(
    'Crafted by master dyer R. Meenakshisundaram and 18 guild artisans dedicated to preserving pure organic indigo formulations.'
  );
  const [sustainabilityInfo, setSustainabilityInfo] = useState(
    '100% natural vegetable dyes, zero synthetic chemicals, solar-dried fabric, and plastic-free unbleached cotton wrapper.'
  );
  const [hsCode, setHsCode] = useState('5208.52.00');
  const [exportMarkets, setExportMarkets] = useState('USA, Singapore, UAE, Germany, Australia');
  const [bulkDiscount, setBulkDiscount] = useState('5% for 20+ units, 12% for 50+ units');
  const [sellerContact, setSellerContact] = useState('+91 94432 11001');
  const [imageUrl, setImageUrl] = useState('/products/madurai-sungudi-saree.svg');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.createProduct({
        product_name: productName,
        state,
        district,
        city,
        artisan_cluster: artisanCluster,
        artisan_name: artisanName,
        category,
        sub_category: subCategory,
        craft_type: craftType,
        gi_tag: giTag,
        target_price: Number(targetPrice),
        minimum_price: Number(minimumPrice),
        wholesale_price: Number(wholesalePrice),
        stock_quantity: Number(stockQuantity),
        minimum_order_quantity: Number(moq),
        unit,
        production_time: productionTime,
        material,
        technique,
        origin,
        short_description: shortDescription,
        detailed_description: `${shortDescription} ${heritageStory}`,
        heritage_story: heritageStory,
        artisan_story: artisanStory,
        sustainability_information: sustainabilityInfo,
        hs_code: hsCode,
        export_markets: exportMarkets,
        bulk_discount: bulkDiscount,
        seller_contact: sellerContact,
        image_url: imageUrl,
        global_demand_score: 88.0,
        buyer_interest_score: 90.0,
        rating: 4.9,
        review_count: 12,
        buyer_count: 6,
        estimated_delivery_days: 10,
        shipping_available: true,
        wholesale_available: true,
        export_eligibility: true,
        gi_registration_status: 'GI_VERIFIED',
        verified_status: 'VERIFIED'
      });
      setSuccessSlug(res.slug);
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (successSlug) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-white">Product Registered Successfully!</h2>
        <p className="text-xs text-slate-400">
          <strong>{productName}</strong> has been added to the database and is now live in the Regional Marketplace.
        </p>
        <div className="flex items-center justify-center space-x-3 pt-4">
          <Link
            to={`/products/${successSlug}`}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
          >
            <span>View Live Product Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/marketplace"
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Catalog Management</span>
          <span>•</span>
          <span>46-Field Relational Ingestion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Register New Regional GI Craft
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Add an authentic craft consignment with complete pricing bounds, cluster heritage stories, and export HS code compliance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
          1. Basic Product & Cluster Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="text-slate-300 font-semibold block mb-1.5">Official Product Name *</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Madurai Sungudi Saree — Traditional Indigo Knot"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Handloom & Silk Textiles">Handloom & Silk Textiles</option>
              <option value="Brassware & Metal Craft">Brassware & Metal Craft</option>
              <option value="Wood Carving & Marquetry">Wood Carving & Marquetry</option>
              <option value="Terracotta & Traditional Pottery">Terracotta & Pottery</option>
              <option value="Glassware & Heritage Crafts">Glassware & Heritage</option>
              <option value="Carpet & Floor Textiles">Carpet & Floor Textiles</option>
              <option value="Stone Art & Architectural Relief">Stone Art</option>
            </select>
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
            <label className="text-slate-300 font-semibold block mb-1.5">Cluster State *</label>
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
            <label className="text-slate-300 font-semibold block mb-1.5">Master Artisan Name *</label>
            <input
              type="text"
              required
              value={artisanName}
              onChange={(e) => setArtisanName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Artisan Guild / Cluster Name *</label>
            <input
              type="text"
              required
              value={artisanCluster}
              onChange={(e) => setArtisanCluster(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 pt-4">
          2. Pricing Boundaries & Stock Inventory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Target Retail Price ($ USD) *</label>
            <input
              type="number"
              required
              min={1}
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-rose-400 font-semibold block mb-1.5">Minimum Acceptable Price ($ USD) *</label>
            <input
              type="number"
              required
              min={1}
              value={minimumPrice}
              onChange={(e) => setMinimumPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-900 text-rose-300 focus:outline-none focus:border-rose-400 font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-emerald-400 font-semibold block mb-1.5">Wholesale Export Price ($ USD) *</label>
            <input
              type="number"
              required
              min={1}
              value={wholesalePrice}
              onChange={(e) => setWholesalePrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 focus:outline-none focus:border-cyan-400 font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Available Stock (Units) *</label>
            <input
              type="number"
              required
              min={1}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Minimum Order Qty (MOQ) *</label>
            <input
              type="number"
              required
              min={1}
              value={moq}
              onChange={(e) => setMoq(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">HS Tariff Code *</label>
            <input
              type="text"
              required
              value={hsCode}
              onChange={(e) => setHsCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 pt-4">
          3. Craft Story & Sustainability
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Short Commercial Description *</label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Historical Heritage & Technique Story *</label>
            <textarea
              required
              rows={3}
              value={heritageStory}
              onChange={(e) => setHeritageStory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Sustainability & Eco Information *</label>
            <textarea
              required
              rows={2}
              value={sustainabilityInfo}
              onChange={(e) => setSustainabilityInfo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Primary Image SVG/URL Path</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Ingesting into Database...' : 'Register Product in Marketplace'}</span>
        </button>
      </form>
    </div>
  );
};

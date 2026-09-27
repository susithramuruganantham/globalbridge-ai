# GlobalBridge.AI v3.0

> **Regional MSME Dialect & Trade Intelligence Platform**  
> *AI-Powered Digital Trade Operating System for Indian MSMEs, Regional Artisans, Exporters and International Wholesale Buyers.*

---

## 🌟 Executive Overview

**GlobalBridge.AI v3.0** is an enterprise-grade digital trade platform that bridges the gap between verified Indian Geographical Indications (GI) craft clusters, master artisans, and international wholesale procurement channels across North America, Europe, ASEAN (Singapore), and the Middle East (UAE).

The platform addresses core MSME export challenges:
1. **Multilingual Dialect & Linguistic Accessibility**: Direct dialect RAG query engine supporting English, Tamil (தமிழ்), Hindi (हिन्दी), and Telugu (తెలుగు).
2. **Margin Protection & Automated Trade Negotiation**: AI Trade Desk that evaluates inbound wholesale counter-offers against artisan cost floors and prevents negative margin trades.
3. **Automated WhatsApp Order & Logistics Gateway**: Seamless Meta WhatsApp Cloud API integration with an interactive local simulator drawer that dispatches instant order receipts, shipping updates, and low-stock alerts.
4. **Customs Harmonization & Provenance**: Automated HS Code tagging, GI certificate provenance seals, and trade documentation for international port clearance.

---

## 🏗️ Architectural Topology

```
globalbridge-ai/
│
├── frontend/                     # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProductCard, WhatsAppSimulatorDrawer
│   │   ├── pages/                # Dashboard, Marketplace, ProductDetail, Cart, Checkout,
│   │   │                         # Orders, Intelligence, Negotiator, CampaignSimulator,
│   │   │                         # RAGCopilot, Notifications, Settings, Registers
│   │   ├── layouts/              # RootLayout with floating Copilot & WhatsApp widgets
│   │   ├── contexts/             # AuthContext (Role switching), CartContext, LanguageContext
│   │   ├── services/             # API client & endpoint contracts
│   │   ├── types/                # Unified TypeScript interfaces & schemas
│   │   └── utils/                # Multilingual translations dictionary (EN, TA, HI, TE)
│   ├── public/
│   │   └── products/             # 117 custom SVG illustrations for regional crafts
│   └── package.json
│
├── backend/                      # FastAPI (Python 3.10+) + SQLAlchemy ORM + Pydantic
│   ├── app/
│   │   ├── database/             # Relational Session & SQLite/PostgreSQL Engine
│   │   ├── models/               # 16 Relational Tables (Users, Artisans, Products, Orders, etc.)
│   │   ├── schemas/              # Pydantic validation models
│   │   ├── routers/              # Products, Orders, Cart, WhatsApp, AI Chat, Intelligence, etc.
│   │   ├── services/             # Inventory, Intelligence, Auth, Notification services
│   │   ├── ai/                   # RAG Copilot, AI Negotiator, Campaign Simulator engines
│   │   ├── whatsapp/             # Meta Cloud API client & notification templates
│   │   └── main.py               # FastAPI application entrypoint
│   ├── seed/                     # 116 unique authentic craft items across TN, UP, AP
│   ├── globalbridge.db           # SQLite database with seeded authentic catalog
│   └── requirements.txt
│
└── README.md
```

---

## 📦 Database Catalog & GI Cluster Distribution

The database comes pre-seeded with **116 unique authentic craft products** across 3 major state clusters:

| State | Seeded Products | Key GI Registered Crafts & Clusters |
| :--- | :---: | :--- |
| **Tamil Nadu** | **54 Products** | Kanchipuram Silk, Madurai Sungudi, Arani Silk, Swamimalai Bronze Nataraja, Thanjavur Gold Leaf Paintings, Pattamadai Korai Mats, Dindigul Locks, Mahabalipuram Stone Art, Chettinad Kottan, Nachiarkoil Lamps, Toda Embroidery. |
| **Uttar Pradesh** | **32 Products** | Banarasi Katan Silk, Lucknow Chikankari, Moradabad Brass Urns, Saharanpur Wood Carving, Bhadohi Hand-knotted Carpets, Firozabad Glassware, Kannauj Rose Attar, Khurja Ceramic Pottery, Nizamabad Black Clay. |
| **Andhra Pradesh** | **30 Products** | Kondapalli Wooden Toys, Srikalahasti Kalamkari, Mangalagiri Cotton, Uppada Jamdani Silk, Etikoppaka Lacquer Toys, Bobbili Concert Veena, Machilipatnam Block Prints, Nimmalakunta Leather Puppets. |

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher (with npm)

---

### Step 1: Start the Backend Server

```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Seed or re-seed the database with 116+ products
python seed/seed_data.py

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

---

### Step 2: Start the Frontend Application

```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Install Node dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev
```
Web platform will be accessible at: `http://localhost:5173`

---

## 🔑 Demo Personas & Role Switching

GlobalBridge.AI includes a one-click role switcher in the top navigation bar to test all user workflows:

1. **MSME Cluster Owner (`owner@globalbridge.ai`)**:
   - Access executive trade analytics, inventory valuation, and monthly revenue trends.
   - Run the **Campaign Simulator** to model festival discounts without breaching margin floors.
   - Receive real-time owner notifications and WhatsApp alerts when orders are placed.
2. **Wholesale Buyer (`buyer@globalbridge.ai`)**:
   - Filter 116+ crafts by State, District, Category, Price, and GI Registration.
   - Test the **AI Price Negotiator** to submit bulk counter-offers.
   - Complete international wholesale checkout with unique Order ID (`GB-2026-XXXXX`).
3. **Master Artisan (`artisan@globalbridge.ai`)**:
   - View craft provenance, master weaver profiles, and batch restock alerts.
   - Register new artisan guilds via `/register-artisan`.
4. **Platform Administrator (`admin@globalbridge.ai`)**:
   - System governance, Meta WhatsApp Cloud API credentials, and database health metrics.

---

## 📱 WhatsApp Cloud API Integration & Demo Gateway

GlobalBridge.AI supports dual WhatsApp modes:

### 1. Interactive Demo Simulator Mode (Default)
- Zero external API credentials required.
- Whenever an order is placed (`POST /api/orders`), order status changes (`PUT /api/orders/:id/status`), or stock drops below 5 units, the system formats a message and logs it in the **WhatsApp Gateway Drawer**.
- Click the **"WhatsApp Gateway"** or floating phone icon at the bottom right to view live simulated deliveries.

### 2. Live Meta WhatsApp Cloud API Mode
To enable direct WhatsApp delivery to physical mobile phones:
1. Open the platform `/settings` page.
2. Toggle the gateway mode to **"Real Cloud API"**.
3. Provide your credentials from [Meta for Developers](https://developers.facebook.com/):
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`
   - `OWNER_WHATSAPP_NUMBER` (e.g. `+919876543210`)
4. Inbound webhook endpoint is exposed at: `https://your-domain.com/api/whatsapp/webhook` (verifies token `globalbridge_verify_token_2026`).

---

## 🧪 Comprehensive Feature Verification Flow

1. **Executive Dashboard (`/dashboard`)**:
   - Inspect live DB metrics: 116 Products, $98k+ Valuation, Recharts for State Valuation, Category Split & Revenue Trend.
2. **Marketplace & Multi-Attribute Search (`/marketplace`)**:
   - Search "silk", filter by "Tamil Nadu", check "GI Registered", toggle sorting to "AI Global Demand".
3. **Product Deep-Dive (`/products/kanchipuram-silk-saree`)**:
   - Inspect the interactive image gallery with full-screen lightbox zoom.
   - Read the 46-field heritage story, artisan profile, sustainability certifications, and HS tariff code (`5007.20.00`).
4. **AI Trade Negotiator (`/negotiator`)**:
   - Test an offer of `$120` (below minimum price) -> Verify automated **REJECTED** safeguarding artisan margin.
   - Test an offer of `$175` -> Verify **ACCEPTED** with calculated MSME margin and 1-click WhatsApp pitch draft.
5. **Cart & Wholesale Checkout (`/cart` -> `/checkout`)**:
   - Add products, set quantity, fill international export shipping form, click **"Place Order"**.
   - Verify unique Order ID generation (`GB-2026-XXXXX`), automatic inventory decrement in DB, and WhatsApp order alert dispatch.
6. **Orders Management (`/orders`)**:
   - Update order status from `PENDING` to `SHIPPED` -> Inspect the dispatched WhatsApp shipping notification.
7. **Multilingual Dialect Copilot (`/copilot`)**:
   - Switch language to **தமிழ் (Tamil)** or **हिन्दी (Hindi)**.
   - Query: `"Show me GI silk products from Tamil Nadu"` or `"Which products have stock below 5?"` and inspect retrieved DB items.
8. **Campaign Simulator (`/campaign-simulator`)**:
   - Test 15% festival discount and evaluate projected demand lift (+21.8%) and stock depletion units.

---

## 📄 License & Compliance

Developed for the Regional MSME & Craft Cluster Digital Trade Initiative. Compliant with the Geographical Indications of Goods (Registration and Protection) Act and international WCO HS tariff standards.

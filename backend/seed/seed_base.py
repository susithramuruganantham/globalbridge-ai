"""
GlobalBridge.AI v3.0 - Comprehensive Relational Seed Engine
Seeds 108+ unique authentic Indian MSME products across Tamil Nadu (42), Uttar Pradesh (33), Andhra Pradesh (33),
along with 20+ artisan profiles, categories, buyers, reviews, demand insights, and demo orders.
"""

import os
import sys
import datetime
import random

# Add parent directory to path so app modules can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.session import SessionLocal, engine, Base
from app.models.entities import (
    User, Artisan, Buyer, Category, Product, ProductImage, Inventory,
    Order, OrderItem, Notification, Negotiation, WhatsAppMessage,
    DemandInsight, Review
)
from app.services.auth_service import hash_password

CATEGORIES = [
    {"name": "Handloom & Silk Textiles", "slug": "handloom-silk-textiles", "icon": "Shirt", "desc": "GI-tagged sarees, brocades, dhotis, stoles & organic cottons", "state": "Tamil Nadu"},
    {"name": "Metal Crafts & Bronzeware", "slug": "metal-crafts-bronzeware", "icon": "Sparkles", "desc": "Swamimalai bronze, Moradabad brassware, Nachiarkoil lamps & temple vessels", "state": "Tamil Nadu"},
    {"name": "Wood Carving & Toys", "slug": "wood-carving-toys", "icon": "TreePine", "desc": "Kondapalli, Etikoppaka lacquerware, Saharanpur carving & Ambasamudram toys", "state": "Andhra Pradesh"},
    {"name": "Pottery & Terracotta", "slug": "pottery-terracotta", "icon": "Layers", "desc": "Manamadurai terracotta, Khurja ceramics, Nizamabad black clay pottery", "state": "Uttar Pradesh"},
    {"name": "Heritage Paintings & Art", "slug": "heritage-paintings-art", "icon": "Palette", "desc": "Thanjavur gold foil art, Srikalahasti Pen Kalamkari, Leather shadow art", "state": "Tamil Nadu"},
    {"name": "Leather & Folk Crafts", "slug": "leather-folk-crafts", "icon": "ShieldCheck", "desc": "Nimmalakunta shadow puppets, Kanpur leather, Sambhal horncraft", "state": "Andhra Pradesh"},
    {"name": "Traditional Jewellery", "slug": "traditional-jewellery", "icon": "Gem", "desc": "Nagercoil temple jewellery, Varanasi Gulabi Meenakari, Kondaiyankottai silver", "state": "Tamil Nadu"},
    {"name": "Fine Stone Sculptures", "slug": "fine-stone-sculptures", "icon": "Boxes", "desc": "Mahabalipuram granite monoliths, Agra marble inlay, Durgi soft stone", "state": "Tamil Nadu"},
    {"name": "Glassware & Lacquerware", "slug": "glassware-lacquerware", "icon": "Wine", "desc": "Firozabad blown glass chandeliers, Etikoppaka non-toxic natural lacquerware", "state": "Uttar Pradesh"}
]

ARTISANS_DATA = [
    # Tamil Nadu Artisans
    {
        "name": "K. Sundaramoorthy",
        "business_name": "Kanchi Silk Heritage Weavers Society",
        "state": "Tamil Nadu", "district": "Kanchipuram", "city": "Kanchipuram",
        "cluster_name": "Kanchipuram Silk Cluster", "craft_type": "Mulberry Silk & Gold Zari Weaving",
        "gi_registration_no": "GI-TN-001", "experience_years": 32, "artisan_count": 85,
        "story": "Fourth-generation master weaver preserving the Korvai interlocking technique and temple motif borders.",
        "contact_phone": "+91 94432 11001", "whatsapp_number": "+919443211001",
        "avatar_url": "/artisans/sundaramoorthy.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "M. Ramasamy Stapathi",
        "business_name": "Swamimalai Bronze Icon Guild",
        "state": "Tamil Nadu", "district": "Thanjavur", "city": "Swamimalai",
        "cluster_name": "Swamimalai Bronze Casting Cluster", "craft_type": "Lost-Wax Bronze Sculpture",
        "gi_registration_no": "GI-TN-007", "experience_years": 40, "artisan_count": 45,
        "story": "Descendant of the Chola royal sculptors crafting Panchaloha idols according to Shilpa Shastra proportions.",
        "contact_phone": "+91 94432 11002", "whatsapp_number": "+919443211002",
        "avatar_url": "/artisans/ramasamy.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "A. Meenakshi Sundaram",
        "business_name": "Madurai Sungudi Tie & Dye Crafts",
        "state": "Tamil Nadu", "district": "Madurai", "city": "Madurai",
        "cluster_name": "Madurai Sungudi Textile Cluster", "craft_type": "Sungudi Bandhani Tie-Dye",
        "gi_registration_no": "GI-TN-012", "experience_years": 26, "artisan_count": 60,
        "story": "Saurashtrian migrant guild preserving natural tie-and-dye techniques with plant-based indigo and madder dyes.",
        "contact_phone": "+91 94432 11003", "whatsapp_number": "+919443211003",
        "avatar_url": "/artisans/meenakshi.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "S. Pitchai Pillai",
        "business_name": "Thanjavur Royal Art Society",
        "state": "Tamil Nadu", "district": "Thanjavur", "city": "Thanjavur",
        "cluster_name": "Thanjavur Painting Cluster", "craft_type": "22k Gold Foil Relief Painting",
        "gi_registration_no": "GI-TN-024", "experience_years": 35, "artisan_count": 30,
        "story": "Master artist using teakwood frames, Arabic gum chalk gesso, and authentic Jaipur 22k gold foils.",
        "contact_phone": "+91 94432 11004", "whatsapp_number": "+919443211004",
        "avatar_url": "/artisans/pitchai.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "R. Loganathan",
        "business_name": "Pattamadai Korai Fine Weavers Society",
        "state": "Tamil Nadu", "district": "Tirunelveli", "city": "Pattamadai",
        "cluster_name": "Pattamadai Mat Weaving Cluster", "craft_type": "Silk Cotton Korai Grass Weaving",
        "gi_registration_no": "GI-TN-038", "experience_years": 28, "artisan_count": 50,
        "story": "Weaving the legendary super-fine 140-count Korai mats that can be folded like silk cloth.",
        "contact_phone": "+91 94432 11005", "whatsapp_number": "+919443211005",
        "avatar_url": "/artisans/loganathan.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "G. Shanmugam",
        "business_name": "Nachiarkoil Brass Artisans Guild",
        "state": "Tamil Nadu", "district": "Thanjavur", "city": "Nachiarkoil",
        "cluster_name": "Nachiarkoil Brassware Cluster", "craft_type": "Sand-Cast Brass Crafting",
        "gi_registration_no": "GI-TN-045", "experience_years": 30, "artisan_count": 40,
        "story": "Specializing in the traditional Annam Kuthuvilakku lamps with hand-turned motifs.",
        "contact_phone": "+91 94432 11006", "whatsapp_number": "+919443211006",
        "avatar_url": "/artisans/shanmugam.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "V. Senthil Nathan",
        "business_name": "Mahabalipuram Stone Sculptors Association",
        "state": "Tamil Nadu", "district": "Chengalpattu", "city": "Mahabalipuram",
        "cluster_name": "Mahabalipuram Sculpture Cluster", "craft_type": "Granite Monolithic Carving",
        "gi_registration_no": "GI-TN-052", "experience_years": 38, "artisan_count": 70,
        "story": "Carrying forward the 7th-century Pallava architectural chisel traditions.",
        "contact_phone": "+91 94432 11007", "whatsapp_number": "+919443211007",
        "avatar_url": "/artisans/senthil.jpg", "verified_status": "GI_VERIFIED"
    },

    # Uttar Pradesh Artisans
    {
        "name": "Mohammad Irfan Ansari",
        "business_name": "Varanasi Silk Zari Heritage Consortium",
        "state": "Uttar Pradesh", "district": "Varanasi", "city": "Varanasi",
        "cluster_name": "Banaras Handloom Cluster", "craft_type": "Katan Silk & Real Gold Zari Jacquard",
        "gi_registration_no": "GI-UP-002", "experience_years": 34, "artisan_count": 110,
        "story": "Custodians of Mughal-era Kadwa weaving and pure silver dipped gold zari brocades.",
        "contact_phone": "+91 98390 22001", "whatsapp_number": "+919839022001",
        "avatar_url": "/artisans/irfan.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "Begum Naseem Akhtar",
        "business_name": "Awadh Chikankari Women Craft Guild",
        "state": "Uttar Pradesh", "district": "Lucknow", "city": "Lucknow",
        "cluster_name": "Lucknow Chikankari Cluster", "craft_type": "32-Stitch Fine Shadow Embroidery",
        "gi_registration_no": "GI-UP-009", "experience_years": 29, "artisan_count": 150,
        "story": "Empowering rural craftswomen with master stitches: Bakhiya, Phanda, Keel Kangan, and Tepchi.",
        "contact_phone": "+91 98390 22002", "whatsapp_number": "+919839022002",
        "avatar_url": "/artisans/naseem.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "Ramesh Chandra Sharma",
        "business_name": "Moradabad Brass Masters Collective",
        "state": "Uttar Pradesh", "district": "Moradabad", "city": "Moradabad",
        "cluster_name": "Moradabad Metalcraft Cluster", "craft_type": "Engraved & Embossed Brassware",
        "gi_registration_no": "GI-UP-015", "experience_years": 36, "artisan_count": 80,
        "story": "Creating museum-grade hand-etched brass vessels with electro-tinning and antique patina finishes.",
        "contact_phone": "+91 98390 22003", "whatsapp_number": "+919839022003",
        "avatar_url": "/artisans/ramesh.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "Haji Abdul Rehman",
        "business_name": "Saharanpur Woodcraft Guild",
        "state": "Uttar Pradesh", "district": "Saharanpur", "city": "Saharanpur",
        "cluster_name": "Saharanpur Woodcraft Cluster", "craft_type": "Sheesham & Teak Wood Carving with Brass Inlay",
        "gi_registration_no": "GI-UP-021", "experience_years": 42, "artisan_count": 95,
        "story": "Master of fretwork (Jali) carving and floral Tarkashi brass wire inlay in seasoned hardwoods.",
        "contact_phone": "+91 98390 22004", "whatsapp_number": "+919839022004",
        "avatar_url": "/artisans/rehman.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "Kailash Nath Maurya",
        "business_name": "Bhadohi Carpet Weavers Federation",
        "state": "Uttar Pradesh", "district": "Bhadohi", "city": "Bhadohi",
        "cluster_name": "Bhadohi-Mirzapur Carpet Belt", "craft_type": "Hand-Knotted Pure Wool & Silk Carpets",
        "gi_registration_no": "GI-UP-028", "experience_years": 31, "artisan_count": 120,
        "story": "Weaving high knot-density oriental rugs using New Zealand wool and natural vegetable dyes.",
        "contact_phone": "+91 98390 22005", "whatsapp_number": "+919839022005",
        "avatar_url": "/artisans/kailash.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "Surendra Pal Singh",
        "business_name": "Firozabad Glass Blowers Syndicate",
        "state": "Uttar Pradesh", "district": "Firozabad", "city": "Firozabad",
        "cluster_name": "Firozabad Glassware Cluster", "craft_type": "Mouth-Blown Art Glass & Chandeliers",
        "gi_registration_no": "GI-UP-035", "experience_years": 25, "artisan_count": 65,
        "story": "Handcrafted decorative blown glass with vibrant lustre and 24k gold leaf detailing.",
        "contact_phone": "+91 98390 22006", "whatsapp_number": "+919839022006",
        "avatar_url": "/artisans/surendra.jpg", "verified_status": "GI_VERIFIED"
    },

    # Andhra Pradesh Artisans
    {
        "name": "P. Venkata Subbaiah",
        "business_name": "Kondapalli Toys Heritage Cooperative",
        "state": "Andhra Pradesh", "district": "Krishna", "city": "Kondapalli",
        "cluster_name": "Kondapalli Toy Cluster", "craft_type": "Tella Poniki Softwood Hand-Carving",
        "gi_registration_no": "GI-AP-003", "experience_years": 33, "artisan_count": 55,
        "story": "Crafting mythological figurines from indigenous Tella Poniki wood, painted with natural tamarind gum colors.",
        "contact_phone": "+91 94901 33001", "whatsapp_number": "+919490133001",
        "avatar_url": "/artisans/venkata.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "J. Niranjan Reddy",
        "business_name": "Srikalahasti Kalamkari Artisans Society",
        "state": "Andhra Pradesh", "district": "Tirupati", "city": "Srikalahasti",
        "cluster_name": "Srikalahasti Kalamkari Cluster", "craft_type": "Bamboo Pen Freehand Natural Dyeing",
        "gi_registration_no": "GI-AP-010", "experience_years": 37, "artisan_count": 75,
        "story": "Preserving 17-step natural dyeing using myrobalan, cow milk, alum, and hand-drawn bamboo stylus.",
        "contact_phone": "+91 94901 33002", "whatsapp_number": "+919490133002",
        "avatar_url": "/artisans/niranjan.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "Ch. Sitarama Murthy",
        "business_name": "Etikoppaka Lacquer Craft Guild",
        "state": "Andhra Pradesh", "district": "Anakapalli", "city": "Etikoppaka",
        "cluster_name": "Etikoppaka Toy Cluster", "craft_type": "Lathe-Turned Natural Lacquer Toys",
        "gi_registration_no": "GI-AP-016", "experience_years": 29, "artisan_count": 40,
        "story": "Organic non-toxic lacquer extracted from Butea monosperma trees, dyed with turmeric and indigo.",
        "contact_phone": "+91 94901 33003", "whatsapp_number": "+919490133003",
        "avatar_url": "/artisans/sitarama.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "B. Appala Raju",
        "business_name": "Uppada Jamdani Weavers Society",
        "state": "Andhra Pradesh", "district": "Kakinada", "city": "Uppada",
        "cluster_name": "Uppada Silk Handloom Cluster", "craft_type": "Jamdani Non-Structural Weft Weaving",
        "gi_registration_no": "GI-AP-022", "experience_years": 35, "artisan_count": 90,
        "story": "Master of lightweight sheer pure silk Jamdani sarees where each floral butta is placed by hand.",
        "contact_phone": "+91 94901 33004", "whatsapp_number": "+919490133004",
        "avatar_url": "/artisans/appala.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "K. Malleswara Rao",
        "business_name": "Bobbili Musical Instruments Guild",
        "state": "Andhra Pradesh", "district": "Vizianagaram", "city": "Bobbili",
        "cluster_name": "Bobbili Veena Cluster", "craft_type": "Ekanda Single Jackwood Veena Crafting",
        "gi_registration_no": "GI-AP-031", "experience_years": 45, "artisan_count": 25,
        "story": "Carving resonant classical Saraswati veenas from a single block of mature jackfruit wood.",
        "contact_phone": "+91 94901 33005", "whatsapp_number": "+919490133005",
        "avatar_url": "/artisans/malleswara.jpg", "verified_status": "GI_VERIFIED"
    },
    {
        "name": "T. Ramaiah",
        "business_name": "Nimmalakunta Leather Puppet Guild",
        "state": "Andhra Pradesh", "district": "Sri Sathya Sai", "city": "Nimmalakunta",
        "cluster_name": "Tholu Bommalata Cluster", "craft_type": "Translucent Goat Leather Puppet Art",
        "gi_registration_no": "GI-AP-039", "experience_years": 38, "artisan_count": 35,
        "story": "Master of Shadow Puppetry (Tholu Bommalata) crafting luminous parchment leather art.",
        "contact_phone": "+91 94901 33006", "whatsapp_number": "+919490133006",
        "avatar_url": "/artisans/ramaiah.jpg", "verified_status": "GI_VERIFIED"
    }
]

BUYERS_DATA = [
    {
        "company_name": "Singapore Wholesale Imports Pte Ltd",
        "contact_name": "Jonathan Tan",
        "country": "Singapore", "city": "Singapore",
        "email": "purchasing@singaporewholesale.sg", "phone": "+65 6789 0123",
        "import_license": "SG-IMP-88210", "annual_volume_usd": 450000.0,
        "preferred_categories": "Handloom & Silk Textiles, Heritage Paintings & Art", "verified": True
    },
    {
        "company_name": "Global Craft Traders USA LLC",
        "contact_name": "Marcus Vance",
        "country": "USA", "city": "New York",
        "email": "marcus@globalcrafttraders.com", "phone": "+1 212 555 0199",
        "import_license": "US-CBP-99210", "annual_volume_usd": 750000.0,
        "preferred_categories": "Wood Carving & Toys, Metal Crafts & Bronzeware", "verified": True
    },
    {
        "company_name": "Berlin Heritage Retail GmbH",
        "contact_name": "Elena Weber",
        "country": "Germany", "city": "Berlin",
        "email": "e.weber@berlinheritage.de", "phone": "+49 30 123456",
        "import_license": "DE-EORI-55410", "annual_volume_usd": 380000.0,
        "preferred_categories": "Handloom & Silk Textiles, Pottery & Terracotta", "verified": True
    },
    {
        "company_name": "Sydney Artisan Market Pty",
        "contact_name": "Liam Hemsworth",
        "country": "Australia", "city": "Sydney",
        "email": "liam@sydneyartisan.com.au", "phone": "+61 2 9876 5432",
        "import_license": "AU-TRD-44120", "annual_volume_usd": 320000.0,
        "preferred_categories": "Wood Carving & Toys, Leather & Folk Crafts", "verified": True
    },
    {
        "company_name": "Dubai Cultural Goods LLC",
        "contact_name": "Tariq Al-Mansoor",
        "country": "UAE", "city": "Dubai",
        "email": "tariq@dubaicultural.ae", "phone": "+971 4 332 1100",
        "import_license": "AE-DXB-77190", "annual_volume_usd": 600000.0,
        "preferred_categories": "Traditional Jewellery, Metal Crafts & Bronzeware", "verified": True
    },
    {
        "company_name": "London Ethnic Lifestyle Ltd",
        "contact_name": "Charlotte Hughes",
        "country": "UK", "city": "London",
        "email": "charlotte@londonethnic.co.uk", "phone": "+44 20 7946 0912",
        "import_license": "GB-EORI-88321", "annual_volume_usd": 410000.0,
        "preferred_categories": "Handloom & Silk Textiles, Heritage Paintings & Art", "verified": True
    }
]

# We will load the full dataset of 108 products from seed_catalog

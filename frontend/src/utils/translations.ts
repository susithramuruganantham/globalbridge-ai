import { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  EN: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_marketplace: "Marketplace",
    nav_orders: "Orders",
    nav_intelligence: "Intelligence",
    nav_negotiator: "AI Negotiator",
    nav_campaign: "Campaign Simulator",
    nav_copilot: "RAG Copilot",
    nav_settings: "Settings",
    nav_favorites: "Favorites",
    nav_add_product: "Add Product",
    nav_register_artisan: "Register Artisan",
    
    // Header & Role
    role_admin: "Admin Console",
    role_owner: "MSME Owner",
    role_artisan: "Artisan Guild",
    role_buyer: "Wholesale Buyer",
    switch_role: "Switch Active Role",
    
    // Common Actions
    view_details: "View Details",
    quick_order: "Quick Order",
    add_to_cart: "Add to Cart",
    buy_now: "Buy Now",
    checkout: "Checkout",
    place_order: "Place Order",
    negotiate_price: "AI Negotiate",
    share_whatsapp: "Share on WhatsApp",
    contact_seller: "Contact Seller",
    search_placeholder: "Search crafts, GI tags, districts, artisan clusters...",
    
    // Statuses
    gi_verified: "GI VERIFIED",
    in_stock: "IN STOCK",
    low_stock: "LOW STOCK",
    critical_stock: "CRITICAL STOCK",
    export_ready: "EXPORT READY",
    
    // Marketplace
    marketplace_title: "Regional MSME Marketplace",
    marketplace_desc: "Discover verified Indian crafts, GI-registered clusters and export-ready wholesale products.",
    showing_products: "Showing",
    of_products: "of",
    products_label: "products",
    
    // WhatsApp Simulator
    whatsapp_gateway: "WhatsApp Cloud Gateway",
    demo_mode_active: "DEMO MODE ACTIVE",
    simulated_success: "WhatsApp notification simulated successfully.",
    send_test_alert: "Send Test Alert",
    
    // Dashboard Stats
    stat_products: "Total Products",
    stat_stock: "Total Available Stock",
    stat_valuation: "Inventory Valuation",
    stat_orders: "Total Wholesale Orders",
    stat_pending: "Pending Shipments",
    stat_active_buyers: "Active Global Buyers",
    stat_demand_score: "Average Global Demand",
    stat_low_stock: "Low Stock Alerts",
    stat_export_opps: "Export Ready Crafts",

    // Product Details
    heritage_story_title: "Heritage & Craft Provenance",
    artisan_profile_title: "Master Artisan Profile",
    sustainability_title: "Sustainability & Quality Standards",
    trade_info_title: "Export Trade Specifications",
    ai_insights_title: "AI Trade & Global Demand Forecast",
    min_order_qty: "Minimum Order Quantity",
    target_export_price: "Target Export Price",
    wholesale_volume_price: "Wholesale Volume Rate",
    min_acceptable_floor: "Minimum Floor Price",
    production_lead_time: "Production Lead Time",
    hs_tariff_code: "Harmonized HS Code",
    export_corridors: "Key Export Corridors"
  },
  
  TA: {
    // Navigation
    nav_dashboard: "டாஷ்போர்டு",
    nav_marketplace: "சந்தை (Marketplace)",
    nav_orders: "ஆர்டர்கள்",
    nav_intelligence: "வர்த்தக நுண்ணறிவு",
    nav_negotiator: "AI பேரம் பேசுபவர்",
    nav_campaign: "பிரச்சார சிமுலேட்டர்",
    nav_copilot: "RAG கோபைலட்",
    nav_settings: "அமைப்புகள்",
    nav_favorites: "விருப்பங்கள்",
    nav_add_product: "தயாரிப்பைச் சேர்",
    nav_register_artisan: "கைவினைஞர் பதிவு",

    // Header & Role
    role_admin: "நிர்வாகி (Admin)",
    role_owner: "MSME உரிமையாளர்",
    role_artisan: "கைவினைஞர் கில்ட்",
    role_buyer: "மொத்த வாங்குபவர்",
    switch_role: "பயனர் பங்கை மாற்றவும்",

    // Common Actions
    view_details: "விவரங்களைப் பார்க்கவும்",
    quick_order: "விரைவு ஆர்டர்",
    add_to_cart: "கூடையில் சேர்",
    buy_now: "இப்போதே வாங்கு",
    checkout: "செக்அவுட்",
    place_order: "ஆர்டர் இடுங்கள்",
    negotiate_price: "AI விலை பேரம்",
    share_whatsapp: "வாட்ஸ்அப்பில் பகிரவும்",
    contact_seller: "விற்பனையாளரைத் தொடர்பு கொள்ளவும்",
    search_placeholder: "கைவினைப் பொருட்கள், புவிசார் குறியீடுகள், மாவட்டங்களைத் தேடுங்கள்...",

    // Statuses
    gi_verified: "புவிசார் குறியீடு சரிபார்க்கப்பட்டது",
    in_stock: "கையிருப்பில் உள்ளது",
    low_stock: "குறைந்த இருப்பு",
    critical_stock: "மிகக் குறைந்த இருப்பு",
    export_ready: "ஏற்றுமதிக்கு தயார்",

    // Marketplace
    marketplace_title: "மண்டல MSME சந்தை",
    marketplace_desc: "அங்கீகரிக்கப்பட்ட இந்திய கைவினைப்பொருட்கள் மற்றும் ஏற்றுமதிக்குத் தயாரான தயாரிப்புகளைக் கண்டறியவும்.",
    showing_products: "காண்பிக்கப்படுகிறது",
    of_products: "/",
    products_label: "தயாரிப்புகள்",

    // WhatsApp Simulator
    whatsapp_gateway: "வாட்ஸ்அப் கிளவுட் கேட்வே",
    demo_mode_active: "டெமோ பயன்முறை செயலில் உள்ளது",
    simulated_success: "வாட்ஸ்அப் அறிவிப்பு வெற்றிகரமாக உருவகப்படுத்தப்பட்டது.",
    send_test_alert: "சோதனை அறிவிப்பை அனுப்பவும்",

    // Dashboard Stats
    stat_products: "மொத்த தயாரிப்புகள்",
    stat_stock: "கையிருப்பு அளவு",
    stat_valuation: "சரக்கு மதிப்பு",
    stat_orders: "மொத்த ஆர்டர்கள்",
    stat_pending: "நிலுவையில் உள்ளவை",
    stat_active_buyers: "செயலில் உள்ள வாங்குபவர்கள்",
    stat_demand_score: "சராசரி உலகளாவிய தேவை",
    stat_low_stock: "குறைந்த இருப்பு எச்சரிக்கைகள்",
    stat_export_opps: "ஏற்றுமதி வாய்ப்புகள்",

    // Product Details
    heritage_story_title: "பாரம்பரியம் மற்றும் கைவினை வரலாறு",
    artisan_profile_title: "தலைமை கைவினைஞர் விவரக்குறிப்பு",
    sustainability_title: "நிலைத்தன்மை மற்றும் தரக் கட்டுப்பாடுகள்",
    trade_info_title: "ஏற்றுமதி வர்த்தக விவரக்குறிப்புகள்",
    ai_insights_title: "AI வர்த்தகம் மற்றும் தேவை முன்னறிவிப்பு",
    min_order_qty: "குறைந்தபட்ச ஆர்டர் அளவு",
    target_export_price: "இலக்கு ஏற்றுமதி விலை",
    wholesale_volume_price: "மொத்த விற்பனை விலை",
    min_acceptable_floor: "குறைந்தபட்ச ஏற்றுக்கொள்ளக்கூடிய விலை",
    production_lead_time: "தயாரிப்பு கால அவகாசம்",
    hs_tariff_code: "HS குறியீடு",
    export_corridors: "முக்கிய ஏற்றுமதி சந்தைகள்"
  },

  HI: {
    // Navigation
    nav_dashboard: "डैशबोर्ड",
    nav_marketplace: "बाज़ार (Marketplace)",
    nav_orders: "ऑर्डर सूची",
    nav_intelligence: "व्यापार इंटेलिजेंस",
    nav_negotiator: "AI मोलभाव (Negotiator)",
    nav_campaign: "अभियान सिम्युलेटर",
    nav_copilot: "RAG कोपायलट",
    nav_settings: "सेटिंग्स",
    nav_favorites: "पसंदीदा उत्पाद",
    nav_add_product: "उत्पाद जोड़ें",
    nav_register_artisan: "कारीगर पंजीकरण",

    // Header & Role
    role_admin: "एडमिन कंसोल",
    role_owner: "MSME स्वामी",
    role_artisan: "शिल्पकार संघ",
    role_buyer: "थोक खरीदार",
    switch_role: "भूमिका बदलें",

    // Common Actions
    view_details: "विवरण देखें",
    quick_order: "त्वरित ऑर्डर",
    add_to_cart: "कार्ट में जोड़ें",
    buy_now: "अभी खरीदें",
    checkout: "चेकआउट",
    place_order: "ऑर्डर सबमिट करें",
    negotiate_price: "AI मूल्य मोलभाव",
    share_whatsapp: "व्हाट्सएप पर साझा करें",
    contact_seller: "विक्रेता से संपर्क करें",
    search_placeholder: "शिल्प, जीआई टैग, जिले या कारीगर क्लस्टर खोजें...",

    // Statuses
    gi_verified: "जीआई सत्यापित (GI Tag)",
    in_stock: "स्टॉक में उपलब्ध",
    low_stock: "कम स्टॉक",
    critical_stock: "गंभीर स्टॉक कमी",
    export_ready: "निर्यात योग्य",

    // Marketplace
    marketplace_title: "क्षेत्रीय MSME मार्केटप्लेस",
    marketplace_desc: "सत्यापित भारतीय हस्तशिल्प, जीआई क्लस्टर और निर्यात-योग्य थोक उत्पादों की खोज करें।",
    showing_products: "प्रदर्शित",
    of_products: "कुल",
    products_label: "उत्पाद",

    // WhatsApp Simulator
    whatsapp_gateway: "व्हाट्सएप क्लाउड गेटवे",
    demo_mode_active: "डेमो मोड सक्रिय",
    simulated_success: "व्हाट्सएप सूचना सफलतापूर्वक सिम्युलेट की गई।",
    send_test_alert: "टेस्ट अलर्ट भेजें",

    // Dashboard Stats
    stat_products: "कुल उत्पाद",
    stat_stock: "उपलब्ध स्टॉक",
    stat_valuation: "इन्वेंट्री मूल्यांकन",
    stat_orders: "कुल थोक ऑर्डर",
    stat_pending: "लंबित शिपमेंट",
    stat_active_buyers: "सक्रिय वैश्विक खरीदार",
    stat_demand_score: "औसत वैश्विक मांग",
    stat_low_stock: "कम स्टॉक अलर्ट",
    stat_export_opps: "निर्यात के अवसर",

    // Product Details
    heritage_story_title: "विरासत और शिल्प इतिहास",
    artisan_profile_title: "मुख्य कारीगर प्रोफाइल",
    sustainability_title: "पर्यावरण अनुकूलता और गुणवत्ता मानक",
    trade_info_title: "निर्यात व्यापार विनिर्देश",
    ai_insights_title: "AI व्यापार और मांग पूर्वानुमान",
    min_order_qty: "न्यूनतम ऑर्डर मात्रा (MOQ)",
    target_export_price: "लक्ष्य निर्यात मूल्य",
    wholesale_volume_price: "थोक रियायती मूल्य",
    min_acceptable_floor: "न्यूनतम स्वीकार्य सीमा मूल्य",
    production_lead_time: "उत्पादन समय सीमा",
    hs_tariff_code: "एचएस टैरिफ कोड",
    export_corridors: "शीर्ष निर्यात बाजार"
  },

  TE: {
    // Navigation
    nav_dashboard: "డ్యాష్‌బోర్డ్",
    nav_marketplace: "మార్కెట్‌ప్లేస్",
    nav_orders: "ఆర్డర్లు",
    nav_intelligence: "వాణిజ్య ఇంటెలిజెన్స్",
    nav_negotiator: "AI బేరసారాలు (Negotiator)",
    nav_campaign: "ప్రచార సిమ్యులేటర్",
    nav_copilot: "RAG కోపైలట్",
    nav_settings: "సెట్టింగ్‌లు",
    nav_favorites: "ఇష్టమైనవి",
    nav_add_product: "ఉత్పత్తిని జోడించండి",
    nav_register_artisan: "చేతివృత్తిదారుల నమోదు",

    // Header & Role
    role_admin: "అడ్మిన్ కన్సోల్",
    role_owner: "MSME యజమాని",
    role_artisan: "కళాకారుల సంఘం",
    role_buyer: "టోకు కొనుగోలుదారు",
    switch_role: "పాత్రను మార్చండి",

    // Common Actions
    view_details: "వివరాలు చూడండి",
    quick_order: "త్వరిత ఆర్డర్",
    add_to_cart: "కార్ట్‌కు జోడించండి",
    buy_now: "ఇప్పుడే కొనండి",
    checkout: "చెక్‌అవుట్",
    place_order: "ఆర్డర్ చేయండి",
    negotiate_price: "AI ధర బేరం",
    share_whatsapp: "వాట్సాప్‌లో షేర్ చేయండి",
    contact_seller: "విక్రేతను సంప్రదించండి",
    search_placeholder: "చేతిపనులు, GI ట్యాగ్‌లు, జిల్లాలను శోధించండి...",

    // Statuses
    gi_verified: "GI ధృవీకరించబడింది",
    in_stock: "స్టాక్‌లో ఉంది",
    low_stock: "తక్కువ నిల్వ",
    critical_stock: "క్లిష్టమైన నిల్వ",
    export_ready: "ఎగుమతికి సిద్ధం",

    // Marketplace
    marketplace_title: "ప్రాంతీయ MSME మార్కెట్‌ప్లేస్",
    marketplace_desc: "ధృవీకరించబడిన భారతీయ కళాకృతులు మరియు ఎగుమతికి సిద్ధంగా ఉన్న ఉత్పత్తులను కనుగొనండి.",
    showing_products: "చూపిస్తోంది",
    of_products: "మొత్తం",
    products_label: "ఉత్పత్తులు",

    // WhatsApp Simulator
    whatsapp_gateway: "వాట్సాప్ క్లౌడ్ గేట్‌వే",
    demo_mode_active: "డెమో మోడ్ యాక్టివ్",
    simulated_success: "వాట్సాప్ నోటిఫికేషన్ విజయవంతంగా సిమ్యులేట్ చేయబడింది.",
    send_test_alert: "పరీక్ష హెచ్చరికను పంపండి",

    // Dashboard Stats
    stat_products: "మొత్తం ఉత్పత్తులు",
    stat_stock: "అందుబాటులో ఉన్న స్టాక్",
    stat_valuation: "ఇన్వెంటరీ విలువ",
    stat_orders: "మొత్తం ఆర్డర్లు",
    stat_pending: "పెండింగ్‌లో ఉన్నవి",
    stat_active_buyers: "క్రియాశీల ప్రపంచ కొనుగోలుదారులు",
    stat_demand_score: "సగటు గ్లోబల్ డిమాండ్",
    stat_low_stock: "తక్కువ నిల్వ హెచ్చరికలు",
    stat_export_opps: "ఎగుమతి అవకాశాలు",

    // Product Details
    heritage_story_title: "వారసత్వం మరియు చేతిపనుల మూలాలు",
    artisan_profile_title: "ప్రధాన కళాకారుని ప్రొఫైల్",
    sustainability_title: "పర్యావరణ ప్రమాణాలు & నాణ్యత",
    trade_info_title: "ఎగుమతి వాణిజ్య లక్షణాలు",
    ai_insights_title: "AI వాణిజ్యం & డిమాండ్ అంచనా",
    min_order_qty: "కనిష్ట ఆర్డర్ పరిమాణం (MOQ)",
    target_export_price: "లక్ష్య ఎగుమతి ధర",
    wholesale_volume_price: "టోకు ధర",
    min_acceptable_floor: "కనిష్ట ఆమోదయోగ్యమైన ధర",
    production_lead_time: "ఉత్పత్తి సమయం",
    hs_tariff_code: "HS కోడ్",
    export_corridors: "ప్రధాన ఎగుమతి మార్కెట్లు"
  }
};

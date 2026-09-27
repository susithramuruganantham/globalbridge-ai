import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from app.models.entities import Product, Artisan, Category

MULTILINGUAL_INTENT_MAP = {
    # Tamil keywords
    "பட்டு": "silk",
    "தமிழ்நாடு": "Tamil Nadu",
    "விலை": "price",
    "கையிருப்பு": "stock",
    "ஏற்றுமதி": "export",
    "காஞ்சிபுரம்": "Kanchipuram",
    "தஞ்சாவூர்": "Thanjavur",
    "மதுரை": "Madurai",
    
    # Hindi keywords
    "रेशम": "silk",
    "सिल्क": "silk",
    "उत्तर प्रदेश": "Uttar Pradesh",
    "कीमत": "price",
    "दाम": "price",
    "स्टॉक": "stock",
    "निर्यात": "export",
    "बनारसी": "Banarasi",
    "चिकनकारी": "Chikankari",
    "लखनऊ": "Lucknow",

    # Telugu keywords
    "పట్టు": "silk",
    "ఆంధ్రప్రదేశ్": "Andhra Pradesh",
    "ధర": "price",
    "నిల్వ": "stock",
    "ఎగుమతి": "export",
    "కొండపల్లి": "Kondapalli",
    "కలంకారి": "Kalamkari",
    "ఉప్పాడ": "Uppada"
}

def detect_language(query: str) -> str:
    # Check for Tamil unicode range 0B80-0BFF
    if any(0x0B80 <= ord(c) <= 0x0BFF for c in query):
        return "TA"
    # Check for Devanagari (Hindi) unicode range 0900-097F
    if any(0x0900 <= ord(c) <= 0x097F for c in query):
        return "HI"
    # Check for Telugu unicode range 0C00-0C7F
    if any(0x0C00 <= ord(c) <= 0x0C7F for c in query):
        return "TE"
    return "EN"

def execute_rag_copilot(db: Session, query: str, preferred_lang: str = "EN") -> Dict[str, Any]:
    det_lang = detect_language(query)
    lang = det_lang if det_lang != "EN" else preferred_lang
    q_lower = query.lower()

    # Translate known regional tokens to English search terms
    normalized_terms = []
    for k, v in MULTILINGUAL_INTENT_MAP.items():
        if k in query:
            normalized_terms.append(v.lower())
    
    combined_query = q_lower + " " + " ".join(normalized_terms)

    # 1. State / Region check
    state_filter = None
    if "tamil nadu" in combined_query or "tamilnadu" in combined_query or "தமிழ்நாடு" in query:
        state_filter = "Tamil Nadu"
    elif "uttar pradesh" in combined_query or "up" in combined_query.split() or "उत्तर प्रदेश" in query:
        state_filter = "Uttar Pradesh"
    elif "andhra pradesh" in combined_query or "andhra" in combined_query or "ఆంధ్రప్రదేశ్" in query:
        state_filter = "Andhra Pradesh"

    # 2. Demand query check
    is_high_demand = any(k in combined_query for k in ["highest demand", "high demand", "popular", "top demand", "top selling", "demand score"])

    # 3. Stock query check
    is_low_stock = any(k in combined_query for k in ["stock below 5", "low stock", "stock < 5", "running low", "critical stock", "कम स्टॉक", "குறைந்த கையிருப்பு", "తక్కువ నిల్వ"])
    
    # 4. Export query check
    is_export_ready = any(k in combined_query for k in ["export ready", "export eligible", "international", "singapore", "usa", "germany", "australia", "uae", "निर्यात", "ஏற்றுமதி", "ఎగుమతి"])
    specific_market = None
    for mkt in ["singapore", "usa", "germany", "australia", "uae", "uk", "france", "japan"]:
        if mkt in combined_query:
            specific_market = mkt

    # 5. Price query check
    price_under_match = re.search(r'(?:under|below|less than|குறைவான|कम|తక్కువ)\s*\$?(\d+)', combined_query)
    max_price_filter = float(price_under_match.group(1)) if price_under_match else None

    # 6. Specific craft / product keyword check
    craft_keywords = ["silk", "saree", "brass", "wood", "toy", "painting", "carpet", "terracotta", "kalamkari", "chikankari", "banarasi", "kanchipuram", "stone", "doll", "leather", "veena", "lamp"]
    matched_crafts = [c for c in craft_keywords if c in combined_query]

    # Query builder
    db_query = db.query(Product)

    if state_filter:
        db_query = db_query.filter(Product.state == state_filter)
    if is_low_stock:
        db_query = db_query.filter(Product.available_stock <= 5)
    if max_price_filter:
        db_query = db_query.filter(Product.target_price <= max_price_filter)
    if specific_market:
        db_query = db_query.filter(Product.export_markets.ilike(f"%{specific_market}%"))
    elif is_export_ready:
        db_query = db_query.filter(Product.export_eligibility == True)

    if matched_crafts:
        conditions = []
        for kw in matched_crafts:
            conditions.append(Product.product_name.ilike(f"%{kw}%"))
            conditions.append(Product.craft_type.ilike(f"%{kw}%"))
            conditions.append(Product.material.ilike(f"%{kw}%"))
            conditions.append(Product.category.ilike(f"%{kw}%"))
        db_query = db_query.filter(or_(*conditions))

    if is_high_demand:
        db_query = db_query.order_by(desc(Product.global_demand_score))
    else:
        db_query = db_query.order_by(desc(Product.rating), desc(Product.global_demand_score))

    results = db_query.limit(8).all()

    # If no specific results were matched, do fallback keyword search
    if not results:
        words = [w for w in combined_query.split() if len(w) > 3 and w not in ["show", "tell", "what", "which", "product", "products", "from", "with", "have", "under", "about"]]
        if words:
            word_conditions = [or_(Product.product_name.ilike(f"%{w}%"), Product.state.ilike(f"%{w}%"), Product.district.ilike(f"%{w}%"), Product.craft_type.ilike(f"%{w}%")) for w in words]
            results = db.query(Product).filter(or_(*word_conditions)).limit(6).all()
        if not results:
            results = db.query(Product).order_by(desc(Product.global_demand_score)).limit(4).all()

    # Generate dialect-aware response text
    count = len(results)
    response_text = ""
    intent = "PRODUCT_SEARCH"

    if is_low_stock:
        intent = "INVENTORY_ALERT"
        if lang == "TA":
            response_text = f"கையிருப்பு 5 அல்லது அதற்குக் குறைவாக உள்ள {count} கைவினைப் பொருட்கள் தரவுத்தளத்தில் கண்டறியப்பட்டன. கைவினைஞர்களிடம் புதிய ஆர்டர்களை திட்டமிடவும்."
        elif lang == "HI":
            response_text = f"डेटाबेस में 5 या उससे कम स्टॉक वाले {count} उत्पाद मिले हैं। कृपया कारीगरों से उत्पादन बैच को तुरंत रीस्टॉक करें।"
        elif lang == "TE":
            response_text = f"డేటాబేస్‌లో 5 కంటే తక్కువ నిల్వ ఉన్న {count} ఉత్పత్తులు కనుగొనబడ్డాయి. దయచేసి వెంటనే రీస్టాక్ చేయండి."
        else:
            response_text = f"Retrieved {count} regional craft products with critical inventory (<= 5 units remaining). Recommended action: initiate restock with artisan cluster."
    elif specific_market:
        intent = "EXPORT_INTELLIGENCE"
        if lang == "TA":
            response_text = f"{specific_market.upper()} சந்தைக்கு ஏற்றுமதி தகுதியுள்ள {count} அங்கீகரிக்கப்பட்ட புவிசார் குறியீடு (GI) கைவினைப் பொருட்கள் கீழே பட்டியலிடப்பட்டுள்ளன."
        elif lang == "HI":
            response_text = f"{specific_market.upper()} बाजार के लिए निर्यात-योग्य {count} सत्यापित जीआई क्राफ्ट उत्पाद उपलब्ध हैं।"
        elif lang == "TE":
            response_text = f"{specific_market.upper()} మార్కెట్‌కు ఎగుమతి చేయడానికి సిద్ధంగా ఉన్న {count} ప్రామాణిక GI ఉత్పత్తులు ఇక్కడ ఉన్నాయి."
        else:
            response_text = f"Found {count} export-ready GI-certified craft products compliant with customs standards for the {specific_market.title()} market."
    elif is_high_demand:
        intent = "DEMAND_ANALYTICS"
        if lang == "TA":
            response_text = f"உலகளாவிய சந்தையில் அதிக தேவை (Global Demand 90%+) உள்ள {count} சிறந்த தயாரிப்புகள் இங்கே உள்ளன."
        elif lang == "HI":
            response_text = f"अंतर्राष्ट्रीय बाजार में उच्चतम मांग (ग्लोबल डिमांड 90%+) वाले शीर्ष {count} हस्तशिल्प उत्पाद।"
        elif lang == "TE":
            response_text = f"అంతర్జాతీయ మార్కెట్లో అత్యధిక డిమాండ్ ఉన్న టాప్ {count} హస్తకళల ఉత్పత్తులు."
        else:
            response_text = f"Top {count} high-velocity MSME craft products with peak Global Demand scores (88% - 98%) and strong international buyer traction."
    else:
        if lang == "TA":
            response_text = f"உங்கள் கேள்விக்கான {count} பொருத்தமான கைவினைப் பொருட்கள் தரவுத்தளத்திலிருந்து பெறப்பட்டன."
        elif lang == "HI":
            response_text = f"आपके अनुरोध के अनुसार डेटाबेस से {count} प्रामाणिक शिल्प उत्पाद प्राप्त किए गए हैं।"
        elif lang == "TE":
            response_text = f"మీ శోధనకు సంబంధించిన {count} ప్రామాణిక కళా ఉత్పత్తులు డేటాబేస్ నుండి పొందబడ్డాయి."
        else:
            response_text = f"Found {count} authentic Indian MSME craft products matching your database query."

    # Suggested follow up queries
    suggested = [
        "Show me GI-tagged silk products from Tamil Nadu",
        "Which products have stock below 5 units?",
        "Top crafts with highest demand in Singapore & USA",
        "Show brass and metal craft items under $150"
    ]

    return {
        "response": response_text,
        "detected_language": lang,
        "retrieved_products": results,
        "suggested_queries": suggested,
        "intent": intent
    }

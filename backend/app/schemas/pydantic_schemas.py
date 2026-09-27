from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "MSME_OWNER"
    phone: Optional[str] = None
    company: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Artisan Schemas ---
class ArtisanBase(BaseModel):
    name: str
    business_name: str
    state: str
    district: str
    city: str
    cluster_name: str
    craft_type: str
    gi_registration_no: Optional[str] = None
    experience_years: int = 15
    artisan_count: int = 25
    story: Optional[str] = None
    contact_phone: str
    whatsapp_number: str
    avatar_url: Optional[str] = None
    verified_status: str = "GI_VERIFIED"

class ArtisanCreate(ArtisanBase):
    user_id: Optional[int] = None

class ArtisanResponse(ArtisanBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Product Image Schema ---
class ProductImageResponse(BaseModel):
    id: int
    image_url: str
    is_primary: bool
    alt_text: Optional[str] = None
    sort_order: int
    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    product_name: str
    slug: Optional[str] = None
    short_description: str
    detailed_description: str
    state: str
    district: str
    city: str
    artisan_cluster: str
    artisan_name: str
    category: str
    sub_category: Optional[str] = None
    craft_type: str
    gi_tag: Optional[str] = None
    gi_registration_status: str = "GI_VERIFIED"
    verified_status: str = "VERIFIED"
    target_price: float
    minimum_price: float
    wholesale_price: float
    currency: str = "USD"
    stock_quantity: int = 25
    minimum_order_quantity: int = 5
    unit: str = "Piece"
    production_time: str = "14-21 Days"
    material: str
    technique: str
    origin: str
    heritage_story: str
    artisan_story: str
    sustainability_information: str
    quality_grade: str = "Master Craftsman Grade A+"
    export_eligibility: bool = True
    export_markets: str = "USA, Singapore, UAE, Germany, UK, Australia"
    global_demand_score: float = 85.0
    buyer_interest_score: float = 88.0
    rating: float = 4.8
    review_count: int = 32
    buyer_count: int = 14
    estimated_delivery_days: int = 12
    shipping_available: bool = True
    wholesale_available: bool = True
    bulk_discount: str = "5% for 20+ units, 12% for 50+ units, 20% for 100+ units"
    hs_code: str = "5007.20.00"
    payment_terms: str = "30% Advance, 70% LC / TT on BL"
    tags: str = "Handmade, GI Tag, Sustainable, Luxury, Export Ready"
    seller_contact: str = "+91 94432 10987"
    whatsapp_enabled: bool = True
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    artisan_id: Optional[int] = None
    category_id: Optional[int] = None

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    target_price: Optional[float] = None
    minimum_price: Optional[float] = None
    wholesale_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    available_stock: Optional[int] = None
    minimum_order_quantity: Optional[int] = None
    export_markets: Optional[str] = None
    global_demand_score: Optional[float] = None

class ProductResponse(ProductBase):
    id: int
    slug: str
    reserved_stock: int
    available_stock: int
    created_date: datetime
    updated_date: datetime
    images: List[ProductImageResponse] = []
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    size: int
    pages: int

# --- Order & Checkout Schemas ---
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    buyer_name: str
    buyer_company: str
    buyer_email: str
    buyer_phone: str
    destination_country: str
    destination_address: str
    city: Optional[str] = None
    postal_code: Optional[str] = None
    payment_method: str = "Letter of Credit (LC)"
    shipping_method: str = "Air Cargo Express"
    items: List[OrderItemCreate]
    notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    total_price: float
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    buyer_name: str
    buyer_company: str
    buyer_email: str
    buyer_phone: str
    destination_country: str
    destination_address: str
    city: Optional[str] = None
    postal_code: Optional[str] = None
    total_amount: float
    currency: str
    payment_status: str
    payment_method: str
    shipping_method: str
    order_status: str
    tracking_number: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    order_status: str
    tracking_number: Optional[str] = None
    notes: Optional[str] = None

# --- Cart Schemas ---
class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1
    session_id: Optional[str] = "default_session"

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    product: ProductResponse
    quantity: int
    unit_price: float
    subtotal: float
    created_at: datetime
    class Config:
        from_attributes = True

class CartSummaryResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    subtotal: float
    estimated_shipping: float
    estimated_tax: float
    total: float

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    reference_id: Optional[str] = None
    reference_type: Optional[str] = None
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- AI Negotiation Schemas ---
class NegotiationEvaluateRequest(BaseModel):
    product_id: int
    buyer_name: str
    buyer_company: str
    buyer_country: str
    requested_quantity: int
    buyer_offer_price: float
    notes: Optional[str] = None

class NegotiationEvaluateResponse(BaseModel):
    status: str # ACCEPTED, REJECTED, COUNTER_OFFERED
    target_price: float
    minimum_price: float
    buyer_offer: float
    suggested_counter_price: float
    total_deal_value: float
    profit_margin_pct: float
    discount_pct: float
    ai_rationale: str
    recommended_talking_points: List[str]
    whatsapp_pitch_draft: str

# --- RAG Copilot Schemas ---
class AIChatRequest(BaseModel):
    message: str
    language: str = "EN" # EN, TA, HI, TE
    context_product_id: Optional[int] = None
    conversation_history: Optional[List[Dict[str, str]]] = None

class AIChatResponse(BaseModel):
    response: str
    detected_language: str
    retrieved_products: List[ProductResponse] = []
    suggested_queries: List[str] = []
    intent: str

# --- Campaign Simulator Schemas ---
class CampaignSimulateRequest(BaseModel):
    campaign_name: str
    discount_percentage: float
    target_category: Optional[str] = "ALL"
    target_region: Optional[str] = "ALL"
    duration_days: int = 14
    marketing_budget_usd: float = 2000.0

class CampaignSimulateResponse(BaseModel):
    campaign_name: str
    discount_percentage: float
    projected_demand_increase_pct: float
    projected_order_volume: int
    projected_gross_revenue_usd: float
    projected_inventory_depletion_units: int
    projected_conversion_rate_pct: float
    top_impacted_products: List[Dict[str, Any]]
    recommendation: str
    risk_level: str

# --- WhatsApp Schemas ---
class WhatsAppSendRequest(BaseModel):
    recipient_phone: str
    message_type: str # ORDER_NOTIFICATION, STATUS_UPDATE, LOW_STOCK_ALERT, BUYER_MESSAGE
    template_name: Optional[str] = None
    content: str
    order_id: Optional[str] = None
    product_id: Optional[int] = None

class WhatsAppMessageResponse(BaseModel):
    id: int
    recipient_phone: str
    recipient_name: str
    message_type: str
    content: str
    status: str
    is_simulated: bool
    order_id: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class WhatsAppSettingsResponse(BaseModel):
    mode: str # DEMO or REAL
    phone_number_id_configured: bool
    access_token_configured: bool
    owner_whatsapp_number: str
    verify_token_configured: bool

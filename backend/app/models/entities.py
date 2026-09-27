import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="MSME_OWNER", index=True) # ADMIN, MSME_OWNER, ARTISAN, BUYER
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    artisans = relationship("Artisan", back_populates="user", cascade="all, delete-orphan")
    buyers = relationship("Buyer", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Artisan(Base):
    __tablename__ = "artisans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False, index=True)
    business_name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    cluster_name = Column(String(200), nullable=False, index=True)
    craft_type = Column(String(200), nullable=False)
    gi_registration_no = Column(String(100), nullable=True)
    experience_years = Column(Integer, default=15)
    artisan_count = Column(Integer, default=25)
    story = Column(Text, nullable=True)
    contact_phone = Column(String(50), nullable=False)
    whatsapp_number = Column(String(50), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    verified_status = Column(String(50), default="GI_VERIFIED") # GI_VERIFIED, VERIFIED, PENDING
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="artisans")
    products = relationship("Product", back_populates="artisan", cascade="all, delete-orphan")

class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    company_name = Column(String(255), nullable=False, index=True)
    contact_name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    import_license = Column(String(100), nullable=True)
    annual_volume_usd = Column(Float, default=250000.0)
    preferred_categories = Column(String(500), nullable=True)
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="buyers")
    orders = relationship("Order", back_populates="buyer")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    icon = Column(String(100), default="Package")
    description = Column(Text, nullable=True)
    state_primary = Column(String(100), nullable=True)

    products = relationship("Product", back_populates="category_rel")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    detailed_description = Column(Text, nullable=False)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=False)
    artisan_cluster = Column(String(200), nullable=False)
    artisan_name = Column(String(255), nullable=False)
    artisan_id = Column(Integer, ForeignKey("artisans.id"), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    sub_category = Column(String(100), nullable=True)
    craft_type = Column(String(200), nullable=False, index=True)
    gi_tag = Column(String(200), nullable=True, index=True)
    gi_registration_status = Column(String(50), default="GI_VERIFIED", index=True)
    verified_status = Column(String(50), default="VERIFIED", index=True)
    target_price = Column(Float, nullable=False)
    minimum_price = Column(Float, nullable=False)
    wholesale_price = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    stock_quantity = Column(Integer, default=25)
    reserved_stock = Column(Integer, default=0)
    available_stock = Column(Integer, default=25)
    minimum_order_quantity = Column(Integer, default=5)
    unit = Column(String(50), default="Piece")
    production_time = Column(String(100), default="14-21 Days")
    material = Column(String(255), nullable=False)
    technique = Column(String(255), nullable=False)
    origin = Column(String(255), nullable=False)
    heritage_story = Column(Text, nullable=False)
    artisan_story = Column(Text, nullable=False)
    sustainability_information = Column(Text, nullable=False)
    quality_grade = Column(String(50), default="Master Craftsman Grade A+")
    export_eligibility = Column(Boolean, default=True)
    export_markets = Column(String(500), default="USA, Singapore, UAE, Germany, UK, Australia")
    global_demand_score = Column(Float, default=85.0)
    buyer_interest_score = Column(Float, default=88.0)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=32)
    buyer_count = Column(Integer, default=14)
    estimated_delivery_days = Column(Integer, default=12)
    shipping_available = Column(Boolean, default=True)
    wholesale_available = Column(Boolean, default=True)
    bulk_discount = Column(String(255), default="5% for 20+ units, 12% for 50+ units, 20% for 100+ units")
    hs_code = Column(String(50), default="5007.20.00")
    payment_terms = Column(String(255), default="30% Advance, 70% LC / TT on BL")
    tags = Column(String(500), default="Handmade, GI Tag, Sustainable, Luxury, Export Ready")
    created_date = Column(DateTime, default=datetime.datetime.utcnow)
    updated_date = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    seller_contact = Column(String(100), default="+91 94432 10987")
    whatsapp_enabled = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)

    # Relationships
    artisan = relationship("Artisan", back_populates="products")
    category_rel = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    inventory = relationship("Inventory", back_populates="product", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    demand_insight = relationship("DemandInsight", back_populates="product", uselist=False, cascade="all, delete-orphan")
    negotiations = relationship("Negotiation", back_populates="product", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, default=False)
    alt_text = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    total_stock = Column(Integer, default=25)
    reserved_stock = Column(Integer, default=0)
    available_stock = Column(Integer, default=25)
    low_stock_threshold = Column(Integer, default=5)
    critical_stock_threshold = Column(Integer, default=2)
    restock_date = Column(String(100), default="Next batch in 15 days")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="inventory")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. GB-2026-00001
    buyer_id = Column(Integer, ForeignKey("buyers.id"), nullable=True)
    buyer_name = Column(String(255), nullable=False)
    buyer_company = Column(String(255), nullable=False)
    buyer_email = Column(String(255), nullable=False)
    buyer_phone = Column(String(50), nullable=False)
    destination_country = Column(String(100), nullable=False)
    destination_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=True)
    postal_code = Column(String(50), nullable=True)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    payment_status = Column(String(50), default="PAID") # PENDING, PAID, REFUNDED
    payment_method = Column(String(100), default="Letter of Credit (LC)")
    shipping_method = Column(String(100), default="Air Cargo Express")
    order_status = Column(String(50), default="PENDING", index=True) # PENDING, CONFIRMED, PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED
    tracking_number = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    buyer = relationship("Buyer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="NEW_ORDER", index=True) # NEW_ORDER, PAYMENT_UPDATE, LOW_STOCK, BUYER_INQUIRY, NEGOTIATION_ALERT, EXPORT_OPPORTUNITY
    reference_id = Column(String(100), nullable=True) # order_number, product_id, etc.
    reference_type = Column(String(50), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Negotiation(Base):
    __tablename__ = "negotiations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    buyer_name = Column(String(255), nullable=False)
    buyer_company = Column(String(255), nullable=False)
    buyer_country = Column(String(100), nullable=False)
    requested_quantity = Column(Integer, nullable=False)
    initial_offer = Column(Float, nullable=False)
    target_price = Column(Float, nullable=False)
    minimum_price = Column(Float, nullable=False)
    current_counter = Column(Float, nullable=False)
    status = Column(String(50), default="IN_PROGRESS") # ACCEPTED, REJECTED, COUNTER_OFFERED, IN_PROGRESS
    ai_rationale = Column(Text, nullable=False)
    conversation_log = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="negotiations")

class WhatsAppMessage(Base):
    __tablename__ = "whatsapp_messages"

    id = Column(Integer, primary_key=True, index=True)
    recipient_phone = Column(String(50), nullable=False)
    recipient_name = Column(String(255), default="MSME Cluster Owner")
    message_type = Column(String(50), default="ORDER_NOTIFICATION") # ORDER_NOTIFICATION, STATUS_UPDATE, LOW_STOCK_ALERT, BUYER_MESSAGE
    template_name = Column(String(100), default="globalbridge_order_alert")
    content = Column(Text, nullable=False)
    status = Column(String(50), default="SIMULATED") # SIMULATED, SENT, DELIVERED, FAILED
    is_simulated = Column(Boolean, default=True)
    order_id = Column(String(50), nullable=True)
    product_id = Column(Integer, nullable=True)
    raw_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DemandInsight(Base):
    __tablename__ = "demand_insights"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    global_demand_score = Column(Float, default=85.0)
    growth_rate = Column(Float, default=12.5) # e.g. +14.8%
    top_countries = Column(String(500), default="USA, Singapore, UAE, Germany, Australia")
    projected_volume = Column(Integer, default=500)
    seasonality_factor = Column(String(100), default="High Demand in Q3-Q4 Festival Season")
    target_market_fit = Column(String(255), default="High Affinity in Luxury Boutique & Fair Trade Segments")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="demand_insight")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    reviewer_name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=False)
    verified_purchase = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="reviews")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)
    user_id = Column(Integer, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="cart_items")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    session_id = Column(String(100), index=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="favorites")

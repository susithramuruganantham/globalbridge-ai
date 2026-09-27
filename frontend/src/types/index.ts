export type Role = 'ADMIN' | 'MSME_OWNER' | 'ARTISAN' | 'BUYER';
export type Language = 'EN' | 'TA' | 'HI' | 'TE';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  full_name: string;
  phone?: string;
  company?: string;
  created_at?: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  alt_text?: string;
  sort_order: number;
}

export interface Product {
  id: number;
  product_name: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  state: string;
  district: string;
  city: string;
  artisan_cluster: string;
  artisan_name: string;
  artisan_id?: number;
  category_id?: number;
  category: string;
  sub_category?: string;
  craft_type: string;
  gi_tag?: string;
  gi_registration_status: string;
  verified_status: string;
  target_price: number;
  minimum_price: number;
  wholesale_price: number;
  currency: string;
  stock_quantity: number;
  reserved_stock: number;
  available_stock: number;
  minimum_order_quantity: number;
  unit: string;
  production_time: string;
  material: string;
  technique: string;
  origin: string;
  heritage_story: string;
  artisan_story: string;
  sustainability_information: string;
  quality_grade: string;
  export_eligibility: boolean;
  export_markets: string;
  global_demand_score: number;
  buyer_interest_score: number;
  rating: number;
  review_count: number;
  buyer_count: number;
  estimated_delivery_days: number;
  shipping_available: boolean;
  wholesale_available: boolean;
  bulk_discount: string;
  hs_code: string;
  payment_terms: string;
  tags: string;
  created_date?: string;
  updated_date?: string;
  seller_contact: string;
  whatsapp_enabled: boolean;
  image_url?: string;
  images?: ProductImage[];
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface CartSummary {
  items: CartItem[];
  total_items: number;
  subtotal: number;
  estimated_shipping: number;
  estimated_tax: number;
  total: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  buyer_name: string;
  buyer_company: string;
  buyer_email: string;
  buyer_phone: string;
  destination_country: string;
  destination_address: string;
  city?: string;
  postal_code?: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  shipping_method: string;
  order_status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'NEW_ORDER' | 'PAYMENT_UPDATE' | 'LOW_STOCK' | 'BUYER_INQUIRY' | 'NEGOTIATION_ALERT' | 'EXPORT_OPPORTUNITY';
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
}

export interface WhatsAppMessage {
  id: number;
  recipient_phone: string;
  recipient_name: string;
  message_type: string;
  content: string;
  status: string;
  is_simulated: boolean;
  order_id?: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_products: number;
  total_stock: number;
  inventory_valuation: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  active_buyers: number;
  global_demand_score: number;
  low_stock_products: number;
  export_opportunities: number;
  valuation_by_state: { state: string; valuation: number }[];
  stock_by_category: { category: string; stock: number }[];
  top_products: {
    id: number;
    name: string;
    state: string;
    category: string;
    demand_score: number;
    target_price: number;
    available_stock: number;
    image_url?: string;
  }[];
  buyer_distribution: { country: string; count: number }[];
  revenue_trend: { month: string; orders: number; revenue: number }[];
}

export interface NegotiationResult {
  status: 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFERED';
  target_price: number;
  minimum_price: number;
  buyer_offer: number;
  suggested_counter_price: number;
  total_deal_value: number;
  profit_margin_pct: number;
  discount_pct: number;
  ai_rationale: string;
  recommended_talking_points: string[];
  whatsapp_pitch_draft: string;
}

export interface AIChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  retrieved_products?: Product[];
  suggested_queries?: string[];
}

export interface CampaignSimulationResult {
  campaign_name: string;
  discount_percentage: number;
  projected_demand_increase_pct: number;
  projected_order_volume: number;
  projected_gross_revenue_usd: number;
  projected_inventory_depletion_units: number;
  projected_conversion_rate_pct: number;
  top_impacted_products: {
    product_id: number;
    product_name: string;
    state: string;
    original_price: number;
    discounted_price: number;
    minimum_price: number;
    is_below_minimum: boolean;
    current_stock: number;
    projected_depletion_units: number;
    projected_revenue: number;
  }[];
  recommendation: string;
  risk_level: string;
}

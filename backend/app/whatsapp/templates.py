"""
WhatsApp Message Templates for GlobalBridge.AI v3.0
"""

def format_new_order_whatsapp(order_number: str, product_name: str, buyer_name: str, buyer_company: str, quantity: int, unit_price: float, total_val: float, destination: str) -> str:
    return (
        "━━━━━━━━━━━━━━━━━━━━\n"
        "📦 *NEW ORDER — GlobalBridge.AI*\n\n"
        f"*Order ID:* {order_number}\n"
        f"*Product:* {product_name}\n"
        f"*Buyer:* {buyer_name} ({buyer_company})\n"
        f"*Quantity:* {quantity} units\n"
        f"*Unit Price:* ${unit_price:,.2f}\n"
        f"*Order Value:* ${total_val:,.2f} USD\n"
        f"*Destination:* {destination}\n"
        "*Payment:* Confirmed / Letter of Credit\n"
        "*Status:* 🟡 NEW ORDER\n\n"
        "👉 Open GlobalBridge dashboard to accept and process this export shipment.\n"
        "━━━━━━━━━━━━━━━━━━━━"
    )

def format_order_status_whatsapp(order_number: str, product_name: str, new_status: str, tracking_number: str = None) -> str:
    status_emojis = {
        "PENDING": "🟡",
        "CONFIRMED": "🟢",
        "PROCESSING": "⚙️",
        "PACKED": "📦",
        "SHIPPED": "🚚",
        "DELIVERED": "✅",
        "CANCELLED": "❌"
    }
    emoji = status_emojis.get(new_status.upper(), "📌")
    trk_str = f"\n*Tracking:* {tracking_number}" if tracking_number else ""
    return (
        "━━━━━━━━━━━━━━━━━━━━\n"
        f"{emoji} *ORDER STATUS UPDATE — GlobalBridge.AI*\n\n"
        f"*Order:* {order_number}\n"
        f"*Product:* {product_name}\n"
        f"*Status:* {new_status.upper()}{trk_str}\n\n"
        "👉 Real-time update synchronized with international buyer portal.\n"
        "━━━━━━━━━━━━━━━━━━━━"
    )

def format_low_stock_whatsapp(product_name: str, current_stock: int, threshold: int = 5, cluster_name: str = "Regional Cluster") -> str:
    severity = "🚨 CRITICAL STOCK" if current_stock <= 2 else "⚠️ LOW STOCK ALERT"
    return (
        "━━━━━━━━━━━━━━━━━━━━\n"
        f"{severity} — GlobalBridge.AI\n\n"
        f"*Product:* {product_name}\n"
        f"*Cluster:* {cluster_name}\n"
        f"*Remaining Available Stock:* {current_stock} units\n"
        f"*Minimum Threshold:* {threshold} units\n\n"
        "⚡ International wholesale buyers actively viewing this item. Please restock or schedule artisan production batch immediately.\n"
        "━━━━━━━━━━━━━━━━━━━━"
    )

def format_negotiation_whatsapp(product_name: str, buyer_name: str, buyer_country: str, qty: int, offer_price: float, counter_price: float) -> str:
    return (
        "━━━━━━━━━━━━━━━━━━━━\n"
        "🤝 *AI WHOLESALE NEGOTIATION ALERT*\n\n"
        f"*Product:* {product_name}\n"
        f"*Buyer:* {buyer_name} ({buyer_country})\n"
        f"*Requested Quantity:* {qty} units\n"
        f"*Buyer Bid:* ${offer_price:,.2f}\n"
        f"*AI Recommended Counter:* ${counter_price:,.2f}\n\n"
        "👉 Tap into GlobalBridge AI Negotiator to seal this international contract.\n"
        "━━━━━━━━━━━━━━━━━━━━"
    )

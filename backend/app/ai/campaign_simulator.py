from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.entities import Product

def simulate_campaign(
    db: Session,
    campaign_name: str,
    discount_percentage: float,
    target_category: str = "ALL",
    target_region: str = "ALL",
    duration_days: int = 14,
    marketing_budget_usd: float = 2000.0
) -> Dict[str, Any]:
    query = db.query(Product)
    if target_region != "ALL":
        query = query.filter(Product.state == target_region)
    if target_category != "ALL":
        query = query.filter(Product.category == target_category)

    products = query.all()
    if not products:
        products = db.query(Product).limit(30).all()

    # Simulation heuristics
    # Price elasticity of craft goods is approximately 1.4
    elasticity = 1.45
    base_demand_boost = (discount_percentage * elasticity)
    # Marketing budget factor ($2k budget adds ~8% lift)
    marketing_lift = min(25.0, (marketing_budget_usd / 250.0))
    total_demand_increase_pct = round(base_demand_boost + marketing_lift, 1)

    projected_orders = 0
    projected_revenue = 0.0
    projected_inventory_units = 0

    top_impacted = []

    for p in products[:12]:
        discounted_price = p.target_price * (1.0 - (discount_percentage / 100.0))
        # Ensure we check if discounted price falls below minimum
        is_below_min = discounted_price < p.minimum_price

        current_available = p.available_stock
        est_units_sold = int(max(2, (current_available * (total_demand_increase_pct / 100.0) * 0.4)))
        est_units_sold = min(est_units_sold, current_available)

        p_rev = est_units_sold * discounted_price
        projected_orders += max(1, est_units_sold // p.minimum_order_quantity)
        projected_revenue += p_rev
        projected_inventory_units += est_units_sold

        top_impacted.append({
            "product_id": p.id,
            "product_name": p.product_name,
            "state": p.state,
            "original_price": p.target_price,
            "discounted_price": round(discounted_price, 2),
            "minimum_price": p.minimum_price,
            "is_below_minimum": is_below_min,
            "current_stock": current_available,
            "projected_depletion_units": est_units_sold,
            "projected_revenue": round(p_rev, 2)
        })

    # Conversion rate projection
    base_conv = 2.4
    projected_conv = round(base_conv + (total_demand_increase_pct * 0.08), 2)

    risk = "LOW"
    recommendation = "Campaign looks highly profitable and will accelerate inventory turnover across international wholesale channels."

    below_min_count = sum(1 for item in top_impacted if item["is_below_minimum"])
    if below_min_count > 0:
        risk = "HIGH"
        recommendation = f"WARNING: {below_min_count} products will sell below artisan minimum floor price. Adjust discount to under {discount_percentage * 0.7:.1f}% or exclude luxury GI products."
    elif discount_percentage > 20:
        risk = "MEDIUM"
        recommendation = "Moderate risk of rapid stockout on high-demand items. Ensure artisans are notified 10 days in advance."

    return {
        "campaign_name": campaign_name,
        "discount_percentage": discount_percentage,
        "projected_demand_increase_pct": total_demand_increase_pct,
        "projected_order_volume": max(15, projected_orders * 4),
        "projected_gross_revenue_usd": round(projected_revenue * 3.5, 2),
        "projected_inventory_depletion_units": projected_inventory_units * 3,
        "projected_conversion_rate_pct": projected_conv,
        "top_impacted_products": top_impacted,
        "recommendation": recommendation,
        "risk_level": risk
    }

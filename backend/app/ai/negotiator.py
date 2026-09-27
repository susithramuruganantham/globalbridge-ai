import math
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.entities import Product, Negotiation

def evaluate_ai_negotiation(
    db: Session,
    product_id: int,
    buyer_name: str,
    buyer_company: str,
    buyer_country: str,
    requested_quantity: int,
    buyer_offer_price: float,
    notes: str = ""
) -> Dict[str, Any]:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise ValueError(f"Product with ID {product_id} not found")

    target_price = float(product.target_price)
    minimum_price = float(product.minimum_price)
    wholesale_price = float(product.wholesale_price)
    moq = int(product.minimum_order_quantity)
    global_demand = float(product.global_demand_score)

    # 1. Check quantity volume tier
    volume_discount_allowance = 0.0
    if requested_quantity >= moq * 5: # e.g. 5x MOQ (very high volume)
        volume_discount_allowance = 0.15 # Up to 15% discount
    elif requested_quantity >= moq * 2: # e.g. 2x MOQ (medium volume)
        volume_discount_allowance = 0.08
    elif requested_quantity >= moq:
        volume_discount_allowance = 0.03
    else:
        volume_discount_allowance = -0.05 # Below MOQ penalty

    # 2. Demand elasticity factor
    # High demand items (demand >= 90) have stricter pricing
    demand_protection = 0.0
    if global_demand >= 90:
        demand_protection = 0.05
    elif global_demand >= 80:
        demand_protection = 0.02

    # Calculate optimal AI target floor
    dynamic_floor = max(minimum_price, target_price * (1.0 - volume_discount_allowance + demand_protection))
    # Strict safety constraint: NEVER allow counter or accept below minimum price
    dynamic_floor = max(minimum_price, dynamic_floor)

    status = ""
    suggested_counter = 0.0
    rationale = ""
    talking_points: List[str] = []

    if buyer_offer_price >= target_price:
        status = "ACCEPTED"
        suggested_counter = buyer_offer_price
        rationale = f"Offer of ${buyer_offer_price:,.2f} meets or exceeds target export price of ${target_price:,.2f}. High commercial profitability achieved."
        talking_points = [
            f"Confirm priority export packing for {requested_quantity} units.",
            f"Offer expedited customs clearance support for {buyer_country}.",
            "Offer 15-day payment credit on next reorder batch."
        ]
    elif buyer_offer_price >= dynamic_floor:
        status = "ACCEPTED"
        suggested_counter = buyer_offer_price
        rationale = f"Offer of ${buyer_offer_price:,.2f} is above dynamic threshold (${dynamic_floor:,.2f}) for order volume of {requested_quantity} units. Approved with solid artisan margin."
        talking_points = [
            f"Accept order quantity of {requested_quantity} {product.unit}s.",
            "Lock in batch production timeline with master weavers.",
            "Require 30% advance deposit to initiate handcrafting process."
        ]
    elif buyer_offer_price < minimum_price:
        status = "REJECTED"
        # Counter strictly at or slightly above minimum price based on volume
        suggested_counter = round(max(minimum_price, dynamic_floor), 2)
        discount_given = ((target_price - suggested_counter) / target_price) * 100
        rationale = (
            f"Offer of ${buyer_offer_price:,.2f} is strictly below artisan minimum cost floor of ${minimum_price:,.2f}. "
            f"Automated safeguard REJECTED the offer to prevent negative margins. "
            f"Recommended counter-offer set to ${suggested_counter:,.2f} ({discount_given:.1f}% off target)."
        )
        talking_points = [
            f"Explain GI-tagged master craftsmanship and authentic {product.material} material costs.",
            f"Highlight that ${suggested_counter:,.2f} represents the absolute best export wholesale rate for {requested_quantity} units.",
            "Provide sample batch option or offer staggered delivery milestones."
        ]
    else:
        # Between minimum_price and dynamic_floor
        status = "COUNTER_OFFERED"
        # Propose a fair split closer to dynamic floor
        suggested_counter = round(dynamic_floor, 2)
        rationale = (
            f"Offer of ${buyer_offer_price:,.2f} is below target margin for {requested_quantity} units. "
            f"Counter-offer of ${suggested_counter:,.2f} balances buyer incentive with MSME profitability."
        )
        talking_points = [
            f"Counter at ${suggested_counter:,.2f} reflecting authentic {product.technique} heritage value.",
            f"Offer complimentary GI certification provenance documentation for {buyer_country} retail marketing.",
            "Propose volume tier upgrade (order +10 units to unlock an extra 2% discount)."
        ]

    total_deal_val = suggested_counter * requested_quantity
    profit_margin = max(0.0, ((suggested_counter - minimum_price) / suggested_counter) * 100)
    discount_pct = max(0.0, ((target_price - suggested_counter) / target_price) * 100)

    # Save negotiation record to database
    negotiation = Negotiation(
        product_id=product.id,
        buyer_name=buyer_name,
        buyer_company=buyer_company,
        buyer_country=buyer_country,
        requested_quantity=requested_quantity,
        initial_offer=buyer_offer_price,
        target_price=target_price,
        minimum_price=minimum_price,
        current_counter=suggested_counter,
        status=status,
        ai_rationale=rationale
    )
    db.add(negotiation)
    db.commit()

    whatsapp_pitch = (
        f"Hello {buyer_name}, thank you for your wholesale interest in {product.product_name}. "
        f"For your order quantity of {requested_quantity} units to {buyer_country}, our AI Trade Desk recommends an approved rate of ${suggested_counter:,.2f}/unit "
        f"(Total: ${total_deal_val:,.2f} USD) including GI Tag provenance & export packing. Looking forward to your confirmation!"
    )

    return {
        "status": status,
        "target_price": target_price,
        "minimum_price": minimum_price,
        "buyer_offer": buyer_offer_price,
        "suggested_counter_price": suggested_counter,
        "total_deal_value": round(total_deal_val, 2),
        "profit_margin_pct": round(profit_margin, 1),
        "discount_pct": round(discount_pct, 1),
        "ai_rationale": rationale,
        "recommended_talking_points": talking_points,
        "whatsapp_pitch_draft": whatsapp_pitch
    }

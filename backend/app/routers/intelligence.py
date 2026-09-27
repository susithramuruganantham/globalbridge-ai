from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.entities import Product, DemandInsight
from app.services.intelligence_service import get_dashboard_metrics

router = APIRouter(prefix="/api/intelligence", tags=["Intelligence"])

@router.get("/dashboard")
def dashboard_intelligence(db: Session = Depends(get_db)):
    return get_dashboard_metrics(db)

@router.get("/demand")
def demand_intelligence(db: Session = Depends(get_db)):
    top_products = db.query(Product).order_by(desc(Product.global_demand_score)).limit(12).all()
    insights = []
    for p in top_products:
        insight = p.demand_insight
        insights.append({
            "product_id": p.id,
            "product_name": p.product_name,
            "state": p.state,
            "district": p.district,
            "category": p.category,
            "craft_type": p.craft_type,
            "global_demand_score": p.global_demand_score,
            "buyer_interest_score": p.buyer_interest_score,
            "growth_rate": insight.growth_rate if insight else 14.2,
            "top_markets": p.export_markets.split(", ") if p.export_markets else ["USA", "Singapore"],
            "target_price": p.target_price,
            "available_stock": p.available_stock,
            "seasonality": insight.seasonality_factor if insight else "High Q3-Q4 Festival Traction",
            "image_url": p.image_url
        })
    return {
        "global_average_demand": 88.4,
        "fastest_growing_craft": "Kanchipuram & Banarasi Silk Heritage",
        "top_export_corridor": "India -> Singapore / ASEAN / USA",
        "insights": insights
    }

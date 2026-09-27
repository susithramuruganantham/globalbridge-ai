from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.entities import Negotiation, Product
from app.schemas.pydantic_schemas import (
    NegotiationEvaluateRequest, NegotiationEvaluateResponse
)
from app.ai.negotiator import evaluate_ai_negotiation

router = APIRouter(prefix="/api/negotiations", tags=["Negotiations"])

@router.post("/evaluate", response_model=NegotiationEvaluateResponse)
def evaluate_negotiation(req: NegotiationEvaluateRequest, db: Session = Depends(get_db)):
    try:
        result = evaluate_ai_negotiation(
            db=db,
            product_id=req.product_id,
            buyer_name=req.buyer_name,
            buyer_company=req.buyer_company,
            buyer_country=req.buyer_country,
            requested_quantity=req.requested_quantity,
            buyer_offer_price=req.buyer_offer_price,
            notes=req.notes or ""
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI negotiation evaluation error: {str(e)}")

@router.get("")
def list_negotiations(db: Session = Depends(get_db)):
    negs = db.query(Negotiation).order_by(desc(Negotiation.created_at)).limit(30).all()
    results = []
    for n in negs:
        results.append({
            "id": n.id,
            "product_id": n.product_id,
            "product_name": n.product.product_name if n.product else "Craft Item",
            "buyer_name": n.buyer_name,
            "buyer_company": n.buyer_company,
            "buyer_country": n.buyer_country,
            "requested_quantity": n.requested_quantity,
            "initial_offer": n.initial_offer,
            "target_price": n.target_price,
            "minimum_price": n.minimum_price,
            "current_counter": n.current_counter,
            "status": n.status,
            "ai_rationale": n.ai_rationale,
            "created_at": n.created_at
        })
    return results

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.pydantic_schemas import (
    AIChatRequest, AIChatResponse,
    CampaignSimulateRequest, CampaignSimulateResponse
)
from app.ai.rag_copilot import execute_rag_copilot
from app.ai.campaign_simulator import simulate_campaign

router = APIRouter(prefix="/api/ai", tags=["AI & Copilot"])

@router.post("/chat", response_model=AIChatResponse)
def ai_rag_chat(req: AIChatRequest, db: Session = Depends(get_db)):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty")

    result = execute_rag_copilot(
        db=db,
        query=req.message,
        preferred_lang=req.language or "EN"
    )
    return result

@router.post("/simulate-campaign", response_model=CampaignSimulateResponse)
def run_campaign_simulation(req: CampaignSimulateRequest, db: Session = Depends(get_db)):
    if req.discount_percentage < 0 or req.discount_percentage > 80:
        raise HTTPException(status_code=400, detail="Discount percentage must be between 0 and 80%")

    result = simulate_campaign(
        db=db,
        campaign_name=req.campaign_name,
        discount_percentage=req.discount_percentage,
        target_category=req.target_category or "ALL",
        target_region=req.target_region or "ALL",
        duration_days=req.duration_days,
        marketing_budget_usd=req.marketing_budget_usd
    )
    return result

import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel

from app.database.session import get_db
from app.models.entities import WhatsAppMessage
from app.schemas.pydantic_schemas import (
    WhatsAppSendRequest, WhatsAppMessageResponse, WhatsAppSettingsResponse
)
from app.whatsapp.client import whatsapp_service

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp"])

class UpdateSettingsRequest(BaseModel):
    mode: str # DEMO or REAL
    access_token: Optional[str] = None
    phone_number_id: Optional[str] = None
    business_account_id: Optional[str] = None
    verify_token: Optional[str] = None
    owner_whatsapp_number: Optional[str] = None

@router.get("/webhook")
async def verify_webhook(request: Request):
    """
    Meta WhatsApp Cloud API Webhook Verification Endpoint.
    """
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    expected_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "globalbridge_verify_token_2026")
    if mode and token:
        if mode == "subscribe" and token == expected_token:
            return Response(content=challenge, media_type="text/plain")
        else:
            raise HTTPException(status_code=403, detail="Verification token mismatch")
    return {"status": "WhatsApp Webhook Gateway Active"}

@router.post("/webhook")
async def receive_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handles incoming messages and delivery status callbacks from Meta Cloud API.
    """
    try:
        body = await request.json()
        entries = body.get("entry", [])
        for entry in entries:
            changes = entry.get("changes", [])
            for change in changes:
                value = change.get("value", {})
                statuses = value.get("statuses", [])
                for s in statuses:
                    msg_id = s.get("id")
                    status_text = s.get("status") # sent, delivered, read, failed
                    # Update status in db if matching message found
                    pass
        return {"status": "EVENT_RECEIVED"}
    except Exception as e:
        return {"status": "ERROR", "detail": str(e)}

@router.get("/settings", response_model=WhatsAppSettingsResponse)
def get_whatsapp_settings():
    whatsapp_service.reload_config()
    return {
        "mode": whatsapp_service.mode,
        "phone_number_id_configured": bool(whatsapp_service.phone_number_id),
        "access_token_configured": bool(whatsapp_service.access_token),
        "owner_whatsapp_number": whatsapp_service.owner_phone,
        "verify_token_configured": bool(whatsapp_service.verify_token)
    }

@router.post("/settings", response_model=WhatsAppSettingsResponse)
def update_whatsapp_settings(req: UpdateSettingsRequest):
    if req.mode.upper() in ["DEMO", "REAL"]:
        os.environ["WHATSAPP_MODE"] = req.mode.upper()
    if req.access_token is not None:
        os.environ["WHATSAPP_ACCESS_TOKEN"] = req.access_token
    if req.phone_number_id is not None:
        os.environ["WHATSAPP_PHONE_NUMBER_ID"] = req.phone_number_id
    if req.business_account_id is not None:
        os.environ["WHATSAPP_BUSINESS_ACCOUNT_ID"] = req.business_account_id
    if req.verify_token is not None:
        os.environ["WHATSAPP_VERIFY_TOKEN"] = req.verify_token
    if req.owner_whatsapp_number is not None:
        os.environ["OWNER_WHATSAPP_NUMBER"] = req.owner_whatsapp_number

    whatsapp_service.reload_config()
    return get_whatsapp_settings()

@router.get("/messages", response_model=List[WhatsAppMessageResponse])
def get_whatsapp_messages(limit: int = Query(30, ge=1, le=100), db: Session = Depends(get_db)):
    return db.query(WhatsAppMessage).order_by(desc(WhatsAppMessage.created_at)).limit(limit).all()

@router.post("/send", response_model=WhatsAppMessageResponse)
async def send_whatsapp_message(req: WhatsAppSendRequest, db: Session = Depends(get_db)):
    msg = await whatsapp_service.send_message(
        db=db,
        recipient_phone=req.recipient_phone,
        content=req.content,
        message_type=req.message_type,
        template_name=req.template_name or "custom_message",
        order_id=req.order_id,
        product_id=req.product_id
    )
    return msg

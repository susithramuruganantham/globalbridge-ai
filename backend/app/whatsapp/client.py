import os
import json
import logging
import httpx
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.entities import WhatsAppMessage
from app.whatsapp.templates import (
    format_new_order_whatsapp,
    format_order_status_whatsapp,
    format_low_stock_whatsapp,
    format_negotiation_whatsapp
)

logger = logging.getLogger("whatsapp_service")

class WhatsAppService:
    def __init__(self):
        self.reload_config()

    def reload_config(self):
        self.mode = os.getenv("WHATSAPP_MODE", "DEMO").upper()
        self.access_token = os.getenv("WHATSAPP_ACCESS_TOKEN", "").strip()
        self.phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "").strip()
        self.business_account_id = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID", "").strip()
        self.verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "globalbridge_verify_token_2026")
        self.owner_phone = os.getenv("OWNER_WHATSAPP_NUMBER", "+919876543210")

    def is_real_mode_ready(self) -> bool:
        return bool(self.mode == "REAL" and self.access_token and self.phone_number_id)

    async def send_message(
        self,
        db: Session,
        recipient_phone: str,
        content: str,
        message_type: str = "ORDER_NOTIFICATION",
        template_name: str = "custom_text",
        order_id: Optional[str] = None,
        product_id: Optional[int] = None
    ) -> WhatsAppMessage:
        self.reload_config()
        clean_phone = recipient_phone if recipient_phone else self.owner_phone
        is_real = self.is_real_mode_ready()
        
        status = "SIMULATED"
        raw_response = None

        if is_real:
            try:
                url = f"https://graph.facebook.com/v19.0/{self.phone_number_id}/messages"
                headers = {
                    "Authorization": f"Bearer {self.access_token}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": clean_phone.replace("+", "").replace(" ", "").replace("-", ""),
                    "type": "text",
                    "text": {"preview_url": False, "body": content}
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(url, headers=headers, json=payload)
                    raw_response = resp.text
                    if resp.status_code in [200, 201]:
                        status = "SENT"
                    else:
                        logger.warning(f"WhatsApp Cloud API Error: {resp.status_code} - {resp.text}")
                        status = "FAILED"
            except Exception as e:
                logger.error(f"WhatsApp dispatch exception: {e}")
                raw_response = str(e)
                status = "FAILED"
        else:
            status = "SIMULATED"
            raw_response = json.dumps({
                "simulated": True,
                "mode": "DEMO",
                "timestamp": str(os.getenv("CURRENT_TIME", "")),
                "gateway": "GlobalBridge Local Gateway Simulator"
            })

        # Save to database
        db_msg = WhatsAppMessage(
            recipient_phone=clean_phone,
            recipient_name="MSME Cluster Owner",
            message_type=message_type,
            template_name=template_name,
            content=content,
            status=status,
            is_simulated=not is_real or status == "SIMULATED",
            order_id=order_id,
            product_id=product_id,
            raw_response=raw_response
        )
        db.add(db_msg)
        db.commit()
        db.refresh(db_msg)
        return db_msg

    async def send_order_notification(
        self,
        db: Session,
        order_number: str,
        product_name: str,
        buyer_name: str,
        buyer_company: str,
        quantity: int,
        unit_price: float,
        total_val: float,
        destination: str,
        recipient_phone: Optional[str] = None
    ) -> WhatsAppMessage:
        content = format_new_order_whatsapp(
            order_number=order_number,
            product_name=product_name,
            buyer_name=buyer_name,
            buyer_company=buyer_company,
            quantity=quantity,
            unit_price=unit_price,
            total_val=total_val,
            destination=destination
        )
        return await self.send_message(
            db=db,
            recipient_phone=recipient_phone or self.owner_phone,
            content=content,
            message_type="ORDER_NOTIFICATION",
            template_name="globalbridge_order_alert",
            order_id=order_number
        )

    async def send_order_status_update(
        self,
        db: Session,
        order_number: str,
        product_name: str,
        new_status: str,
        tracking_number: Optional[str] = None,
        recipient_phone: Optional[str] = None
    ) -> WhatsAppMessage:
        content = format_order_status_whatsapp(
            order_number=order_number,
            product_name=product_name,
            new_status=new_status,
            tracking_number=tracking_number
        )
        return await self.send_message(
            db=db,
            recipient_phone=recipient_phone or self.owner_phone,
            content=content,
            message_type="STATUS_UPDATE",
            template_name="globalbridge_status_update",
            order_id=order_number
        )

    async def send_low_stock_alert(
        self,
        db: Session,
        product_name: str,
        current_stock: int,
        threshold: int = 5,
        cluster_name: str = "Regional Cluster",
        product_id: Optional[int] = None,
        recipient_phone: Optional[str] = None
    ) -> WhatsAppMessage:
        content = format_low_stock_whatsapp(
            product_name=product_name,
            current_stock=current_stock,
            threshold=threshold,
            cluster_name=cluster_name
        )
        return await self.send_message(
            db=db,
            recipient_phone=recipient_phone or self.owner_phone,
            content=content,
            message_type="LOW_STOCK_ALERT",
            template_name="globalbridge_stock_alert",
            product_id=product_id
        )

whatsapp_service = WhatsAppService()

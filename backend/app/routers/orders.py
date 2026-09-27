import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.entities import Order, OrderItem, Product, Notification
from app.schemas.pydantic_schemas import (
    OrderResponse, OrderCreate, OrderStatusUpdate
)
from app.services.inventory_service import decrement_inventory_for_order
from app.whatsapp.client import whatsapp_service

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def generate_order_number(db: Session) -> str:
    count = db.query(Order).count() + 1
    return f"GB-2026-{count:05d}"

@router.get("", response_model=List[OrderResponse])
def list_orders(
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if status and status != "ALL":
        query = query.filter(Order.order_status == status)
    return query.order_by(desc(Order.created_at)).limit(limit).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/by-number/{order_number}", response_model=OrderResponse)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("", response_model=OrderResponse)
async def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    order_number = generate_order_number(db)
    
    # Calculate item totals and verify products
    total_amount = 0.0
    order_items_to_create = []
    decrement_tuples = []

    for item_in in order_in.items:
        product = db.query(Product).filter(Product.id == item_in.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {item_in.product_id} not found")
        
        # Check stock availability
        if product.available_stock < item_in.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.product_name}'. Requested: {item_in.quantity}, Available: {product.available_stock}"
            )

        unit_price = product.target_price
        # If order meets MOQ bulk discount tier, use wholesale price
        if item_in.quantity >= product.minimum_order_quantity:
            unit_price = product.wholesale_price

        item_total = unit_price * item_in.quantity
        total_amount += item_total

        order_items_to_create.append({
            "product_id": product.id,
            "product_name": product.product_name,
            "quantity": item_in.quantity,
            "unit_price": unit_price,
            "total_price": item_total
        })
        decrement_tuples.append((product.id, item_in.quantity))

    # Create Order
    new_order = Order(
        order_number=order_number,
        buyer_name=order_in.buyer_name,
        buyer_company=order_in.buyer_company,
        buyer_email=order_in.buyer_email,
        buyer_phone=order_in.buyer_phone,
        destination_country=order_in.destination_country,
        destination_address=order_in.destination_address,
        city=order_in.city,
        postal_code=order_in.postal_code,
        total_amount=round(total_amount, 2),
        currency="USD",
        payment_status="PAID",
        payment_method=order_in.payment_method,
        shipping_method=order_in.shipping_method,
        order_status="PENDING",
        tracking_number=f"EXP-{order_number.replace('GB-', '')}",
        notes=order_in.notes
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Create OrderItems
    for oi in order_items_to_create:
        item_obj = OrderItem(
            order_id=new_order.id,
            product_id=oi["product_id"],
            product_name=oi["product_name"],
            quantity=oi["quantity"],
            unit_price=oi["unit_price"],
            total_price=oi["total_price"]
        )
        db.add(item_obj)
    db.commit()
    db.refresh(new_order)

    # Perform inventory decrement, trigger owner notification and WhatsApp alert
    await decrement_inventory_for_order(db=db, order=new_order, items_data=decrement_tuples)

    return new_order

@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.order_status
    new_status = status_in.order_status.upper()
    order.order_status = new_status

    if status_in.tracking_number:
        order.tracking_number = status_in.tracking_number
    if status_in.notes:
        order.notes = status_in.notes
    order.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(order)

    # Trigger WhatsApp status notification
    try:
        first_item = order.items[0] if order.items else None
        prod_name = first_item.product_name if first_item else "Handmade Export Order"
        
        await whatsapp_service.send_order_status_update(
            db=db,
            order_number=order.order_number,
            product_name=prod_name,
            new_status=new_status,
            tracking_number=order.tracking_number,
            recipient_phone=order.buyer_phone
        )
    except Exception as e:
        print(f"Error dispatching order status WhatsApp: {e}")

    # Create owner notification
    notif = Notification(
        user_id=1,
        title=f"Order Status Changed: {order.order_number}",
        message=f"Order {order.order_number} transitioned from {old_status} to {new_status}.",
        type="PAYMENT_UPDATE" if "PAID" in new_status else "NEW_ORDER",
        reference_id=order.order_number,
        reference_type="order"
    )
    db.add(notif)
    db.commit()

    return order

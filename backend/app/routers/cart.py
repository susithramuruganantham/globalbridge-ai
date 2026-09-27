from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.entities import CartItem, Product
from app.schemas.pydantic_schemas import (
    CartItemAdd, CartItemUpdate, CartItemResponse, CartSummaryResponse
)

router = APIRouter(prefix="/api/cart", tags=["Cart"])

@router.get("", response_model=CartSummaryResponse)
def get_cart(
    session_id: str = Query("default_session"),
    db: Session = Depends(get_db)
):
    items = db.query(CartItem).filter(CartItem.session_id == session_id).order_by(desc(CartItem.created_at)).all()
    
    cart_items_res = []
    subtotal = 0.0
    total_qty = 0

    for item in items:
        prod = item.product
        if not prod:
            continue
        
        # Calculate unit price based on quantity vs MOQ
        price = prod.target_price
        if item.quantity >= prod.minimum_order_quantity:
            price = prod.wholesale_price

        item_sub = round(price * item.quantity, 2)
        subtotal += item_sub
        total_qty += item.quantity

        cart_items_res.append({
            "id": item.id,
            "product_id": prod.id,
            "product": prod,
            "quantity": item.quantity,
            "unit_price": price,
            "subtotal": item_sub,
            "created_at": item.created_at
        })

    # Standard international craft shipping calculation ($25 flat + $5/item or free over $1000)
    shipping = 0.0 if subtotal > 1000.0 or total_qty == 0 else max(25.0, 15.0 + (total_qty * 3.5))
    tax = round(subtotal * 0.05, 2) # 5% export duties/tariff estimate
    total = round(subtotal + shipping + tax, 2)

    return {
        "items": cart_items_res,
        "total_items": total_qty,
        "subtotal": round(subtotal, 2),
        "estimated_shipping": round(shipping, 2),
        "estimated_tax": tax,
        "total": total
    }

@router.post("", response_model=CartItemResponse)
def add_to_cart(item_in: CartItemAdd, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.available_stock < item_in.quantity:
        raise HTTPException(status_code=400, detail=f"Cannot add {item_in.quantity} items. Available stock: {product.available_stock}")

    session_id = item_in.session_id or "default_session"
    existing = db.query(CartItem).filter(
        CartItem.session_id == session_id,
        CartItem.product_id == item_in.product_id
    ).first()

    if existing:
        new_qty = existing.quantity + item_in.quantity
        if product.available_stock < new_qty:
            raise HTTPException(status_code=400, detail=f"Cannot exceed available stock of {product.available_stock}")
        existing.quantity = new_qty
        db.commit()
        db.refresh(existing)
        cart_item = existing
    else:
        cart_item = CartItem(
            session_id=session_id,
            product_id=product.id,
            quantity=item_in.quantity,
            unit_price=product.target_price
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)

    unit_price = product.wholesale_price if cart_item.quantity >= product.minimum_order_quantity else product.target_price
    return {
        "id": cart_item.id,
        "product_id": product.id,
        "product": product,
        "quantity": cart_item.quantity,
        "unit_price": unit_price,
        "subtotal": round(unit_price * cart_item.quantity, 2),
        "created_at": cart_item.created_at
    }

@router.put("/{cart_item_id}", response_model=CartItemResponse)
def update_cart_item(cart_item_id: int, update_in: CartItemUpdate, db: Session = Depends(get_db)):
    cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if update_in.quantity <= 0:
        db.delete(cart_item)
        db.commit()
        raise HTTPException(status_code=200, detail="Item removed")

    product = cart_item.product
    if product.available_stock < update_in.quantity:
        raise HTTPException(status_code=400, detail=f"Requested {update_in.quantity} exceeds available stock of {product.available_stock}")

    cart_item.quantity = update_in.quantity
    db.commit()
    db.refresh(cart_item)

    unit_price = product.wholesale_price if cart_item.quantity >= product.minimum_order_quantity else product.target_price
    return {
        "id": cart_item.id,
        "product_id": product.id,
        "product": product,
        "quantity": cart_item.quantity,
        "unit_price": unit_price,
        "subtotal": round(unit_price * cart_item.quantity, 2),
        "created_at": cart_item.created_at
    }

@router.delete("/{cart_item_id}")
def remove_from_cart(cart_item_id: int, db: Session = Depends(get_db)):
    cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(cart_item)
    db.commit()
    return {"message": "Cart item removed"}

@router.delete("")
def clear_cart(session_id: str = Query("default_session"), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.session_id == session_id).delete()
    db.commit()
    return {"message": "Cart cleared successfully"}

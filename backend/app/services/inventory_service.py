import datetime
from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.entities import Product, Inventory, Notification, Order, OrderItem
from app.whatsapp.client import whatsapp_service

async def decrement_inventory_for_order(
    db: Session,
    order: Order,
    items_data: List[Tuple[int, int]] # (product_id, quantity)
):
    """
    Decrements available stock for each ordered product,
    updates inventory tables, checks low-stock thresholds,
    and dispatches owner notifications and WhatsApp alerts.
    """
    for product_id, quantity in items_data:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            continue

        # Reduce stock
        old_stock = product.available_stock
        new_stock = max(0, product.available_stock - quantity)
        product.available_stock = new_stock
        product.stock_quantity = max(0, product.stock_quantity - quantity)
        product.updated_date = datetime.datetime.utcnow()

        # Update inventory record
        inv = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if inv:
            inv.available_stock = new_stock
            inv.total_stock = max(0, inv.total_stock - quantity)
            inv.updated_at = datetime.datetime.utcnow()

        db.commit()

        # Check low stock rules (<= 5 low stock, <= 2 critical)
        if new_stock <= 5:
            severity_str = "Critical Stock" if new_stock <= 2 else "Low Stock"
            notif_title = f"⚠️ {severity_str}: {product.product_name}"
            notif_msg = (
                f"Available inventory for '{product.product_name}' dropped to {new_stock} units "
                f"following order {order.order_number}. Cluster restock recommended."
            )
            
            # Create in-app notification
            notif = Notification(
                user_id=1,
                title=notif_title,
                message=notif_msg,
                type="LOW_STOCK",
                reference_id=str(product.id),
                reference_type="product"
            )
            db.add(notif)
            db.commit()

            # Trigger WhatsApp low stock alert
            try:
                await whatsapp_service.send_low_stock_alert(
                    db=db,
                    product_name=product.product_name,
                    current_stock=new_stock,
                    threshold=5,
                    cluster_name=product.artisan_cluster or "Regional Cluster",
                    product_id=product.id,
                    recipient_phone=product.seller_contact
                )
            except Exception as e:
                print(f"Error sending low stock WhatsApp: {e}")

    # Dispatch WhatsApp order notification for the new order
    try:
        first_item = order.items[0] if order.items else None
        prod_name = first_item.product_name if first_item else "Handcrafted Craft Goods"
        qty = sum(item.quantity for item in order.items) if order.items else 1

        await whatsapp_service.send_order_notification(
            db=db,
            order_number=order.order_number,
            product_name=prod_name,
            buyer_name=order.buyer_name,
            buyer_company=order.buyer_company,
            quantity=qty,
            unit_price=order.total_amount / max(1, qty),
            total_val=order.total_amount,
            destination=f"{order.destination_country} ({order.city or 'International'})"
        )
    except Exception as e:
        print(f"Error sending new order WhatsApp: {e}")

    # Create Owner notification for the new order
    order_notif = Notification(
        user_id=1,
        title=f"📦 New Wholesale Order Received: {order.order_number}",
        message=f"Buyer {order.buyer_name} ({order.buyer_company}) placed an export order worth ${order.total_amount:,.2f} {order.currency}.",
        type="NEW_ORDER",
        reference_id=order.order_number,
        reference_type="order"
    )
    db.add(order_notif)
    db.commit()

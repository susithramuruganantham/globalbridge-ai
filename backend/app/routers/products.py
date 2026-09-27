from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
import re

from app.database.session import get_db
from app.models.entities import Product, ProductImage, Inventory, Category, Artisan
from app.schemas.pydantic_schemas import (
    ProductResponse, ProductCreate, ProductUpdate, ProductListResponse
)

router = APIRouter(prefix="/api/products", tags=["Products"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

@router.get("", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    size: int = Query(24, ge=1, le=100),
    search: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    category: Optional[str] = None,
    sub_category: Optional[str] = None,
    craft_type: Optional[str] = None,
    gi_registered: Optional[bool] = None,
    verified_only: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: Optional[bool] = None,
    export_ready: Optional[bool] = None,
    sort_by: Optional[str] = Query("demand", pattern="^(demand|price_asc|price_desc|rating|popular|newest|stock)$"),
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.product_name.ilike(s),
                Product.short_description.ilike(s),
                Product.craft_type.ilike(s),
                Product.gi_tag.ilike(s),
                Product.district.ilike(s),
                Product.artisan_name.ilike(s),
                Product.tags.ilike(s)
            )
        )

    if state and state != "ALL":
        query = query.filter(Product.state == state)
    if district and district != "ALL":
        query = query.filter(Product.district == district)
    if category and category != "ALL":
        query = query.filter(Product.category == category)
    if sub_category:
        query = query.filter(Product.sub_category == sub_category)
    if craft_type:
        query = query.filter(Product.craft_type == craft_type)
    if gi_registered is True:
        query = query.filter(Product.gi_registration_status.in_(["GI_VERIFIED", "VERIFIED"]))
    if verified_only is True:
        query = query.filter(Product.verified_status == "VERIFIED")
    if min_price is not None:
        query = query.filter(Product.target_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.target_price <= max_price)
    if in_stock_only is True:
        query = query.filter(Product.available_stock > 0)
    if export_ready is True:
        query = query.filter(Product.export_eligibility == True)

    # Sorting
    if sort_by == "demand":
        query = query.order_by(desc(Product.global_demand_score))
    elif sort_by == "price_asc":
        query = query.order_by(asc(Product.target_price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Product.target_price))
    elif sort_by == "rating":
        query = query.order_by(desc(Product.rating))
    elif sort_by == "popular":
        query = query.order_by(desc(Product.buyer_count))
    elif sort_by == "newest":
        query = query.order_by(desc(Product.created_date))
    elif sort_by == "stock":
        query = query.order_by(desc(Product.available_stock))
    else:
        query = query.order_by(desc(Product.global_demand_score))

    total = query.count()
    offset = (page - 1) * size
    products = query.offset(offset).limit(size).all()
    pages = (total + size - 1) // size if size > 0 else 1

    return {
        "items": products,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }

@router.get("/search", response_model=List[ProductResponse])
def search_products(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    s = f"%{q.strip()}%"
    return db.query(Product).filter(
        or_(
            Product.product_name.ilike(s),
            Product.craft_type.ilike(s),
            Product.state.ilike(s),
            Product.district.ilike(s),
            Product.gi_tag.ilike(s),
            Product.tags.ilike(s)
        )
    ).limit(20).all()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Product.category).distinct().all()
    return [c[0] for c in categories if c[0]]

@router.get("/states")
def get_states(db: Session = Depends(get_db)):
    states = db.query(Product.state).distinct().all()
    return [s[0] for s in states if s[0]]

@router.get("/slug/{slug}", response_model=ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    slug = product_in.slug or slugify(product_in.product_name)
    # Ensure unique slug
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing:
        import uuid
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    prod_data = product_in.model_dump(exclude={"slug"})
    product = Product(
        slug=slug,
        reserved_stock=0,
        available_stock=product_in.stock_quantity,
        **prod_data
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    # Initialize inventory record
    inv = Inventory(
        product_id=product.id,
        total_stock=product.stock_quantity,
        available_stock=product.stock_quantity,
        reserved_stock=0
    )
    db.add(inv)

    # Add primary image if given
    if product.image_url:
        img = ProductImage(
            product_id=product.id,
            image_url=product.image_url,
            is_primary=True,
            sort_order=1
        )
        db.add(img)

    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    # Sync inventory if stock quantity was updated
    if "stock_quantity" in update_data:
        inv = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if inv:
            inv.total_stock = product.stock_quantity
            inv.available_stock = product.stock_quantity

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": f"Product '{product.product_name}' deleted successfully"}

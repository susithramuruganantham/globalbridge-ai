from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.entities import Artisan, Product
from app.schemas.pydantic_schemas import (
    ArtisanCreate, ArtisanResponse
)

router = APIRouter(prefix="/api/artisans", tags=["Artisans"])

@router.get("", response_model=List[ArtisanResponse])
def list_artisans(
    state: Optional[str] = None,
    craft_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Artisan)
    if state and state != "ALL":
        query = query.filter(Artisan.state == state)
    if craft_type:
        query = query.filter(Artisan.craft_type.ilike(f"%{craft_type}%"))
    return query.order_by(desc(Artisan.experience_years)).limit(limit).all()

@router.get("/{artisan_id}", response_model=ArtisanResponse)
def get_artisan(artisan_id: int, db: Session = Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found")
    return artisan

@router.post("", response_model=ArtisanResponse)
def register_artisan(artisan_in: ArtisanCreate, db: Session = Depends(get_db)):
    artisan = Artisan(**artisan_in.model_dump())
    db.add(artisan)
    db.commit()
    db.refresh(artisan)
    return artisan

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.session import engine, Base
from app.models.entities import *
from app.routers import (
    products, orders, cart, notifications,
    negotiations, intelligence, whatsapp, ai_chat, auth, artisans
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize all database tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="GlobalBridge.AI v3.0 API",
    description="Regional MSME Dialect & Trade Intelligence Platform API",
    version="3.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(cart.router)
app.include_router(notifications.router)
app.include_router(negotiations.router)
app.include_router(intelligence.router)
app.include_router(whatsapp.router)
app.include_router(ai_chat.router)
app.include_router(artisans.router)

# Mount uploads directory if exists
uploads_path = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

@app.get("/")
def root():
    return {
        "platform": "GlobalBridge.AI v3.0",
        "title": "Regional MSME Dialect & Trade Intelligence Platform",
        "tagline": "AI-Powered Digital Trade Operating System for Indian MSMEs & International Buyers",
        "status": "ONLINE",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": "3.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

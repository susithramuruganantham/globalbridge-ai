"""
Main Database Seed Script for GlobalBridge.AI v3.0
Seeds users, categories, artisans, 110+ unique products, inventory, demand insights, reviews, buyers, and demo orders.
"""

import os
import sys
import re
import random
import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.session import SessionLocal, engine, Base
from app.models.entities import (
    User, Artisan, Buyer, Category, Product, ProductImage, Inventory,
    Order, OrderItem, Notification, Negotiation, WhatsAppMessage,
    DemandInsight, Review
)
from app.services.auth_service import hash_password
from seed.seed_base import CATEGORIES, ARTISANS_DATA, BUYERS_DATA
from seed.seed_catalog import PRODUCTS_CATALOG
from seed.seed_catalog_part2 import CATALOG_PART2

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

def run_seed():
    print("============================================================")
    print("Initializing GlobalBridge.AI v3.0 Relational Database Tables")
    print("============================================================")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_products_count = db.query(Product).count()
        if existing_products_count >= 100:
            print(f"Database already seeded with {existing_products_count} products. Skipping duplicate seed.")
            return

        print("\n1. Seeding System Users & Roles...")
        users_to_create = [
            {
                "username": "admin", "email": "admin@globalbridge.ai",
                "password": "AdminPassword123!", "role": "ADMIN",
                "full_name": "GlobalBridge Platform Administrator",
                "company": "GlobalBridge International HQ", "phone": "+91 98765 00001"
            },
            {
                "username": "owner", "email": "owner@globalbridge.ai",
                "password": "OwnerPassword123!", "role": "MSME_OWNER",
                "full_name": "Senthil Kumar (MSME Cluster Lead)",
                "company": "Tamil Nadu & Deccan Craft Consortium", "phone": "+91 98765 43210"
            },
            {
                "username": "artisan", "email": "artisan@globalbridge.ai",
                "password": "ArtisanPassword123!", "role": "ARTISAN",
                "full_name": "K. Sundaramoorthy (Master Weaver)",
                "company": "Kanchipuram Silk Guild", "phone": "+91 94432 11001"
            },
            {
                "username": "buyer", "email": "buyer@globalbridge.ai",
                "password": "BuyerPassword123!", "role": "BUYER",
                "full_name": "Jonathan Tan (Senior Procurement)",
                "company": "Singapore Wholesale Imports Pte Ltd", "phone": "+65 6789 0123"
            }
        ]

        created_users = {}
        for u_data in users_to_create:
            existing = db.query(User).filter(User.username == u_data["username"]).first()
            if not existing:
                user = User(
                    username=u_data["username"],
                    email=u_data["email"],
                    hashed_password=hash_password(u_data["password"]),
                    role=u_data["role"],
                    full_name=u_data["full_name"],
                    company=u_data["company"],
                    phone=u_data["phone"]
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                created_users[u_data["username"]] = user
            else:
                created_users[u_data["username"]] = existing
        print(f"   [OK] Seeded {len(created_users)} system users with roles (Admin, MSME Owner, Artisan, Buyer)")

        print("\n2. Seeding Categories...")
        category_map = {}
        for cat in CATEGORIES:
            existing = db.query(Category).filter(Category.slug == cat["slug"]).first()
            if not existing:
                cat_obj = Category(
                    name=cat["name"],
                    slug=cat["slug"],
                    icon=cat["icon"],
                    description=cat["desc"],
                    state_primary=cat["state"]
                )
                db.add(cat_obj)
                db.commit()
                db.refresh(cat_obj)
                category_map[cat["name"]] = cat_obj
            else:
                category_map[cat["name"]] = existing
        print(f"   [OK] Seeded {len(category_map)} standard craft categories")

        print("\n3. Seeding 20+ Master Artisan Profiles...")
        artisan_map = {}
        for art in ARTISANS_DATA:
            existing = db.query(Artisan).filter(Artisan.name == art["name"]).first()
            if not existing:
                art_obj = Artisan(
                    user_id=created_users.get("artisan", None).id if created_users.get("artisan") else 1,
                    name=art["name"],
                    business_name=art["business_name"],
                    state=art["state"],
                    district=art["district"],
                    city=art["city"],
                    cluster_name=art["cluster_name"],
                    craft_type=art["craft_type"],
                    gi_registration_no=art["gi_registration_no"],
                    experience_years=art["experience_years"],
                    artisan_count=art["artisan_count"],
                    story=art["story"],
                    contact_phone=art["contact_phone"],
                    whatsapp_number=art["whatsapp_number"],
                    avatar_url=art["avatar_url"],
                    verified_status=art["verified_status"]
                )
                db.add(art_obj)
                db.commit()
                db.refresh(art_obj)
                artisan_map[art["name"]] = art_obj
            else:
                artisan_map[art["name"]] = existing
        print(f"   [OK] Seeded {len(artisan_map)} authentic master artisan profiles across TN, UP, AP")

        print("\n4. Seeding Global Buyers...")
        buyer_list = []
        for b_data in BUYERS_DATA:
            existing = db.query(Buyer).filter(Buyer.company_name == b_data["company_name"]).first()
            if not existing:
                b_obj = Buyer(
                    user_id=created_users.get("buyer", None).id if created_users.get("buyer") else 1,
                    company_name=b_data["company_name"],
                    contact_name=b_data["contact_name"],
                    country=b_data["country"],
                    city=b_data["city"],
                    email=b_data["email"],
                    phone=b_data["phone"],
                    import_license=b_data["import_license"],
                    annual_volume_usd=b_data["annual_volume_usd"],
                    preferred_categories=b_data["preferred_categories"],
                    verified=b_data["verified"]
                )
                db.add(b_obj)
                db.commit()
                db.refresh(b_obj)
                buyer_list.append(b_obj)
            else:
                buyer_list.append(existing)
        print(f"   [OK] Seeded {len(buyer_list)} international wholesale buyers")

        print("\n5. Seeding 110+ Unique Realistic Products with 46 fields...")
        all_raw_products = PRODUCTS_CATALOG + CATALOG_PART2
        total_seeded = 0

        # Review templates
        sample_reviews = [
            ("Jonathan Tan", "Singapore", 5.0, "Exquisite craftsmanship! The GI tag documentation and packaging made customs clearance in Singapore seamless."),
            ("Elena Weber", "Germany", 5.0, "Unmatched quality and authenticity. The master weaver story resonated tremendously with our European retail buyers."),
            ("Marcus Vance", "USA", 4.9, "Consistent dimensions and superior material finish. We increased our recurring wholesale order."),
            ("Tariq Al-Mansoor", "UAE", 5.0, "Royal grade elegance. Truly museum quality artisan work delivered on schedule."),
            ("Charlotte Hughes", "UK", 4.8, "Superb sustainable packaging and authentic provenance. Our boutique clients love this piece.")
        ]

        for p_data in all_raw_products:
            # Check unique slug
            base_slug = slugify(p_data["product_name"])
            existing = db.query(Product).filter(Product.slug == base_slug).first()
            if existing:
                continue

            # Resolve Category and Artisan relationships
            cat_obj = category_map.get(p_data["category"])
            cat_id = cat_obj.id if cat_obj else None

            art_obj = artisan_map.get(p_data["artisan_name"])
            art_id = art_obj.id if art_obj else None

            prod = Product(
                product_name=p_data["product_name"],
                slug=base_slug,
                short_description=p_data.get("short_description", p_data["heritage_story"][:140] + "..."),
                detailed_description=p_data.get("detailed_description", f"{p_data['heritage_story']} {p_data['artisan_story']}"),
                state=p_data["state"],
                district=p_data["district"],
                city=p_data["city"],
                artisan_cluster=p_data["artisan_cluster"],
                artisan_name=p_data["artisan_name"],
                artisan_id=art_id,
                category_id=cat_id,
                category=p_data["category"],
                sub_category=p_data.get("sub_category", "Artisanal Crafts"),
                craft_type=p_data["craft_type"],
                gi_tag=p_data.get("gi_tag"),
                gi_registration_status=p_data.get("gi_registration_status", "GI_VERIFIED"),
                verified_status=p_data.get("verified_status", "VERIFIED"),
                target_price=p_data["target_price"],
                minimum_price=p_data["minimum_price"],
                wholesale_price=p_data["wholesale_price"],
                currency="USD",
                stock_quantity=p_data["stock_quantity"],
                reserved_stock=0,
                available_stock=p_data["stock_quantity"],
                minimum_order_quantity=p_data["minimum_order_quantity"],
                unit=p_data.get("unit", "Piece"),
                production_time=p_data.get("production_time", "14-21 Days"),
                material=p_data["material"],
                technique=p_data["technique"],
                origin=p_data["origin"],
                heritage_story=p_data["heritage_story"],
                artisan_story=p_data["artisan_story"],
                sustainability_information=p_data["sustainability_information"],
                quality_grade=p_data.get("quality_grade", "Master Craftsman Grade A+"),
                export_eligibility=p_data.get("export_eligibility", True),
                export_markets=p_data.get("export_markets", "USA, Singapore, UAE, Germany, UK, Australia"),
                global_demand_score=p_data.get("globalDemandScore", 88.0),
                buyer_interest_score=p_data.get("buyerInterestScore", 90.0),
                rating=p_data.get("rating", 4.8),
                review_count=p_data.get("review_count", 32),
                buyer_count=p_data.get("buyer_count", 15),
                estimated_delivery_days=p_data.get("estimated_delivery_days", 10),
                shipping_available=True,
                wholesale_available=True,
                bulk_discount=p_data.get("bulk_discount", "5% for 20+ units, 12% for 50+ units"),
                hs_code=p_data.get("hs_code", "5007.20.00"),
                payment_terms=p_data.get("payment_terms", "30% Advance, 70% LC / TT on BL"),
                tags=p_data.get("tags", "Handmade, GI Tag, Sustainable, Export Ready"),
                seller_contact=p_data.get("seller_contact", "+91 94432 11001"),
                whatsapp_enabled=True,
                image_url=p_data.get("image_url")
            )
            db.add(prod)
            db.commit()
            db.refresh(prod)

            # 1. Create ProductImage
            p_img = ProductImage(
                product_id=prod.id,
                image_url=prod.image_url or "/products/default-craft.svg",
                is_primary=True,
                alt_text=prod.product_name,
                sort_order=1
            )
            db.add(p_img)

            # Secondary image variant
            p_img2 = ProductImage(
                product_id=prod.id,
                image_url=prod.image_url or "/products/default-craft.svg",
                is_primary=False,
                alt_text=f"{prod.product_name} - Detail Close Up",
                sort_order=2
            )
            db.add(p_img2)

            # 2. Create Inventory
            inv = Inventory(
                product_id=prod.id,
                total_stock=prod.stock_quantity,
                reserved_stock=0,
                available_stock=prod.available_stock,
                low_stock_threshold=5,
                critical_stock_threshold=2,
                restock_date="Next production batch in 15 days"
            )
            db.add(inv)

            # 3. Create DemandInsight
            demand_growth = round(random.uniform(10.5, 24.8), 1)
            insight = DemandInsight(
                product_id=prod.id,
                global_demand_score=prod.global_demand_score,
                growth_rate=demand_growth,
                top_countries=prod.export_markets,
                projected_volume=prod.stock_quantity * 8,
                seasonality_factor="High International Q3-Q4 Festival Traction",
                target_market_fit="High Affinity in Luxury Fair-Trade Retail Corridors"
            )
            db.add(insight)

            # 4. Create 2 Verified Reviews per product
            for r_user, r_country, r_rating, r_comm in random.sample(sample_reviews, 2):
                rev = Review(
                    product_id=prod.id,
                    reviewer_name=r_user,
                    country=r_country,
                    rating=r_rating,
                    comment=r_comm,
                    verified_purchase=True
                )
                db.add(rev)

            db.commit()
            total_seeded += 1

        print(f"   [OK] Successfully seeded {total_seeded} unique authentic products across TN, UP, AP")

        print("\n6. Seeding Demo Export Orders, Notifications & WhatsApp Logs...")
        # Get a couple products to create demo orders
        sample_prods = db.query(Product).order_by(Product.id.asc()).limit(6).all()
        if sample_prods:
            demo_orders_data = [
                {
                    "num": "GB-2026-00001", "buyer": buyer_list[0], "status": "DELIVERED",
                    "items": [(sample_prods[0], 10)], "pay_status": "PAID",
                    "dest": "Singapore (Changi Logistics Hub)"
                },
                {
                    "num": "GB-2026-00002", "buyer": buyer_list[1], "status": "SHIPPED",
                    "items": [(sample_prods[1], 15), (sample_prods[2], 8)], "pay_status": "PAID",
                    "dest": "USA (JFK Port New York)"
                },
                {
                    "num": "GB-2026-00003", "buyer": buyer_list[2], "status": "PROCESSING",
                    "items": [(sample_prods[3], 6)], "pay_status": "PAID",
                    "dest": "Germany (Hamburg Port)"
                },
                {
                    "num": "GB-2026-00004", "buyer": buyer_list[3], "status": "CONFIRMED",
                    "items": [(sample_prods[4], 12)], "pay_status": "PAID",
                    "dest": "Australia (Port Jackson Sydney)"
                },
                {
                    "num": "GB-2026-00005", "buyer": buyer_list[0], "status": "PENDING",
                    "items": [(sample_prods[0], 20)], "pay_status": "PENDING",
                    "dest": "Singapore Wholesale Depot"
                }
            ]

            for ord_info in demo_orders_data:
                b = ord_info["buyer"]
                tot_amount = sum(p.wholesale_price * q for p, q in ord_info["items"])
                new_order = Order(
                    order_number=ord_info["num"],
                    buyer_id=b.id,
                    buyer_name=b.contact_name,
                    buyer_company=b.company_name,
                    buyer_email=b.email,
                    buyer_phone=b.phone,
                    destination_country=b.country,
                    destination_address=ord_info["dest"],
                    city=b.city,
                    postal_code="50001",
                    total_amount=round(tot_amount, 2),
                    currency="USD",
                    payment_status=ord_info["pay_status"],
                    payment_method="Letter of Credit (LC)",
                    shipping_method="Air Cargo Express",
                    order_status=ord_info["status"],
                    tracking_number=f"EXP-{ord_info['num'].replace('GB-', '')}",
                    notes="Official GI verification documentation attached"
                )
                db.add(new_order)
                db.commit()
                db.refresh(new_order)

                for p_item, q_item in ord_info["items"]:
                    oi = OrderItem(
                        order_id=new_order.id,
                        product_id=p_item.id,
                        product_name=p_item.product_name,
                        quantity=q_item,
                        unit_price=p_item.wholesale_price,
                        total_price=round(p_item.wholesale_price * q_item, 2)
                    )
                    db.add(oi)
                db.commit()

                # Seed corresponding owner notification
                notif = Notification(
                    user_id=1,
                    title=f"📦 Export Order Received: {new_order.order_number}",
                    message=f"Buyer {new_order.buyer_name} ({new_order.buyer_company}) placed wholesale order of ${new_order.total_amount:,.2f} USD.",
                    type="NEW_ORDER",
                    reference_id=new_order.order_number,
                    reference_type="order",
                    is_read=ord_info["status"] == "DELIVERED"
                )
                db.add(notif)

                # Seed corresponding WhatsApp message in log
                first_p = ord_info["items"][0][0]
                first_q = ord_info["items"][0][1]
                wa_content = (
                    "━━━━━━━━━━━━━━━━━━━━\n"
                    "📦 *NEW ORDER — GlobalBridge.AI*\n\n"
                    f"*Order ID:* {new_order.order_number}\n"
                    f"*Product:* {first_p.product_name}\n"
                    f"*Buyer:* {new_order.buyer_name} ({new_order.buyer_company})\n"
                    f"*Quantity:* {first_q} units\n"
                    f"*Unit Price:* ${first_p.wholesale_price:,.2f}\n"
                    f"*Order Value:* ${new_order.total_amount:,.2f} USD\n"
                    f"*Destination:* {new_order.destination_country}\n"
                    "*Payment:* Confirmed / Letter of Credit\n"
                    f"*Status:* {new_order.order_status}\n\n"
                    "👉 Open GlobalBridge dashboard to manage this export order.\n"
                    "━━━━━━━━━━━━━━━━━━━━"
                )
                wa_msg = WhatsAppMessage(
                    recipient_phone="+919876543210",
                    recipient_name="MSME Cluster Owner",
                    message_type="ORDER_NOTIFICATION",
                    template_name="globalbridge_order_alert",
                    content=wa_content,
                    status="SIMULATED",
                    is_simulated=True,
                    order_id=new_order.order_number,
                    product_id=first_p.id
                )
                db.add(wa_msg)
                db.commit()

            print(f"   [OK] Seeded {len(demo_orders_data)} realistic international wholesale orders with WhatsApp logs")

        print("\n============================================================")
        print("DATABASE SEED COMPLETED SUCCESSFULLY!")
        print(f"Total Products in DB: {db.query(Product).count()}")
        print(f"Tamil Nadu Products: {db.query(Product).filter(Product.state == 'Tamil Nadu').count()}")
        print(f"Uttar Pradesh Products: {db.query(Product).filter(Product.state == 'Uttar Pradesh').count()}")
        print(f"Andhra Pradesh Products: {db.query(Product).filter(Product.state == 'Andhra Pradesh').count()}")
        print("============================================================")

    except Exception as e:
        db.rollback()
        print(f"ERROR DURING SEED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()

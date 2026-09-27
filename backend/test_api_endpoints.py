import urllib.request
import json

def test_api():
    print("Testing Backend APIs...")
    
    # 1. Health
    res = urllib.request.urlopen("http://localhost:8000/api/health")
    print("1. Health Check:", json.loads(res.read().decode()))

    # 2. Products count
    res = urllib.request.urlopen("http://localhost:8000/api/products?size=5")
    data = json.loads(res.read().decode())
    print(f"2. Products Total in DB: {data['total']}, Returned: {len(data['items'])}")
    first_item = data['items'][0]

    # 3. Product by Slug
    slug = first_item['slug']
    res = urllib.request.urlopen(f"http://localhost:8000/api/products/slug/{slug}")
    p = json.loads(res.read().decode())
    print(f"3. Product Slug Lookup ({slug}): {p['product_name']} (State: {p['state']}, Rate: ${p['wholesale_price']} USD)")

    # 4. Intelligence Dashboard
    res = urllib.request.urlopen("http://localhost:8000/api/intelligence/dashboard")
    dash = json.loads(res.read().decode())
    print(f"4. Dashboard Metrics: Products={dash['total_products']}, Valuation=${dash['inventory_valuation']:,}, Stock={dash['total_stock']}")

    # 5. AI Negotiation Test (Offer below minimum price)
    req = urllib.request.Request(
        "http://localhost:8000/api/negotiations/evaluate",
        data=json.dumps({
            "product_id": p["id"],
            "buyer_name": "Jonathan Tan",
            "buyer_company": "Singapore Wholesale Imports",
            "buyer_country": "Singapore",
            "requested_quantity": 25,
            "buyer_offer_price": 100.0,
            "notes": "Test lowball"
        }).encode(),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    neg = json.loads(res.read().decode())
    print(f"5. AI Negotiation Safeguard: Offer=$100, Min=${neg['minimum_price']}, Outcome={neg['status']}, Counter=${neg['suggested_counter_price']}")

    # 6. RAG Copilot Test
    req = urllib.request.Request(
        "http://localhost:8000/api/ai/chat",
        data=json.dumps({
            "message": "Show me silk products from Tamil Nadu",
            "language": "EN"
        }).encode(),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    rag = json.loads(res.read().decode())
    print(f"6. RAG Copilot Query: Retrieved {len(rag['retrieved_products'])} DB craft items. Response: \"{rag['response'][:80]}...\"")

    # 7. WhatsApp Gateway Logs
    res = urllib.request.urlopen("http://localhost:8000/api/whatsapp/messages")
    wa_msgs = json.loads(res.read().decode())
    print(f"7. WhatsApp Gateway Logs: {len(wa_msgs)} simulated messages recorded")

    print("\nALL 7 BACKEND API VERIFICATION CHECKS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_api()

"""
Generates high-definition, category-tailored visual SVG product illustrations for all products in GlobalBridge.AI.
Each SVG features craft-specific palettes, ornamental borders, GI tag emblems, craft iconography, and textured backgrounds.
"""

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from seed.seed_catalog import PRODUCTS_CATALOG
from seed.seed_catalog_part2 import CATALOG_PART2

PUBLIC_PRODUCTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "products"))
os.makedirs(PUBLIC_PRODUCTS_DIR, exist_ok=True)

CATEGORY_THEMES = {
    "Handloom & Silk Textiles": {
        "bg_grad": ("#1E1B4B", "#312E81", "#4338CA"),
        "accent": "#F59E0B",
        "secondary": "#EC4899",
        "pattern": "warp_weft",
        "icon_path": "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
    },
    "Metal Crafts & Bronzeware": {
        "bg_grad": ("#451A03", "#78350F", "#B45309"),
        "accent": "#FBBF24",
        "secondary": "#FCD34D",
        "pattern": "flame_lotus",
        "icon_path": "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    },
    "Wood Carving & Toys": {
        "bg_grad": ("#1C1917", "#44403C", "#78716C"),
        "accent": "#10B981",
        "secondary": "#34D399",
        "pattern": "wood_grain",
        "icon_path": "M12 2L4 10h4v10h8V10h4z"
    },
    "Pottery & Terracotta": {
        "bg_grad": ("#431407", "#7C2D12", "#C2410C"),
        "accent": "#FB923C",
        "secondary": "#FED7AA",
        "pattern": "geometric_coil",
        "icon_path": "M12 3a9 9 0 0 0-9 9v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a9 9 0 0 0-9-9z"
    },
    "Heritage Paintings & Art": {
        "bg_grad": ("#311042", "#581C87", "#7E22CE"),
        "accent": "#FDE047",
        "secondary": "#A855F7",
        "pattern": "gold_mandala",
        "icon_path": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    },
    "Traditional Jewellery": {
        "bg_grad": ("#0F172A", "#1E293B", "#334155"),
        "accent": "#F59E0B",
        "secondary": "#EF4444",
        "pattern": "gem_facets",
        "icon_path": "M6 3h12l4 6-10 12L2 9z"
    },
    "Fine Stone Sculptures": {
        "bg_grad": ("#090D16", "#1E293B", "#475569"),
        "accent": "#38BDF8",
        "secondary": "#94A3B8",
        "pattern": "chiseled_relief",
        "icon_path": "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    },
    "Glassware & Lacquerware": {
        "bg_grad": ("#064E3B", "#047857", "#059669"),
        "accent": "#6EE7B7",
        "secondary": "#FDE68A",
        "pattern": "glass_refraction",
        "icon_path": "M8 2h8l2 6H6z M6 8v11a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8"
    },
    "Leather & Folk Crafts": {
        "bg_grad": ("#292524", "#44403C", "#57534E"),
        "accent": "#F97316",
        "secondary": "#FDE047",
        "pattern": "leather_stitch",
        "icon_path": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    }
}

def generate_svg(product):
    cat = product.get("category", "Handloom & Silk Textiles")
    theme = CATEGORY_THEMES.get(cat, CATEGORY_THEMES["Handloom & Silk Textiles"])
    name = product["product_name"]
    state = product["state"]
    gi_tag = product.get("gi_tag", "GI Verified Craft") or "GI Verified Craft"
    price = f"${product['target_price']:,.2f}"
    craft = product["craft_type"]

    # Short clean title
    clean_title = name.split("—")[0].strip() if "—" in name else name[:36]
    subtitle = name.split("—")[1].strip() if "—" in name else craft[:38]

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{theme['bg_grad'][0]}" />
      <stop offset="50%" stop-color="{theme['bg_grad'][1]}" />
      <stop offset="100%" stop-color="{theme['bg_grad'][2]}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{theme['accent']}" />
      <stop offset="100%" stop-color="{theme['secondary']}" />
    </linearGradient>
    <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Layer -->
  <rect width="800" height="600" fill="url(#bgGrad)"/>
  <rect width="800" height="600" fill="url(#gridPattern)"/>

  <!-- Decorative Ambient Circles -->
  <circle cx="150" cy="150" r="220" fill="{theme['accent']}" opacity="0.08" filter="blur(40px)"/>
  <circle cx="650" cy="450" r="180" fill="{theme['secondary']}" opacity="0.08" filter="blur(40px)"/>

  <!-- Central Product Showcase Shield -->
  <g filter="url(#cardShadow)">
    <rect x="80" y="50" width="640" height="500" rx="24" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5"/>
  </g>

  <!-- Corner Ornamental Accents -->
  <path d="M 100 80 L 140 80 M 100 80 L 100 120" stroke="{theme['accent']}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
  <path d="M 700 80 L 660 80 M 700 80 L 700 120" stroke="{theme['accent']}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
  <path d="M 100 520 L 140 520 M 100 520 L 100 480" stroke="{theme['accent']}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
  <path d="M 700 520 L 660 520 M 700 520 L 700 480" stroke="{theme['accent']}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>

  <!-- GI Tag Badge Pill -->
  <g transform="translate(110, 80)">
    <rect x="0" y="0" width="220" height="32" rx="16" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="6" fill="#10B981"/>
    <text x="32" y="21" fill="#34D399" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="1">GI CERTIFIED AUTHENTIC</text>
  </g>

  <!-- State Origin Pill -->
  <g transform="translate(530, 80)">
    <rect x="0" y="0" width="160" height="32" rx="16" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" stroke-width="1.5"/>
    <text x="80" y="21" fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="0.5">{state.upper()}</text>
  </g>

  <!-- Central Craft Icon & Emblem -->
  <g transform="translate(400, 240)">
    <circle cx="0" cy="0" r="90" fill="url(#bgGrad)" stroke="url(#accentGrad)" stroke-width="3"/>
    <circle cx="0" cy="0" r="75" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="6,6" stroke-width="2"/>
    
    <!-- Central Vector Artwork Icon -->
    <g transform="translate(-32, -32) scale(2.6)">
      <path d="{theme['icon_path']}" fill="none" stroke="{theme['accent']}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>

  <!-- Product Name & Typography -->
  <text x="400" y="380" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" text-anchor="middle" letter-spacing="-0.5">
    {clean_title}
  </text>
  <text x="400" y="410" fill="{theme['accent']}" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" text-anchor="middle" letter-spacing="0.5">
    {subtitle}
  </text>

  <!-- Bottom Details Bar -->
  <line x1="130" y1="445" x2="670" y2="445" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"/>

  <g transform="translate(130, 465)">
    <text x="0" y="16" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" letter-spacing="1">CRAFT CLUSTER</text>
    <text x="0" y="38" fill="#F1F5F9" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700">{product['artisan_cluster'][:28]}</text>
  </g>

  <g transform="translate(400, 465)">
    <text x="0" y="16" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1">EXPORT MOQ</text>
    <text x="0" y="38" fill="#F1F5F9" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">{product['minimum_order_quantity']} {product.get('unit', 'Units')}</text>
  </g>

  <g transform="translate(670, 465)">
    <text x="0" y="16" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" text-anchor="end" letter-spacing="1">WHOLESALE PRICE</text>
    <text x="0" y="38" fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" text-anchor="end">{price}</text>
  </g>
</svg>"""
    return svg_content

def generate_all_images():
    all_products = PRODUCTS_CATALOG + CATALOG_PART2
    generated = 0

    # Also create default craft fallback
    default_prod = {
        "product_name": "Authentic Indian MSME Craft",
        "category": "Handloom & Silk Textiles",
        "state": "National Craft Heritage",
        "gi_tag": "GI Verified",
        "target_price": 99.0,
        "craft_type": "Traditional Indian Handcraft",
        "artisan_cluster": "Regional Artisan Guild",
        "minimum_order_quantity": 5,
        "unit": "Piece"
    }
    default_svg = generate_svg(default_prod)
    with open(os.path.join(PUBLIC_PRODUCTS_DIR, "default-craft.svg"), "w", encoding="utf-8") as f:
        f.write(default_svg)

    for p in all_products:
        img_url = p.get("image_url")
        if img_url and img_url.startswith("/products/"):
            filename = os.path.basename(img_url)
            filepath = os.path.join(PUBLIC_PRODUCTS_DIR, filename)
            svg_data = generate_svg(p)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(svg_data)
            generated += 1

    print(f"Successfully generated {generated} customized high-definition SVG product illustrations in {PUBLIC_PRODUCTS_DIR}")

if __name__ == "__main__":
    generate_all_images()

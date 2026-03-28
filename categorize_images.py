#!/usr/bin/env python3
"""
Categorize jewellery images by product code using OCR on bottom portion.
"""

import os
import re
import shutil
import json
from PIL import Image

# Try to import pytesseract
try:
    import pytesseract
    # Common Windows install paths
    for path in [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
        r'C:\Users\INTEL\AppData\Local\Programs\Tesseract-OCR\tesseract.exe',
    ]:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            break
    HAS_TESSERACT = True
    print("Tesseract found!")
except ImportError:
    HAS_TESSERACT = False
    print("pytesseract not installed, will use filename-based mapping only")

IMG_DIR = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\extracted"
OUT_BASE = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\products"

# Categories based on visual inspection + product code patterns
# Key: (page_start, page_end) -> category override if needed
# We'll derive category from visual type detection via OCR text keywords

CATEGORY_KEYWORDS = {
    "necklace": ["necklace", "haram"],
    "pendant": ["dollar", "pendant"],
    "earrings": ["earring", "jhumka", "jhumki", "jadau kundan", "jumka"],
    "bangles": ["bangle", "kada", "kada"],
    "maang-tikka": ["maang", "tikka", "mathapatti"],
    "anklet": ["anklet", "payal"],
    "bracelet": ["bracelet"],
    "ring": ["ring"],
}

# Visual inspection mapping from grids (page_file -> {code, category})
# Derived by carefully reading all 6 grid images
MANUAL_MAP = {
    # Grid 1 (pages 1-30) - Mostly Necklaces
    "page_001.jpg": {"code": "NK-26",  "category": "necklaces"},
    "page_002.jpg": {"code": "NK-55",  "category": "necklaces"},
    "page_003.jpg": {"code": "NK-50",  "category": "necklaces"},
    "page_004.jpg": {"code": "NK-55",  "category": "necklaces"},
    "page_005.jpg": {"code": "NK-55",  "category": "necklaces"},
    "page_006.jpg": {"code": "NK-55",  "category": "necklaces"},
    "page_007.jpg": {"code": "NK-50",  "category": "necklaces"},
    "page_008.jpg": {"code": "NK-50",  "category": "necklaces"},
    "page_009.jpg": {"code": "NK-38",  "category": "necklaces"},
    "page_010.jpg": {"code": "NK-55",  "category": "necklaces"},  # Reversible NK-55
    "page_011.jpg": {"code": "NK-32",  "category": "necklaces"},
    "page_012.jpg": {"code": "NK-45",  "category": "necklaces"},
    "page_013.jpg": {"code": "NK-12",  "category": "necklaces"},
    "page_014.jpg": {"code": "NK-56",  "category": "necklaces"},
    "page_015.jpg": {"code": "NK-28",  "category": "necklaces"},
    "page_016.jpg": {"code": "NK-10",  "category": "necklaces"},
    "page_017.jpg": {"code": "NK-10",  "category": "necklaces"},
    "page_018.jpg": {"code": "NK-12",  "category": "necklaces"},
    "page_019.jpg": {"code": "NK-10",  "category": "necklaces"},
    "page_020.jpg": {"code": "NK-50",  "category": "necklaces"},
    "page_021.jpg": {"code": "NK-42",  "category": "necklaces"},
    "page_022.jpg": {"code": "NK-42",  "category": "necklaces"},
    "page_023.jpg": {"code": "NK-42",  "category": "necklaces"},
    "page_024.jpg": {"code": "NK-36",  "category": "necklaces"},
    "page_025.jpg": {"code": "NK-50",  "category": "necklaces"},
    "page_026.jpg": {"code": "NK-30",  "category": "necklaces"},
    "page_027.jpg": {"code": "NK-30",  "category": "necklaces"},
    "page_028.jpg": {"code": "NK-25",  "category": "necklaces"},
    "page_029.jpg": {"code": "NK-30",  "category": "necklaces"},
    "page_030.jpg": {"code": "NK-25",  "category": "necklaces"},
    # Grid 2 (pages 31-60) - Pendants, Earrings, more Necklaces
    "page_031.jpg": {"code": "NK-8-Dollar",  "category": "pendants"},
    "page_032.jpg": {"code": "NK-8-Dollar",  "category": "pendants"},
    "page_033.jpg": {"code": "NK-8-Dollar",  "category": "pendants"},
    "page_034.jpg": {"code": "NK-50-Dollar", "category": "pendants"},
    "page_035.jpg": {"code": "NK-2",         "category": "earrings"},
    "page_036.jpg": {"code": "NK-125-Jadau", "category": "earrings"},
    "page_037.jpg": {"code": "NK-28",        "category": "earrings"},
    "page_038.jpg": {"code": "NK-45",        "category": "earrings"},
    "page_039.jpg": {"code": "NK-46",        "category": "earrings"},
    "page_040.jpg": {"code": "NK-146-Jadau", "category": "earrings"},
    "page_041.jpg": {"code": "NK-8-Dollar",  "category": "pendants"},
    "page_042.jpg": {"code": "NK-8-Dollar",  "category": "pendants"},
    "page_043.jpg": {"code": "NK-10-Dollar", "category": "pendants"},
    "page_044.jpg": {"code": "NK-25",        "category": "necklaces"},
    "page_045.jpg": {"code": "NK-30",        "category": "necklaces"},
    "page_046.jpg": {"code": "NK-34",        "category": "necklaces"},
    "page_047.jpg": {"code": "NK-28",        "category": "necklaces"},
    "page_048.jpg": {"code": "NK-39",        "category": "necklaces"},
    "page_049.jpg": {"code": "NK-12",        "category": "necklaces"},
    "page_050.jpg": {"code": "NK-10",        "category": "necklaces"},
    "page_051.jpg": {"code": "NK-12",        "category": "necklaces"},
    "page_052.jpg": {"code": "NK-12",        "category": "necklaces"},
    "page_053.jpg": {"code": "NK-54",        "category": "necklaces"},
    "page_054.jpg": {"code": "NK-25",        "category": "necklaces"},
    "page_055.jpg": {"code": "NK-25",        "category": "necklaces"},
    "page_056.jpg": {"code": "NK-25",        "category": "necklaces"},
    "page_057.jpg": {"code": "NK-46",        "category": "necklaces"},
    "page_058.jpg": {"code": "NK-50",        "category": "necklaces"},
    "page_059.jpg": {"code": "NK-50",        "category": "necklaces"},
    "page_060.jpg": {"code": "NK-55",        "category": "necklaces"},
    # Grid 3 (pages 61-90) - Harams, Long Necklaces, Maang Tikkas
    "page_061.jpg": {"code": "NK-55",  "category": "necklaces"},
    "page_062.jpg": {"code": "NK-57",  "category": "necklaces"},
    "page_063.jpg": {"code": "NK-57",  "category": "necklaces"},
    "page_064.jpg": {"code": "NK-72",  "category": "harams"},
    "page_065.jpg": {"code": "NK-72",  "category": "harams"},
    "page_066.jpg": {"code": "NK-62",  "category": "harams"},
    "page_067.jpg": {"code": "NK-40",  "category": "harams"},
    "page_068.jpg": {"code": "NK-55",  "category": "harams"},
    "page_069.jpg": {"code": "NK-60",  "category": "harams"},
    "page_070.jpg": {"code": "NK-60",  "category": "harams"},
    "page_071.jpg": {"code": "NK-57",  "category": "harams"},
    "page_072.jpg": {"code": "NK-70",  "category": "harams"},
    "page_073.jpg": {"code": "NK-24",  "category": "necklaces"},
    "page_074.jpg": {"code": "NK-27-Reversible", "category": "necklaces"},
    "page_075.jpg": {"code": "NK-19",  "category": "necklaces"},
    "page_076.jpg": {"code": "NK-19",  "category": "necklaces"},
    "page_077.jpg": {"code": "NK-19",  "category": "necklaces"},
    "page_078.jpg": {"code": "NK-20",  "category": "necklaces"},
    "page_079.jpg": {"code": "NK-39",  "category": "necklaces"},
    "page_080.jpg": {"code": "NK-39",  "category": "necklaces"},
    "page_081.jpg": {"code": "NK-39",  "category": "necklaces"},
    "page_082.jpg": {"code": "NK-26",  "category": "necklaces"},
    "page_083.jpg": {"code": "NK-26",  "category": "necklaces"},
    "page_084.jpg": {"code": "NK-26",  "category": "necklaces"},
    "page_085.jpg": {"code": "NK-54",  "category": "necklaces"},
    "page_086.jpg": {"code": "NK-54",  "category": "necklaces"},
    "page_087.jpg": {"code": "NK-54",  "category": "maang-tikka"},
    "page_088.jpg": {"code": "NK-50",  "category": "maang-tikka"},
    "page_089.jpg": {"code": "NK-48",  "category": "maang-tikka"},
    "page_090.jpg": {"code": "NK-50",  "category": "maang-tikka"},
    # Grid 4 (pages 91-120) - Necklaces continued
    "page_091.jpg": {"code": "NK-42",  "category": "maang-tikka"},
    "page_092.jpg": {"code": "NK-54",  "category": "necklaces"},
    "page_093.jpg": {"code": "NK-54",  "category": "necklaces"},
    "page_094.jpg": {"code": "NK-46",  "category": "earrings"},
    "page_095.jpg": {"code": "NK-10",  "category": "necklaces"},
    "page_096.jpg": {"code": "NK-60",  "category": "necklaces"},
    "page_097.jpg": {"code": "NK-64",  "category": "necklaces"},
    "page_098.jpg": {"code": "NK-50",  "category": "necklaces"},
    "page_099.jpg": {"code": "NK-42-Jadau", "category": "necklaces"},
    "page_100.jpg": {"code": "NK-28",  "category": "necklaces"},
    "page_101.jpg": {"code": "NK-22",  "category": "necklaces"},
    "page_102.jpg": {"code": "NK-25",  "category": "necklaces"},
    "page_103.jpg": {"code": "NK-28",  "category": "necklaces"},
    "page_104.jpg": {"code": "NK-50",  "category": "necklaces"},
    "page_105.jpg": {"code": "NK-41",  "category": "necklaces"},
    "page_106.jpg": {"code": "NK-42",  "category": "necklaces"},
    "page_107.jpg": {"code": "NK-28",  "category": "necklaces"},
    "page_108.jpg": {"code": "NK-28",  "category": "necklaces"},
    "page_109.jpg": {"code": "NK-22",  "category": "necklaces"},
    "page_110.jpg": {"code": "NK-22",  "category": "necklaces"},
    "page_111.jpg": {"code": "NK-40",  "category": "necklaces"},
    "page_112.jpg": {"code": "NK-26",  "category": "necklaces"},
    "page_113.jpg": {"code": "NK-28",  "category": "necklaces"},
    "page_114.jpg": {"code": "NK-26",  "category": "necklaces"},
    "page_115.jpg": {"code": "NK-25",  "category": "necklaces"},  # pastel beads
    "page_116.jpg": {"code": "NK-24",  "category": "necklaces"},
    "page_117.jpg": {"code": "NK-24",  "category": "necklaces"},
    "page_118.jpg": {"code": "NK-24",  "category": "necklaces"},
    "page_119.jpg": {"code": "NK-25",  "category": "necklaces"},  # multicolour
    "page_120.jpg": {"code": "NK-25",  "category": "necklaces"},  # multicolour
    # Grid 5 (pages 121-150) - Bangles, more necklaces
    "page_121.jpg": {"code": "NK-13",  "category": "necklaces"},
    "page_122.jpg": {"code": "NK-13",  "category": "necklaces"},
    "page_123.jpg": {"code": "NK-15",  "category": "bangles"},
    "page_124.jpg": {"code": "NK-10",  "category": "necklaces"},
    "page_125.jpg": {"code": "NK-18",  "category": "necklaces"},
    "page_126.jpg": {"code": "NK-19",  "category": "bangles"},
    "page_127.jpg": {"code": "NK-60",  "category": "bangles"},
    "page_128.jpg": {"code": "NK-19",  "category": "bangles"},
    "page_129.jpg": {"code": "NK-19",  "category": "bangles"},
    "page_130.jpg": {"code": "NK-18",  "category": "bangles"},
    "page_131.jpg": {"code": "NK-14",  "category": "bangles"},
    "page_132.jpg": {"code": "NK-14",  "category": "bangles"},
    "page_133.jpg": {"code": "NK-18",  "category": "necklaces"},
    "page_134.jpg": {"code": "NK-18",  "category": "bangles"},
    "page_135.jpg": {"code": "NK-40",  "category": "bangles"},
    "page_136.jpg": {"code": "NK-13",  "category": "bangles"},
    "page_137.jpg": {"code": "NK-18",  "category": "bangles"},
    "page_138.jpg": {"code": "NK-18",  "category": "bangles"},
    "page_139.jpg": {"code": "NK-18",  "category": "necklaces"},
    "page_140.jpg": {"code": "NK-18",  "category": "necklaces"},
    "page_141.jpg": {"code": "NK-13",  "category": "necklaces"},
    "page_142.jpg": {"code": "NK-24",  "category": "necklaces"},
    "page_143.jpg": {"code": "NK-13",  "category": "necklaces"},
    "page_144.jpg": {"code": "NK-19",  "category": "necklaces"},
    "page_145.jpg": {"code": "NK-14",  "category": "necklaces"},
    "page_146.jpg": {"code": "NK-14",  "category": "necklaces"},
    "page_147.jpg": {"code": "NK-19",  "category": "necklaces"},
    "page_148.jpg": {"code": "NK-13",  "category": "necklaces"},
    "page_149.jpg": {"code": "NK-15",  "category": "necklaces"},
    "page_150.jpg": {"code": "NK-35",  "category": "necklaces"},
    # Grid 6 (page 151)
    "page_151.jpg": {"code": "NK-12",  "category": "necklaces"},
}

def slugify(text):
    """Convert text to filename-safe slug."""
    return re.sub(r'[^a-z0-9\-]', '-', text.lower()).strip('-')

def organize_images():
    """Create categorized folders and copy images."""
    # Create output directories
    categories = set(v["category"] for v in MANUAL_MAP.values())
    for cat in categories:
        os.makedirs(os.path.join(OUT_BASE, cat), exist_ok=True)
    
    # Track usage counts for same code (multiple images per code)
    code_counters = {}
    inventory = {}
    
    for filename, info in sorted(MANUAL_MAP.items()):
        src = os.path.join(IMG_DIR, filename)
        if not os.path.exists(src):
            print(f"  MISSING: {src}")
            continue
        
        code = info["code"]
        category = info["category"]
        
        # Count occurrences to create unique filenames
        if code not in code_counters:
            code_counters[code] = 0
        code_counters[code] += 1
        count = code_counters[code]
        
        # Build output filename
        if count == 1:
            out_name = f"{code}.jpg"
        else:
            out_name = f"{code}-{count}.jpg"
        
        out_path = os.path.join(OUT_BASE, category, out_name)
        shutil.copy2(src, out_path)
        
        # Build inventory entry (only first image for each code as primary)
        if code not in inventory:
            inventory[code] = {
                "id": slugify(code),
                "code": code,
                "name": generate_name(code, category),
                "category": category,
                "images": [],
                "price": None,  # To be filled by user
                "inStock": True,
            }
        
        rel_path = f"/images/products/{category}/{out_name}"
        inventory[code]["images"].append(rel_path)
        
        print(f"  {filename} -> {category}/{out_name}")
    
    return inventory

def generate_name(code, category):
    """Generate a human-readable product name from code and category."""
    cat_names = {
        "necklaces": "Necklace",
        "harams": "Haram (Long Necklace)",
        "pendants": "Dollar Pendant",
        "earrings": "Earrings",
        "bangles": "Bangles",
        "maang-tikka": "Maang Tikka",
        "anklets": "Anklet",
        "bracelets": "Bracelet",
    }
    cat_name = cat_names.get(category, category.title())
    return f"{cat_name} {code}"

def write_inventory_js(inventory):
    """Write the inventory as a JS module."""
    out_path = r"C:\Users\INTEL\Desktop\Bilwashree jewels\data\products.js"
    
    products = list(inventory.values())
    
    # Sort by category then code
    products.sort(key=lambda x: (x["category"], x["code"]))
    
    lines = [
        "// Auto-generated product inventory",
        "// Prices are to be filled in by the store owner",
        "// Generated from allimages.pdf catalog",
        "",
        "export const products = [",
    ]
    
    for p in products:
        lines.append("  {")
        lines.append(f'    id: "{p["id"]}",')
        lines.append(f'    code: "{p["code"]}",')
        lines.append(f'    name: "{p["name"]}",')
        lines.append(f'    category: "{p["category"]}",')
        lines.append(f'    price: null, // TODO: Set price in INR')
        lines.append(f'    inStock: true,')
        lines.append(f'    images: [')
        for img in p["images"]:
            lines.append(f'      "{img}",')
        lines.append(f'    ],')
        lines.append("  },")
    
    lines.append("];")
    lines.append("")
    
    # Add category helpers
    lines += [
        "export const categories = [",
        '  { id: "all", name: "All Jewellery" },',
        '  { id: "necklaces", name: "Necklaces" },',
        '  { id: "harams", name: "Harams" },',
        '  { id: "pendants", name: "Dollar Pendants" },',
        '  { id: "earrings", name: "Earrings" },',
        '  { id: "bangles", name: "Bangles" },',
        '  { id: "maang-tikka", name: "Maang Tikka" },',
        "];",
        "",
        "export const getProductsByCategory = (categoryId) => {",
        '  if (categoryId === "all") return products;',
        "  return products.filter((p) => p.category === categoryId);",
        "};",
        "",
        "export const getProductByCode = (code) => {",
        "  return products.find((p) => p.code === code);",
        "};",
        "",
        "export const getProductById = (id) => {",
        "  return products.find((p) => p.id === id);",
        "};",
    ]
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    
    print(f"\nInventory written to: {out_path}")
    print(f"Total unique products: {len(products)}")
    
    # Also write a summary JSON for reference
    summary_path = r"C:\Users\INTEL\Desktop\Bilwashree jewels\data\products_summary.json"
    summary = {
        "total_unique_products": len(products),
        "total_images": sum(len(p["images"]) for p in products),
        "by_category": {},
        "products": [{"code": p["code"], "name": p["name"], "category": p["category"], "image_count": len(p["images"])} for p in products]
    }
    for p in products:
        cat = p["category"]
        summary["by_category"][cat] = summary["by_category"].get(cat, 0) + 1
    
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print(f"Summary written to: {summary_path}")

if __name__ == "__main__":
    print("=== Bilwashree Jewels Image Categorizer ===\n")
    print(f"Source: {IMG_DIR}")
    print(f"Output: {OUT_BASE}\n")
    
    os.makedirs(OUT_BASE, exist_ok=True)
    
    print("Organizing images...")
    inventory = organize_images()
    
    print("\nWriting inventory data...")
    write_inventory_js(inventory)
    
    print("\nDone! Summary:")
    cats = {}
    for v in MANUAL_MAP.values():
        cats[v["category"]] = cats.get(v["category"], 0) + 1
    for cat, count in sorted(cats.items()):
        print(f"  {cat}: {count} images")
    print(f"  TOTAL: {len(MANUAL_MAP)} images mapped")

"""
Categorize images from the NEW PDF (new,original images.pdf - 140 pages).
Maps each page to its correct product code and category based on visual inspection.
"""
import os
import shutil

# Source and destination
extracted_dir = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\extracted"
products_dir = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\products"

# Category folders
categories = {
    "necklaces": os.path.join(products_dir, "necklaces"),
    "earrings": os.path.join(products_dir, "earrings"),
    "bangles": os.path.join(products_dir, "bangles"),
    "pendants": os.path.join(products_dir, "pendants"),
    "accessories": os.path.join(products_dir, "accessories"),
    "harams": os.path.join(products_dir, "harams"),
}

# Create category directories
for cat_dir in categories.values():
    os.makedirs(cat_dir, exist_ok=True)

# ============================================================
# COMPLETE PAGE-TO-PRODUCT MAPPING (New PDF, 140 pages)
# Visually verified from thumbnail grids
# Format: page_number: ("product_code", "category", "variant_suffix")
# variant_suffix differentiates color/style variants of same product
# ============================================================
MANUAL_MAP = {
    # --- Grid 1: Pages 1-20 ---
    1:   ("NK-55", "necklaces", "choker-green"),        # Pearl chain choker, green stones
    2:   ("NK-50", "necklaces", "choker-red"),           # Pearl chain choker, red stones
    3:   ("NK-55", "necklaces", "choker-red"),           # Pearl chain choker, red stones
    4:   ("NK-55", "necklaces", "choker-pink"),          # Pearl chain choker, pink stones
    5:   ("NK-55", "necklaces", "choker-teal"),          # Pearl chain choker, teal stones
    6:   ("NK-50", "necklaces", "choker-rose"),          # Pearl chain choker, rose/light
    7:   ("NK-50", "necklaces", "choker-green"),         # Pearl chain choker, green
    8:   ("NK-40", "necklaces", "medium"),               # Temple necklace with green drops
    9:   ("NK-465", "harams", "jadau-kundan"),           # Jadau Kundan Reversible long haram
    10:  ("NK-32", "necklaces", "kasumala-red"),         # Coin necklace, ruby/red stones
    11:  ("NK-45", "necklaces", "medium"),               # Temple elephant motif necklace
    12:  ("NK-12", "earrings", "flower-pink"),           # CZ flower hook earrings, pink
    13:  ("NK-54", "necklaces", "medium"),               # Temple kemp necklace
    14:  ("NK-28", "necklaces", "kasumala"),             # Gold coin necklace, plain
    15:  ("NK-10", "earrings", "cz-climber"),            # CZ crystal ear climber
    16:  ("NK-10", "earrings", "cz-green"),              # CZ earrings with green stones
    17:  ("NK-12", "earrings", "flower-teal"),           # CZ flower hook earrings, teal/green
    18:  ("NK-10", "earrings", "cz-red"),                # CZ earrings with red stones
    19:  ("NK-10", "earrings", "cz-green2"),             # CZ earrings, green variant 2
    20:  ("NK-42", "harams", "long-coin"),               # Long antique coin haram

    # --- Grid 2: Pages 21-40 ---
    21:  ("NK-12", "earrings", "flower-violet"),         # CZ flower hook earrings, violet
    22:  ("Dollar NK-8", "pendants", "lakshmi-1"),       # Dollar/pendant - Lakshmi temple pendant
    23:  ("Dollar NK-10", "pendants", "lakshmi-2"),      # Dollar/pendant - Lakshmi pendant
    24:  ("NK-25", "earrings", "temple-jhumka"),         # Temple jhumka earrings pair
    25:  ("NK-125", "earrings", "jadau-stud"),           # Jadau Kundan round stud earrings
    26:  ("NK-28", "earrings", "temple-drop"),           # Temple dangler earrings with pearls
    27:  ("NK-45", "earrings", "temple-jhumka"),         # Temple style earrings, green
    28:  ("NK-46", "earrings", "cz-danglers"),           # CZ dangler earrings with chain
    29:  ("NK-146", "earrings", "jadau-jhumka"),         # Jadau Kundan jhumka earrings, emerald
    30:  ("Dollar NK-8", "pendants", "lakshmi-2"),       # Dollar/pendant - Lakshmi alternate
    31:  ("Dollar NK-8", "pendants", "lakshmi-3"),       # Dollar/pendant - Lakshmi large
    32:  ("Dollar NK-40", "pendants", "temple-large"),   # Dollar/pendant - Temple large
    33:  ("NK-25", "necklaces", "medium"),               # Short necklace with hanging drops
    34:  ("NK-30", "necklaces", "medium"),               # Choker/short necklace, green & ruby
    35:  ("NK-34", "necklaces", "medium"),               # Green paisley kemp necklace
    36:  ("NK-26", "necklaces", "kasumala"),             # Coin necklace with flower motifs
    37:  ("NK-36", "necklaces", "medium"),               # Pearl chain temple necklace, ruby
    38:  ("NK-12", "necklaces", "choker-flower"),        # Pearl flower choker chain
    39:  ("NK-10", "necklaces", "medium"),               # CZ necklace
    40:  ("NK-12", "earrings", "flower-purple"),         # CZ flower hook earrings, purple

    # --- Grid 3: Pages 41-60 ---
    41:  ("NK-12", "earrings", "cz-emerald"),            # CZ earrings, emerald green
    42:  ("NK-54", "necklaces", "medium-kemp"),          # Temple kemp necklace variant
    43:  ("NK-25", "necklaces", "medium-chain"),         # Chain necklace with pendant
    44:  ("NK-32", "necklaces", "kasumala-red2"),        # Coin necklace, red stones, hand photo
    45:  ("NK-32", "necklaces", "kasumala-green"),       # Coin necklace, green stones, hand photo
    46:  ("NK-45", "necklaces", "elephant"),             # Elephant temple necklace, green
    47:  ("NK-30", "necklaces", "medium-cz"),            # CZ necklace with green pendant
    48:  ("NK-50", "necklaces", "medium-purple"),        # CZ/pearl necklace, purple drops
    49:  ("NK-55", "necklaces", "medium-temple"),        # Temple gold necklace with drops
    50:  ("NK-55", "necklaces", "medium-temple-green"),  # Temple gold necklace, green beads
    51:  ("NK-57", "harams", "long-red"),                # Long haram, red beaded
    52:  ("NK-57", "harams", "long-green-red"),          # Long haram, green-red beaded
    53:  ("NK-72", "harams", "long-red"),                # Long bridal haram, red beaded
    54:  ("NK-72", "harams", "long-green"),              # Long bridal haram, green beaded
    55:  ("NK-62", "harams", "long-green"),              # Long haram, green beaded temple
    56:  ("NK-60", "harams", "long-red"),                # Long haram, red beaded
    57:  ("NK-57", "harams", "long-green"),              # Long haram, green beaded
    58:  ("NK-45", "necklaces", "medium-temple2"),       # Temple necklace, medium
    59:  ("NK-50", "harams", "long-green"),              # Long haram, green beaded pendant
    60:  ("NK-57", "harams", "long-green2"),             # Long haram, green variant 2

    # --- Grid 4: Pages 61-80 ---
    61:  ("NK-78", "harams", "long-red"),                # Long haram, red beaded
    62:  ("NK-24", "necklaces", "medium-kemp"),          # Medium necklace, kemp stones
    63:  ("NK-27", "necklaces", "reversible"),           # Reversible necklace, short chain
    64:  ("NK-19", "necklaces", "choker-pearl"),         # Pearl choker with kemp center
    65:  ("NK-19", "necklaces", "choker-pearl2"),        # Pearl choker, alternate view
    66:  ("NK-36", "necklaces", "medium-cz"),            # CZ chain bracelet/necklace
    67:  ("NK-20", "necklaces", "medium-coin"),          # Medium coin necklace
    68:  ("NK-39", "necklaces", "medium-kemp"),          # Temple coin necklace, kemp
    69:  ("NK-39", "necklaces", "medium-gold"),          # Temple coin necklace, gold
    70:  ("NK-39", "necklaces", "medium-green"),         # Temple coin necklace, green
    71:  ("NK-26", "necklaces", "medium-cz-ruby"),       # CZ ruby chain necklace
    72:  ("NK-26", "necklaces", "medium-cz-mixed"),      # CZ mixed color chain necklace
    73:  ("NK-26", "necklaces", "medium-cz-green"),      # CZ green chain necklace
    74:  ("NK-54", "accessories", "maang-tikka"),         # CZ layered maang tikka / matapatti
    75:  ("NK-54", "accessories", "maang-tikka2"),        # CZ maang tikka, alternate
    76:  ("NK-50", "accessories", "maang-tikka"),         # CZ maang tikka with ruby
    77:  ("NK-48", "accessories", "maang-tikka"),         # Pearl maang tikka
    78:  ("NK-50", "accessories", "maang-tikka2"),        # CZ maang tikka, alternate view
    79:  ("NK-42", "accessories", "maang-tikka"),         # Temple maang tikka layered
    80:  ("NK-54", "accessories", "anklet-payal"),        # Pearl CZ anklet pair

    # --- Grid 5: Pages 81-100 ---
    81:  ("NK-54", "necklaces", "medium-cz-layered"),    # CZ layered short necklace
    82:  ("NK-46", "earrings", "CZ-long"),               # CZ long earrings / ear chain
    83:  ("NK-18", "earrings", "cz-drop"),               # CZ drop earrings
    84:  ("NK-50", "necklaces", "medium-cz-green"),      # CZ necklace, green emerald
    85:  ("NK-40", "earrings", "leaf-ruby"),              # Leaf earrings, ruby
    86:  ("NK-50", "necklaces", "medium-cz-emerald"),    # CZ necklace, emerald large
    87:  ("NK-36", "accessories", "jadau-tikka"),         # Jadau Kundan tikka/pendant
    88:  ("NK-46", "necklaces", "medium-cz-multi"),      # CZ multi-stone necklace
    89:  ("NK-26", "necklaces", "medium-cz-pink"),       # CZ necklace, small ruby
    90:  ("NK-22", "necklaces", "flower-ruby"),           # Antique gold flower necklace
    91:  ("NK-55", "necklaces", "medium-flower-green"),  # Gold flower necklace, green
    92:  ("NK-26", "necklaces", "medium-cz-pendant"),    # CZ necklace with pendant
    93:  ("NK-20", "necklaces", "medium-cz"),             # CZ chain border necklace
    94:  ("NK-22", "necklaces", "flower-green"),          # Antique flower ruby necklace
    95:  ("NK-22", "necklaces", "flower-red"),            # Antique flower ruby necklace variant
    96:  ("NK-28", "necklaces", "medium-kemp"),          # Kemp stone temple necklace
    97:  ("NK-40", "necklaces", "medium-flower"),        # Gold flower necklace
    98:  ("NK-40", "necklaces", "medium-chain"),         # Gold chain necklace, border
    99:  ("NK-40", "necklaces", "medium-antique"),       # Antique necklace, round pendant
    100: ("NK-26", "necklaces", "medium-cz-ruby"),       # CZ ruby necklace with chain

    # --- Grid 6: Pages 101-120 ---
    101: ("NK-26", "necklaces", "medium-cz-ruby2"),      # CZ ruby choker
    102: ("NK-20", "necklaces", "medium-pendant"),       # Necklace with CZ pendant
    103: ("NK-40", "necklaces", "medium-emerald"),       # Emerald stone necklace
    104: ("NK-22", "necklaces", "hand-coin"),             # Gold coin necklace, hand photo
    105: ("NK-24", "harams", "long-chain"),               # Long chain haram
    106: ("NK-24", "necklaces", "medium-chain"),         # Chain necklace, ruby
    107: ("NK-24", "necklaces", "medium-pendant"),       # Chain necklace with pendant
    108: ("NK-25", "necklaces", "hand-kemp-red"),        # Kemp necklace, hand photo, red
    109: ("NK-25", "necklaces", "hand-kemp-green"),      # Kemp necklace, hand photo, green
    110: ("NK-18", "necklaces", "medium-chain-ruby"),    # Chain necklace with temple motifs
    111: ("NK-40", "necklaces", "meenakari-lotus"),      # Meenakari lotus necklace
    112: ("NK-15", "bangles", "temple-set"),              # Temple Lakshmi bangle set
    113: ("NK-10", "necklaces", "medium-chain"),         # Chain necklace, fine
    114: ("NK-18", "necklaces", "medium-temple"),        # Temple kemp necklace
    115: ("NK-19", "necklaces", "flower-kemp"),          # Flower kemp square necklace
    116: ("NK-40", "necklaces", "medium-temple2"),       # Temple necklace, medium
    117: ("NK-18", "bangles", "temple-bangle"),          # Temple bangle set, multi-stone
    118: ("NK-19", "bangles", "reverse-bangle"),         # Reversible bangles
    119: ("NK-18", "necklaces", "medium-collar"),        # Collar necklace, red
    120: ("NK-14", "bangles", "temple-kada"),             # Temple Lakshmi kada bangles

    # --- Grid 7: Pages 121-140 ---
    121: ("NK-60", "harams", "long-temple"),              # Long temple haram, green
    122: ("NK-18", "necklaces", "medium-emerald"),        # Temple necklace, emerald
    123: ("NK-18", "bangles", "temple-bangle2"),          # Temple bangles, gold coil
    124: ("NK-14", "bangles", "temple-kada2"),             # Temple kada bangles, large
    125: ("NK-14", "bangles", "temple-kada3"),             # Temple bangles, multi-color stone
    126: ("NK-18", "bangles", "temple-bangle3"),          # Temple bangles, green stones
    127: ("NK-18", "bangles", "temple-bangle4"),          # Temple bangles, red stones
    128: ("NK-18", "necklaces", "medium-temple2"),        # Temple necklace with drops
    129: ("NK-18", "necklaces", "medium-temple3"),        # Temple necklace
    130: ("NK-19", "necklaces", "meenakari"),             # Meenakari lotus necklace
    131: ("NK-24", "harams", "long-antique"),             # Long chain haram, antique
    132: ("NK-40", "necklaces", "meenakari-blue"),        # Meenakari blue coin necklace
    133: ("NK-19", "necklaces", "medium-chain2"),         # Chain necklace, gold
    134: ("NK-45", "necklaces", "medium-kemp"),           # Temple kemp necklace
    135: ("NK-45", "necklaces", "meenakari"),             # Meenakari lotus necklace
    136: ("NK-19", "necklaces", "flower-red"),            # Flower chain necklace, red
    137: ("NK-45", "necklaces", "meenakari-blue"),        # Meenakari blue necklace
    138: ("NK-13", "necklaces", "flower-mixed"),          # Flower chain necklace, mixed
    139: ("NK-45", "necklaces", "flower-red"),            # Red flower necklace
    140: ("NK-12", "necklaces", "choker-flower-red"),     # Pearl flower choker, red
}

def categorize_images():
    """Copy and rename all extracted page images to category folders."""
    stats = {"total": 0, "success": 0, "skipped": 0}
    product_images = {}  # Track which images go to which product
    
    for page_num, (product_code, category, variant) in MANUAL_MAP.items():
        page_file = f"page_{page_num:03d}.jpg"
        src_path = os.path.join(extracted_dir, page_file)
        
        if not os.path.exists(src_path):
            print(f"WARNING: {page_file} not found, skipping")
            stats["skipped"] += 1
            continue
        
        # Clean product code for filename
        clean_code = product_code.replace(" ", "-").lower()
        
        # Build destination filename
        dest_name = f"{clean_code}_{variant}.jpg"
        dest_path = os.path.join(categories[category], dest_name)
        
        shutil.copy2(src_path, dest_path)
        stats["success"] += 1
        stats["total"] += 1
        
        # Track for reporting
        key = f"{product_code} ({category})"
        if key not in product_images:
            product_images[key] = []
        product_images[key].append(dest_name)
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"CATEGORIZATION COMPLETE")
    print(f"{'='*60}")
    print(f"Total pages processed: {stats['total']}")
    print(f"Successfully copied: {stats['success']}")
    print(f"Skipped (not found): {stats['skipped']}")
    print(f"\nProducts by category:")
    
    cat_counts = {}
    for key, images in sorted(product_images.items()):
        cat = key.split("(")[1].rstrip(")")
        cat_counts[cat] = cat_counts.get(cat, 0) + len(images)
        print(f"  {key}: {len(images)} image(s)")
    
    print(f"\nCategory totals:")
    for cat, count in sorted(cat_counts.items()):
        print(f"  {cat}: {count} images")

if __name__ == "__main__":
    # Clear existing product images first
    for cat_dir in categories.values():
        if os.path.exists(cat_dir):
            for f in os.listdir(cat_dir):
                if f.endswith('.jpg'):
                    os.remove(os.path.join(cat_dir, f))
    
    categorize_images()

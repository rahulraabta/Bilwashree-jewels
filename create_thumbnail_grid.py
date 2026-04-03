"""Create thumbnail grids of extracted pages for quick visual identification."""
from PIL import Image, ImageDraw, ImageFont
import os
import math

extracted_dir = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\extracted"
output_dir = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images"

# Get all page images sorted
pages = sorted([f for f in os.listdir(extracted_dir) if f.startswith("page_") and f.endswith(".jpg")])
print(f"Found {len(pages)} pages")

# Settings
cols = 5
thumb_size = 400
padding = 10
label_height = 40
per_grid = 20  # 4 rows x 5 cols per grid

num_grids = math.ceil(len(pages) / per_grid)

for grid_idx in range(num_grids):
    start = grid_idx * per_grid
    end = min(start + per_grid, len(pages))
    batch = pages[start:end]
    rows = math.ceil(len(batch) / cols)
    
    grid_w = cols * (thumb_size + padding) + padding
    grid_h = rows * (thumb_size + label_height + padding) + padding
    
    grid = Image.new("RGB", (grid_w, grid_h), "white")
    draw = ImageDraw.Draw(grid)
    
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    for i, page_file in enumerate(batch):
        row = i // cols
        col = i % cols
        
        x = padding + col * (thumb_size + padding)
        y = padding + row * (thumb_size + label_height + padding)
        
        # Load and resize image
        img_path = os.path.join(extracted_dir, page_file)
        img = Image.open(img_path)
        img.thumbnail((thumb_size, thumb_size), Image.LANCZOS)
        
        # Center the thumbnail
        x_offset = x + (thumb_size - img.width) // 2
        y_offset = y + (thumb_size - img.height) // 2
        grid.paste(img, (x_offset, y_offset))
        
        # Draw border
        draw.rectangle([x, y, x + thumb_size, y + thumb_size], outline="black", width=2)
        
        # Draw page label
        page_num = page_file.replace("page_", "").replace(".jpg", "")
        label = f"Page {int(page_num)}"
        draw.text((x + thumb_size // 2 - 40, y + thumb_size + 5), label, fill="black", font=font)
    
    out_file = os.path.join(output_dir, f"grid_{grid_idx + 1:02d}.jpg")
    grid.save(out_file, quality=85)
    print(f"Saved grid {grid_idx + 1}: pages {start + 1}-{end} -> {out_file}")

print(f"\nDone! Created {num_grids} grid images.")

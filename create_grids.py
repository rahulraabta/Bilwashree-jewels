import os
from PIL import Image, ImageDraw

img_dir = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\extracted"
files = sorted([f for f in os.listdir(img_dir) if f.endswith('.jpg')])

grid_size = (5, 6) # 30 images per grid
images_per_grid = grid_size[0] * grid_size[1]
thumb_w, thumb_h = 400, 560

for i in range(0, len(files), images_per_grid):
    grid_img = Image.new('RGB', (grid_size[0] * thumb_w, grid_size[1] * thumb_h), (255, 255, 255))
    draw = ImageDraw.Draw(grid_img)
    
    batch = files[i:i+images_per_grid]
    for idx, f in enumerate(batch):
        col = idx % grid_size[0]
        row = idx // grid_size[0]
        img_path = os.path.join(img_dir, f)
        img = Image.open(img_path)
        img.thumbnail((thumb_w - 20, thumb_h - 40))
        
        x = col * thumb_w + 10
        y = row * thumb_h + 30
        grid_img.paste(img, (x, y))
        
        # Draw label
        draw.text((x, y - 20), f, fill=(255, 0, 0))
        
    grid_num = i // images_per_grid + 1
    grid_img.save(f"C:\\Users\\INTEL\\Desktop\\Bilwashree jewels\\grid_{grid_num}.jpg", quality=90)
    print(f"Saved grid_{grid_num}.jpg")

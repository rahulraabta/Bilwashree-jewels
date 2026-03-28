import fitz
import os

pdf_path = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\allimages.pdf"
out_dir = r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\extracted"

if not os.path.exists(out_dir):
    os.makedirs(out_dir)

doc = fitz.open(pdf_path)
for i in range(len(doc)):
    page = doc.load_page(i)
    # Render page to an image
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # 2x resolution
    out_file = os.path.join(out_dir, f"page_{i+1:03d}.jpg")
    pix.save(out_file)

print(f"Extracted {len(doc)} pages to {out_dir}")

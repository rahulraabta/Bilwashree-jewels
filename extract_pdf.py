import fitz
import json

doc = fitz.open(r"C:\Users\INTEL\Desktop\Bilwashree jewels\public\images\allimages.pdf")
results = []
for i in range(min(10, len(doc))):
    page = doc.load_page(i)
    text = page.get_text()
    images = page.get_images()
    results.append({
        "page": i,
        "text": text.strip(),
        "num_images": len(images)
    })

print(json.dumps(results, indent=2))

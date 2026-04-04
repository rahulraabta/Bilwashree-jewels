// scripts/upload_images_sanity.js
// Run with: npx sanity exec scripts/upload_images_sanity.js --with-user-token

const fs = require('fs');
const path = require('path');
const { createClient } = require('next-sanity');

async function uploadImages() {
  const client = createClient({
    projectId: '93zlbnv8',
    dataset: 'production',
    apiVersion: '2024-04-04',
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN,
  });

  const categories = ['necklaces', 'harams', 'earrings', 'bangles', 'pendants', 'accessories'];
  const baseDir = path.join(process.cwd(), 'public', 'images', 'products');

  const products = await client.fetch('*[_type == "product"]{_id, name, "slug": slug.current, images}');
  console.log(`Checking images for ${products.length} products.`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (const category of categories) {
    const dirPath = path.join(baseDir, category);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().startsWith('nk-'));

    for (const file of files) {
      // Extract ID: e.g. "nk-36_jadau-tikka.jpg" -> "NK-36"
      const match = file.match(/nk-(\d+)/i);
      if (!match) continue;
      const productId = `NK-${match[1]}`;
      const slugId = productId.toLowerCase().replace('-', ' ');

      const product = products.find(p => p.name === productId || p.slug === slugId);

      if (!product) {
        console.warn(`Product not found for image: ${file} (ID: ${productId})`);
        notFoundCount++;
        continue;
      }

      // Skip if already has images
      if (product.images && product.images.length > 0) {
        // console.log(`Skipping ${productId}: already has images.`);
        skippedCount++;
        continue;
      }

      console.log(`Uploading image for ${productId}: ${file}`);
      const filePath = path.join(dirPath, file);
      try {
        const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
          filename: file,
        });

        await client
          .patch(product._id)
          .setIfMissing({ images: [] })
          .insert('after', 'images[-1]', [{
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          }])
          .commit();

        uploadedCount++;
      } catch (err) {
        console.error(`Failed to upload ${file}: ${err.message}`);
      }
    }
  }

  console.log('\n--- IMAGE UPLOAD REPORT ---');
  console.log('Successfully Uploaded & Patched:', uploadedCount);
  console.log('Skipped (Already had images):', skippedCount);
  console.log('Images with no matching product:', notFoundCount);
}

uploadImages().catch(console.error);

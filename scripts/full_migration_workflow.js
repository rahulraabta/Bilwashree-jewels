// scripts/full_migration_workflow.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('next-sanity');

async function runWorkflow() {
  const client = createClient({
    projectId: '93zlbnv8',
    dataset: 'production',
    apiVersion: '2024-04-04',
    useCdn: false,
    token: process.env.SANITY_TOKEN,
  });

  if (!client.config().token) {
    console.error('Error: SANITY_TOKEN is not set.');
    process.exit(1);
  }

  // --- TASK 1: Price Audit Data ---
  const priceMap = {
    'NK-8': 399, 'NK-12': 320, 'NK-14': 420, 'NK-19': 420, 'NK-20': 450,
    'NK-22': 450, 'NK-24': 450, 'NK-25': 450, 'NK-26': 550, 'NK-27': 450,
    'NK-28': 499, 'NK-29': 450, 'NK-30': 699, 'NK-34': 699, 'NK-36': 799,
    'NK-39': 799, 'NK-40': 450, 'NK-42': 880, 'NK-45': 880, 'NK-50': 950,
    'NK-52': 899, 'NK-54': 950, 'NK-55': 999, 'NK-57': 999, 'NK-58': 950,
    'NK-72': 1299, 'NK-78': 1360, 'NK-82': 1399, 'NK-118': 1699, 'NK-175': 1799,
    'NK-465': 4799,
  };

  console.log('--- Phase 1: Price Audit ---');
  const existingProducts = await client.fetch('*[_type == "product"]{_id, name, "slug": slug.current, price}');
  let updatedPrices = 0;
  let createdDrafts = 0;
  let flagged = ['NK-6 (Missing price in list)'];

  for (const [id, price] of Object.entries(priceMap)) {
    const slugId = id.toLowerCase().replace('-', ' ');
    const existing = existingProducts.find(p => p.slug === slugId || p.name === id);

    if (existing) {
      if (existing.price !== price) {
        console.log(`Updating ${id}: ${existing.price} -> ${price}`);
        await client.patch(existing._id).set({ price }).commit();
        updatedPrices++;
      }
    } else {
      console.log(`Creating missing product: ${id} @ ₹${price}`);
      await client.create({
        _type: 'product',
        name: id,
        slug: { _type: 'slug', current: slugId },
        price,
        inStock: true,
      });
      createdDrafts++;
    }
  }

  // --- TASK 2: Bulk Image Upload ---
  console.log('\n--- Phase 2: Image Upload ---');
  const categories = ['necklaces', 'harams', 'earrings', 'bangles', 'pendants', 'accessories'];
  const baseDir = path.join(process.cwd(), 'public', 'images', 'products');
  // Refresh product list to include newly created ones
  const allProducts = await client.fetch('*[_type == "product"]{_id, name, "slug": slug.current, images}');

  let uploadedImgs = 0;
  let skippedImgs = 0;

  for (const cat of categories) {
    const dir = path.join(baseDir, cat);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().startsWith('nk-'));

    for (const file of files) {
      const match = file.match(/nk-(\d+)/i);
      if (!match) continue;
      const productId = `NK-${match[1]}`;
      const slugId = productId.toLowerCase().replace('-', ' ');
      const product = allProducts.find(p => p.name === productId || p.slug === slugId);

      if (!product) continue;
      if (product.images && product.images.length > 0) {
        skippedImgs++;
        continue;
      }

      console.log(`Uploading ${file} for ${productId}...`);
      try {
        const asset = await client.assets.upload('image', fs.createReadStream(path.join(dir, file)));
        await client.patch(product._id).setIfMissing({ images: [] }).insert('after', 'images[-1]', [{
          _type: 'image', asset: { _type: 'reference', _ref: asset._id }
        }]).commit();
        uploadedImgs++;
      } catch (e) { console.error(`Error uploading ${file}: ${e.message}`); }
    }
  }

  // --- TASK 3: Publication & Final Sync ---
  console.log('\n--- Phase 3: Final Publication ---');
  const drafts = await client.fetch('*[_id in path("drafts.**")]');
  console.log(`Publishing ${drafts.length} drafts...`);
  for (const draft of drafts) {
    const publishedId = draft._id.replace('drafts.', '');
    const { _id, ...rest } = draft;
    await client.transaction().createOrReplace({ _id: publishedId, ...rest }).delete(draft._id).commit();
  }

  console.log('\n--- FINAL REPORT ---');
  console.log(`Prices Updated: ${updatedPrices}`);
  console.log(`Products Created: ${createdDrafts}`);
  console.log(`Images Uploaded: ${uploadedImgs}`);
  console.log(`Images Skipped: ${skippedImgs}`);
  console.log(`Flagged for Review: ${flagged.join(', ')}`);
}

runWorkflow().catch(console.error);

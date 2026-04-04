import { createClient } from 'next-sanity'

const client = createClient({
  projectId: '93zlbnv8',
  dataset: 'production',
  apiVersion: '2024-04-04',
  useCdn: false, // Must be false for mutations
  token: process.env.SANITY_WRITE_TOKEN, // You can run this with: SANITY_WRITE_TOKEN=your_token node scripts/migrate_vibes_sanity.js
})

async function migrate() {
  if (!client.config().token) {
    console.error('Error: SANITY_WRITE_TOKEN is not set.');
    console.log('Please provide a token with Write permissions.');
    process.exit(1);
  }

  const products = await client.fetch('*[_type == "product"]{_id, name, category}');
  console.log(`Found ${products.length} products to migrate.`);

  let patchedCount = 0;

  for (const product of products) {
    const name = (product.name || '').toLowerCase();
    const category = product.category;
    let occasions = [];

    if (category === 'necklaces' || category === 'harams') {
      occasions = ['bridal', 'festive'];
    } else if (category === 'earrings') {
      if (name.includes('stud') || name.includes('small')) {
        occasions = ['daily'];
      } else {
        occasions = ['festive'];
      }
    } else if (category === 'pendants') {
      occasions = ['daily', 'office'];
    } else if (category === 'bangles') {
      occasions = ['festive', 'bridal'];
    } else if (category === 'accessories') {
      occasions = ['party'];
    }

    if (occasions.length > 0) {
      console.log(`Patching ${product.name} (${category}) -> ${occasions.join(', ')}`);
      await client
        .patch(product._id)
        .set({ occasion: occasions })
        .commit();
      patchedCount++;
    }
  }

  console.log(`Successfully patched ${patchedCount} products.`);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

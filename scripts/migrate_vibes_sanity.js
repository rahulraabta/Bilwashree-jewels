// scripts/migrate_vibes_sanity.js
// Run with: npx sanity exec scripts/migrate_vibes_sanity.js

async function migrate() {
  // In `sanity exec`, the client is often pre-configured if using the right imports
  // or we can just define it with the info we have.
  const { createClient } = require('next-sanity');

  const client = createClient({
    projectId: '93zlbnv8',
    dataset: 'production',
    apiVersion: '2024-04-04',
    useCdn: false,
    // We try to rely on the environment's existing auth
  });

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
      try {
        await client
          .patch(product._id)
          .set({ occasion: occasions })
          .commit();
        patchedCount++;
      } catch (e) {
        console.error(`Failed to patch ${product._id}: ${e.message}`);
      }
    }
  }

  console.log(`Successfully patched ${patchedCount} products.`);
}

migrate();

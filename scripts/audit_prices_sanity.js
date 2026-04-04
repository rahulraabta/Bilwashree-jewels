// scripts/audit_prices_sanity.js
// Run with: npx sanity exec scripts/audit_prices_sanity.js --with-user-token

async function migrate() {
  const { createClient } = require('next-sanity');

  const client = createClient({
    projectId: '93zlbnv8',
    dataset: 'production',
    apiVersion: '2024-04-04',
    useCdn: false,
    // When running via `sanity exec`, it should use the local auth if configured,
    // otherwise it might need a token. We'll use the environment if available.
    token: process.env.SANITY_WRITE_TOKEN,
  });

  const priceMap = {
    'NK-8': 399,
    'NK-12': 320,
    'NK-14': 420, // Higher of 420/350
    'NK-19': 420,
    'NK-20': 450,
    'NK-22': 450,
    'NK-24': 450,
    'NK-25': 450,
    'NK-26': 550, // Higher of 550/470
    'NK-27': 450,
    'NK-28': 499, // Higher of 499/450
    'NK-29': 450,
    'NK-30': 699,
    'NK-34': 699,
    'NK-36': 799,
    'NK-39': 799, // Higher of 799/750
    'NK-40': 450,
    'NK-42': 880, // Higher of 880/820
    'NK-45': 880, // Higher of 880/840
    'NK-50': 950, // Higher of 950/920/899
    'NK-52': 899,
    'NK-54': 950, // Higher of 950/860
    'NK-55': 999, // Higher of 999/930
    'NK-57': 999,
    'NK-58': 950,
    'NK-72': 1299,
    'NK-78': 1360,
    'NK-82': 1399,
    'NK-118': 1699,
    'NK-175': 1799,
    'NK-465': 4799,
  };

  const existingProducts = await client.fetch('*[_type == "product"]{_id, name, "slug": slug.current, price}');
  console.log(`Fetched ${existingProducts.length} existing products.`);

  const updated = [];
  const created = [];
  const flagged = [];

  // Flag NK-6 as missing price
  flagged.push('NK-6 (Missing price in image list)');

  for (const [id, price] of Object.entries(priceMap)) {
    const slugId = id.toLowerCase().replace('-', ' ');
    const existing = existingProducts.find(p => p.slug === slugId || p.name === id);

    if (existing) {
      if (existing.price !== price) {
        console.log(`Updating ${id}: ${existing.price} -> ${price}`);
        await client.patch(existing._id).set({ price }).commit();
        updated.push(id);
      }
    } else {
      console.log(`Creating new draft for ${id} at ₹${price}`);
      await client.create({
        _type: 'product',
        name: id,
        slug: { _type: 'slug', current: id.toLowerCase().replace('-', ' ') },
        price,
        inStock: true,
        featured: false,
      });
      created.push(id);
    }
  }

  console.log('\n--- AUDIT REPORT ---');
  console.log('Updated:', updated.join(', ') || 'None');
  console.log('Created (New Drafts):', created.join(', ') || 'None');
  console.log('Flagged for Review:', flagged.join(', ') || 'None');
}

migrate().catch(console.error);

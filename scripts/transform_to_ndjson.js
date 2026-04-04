const fs = require('fs');
const path = require('path');

// Read the existing inventory file (assuming it can be parsed as a JS module)
// For this script, we'll manually extract the inventory array by reading the file
const inventoryFile = 'data/inventory.js';
const fileContent = fs.readFileSync(inventoryFile, 'utf8');

// Use regex to extract the curatedInventory array
const match = fileContent.match(/const curatedInventory = \[(.*?)\];/s);
if (!match) {
  console.error("Could not extract curatedInventory from inventory.js");
  process.exit(1);
}

// Clean up the string to make it valid JSON-like
// Remove comments and template literals
let arrayString = match[1]
  .replace(/\/\*.*?\*\//gs, '') // Remove comments
  .replace(/\$\{BASE_PATH\}\//g, '') // Remove BASE_PATH/
  .trim();

// Note: This is still not valid JSON because it uses unquoted keys and trailing commas
// I will just construct a simple mapper to output the correct format
const products = eval(`[${arrayString}]`);

const ndjson = products.map(product => {
  return JSON.stringify({
    _type: 'product',
    name: product.title,
    slug: { _type: 'slug', current: product.id },
    price: product.priceINR || 0,
    category: product.category,
    material: product.material,
    description: '', // Add description if available
    inStock: product.inStock,
    featured: product.badge === 'Best Seller',
    imageURL: product.imageURL, // To be handled by a manual asset import or reference
  });
}).join('\n');

fs.writeFileSync('data/products.ndjson', ndjson);
console.log('Successfully created data/products.ndjson');

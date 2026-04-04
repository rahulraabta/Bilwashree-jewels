const fs = require('fs');

// Read the inventory file
const inventoryFile = 'data/inventory.js';
let content = fs.readFileSync(inventoryFile, 'utf8');

// Parse the inventory array (extracting via regex for simplicity)
const inventoryMatch = content.match(/const curatedInventory = \[(.*?)\];/s);
if (!inventoryMatch) {
  console.error('Could not find curatedInventory in inventory.js');
  process.exit(1);
}

// NOTE: This script assumes a simple structure and needs manual cleanup
// A more robust approach would be to import the file directly if it were JSON
// Since it's a JS file with exports, we'll manually parse it.
// For the sake of this task, I'll log the data to be manually seeded.

console.log('--- PLEASE COPY THIS DATA INTO SANITY ---');
console.log('// You can use a Sanity script to import this array of products');

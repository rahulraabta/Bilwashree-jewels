const { inventory } = require('./data/inventory.js');
const priced = inventory.filter(p => typeof p.priceINR === 'number' && p.priceINR !== null).length;
const unpriced = inventory.filter(p => p.priceINR === null || typeof p.priceINR === 'undefined').length;
console.log(`Total: ${inventory.length}`);
console.log(`Priced: ${priced}`);
console.log(`Unpriced: ${unpriced}`);

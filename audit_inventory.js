// audit_inventory.js - Find mismatches between images on disk and inventory entries
const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'public', 'images', 'products');

// Recursively get all image files
function getAllImages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllImages(fullPath));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      const rel = path.relative(productsDir, fullPath).replace(/\\/g, '/');
      results.push({ file: entry.name, relPath: rel, category: rel.split('/')[0] });
    }
  }
  return results;
}

const allImages = getAllImages(productsDir);
console.log(`\n=== TOTAL IMAGE FILES ON DISK: ${allImages.length} ===\n`);

// Group by category
const byCategory = {};
for (const img of allImages) {
  if (!byCategory[img.category]) byCategory[img.category] = [];
  byCategory[img.category].push(img.file);
}
for (const [cat, files] of Object.entries(byCategory)) {
  console.log(`  ${cat}: ${files.length} files`);
}

// Now parse inventory.js to extract all imageURL references
const inventorySource = fs.readFileSync(path.join(__dirname, 'data', 'inventory.js'), 'utf8');

// Extract all curatedInventory entries
const idMatches = [...inventorySource.matchAll(/id:\s*"([^"]+)"/g)];
const titleMatches = [...inventorySource.matchAll(/title:\s*"([^"]+)"/g)];
const imageMatches = [...inventorySource.matchAll(/imageURL:\s*`\$\{BASE_PATH\}\/images\/products\/([^`]+)`/g)];
const categoryMatches = [...inventorySource.matchAll(/category:\s*"([^"]+)"/g)];

console.log(`\n=== CURATED INVENTORY ENTRIES: ${idMatches.length} ===`);
console.log(`  Image URL references: ${imageMatches.length}`);

// Extract curated image paths
const curatedImagePaths = new Set(imageMatches.map(m => m[1]));

// Extract AUTO_VARIANT_IMAGE_FILES
const autoVariantSection = inventorySource.match(/AUTO_VARIANT_IMAGE_FILES\s*=\s*\{([\s\S]*?)\};/);
const autoVariantFiles = new Set();
if (autoVariantSection) {
  const fileMatches = [...autoVariantSection[1].matchAll(/'([^']+\.jpg)'/g)];
  for (const m of fileMatches) {
    // Find which category block it's in
    const catBlocks = [...autoVariantSection[1].matchAll(/['"]?([\w-]+)['"]?:\s*\[([\s\S]*?)\]/g)];
    for (const catBlock of catBlocks) {
      if (catBlock[2].includes(m[1])) {
        autoVariantFiles.add(`${catBlock[1]}/${m[1]}`);
      }
    }
  }
}
console.log(`  Auto-variant file references: ${autoVariantFiles.size}`);

// All referenced image paths (curated + auto-variant)
const allReferencedPaths = new Set([...curatedImagePaths, ...autoVariantFiles]);

// Find images on disk NOT referenced in inventory at all
console.log(`\n=== IMAGES ON DISK NOT IN INVENTORY (missing entries) ===`);
const missingEntries = [];
for (const img of allImages) {
  if (!allReferencedPaths.has(img.relPath)) {
    missingEntries.push(img);
    console.log(`  MISSING: ${img.relPath}`);
  }
}
console.log(`  Total missing: ${missingEntries.length}`);

// Find inventory references pointing to non-existent files
const diskPaths = new Set(allImages.map(img => img.relPath));
console.log(`\n=== INVENTORY REFERENCES WITH NO MATCHING IMAGE FILE ===`);
let brokenCount = 0;
for (const ref of allReferencedPaths) {
  if (!diskPaths.has(ref)) {
    console.log(`  BROKEN: ${ref}`);
    brokenCount++;
  }
}
console.log(`  Total broken: ${brokenCount}`);

// Check for duplicate IDs in curated inventory
console.log(`\n=== DUPLICATE IDS IN CURATED INVENTORY ===`);
const idCounts = {};
for (const m of idMatches) {
  idCounts[m[1]] = (idCounts[m[1]] || 0) + 1;
}
for (const [id, count] of Object.entries(idCounts)) {
  if (count > 1) {
    console.log(`  DUPLICATE ID: "${id}" appears ${count} times`);
  }
}

// Check for duplicate image URLs in curated inventory
console.log(`\n=== DUPLICATE IMAGE URLS IN CURATED INVENTORY ===`);
const imgCounts = {};
for (const m of imageMatches) {
  imgCounts[m[1]] = (imgCounts[m[1]] || 0) + 1;
}
for (const [img, count] of Object.entries(imgCounts)) {
  if (count > 1) {
    console.log(`  DUPLICATE IMAGE: "${img}" appears ${count} times`);
  }
}

// Summary
console.log(`\n=== SUMMARY ===`);
console.log(`  Total image files on disk: ${allImages.length}`);
console.log(`  Curated inventory entries: ${idMatches.length}`);
console.log(`  Auto-variant file refs: ${autoVariantFiles.size}`);
console.log(`  Total referenced paths: ${allReferencedPaths.size}`);
console.log(`  Images NOT in inventory: ${missingEntries.length}`);
console.log(`  Broken references (no file): ${brokenCount}`);

// Output data needed for fix
if (missingEntries.length > 0) {
  console.log(`\n=== MISSING ENTRIES DETAILS (for adding to inventory) ===`);
  for (const img of missingEntries) {
    console.log(JSON.stringify(img));
  }
}

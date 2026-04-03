import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inventory } from '../data/inventory.js';
import { extractCodeLabel, resolveNameFromImageMap } from './product-name-rules.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const CATEGORY_LABELS = {
  necklaces: 'Necklace',
  bangles: 'Bangles',
  earrings: 'Earrings',
  pendants: 'Pendants',
  harams: 'Harams',
  accessories: 'Accessories',
};

const categoryOrder = ['necklaces', 'harams', 'bangles', 'earrings', 'pendants', 'accessories'];
const structureOrder = ['Short', 'Medium', 'Long', 'Standard'];

function normalizeStructure(product) {
  const category = String(product.category || '').toLowerCase();
  const structure = String(product.structure || '').toLowerCase();

  if (category === 'harams' || /haram|long/.test(structure)) return 'Long';
  if (/choker|short/.test(structure)) return 'Short';
  if (/necklace|medium/.test(structure)) return 'Medium';
  if (category === 'necklaces') return 'Medium';
  return 'Standard';
}

function normalizedName(product, code) {
  return resolveNameFromImageMap(product, code);
}

const processed = inventory
  .map((product) => {
    const code = extractCodeLabel(product);
    if (!code) return null;

    const normalizedCode = code.replace(' ', '-');
    const normalizedCategory = String(product.category || '').toLowerCase();

    return {
      productId: `${normalizedCode}-${normalizedCategory}`,
      productCode: normalizedCode,
      category: normalizedCategory,
      itemName: normalizedName(product, code),
      structure: normalizeStructure(product),
      unitPrice: Number.isFinite(product.priceINR) ? product.priceINR : null,
      sourceId: product.id,
    };
  })
  .filter(Boolean)
  .sort((a, b) => {
    const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (catDiff !== 0) return catDiff;

    const structDiff = structureOrder.indexOf(a.structure) - structureOrder.indexOf(b.structure);
    if (structDiff !== 0) return structDiff;

    const codeA = Number.parseInt(a.productCode.replace(/[^0-9]/g, ''), 10);
    const codeB = Number.parseInt(b.productCode.replace(/[^0-9]/g, ''), 10);
    if (codeA !== codeB) return codeA - codeB;

    return a.itemName.localeCompare(b.itemName);
  });

const grouped = new Map();
for (const row of processed) {
  if (!grouped.has(row.category)) grouped.set(row.category, []);
  grouped.get(row.category).push(row);
}

const totalInventoryValue = processed.reduce((sum, row) => sum + (row.unitPrice || 0), 0);
const unpricedCount = processed.filter((row) => row.unitPrice == null).length;

const htmlSections = categoryOrder
  .filter((category) => grouped.has(category))
  .map((category) => {
    const rows = grouped.get(category)
      .map((row) => {
        const price = row.unitPrice == null
          ? 'N/A'
          : `Rs ${row.unitPrice.toLocaleString('en-IN')}`;

        return `<tr><td>${row.productCode}</td><td>${row.itemName}</td><td>${row.structure}</td><td class="price">${price}</td></tr>`;
      })
      .join('');

    return `
      <section class="category-block">
        <h2>${CATEGORY_LABELS[category] || category}</h2>
        <table>
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Item Name/Description</th>
              <th>Structure</th>
              <th>Unit Price (Rs)</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    `;
  })
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Anti-Gravity Inventory Table</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #0b0f19;
      --muted: #1d2433;
      --line: #11284f;
      --header: #0d1f3d;
      --header-text: #ffffff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      background: var(--bg);
      color: var(--text);
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.4;
    }
    .wrap {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      margin: 0 0 8px;
      color: var(--header);
      font-size: 2rem;
      letter-spacing: 0.4px;
    }
    .meta {
      margin: 0 0 18px;
      color: var(--muted);
      font-weight: 600;
    }
    .category-block { margin-bottom: 20px; }
    h2 {
      margin: 0 0 8px;
      color: var(--header);
      font-size: 1.2rem;
      border-left: 6px solid var(--header);
      padding-left: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border: 2px solid var(--line);
    }
    th, td {
      border: 1px solid var(--line);
      padding: 10px;
      text-align: left;
      vertical-align: top;
      color: var(--text);
      font-size: 0.95rem;
    }
    th {
      background: var(--header);
      color: var(--header-text);
      font-weight: 700;
    }
    .price { font-weight: 700; white-space: nowrap; }
    .total-box {
      margin-top: 16px;
      padding: 14px;
      border: 3px solid var(--header);
      background: #f2f6ff;
      color: #09142a;
      font-weight: 800;
      font-size: 1.1rem;
    }
    .note {
      margin-top: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #1b2f57;
    }
    @media (max-width: 768px) {
      body { padding: 12px; }
      th, td { font-size: 0.82rem; padding: 8px; }
      h1 { font-size: 1.45rem; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Anti-Gravity Inventory Conversion</h1>
    <p class="meta">Sorted by Category and Structure: Short → Medium → Long → Standard</p>
    ${htmlSections}
    <div class="total-box">Total Inventory Value: Rs ${totalInventoryValue.toLocaleString('en-IN')}</div>
    <div class="note">Unpriced entries treated as Rs 0 in total: ${unpricedCount}</div>
  </div>
</body>
</html>`;

const reportPath = path.join(repoRoot, 'public', 'inventory-anti-gravity.html');
const jsonPath = path.join(repoRoot, 'data', 'inventory-anti-gravity.json');

fs.writeFileSync(reportPath, html, 'utf8');
fs.writeFileSync(jsonPath, JSON.stringify(processed, null, 2), 'utf8');

console.log(`Generated ${processed.length} normalized entries.`);
console.log(`Total Inventory Value: Rs ${totalInventoryValue.toLocaleString('en-IN')}`);
console.log(`Report: ${reportPath}`);
console.log(`JSON: ${jsonPath}`);

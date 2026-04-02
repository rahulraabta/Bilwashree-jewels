import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inventory } from '../data/inventory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const legacyPendantOverrides = {
  'prod_1': 'NK 8',
  'prod_2': 'NK 10',
  'prod_3': 'NK 8',
  'prod_4': 'NK 8',
  'prod_5': 'NK 8',
  'prod_6': 'NK 10',
  'prod_7': 'NK 8',
};

const codeFromImagePath = (imageURL) => {
  const m = String(imageURL || '').match(/(?:^|[\/_-])nk-(\d+)(?:[^\d]|$)/i);
  return m ? `NK ${m[1]}` : null;
};

const codeFromTitle = (title) => {
  const m = String(title || '').match(/\bNK\s*-?\s*(\d+)\b/i);
  return m ? `NK ${m[1]}` : null;
};

const rows = inventory.map((product) => {
  const imageCode = legacyPendantOverrides[product.id] || codeFromImagePath(product.imageURL);
  const titleCode = codeFromTitle(product.title);
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    imageURL: product.imageURL,
    imageCode,
    titleCode,
    matches: imageCode != null && titleCode === imageCode,
  };
});

const uniqueCodes = [...new Set(rows.map((r) => r.imageCode).filter(Boolean))]
  .sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));

const report = {
  totalProducts: rows.length,
  matched: rows.filter((r) => r.matches).length,
  mismatched: rows.filter((r) => r.imageCode && r.titleCode && !r.matches),
  missingImageCode: rows.filter((r) => !r.imageCode),
  uniqueImageCodes: uniqueCodes,
  rows,
};

const outFile = path.join(repoRoot, 'data', 'image-code-audit.json');
fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf8');

console.log(`Wrote report: ${outFile}`);
console.log(`Products: ${report.totalProducts}`);
console.log(`Matched: ${report.matched}`);
console.log(`Mismatched: ${report.mismatched.length}`);
console.log(`Unique codes from images: ${report.uniqueImageCodes.length}`);

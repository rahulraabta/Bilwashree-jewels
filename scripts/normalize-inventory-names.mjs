import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { extractCodeLabel, resolveNameFromImageMap } from './product-name-rules.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inventoryPath = path.resolve(__dirname, '../data/inventory.js');

let source = fs.readFileSync(inventoryPath, 'utf8');
const mod = await import(pathToFileURL(inventoryPath).href);

const esc = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizedName = (product) => {
  const code = extractCodeLabel(product);
  if (!code) return product.title;
  return resolveNameFromImageMap(product, code);
};

let changed = 0;
for (const product of mod.inventory) {
  const title = normalizedName(product);
  const re = new RegExp(`(id:\\s*"${esc(product.id)}"[\\s\\S]*?title:\\s*")([^"]*)(")`);
  if (!re.test(source)) continue;
  source = source.replace(re, `$1${title}$3`);
  changed += 1;
}

fs.writeFileSync(inventoryPath, source, 'utf8');
console.log(`Updated ${changed} product titles.`);

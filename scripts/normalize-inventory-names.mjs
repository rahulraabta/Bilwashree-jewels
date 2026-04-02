import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inventoryPath = path.resolve(__dirname, '../data/inventory.js');

let source = fs.readFileSync(inventoryPath, 'utf8');
const mod = await import(pathToFileURL(inventoryPath).href);

const esc = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const codeFrom = (product) => {
  const match = `${product.title || ''} ${product.id || ''}`.match(/NK-(\d+)/i);
  if (match) return `NK ${match[1]}`;

  const prodMatch = String(product.id || '').match(/^prod_(\d+)$/i);
  if (prodMatch) return `NK ${prodMatch[1]}`;

  return null;
};

const normalizedName = (product) => {
  const code = codeFrom(product);
  const text = `${product.title || ''} ${product.material || ''}`.toLowerCase();
  const hasDollar = product.category === 'pendants' && /dollar/.test(text);
  const hasJadvikandan = /jadau|jadu\s*kundan|kundan|jadvikandan/.test(text);

  if (hasDollar) return `Dollar ${code || ''}`.trim();
  if (hasJadvikandan) return `Jadvikandan ${code || ''}`.trim();
  return code || product.title;
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

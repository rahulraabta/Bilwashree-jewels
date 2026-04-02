const SPECIAL_NAME_BY_IMAGE_CODE = {
  'harams:NK 465': 'Jadau Kundan Reversible NK 465',
  'earrings:NK 125': 'Jadau Kundan NK 125',
  'earrings:NK 146': 'Jadau Kundan NK 146',
  'pendants:NK 8': 'Dollar NK 8',
  'pendants:NK 10': 'Dollar NK 10',
  'pendants:NK 40': 'Dollar NK 40',
};

export function extractCodeLabel(product) {
  const text = `${product.title || ''} ${product.id || ''}`;
  const match = text.match(/NK[-\s]?(\d+)/i);
  if (match) return `NK ${match[1]}`;

  const prodMatch = String(product.id || '').match(/^prod_(\d+)$/i);
  if (prodMatch) return `NK ${prodMatch[1]}`;

  return null;
}

export function resolveNameFromImageMap(product, codeLabel) {
  const key = `${String(product.category || '').toLowerCase()}:${codeLabel}`;
  return SPECIAL_NAME_BY_IMAGE_CODE[key] || codeLabel;
}

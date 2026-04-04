const fs = require('fs');

const categories = [
  { id: 'necklaces',   name: 'Necklaces',    icon: '📿', description: 'Elegant necklaces for every occasion' },
  { id: 'harams',      name: 'Harams',       icon: '🪷', description: 'Long layered harams for bridal & festive wear' },
  { id: 'earrings',    name: 'Earrings',     icon: '✧',  description: 'Studs, jhumkas, chandbalis & more' },
  { id: 'bangles',     name: 'Bangles',      icon: '◎', description: 'Traditional kadas & modern bangles' },
  { id: 'pendants',    name: 'Pendants',     icon: '◆', description: 'Elegant statement and daily-wear pendants' },
  { id: 'accessories', name: 'Accessories',  icon: '❖',  description: 'Maang tikka, anklets & more' },
];

const ndjson = categories.map(cat => {
  return JSON.stringify({
    _id: `category-${cat.id}`,
    _type: 'category',
    title: cat.name,
    icon: cat.icon,
    slug: { _type: 'slug', current: cat.id },
    description: cat.description
  });
}).join('\n');

fs.writeFileSync('data/categories.ndjson', ndjson);
console.log('Successfully created data/categories.ndjson');

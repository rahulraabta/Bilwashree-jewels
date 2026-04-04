const fs = require('fs');

const categories = [
  { id: 'necklaces',   name: 'Necklaces',    description: 'Elegant necklaces for every occasion' },
  { id: 'harams',      name: 'Harams',       description: 'Long layered harams for bridal & festive wear' },
  { id: 'earrings',    name: 'Earrings',     description: 'Studs, jhumkas, chandbalis & more' },
  { id: 'bangles',     name: 'Bangles',      description: 'Traditional kadas & modern bangles' },
  { id: 'pendants',    name: 'Pendants',     description: 'Elegant statement and daily-wear pendants' },
  { id: 'accessories', name: 'Accessories',  description: 'Maang tikka, anklets & more' },
];

const ndjson = categories.map(cat => {
  return JSON.stringify({
    _id: `category-${cat.id}`,
    _type: 'category',
    title: cat.name,
    slug: { _type: 'slug', current: cat.id },
    description: cat.description
  });
}).join('\n');

fs.writeFileSync('data/categories.ndjson', ndjson);
console.log('Successfully created data/categories.ndjson');

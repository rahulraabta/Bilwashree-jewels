// data/inventory.js
export const BASE_PATH = '';

/* ─── Product Categories ─────────────────────────────────── */
export const CATEGORIES = [
  { id: 'all',         name: 'All',          icon: '✦', description: 'Browse our entire collection' },
  { id: 'necklaces',   name: 'Necklaces',    icon: '📿', description: 'Elegant necklaces for every occasion' },
  { id: 'harams',      name: 'Harams',       icon: '🪷', description: 'Long layered harams for bridal & festive wear' },
  { id: 'earrings',    name: 'Earrings',     icon: '✧',  description: 'Studs, jhumkas, chandbalis & more' },
  { id: 'bangles',     name: 'Bangles',      icon: '◎', description: 'Traditional kadas & modern bangles' },
  { id: 'pendants',    name: 'Pendants',     icon: '◆', description: 'Elegant statement and daily-wear pendants' },
  { id: 'accessories', name: 'Accessories',  icon: '❖',  description: 'Maang tikka, anklets & more' },
];

/* ─── Products Inventory ─────────────────────────────────── */
const curatedInventory = [

  /* ── ORIGINAL PENDANT PRODUCTS ───────────────────────── */
  {
    id: "prod_1",
    title: "Dollar BS 8",
    category: "pendants",
    material: "22Kt Gold Plated with Semi-Precious Stones",
    priceINR: 399,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["festive", "bridal", "daily"],
    imageURL: `${BASE_PATH}/images/pendant-1.jpg.jpeg`,
    inStock: true
  },
  {
    id: "prod_2",
    title: "Dollar BS 10",
    category: "pendants",
    material: "Antique Finish with Ruby Accents",
    priceINR: 399,
    originalPrice: 699,
    badge: "New Arrival",
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/pendant-2.jpg.jpeg`,
    inStock: true
  },
  {
    id: "prod_3",
    title: "Dollar BS 8",
    category: "pendants",
    material: "Meenakari Enamel & Gold Finish",
    priceINR: 399,
    originalPrice: 599,
    badge: "New Arrival",
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/pendant-3.jpg.jpeg`,
    inStock: true
  },
  {
    id: "prod_4",
    title: "Dollar BS 8",
    category: "pendants",
    material: "Gold Plated Temple Art",
    priceINR: 399,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/pendant-4.jpg.jpeg`,
    inStock: true
  },
  {
    id: "prod_5",
    title: "Dollar BS 8",
    category: "pendants",
    material: "Premium Gold Plated",
    priceINR: 399,
    originalPrice: 599,
    badge: "Best Seller",
    occasion: ["daily", "office"],
    imageURL: `${BASE_PATH}/images/pendant-5.jpg.jpeg`,
    inStock: true
  },
  {
    id: "prod_6",
    title: "Dollar BS 10",
    category: "pendants",
    material: "22Kt Gold Plated Brass",
    priceINR: 399,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/pendant-6.jpg (2).jpeg`,
    inStock: true
  },
  {
    id: "prod_7",
    title: "Dollar BS 8",
    category: "pendants",
    material: "Antique Finish with Emerald Stones",
    priceINR: 399,
    originalPrice: 799,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/pendant-7.jpg.jpeg`,
    inStock: true
  },

  /* ══════════════════════════════════════════════════════════
     NECKLACES — CHOKER (Short)
     Pearl-chain or tight-fit necklaces, sit close to collarbone
     ══════════════════════════════════════════════════════════ */
  {
    id: "bs-55-choker-green",
    title: "BS 55",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & CZ with Green Stones",
    priceINR: 930,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-55_choker-green.jpg`,
    inStock: true
  },
  {
    id: "bs-55-choker-red",
    title: "BS 55",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & CZ with Red Stones",
    priceINR: 930,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-55_choker-red.jpg`,
    inStock: true
  },
  {
    id: "bs-55-choker-pink",
    title: "BS 55",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & CZ with Pink Stones",
    priceINR: 930,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-55_choker-pink.jpg`,
    inStock: true
  },
  {
    id: "bs-55-choker-teal",
    title: "BS 55",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & CZ with Teal Stones",
    priceINR: 930,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-55_choker-teal.jpg`,
    inStock: true
  },
  {
    id: "bs-50-choker-red",
    title: "BS 50",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & CZ with Red Stones",
    priceINR: 920,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-50_choker-red.jpg`,
    inStock: true
  },
  {
    id: "bs-50-choker-rose",
    title: "BS 50",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & CZ with Rose Stones",
    priceINR: 920,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-50_choker-rose.jpg`,
    inStock: true
  },
  {
    id: "bs-50-choker-green",
    title: "BS 50",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & CZ with Green Stones",
    priceINR: 920,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-50_choker-green.jpg`,
    inStock: true
  },
  {
    id: "bs-19-choker",
    title: "BS 19",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl & Kemp Stone",
    priceINR: 420,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-19_choker-pearl.jpg`,
    inStock: true
  },
  {
    id: "bs-12-choker",
    title: "BS 12",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl Chain with Flower Motif",
    priceINR: 320,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "office"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-12_choker-flower.jpg`,
    inStock: true
  },
  {
    id: "bs-12-choker-red",
    title: "BS 12",
    category: "necklaces",
    structure: "Choker",
    material: "Pearl Chain with Red Flower Motif",
    priceINR: 320,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-12_choker-flower-red.jpg`,
    inStock: true
  },

  /* ══════════════════════════════════════════════════════════
     NECKLACES — MEDIUM (Standard)
     Traditional temple necklaces of standard length
     ══════════════════════════════════════════════════════════ */
  {
    id: "bs-10-necklace",
    title: "BS 10",
    category: "necklaces",
    structure: "Necklace",
    material: "CZ Stone & Gold Plated",
    priceINR: 399,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-10_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-13-necklace",
    title: "BS 13",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Plated with Kemp Stones",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-13_flower-mixed.jpg`,
    inStock: true
  },
  {
    id: "bs-18-necklace",
    title: "BS 18",
    category: "necklaces",
    structure: "Necklace",
    material: "Antique Gold with Coral Stones",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-18_medium-temple.jpg`,
    inStock: true
  },
  {
    id: "bs-19-necklace",
    title: "BS 19",
    category: "necklaces",
    structure: "Necklace",
    material: "Meenakari Enamel & Gold",
    priceINR: 420,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-19_meenakari.jpg`,
    inStock: true
  },
  {
    id: "bs-20-necklace",
    title: "BS 20",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Plated Coin Design",
    priceINR: 450,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-20_medium-coin.jpg`,
    inStock: true
  },
  {
    id: "bs-22-necklace",
    title: "BS 22",
    category: "necklaces",
    structure: "Necklace",
    material: "Antique Gold with Ruby Squares",
    priceINR: 450,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-22_flower-ruby.jpg`,
    inStock: true
  },
  {
    id: "bs-24-necklace",
    title: "BS 24",
    category: "necklaces",
    structure: "Necklace",
    material: "Temple Style with Kemp Stones",
    priceINR: 450,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-24_medium-kemp.jpg`,
    inStock: true
  },
  {
    id: "bs-25-necklace",
    title: "BS 25",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Plated with Multicolor Stones",
    priceINR: 450,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-25_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-26-necklace",
    title: "BS 26",
    category: "necklaces",
    structure: "Necklace",
    material: "CZ & Ruby with Gold Chain",
    priceINR: 470,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-26_medium-cz-ruby.jpg`,
    inStock: true
  },
  {
    id: "bs-27-necklace",
    title: "BS 27",
    category: "necklaces",
    structure: "Necklace",
    material: "Reversible Gold Plated",
    priceINR: 450,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["daily", "office", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-27_reversible.jpg`,
    inStock: true
  },
  {
    id: "bs-28-necklace",
    title: "BS 28",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Coin Design",
    priceINR: 499,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-28_kasumala.jpg`,
    inStock: true
  },
  {
    id: "bs-30-necklace",
    title: "BS 30",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Plated Temple Style",
    priceINR: 699,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-30_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-32-necklace",
    title: "BS 32",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Coin with Colored Stones",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-32_kasumala-red.jpg`,
    inStock: true
  },
  {
    id: "bs-34-necklace",
    title: "BS 34",
    category: "necklaces",
    structure: "Necklace",
    material: "Kemp Stone with Green Drops",
    priceINR: 699,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-34_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-36-necklace",
    title: "BS 36",
    category: "necklaces",
    structure: "Necklace",
    material: "Pearl Chain with Temple Motif",
    priceINR: 799,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "office"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-36_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-39-necklace",
    title: "BS 39",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Coin with Kemp Stones",
    priceINR: 750,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-39_medium-kemp.jpg`,
    inStock: true
  },
  {
    id: "bs-40-necklace",
    title: "BS 40",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Plated with Green Drops",
    priceINR: 450,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-40_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-45-necklace",
    title: "BS 45",
    category: "necklaces",
    structure: "Necklace",
    material: "Antique Gold with Temple Motif",
    priceINR: 840,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-45_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-46-necklace",
    title: "BS 46",
    category: "necklaces",
    structure: "Necklace",
    material: "CZ with Multi-Color Stones",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-46_medium-cz-multi.jpg`,
    inStock: true
  },
  {
    id: "bs-50-necklace",
    title: "BS 50",
    category: "necklaces",
    structure: "Necklace",
    material: "CZ with Emerald Stones",
    priceINR: 920,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-50_medium-cz-green.jpg`,
    inStock: true
  },
  {
    id: "bs-54-necklace",
    title: "BS 54",
    category: "necklaces",
    structure: "Necklace",
    material: "Kemp Stone Temple Style",
    priceINR: 950,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-54_medium.jpg`,
    inStock: true
  },
  {
    id: "bs-55-necklace",
    title: "BS 55",
    category: "necklaces",
    structure: "Necklace",
    material: "Gold Plated with Kemp Drops",
    priceINR: 930,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-55_medium-temple.jpg`,
    inStock: true
  },

  /* ══════════════════════════════════════════════════════════
     HARAMS — Long Necklaces
     Long necklaces for bridal and festive wear
     ══════════════════════════════════════════════════════════ */
  {
    id: "bs-42-haram",
    title: "BS 42",
    category: "harams",
    structure: "Haram",
    material: "Antique Gold Coin Design",
    priceINR: 880,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-42_long-coin.jpg`,
    inStock: true
  },
  {
    id: "bs-465-haram",
    title: "Jadau Kundan Reversible BS 465",
    category: "harams",
    structure: "Haram",
    material: "Jadau Kundan Reversible Premium",
    priceINR: 4799,
    originalPrice: null,
    badge: "Premium",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-465_jadau-kundan.jpg`,
    inStock: true
  },
  {
    id: "bs-57-haram",
    title: "BS 57",
    category: "harams",
    structure: "Haram",
    material: "Green Beads with Temple Pendant",
    priceINR: 999,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-57_long-green.jpg`,
    inStock: true
  },
  {
    id: "bs-72-haram",
    title: "BS 72",
    category: "harams",
    structure: "Haram",
    material: "Gold with Kemp & Beaded Chain",
    priceINR: 1299,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-72_long-red.jpg`,
    inStock: true
  },
  {
    id: "bs-78-haram",
    title: "BS 78",
    category: "harams",
    structure: "Haram",
    material: "Red Beads with Temple Motif",
    priceINR: 1360,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-78_long-red.jpg`,
    inStock: true
  },
  {
    id: "bs-60-haram",
    title: "BS 60",
    category: "harams",
    structure: "Haram",
    material: "Red Beads with Temple Pendant",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-60_long-red.jpg`,
    inStock: true
  },
  {
    id: "bs-62-haram",
    title: "BS 62",
    category: "harams",
    structure: "Haram",
    material: "Green Beads & Gold Temple",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-62_long-green.jpg`,
    inStock: true
  },
  {
    id: "bs-50-haram",
    title: "BS 50",
    category: "harams",
    structure: "Haram",
    material: "Green Beads with Lakshmi Pendant",
    priceINR: 950,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-50_long-green.jpg`,
    inStock: true
  },
  {
    id: "bs-24-haram",
    title: "BS 24",
    category: "harams",
    structure: "Haram",
    material: "Antique Gold Chain Design",
    priceINR: 450,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-24_long-chain.jpg`,
    inStock: true
  },

  /* ══════════════════════════════════════════════════════════
     EARRINGS
     ══════════════════════════════════════════════════════════ */
  {
    id: "bs-10-earrings",
    title: "BS 10",
    category: "earrings",
    material: "CZ Crystal with Gold Setting",
    priceINR: 399,
    originalPrice: null,
    badge: null,
    occasion: ["party", "daily"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-10_cz-climber.jpg`,
    inStock: true
  },
  {
    id: "bs-12-earrings",
    title: "BS 12",
    category: "earrings",
    material: "CZ with Flower Motif",
    priceINR: 320,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-12_flower-pink.jpg`,
    inStock: true
  },
  {
    id: "bs-125-earrings",
    title: "Jadau Kundan BS 125",
    category: "earrings",
    material: "Jadau Kundan with Green Beads",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-125_jadau-stud.jpg`,
    inStock: true
  },
  {
    id: "bs-146-earrings",
    title: "Jadau Kundan BS 146",
    category: "earrings",
    material: "Jadau Kundan with Emerald",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive", "party"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-146_jadau-jhumka.jpg`,
    inStock: true
  },
  {
    id: "bs-25-earrings",
    title: "BS 25",
    category: "earrings",
    material: "Antique Gold Temple Style",
    priceINR: 450,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-25_temple-jhumka.jpg`,
    inStock: true
  },
  {
    id: "bs-28-earrings",
    title: "BS 28",
    category: "earrings",
    material: "Gold with Pearl Drops",
    priceINR: 499,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-28_temple-drop.jpg`,
    inStock: true
  },
  {
    id: "bs-45-earrings",
    title: "BS 45",
    category: "earrings",
    material: "Gold Plated Jhumka Style",
    priceINR: 840,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-45_temple-jhumka.jpg`,
    inStock: true
  },
  {
    id: "bs-46-earrings",
    title: "BS 46",
    category: "earrings",
    material: "CZ with Chain",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-46_cz-danglers.jpg`,
    inStock: true
  },
  {
    id: "bs-18-earrings",
    title: "BS 18",
    category: "earrings",
    material: "CZ Crystal Drop",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["party", "office"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-18_cz-drop.jpg`,
    inStock: true
  },
  {
    id: "bs-40-earrings",
    title: "BS 40",
    category: "earrings",
    material: "Gold with Ruby Leaf Design",
    priceINR: 450,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-40_leaf-ruby.jpg`,
    inStock: true
  },

  /* ══════════════════════════════════════════════════════════
     BANGLES
     ══════════════════════════════════════════════════════════ */
  {
    id: "bs-14-bangles",
    title: "BS 14",
    category: "bangles",
    material: "Antique Gold Temple Design",
    priceINR: 350,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/bangles/nk-14_temple-kada.jpg`,
    inStock: true
  },
  {
    id: "bs-15-bangles",
    title: "BS 15",
    category: "bangles",
    material: "Gold Plated with Emerald Stones",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/bangles/nk-15_temple-set.jpg`,
    inStock: true
  },
  {
    id: "bs-18-bangles",
    title: "BS 18",
    category: "bangles",
    material: "Gold Plated with Multi Stones",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/bangles/nk-18_temple-bangle.jpg`,
    inStock: true
  },
  {
    id: "bs-19-bangles",
    title: "BS 19",
    category: "bangles",
    material: "Reversible Gold Plated",
    priceINR: 420,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/bangles/nk-19_reverse-bangle.jpg`,
    inStock: true
  },

  /* ══════════════════════════════════════════════════════════
     PENDANTS (Dollars) — from PDF catalog
     ══════════════════════════════════════════════════════════ */
  {
    id: "bs-8-dollar",
    title: "Dollar BS 8",
    category: "pendants",
    material: "Antique Gold Temple Art",
    priceINR: 399,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/pendants/dollar-nk-8_lakshmi-1.jpg`,
    inStock: true
  },
  {
    id: "bs-10-dollar",
    title: "Dollar BS 10",
    category: "pendants",
    material: "Gold Plated Temple Style",
    priceINR: 399,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/pendants/dollar-nk-10_lakshmi-2.jpg`,
    inStock: true
  },
  {
    id: "bs-40-dollar",
    title: "Dollar BS 40",
    category: "pendants",
    material: "Large Temple Art Pendant",
    priceINR: 450,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/pendants/dollar-nk-40_temple-large.jpg`,
    inStock: true
  },

  /* ══════════════════════════════════════════════════════════
     ACCESSORIES — Maang Tikka, Anklets
     ══════════════════════════════════════════════════════════ */
  {
    id: "bs-48-tikka",
    title: "BS 48",
    category: "accessories",
    material: "Pearl & Gold",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/accessories/nk-48_maang-tikka.jpg`,
    inStock: true
  },
  {
    id: "bs-42-tikka",
    title: "BS 42",
    category: "accessories",
    material: "Gold Plated Temple Art",
    priceINR: 820,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/accessories/nk-42_maang-tikka.jpg`,
    inStock: true
  },
  {
    id: "bs-50-tikka",
    title: "BS 50",
    category: "accessories",
    material: "CZ Crystal with Ruby Stone",
    priceINR: 899,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/accessories/nk-50_maang-tikka.jpg`,
    inStock: true
  },
  {
    id: "bs-54-tikka",
    title: "BS 54",
    category: "accessories",
    material: "CZ Crystal Layered Design",
    priceINR: 860,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/accessories/nk-54_maang-tikka.jpg`,
    inStock: true
  },
  {
    id: "bs-54-anklet",
    title: "BS 54",
    category: "accessories",
    material: "Pearl & CZ Crystal",
    priceINR: 860,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/accessories/nk-54_anklet-payal.jpg`,
    inStock: true
  },
];

const AUTO_VARIANT_IMAGE_FILES = {
  accessories: [
    'nk-36_jadau-tikka.jpg',
    'nk-42_maang-tikka.jpg',
    'nk-48_maang-tikka.jpg',
    'nk-50_maang-tikka.jpg',
    'nk-50_maang-tikka2.jpg',
    'nk-54_anklet-payal.jpg',
    'nk-54_maang-tikka.jpg',
    'nk-54_maang-tikka2.jpg',
  ],
  bangles: [
    'nk-14_temple-kada.jpg',
    'nk-14_temple-kada2.jpg',
    'nk-14_temple-kada3.jpg',
    'nk-15_temple-set.jpg',
    'nk-18_temple-bangle.jpg',
    'nk-18_temple-bangle2.jpg',
    'nk-18_temple-bangle3.jpg',
    'nk-18_temple-bangle4.jpg',
    'nk-19_reverse-bangle.jpg',
  ],
  earrings: [
    'nk-10_cz-climber.jpg',
    'nk-10_cz-green.jpg',
    'nk-10_cz-green2.jpg',
    'nk-10_cz-red.jpg',
    'nk-12_cz-emerald.jpg',
    'nk-12_flower-pink.jpg',
    'nk-12_flower-purple.jpg',
    'nk-12_flower-teal.jpg',
    'nk-12_flower-violet.jpg',
    'nk-18_cz-drop.jpg',
    'nk-25_temple-jhumka.jpg',
    'nk-28_temple-drop.jpg',
    'nk-40_leaf-ruby.jpg',
    'nk-45_temple-jhumka.jpg',
    'nk-46_cz-danglers.jpg',
    'nk-46_CZ-long.jpg',
    'nk-125_jadau-stud.jpg',
    'nk-146_jadau-jhumka.jpg',
  ],
  harams: [
    'nk-24_long-antique.jpg',
    'nk-24_long-chain.jpg',
    'nk-42_long-coin.jpg',
    'nk-465_jadau-kundan.jpg',
    'nk-50_long-green.jpg',
    'nk-57_long-green.jpg',
    'nk-57_long-green-red.jpg',
    'nk-57_long-green2.jpg',
    'nk-57_long-red.jpg',
    'nk-60_long-red.jpg',
    'nk-60_long-temple.jpg',
    'nk-62_long-green.jpg',
    'nk-72_long-green.jpg',
    'nk-72_long-red.jpg',
    'nk-78_long-red.jpg',
  ],
  'maang-tikka': [
    'NK-42-4.jpg',
    'NK-48.jpg',
    'NK-50-8.jpg',
    'NK-50-9.jpg',
    'NK-54-4.jpg',
  ],
  necklaces: [
    'nk-10_medium.jpg',
    'nk-10_medium-chain.jpg',
    'nk-12_choker-flower.jpg',
    'nk-12_choker-flower-red.jpg',
    'nk-13_flower-mixed.jpg',
    'nk-18_medium-chain-ruby.jpg',
    'nk-18_medium-collar.jpg',
    'nk-18_medium-emerald.jpg',
    'nk-18_medium-temple.jpg',
    'nk-18_medium-temple2.jpg',
    'nk-18_medium-temple3.jpg',
    'nk-19_choker-pearl.jpg',
    'nk-19_choker-pearl2.jpg',
    'nk-19_flower-kemp.jpg',
    'nk-19_flower-red.jpg',
    'nk-19_meenakari.jpg',
    'nk-19_medium-chain2.jpg',
    'nk-20_medium-coin.jpg',
    'nk-20_medium-cz.jpg',
    'nk-20_medium-pendant.jpg',
    'nk-22_flower-green.jpg',
    'nk-22_flower-red.jpg',
    'nk-22_flower-ruby.jpg',
    'nk-22_hand-coin.jpg',
    'nk-24_medium-chain.jpg',
    'nk-24_medium-kemp.jpg',
    'nk-24_medium-pendant.jpg',
    'nk-25_hand-kemp-green.jpg',
    'nk-25_hand-kemp-red.jpg',
    'nk-25_medium.jpg',
    'nk-25_medium-chain.jpg',
    'nk-26_kasumala.jpg',
    'nk-26_medium-cz-green.jpg',
    'nk-26_medium-cz-mixed.jpg',
    'nk-26_medium-cz-pendant.jpg',
    'nk-26_medium-cz-pink.jpg',
    'nk-26_medium-cz-ruby.jpg',
    'nk-26_medium-cz-ruby2.jpg',
    'nk-27_reversible.jpg',
    'nk-28_kasumala.jpg',
    'nk-28_medium-kemp.jpg',
    'nk-30_medium.jpg',
    'nk-30_medium-cz.jpg',
    'nk-32_kasumala-green.jpg',
    'nk-32_kasumala-red.jpg',
    'nk-32_kasumala-red2.jpg',
    'nk-34_medium.jpg',
    'nk-36_medium.jpg',
    'nk-36_medium-cz.jpg',
    'nk-39_medium-gold.jpg',
    'nk-39_medium-green.jpg',
    'nk-39_medium-kemp.jpg',
    'nk-40_medium.jpg',
    'nk-40_medium-antique.jpg',
    'nk-40_medium-chain.jpg',
    'nk-40_medium-emerald.jpg',
    'nk-40_medium-flower.jpg',
    'nk-40_medium-temple2.jpg',
    'nk-40_meenakari-blue.jpg',
    'nk-40_meenakari-lotus.jpg',
    'nk-45_elephant.jpg',
    'nk-45_flower-red.jpg',
    'nk-45_medium.jpg',
    'nk-45_medium-kemp.jpg',
    'nk-45_medium-temple2.jpg',
    'nk-45_meenakari-blue.jpg',
    'nk-45_meenakari.jpg',
    'nk-46_medium-cz-multi.jpg',
    'nk-50_choker-green.jpg',
    'nk-50_choker-red.jpg',
    'nk-50_choker-rose.jpg',
    'nk-50_medium-cz-emerald.jpg',
    'nk-50_medium-cz-green.jpg',
    'nk-50_medium-purple.jpg',
    'nk-54_medium.jpg',
    'nk-54_medium-cz-layered.jpg',
    'nk-54_medium-kemp.jpg',
    'nk-55_choker-green.jpg',
    'nk-55_choker-pink.jpg',
    'nk-55_choker-red.jpg',
    'nk-55_choker-teal.jpg',
    'nk-55_medium-flower-green.jpg',
    'nk-55_medium-temple.jpg',
    'nk-55_medium-temple-green.jpg',
  ],
  pendants: [
    'dollar-nk-8_lakshmi-1.jpg',
    'dollar-nk-8_lakshmi-2.jpg',
    'dollar-nk-8_lakshmi-3.jpg',
    'dollar-nk-10_lakshmi-2.jpg',
    'dollar-nk-40_temple-large.jpg',
  ],
};

const AUTO_VARIANT_DEFAULTS = {
  accessories: { material: 'Gold Plated Accessory Design', occasion: ['bridal', 'festive'] },
  bangles: { material: 'Antique Gold Temple Bangle', occasion: ['festive', 'bridal'] },
  earrings: { material: 'Gold Plated Earring Design', occasion: ['festive', 'party'] },
  harams: { material: 'Gold Plated Long Haram Design', occasion: ['bridal', 'festive'] },
  'maang-tikka': { material: 'Gold Plated Maang Tikka', occasion: ['bridal', 'festive'] },
  necklaces: { material: 'Gold Plated Necklace Design', occasion: ['festive', 'bridal'] },
  pendants: { material: 'Gold Plated Pendant Design', occasion: ['daily', 'festive'] },
};

const extractCodeFromText = (text) => {
  const match = String(text || '').match(/NK\s*(\d+)/i);
  return match ? `BS ${match[1]}` : null;
};

const existingImageNames = new Set(
  curatedInventory
    .map((product) => String(product.imageURL || '').split('/').pop().toLowerCase())
    .filter(Boolean)
);

const metadataByCategoryCode = curatedInventory.reduce((acc, product) => {
  const code = extractCodeFromText(product.title) || extractCodeFromText(product.id);
  if (!code) return acc;

  const key = `${product.category}|${code}`;
  if (!acc[key]) {
    acc[key] = {
      material: product.material || null,
      occasion: Array.isArray(product.occasion) && product.occasion.length ? product.occasion : null,
      price: Number.isFinite(product.priceINR) ? product.priceINR : null,
    };
  } else {
    if (!acc[key].material && product.material) acc[key].material = product.material;
    if (!acc[key].occasion && Array.isArray(product.occasion) && product.occasion.length) acc[key].occasion = product.occasion;
    if (acc[key].price == null && Number.isFinite(product.priceINR)) acc[key].price = product.priceINR;
  }

  return acc;
}, {});

const existingIds = new Set(curatedInventory.map((product) => product.id));

const generatedInventoryVariants = Object.entries(AUTO_VARIANT_IMAGE_FILES).flatMap(([category, files]) => {
  return files
    .filter((fileName) => !existingImageNames.has(fileName.toLowerCase()))
    .map((fileName) => {
      const codeMatch = fileName.match(/nk-(\d+)/i);
      if (!codeMatch) return null;

      const code = `BS ${Number(codeMatch[1])}`;
      const metadataKey = `${category}|${code}`;
      const metadata = metadataByCategoryCode[metadataKey] || AUTO_VARIANT_DEFAULTS[category];

      const rawId = `${category}-variant-${fileName.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      let id = rawId;
      let suffix = 2;
      while (existingIds.has(id)) {
        id = `${rawId}-${suffix}`;
        suffix += 1;
      }
      existingIds.add(id);

      return {
        id,
        title: category === 'pendants' ? `Dollar ${code}` : code,
        category,
        ...(category === 'necklaces' ? { structure: fileName.includes('choker') ? 'Choker' : 'Necklace' } : {}),
        material: metadata.material,
        priceINR: metadata.price ?? null,
        originalPrice: null,
        badge: null,
        occasion: metadata.occasion,
        imageURL: `${BASE_PATH}/images/products/${category}/${fileName}`,
        inStock: true,
      };
    })
    .filter(Boolean);
});

export const inventory = [...curatedInventory, ...generatedInventoryVariants];

/* ─── Static Data — Extra Content ────────────────────────── */
export const TESTIMONIALS = [
  {
    id: 1,
    text: "Ordered one of the BS series pendants for my mother and she was moved to tears. The craftsmanship is absolutely stunning — you can feel the care in every detail.",
    name: "Ananya R.",
    location: "Bengaluru, Karnataka",
    initial: "A",
    stars: 5,
  },
  {
    id: 2,
    text: "The packaging alone felt luxurious. Got an BS series piece for my wedding anniversary and my wife hasn't taken it off since. Truly beautiful work.",
    name: "Vikram S.",
    location: "Chennai, Tamil Nadu",
    initial: "V",
    stars: 5,
  },
  {
    id: 3,
    text: "I've gifted Bilwashree pieces to three friends now. Every single one of them asks me where I found such elegant and affordable jewellery. Highly recommend!",
    name: "Priya M.",
    location: "Hyderabad, Telangana",
    initial: "P",
    stars: 5,
  },
];

export const VALUES = [
  { icon: "✦", name: "Fine Craftsmanship", desc: "Every piece is handcrafted with close attention to detail and finish." },
  { icon: "⬡", name: "Ethical Sourcing", desc: "Materials are sourced responsibly, supporting fair-wage artisan communities." },
  { icon: "♻", name: "Sustainability", desc: "Eco-minded packaging and low-waste production processes at our core." },
  { icon: "❧", name: "Timeless Elegance", desc: "Designs that transcend seasons — pieces you will cherish for a lifetime." },
];

export const PROCESS_STEPS = [
  { num: "01", icon: "✎", name: "Design", desc: "Inspired by modern styling and timeless silhouettes" },
  { num: "02", icon: "🤲", name: "Handcraft", desc: "Skilled artisans shape every detail" },
  { num: "03", icon: "✓", name: "Quality Check", desc: "Rigorous inspection for flawless finish" },
  { num: "04", icon: "🎁", name: "Delivered", desc: "Premium packaging, straight to your door" },
];

export const CART_STORAGE_KEY = 'bilvashree_cart_v1';
export const DEMO_PHONE = '919999999999';
export const DEMO_EMAIL = 'demo@bilvashree.com';
export const CARE_INSTRUCTIONS = [
  { icon: '✨', title: 'Gentle Cleaning', desc: 'Use a soft, lint-free cloth to gently wipe your jewellery after each use. Avoid abrasive materials.' },
  { icon: '💧', title: 'Avoid Liquids', desc: 'Keep away from water, perfumes, and lotions. Apply these before putting on your jewellery.' },
  { icon: '🛡️', title: 'Safe Storage', desc: 'Store pieces separately in the provided Bilwashree box or a soft pouch to prevent scratches.' },
  { icon: '☀️', title: 'Sun Protection', desc: 'Avoid prolonged exposure to direct sunlight or extreme heat to preserve the metal luster.' },
];

// data/inventory.js
export const BASE_PATH = '/Bilwashree-jewels';

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

/* ─── Promotional Offers ────────────────────────────────── */
export const OFFERS = [
  { icon: '🏷️', title: 'Offers',          description: 'Welcome! Offer details will be updated soon.', highlight: 'Soon' },
  { icon: '🚚', title: 'Shipping',        description: 'Shipping timelines and terms will be shared shortly.', highlight: 'Soon' },
  { icon: '📢', title: 'Advertisements',  description: 'Campaign and promotional details are coming next.', highlight: 'Soon' },
];

/* ─── Products Inventory ─────────────────────────────────── */
export const inventory = [

  /* ── ORIGINAL PENDANT PRODUCTS ───────────────────────── */
  {
    id: "prod_1",
    title: "NK 1",
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
    title: "NK 2",
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
    title: "NK 3",
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
    title: "NK 4",
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
    title: "NK 5",
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
    title: "NK 6",
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
    title: "NK 7",
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
    id: "nk-55-choker-green",
    title: "NK 55",
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
    id: "nk-55-choker-red",
    title: "NK 55",
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
    id: "nk-55-choker-pink",
    title: "NK 55",
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
    id: "nk-55-choker-teal",
    title: "NK 55",
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
    id: "nk-50-choker-red",
    title: "NK 50",
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
    id: "nk-50-choker-rose",
    title: "NK 50",
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
    id: "nk-50-choker-green",
    title: "NK 50",
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
    id: "nk-19-choker",
    title: "NK 19",
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
    id: "nk-12-choker",
    title: "NK 12",
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
    id: "nk-12-choker-red",
    title: "NK 12",
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
    id: "nk-10-necklace",
    title: "NK 10",
    category: "necklaces",
    structure: "Necklace",
    material: "CZ Stone & Gold Plated",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-10_medium.jpg`,
    inStock: true
  },
  {
    id: "nk-13-necklace",
    title: "NK 13",
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
    id: "nk-18-necklace",
    title: "NK 18",
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
    id: "nk-19-necklace",
    title: "NK 19",
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
    id: "nk-20-necklace",
    title: "NK 20",
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
    id: "nk-22-necklace",
    title: "NK 22",
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
    id: "nk-24-necklace",
    title: "NK 24",
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
    id: "nk-25-necklace",
    title: "NK 25",
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
    id: "nk-26-necklace",
    title: "NK 26",
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
    id: "nk-27-necklace",
    title: "NK 27",
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
    id: "nk-28-necklace",
    title: "NK 28",
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
    id: "nk-30-necklace",
    title: "NK 30",
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
    id: "nk-32-necklace",
    title: "NK 32",
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
    id: "nk-34-necklace",
    title: "NK 34",
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
    id: "nk-36-necklace",
    title: "NK 36",
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
    id: "nk-39-necklace",
    title: "NK 39",
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
    id: "nk-40-necklace",
    title: "NK 40",
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
    id: "nk-45-necklace",
    title: "NK 45",
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
    id: "nk-46-necklace",
    title: "NK 46",
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
    id: "nk-50-necklace",
    title: "NK 50",
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
    id: "nk-54-necklace",
    title: "NK 54",
    category: "necklaces",
    structure: "Necklace",
    material: "Kemp Stone Temple Style",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/nk-54_medium.jpg`,
    inStock: true
  },
  {
    id: "nk-55-necklace",
    title: "NK 55",
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
    id: "nk-42-haram",
    title: "NK 42",
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
    id: "nk-465-haram",
    title: "Jadvikandan NK 465",
    category: "harams",
    structure: "Haram",
    material: "Jadau Kundan Premium",
    priceINR: 4799,
    originalPrice: null,
    badge: "Premium",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/harams/nk-465_jadau-kundan.jpg`,
    inStock: true
  },
  {
    id: "nk-57-haram",
    title: "NK 57",
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
    id: "nk-72-haram",
    title: "NK 72",
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
    id: "nk-78-haram",
    title: "NK 78",
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
    id: "nk-60-haram",
    title: "NK 60",
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
    id: "nk-62-haram",
    title: "NK 62",
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
    id: "nk-50-haram",
    title: "NK 50",
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
    id: "nk-24-haram",
    title: "NK 24",
    category: "harams",
    structure: "Haram",
    material: "Antique Gold Chain Design",
    priceINR: null,
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
    id: "nk-10-earrings",
    title: "NK 10",
    category: "earrings",
    material: "CZ Crystal with Gold Setting",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["party", "daily"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-10_cz-climber.jpg`,
    inStock: true
  },
  {
    id: "nk-12-earrings",
    title: "NK 12",
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
    id: "nk-125-earrings",
    title: "Jadvikandan NK 125",
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
    id: "nk-146-earrings",
    title: "Jadvikandan NK 146",
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
    id: "nk-25-earrings",
    title: "NK 25",
    category: "earrings",
    material: "Antique Gold Temple Style",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-25_temple-jhumka.jpg`,
    inStock: true
  },
  {
    id: "nk-28-earrings",
    title: "NK 28",
    category: "earrings",
    material: "Gold with Pearl Drops",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-28_temple-drop.jpg`,
    inStock: true
  },
  {
    id: "nk-45-earrings",
    title: "NK 45",
    category: "earrings",
    material: "Gold Plated Jhumka Style",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/earrings/nk-45_temple-jhumka.jpg`,
    inStock: true
  },
  {
    id: "nk-46-earrings",
    title: "NK 46",
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
    id: "nk-18-earrings",
    title: "NK 18",
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
    id: "nk-40-earrings",
    title: "NK 40",
    category: "earrings",
    material: "Gold with Ruby Leaf Design",
    priceINR: null,
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
    id: "nk-14-bangles",
    title: "NK 14",
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
    id: "nk-15-bangles",
    title: "NK 15",
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
    id: "nk-18-bangles",
    title: "NK 18",
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
    id: "nk-19-bangles",
    title: "NK 19",
    category: "bangles",
    material: "Reversible Gold Plated",
    priceINR: null,
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
    id: "nk-8-dollar",
    title: "Dollar NK 8",
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
    id: "nk-10-dollar",
    title: "Dollar NK 10",
    category: "pendants",
    material: "Gold Plated Temple Style",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/pendants/dollar-nk-10_lakshmi-2.jpg`,
    inStock: true
  },
  {
    id: "nk-40-dollar",
    title: "Dollar NK 40",
    category: "pendants",
    material: "Large Temple Art Pendant",
    priceINR: null,
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
    id: "nk-48-tikka",
    title: "NK 48",
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
    id: "nk-42-tikka",
    title: "NK 42",
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
    id: "nk-50-tikka",
    title: "NK 50",
    category: "accessories",
    material: "CZ Crystal with Ruby Stone",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/accessories/nk-50_maang-tikka.jpg`,
    inStock: true
  },
  {
    id: "nk-54-tikka",
    title: "NK 54",
    category: "accessories",
    material: "CZ Crystal Layered Design",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/accessories/nk-54_maang-tikka.jpg`,
    inStock: true
  },
  {
    id: "nk-54-anklet",
    title: "NK 54",
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

/* ─── Static Data — Extra Content ────────────────────────── */
export const TESTIMONIALS = [
  {
    id: 1,
    text: "Ordered one of the NK series pendants for my mother and she was moved to tears. The craftsmanship is absolutely stunning — you can feel the care in every detail.",
    name: "Ananya R.",
    location: "Bengaluru, Karnataka",
    initial: "A",
    stars: 5,
  },
  {
    id: 2,
    text: "The packaging alone felt luxurious. Got the Peacock Motif pendant for my wedding anniversary and my wife hasn't taken it off since. Truly beautiful work.",
    name: "Vikram S.",
    location: "Chennai, Tamil Nadu",
    initial: "V",
    stars: 5,
  },
  {
    id: 3,
    text: "I've gifted Bilvashree pieces to three friends now. Every single one of them asks me where I found such elegant and affordable jewellery. Highly recommend!",
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
  { icon: '🛡️', title: 'Safe Storage', desc: 'Store pieces separately in the provided Bilvashree box or a soft pouch to prevent scratches.' },
  { icon: '☀️', title: 'Sun Protection', desc: 'Avoid prolonged exposure to direct sunlight or extreme heat to preserve the metal luster.' },
];

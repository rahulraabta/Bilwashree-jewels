// data/inventory.js
export const BASE_PATH = '/Bilwashree-jewels';

/* ─── Product Categories ─────────────────────────────────── */
export const CATEGORIES = [
  { id: 'all',         name: 'All',          icon: '✦', description: 'Browse our entire collection' },
  { id: 'necklaces',   name: 'Necklaces',    icon: '📿', description: 'Elegant necklaces for every occasion' },
  { id: 'earrings',    name: 'Earrings',     icon: '✧',  description: 'Studs, jhumkas, chandbalis & more' },
  { id: 'bangles',     name: 'Bangles',      icon: '◎', description: 'Traditional kadas & modern bangles' },
  { id: 'pendants',    name: 'Pendants',     icon: '◆', description: 'Sacred temple-inspired pendants' },
  { id: 'rings',       name: 'Rings',        icon: '💍', description: 'Elegant rings for every finger' },
  { id: 'accessories', name: 'Accessories',  icon: '❖',  description: 'Maang tikka, anklets & more' },
];

/* ─── Shop by Occasion ───────────────────────────────────── */
export const OCCASIONS = [
  { id: 'bridal',     name: 'Bridal',      icon: '💒' },
  { id: 'festive',    name: 'Festive',     icon: '🪔' },
  { id: 'party',      name: 'Party',       icon: '🥂' },
  { id: 'office',     name: 'Office Wear', icon: '💼' },
  { id: 'daily',      name: 'Daily Wear',  icon: '🌸' },
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
    title: "Goddess Lakshmi Gold Pendant",
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
    title: "Antique Temple Goddess Pendant",
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
    title: "Peacock Motif Temple Pendant",
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
    title: "Lakshmi Divine Crown Pendant",
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
    title: "Divine Gold Pendant",
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
    title: "Traditional Motif Pendant",
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
    title: "Auspicious Heritage Pendant",
    category: "pendants",
    material: "Antique Finish with Emerald Stones",
    priceINR: 399,
    originalPrice: 799,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/pendant-7.jpg.jpeg`,
    inStock: true
  },

  /* ── NECKLACES (from PDF catalog) ─────────────────────── */
  {
    id: "nk-10",
    title: "Temple Heritage Necklace NK-10",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-10.jpg`,
    inStock: true
  },
  {
    id: "nk-12",
    title: "Traditional Gold Necklace NK-12",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-12.jpg`,
    inStock: true
  },
  {
    id: "nk-13",
    title: "Temple Artisan Necklace NK-13",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-13.jpg`,
    inStock: true
  },
  {
    id: "nk-18",
    title: "Heritage Choker Necklace NK-18",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-18.jpg`,
    inStock: true
  },
  {
    id: "nk-19",
    title: "Elegant Temple Necklace NK-19",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-19.jpg`,
    inStock: true
  },
  {
    id: "nk-20",
    title: "Classic Gold Necklace NK-20",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "office"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-20.jpg`,
    inStock: true
  },
  {
    id: "nk-22",
    title: "South Indian Necklace NK-22",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-22.jpg`,
    inStock: true
  },
  {
    id: "nk-24",
    title: "Handcrafted Temple Necklace NK-24",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-24.jpg`,
    inStock: true
  },
  {
    id: "nk-25",
    title: "Premium Gold Necklace NK-25",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-25.jpg`,
    inStock: true
  },
  {
    id: "nk-26",
    title: "Intricate Temple Necklace NK-26",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-26.jpg`,
    inStock: true
  },
  {
    id: "nk-27-reversible",
    title: "Reversible Temple Necklace NK-27",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["daily", "office", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-27-Reversible.jpg`,
    inStock: true
  },
  {
    id: "nk-28",
    title: "Divine Motif Necklace NK-28",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-28.jpg`,
    inStock: true
  },
  {
    id: "nk-30",
    title: "Traditional Temple Necklace NK-30",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-30.jpg`,
    inStock: true
  },
  {
    id: "nk-32",
    title: "Gold Temple Necklace NK-32",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-32.jpg`,
    inStock: true
  },
  {
    id: "nk-34",
    title: "Heritage Necklace NK-34",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-34.jpg`,
    inStock: true
  },
  {
    id: "nk-35",
    title: "Artisan Temple Necklace NK-35",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-35.jpg`,
    inStock: true
  },
  {
    id: "nk-36",
    title: "Classic Motif Necklace NK-36",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "office"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-36.jpg`,
    inStock: true
  },
  {
    id: "nk-38",
    title: "Sacred Gold Necklace NK-38",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-38.jpg`,
    inStock: true
  },
  {
    id: "nk-39",
    title: "Temple Goddess Necklace NK-39",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-39.jpg`,
    inStock: true
  },
  {
    id: "nk-41",
    title: "Ornate Temple Necklace NK-41",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-41.jpg`,
    inStock: true
  },
  {
    id: "nk-42",
    title: "Grand Temple Necklace NK-42",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-42.jpg`,
    inStock: true
  },
  {
    id: "nk-42-jadau",
    title: "Jadau Kundan Necklace NK-42",
    category: "necklaces",
    material: "Jadau Kundan",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-42-Jadau.jpg`,
    inStock: true
  },
  {
    id: "nk-45",
    title: "Elegant Temple Choker NK-45",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-45.jpg`,
    inStock: true
  },
  {
    id: "nk-46",
    title: "Divine Gold Necklace NK-46",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-46-2.jpg`,
    inStock: true
  },
  {
    id: "nk-50",
    title: "Temple Heirloom Necklace NK-50",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-50.jpg`,
    inStock: true
  },
  {
    id: "nk-54",
    title: "Antique Temple Necklace NK-54",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-54.jpg`,
    inStock: true
  },
  {
    id: "nk-55",
    title: "Grand Festival Necklace NK-55",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-55.jpg`,
    inStock: true
  },
  {
    id: "nk-56",
    title: "Heritage Craft Necklace NK-56",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-56.jpg`,
    inStock: true
  },
  {
    id: "nk-57",
    title: "South Indian Long Necklace NK-57",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-57.jpg`,
    inStock: true
  },
  {
    id: "nk-64",
    title: "Royal Temple Necklace NK-64",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/necklaces/NK-64.jpg`,
    inStock: true
  },
  /* Harams (long necklaces) → category: necklaces */
  {
    id: "nk-40-haram",
    title: "Temple Haram (Long Necklace) NK-40",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/NK-40.jpg`,
    inStock: true
  },
  {
    id: "nk-60-haram",
    title: "Goddess Haram Necklace NK-60",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/NK-60.jpg`,
    inStock: true
  },
  {
    id: "nk-62-haram",
    title: "Grand Temple Haram NK-62",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/harams/NK-62.jpg`,
    inStock: true
  },
  {
    id: "nk-70-haram",
    title: "Royal Heritage Haram NK-70",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/harams/NK-70.jpg`,
    inStock: true
  },
  {
    id: "nk-72-haram",
    title: "Traditional Bridal Haram NK-72",
    category: "necklaces",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/harams/NK-72.jpg`,
    inStock: true
  },

  /* ── EARRINGS (from PDF catalog) ──────────────────────── */
  {
    id: "nk-2-earrings",
    title: "Temple Stud Earrings NK-2",
    category: "earrings",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "office", "festive"],
    imageURL: `${BASE_PATH}/images/products/earrings/NK-2.jpg`,
    inStock: true
  },
  {
    id: "nk-125-jadau-earrings",
    title: "Jadau Kundan Jhumka NK-125",
    category: "earrings",
    material: "Jadau Kundan",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/earrings/NK-125-Jadau.jpg`,
    inStock: true
  },
  {
    id: "nk-146-jadau-earrings",
    title: "Jadau Chandbali Earrings NK-146",
    category: "earrings",
    material: "Jadau Kundan",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive", "party"],
    imageURL: `${BASE_PATH}/images/products/earrings/NK-146-Jadau.jpg`,
    inStock: true
  },
  {
    id: "nk-28-earrings",
    title: "Temple Drop Earrings NK-28",
    category: "earrings",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/earrings/NK-28-2.jpg`,
    inStock: true
  },
  {
    id: "nk-45-earrings",
    title: "Gold Jhumka Earrings NK-45",
    category: "earrings",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "daily"],
    imageURL: `${BASE_PATH}/images/products/earrings/NK-45-2.jpg`,
    inStock: true
  },
  {
    id: "nk-46-earrings",
    title: "Temple Danglers Earrings NK-46",
    category: "earrings",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "party"],
    imageURL: `${BASE_PATH}/images/products/earrings/NK-46.jpg`,
    inStock: true
  },

  /* ── BANGLES (from PDF catalog) ───────────────────────── */
  {
    id: "nk-14-bangles",
    title: "Temple Bangle Set NK-14",
    category: "bangles",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/bangles/NK-14.jpg`,
    inStock: true
  },
  {
    id: "nk-15-bangles",
    title: "Heritage Gold Bangles NK-15",
    category: "bangles",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/bangles/NK-15.jpg`,
    inStock: true
  },
  {
    id: "nk-18-bangles",
    title: "Traditional Bangle Set NK-18",
    category: "bangles",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["festive", "bridal"],
    imageURL: `${BASE_PATH}/images/products/bangles/NK-18-2.jpg`,
    inStock: true
  },
  {
    id: "nk-19-bangles",
    title: "Ornate Temple Bangles NK-19",
    category: "bangles",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/bangles/NK-19-4.jpg`,
    inStock: true
  },

  /* ── PENDANTS (from PDF catalog) ──────────────────────── */
  {
    id: "nk-8-dollar",
    title: "Temple Dollar Pendant NK-8",
    category: "pendants",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "Best Seller",
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/pendants/NK-8-Dollar.jpg`,
    inStock: true
  },
  {
    id: "nk-10-dollar",
    title: "Divine Dollar Pendant NK-10",
    category: "pendants",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["daily", "festive"],
    imageURL: `${BASE_PATH}/images/products/pendants/NK-10-Dollar.jpg`,
    inStock: true
  },
  {
    id: "nk-50-dollar",
    title: "Heritage Dollar Pendant NK-50",
    category: "pendants",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["daily", "office"],
    imageURL: `${BASE_PATH}/images/products/pendants/NK-50-Dollar.jpg`,
    inStock: true
  },

  /* ── ACCESSORIES — Maang Tikka ────────────────────────── */
  {
    id: "nk-48-tikka",
    title: "Temple Maang Tikka NK-48",
    category: "accessories",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/maang-tikka/NK-48.jpg`,
    inStock: true
  },
  {
    id: "nk-42-tikka",
    title: "Ornate Maang Tikka NK-42",
    category: "accessories",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/maang-tikka/NK-42-4.jpg`,
    inStock: true
  },
  {
    id: "nk-50-tikka",
    title: "Grand Bridal Tikka NK-50",
    category: "accessories",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: "New Arrival",
    occasion: ["bridal"],
    imageURL: `${BASE_PATH}/images/products/maang-tikka/NK-50-8.jpg`,
    inStock: true
  },
  {
    id: "nk-54-tikka",
    title: "Heritage Maang Tikka NK-54",
    category: "accessories",
    material: "",
    priceINR: null,
    originalPrice: null,
    badge: null,
    occasion: ["bridal", "festive"],
    imageURL: `${BASE_PATH}/images/products/maang-tikka/NK-54-4.jpg`,
    inStock: true
  },
];

/* ─── Static Data — Extra Content ────────────────────────── */
export const TESTIMONIALS = [
  {
    id: 1,
    text: "Ordered the Goddess Lakshmi pendant for my mother and she was moved to tears. The craftsmanship is absolutely divine — you can feel the love in every detail.",
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
  { icon: "✦", name: "Heritage Craftsmanship", desc: "Every pendant honours centuries of South Indian temple jewellery artistry." },
  { icon: "⬡", name: "Ethical Sourcing", desc: "Materials are sourced responsibly, supporting fair-wage artisan communities." },
  { icon: "♻", name: "Sustainability", desc: "Eco-minded packaging and low-waste production processes at our core." },
  { icon: "❧", name: "Timeless Elegance", desc: "Designs that transcend seasons — pieces you will cherish for a lifetime." },
];

export const PROCESS_STEPS = [
  { num: "01", icon: "✎", name: "Design", desc: "Inspired by temple art & sacred geometry" },
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

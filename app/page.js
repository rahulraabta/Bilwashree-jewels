'use client';

import { useEffect, useState, useCallback, useRef, useMemo, useDeferredValue } from 'react';
import Image from 'next/image';
import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import { getAllProductsQuery, getAllCategoriesQuery, getSettingsQuery } from '../sanity/lib/queries';
import {
  TESTIMONIALS,
  VALUES,
  PROCESS_STEPS,
  CARE_INSTRUCTIONS,
  CART_STORAGE_KEY,
  DEMO_PHONE,
  DEMO_EMAIL
} from '../data/inventory';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import Reveal from './components/Reveal';
import Ornament from './components/Ornament';
import ProductModal from './components/ProductModal';

/* ─── Stars helper ───────────────────────────────────────── */
const Stars = ({ count = 5 }) => {
  return (
    <div className="star-row" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </div>
  );
};

const CLIENT = {
  whatsapp: "919986237677",
  upiId: "9986237677-s1d9@axl",
  upiName: "VINUTHA G",
  paymentApp: "PhonePe",
  qrImage: "/qr-code.png",
  city: "Mysuru",
  brand: "Bilwashree Jewels",
  siteUrl: "bilwashree-jewels.vercel.app"
}

const PRICE_FALLBACK_TEXT = 'Prices will appear soon';

const PRICE_BY_CATEGORY_AND_CODE = {
  accessories: {
    'BS 42': 820,
    'BS 50': 899,
    'BS 54': 860,
  },
  bangles: {
    'BS 14': 350,
    'BS 19': 420,
  },
  earrings: {
    'BS 12': 320,
    'BS 25': 450,
    'BS 28': 499,
    'BS 40': 450,
    'BS 45': 840,
  },
  harams: {
    'BS 24': 450,
    'BS 42': 880,
    'BS 50': 950,
    'BS 57': 999,
    'BS 72': 1299,
    'BS 78': 1360,
  },
  necklaces: {
    'BS 12': 320,
    'BS 19': 420,
    'BS 20': 450,
    'BS 22': 450,
    'BS 24': 450,
    'BS 25': 450,
    'BS 26': 470,
    'BS 27': 450,
    'BS 28': 499,
    'BS 30': 699,
    'BS 34': 699,
    'BS 36': 799,
    'BS 39': 750,
    'BS 45': 840,
    'BS 50': 920,
    'BS 54': 950,
    'BS 55': 930,
  },
  pendants: {
    'BS 8': 399,
    'BS 10': 399,
    'BS 40': 450,
  },
};

const PRICE_BY_CODE = {
  'BS 57': 999,
  'BS 58': 950,
  'BS 72': 1299,
  'BS 78': 1360,
  'BS 82': 1399,
  'BS 118': 1699,
  'BS 175': 1799,
  'BS 465': 4799,
};

const extractBsCode = (value) => {
  const match = String(value || '').match(/(?:BS|NK)\s*-?\s*(\d+)/i);
  return match ? `BS ${match[1]}` : null;
};

const resolveMappedPrice = (product) => {
  const directPrice = Number.isFinite(product?.price) && product.price > 0 ? product.price : null;
  if (directPrice != null) return directPrice;

  const code = extractBsCode(product?.name || product?.title || product?.slug?.current || product?.id);
  const category = String(product?.category || '').toLowerCase();

  return PRICE_BY_CATEGORY_AND_CODE[category]?.[code] ?? PRICE_BY_CODE[code] ?? null;
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [settings, setSettings] = useState({
    title: CLIENT.brand,
    description: 'Celebrating elegant, ethically handcrafted jewellery.',
    contactPhone: CLIENT.whatsapp,
    contactEmail: 'demo@bilwashree.com',
    heroTitle: 'Fine Jewellery with Timeless Impact',
    heroSubtitle: 'Handcrafted excellence.'
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  // Cart & Checkout State
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({ name: "", phone: "", address: "", city: CLIENT.city });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [orderId] = useState("BW" + Math.floor(1000 + Math.random() * 9000));
  const [formErrors, setFormErrors] = useState({});

  const [toastMessage, setToastMessage] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dailyDropSeed, setDailyDropSeed] = useState(() => Math.floor(Math.random() * 100000));
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const toastTimeoutRef = useRef(null);
  const filterTimeoutRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const q = `*[_type == "product"]{ _id, name, price, category, images[]{asset->}, imageURL, slug }`;
      const [productsData, categoriesData, settingsData] = await Promise.all([
        client.fetch(q),
        client.fetch(`*[_type == "category"]{ _id, title, "id": slug.current, icon, description }`),
        client.fetch(`*[_type == "settings"][0]`)
      ]);
      console.log('DEBUG - Fetched products:', productsData);

      const normalized = (productsData ?? []).map(item => {
        const mappedPrice = resolveMappedPrice(item);

        return {
          _id: item?._id,
          id: item?.slug?.current || item?._id,
          name: item?.name,
          title: item?.name,
          priceINR: mappedPrice,
          category: item?.category || '',
          images: item?.images,
          imageURL: item?.imageURL,
          inStock: item?.inStock !== false,
        };
      });
      setInventory(normalized);

      // Change: Filter out items with no category if that's what "other" represents
      const uniqueCategories = [...new Set((normalized ?? []).map(p => p?.category).filter(Boolean))];
      setCategories(uniqueCategories.map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1), icon: '✦' })));

      if (categoriesData) {
        setCategories(prev => {
          const base = [...prev];
          categoriesData.forEach(cat => {
            if (!cat.id) return;
            const index = base.findIndex(b => b.id === cat.id);
            if (index !== -1) {
              base[index] = { ...base[index], ...cat };
              return;
            }
            base.push({ id: cat.id, name: cat.title, icon: cat.icon || '✦' });
          });
          return base;
        });
      }

      if (settingsData) setSettings(prev => ({ ...prev, ...settingsData }));
    } catch (err) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getImageUrl = (product) => {
    if (product?.images?.[0]?.asset) {
      return urlFor(product.images[0]).width(600).url();
    }
    if (product?.imageURL) {
      return product.imageURL.startsWith('/') ? product.imageURL : `/${product.imageURL}`;
    }
    return "/placeholder.png";
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + quantity } : i);
      return [...prev, { _id: product._id, name: product.title, price: product.priceINR, qty: quantity, image: product.imageURL }];
    });
    setToastMessage(`🛍️ Added ${quantity} x ${product.title}`);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const clearCart = () => setCart([]);
  const getTotal = () => cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const getCount = () => cart.reduce((s, i) => s + i.qty, 0);

  const validateStep1 = () => {
    let err = {};
    if (!customerDetails.name) err.name = "Required";
    if (!/^\d{10}$/.test(customerDetails.phone)) err.phone = "10 digit number required";
    if (customerDetails.address.length < 10) err.address = "Detailed address required";
    if (!customerDetails.city) err.city = "Required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleCheckoutNext = () => {
    if (checkoutStep === 1 && validateStep1()) setCheckoutStep(2);
  };

  const confirmOrder = () => {
    if (paymentMethod === "upi" && !transactionId) {
      setFormErrors({ transactionId: "Required" });
      return;
    }
    const msg = `New Order: ${orderId}\nName: ${customerDetails.name}\nPhone: ${customerDetails.phone}\nAddress: ${customerDetails.address}, ${customerDetails.city}\nItems:\n${(cart ?? []).map(i => `- ${i?.name} x ${i?.qty}`).join('\n')}\nTotal: ₹${getTotal()}\nPayment: ${paymentMethod.toUpperCase()}\nTXN ID: ${transactionId || 'N/A'}`;
    window.open(`https://wa.me/${CLIENT.whatsapp}?text=${encodeURIComponent(msg)}`);
    setCheckoutStep(3);
    clearCart();
  };

  const PRICE_FALLBACK_TEXT = 'Price will come soon';
  useEffect(() => {
    try {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    } catch (e) { }
  }, []);

  /* Restore recently viewed */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('bilvashree_recent_v1');
      if (saved) setRecentlyViewed(JSON.parse(saved).slice(0, 6));
    } catch (err) { }
  }, []);

  const addToRecent = useCallback((product) => {
    if (!product?.id) return;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p?.id !== product.id);
      const updated = [product, ...filtered].slice(0, 6);
      try {
        window.localStorage.setItem('bilvashree_recent_v1', JSON.stringify(updated));
      } catch (err) { }
      return updated;
    });
  }, []);

  useEffect(() => {
    if (showCart || showCheckout || selectedProduct) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [showCart, showCheckout, selectedProduct]);

  const SOCIAL_LINKS = [
    { label: 'Instagram', href: 'https://www.instagram.com/', external: true },
    { label: 'WhatsApp', href: `https://wa.me/${settings.contactPhone}?text=Hi!%20I%27m%20interested%20in%20${settings.title}`, external: true },
    { label: 'Email', href: `mailto:${settings.contactEmail}`, external: false },
  ];

  const handleInfoClick = (label) => {
    showToast(`${label} page is coming soon. Please message us on WhatsApp for details.`);
  };

  /* Smooth scroll helpers with better timing and fallback */
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Calculate offset for navbar
    const navbarHeight = 72; // matches --navbar-height
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight - 16;

    // Use native smooth scrolling if available
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers
      window.scrollTo(0, offsetPosition);
    }
  };

  const NAV_LINKS = [
    { id: 'hero', label: 'Home' },
    { id: 'categories', label: 'Categories' },
    { id: 'collection', label: 'Collection' },
    { id: 'about', label: 'Our Story' },
    { id: 'values', label: 'Values' },
    { id: 'reviews', label: 'Reviews' },
  ];

  /* Filter with smooth transition */
  const changeCategory = (catId) => {
    if (catId === activeCategory) return;
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    setIsFiltering(true);
    filterTimeoutRef.current = setTimeout(() => {
      setActiveCategory(catId);
      setIsFiltering(false);
    }, 300);
  };

  const handleSearchQuery = useCallback((value) => {
    const nextQuery = value || '';
    setSearchQuery(nextQuery);

    if (nextQuery.trim()) {
      if (!searchQuery.trim()) {
        scrollToSection('collection');
      }

      if (activeCategory !== 'all') {
        setActiveCategory('all');
      }
    }
  }, [activeCategory, searchQuery]);

  const searchSuggestions = useMemo(() => {
    return categories
      .filter((category) => category.id !== 'all')
      .map((category) => ({
        id: `category-${category.id}`,
        label: category.name,
        type: 'Category',
        categoryId: category.id,
        keywords: category.searchAliases?.length ? category.searchAliases : [category.name.toLowerCase()],
      }));
  }, [categories]);

  const handleSearchSuggestionSelect = useCallback((suggestion) => {
    if (!suggestion?.categoryId) return;

    setSearchQuery(suggestion.label);
    setActiveCategory(suggestion.categoryId);
    scrollToSection('collection');
  }, []);

  const categoryNameById = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return inventory.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const categoryName = (categoryNameById[product.category] || product.category || '').toLowerCase();
      const title = (product.title || '').toLowerCase();
      const material = (product.material || '').toLowerCase();
      const structure = (product.structure || '').toLowerCase();
      const matchesSearch = !normalizedSearchQuery ||
        title.includes(normalizedSearchQuery) ||
        categoryName.includes(normalizedSearchQuery) ||
        material.includes(normalizedSearchQuery) ||
        structure.includes(normalizedSearchQuery);

      return matchesCategory && matchesSearch;
    });
  }, [inventory, activeCategory, categoryNameById, normalizedSearchQuery]);

  const dailyDropProduct = useMemo(() => {
    if (!inventory.length) return null;
    return inventory[dailyDropSeed % inventory.length];
  }, [inventory, dailyDropSeed]);

  const progressRingRadius = 22;
  const progressRingLength = 2 * Math.PI * progressRingRadius;
  const progressRingOffset = progressRingLength - (scrollProgress / 100) * progressRingLength;

  const recommendedProducts = useMemo(() => {
    const seedCategory = selectedProduct?.category || (activeCategory !== 'all' ? activeCategory : recentlyViewed[0]?.category);
    const filtered = inventory.filter((product) => {
      if (selectedProduct?.id && product.id === selectedProduct.id) return false;
      if (seedCategory && product.category !== seedCategory) return false;
      return true;
    });

    const fallback = inventory.filter((product) => product.id !== selectedProduct?.id);
    return (filtered.length ? filtered : fallback).slice(0, 6);
  }, [inventory, activeCategory, recentlyViewed, selectedProduct]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: settings.title,
    description: settings.description,
    telephone: `+${settings.contactPhone}`,
    email: settings.contactEmail,
    priceRange: 'INR 399+',
    makesOffer: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      lowPrice: 399,
      availability: 'https://schema.org/InStock',
      category: 'Fine Jewellery',
    },
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "20px", color: "#1a7a5e", fontWeight: "600" }}>✨ Loading {CLIENT.brand}...</div>;
  if (hasError) return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", gap: "20px" }}>
      <p style={{ fontSize: "18px", color: "#e53e3e" }}>Unable to load. Please refresh.</p>
      <button onClick={() => fetchData()} style={{ padding: "10px 24px", background: "#1a7a5e", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>Retry</button>
    </div>
  );

  return (
    <div className="page-wrapper" style={{ position: "relative" }}>
      <a href="#collection" className="skip-link">Skip to collection</a>

      <Navbar
        navLinks={NAV_LINKS}
        cartCount={getCount()}
        brandName={settings?.title}
        onCartOpen={() => setShowCart(true)}
        scrollToSection={scrollToSection}
        onSearch={handleSearchQuery}
        searchSuggestions={searchSuggestions}
        onSearchSuggestionSelect={handleSearchSuggestionSelect}
      />

      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        brandName={settings.title}
        onShopClick={() => scrollToSection('collection')}
        onStoryClick={() => scrollToSection('about')}
      />

      {/* ── SHOP BY CATEGORY ── */}
      <section id="categories" className="category-section" aria-labelledby="category-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text garamond">Explore</span>
              <span className="eyebrow-line right"></span>
            </div>
            <h2 id="category-heading" className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Discover our meticulously curated collections, designed for every occasion.</p>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="category-grid" role="list">
              {(categories ?? []).filter(c => c?.id !== 'all').map(cat => (
                <div
                  key={cat?.id}
                  className="category-card"
                  role="listitem"
                  tabIndex={0}
                  aria-label={`Explore ${cat.name}`}
                  onClick={() => {
                    changeCategory(cat.id);
                    scrollToSection('collection');
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      changeCategory(cat.id);
                      scrollToSection('collection');
                    }
                  }}
                >
                  <div className="category-bg-gradient" aria-hidden="true"></div>
                  <div className="category-icon" aria-hidden="true">{cat.icon}</div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <span className="category-link">Explore {cat.name} <span>→</span></span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about-section" aria-labelledby="about-heading">
        <div className="about-grid">
          <Reveal className="about-image-wrap">
            <div className="about-image-card">
              <Image
                src="/images/pendant-1.jpg"
                alt="Close-up of a handcrafted Bilwashree pendant"
                width={600}
                height={800}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="about-badge" aria-hidden="true">
              <div className="about-badge-number">100%</div>
              <div className="about-badge-text">Pure Craft</div>
            </div>
          </Reveal>

          <Reveal className="about-text">
            <div className="section-eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              <span className="eyebrow-text garamond">Our Story</span>
            </div>
            <h2 id="about-heading" className="section-title">
              Morality &amp; Purpose<br />at Our Heart
            </h2>
            <p className="about-description">
              At Bilwashree Jewels, we believe that true elegance lies not in ostentation, but in the purity of intent. Our designs are inspired by timeless forms, graceful motifs, and modern wearability for every occasion.
            </p>
            <p className="about-description">
              Every piece we create is a quiet promise: to respect our artisans, deliver reliable quality, and offer jewellery that feels as beautiful as it looks. We do not simply sell jewellery; we celebrate confidence, style, and timeless beauty.
            </p>
            <div className="about-pillars" role="list">
              {['Elegant Design', 'Ethical Craft', 'Lasting Quality', 'Fair Pricing'].map(p => (
                <span key={p} className="about-pillar" role="listitem">✦ {p}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── OUR CRAFTSMANSHIP PROCESS ── */}
      <section className="process-section" aria-labelledby="process-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line" />
              <span className="eyebrow-text garamond">Our Process</span>
              <span className="eyebrow-line right" />
            </div>
            <h2 id="process-heading" className="section-title">From Vision to Treasure</h2>
            <p className="section-subtitle">
              Each pendant passes through hands that have perfected their craft over generations.
            </p>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="process-grid">
              {(settings?.processSteps || (PROCESS_STEPS ?? [])).map(step => (
                <div key={step?.num} className="process-step">
                  <div className="process-step-number">{step?.num}</div>
                  <div className="process-step-icon" aria-hidden="true">{step?.icon}</div>
                  <h3 className="process-step-name">{step?.name}</h3>
                  <p className="process-step-desc">{step?.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── COLLECTION ── */}
      <section id="collection" className="collection-section" aria-labelledby="collection-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line" />
              <span className="eyebrow-text garamond">The Collection</span>
              <span className="eyebrow-line right" />
            </div>
            <h2 id="collection-heading" className="section-title">Premium Jewelry Catalog</h2>
          </Reveal>

          {dailyDropProduct && (
            <Reveal>
              <article className="daily-drop-card" aria-labelledby="daily-drop-title">
                <div className="daily-drop-media">
                  <Image
                    src={getImageUrl(dailyDropProduct)}
                    alt={dailyDropProduct?.title}
                    fill
                    sizes="(max-width: 980px) 100vw, 280px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="daily-drop-content">
                  <p className="daily-drop-tag">Fresh Pick</p>
                  <h3 id="daily-drop-title">Today&apos;s Signature Spark</h3>
                  <p className="daily-drop-name">{dailyDropProduct?.title}</p>
                  <p className="daily-drop-price">
                    {Number.isFinite(dailyDropProduct?.priceINR) && dailyDropProduct?.priceINR > 0
                      ? `₹${dailyDropProduct?.priceINR?.toLocaleString('en-IN')}`
                      : PRICE_FALLBACK_TEXT}
                  </p>
                  <div className="daily-drop-actions">
                    <button
                      type="button"
                      className="btn-drop-refresh"
                      onClick={() => {
                        setDailyDropSeed((prev) => prev + 7);
                        setToastMessage('✨ New signature pick unlocked!');
                      }}
                    >
                      Surprise Me
                    </button>
                    <button
                      type="button"
                      className="btn-drop-view"
                      onClick={() => setSelectedProduct(dailyDropProduct)}
                    >
                      View Piece
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          )}

          {/* Category Filter Pills */}
          <Reveal>
            <div className="category-filters" role="tablist" aria-label="Product categories">
              {(categories ?? []).map(cat => (
                <button
                  key={cat?.id}
                  role="tab"
                  aria-selected={activeCategory === cat?.id}
                  className={`filter-pill ${activeCategory === cat?.id ? 'active' : ''}`}
                  onClick={() => changeCategory(cat?.id)}
                >
                  {cat?.name}
                </button>
              ))}
            </div>
          </Reveal>

          {filteredProducts.length === 0 ? (
            <Reveal className="empty-category-state">
              <div className="empty-icon">✧</div>
              <h3>New Designs Coming Soon</h3>
              <p>We are currently handcrafting new {(categoryNameById[activeCategory] || activeCategory).toLowerCase()} for this collection. Please check back later or explore our other exquisite categories.</p>
              <button
                className="btn-empty"
                onClick={() => {
                  setActiveCategory('all');
                }}
              >
                View All Exquisite Designs
              </button>
            </Reveal>
          ) : (
            <div
              className={`product-grid ${isFiltering ? 'filtering' : ''}`}
              role="list"
            >
              {(filteredProducts ?? []).map(product => (
                <ProductCard
                  key={product?._id || product?.id}
                  product={product}
                  categoryName={categoryNameById[product?.category] || product?.category}
                  onAddToCart={addToCart}
                  onView={() => addToRecent(product)}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RECOMMENDATIONS ── */}
      {recommendedProducts.length > 0 && (
        <section className="recommendation-section" aria-labelledby="recommendation-heading">
          <div className="container">
            <Reveal>
              <div className="section-eyebrow" aria-hidden="true">
                <span className="eyebrow-line" />
                <span className="eyebrow-text garamond">Suggestions</span>
                <span className="eyebrow-line right" />
              </div>
              <h2 id="recommendation-heading" className="section-title">You May Also Like</h2>
              <p className="section-subtitle">
                Handpicked pieces based on your browsing.
              </p>
            </Reveal>

            <div className="product-grid mini-grid" role="list">
              {(recommendedProducts ?? []).map((product) => (
                <ProductCard
                  key={`recommended-${product?._id || product?.id}`}
                  product={product}
                  categoryName={categoryNameById[product?.category] || product?.category}
                  onAddToCart={addToCart}
                  onView={() => addToRecent(product)}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── JEWELRY CARE ── */}
      <section id="care" className="care-section" aria-labelledby="care-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line" />
              <span className="eyebrow-text garamond">Preserve Beauty</span>
              <span className="eyebrow-line right" />
            </div>
            <h2 id="care-heading" className="section-title">Jewellery Care Guide</h2>
            <p className="section-subtitle">A little care goes a long way in preserving the lasting shine of your Bilwashree pieces.</p>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="care-grid">
              {(settings?.careInstructions || (CARE_INSTRUCTIONS ?? [])).map((item, idx) => (
                <div key={idx} className="care-card">
                  <div className="care-icon" aria-hidden="true">{item?.icon}</div>
                  <h3 className="care-title">{item?.title}</h3>
                  <p className="care-desc">{item?.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section id="values" className="values-section" aria-labelledby="values-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line" style={{ background: 'linear-gradient(90deg, transparent, #F0D87A)' }} />
              <span className="eyebrow-text garamond">Why Choose Us</span>
              <span className="eyebrow-line right" style={{ background: 'linear-gradient(90deg, #F0D87A, transparent)' }} />
            </div>
            <h2 id="values-heading" className="section-title">Built on Timeless Values</h2>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="values-grid" role="list">
              {(settings?.values || (VALUES ?? [])).map(v => (
                <div key={v?.name} className="value-card" role="listitem">
                  <div className="value-icon" aria-hidden="true">{v?.icon}</div>
                  <h3 className="value-name">{v?.name}</h3>
                  <p className="value-desc">{v?.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ARTISAN CRAFTSMANSHIP ── */}
      <section id="craftsmanship" className="craftsmanship-section" aria-labelledby="craftsmanship-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line" />
              <span className="eyebrow-text garamond">Our Process</span>
              <span className="eyebrow-line right" />
            </div>
            <h2 id="craftsmanship-heading" className="section-title">Artisan Craftsmanship</h2>
            <p className="section-subtitle">Every piece is born from a story of passion, precision, and timeless heritage.</p>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="craft-grid" role="list">
              {[
                { title: "Design & Sketching", desc: "Every piece begins with an intricate hand-drawn sketch." },
                { title: "Ethical Sourcing", desc: "Carefully selected gemstones that reflect our commitment to integrity." },
                { title: "Handcrafted Quality", desc: "Expert artisans bring life to gold with traditional techniques." }
              ].map((item, idx) => (
                <div key={idx} className="glass-card craft-card" role="listitem">
                  <h3 className="craft-card-title">{item.title}</h3>
                  <p className="craft-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <Reveal>
        <section className="cta-section" aria-label="Call to action">
          <div className="cta-content">
            <h2 className="cta-title">Begin Your {settings.title.split(' ')[0]} Journey</h2>
            <p className="cta-text">
              Discover handcrafted jewellery made for everyday elegance — starting at just ₹399. Gift yourself or someone you love a piece that feels timeless.
            </p>
            <button
              id="cta-shop-btn"
              className="btn-cta"
              onClick={() => scrollToSection('collection')}
              aria-label="Explore the full collection"
            >
              Explore the Full Collection
            </button>
          </div>
        </section>
      </Reveal>

      {/* ── SCROLLING BANNER ── */}
      <section className="marquee-section">
        <div className="marquee-container">
          <div className="marquee-content">
            <span>Handcrafted Heritage • Ethical Luxury • Timeless Elegance • Devoted to Detail • Fine Gemstones</span>
            <span>Handcrafted Heritage • Ethical Luxury • Timeless Elegance • Devoted to Detail • Fine Gemstones</span>
          </div>
        </div>
      </section>

      {/* ── RECENTLY VIEWED ── */}
      {recentlyViewed.length > 0 && (
        <section className="recently-viewed-section" aria-labelledby="recent-heading">
          <div className="container">
            <Reveal>
              <div className="section-eyebrow" aria-hidden="true">
                <span className="eyebrow-line" />
                <span className="eyebrow-text garamond">History</span>
                <span className="eyebrow-line right" />
              </div>
              <h2 id="recent-heading" className="section-title">Recently Viewed</h2>
            </Reveal>
            <div className="product-grid mini-grid">
              {(recentlyViewed ?? []).map(product => (
                <ProductCard
                  key={`recent-${product?._id || product?.id}`}
                  product={product}
                  categoryName={categoryNameById[product?.category] || product?.category}
                  onAddToCart={addToCart}
                  onView={() => { }}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cart & Checkout */}
      {getCount() > 0 && (
        <button
          onClick={() => setShowCart(true)}
          style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000, background: "#1a7a5e", color: "#fff", border: "none", borderRadius: "50px", padding: "14px 20px", cursor: "pointer", fontSize: "18px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: "8px" }}
        >
          🛍️ <span style={{ background: "#e53e3e", color: "#fff", borderRadius: "50%", padding: "2px 8px", fontSize: "12px" }}>{getCount()}</span>
        </button>
      )}

      {showCart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex" }} onClick={() => setShowCart(false)}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", maxWidth: "480px", width: "90%", maxHeight: "80vh", overflowY: "auto", margin: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>🛍️ Your Cart</h2>
              <button onClick={() => setShowCart(false)} style={{ border: "none", background: "none", fontSize: "24px", cursor: "pointer" }}>✕</button>
            </div>
            {cart.length === 0 ? <p>Your cart is empty.</p> : (
              <div style={{ flex: 1 }}>
                {cart.map(item => (
                  <div key={item._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 4px" }}>{item.name}</h4>
                      <p style={{ margin: 0, color: "#666" }}>{item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : PRICE_FALLBACK_TEXT} x {item.qty}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={() => updateQty(item._id, -1)} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid #ddd" }}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, 1)} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid #ddd" }}>+</button>
                      <button onClick={() => removeFromCart(item._id)} style={{ color: "#e53e3e", border: "none", background: "none", marginLeft: "10px" }}>Remove</button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "20px", borderTop: "2px solid #eee", paddingTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "700" }}>
                    <span>Grand Total:</span>
                    <span>₹{getTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                    <button onClick={clearCart} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5" }}>Clear Cart</button>
                    <button onClick={() => { setShowCart(false); setShowCheckout(true); setCheckoutStep(1); }} style={{ flex: 2, padding: "12px", borderRadius: "8px", border: "none", background: "#1a7a5e", color: "#fff", fontWeight: "600" }}>Proceed to Checkout →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showCheckout && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", maxWidth: "480px", width: "90%", maxHeight: "90vh", overflowY: "auto", margin: "auto" }}>
            {/* Step Progress Bar */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "24px", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: checkoutStep >= 1 ? "#1a7a5e" : "#eee", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{checkoutStep > 1 ? "✓" : "1"}</div>
                <span style={{ fontSize: "10px", marginTop: "4px" }}>Details</span>
              </div>
              <div style={{ width: "40px", height: "2px", background: "#eee" }}></div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: checkoutStep >= 2 ? "#1a7a5e" : "#eee", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{checkoutStep > 2 ? "✓" : "2"}</div>
                <span style={{ fontSize: "10px", marginTop: "4px" }}>Payment</span>
              </div>
              <div style={{ width: "40px", height: "2px", background: "#eee" }}></div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: checkoutStep >= 3 ? "#1a7a5e" : "#eee", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
                <span style={{ fontSize: "10px", marginTop: "4px" }}>Confirm</span>
              </div>
            </div>

            {checkoutStep === 1 && (
              <div>
                <h3>1. Customer Details</h3>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>Full Name*</label>
                <input style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", marginBottom: "4px", outline: "none", boxSizing: "border-box" }} value={customerDetails.name} onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })} />
                {formErrors.name && <p style={{ color: "#e53e3e", fontSize: "12px", marginBottom: "8px" }}>{formErrors.name}</p>}

                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", marginTop: "12px" }}>Phone Number*</label>
                <input style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", marginBottom: "4px", outline: "none", boxSizing: "border-box" }} value={customerDetails.phone} onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })} />
                {formErrors.phone && <p style={{ color: "#e53e3e", fontSize: "12px", marginBottom: "8px" }}>{formErrors.phone}</p>}

                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", marginTop: "12px" }}>Delivery Address*</label>
                <textarea style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", marginBottom: "4px", outline: "none", boxSizing: "border-box", height: "80px" }} value={customerDetails.address} onChange={e => setCustomerDetails({ ...customerDetails, address: e.target.value })} />
                {formErrors.address && <p style={{ color: "#e53e3e", fontSize: "12px", marginBottom: "8px" }}>{formErrors.address}</p>}

                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", marginTop: "12px" }}>City / Area*</label>
                <input style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", marginBottom: "4px", outline: "none", boxSizing: "border-box" }} value={customerDetails.city} onChange={e => setCustomerDetails({ ...customerDetails, city: e.target.value })} />
                {formErrors.city && <p style={{ color: "#e53e3e", fontSize: "12px", marginBottom: "8px" }}>{formErrors.city}</p>}

                <button onClick={handleCheckoutNext} style={{ width: "100%", padding: "14px", background: "#1a7a5e", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", marginTop: "20px", cursor: "pointer" }}>Next →</button>
                <button onClick={() => setShowCheckout(false)} style={{ width: "100%", padding: "12px", background: "none", border: "none", color: "#666", marginTop: "10px" }}>Cancel</button>
              </div>
            )}

            {checkoutStep === 2 && (
              <div>
                <h3 style={{ marginBottom: "16px" }}>2. Choose Payment Method</h3>
                <div onClick={() => setPaymentMethod("upi")} style={{ border: paymentMethod === "upi" ? "2px solid #5f259f" : "2px solid #eee", borderRadius: "12px", padding: "20px", cursor: "pointer", marginBottom: "16px", background: paymentMethod === "upi" ? "#fbf7ff" : "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ color: "#5f259f", fontWeight: "700", fontSize: "18px" }}>💜 PhonePe</span>
                    <span style={{ color: "#5f259f", fontWeight: "700", fontSize: "12px", border: "1px solid #5f259f", padding: "2px 6px", borderRadius: "4px" }}>ACCEPTED HERE</span>
                  </div>
                  <p style={{ color: "#666", fontSize: "14px", margin: "0 0 12px", textAlign: "center" }}>Scan & Pay Using PhonePe App</p>
                  <Image
                    src={CLIENT.qrImage}
                    alt="PhonePe QR Code - VINUTHA G"
                    width={200}
                    height={200}
                    style={{ margin: "12px auto", display: "block" }}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                  />
                  <div style={{ display: "none", padding: "20px", border: "2px dashed #5f259f", textAlign: "center", borderRadius: "8px", margin: "12px 0" }}>
                    <p style={{ margin: 0, fontSize: "14px" }}>UPI ID: <b>{CLIENT.upiId}</b></p>
                    <p style={{ fontSize: "12px", color: "#666" }}>Name: {CLIENT.upiName}</p>
                  </div>
                  <p style={{ textAlign: "center", fontSize: "16px", fontWeight: "600", margin: "8px 0" }}>{CLIENT.upiName}</p>

                  {paymentMethod === "upi" && (
                    <div style={{ marginTop: "16px", borderTop: "1px solid #e0d5f0", paddingTop: "12px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Enter 12-digit UPI Transaction ID*</label>
                      <input
                        style={{ width: "100%", padding: "12px", border: "1px solid #5f259f", borderRadius: "8px", outline: "none", fontSize: "16px" }}
                        placeholder="e.g. 412345678901"
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                      />
                      {formErrors.transactionId && <p style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{formErrors.transactionId}</p>}
                    </div>
                  )}
                </div>

                <div onClick={() => setPaymentMethod("cod")} style={{ border: paymentMethod === "cod" ? "2px solid #1a7a5e" : "2px solid #eee", borderRadius: "12px", padding: "16px", cursor: "pointer", background: paymentMethod === "cod" ? "#f4fcf9" : "#fff" }}>
                  <div style={{ fontWeight: "700", color: "#1a7a5e" }}>🚚 Cash on Delivery (COD)</div>
                  <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>Pay when you receive your order at your doorstep.</p>
                </div>

                <button onClick={confirmOrder} style={{ width: "100%", padding: "16px", background: "#1a7a5e", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", marginTop: "24px", cursor: "pointer", fontSize: "16px" }}>Place Order & Confirm via WhatsApp</button>
                <button onClick={() => setCheckoutStep(1)} style={{ width: "100%", padding: "12px", background: "none", border: "none", color: "#666", marginTop: "10px", cursor: "pointer" }}>← Back to Details</button>
              </div>
            )}

            {checkoutStep === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎉</div>
                <h3>Order Placed!</h3>
                <p>Order ID: <b>{orderId}</b></p>
                <p style={{ color: "#666" }}>Please click the button to send your details on WhatsApp to complete the process.</p>
                <button onClick={() => setShowCheckout(false)} style={{ width: "100%", padding: "14px", background: "#1a7a5e", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", marginTop: "20px" }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}


      <Footer
        navLinks={NAV_LINKS}
        socialLinks={SOCIAL_LINKS}
        brandName={settings.title}
        brandDesc={settings.description}
        onInfoClick={handleInfoClick}
        scrollToSection={scrollToSection}
      />

      {/* ── PRODUCT MODAL ── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          categoryName={categoryNameById[selectedProduct.category] || selectedProduct.category}
          contactPhone={settings.contactPhone}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <button
        type="button"
        className={`scroll-progress-btn ${scrollProgress > 8 ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg viewBox="0 0 52 52" aria-hidden="true">
          <circle className="ring-track" cx="26" cy="26" r={progressRingRadius} />
          <circle
            className="ring-fill"
            cx="26"
            cy="26"
            r={progressRingRadius}
            style={{
              strokeDasharray: progressRingLength,
              strokeDashoffset: progressRingOffset,
            }}
          />
        </svg>
        <span className="scroll-progress-value">{Math.round(scrollProgress)}%</span>
      </button>

      {/* ── TOAST ── */}
      <div
        className={`toast ${toastMessage ? 'show' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="toast-icon" aria-hidden="true">✨</span>
        {toastMessage}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}

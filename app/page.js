'use client';

import { useEffect, useState, useCallback, useRef, useMemo, useDeferredValue } from 'react';
import Image from 'next/image';
import {
  inventory,
  CATEGORIES,
  BASE_PATH,
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
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Reveal from './components/Reveal';
import Ornament from './components/Ornament';
import ProductModal from './components/ProductModal';

/* ─── Stars helper ───────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className="star-row" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </div>
  );
}

const VIBE_FILTERS = [
  { id: 'all', label: 'All Vibes', icon: '✨' },
  { id: 'daily', label: 'Daily Glow', icon: '☀️' },
  { id: 'party', label: 'Evening Spark', icon: '🌙' },
  { id: 'festive', label: 'Festive Aura', icon: '🎉' },
  { id: 'bridal', label: 'Bridal Drama', icon: '👑' },
  { id: 'office', label: 'Work Chic', icon: '💼' },
];

const CATEGORY_SEARCH_ALIASES = {
  necklaces: ['necklace', 'necklaces', 'neck', 'chain', 'choker', 'c'],
  earrings: ['ear', 'ears', 'earring', 'earrings', 'stud', 'jhumka'],
  pendants: ['pendant', 'pendants', 'dollar'],
  bangles: ['bangle', 'bangles', 'kada', 'bracelet'],
  harams: ['haram', 'harams', 'long necklace'],
  accessories: ['accessory', 'accessories', 'anklet', 'maang tikka'],
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVibe, setActiveVibe] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dailyDropSeed, setDailyDropSeed] = useState(() => Math.floor(Math.random() * 100000));
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const toastTimeoutRef = useRef(null);
  const filterTimeoutRef = useRef(null);

  /* Scrollbar width calculation for smooth body lock */
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  }, []);

  /* Restore cart from previous session */
  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) return;

      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) return;

      const normalized = parsed
        .filter((item) => item?.product?.id && Number.isFinite(item?.qty) && item.qty > 0)
        .map((item) => ({ ...item, qty: Math.floor(item.qty) }));

      setCartItems(normalized);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  /* Persist cart for refresh continuity */
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors silently
    }
  }, [cartItems]);

  /* Persistence for recently viewed */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('bilvashree_recent_v1');
      if (saved) setRecentlyViewed(JSON.parse(saved).slice(0, 6));
    } catch { }
  }, []);

  const addToRecent = useCallback((product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 6);
      try {
        window.localStorage.setItem('bilvashree_recent_v1', JSON.stringify(updated));
      } catch {
        // Ignore storage errors silently
      }
      return updated;
    });
  }, []);
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }
    return () => {
      document.body.classList.remove('cart-open');
      document.body.classList.remove('nav-open');
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedProduct]);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight <= 0 ? 0 : Math.min(100, (scrollTop / scrollHeight) * 100);
      setScrollProgress(nextProgress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* ESC closes open drawers */
  useEffect(() => {
    if (!isCartOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  /* Toast */
  const showToast = useCallback((message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(''), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  /* Add to cart */
  const handleAddToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    setIsCartOpen(true);
    showToast(`✨ "${product.title}" added to cart!`);
  }, [showToast]);

  const openProductQuickView = (product) => {
    setSelectedProduct(product);
    addToRecent(product);
  };

  /* Cart Operations */
  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + ((item.product.priceINR ?? 0) * item.qty), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  /* Checkout Methods */
  const generateOrderSummary = () => {
    let text = `Hello Bilvashree Jewels! I would like to place an order:\n\n`;
    cartItems.forEach(item => {
      text += `- ${item.qty}x ${item.product.title} (₹${(item.product.priceINR ?? 0) * item.qty})\n`;
    });
    text += `\n*Total:* ₹${cartTotal}`;
    return text;
  };

  const checkoutWhatsApp = () => {
    const text = encodeURIComponent(generateOrderSummary());
    window.open(`https://wa.me/${DEMO_PHONE}?text=${text}`, '_blank');
  };

  const checkoutEmail = () => {
    const subject = encodeURIComponent("New Order Request - Bilvashree Jewels");
    const body = encodeURIComponent(generateOrderSummary() + "\n\nMy Shipping Details:\n[Please provide your address here]");
    window.open(`mailto:${DEMO_EMAIL}?subject=${subject}&body=${body}`);
  };

  const SOCIAL_LINKS = [
    { label: 'Instagram', href: 'https://www.instagram.com/', external: true },
    { label: 'WhatsApp', href: `https://wa.me/${DEMO_PHONE}?text=Hi!%20I%27m%20interested%20in%20Bilvashree%20Jewels`, external: true },
    { label: 'Email', href: `mailto:${DEMO_EMAIL}`, external: false },
  ];

  const handleInfoClick = (label) => {
    showToast(`${label} page is coming soon. Please message us on WhatsApp for details.`);
  };

  /* Smooth scroll helpers */
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      if (activeVibe !== 'all') {
        setActiveVibe('all');
      }
    }
  }, [activeCategory, activeVibe, searchQuery]);

  const searchSuggestions = useMemo(() => {
    return CATEGORIES
      .filter((category) => category.id !== 'all')
      .map((category) => ({
        id: `category-${category.id}`,
        label: category.name,
        type: 'Category',
        categoryId: category.id,
        keywords: CATEGORY_SEARCH_ALIASES[category.id] || [category.name.toLowerCase()],
      }));
  }, []);

  const handleSearchSuggestionSelect = useCallback((suggestion) => {
    if (!suggestion?.categoryId) return;

    setSearchQuery(suggestion.label);
    setActiveVibe('all');
    setActiveCategory(suggestion.categoryId);
    scrollToSection('collection');
  }, []);

  const categoryNameById = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, []);

  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return inventory.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesVibe = activeVibe === 'all' || product.occasion?.includes(activeVibe);
      const categoryName = (categoryNameById[product.category] || product.category || '').toLowerCase();
      const title = (product.title || '').toLowerCase();
      const material = (product.material || '').toLowerCase();
      const structure = (product.structure || '').toLowerCase();
      const matchesSearch = !normalizedSearchQuery ||
        title.includes(normalizedSearchQuery) ||
        categoryName.includes(normalizedSearchQuery) ||
        material.includes(normalizedSearchQuery) ||
        structure.includes(normalizedSearchQuery);

      return matchesCategory && matchesVibe && matchesSearch;
    });
  }, [activeCategory, activeVibe, categoryNameById, normalizedSearchQuery]);

  const vibeCounts = useMemo(() => {
    return VIBE_FILTERS.reduce((acc, vibe) => {
      if (vibe.id === 'all') {
        acc[vibe.id] = inventory.length;
        return acc;
      }

      acc[vibe.id] = inventory.filter((product) => product.occasion?.includes(vibe.id)).length;
      return acc;
    }, {});
  }, []);

  const dailyDropProduct = useMemo(() => {
    const vibeMatchedPool = activeVibe === 'all'
      ? inventory
      : inventory.filter((product) => product.occasion?.includes(activeVibe));
    const eligiblePool = vibeMatchedPool.length ? vibeMatchedPool : inventory;
    if (!eligiblePool.length) return null;
    return eligiblePool[dailyDropSeed % eligiblePool.length];
  }, [activeVibe, dailyDropSeed]);

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
  }, [activeCategory, recentlyViewed, selectedProduct]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Bilvashree Jewels',
    description: 'Handcrafted fine jewellery with ethical craftsmanship and premium finishing.',
    telephone: `+${DEMO_PHONE}`,
    email: DEMO_EMAIL,
    priceRange: 'INR 399+',
    makesOffer: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      lowPrice: 399,
      availability: 'https://schema.org/InStock',
      category: 'Fine Jewellery',
    },
  };

  return (
    <div className="page-wrapper">
      <a href="#collection" className="skip-link">Skip to collection</a>

      <Navbar
        navLinks={NAV_LINKS}
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        scrollToSection={scrollToSection}
        onSearch={handleSearchQuery}
        searchSuggestions={searchSuggestions}
        onSearchSuggestionSelect={handleSearchSuggestionSelect}
      />

      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cartItems}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onClose={() => setIsCartOpen(false)}
        updateQuantity={updateQuantity}
        checkoutWhatsApp={checkoutWhatsApp}
        checkoutEmail={checkoutEmail}
        scrollToSection={scrollToSection}
      />

      <Hero
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
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <div
                  key={cat.id}
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
                src={`${BASE_PATH}/images/pendant-1.jpg.jpeg`}
                alt="Close-up of a handcrafted Bilvashree pendant"
                width={600}
                height={800}
                style={{ objectFit: 'cover' }}
                unoptimized
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
              At Bilvashree Jewels, we believe that true elegance lies not in ostentation, but in the purity of intent. Our designs are inspired by timeless forms, graceful motifs, and modern wearability for every occasion.
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
              {PROCESS_STEPS.map(step => (
                <div key={step.num} className="process-step">
                  <div className="process-step-number">{step.num}</div>
                  <div className="process-step-icon" aria-hidden="true">{step.icon}</div>
                  <h3 className="process-step-name">{step.name}</h3>
                  <p className="process-step-desc">{step.desc}</p>
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
            <Reveal className="vibe-lab">
              <article className="daily-drop-card" aria-labelledby="daily-drop-title">
                <div className="daily-drop-media">
                  <Image
                    src={dailyDropProduct.imageURL}
                    alt={dailyDropProduct.title}
                    fill
                    sizes="(max-width: 980px) 100vw, 280px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
                <div className="daily-drop-content">
                  <p className="daily-drop-tag">Fresh Pick</p>
                  <h3 id="daily-drop-title">Today&apos;s Signature Spark</h3>
                  <p className="daily-drop-name">{dailyDropProduct.title}</p>
                  <p className="daily-drop-price">
                    {Number.isFinite(dailyDropProduct.priceINR)
                      ? `₹${dailyDropProduct.priceINR.toLocaleString('en-IN')}`
                      : 'Price on Request'}
                  </p>
                  <div className="daily-drop-actions">
                    <button
                      type="button"
                      className="btn-drop-refresh"
                      onClick={() => {
                        setDailyDropSeed((prev) => prev + 7);
                        showToast('✨ New signature pick unlocked!');
                      }}
                    >
                      Surprise Me
                    </button>
                    <button
                      type="button"
                      className="btn-drop-view"
                      onClick={() => openProductQuickView(dailyDropProduct)}
                    >
                      View Piece
                    </button>
                  </div>
                </div>
              </article>

              <div className="vibe-filter-card" role="region" aria-label="Filter by vibe">
                <div className="vibe-filter-head">
                  <h3>Choose Your Vibe</h3>
                  <p>Instantly reshape the catalog by mood and occasion.</p>
                </div>
                <div className="vibe-chip-grid" role="tablist" aria-label="Vibe filters">
                  {VIBE_FILTERS.map((vibe) => (
                    <button
                      key={vibe.id}
                      type="button"
                      role="tab"
                      aria-selected={activeVibe === vibe.id}
                      className={`vibe-chip ${activeVibe === vibe.id ? 'active' : ''}`}
                      onClick={() => setActiveVibe(vibe.id)}
                    >
                      <span aria-hidden="true">{vibe.icon}</span>
                      <span>{vibe.label}</span>
                      <span className="vibe-count">{vibeCounts[vibe.id] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Category Filter Pills */}
          <Reveal>
            <div className="category-filters" role="tablist" aria-label="Product categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => changeCategory(cat.id)}
                >
                  {cat.name}
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
                    setActiveCategory('pendants');
                  }}
                >
                  View Available Pendants
                </button>
             </Reveal>
          ) : (
            <div
              className={`product-grid ${isFiltering ? 'filtering' : ''}`}
              role="list"
            >
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryNameById[product.category] || product.category}
                  onAddToCart={handleAddToCart}
                  onView={() => addToRecent(product)}
                  onClick={() => openProductQuickView(product)}
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
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={`recommended-${product.id}`}
                  product={product}
                  categoryName={categoryNameById[product.category] || product.category}
                  onAddToCart={handleAddToCart}
                  onView={() => addToRecent(product)}
                  onClick={() => openProductQuickView(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GIFTING GUIDE ── */}
      <section id="gifting" className="gifting-section" aria-labelledby="gifting-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line" />
              <span className="eyebrow-text garamond">Gifting</span>
              <span className="eyebrow-line right" />
            </div>
            <h2 id="gifting-heading" className="section-title">Perfect Gifts for Every Moment</h2>
            <p className="section-subtitle">Discover our curated gift selections designed to make every occasion unforgettable.</p>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="gifting-grid">
              <div
                className="gift-card"
                role="button"
                tabIndex={0}
                onClick={() => { scrollToSection('collection'); }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    scrollToSection('collection');
                  }
                }}
              >
                <div className="gift-bg">
                  <Image src={`${BASE_PATH}/images/pendant-2.jpg.jpeg`} alt="Gifts for Her" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div className="gift-overlay" />
                <div className="gift-content">
                  <h3 className="gift-title">For Her</h3>
                  <p className="gift-desc">Elegant pendants and necklaces she will cherish forever.</p>
                  <span className="gift-btn">Explore Gifts</span>
                </div>
              </div>

              <div
                className="gift-card"
                role="button"
                tabIndex={0}
                onClick={() => { scrollToSection('collection'); }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    scrollToSection('collection');
                  }
                }}
              >
                <div className="gift-bg">
                  <Image src={`${BASE_PATH}/images/pendant-1.jpg.jpeg`} alt="Wedding Gifts" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div className="gift-overlay" />
                <div className="gift-content">
                  <h3 className="gift-title">The Bride</h3>
                  <p className="gift-desc">Statement bridal sets for the most special day of her life.</p>
                  <span className="gift-btn">Explore Bridal</span>
                </div>
              </div>

              <div
                className="gift-card"
                role="button"
                tabIndex={0}
                onClick={() => { scrollToSection('collection'); }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    scrollToSection('collection');
                  }
                }}
              >
                <div className="gift-bg">
                  <Image src={`${BASE_PATH}/images/pendant-5.jpg.jpeg`} alt="Anniversary Gifts" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div className="gift-overlay" />
                <div className="gift-content">
                  <h3 className="gift-title">Daily Elegance</h3>
                  <p className="gift-desc">Minimal and stylish designs for her everyday celebrations.</p>
                  <span className="gift-btn">Explore Collection</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

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
            <p className="section-subtitle">A little care goes a long way in preserving the lasting shine of your Bilvashree pieces.</p>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="care-grid">
              {CARE_INSTRUCTIONS.map((item, idx) => (
                <div key={idx} className="care-card">
                  <div className="care-icon" aria-hidden="true">{item.icon}</div>
                  <h3 className="care-title">{item.title}</h3>
                  <p className="care-desc">{item.desc}</p>
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
              {VALUES.map(v => (
                <div key={v.name} className="value-card" role="listitem">
                  <div className="value-icon" aria-hidden="true">{v.icon}</div>
                  <h3 className="value-name">{v.name}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" className="testimonials-section" aria-labelledby="reviews-heading">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow" aria-hidden="true">
              <span className="eyebrow-line" />
              <span className="eyebrow-text garamond">Customer Stories</span>
              <span className="eyebrow-line right" />
            </div>
            <h2 id="reviews-heading" className="section-title">Loved by Many</h2>
            <p className="section-subtitle">Real stories from real customers who wear their hearts in gold.</p>
          </Reveal>

          <Reveal className="reveal-stagger">
            <div className="testimonials-grid" role="list">
              {TESTIMONIALS.map(t => (
                <blockquote key={t.id} className="testimonial-card" role="listitem">
                  <div className="testimonial-quote" aria-hidden="true">&ldquo;</div>
                  <Stars count={t.stars} />
                  <p className="testimonial-text">{t.text}</p>
                  <footer className="testimonial-author">
                    <div className="testimonial-avatar" aria-hidden="true">{t.initial}</div>
                    <div>
                      <p className="testimonial-name">{t.name}</p>
                      <p className="testimonial-location">{t.location}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <Reveal>
        <section className="cta-section" aria-label="Call to action">
          <div className="cta-content">
            <h2 className="cta-title">Begin Your Jewellery Journey</h2>
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

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="container">
          <Reveal className="newsletter-content">
            <h2 className="newsletter-title">Join the Bilvashree Circle</h2>
            <p className="newsletter-desc">Be the first to discover our new collections, styling stories, and exclusive offers.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); showToast('✨ Welcome to the circle!'); }}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="btn-newsletter">Join Now</button>
            </form>
          </Reveal>
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
              {recentlyViewed.map(product => (
                <ProductCard
                  key={`recent-${product.id}`}
                  product={product}
                  categoryName={categoryNameById[product.category] || product.category}
                  onAddToCart={handleAddToCart}
                  onView={() => {}} // No need to re-add to recent
                  onClick={() => openProductQuickView(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer
        navLinks={NAV_LINKS}
        socialLinks={SOCIAL_LINKS}
        onInfoClick={handleInfoClick}
        scrollToSection={scrollToSection}
      />

      {/* ── PRODUCT MODAL ── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          categoryName={categoryNameById[selectedProduct.category] || selectedProduct.category}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
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

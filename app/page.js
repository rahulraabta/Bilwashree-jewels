'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { inventory, CATEGORIES, OCCASIONS, OFFERS } from '../data/inventory';

/* ─── Static data ─────────────────────────────────────────── */
const TESTIMONIALS = [
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

const VALUES = [
  { icon: "✦", name: "Heritage Craftsmanship", desc: "Every pendant honours centuries of South Indian temple jewellery artistry." },
  { icon: "⬡", name: "Ethical Sourcing", desc: "Materials are sourced responsibly, supporting fair-wage artisan communities." },
  { icon: "♻", name: "Sustainability", desc: "Eco-minded packaging and low-waste production processes at our core." },
  { icon: "❧", name: "Timeless Elegance", desc: "Designs that transcend seasons — pieces you will cherish for a lifetime." },
];

const PROCESS_STEPS = [
  { num: "01", icon: "✎", name: "Design", desc: "Inspired by temple art & sacred geometry" },
  { num: "02", icon: "🤲", name: "Handcraft", desc: "Skilled artisans shape every detail" },
  { num: "03", icon: "✓", name: "Quality Check", desc: "Rigorous inspection for flawless finish" },
  { num: "04", icon: "🎁", name: "Delivered", desc: "Premium packaging, straight to your door" },
];

const MARQUEE_ITEMS = [
  "Free Shipping on All Orders",
  "Handcrafted with Love",
  "Starting at ₹399",
  "100% Satisfaction Guaranteed",
  "Ethically Sourced Materials",
  "Premium Gift Packaging",
  "Temple Jewellery Heritage",
  "Trusted by 500+ Customers",
];

const CART_STORAGE_KEY = 'bilvashree_cart_v1';
const DEMO_PHONE = '919999999999';
const DEMO_EMAIL = 'demo@bilvashree.com';

/* ─── Stars helper ───────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className="star-row" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </div>
  );
}

/* ─── Marquee Strip ──────────────────────────────────────── */
function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-track">
        {items.map((text, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────── */
export default function Home() {
  const [products]                    = useState(inventory);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeOccasion, setActiveOccasion] = useState('all');
  const [loading]                     = useState(false);
  const [cartItems, setCartItems]     = useState([]);
  const [isCartOpen, setIsCartOpen]   = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const navRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  /* Reveal on scroll */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  /* Navbar scroll effect */
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 80) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile nav on resize */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileNavOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  /* Lock body scroll when overlays are open */
  useEffect(() => {
    if (mobileNavOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen, isCartOpen]);

  /* ESC closes open drawers */
  useEffect(() => {
    if (!mobileNavOpen && !isCartOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
        setIsCartOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen, isCartOpen]);

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
  const freeShippingRemaining = Math.max(0, 999 - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / 999) * 100);

  /* Checkout Methods */
  const generateOrderSummary = () => {
    let text = `Hello Bilvashree Jewels! I would like to place an order:\n\n`;
    cartItems.forEach(item => {
      text += `- ${item.qty}x ${item.product.title} (₹${(item.product.priceINR ?? 0) * item.qty})\n`;
    });
    text += `\n*Total:* ₹${cartTotal}`;
    if (cartTotal >= 999) text += ` (Free Shipping eligible)`;
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
    setMobileNavOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const NAV_LINKS = [
    { id: 'hero', label: 'Home' },
    { id: 'categories', label: 'Categories' },
    { id: 'collection', label: 'Collection' },
    { id: 'about', label: 'Our Story' },
    { id: 'values', label: 'Values' },
    { id: 'reviews', label: 'Reviews' },
  ];

  /* Filter computed property */
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesOccasion = activeOccasion === 'all' || product.occasion?.includes(activeOccasion);

    return matchesCategory && matchesOccasion;
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Bilvashree Jewels',
    description: 'Handcrafted South Indian temple jewellery with ethical craftsmanship and premium finishing.',
    telephone: `+${DEMO_PHONE}`,
    email: DEMO_EMAIL,
    priceRange: 'INR 399+',
    makesOffer: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      lowPrice: 399,
      availability: 'https://schema.org/InStock',
      category: 'Temple Jewellery',
    },
  };

  return (
    <div className="page-wrapper">
      <a href="#collection" className="skip-link">Skip to collection</a>

      {/* ── NAV BAR ── */}
      <nav ref={navRef} className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-brand">
          <span className="navbar-brand-name">Bilvashree Jewels</span>
          <span className="navbar-brand-tagline">Premium Temple Jewellery</span>
        </div>

        <ul className="navbar-links">
          {NAV_LINKS.map(link => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            id="navbar-cart-button"
            className="navbar-cart-btn"
            onClick={() => {
              setMobileNavOpen(false);
              setIsCartOpen(true);
            }}
            aria-label={`Cart with ${cartCount} items`}
          >
            🛍
            {cartCount > 0 && (
              <span className="cart-badge" aria-live="polite">{cartCount}</span>
            )}
            Cart
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger-btn ${mobileNavOpen ? 'open' : ''}`}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Nav Overlay ── */}
      <div
        className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />
      <div className={`mobile-nav-drawer ${mobileNavOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <span className="mobile-nav-brand">Bilvashree Jewels</span>
        <ul className="mobile-nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── CART DRAWER ── */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} aria-hidden="true" />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <div className="cart-header">
          <h2>Your Cart ({cartCount})</h2>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {/* Free Shipping Progress */}
        <div className="cart-shipping-bar">
          <p className="shipping-text">
            {cartTotal >= 999 ? "✨ You've unlocked Free Shipping!" : `Add ₹${freeShippingRemaining.toLocaleString('en-IN')} more for Free Shipping!`}
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-msg">
              <span className="empty-cart-icon">🛍️</span>
              <p>Your cart is currently empty.</p>
              <button className="btn-empty" onClick={() => { setIsCartOpen(false); scrollToSection('collection'); }}>Shop Now</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.product.id} className="cart-item">
                <img
                  src={item.product.imageURL}
                  alt={item.product.title}
                  className="cart-item-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.product.title}</h4>
                  <p className="cart-item-price">{item.product.priceINR != null ? `₹${item.product.priceINR.toLocaleString('en-IN')}` : 'Price TBD'}</p>
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.product.id, -1)} aria-label="Decrease quantity">−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => updateQuantity(item.product.id, -item.qty)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <p className="cart-tax-note">Shipping & taxes calculated at checkout.</p>
          <div className="checkout-actions">
            <button className="btn-checkout-wa" onClick={checkoutWhatsApp} disabled={cartItems.length === 0}>
              ✦ Checkout via WhatsApp
            </button>
            <button className="btn-checkout-email" onClick={checkoutEmail} disabled={cartItems.length === 0}>
              ✉ Checkout via Email
            </button>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section id="hero" className="hero-section" aria-label="Hero banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/main-banner.jpg"
          alt="Bilvashree Jewels — Luxury gemstone jewellery collection with amethyst and emerald"
          className="hero-bg-image"
          fetchPriority="high"
        />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-eyebrow" aria-hidden="true">
            <span className="hero-eyebrow-dot" />
            Temple Heritage Collection
          </div>

          <h1 className="hero-title">
            Jewels Crafted with<br /><em>Divine Artistry</em>
          </h1>

          <p className="hero-subtitle">
            Every pendant tells a story rooted in devotion, heritage, and timeless Indian craftsmanship. Adorned by queens, cherished by souls.
          </p>

          <div className="hero-actions">
            <button
              id="hero-shop-now-btn"
              className="btn-hero-primary"
              onClick={() => scrollToSection('collection')}
              aria-label="Shop the collection"
            >
              Shop the Collection
            </button>
            <button
              id="hero-our-story-btn"
              className="btn-hero-secondary"
              onClick={() => scrollToSection('about')}
              aria-label="Learn our story"
            >
              Our Story
            </button>
          </div>
        </div>

        <div className="hero-scroll-hint" aria-hidden="true" onClick={() => scrollToSection('collection')}>
          <span className="hero-scroll-arrow">↓</span>
          Scroll
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar" aria-label="Trust statistics">
        <div className="trust-bar-grid">
          {[
            { number: '7+',    label: 'Curated Pieces' },
            { number: '100%',  label: 'Handcrafted' },
            { number: '₹399',  label: 'Starting Price' },
            { number: '★ 5.0', label: 'Customer Rating' },
          ].map(item => (
            <div key={item.label} className="trust-item">
              <div className="trust-number">{item.number}</div>
              <div className="trust-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <MarqueeStrip />

      {/* ── OFFERS BANNER ── */}
      <section className="offers-banner" aria-label="Current promotions">
        <div className="offers-grid">
          {OFFERS.map((offer, i) => (
            <div key={i} className="offer-card">
              <span className="offer-icon" aria-hidden="true">{offer.icon}</span>
              <div className="offer-text-group">
                <span className="offer-title">{offer.title}</span>
                <span className="offer-desc">{offer.description}</span>
              </div>
              <span className="offer-highlight">{offer.highlight}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section id="categories" className="category-section reveal" aria-labelledby="category-heading">
        <div className="container">
          <div className="section-eyebrow" aria-hidden="true">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text garamond">Explore</span>
            <span className="eyebrow-line right"></span>
          </div>
          <h2 id="category-heading" className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Discover our meticulously curated collections, designed for every occasion.</p>
          
          <div className="category-grid" role="list">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <div 
                key={cat.id} 
                className="category-card" 
                role="listitem"
                tabIndex={0}
                aria-label={`Explore ${cat.name}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection('collection');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveCategory(cat.id);
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
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about-section reveal" aria-labelledby="about-heading">
        <div className="about-grid">
          <div className="about-image-wrap">
            <div className="about-image-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/pendant-1.jpg.jpeg"
                alt="Close-up of a handcrafted Bilvashree pendant"
              />
            </div>
            <div className="about-badge" aria-hidden="true">
              <div className="about-badge-number">100%</div>
              <div className="about-badge-text">Pure Craft</div>
            </div>
          </div>

          <div className="about-text">
            <div className="section-eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              <span className="eyebrow-text garamond">Our Story</span>
            </div>
            <h2 id="about-heading" className="section-title">
              Morality &amp; Purpose<br />at Our Heart
            </h2>
            <p className="about-description">
              At Bilvashree Jewels, we believe that true elegance lies not in ostentation, but in the purity of intent. Our designs are born from the rich vocabulary of South Indian temple iconography — peacocks, lotus blooms, divine goddesses — lovingly reimagined for modern wear.
            </p>
            <p className="about-description">
              Every piece we create is a quiet promise: to respect our artisans, to honour our heritage, and to deliver something that feels as sacred as it looks. We do not simply sell jewellery; we celebrate shared values and timeless beauty.
            </p>
            <div className="about-pillars" role="list">
              {['Heritage Design', 'Ethical Craft', 'Lasting Quality', 'Fair Pricing'].map(p => (
                <span key={p} className="about-pillar" role="listitem">✦ {p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR CRAFTSMANSHIP PROCESS ── */}
      <section className="process-section reveal" aria-labelledby="process-heading">
        <div className="container">
          <div className="section-eyebrow" aria-hidden="true">
            <span className="eyebrow-line" />
            <span className="eyebrow-text garamond">Our Process</span>
            <span className="eyebrow-line right" />
          </div>
          <h2 id="process-heading" className="section-title">From Vision to Treasure</h2>
          <p className="section-subtitle">
            Each pendant passes through hands that have perfected their craft over generations.
          </p>

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
        </div>
      </section>

      {/* ── COLLECTION ── */}
      <section id="collection" className="collection-section reveal" aria-labelledby="collection-heading">
        <div className="container">
          <div className="section-eyebrow" aria-hidden="true">
            <span className="eyebrow-line" />
            <span className="eyebrow-text garamond">The Collection</span>
            <span className="eyebrow-line right" />
          </div>
          <h2 id="collection-heading" className="section-title">Premium Jewelry Catalog</h2>
          
          {/* Shop By Occasion Tags */}
          <div className="occasion-tags" role="list" aria-label="Shop by occasion">
            <span className="occasion-label">Occasion:</span>
            <button
              className={`occasion-tag ${activeOccasion === 'all' ? 'active' : ''}`}
              role="listitem"
              onClick={() => setActiveOccasion('all')}
              aria-pressed={activeOccasion === 'all'}
            >
              All
            </button>
            {OCCASIONS.map(occ => (
              <button
                key={occ.id}
                className={`occasion-tag ${activeOccasion === occ.id ? 'active' : ''}`}
                role="listitem"
                onClick={() => setActiveOccasion(occ.id)}
                aria-pressed={activeOccasion === occ.id}
              >
                <span aria-hidden="true">{occ.icon}</span> {occ.name}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="category-filters" role="tablist" aria-label="Product categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loader-container" role="status" aria-label="Loading products">
              <span className="loader" />
            </div>
          ) : filteredProducts.length === 0 ? (
             <div className="empty-category-state">
                <div className="empty-icon">✧</div>
                <h3>New Designs Coming Soon</h3>
                <p>We are currently handcrafting new {CATEGORIES.find(c => c.id === activeCategory)?.name.toLowerCase()} for this collection. Please check back later or explore our other exquisite categories.</p>
                <button
                  className="btn-empty"
                  onClick={() => {
                    setActiveCategory('pendants');
                    setActiveOccasion('all');
                  }}
                >
                  View Available Pendants
                </button>
             </div>
          ) : (
            <div className="product-grid" role="list">
              {filteredProducts.map(product => (
                <article
                  key={product.id}
                  className="glass-card"
                  role="listitem"
                  aria-label={product.title}
                >
                  <div className="card-image-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {failedImages[product.id] ? (
                      <div className="image-fallback">Image coming soon</div>
                    ) : (
                      <img
                        src={product.imageURL}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        onError={() => {
                          setFailedImages((prev) => ({ ...prev, [product.id]: true }));
                        }}
                      />
                    )}
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className={`product-badge ${String(product.badge).toLowerCase().replace(/\s+/g, '').includes('bestseller') ? 'badge-bestseller' : 'badge-new'}`}>
                        {product.badge}
                      </div>
                    )}
                  </div>

                  <span className={`stock-badge${!product.inStock ? ' out-of-stock' : ''}`}>
                    {product.inStock ? 'Available' : 'Sold Out'}
                  </span>

                  <div className="card-body">
                    <p className="product-category">
                      {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                    </p>
                    <h3 className="product-title">{product.title}</h3>
                    
                    {/* Material & Occasions */}
                    <div className="product-meta">
                      {product.material && <span className="product-material">{product.material}</span>}
                      {product.occasion && product.occasion.length > 0 && (
                         <div className="card-occasion-strip">
                           {product.occasion.map(occId => {
                              const occ = OCCASIONS.find(o => o.id === occId);
                              return occ ? <span key={occId} className="card-occasion-tag">{occ.name}</span> : null;
                           })}
                         </div>
                      )}
                    </div>

                    <div className="product-footer">
                      <div className="price-group">
                        {product.priceINR != null ? (
                          <>
                            <span className="product-price">
                              ₹{product.priceINR.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice && (
                              <span className="original-price">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            {product.originalPrice && (
                              <span className="discount-tag">
                                {Math.round(((product.originalPrice - product.priceINR) / product.originalPrice) * 100)}% OFF
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="price-coming-soon">Price Coming Soon</span>
                        )}
                      </div>
                      
                      <button
                        id={`add-to-cart-${product.id}`}
                        className="btn-add"
                        disabled={!product.inStock || product.priceINR == null}
                        onClick={() => handleAddToCart(product)}
                        aria-label={
                          !product.inStock
                            ? `${product.title} is out of stock`
                            : product.priceINR == null
                            ? `${product.title} — price coming soon`
                            : `Add ${product.title} to cart`
                        }
                      >
                        {!product.inStock ? 'Out of Stock' : product.priceINR == null ? 'Coming Soon' : '+ Add to Cart'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section id="values" className="values-section reveal" aria-labelledby="values-heading">
        <div className="container">
          <div className="section-eyebrow" aria-hidden="true">
            <span className="eyebrow-line" style={{ background: 'linear-gradient(90deg, transparent, #F0D87A)' }} />
            <span className="eyebrow-text garamond">Why Choose Us</span>
            <span className="eyebrow-line right" style={{ background: 'linear-gradient(90deg, #F0D87A, transparent)' }} />
          </div>
          <h2 id="values-heading" className="section-title">Built on Timeless Values</h2>

          <div className="values-grid" role="list">
            {VALUES.map(v => (
              <div key={v.name} className="value-card" role="listitem">
                <div className="value-icon" aria-hidden="true">{v.icon}</div>
                <h3 className="value-name">{v.name}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" className="testimonials-section reveal" aria-labelledby="reviews-heading">
        <div className="container">
          <div className="section-eyebrow" aria-hidden="true">
            <span className="eyebrow-line" />
            <span className="eyebrow-text garamond">Customer Stories</span>
            <span className="eyebrow-line right" />
          </div>
          <h2 id="reviews-heading" className="section-title">Loved by Many</h2>
          <p className="section-subtitle">Real stories from real customers who wear their hearts in gold.</p>

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
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" aria-label="Call to action">
        <div className="cta-content">
          <h2 className="cta-title">Begin Your Jewellery Journey</h2>
          <p className="cta-text">
            Discover handcrafted pendants rooted in heritage — starting at just ₹399. Gift yourself or someone you love a piece of timeless India.
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

      {/* ── FOOTER ── */}
      <footer className="footer" role="contentinfo">
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <p className="footer-brand-name">Bilvashree Jewels</p>
            <p className="footer-brand-desc">
              Celebrating heritage, ethically handcrafted temple jewellery rooted in the soul of India. Each piece a prayer in gold.
            </p>
            <div className="footer-socials" role="list" aria-label="Social media links">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="social-pill"
                  role="listitem"
                  aria-label={social.label}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links" role="list">
              {NAV_LINKS.map(link => (
                <li key={link.id} role="listitem">
                  <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="footer-heading">Information</h3>
            <ul className="footer-links" role="list">
              {['Shipping Policy', 'Return Policy', 'Care Instructions', 'Contact Us', 'Privacy Policy'].map(item => (
                <li key={item} role="listitem">
                  <button type="button" className="footer-link-btn" onClick={() => handleInfoClick(item)}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Bilvashree Jewels. All rights reserved.</span>
          <span className="footer-bottom-accent">Crafted with devotion ✦</span>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href="https://wa.me/919999999999?text=Hi!%20I'm%20interested%20in%20Bilvashree%20Jewels"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat with us on WhatsApp"
      >
        <div className="whatsapp-float-btn">💬</div>
        <span className="whatsapp-float-label">Chat with us</span>
      </a>

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

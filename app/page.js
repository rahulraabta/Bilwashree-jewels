'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileCardsPerView, setMobileCardsPerView] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const toastTimeoutRef = useRef(null);

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
      window.localStorage.setItem('bilvashree_recent_v1', JSON.stringify(updated));
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

  /* Filter with smooth transition */
  const changeCategory = (catId) => {
    if (catId === activeCategory) return;
    setIsFiltering(true);
    setTimeout(() => {
      setActiveCategory(catId);
      setIsFiltering(false);
    }, 300);
  };

  const filteredProducts = inventory.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      CATEGORIES.find(c => c.id === product.category)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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

      <Navbar
        navLinks={NAV_LINKS}
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        scrollToSection={scrollToSection}
        onSearch={setSearchQuery}
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

          <div className="mobile-view-options" role="group" aria-label="Products visible on mobile">
            <span className="mobile-view-label">View</span>
            {[2, 4, 6].map((count) => (
              <button
                key={count}
                type="button"
                className={`mobile-view-btn ${mobileCardsPerView === count ? 'active' : ''}`}
                aria-pressed={mobileCardsPerView === count}
                onClick={() => setMobileCardsPerView(count)}
              >
                {count}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
             <Reveal className="empty-category-state">
                <div className="empty-icon">✧</div>
                <h3>New Designs Coming Soon</h3>
                <p>We are currently handcrafting new {CATEGORIES.find(c => c.id === activeCategory)?.name.toLowerCase()} for this collection. Please check back later or explore our other exquisite categories.</p>
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
              style={{ '--mobile-products-per-view': mobileCardsPerView }}
            >
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                  onAddToCart={handleAddToCart}
                  onView={() => addToRecent(product)}
                  onClick={() => openProductQuickView(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

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
              <div className="gift-card" onClick={() => { scrollToSection('collection'); }}>
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

              <div className="gift-card" onClick={() => { scrollToSection('collection'); }}>
                <div className="gift-bg">
                  <Image src={`${BASE_PATH}/images/pendant-1.jpg.jpeg`} alt="Wedding Gifts" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div className="gift-overlay" />
                <div className="gift-content">
                  <h3 className="gift-title">The Bride</h3>
                  <p className="gift-desc">Divine temple sets for the most sacred day of her life.</p>
                  <span className="gift-btn">Explore Bridal</span>
                </div>
              </div>

              <div className="gift-card" onClick={() => { scrollToSection('collection'); }}>
                <div className="gift-bg">
                  <Image src={`${BASE_PATH}/images/pendant-5.jpg.jpeg`} alt="Anniversary Gifts" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div className="gift-overlay" />
                <div className="gift-content">
                  <h3 className="gift-title">Daily Elegance</h3>
                  <p className="gift-desc">Minimalistic heritage designs for her everyday celebrations.</p>
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
            <p className="section-subtitle">A little care goes a long way in preserving the sacred luster of your Bilvashree pieces.</p>
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
      </Reveal>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="container">
          <Reveal className="newsletter-content">
            <h2 className="newsletter-title">Join the Bilvashree Circle</h2>
            <p className="newsletter-desc">Be the first to discover our new collections, heritage stories, and exclusive offers.</p>
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
                  categoryName={CATEGORIES.find(c => c.id === product.category)?.name || product.category}
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
          categoryName={CATEGORIES.find(c => c.id === selectedProduct.category)?.name || selectedProduct.category}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

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

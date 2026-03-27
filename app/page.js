'use client';

import { useEffect, useState, useCallback } from 'react';

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

/* ─── Stars helper ───────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className="star-row" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────── */
export default function Home() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [cartCount, setCartCount]     = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [activeReveals, setActiveReveals] = useState(new Set());

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

  /* Fetch products */
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error('Failed to fetch products', err); setLoading(false); });
  }, []);

  /* Toast */
  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3200);
  }, []);

  /* Mock checkout / add to cart */
  const handleAddToCart = useCallback(async (product) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ ...product, quantity: 1 }],
          total: product.priceINR,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCartCount(c => c + 1);
        showToast(`✨ "${product.title}" added to cart!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not connect to checkout. Please try again.');
    }
  }, [showToast]);

  /* Smooth scroll to collection */
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">

      {/* ── NAV BAR ── */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-brand">
          <span className="navbar-brand-name">Bilvashree Jewels</span>
          <span className="navbar-brand-tagline">Premium Temple Jewellery</span>
        </div>

        <ul className="navbar-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#collection">Collection</a></li>
          <li><a href="#about">Our Story</a></li>
          <li><a href="#values">Values</a></li>
          <li><a href="#reviews">Reviews</a></li>
        </ul>

        <div className="navbar-actions">
          <button
            id="navbar-cart-button"
            className="navbar-cart-btn"
            aria-label={`Cart with ${cartCount} items`}
          >
            🛍
            {cartCount > 0 && (
              <span className="cart-badge" aria-live="polite">{cartCount}</span>
            )}
            Cart
          </button>
        </div>
      </nav>

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
              onClick={scrollToCollection}
              aria-label="Shop the collection"
            >
              Shop the Collection
            </button>
            <button
              id="hero-our-story-btn"
              className="btn-hero-secondary"
              onClick={scrollToAbout}
              aria-label="Learn our story"
            >
              Our Story
            </button>
          </div>
        </div>

        <div className="hero-scroll-hint" aria-hidden="true">
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

      {/* ── COLLECTION ── */}
      <section id="collection" className="collection-section reveal" aria-labelledby="collection-heading">
        <div className="container">
          <div className="section-eyebrow" aria-hidden="true">
            <span className="eyebrow-line" />
            <span className="eyebrow-text garamond">The Collection</span>
            <span className="eyebrow-line right" />
          </div>
          <h2 id="collection-heading" className="section-title">Premium Pendant Catalog</h2>
          <p className="section-subtitle">
            Explore our exclusively curated, handcrafted pendants — each one a piece of wearable heritage.
          </p>

          {loading ? (
            <div className="loader-container" role="status" aria-label="Loading products">
              <span className="loader" />
            </div>
          ) : (
            <div className="product-grid" role="list">
              {products.map(product => (
                <article
                  key={product.id}
                  className="glass-card"
                  role="listitem"
                  aria-label={product.title}
                >
                  <div className="card-image-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageURL}
                      alt={product.title}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  <span className={`stock-badge${!product.inStock ? ' out-of-stock' : ''}`}>
                    {product.inStock ? 'Available' : 'Sold Out'}
                  </span>

                  <div className="card-body">
                    <p className="product-category">{product.category}</p>
                    <h3 className="product-title">{product.title}</h3>
                    {product.material && (
                      <p className="product-material">{product.material}</p>
                    )}

                    <div className="product-footer">
                      <span className="product-price">
                        ₹{product.priceINR.toLocaleString('en-IN')}
                      </span>
                      <button
                        id={`add-to-cart-${product.id}`}
                        className="btn-add"
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                        aria-label={
                          product.inStock
                            ? `Add ${product.title} to cart`
                            : `${product.title} is out of stock`
                        }
                      >
                        {product.inStock ? '+ Add to Cart' : 'Out of Stock'}
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
                <div className="testimonial-quote" aria-hidden="true">"</div>
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
            onClick={scrollToCollection}
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
              {['Instagram', 'WhatsApp', 'Facebook'].map(s => (
                <button key={s} className="social-pill" role="listitem" aria-label={s}>{s}</button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links" role="list">
              {[
                { label: 'Home',            href: '#hero' },
                { label: 'The Collection', href: '#collection' },
                { label: 'Our Story',      href: '#about' },
                { label: 'Our Values',     href: '#values' },
                { label: 'Reviews',        href: '#reviews' },
              ].map(link => (
                <li key={link.href} role="listitem">
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="footer-heading">Information</h3>
            <ul className="footer-links" role="list">
              {['Shipping Policy', 'Return Policy', 'Care Instructions', 'Contact Us', 'Privacy Policy'].map(item => (
                <li key={item} role="listitem"><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Bilvashree Jewels. All rights reserved.</span>
          <span className="footer-bottom-accent">Crafted with devotion ✦</span>
        </div>
      </footer>

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

    </div>
  );
}

'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  inventory,
  CATEGORIES,
  TESTIMONIALS,
  CART_STORAGE_KEY,
  DEMO_PHONE,
  DEMO_EMAIL,
} from '../data/inventory';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Reveal from './components/Reveal';

const OCCASIONS = [
  { id: "bridal", name: "Bridal", icon: "💍" },
  { id: "festive", name: "Festive", icon: "🪔" },
  { id: "party", name: "Party", icon: "🎉" },
  { id: "daily", name: "Daily Wear", icon: "☀️" },
  { id: "office", name: "Office", icon: "💼" }
];

const MARQUEE_ITEMS = [
  "Free Shipping on All Orders",
  "Handcrafted with Love",
  "Starting at ₹399",
  "100% Satisfaction Guaranteed",
  "Ethically Sourced Materials",
  "Premium Gift Packaging",
  "Signature Jewellery Heritage",
  "Trusted by 500+ Customers",
];

const OFFERS = [
  { icon: "🚚", title: "Free Shipping", description: "On orders above ₹999", highlight: "Limited Time" },
  { icon: "✨", title: "Premium Quality", description: "Handcrafted Fine Jewellery", highlight: "Authentic" }
];

export default function Home() {
  const [products] = useState(inventory);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeOccasion, setActiveOccasion] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const showToast = useCallback((message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(''), 3200);
  }, []);

  const handleAddToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    setIsCartOpen(true);
    showToast(`✨ Added to cart!`);
  }, [showToast]);

  const scrollToSection = (id) => {
    if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesOccasion = activeOccasion === 'all' || product.occasion?.includes(activeOccasion);
    return matchesCategory && matchesOccasion;
  });

  return (
    <div className="page-wrapper">
      <Navbar
        navLinks={[
          { label: 'Home', id: '' },
          { label: 'Collection', id: 'collection' },
          { label: 'Reviews', id: 'reviews' },
        ]}
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        onCartOpen={() => setIsCartOpen(true)}
        scrollToSection={scrollToSection}
        brandName="Bilwashree Jewels"
      />

      <Hero
        title="Jewels Crafted with Divine Artistry"
        subtitle="Every pendant tells a story rooted in devotion, heritage, and timeless Indian craftsmanship."
        onShopClick={() => scrollToSection('collection')}
      />

      <section id="collection" className="collection-section">
        <div className="container">
          <div className="category-filters" style={{display:'flex', gap:'10px', justifyContent:'center', marginBottom:'40px', flexWrap:'wrap'}}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{padding:'8px 20px', borderRadius:'20px', border:'1px solid #c9a84c', background: activeCategory === cat.id ? '#c9a84c' : 'transparent', color: activeCategory === cat.id ? '#fff' : '#c9a84c', cursor:'pointer'}}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="product-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'30px'}}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={CATEGORIES.find(c => c.id === product.category)?.name}
                onAddToCart={handleAddToCart}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Loved by Many</h2>
          <div className="testimonials-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'20px', marginTop:'40px'}}>
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="glass-card" style={{padding:'30px', borderRadius:'16px', border:'1px solid rgba(212, 175, 55, 0.2)'}}>
                <p style={{fontStyle:'italic', color:'#555'}}>{t.text}</p>
                <p style={{fontWeight:'700', marginTop:'15px'}}>- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer brandName="Bilwashree Jewels" />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cartItems}
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        cartTotal={cartItems.reduce((s, i) => s + (i.product?.priceINR || 0) * i.qty, 0)}
        onClose={() => setIsCartOpen(false)}
        updateQuantity={updateQuantity}
        scrollToSection={scrollToSection}
        checkoutWhatsApp={() => {
          const lines = cartItems.map(i => `• ${i.product?.title} x${i.qty} = ₹${(i.product?.priceINR || 0) * i.qty}`).join('%0A');
          const total = cartItems.reduce((s, i) => s + (i.product?.priceINR || 0) * i.qty, 0);
          window.open(`https://wa.me/919986237677?text=🛍 Order from Bilwashree Jewels:%0A${lines}%0A%0ATotal: ₹${total}`, '_blank');
        }}
        checkoutEmail={() => {
          const lines = cartItems.map(i => `${i.product?.title} x${i.qty}`).join(', ');
          window.open(`mailto:bilwashreejewels@gmail.com?subject=New Order&body=Order: ${lines}`, '_blank');
        }}
      />

      <div className={`toast ${toastMessage ? 'show' : ''}`}>{toastMessage}</div>
    </div>
  );
}

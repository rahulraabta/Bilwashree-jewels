'use client';

import Image from 'next/image';
export default function Hero({ title, subtitle, brandName, onShopClick, onStoryClick }) {
  return (
    <section id="hero" className="hero-section" aria-label="Hero banner">
      <Image
        src="/images/main-banner.jpg"
        alt={`${brandName || 'Bilwashree Jewels'} — Luxury gemstone jewellery collection`}
        className="hero-bg-image"
        priority
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">✦ New Collection 2024</span>
          <span className="eyebrow-line" />
        </div>

        <h1 className="hero-title">
          {brandName || 'Bilwashree Jewels'}
        </h1>

        <p className="hero-subtitle">
          {subtitle || 'Crafted with Elegance, Worn with Pride'}
        </p>

        <div className="hero-actions">
          <button
            className="btn-hero-primary"
            onClick={onShopClick}
            aria-label="Explore the full collection"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { BASE_PATH } from '../../data/inventory';

export default function Hero({ onShopClick, onStoryClick }) {
  return (
    <section id="hero" className="hero-section" aria-label="Hero banner">
      <Image
        src={`${BASE_PATH}/images/main-banner.jpg`}
        alt="Bilvashree Jewels — Luxury gemstone jewellery collection with amethyst and emerald"
        className="hero-bg-image"
        priority
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-eyebrow" aria-hidden="true">
          <span className="hero-eyebrow-dot" />
          Signature Jewellery Collection
        </div>

        <h1 className="hero-title">
          Fine Jewellery with <em>Timeless Impact</em>
        </h1>

        <p className="hero-subtitle">
          Let the craftsmanship speak first - elegant pieces designed to elevate every celebration.
        </p>

        <div className="hero-actions">
          <button
            id="hero-shop-now-btn"
            className="btn-hero-primary"
            onClick={onShopClick}
            aria-label="Shop the collection"
          >
            Shop the Collection
          </button>
          <button
            id="hero-our-story-btn"
            className="btn-hero-secondary"
            onClick={onStoryClick}
            aria-label="Learn our story"
          >
            Our Story
          </button>
        </div>
      </div>

      <div
        className="hero-scroll-hint"
        role="button"
        tabIndex={0}
        aria-label="Scroll to collection"
        onClick={onShopClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onShopClick();
          }
        }}
      >
        <span className="hero-scroll-arrow">↓</span>
        Scroll
      </div>
    </section>
  );
}

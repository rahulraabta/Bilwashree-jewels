'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DEMO_PHONE } from '../../data/inventory';

export default function ProductCard({ product, categoryName, occasionTags, onAddToCart, onView, onClick }) {
  const [imageError, setImageError] = useState(false);

  const discount = product.originalPrice && product.priceINR
    ? Math.round(((product.originalPrice - product.priceINR) / product.originalPrice) * 100)
    : 0;

  return (
    <article
      className="glass-card"
      role="listitem"
      aria-label={product.title}
      tabIndex={0}
      onMouseEnter={onView}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="card-image-wrap">
        {imageError ? (
          <div className="image-fallback">Image coming soon</div>
        ) : (
          <Image
            src={product.imageURL}
            alt={product.title}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            style={{ objectFit: 'cover' }}
            unoptimized
            onError={() => setImageError(true)}
          />
        )}

        {product.badge && (
          <div className={`product-badge ${String(product.badge).toLowerCase().replace(/\s+/g, '').includes('bestseller') ? 'badge-bestseller' : 'badge-new'}`}>
            {product.badge}
          </div>
        )}

        {/* Floating Actions on Image */}
        <div className="card-floating-actions">
          <button
            className="btn-wishlist-circle"
            onClick={(e) => {
              e.stopPropagation();
              onView?.();
              const text = encodeURIComponent(`Hi! I'm interested in "${product.title}" (₹${product.priceINR}). Can you help me?`);
              window.open(`https://wa.me/${DEMO_PHONE}?text=${text}`, '_blank');
            }}
            aria-label="Wishlist / Inquiry"
          >
            ♡
          </button>

          <button
            className="btn-add-pill"
            disabled={!product.inStock || product.priceINR == null}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            aria-label="Add to cart"
          >
            {product.inStock ? 'ADD TO BAG' : 'SOLD OUT'}
          </button>
        </div>
      </div>

      <div className="card-body centered">
        <h3 className="product-title-clean">{product.title}</h3>

        <div className="price-row-clean">
          <span className="price-current">₹{product.priceINR?.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <>
              <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              {discount > 0 && <span className="discount-pct">({discount}%)</span>}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DEMO_PHONE } from '../../data/inventory';
import { urlFor } from '../../sanity/lib/image';

export default function ProductCard({ product, categoryName, occasionTags, onAddToCart, onView, onClick }) {
  const [imageError, setImageError] = useState(false);
  const hasPrice = Number.isFinite(product.priceINR);

  const displayImage = product.mainImage
    ? urlFor(product.mainImage).width(500).auto('format').url()
    : product.imageURL;

  return (
    <article
      className="glass-card"
      role="listitem"
      aria-label={product.title}
      tabIndex={0}
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
            src={displayImage}
            alt={product.title}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
            onLoadingComplete={(img) => img.classList.add('loaded')}
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
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!hasPrice) {
                onView?.();
                const text = encodeURIComponent(`Hi! I'm interested in "${product.title}". Please share the latest price and details.`);
                window.open(`https://wa.me/${DEMO_PHONE}?text=${text}`, '_blank');
                return;
              }
              onAddToCart(product);
            }}
            aria-label="Add to cart"
          >
            {!product.inStock ? 'SOLD OUT' : hasPrice ? 'ADD TO BAG' : 'REQUEST PRICE'}
          </button>
        </div>
      </div>

      <div className="card-body centered">
        <h3 className="product-title-clean">{product.title}</h3>

        <div className="price-row-clean">
          {hasPrice ? (
            <span className="price-current">₹{product.priceINR.toLocaleString('en-IN')}</span>
          ) : (
            <span className="price-request">Price on Request</span>
          )}
        </div>
      </div>
    </article>
  );
}

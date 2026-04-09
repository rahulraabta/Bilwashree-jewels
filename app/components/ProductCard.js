'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DEMO_PHONE } from '../../data/inventory';
import { urlFor } from '../../sanity/lib/image';

export default function ProductCard({ product, categoryName, occasionTags, onAddToCart, onView, onClick }) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasPrice = Number.isFinite(product?.price);

  const getImageUrl = () => {
    if (product?.images?.[0]?.asset) {
      return urlFor(product.images[0]).width(400).url();
    }
    if (product?.imageURL) {
      return product.imageURL.startsWith('/') ? product.imageURL : `/${product.imageURL}`;
    }
    return null;
  };
  const imageUrl = getImageUrl();

  return (
    <article
      className="glass-card"
      role="listitem"
      aria-label={product?.name}
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
        {imageError || !imageUrl ? (
          <div className="image-fallback">Image coming soon</div>
        ) : (
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={product?.name || "Product"}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
            onLoadingComplete={(img) => img.classList.add('loaded')}
          />
        )}

        {product?.badge && (
          <div className={`product-badge ${String(product?.badge).toLowerCase().replace(/\s+/g, '').includes('bestseller') ? 'badge-bestseller' : 'badge-new'}`}>
            {product?.badge}
          </div>
        )}

        {/* Floating Actions on Image */}
        <div className="card-floating-actions">
          <button
            className="btn-wishlist-circle"
            onClick={(e) => {
              e.stopPropagation();
              onView?.();
              const priceText = product?.price ? ` (₹${product?.price})` : '';
              const text = encodeURIComponent(`Hi! I'm interested in "${product?.name}"${priceText}. Can you help me?`);
              window.open(`https://wa.me/${DEMO_PHONE}?text=${text}`, '_blank');
            }}
            aria-label="Wishlist / Inquiry"
          >
            ♡
          </button>
        </div>
      </div>

      <div className="card-body centered">
        <h3 className="product-title-clean">{product?.name}</h3>

        <div className="price-row-clean">
          {hasPrice ? (
            <span className="price-current">₹{product?.price?.toLocaleString('en-IN')}</span>
          ) : (
            <span className="price-request">Price on Request</span>
          )}
        </div>

        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          style={{
            background: isHovered ? "#145f48" : "#1a7a5e",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            marginTop: "10px",
            fontSize: "14px",
            fontWeight: "600",
            transition: "background 0.2s"
          }}
        >
          🛒 Add to Cart
        </button>
      </div>
    </article>
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product, categoryName, occasionTags, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  const discount = product.originalPrice && product.priceINR
    ? Math.round(((product.originalPrice - product.priceINR) / product.originalPrice) * 100)
    : 0;

  return (
    <article
      className="glass-card"
      role="listitem"
      aria-label={product.title}
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
      </div>

      <span className={`stock-badge${!product.inStock ? ' out-of-stock' : ''}`}>
        {product.inStock ? 'Available' : 'Sold Out'}
      </span>

      <div className="card-body">
        <p className="product-category">
          {categoryName}
        </p>
        <h3 className="product-title">{product.title}</h3>

        <div className="product-meta">
          {product.material && <span className="product-material">{product.material}</span>}
          {occasionTags && occasionTags.length > 0 && (
             <div className="card-occasion-strip">
               {occasionTags.map(occ => (
                  <span key={occ.id} className="card-occasion-tag">{occ.name}</span>
               ))}
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
                {discount > 0 && (
                  <span className="discount-tag">
                    {discount}% OFF
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
            onClick={() => onAddToCart(product)}
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
  );
}

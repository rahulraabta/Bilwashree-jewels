'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { urlFor } from '../../sanity/lib/image';

const PRICE_FALLBACK_TEXT = 'Price will come soon';

export default function ProductModal({ product, categoryName, contactPhone, onClose, onAddToCart }) {
  const modalRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const hasPrice = Number.isFinite(product?.priceINR) && product?.priceINR > 0;

  const getCleanTitle = (title) => {
    const match = (title || '').match(/BS\s*\d+/i);
    return match ? match[0].toUpperCase() : title;
  };

  const getImageUrl = () => {
    if (product?.images?.[0]?.asset) {
      return urlFor(product.images[0]).width(800).url();
    }
    if (product?.imageURL) {
      // Fix: strip .jpeg extension if present
      const cleanUrl = product.imageURL.replace(/\.jpeg$/, '');
      return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    }
    return "/placeholder.png";
  };
  const imageUrl = getImageUrl();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const whatsappInquiry = () => {
    const pricePart = hasPrice ? ` (₹${product?.price})` : '';
    const text = encodeURIComponent(`Hi! I'm interested in the "${product?.name}"${pricePart}. Can you please share more details?`);
    window.open(`https://wa.me/${contactPhone || '919986237677'}?text=${text}`, '_blank');
  };

  return (
    <div
      ref={modalRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-container">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">Close</button>

        <div className="modal-grid">
          <div className="modal-image-wrap">
            <Image
              src={imageUrl}
              alt={product?.name || "Product"}
              width={600}
              height={600}
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="modal-details">
            <div className="section-eyebrow">
              <span className="eyebrow-line" />
              <span className="eyebrow-text garamond">{categoryName}</span>
            </div>
            <h2 className="modal-title">{getCleanTitle(product?.name)}</h2>

            <div className="modal-price-row">
              {hasPrice ? (
                <span className="modal-price">₹{product?.priceINR?.toLocaleString('en-IN')}</span>
              ) : (
                <span className="modal-price-request">{PRICE_FALLBACK_TEXT}</span>
              )}
            </div>

            <div className="modal-description">
              <p>Experience the elegance of handcrafted jewellery. This piece is meticulously designed with refined detailing and a premium finish for modern styling.</p>
            </div>

            {(product?.occasion ?? []).length > 0 && (
              <div className="modal-vibe-tags">
                {(product?.occasion ?? []).map(vibe => (
                  <span key={vibe} className="vibe-tag">
                    {String(vibe).charAt(0).toUpperCase() + String(vibe).slice(1).replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
              <span>Quantity:</span>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: "5px 10px", cursor: "pointer" }}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: "5px 10px", cursor: "pointer" }}>+</button>
            </div>

            <div className="modal-actions">
              <button
                className="btn-modal-add"
                onClick={() => {
                  if (!hasPrice) {
                    whatsappInquiry();
                    return;
                  }
                  onAddToCart?.(product, quantity);
                  onClose();
                }}
              >
                {hasPrice ? `Add ${quantity} to Cart` : 'Request Price'}
              </button>
              <button
                className="btn-modal-wa"
                onClick={whatsappInquiry}
              >
                WhatsApp Inquiry <span>💬</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

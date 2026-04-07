'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { urlFor } from '../../sanity/lib/image';

export default function ProductModal({ product, categoryName, contactPhone, onClose, onAddToCart }) {
  const modalRef = useRef(null);
  const hasPrice = Number.isFinite(product?.priceINR);

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
    const pricePart = hasPrice ? ` (₹${product?.priceINR})` : '';
    const text = encodeURIComponent(`Hi! I'm interested in the "${product?.title}"${pricePart}. Can you please share more details?`);
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
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        <div className="modal-grid">
          <div className="modal-image-wrap">
            <Image
              src={product?.images?.[0]?.asset ? urlFor(product.images[0]).width(800).url() : "/placeholder.png"}
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
            <h2 className="modal-title">{product?.title}</h2>

            <div className="modal-price-row">
              {hasPrice ? (
                <span className="modal-price">₹{product?.priceINR?.toLocaleString('en-IN')}</span>
              ) : (
                <span className="modal-price-request">Price on Request</span>
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

            <div className="modal-actions">
              <button
                className="btn-modal-add"
                onClick={() => {
                  if (!hasPrice) {
                    whatsappInquiry();
                    return;
                  }
                  onAddToCart?.(product);
                  onClose();
                }}
                disabled={!product?.inStock && hasPrice}
              >
                {!product?.inStock && hasPrice ? 'Out of Stock' : hasPrice ? 'Add to Cart' : 'Request Price'}
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

'use client';

import Image from 'next/image';

import { urlFor } from '../../sanity/lib/image';

const PRICE_FALLBACK_TEXT = 'Price will come soon';

export default function CartDrawer({
  isOpen,
  cartItems,
  cartCount,
  cartTotal,
  onClose,
  updateQuantity,
  checkoutWhatsApp,
  checkoutEmail,
  scrollToSection
}) {
  const getCleanTitle = (title) => {
    const match = (title || '').match(/BS\s*\d+/i);
    return match ? match[0].toUpperCase() : title;
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        <div className="cart-header">
          <h2>Your Cart ({cartCount})</h2>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">Close</button>
        </div>
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-msg">
              <p>Your cart is currently empty.</p>
              <button
                className="btn-empty"
                onClick={() => {
                  onClose();
                  scrollToSection('collection');
                }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const p = item.product;
              const img = p?.images?.[0]?.asset ? urlFor(p.images[0]).width(80).url() : (p.imageURL ? `/${p.imageURL}` : "/placeholder.png");
              return (
                <div key={p?.id || p?._id} className="cart-item">
                  <Image
                    src={img}
                    alt={p?.name || "Product"}
                    className="cart-item-img"
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{getCleanTitle(p?.name)}</h4>
                    <p className="cart-item-price">
                      {p?.price != null && p?.price > 0 ? `₹${p.price.toLocaleString('en-IN')}` : PRICE_FALLBACK_TEXT}
                    </p>
                    <div className="cart-item-actions">
                      <div className="qty-controls" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button onClick={() => updateQuantity(p?.id || p?._id, -1)} style={{ padding: "4px 10px", borderRadius: "50%", border: "1px solid #ddd", cursor: "pointer", background: "white" }} aria-label="Decrease quantity">−</button>
                        <span style={{ fontWeight: "600" }}>{item?.qty}</span>
                        <button onClick={() => updateQuantity(p?.id || p?._id, 1)} style={{ padding: "4px 10px", borderRadius: "50%", border: "1px solid #ddd", cursor: "pointer", background: "white" }} aria-label="Increase quantity">+</button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => updateQuantity(p?.id || p?._id, -item?.qty)}
                        style={{ marginTop: "10px", fontSize: "0.85rem", color: "#e53e3e", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <p className="cart-tax-note">Shipping & taxes calculated at checkout.</p>
          <div className="checkout-actions">
            <button
              className="btn-checkout-wa"
              onClick={checkoutWhatsApp}
              disabled={cartItems.length === 0}
            >
              Checkout via WhatsApp
            </button>
            <button
              className="btn-checkout-email"
              onClick={checkoutEmail}
              disabled={cartItems.length === 0}
            >
              ✉ Checkout via Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

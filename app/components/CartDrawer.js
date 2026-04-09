'use client';

import Image from 'next/image';

import { urlFor } from '../../sanity/lib/image';

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
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">✕</button>
        </div>
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-msg">
              <span className="empty-cart-icon">🛍️</span>
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
                  <h4 className="cart-item-title">{p?.name}</h4>
                  <p className="cart-item-price">
                    {p?.price != null ? `₹${p.price.toLocaleString('en-IN')}` : 'Price TBD'}
                  </p>
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(p?.id || p?._id, -1)} aria-label="Decrease quantity">−</button>
                      <span>{item?.qty}</span>
                      <button onClick={() => updateQuantity(p?.id || p?._id, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => updateQuantity(p?.id || p?._id, -item?.qty)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )})
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
              ✦ Checkout via WhatsApp
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

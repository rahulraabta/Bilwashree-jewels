'use client';

import Image from 'next/image';

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
  const freeShippingRemaining = Math.max(0, 999 - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / 999) * 100);

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

        {/* Free Shipping Progress */}
        <div className="cart-shipping-bar">
          <p className="shipping-text">
            {cartTotal >= 999 ? "✨ You've unlocked Free Shipping!" : `Add ₹${freeShippingRemaining.toLocaleString('en-IN')} more for Free Shipping!`}
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
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
            cartItems.map(item => (
              <div key={item.product.id} className="cart-item">
                <Image
                  src={item.product.imageURL}
                  alt={item.product.title}
                  className="cart-item-img"
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.product.title}</h4>
                  <p className="cart-item-price">
                    {item.product.priceINR != null ? `₹${item.product.priceINR.toLocaleString('en-IN')}` : 'Price TBD'}
                  </p>
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.product.id, -1)} aria-label="Decrease quantity">−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => updateQuantity(item.product.id, -item.qty)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
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

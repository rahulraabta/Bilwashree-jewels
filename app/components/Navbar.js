'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import SearchBar from './SearchBar';

export default function Navbar({
  navLinks,
  cartCount,
  onCartOpen,
  scrollToSection,
  onSearch
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 80) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  }, [isScrolled]);

  useEffect(() => {
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [handleScroll]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileNavOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
  }, [mobileNavOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-brand">
          <span className="navbar-brand-name">Bilvashree Jewels</span>
          <span className="navbar-brand-tagline">Premium Everyday Jewellery</span>
        </div>

        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <SearchBar onSearch={onSearch} />
          <button
            id="navbar-cart-button"
            className="navbar-cart-btn"
            onClick={() => {
              setMobileNavOpen(false);
              onCartOpen();
            }}
            aria-label={`Cart with ${cartCount} items`}
          >
            🛍
            {cartCount > 0 && (
              <span className="cart-badge" aria-live="polite">{cartCount}</span>
            )}
            Cart
          </button>

          <button
            className={`hamburger-btn ${mobileNavOpen ? 'open' : ''}`}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`mobile-nav-drawer ${mobileNavOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <span className="mobile-nav-brand">Bilvashree Jewels</span>
        <ul className="mobile-nav-links">
          {navLinks.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileNavOpen(false);
                  scrollToSection(link.id);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

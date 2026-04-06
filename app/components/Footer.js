'use client';

export default function Footer({
  navLinks,
  socialLinks,
  brandName,
  brandDesc,
  onInfoClick,
  scrollToSection
}) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-grid">
        {/* Brand column */}
        <div>
          <p className="footer-brand-name">{brandName || 'Bilwashree Jewels'}</p>
          <p className="footer-brand-desc">
            {brandDesc || 'Celebrating elegant, ethically handcrafted jewellery for modern celebrations. Each piece is made to be worn and loved every day.'}
          </p>
          <div className="footer-socials" role="list" aria-label="Social media links">
            {(socialLinks ?? []).map((social) => (
              <a
                key={social?.label}
                href={social?.href}
                className="social-pill"
                role="listitem"
                aria-label={social?.label}
                target={social?.external ? '_blank' : undefined}
                rel={social?.external ? 'noopener noreferrer' : undefined}
              >
                {social?.label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links" role="list">
            {(navLinks ?? []).map(link => (
              <li key={link?.id} role="listitem">
                <a
                  href={`#${link?.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection?.(link?.id);
                  }}
                >
                  {link?.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="footer-heading">Information</h3>
          <ul className="footer-links" role="list">
            {(['Shipping Policy', 'Return Policy', 'Care Instructions', 'Contact Us', 'Privacy Policy'] ?? []).map(item => (
              <li key={item} role="listitem">
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onInfoClick?.(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 {brandName || 'Bilwashree Jewels'}. All rights reserved.</span>
        <span className="footer-bottom-accent">Crafted with devotion ✦</span>
      </div>
    </footer>
  );
}

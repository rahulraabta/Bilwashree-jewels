# Luxury Design & Intelligence Upgrade Plan

## Context
The goal is to elevate the Bilvashree Jewels website to match the luxury feel and "intelligence" of top-tier jewelry brands like Tanishq.co.in. This involves refining the visual language, enhancing trust signals, and adding functional features that improve user engagement and conversion.

## Proposed Changes

### 1. Luxury Branding & Trust (Phase 1)
- **New Component: `LuxuryTrustBar`**: Replace the current trust bar with a more elegant version featuring high-quality SVG icons and refined typography.
    - Icons: BIS Hallmark, Certified Quality, Handcrafted, Free Shipping.
    - Style: Thin borders, gold accents, and subtle fade-in animations.
- **Typography Refinement**: Update `globals.css` to use 'Playfair Display' for all section headings and 'Cormorant Garamond' for taglines and eyebrows.

### 2. Functional Intelligence (Phase 2)
- **`SearchBar` Component**: Integrate a search bar into the `Navbar` to allow users to quickly find products by name or category.
- **Smart Filtering**: Enhance the filtering logic in `app/page.js` to include search results.
- **"Recently Viewed" Section**: Use `localStorage` to track recently viewed products and display them at the bottom of the page to encourage repeat views and purchases.
- **"You May Also Like" Recommendations**: Add a section below the main collection that suggests products based on the currently active category or user behavior.

### 3. Product Storytelling (Phase 3)
- **Enhanced `ProductCard`**:
    - Add a "Quick Buy" button that opens WhatsApp with a pre-filled message.
    - Improve the hover state with a subtle zoom and overlay.
- **"Price on Request" Handling**: For items without a price in `inventory.js`, show an elegant "Request Price" button that links to WhatsApp, mimicking high-end luxury behavior.
- **Jewelry Care Section**: Add a new section in `app/page.js` that educates users on how to maintain their temple jewelry, building brand authority.

### 4. Visual Polish (Tanishq Style)
- **Decorative Ornaments**: Add SVG decorative dividers between major sections.
- **Smooth Animations**: Refine `Reveal.js` settings for a more "expensive" feeling (slower, smoother transitions).

## Critical Files
- `app/page.js`: Main layout and logic.
- `app/components/Navbar.js`: Adding search.
- `app/components/ProductCard.js`: Enhancing interaction.
- `app/globals.css`: Typography and spacing.
- `app/components/LuxuryTrustBar.js`: (New)
- `app/components/SearchBar.js`: (New)

## Verification Plan
1. **Visual Audit**: Compare the new design against Tanishq's aesthetic (white space, typography, trust markers).
2. **Search Test**: Ensure the search bar correctly filters products in real-time.
3. **Responsive Check**: Verify that the search bar and new trust bar look great on mobile.
4. **Interaction Test**: Test the new "Quick Buy" and hover states on `ProductCard`.

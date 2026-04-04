import './globals.css';

const fallbackSiteUrl = 'https://rahulraabta.github.io/Bilwashree-jewels';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || fallbackSiteUrl;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Bilwashree Jewels — Premium Fine Jewellery',
  description:
    'Discover handcrafted fine jewellery for daily wear, gifting, and celebrations. Starting at ₹399. Ethically made by skilled artisans.',
  keywords: 'fine jewellery, pendant, gold pendant, South Indian jewellery, handcrafted jewellery, Bilwashree',
  category: 'shopping',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Bilwashree Jewels — Premium Fine Jewellery',
    description: 'Handcrafted fine jewellery for everyday elegance. Starting at ₹399.',
    type: 'website',
    images: ['/images/main-banner.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bilwashree Jewels — Premium Fine Jewellery',
    description: 'Handcrafted fine jewellery for everyday elegance. Starting at ₹399.',
    images: ['/images/main-banner.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

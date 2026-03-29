import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bilvashree-jewels.netlify.app'),
  title: 'Bilvashree Jewels — Premium Temple Jewellery',
  description:
    'Discover handcrafted South Indian temple pendants rooted in heritage and devotion. Starting at ₹399. Ethically made by skilled artisans.',
  keywords: 'temple jewellery, pendant, gold pendant, South Indian jewellery, handcrafted jewellery, Bilvashree',
  category: 'shopping',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Bilvashree Jewels — Premium Temple Jewellery',
    description: 'Handcrafted temple pendants rooted in heritage. Starting at ₹399.',
    type: 'website',
    images: ['/images/main-banner.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bilvashree Jewels — Premium Temple Jewellery',
    description: 'Handcrafted temple pendants rooted in heritage. Starting at ₹399.',
    images: ['/images/main-banner.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

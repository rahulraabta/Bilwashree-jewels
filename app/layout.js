import './globals.css';

export const metadata = {
  title: 'Bilvashree Jewels — Premium Temple Jewellery',
  description:
    'Discover handcrafted South Indian temple pendants rooted in heritage and devotion. Starting at ₹399. Ethically made by skilled artisans.',
  keywords: 'temple jewellery, pendant, gold pendant, South Indian jewellery, handcrafted jewellery, Bilvashree',
  openGraph: {
    title: 'Bilvashree Jewels — Premium Temple Jewellery',
    description: 'Handcrafted temple pendants rooted in heritage. Starting at ₹399.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

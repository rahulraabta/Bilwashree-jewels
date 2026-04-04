import './globals.css';
import { client } from '../sanity/lib/client';
import { getSettingsQuery } from '../sanity/lib/queries';

const fallbackSiteUrl = 'https://bilwashree-jewels.vercel.app';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || fallbackSiteUrl;

export async function generateMetadata() {
  const settings = await client.fetch(getSettingsQuery);

  const title = settings?.title || 'Bilwashree Jewels — Premium Fine Jewellery';
  const description = settings?.description || 'Discover handcrafted fine jewellery for daily wear, gifting, and celebrations.';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'fine jewellery, pendant, gold pendant, South Indian jewellery, handcrafted jewellery, Bilwashree',
    category: 'shopping',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: ['/images/main-banner.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/main-banner.jpg'],
    },
  };
}

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

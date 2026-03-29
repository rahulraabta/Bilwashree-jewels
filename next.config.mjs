/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // No basePath needed for Netlify — it serves from the root '/'
  // basePath was '/Bilwashree-jewels' for GitHub Pages only
  trailingSlash: true, 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const normalizedBasePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
  : '';

const nextConfig = {
  output: 'export',
  basePath: normalizedBasePath,
  assetPrefix: normalizedBasePath ? `${normalizedBasePath}/` : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

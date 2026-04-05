/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,   // ← ADD THIS LINE
  },
};

module.exports = nextConfig;
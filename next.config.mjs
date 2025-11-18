/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Netlify deployment configuration
  output: process.env.NETLIFY ? 'standalone' : undefined,
  images: {
    unoptimized: process.env.NETLIFY ? true : false,
  },
};

export default nextConfig;

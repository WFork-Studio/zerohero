/** @type {import('next').NextConfig} */
// const { i18n } = require('./next-i18next.config')
const nextConfig = {
  // i18n,
  reactStrictMode: true,
  unoptimized: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = nextConfig;

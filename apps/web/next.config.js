/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd ? { output: 'export', distDir: 'out' } : {}),
  images: {
    unoptimized: true,
  },
  basePath: '/solvesphere',
  assetPrefix: '/solvesphere/',
  reactStrictMode: false,
};

module.exports = nextConfig;

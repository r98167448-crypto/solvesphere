/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: '/solvesphere',
  assetPrefix: '/solvesphere/',
  reactStrictMode: false,
};

module.exports = nextConfig;

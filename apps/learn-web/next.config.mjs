/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@lurexa/types',
    '@lurexa/ui',
    '@lurexa/backend',
    '@lurexa/sdk',
    '@lurexa/database',
  ],
  reactStrictMode: true,
};

module.exports = nextConfig;
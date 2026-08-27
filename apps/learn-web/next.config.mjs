/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@lurexa/types',
    '@lurexa/ui',
    '@lurexa/backend',
    '@lurexa/sdk',
  ],
  reactStrictMode: true,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["sharp"],
  transpilePackages: [
    '@lurexa/types',
    '@lurexa/ui',
    '@lurexa/backend',
    '@lurexa/sdk',
    '@lurexa/i18n',
  ],
  reactStrictMode: true,
};

export default nextConfig;

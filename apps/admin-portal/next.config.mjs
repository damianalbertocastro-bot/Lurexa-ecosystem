/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["sharp"],
  reactStrictMode: true,
  transpilePackages: [
    "@lurexa/ui",
    "@lurexa/i18n",
    "@lurexa/types",
    "@lurexa/backend",
    "@lurexa/sdk",
  ],
};

export default nextConfig;

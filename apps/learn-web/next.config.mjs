/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@lurexa/ui",
    "@lurexa/types",
    "@lurexa/backend",
    "@lurexa/sdk",
  ],
};

export default nextConfig;
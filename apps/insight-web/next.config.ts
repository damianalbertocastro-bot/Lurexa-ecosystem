import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["sharp"],
  reactStrictMode: true,
  transpilePackages: [
    "@lurexa/ui",
    "@lurexa/i18n",
    "@lurexa/tokens",
    "@lurexa/types",
    "@lurexa/utils",
    "@lurexa/backend",
    "@lurexa/config",
  ],
};

export default nextConfig;

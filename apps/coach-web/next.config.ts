import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["sharp"],
  transpilePackages: [
    "@lurexa/backend",
    "@lurexa/config",
    "@lurexa/tokens",
    "@lurexa/types",
    "@lurexa/ui",
    "@lurexa/utils",
  ],
  reactStrictMode: true,
};

export default nextConfig;

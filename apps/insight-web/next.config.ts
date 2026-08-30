import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@lurexa/ui",
    "@lurexa/tokens",
    "@lurexa/types",
    "@lurexa/utils",
    "@lurexa/backend",
    "@lurexa/config",
  ],
};

export default nextConfig;

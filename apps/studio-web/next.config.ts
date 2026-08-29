import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@lurexa/backend",
    "@lurexa/config",
    "@lurexa/tokens",
    "@lurexa/types",
    "@lurexa/ui",
    "@lurexa/utils",
  ],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["sharp"],
  transpilePackages: ["@lurexa/ui", "@lurexa/i18n"],
};

export default nextConfig;

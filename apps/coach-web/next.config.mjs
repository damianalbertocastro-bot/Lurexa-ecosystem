/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@lurexa/types", "@lurexa/ui", "@lurexa/backend", "@lurexa/config"],
  reactStrictMode: true,
};

export default nextConfig;

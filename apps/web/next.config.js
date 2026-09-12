/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    transpilePackages: [
        "@lurexa/ui",
        "@lurexa/i18n",
        "@lurexa/tokens",
        "@lurexa/config",
    ],
};

export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
// my-app/next.config.js
const path = require('path')

module.exports = {
  turbopack: {
    // This points to the absolute root of your monorepo (lurexa)
    root: path.join(__dirname, '..'), 
  },
}

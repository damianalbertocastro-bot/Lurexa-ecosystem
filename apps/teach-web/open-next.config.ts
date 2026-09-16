import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = {
  ...defineCloudflareConfig(),
  buildCommand: "next build",
  cloudflare: {
    useWorkerdCondition: false,
  },
};

export default config;

import { defineGenerator, type TurboGenerator } from "./shared";

export const capabilityGenerator: TurboGenerator = defineGenerator({
  name: "capability",
  description: "Create a capability module",
  targetDirectory: "packages/capabilities/src",
});

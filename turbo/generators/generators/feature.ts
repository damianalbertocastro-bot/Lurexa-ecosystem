import { defineGenerator, type TurboGenerator } from "./shared";

export const featureGenerator: TurboGenerator = defineGenerator({
  name: "feature",
  description: "Create a feature module",
  targetDirectory: "packages/features/src",
});

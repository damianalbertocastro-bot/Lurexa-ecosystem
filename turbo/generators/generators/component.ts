import { defineGenerator, type TurboGenerator } from "./shared";

export const componentGenerator: TurboGenerator = defineGenerator({
  name: "component",
  description: "Create a reusable React component",
  targetDirectory: "packages/ui/src/components",
});

import { defineGenerator, type TurboGenerator } from "./shared";

export const hookGenerator: TurboGenerator = defineGenerator({
  name: "hook",
  description: "Create a reusable React hook",
  targetDirectory: "packages/ui/src/hooks",
});

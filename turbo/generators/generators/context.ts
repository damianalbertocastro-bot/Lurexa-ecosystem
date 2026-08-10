import { defineGenerator, type TurboGenerator } from "./shared";

export const contextGenerator: TurboGenerator = defineGenerator({
  name: "context",
  description: "Create a React context",
  targetDirectory: "packages/ui/src/contexts",
});

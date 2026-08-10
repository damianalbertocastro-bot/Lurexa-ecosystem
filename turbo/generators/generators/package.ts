import { defineGenerator, type TurboGenerator } from "./shared";

export const packageGenerator: TurboGenerator = defineGenerator({
  name: "package",
  description: "Create a new shared package",
  targetDirectory: "packages",
});

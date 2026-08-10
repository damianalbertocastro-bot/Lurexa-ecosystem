import { defineGenerator, type TurboGenerator } from "./shared";

export const providerGenerator: TurboGenerator = defineGenerator({
  name: "provider",
  description: "Create a React provider",
  targetDirectory: "packages/ui/src/providers",
});

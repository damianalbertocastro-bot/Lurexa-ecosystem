import { defineGenerator, type TurboGenerator } from "./shared";

export const appGenerator: TurboGenerator = defineGenerator({
  name: "app",
  description: "Create a new application workspace",
  targetDirectory: "apps",
});

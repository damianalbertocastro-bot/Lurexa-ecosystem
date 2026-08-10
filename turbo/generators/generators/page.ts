import { defineGenerator, type TurboGenerator } from "./shared";

export const pageGenerator: TurboGenerator = defineGenerator({
  name: "page",
  description: "Create an application page",
  targetDirectory: "apps/web/src/pages",
});

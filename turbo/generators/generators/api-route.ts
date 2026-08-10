import { defineGenerator, type TurboGenerator } from "./shared";

export const apiRouteGenerator: TurboGenerator = defineGenerator({
  name: "api-route",
  description: "Create an API route",
  targetDirectory: "apps/api/src/routes",
});

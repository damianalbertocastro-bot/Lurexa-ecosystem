import type { PlopTypes } from "@turbo/gen";

import { apiRouteGenerator } from "./generators/api-route";
import { appGenerator } from "./generators/app";
import { capabilityGenerator } from "./generators/capability";
import { componentGenerator } from "./generators/component";
import { contextGenerator } from "./generators/context";
import { featureGenerator } from "./generators/feature";
import { hookGenerator } from "./generators/hook";
import { packageGenerator } from "./generators/package";
import { pageGenerator } from "./generators/page";
import { providerGenerator } from "./generators/provider";

export default function registerGenerators(
  plop: PlopTypes.NodePlopAPI,
): void {
  plop.setGenerator(appGenerator.name, appGenerator);
  plop.setGenerator(packageGenerator.name, packageGenerator);
  plop.setGenerator(componentGenerator.name, componentGenerator);
  plop.setGenerator(pageGenerator.name, pageGenerator);
  plop.setGenerator(providerGenerator.name, providerGenerator);
  plop.setGenerator(hookGenerator.name, hookGenerator);
  plop.setGenerator(contextGenerator.name, contextGenerator);
  plop.setGenerator(apiRouteGenerator.name, apiRouteGenerator);
  plop.setGenerator(featureGenerator.name, featureGenerator);
  plop.setGenerator(capabilityGenerator.name, capabilityGenerator);
}

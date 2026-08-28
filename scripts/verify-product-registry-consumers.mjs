import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const readJson = (relative) => JSON.parse(read(relative));

const ignoredSourceDirectories = new Set([
  ".next",
  ".turbo",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "out",
]);

function walk(relativeDir) {
  const absolute = path.join(root, relativeDir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredSourceDirectories.has(entry.name)) return [];
    const relative = path.join(relativeDir, entry.name);
    return entry.isDirectory() ? walk(relative) : [relative];
  });
}

function parseRegistry(source) {
  const entries = new Map();
  const pattern = /\bid\s*:\s*"([^"]+)"\s*,\s*\bname\s*:\s*"([^"]+)"\s*,\s*\bclassification\s*:\s*"([^"]+)"/g;
  for (const match of source.matchAll(pattern)) {
    const [, id, name, classification] = match;
    if (entries.has(id)) fail(`Duplicate registry id: ${id}`);
    entries.set(id, { id, name, classification });
  }
  return entries;
}

const registrySource = read("packages/config/src/product-registry.ts");
const registry = parseRegistry(registrySource);
const currentProducts = [...registry.values()].filter((entry) => entry.classification === "product");
const currentProductIds = new Set(currentProducts.map((entry) => entry.id));
const currentProductNames = new Set(currentProducts.map((entry) => entry.name));
const institutionalShells = [...registry.values()].filter((entry) => entry.classification === "institutional-shell");
const institutionalShellIds = new Set(institutionalShells.map((entry) => entry.id));
const institutionalShellNames = new Set(institutionalShells.map((entry) => entry.name));
const sharedLayerNames = new Set([...registry.values()].filter((entry) => entry.classification === "shared-layer").map((entry) => entry.name));
const surfaceNames = new Set([...registry.values()].filter((entry) => entry.classification === "ecosystem-surface").map((entry) => entry.name));
const productSurfaceIds = new Set([...registry.values()].filter((entry) => entry.classification === "product-surface").map((entry) => entry.id));
const inactiveNames = new Set([...registry.values()].filter((entry) => entry.classification === "future-product-concept" || entry.classification === "future-concept").map((entry) => entry.name));

if (currentProductIds.size !== 6) fail(`Expected 6 sibling products; registry exposes ${currentProductIds.size}`);
else pass("registry exposes exactly the six sibling products");

for (const id of ["learn", "coach", "teach", "admin", "insight", "studio"]) {
  const entry = registry.get(id);
  if (!entry || entry.classification !== "product") fail(`Required sibling product is missing or misclassified: ${id}`);
}

const campus = registry.get("campus");
if (!campus || campus.classification !== "institutional-shell") fail("Campus must be registered as the institutional shell, not a seventh sibling product");
else pass("Campus is structurally separate as the institutional orchestration shell");

const mobile = registry.get("mobile");
if (!mobile || mobile.classification !== "product-surface" || !productSurfaceIds.has("mobile")) {
  fail("Mobile must be registered as an implemented product surface rather than a future concept or sibling product");
} else {
  pass("mobile is explicitly classified as an implemented product surface");
}

const deployment = readJson("deployment/products.json");
const bootstrap = readJson("bootstrap/repository.json");
const bootstrapAppsByPath = new Map(bootstrap.apps.map((app) => [app.path, app]));

for (const item of deployment.deployments) {
  if (inactiveNames.has(item.product)) fail(`Inactive concept appears in active deployment topology: ${item.product}`);
  if (
    item.product !== "Lurexa Learning Technologies" &&
    !currentProductNames.has(item.product) &&
    !institutionalShellNames.has(item.product) &&
    !surfaceNames.has(item.product)
  ) {
    fail(`Deployment product is not canonical registry identity: ${item.id} -> ${item.product}`);
  }

  const app = bootstrapAppsByPath.get(item.rootDirectory);
  if (!app) fail(`Deployment root is missing from bootstrap repository manifest: ${item.rootDirectory}`);
  else if (!app.required) fail(`Deployable surface must be required in bootstrap manifest: ${item.rootDirectory}`);
}
if (!failures.some((item) => item.includes("Deployment") || item.includes("Deployable"))) pass("deployment surfaces resolve to products, institutional shells, or ecosystem surfaces");

for (const item of deployment.futureProducts) {
  const match = [...registry.values()].find((entry) => entry.name === item.product);
  if (!match) fail(`Future deployment target is not present in registry: ${item.product}`);
  else if (match.classification !== "product" && match.classification !== "institutional-shell") {
    fail(`Future deployment target must be an approved product or institutional shell awaiting a surface, not ${match.classification}: ${item.product}`);
  }
}
if (!failures.some((item) => item.includes("Future deployment"))) pass("future deployment targets are approved products or institutional shells rather than future concepts");

const deploymentLayerNames = new Set(deployment.sharedLayers.map((layer) => layer.name));
for (const name of sharedLayerNames) {
  if (!deploymentLayerNames.has(name)) fail(`Shared layer missing from deployment topology: ${name}`);
}
for (const name of deploymentLayerNames) {
  if (!sharedLayerNames.has(name)) fail(`Deployment topology invents an unregistered shared layer: ${name}`);
}
if (!failures.some((item) => item.includes("Shared layer") || item.includes("shared layer"))) pass("deployment shared layers match the typed registry");

const webPage = read("apps/web/app/page.tsx");
const orderMatch = webPage.match(/const productOrder = \[([^\]]+)\] satisfies LurexaProductId\[\]/s);
if (!orderMatch) {
  fail("Ecosystem landing productOrder is missing or no longer typed with LurexaProductId[]");
} else {
  const ids = [...orderMatch[1].matchAll(/"([a-z-]+)"/g)].map((match) => match[1]);
  const unique = new Set(ids);
  if (ids.length !== unique.size) fail("Ecosystem landing productOrder contains duplicate experience ids");
  for (const id of currentProductIds) if (!unique.has(id)) fail(`Ecosystem landing omits current product: ${id}`);
  for (const id of institutionalShellIds) if (!unique.has(id)) fail(`Ecosystem landing omits institutional shell: ${id}`);
  for (const id of unique) if (!currentProductIds.has(id) && !institutionalShellIds.has(id)) fail(`Ecosystem landing promotes non-current experience: ${id}`);
}
if (!webPage.includes('from "@lurexa/config/product-registry"')) fail("Ecosystem landing must consume product identity through @lurexa/config/product-registry");
if (!failures.some((item) => item.includes("Ecosystem landing"))) pass("ecosystem navigation is registry-backed and complete across products plus Campus shell");

const allowedRelatedKinds = new Set([...currentProductIds, ...institutionalShellIds, "docs", "ecosystem", "teach-community"]);
const relatedExperienceSources = walk("apps")
  .filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file))
  .filter((file) => {
    const content = read(file);
    return content.includes("RelatedExperiences") || content.includes("RelatedExperience");
  });

for (const file of relatedExperienceSources) {
  const content = read(file);
  for (const match of content.matchAll(/kind:\s*"([a-z-]+)"/g)) {
    const kind = match[1];
    if (!allowedRelatedKinds.has(kind)) fail(`${file} uses non-current RelatedExperience kind: ${kind}`);
  }
  for (const inactiveName of inactiveNames) {
    if (content.includes(`title: "${inactiveName}"`) || content.includes(`title: '${inactiveName}'`)) {
      fail(`${file} promotes inactive registry concept in current Related Experiences navigation: ${inactiveName}`);
    }
  }
}
if (!failures.some((item) => item.includes("RelatedExperience") || item.includes("Related Experiences"))) {
  pass("current Related Experiences navigation cannot promote inactive concepts");
}

const mobileDeployment = deployment.deployments.find((item) => item.id === "mobile");
if (!mobileDeployment || mobileDeployment.product !== "Lurexa Learn" || mobileDeployment.status !== "non-vercel") {
  fail("Mobile must remain a non-Vercel Lurexa Learn surface until an explicit product decision changes it");
} else {
  pass("mobile remains a Lurexa Learn surface rather than a parallel product");
}

if (failures.length) {
  console.error("\nProduct-registry consumer verification failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("\nLurexa product-registry consumer verification passed.");

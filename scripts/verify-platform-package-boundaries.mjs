import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const boundaryFile = path.join(root, "packages/package-boundaries.json");
const manifest = JSON.parse(fs.readFileSync(boundaryFile, "utf8"));
const allowedClasses = new Set(["Production", "Contract", "Test"]);
const failures = [];
const checks = [];

function fail(message) {
  failures.push(message);
}

function pass(message) {
  checks.push(message);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", "dist", "coverage", ".turbo"].includes(entry.name)) return [];
      return walk(target);
    }
    return [target];
  });
}

const declared = manifest.packages ?? {};
const retired = manifest.retiredPackages ?? {};
const packageDirs = fs
  .readdirSync(path.join(root, "packages"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => fs.existsSync(path.join(root, "packages", entry.name, "package.json")));

const discoveredNames = new Map();
for (const dir of packageDirs) {
  const pkgPath = path.join(root, "packages", dir.name, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  discoveredNames.set(pkg.name, `packages/${dir.name}`);
}

for (const [name, packagePath] of discoveredNames) {
  const rule = declared[name];
  if (!rule) {
    fail(`${name} (${packagePath}) has no active package-boundary classification`);
    continue;
  }
  if (!allowedClasses.has(rule.class)) {
    fail(`${name} has invalid active class ${rule.class}`);
  }
  if (rule.path !== packagePath) {
    fail(`${name} declares path ${rule.path}, expected ${packagePath}`);
  }
}

for (const name of Object.keys(declared)) {
  if (!discoveredNames.has(name)) fail(`${name} is classified as active but no package directory exists`);
}

for (const [name, rule] of Object.entries(retired)) {
  if (!rule.formerPath) {
    fail(`${name} retired package record is missing formerPath`);
    continue;
  }
  if (fs.existsSync(path.join(root, rule.formerPath))) {
    fail(`${name} retired package directory ${rule.formerPath} must remain removed`);
  }
  if (discoveredNames.has(name) || declared[name]) {
    fail(`${name} cannot be both active and retired`);
  }
}

if (!failures.some((item) => item.includes("package-boundary") || item.includes("active class") || item.includes("classified as active"))) {
  pass(`${discoveredNames.size} active shared packages classified`);
}
if (!failures.some((item) => item.includes("retired package") || item.includes("both active and retired"))) {
  pass(`${Object.keys(retired).length} retired package directories remain absent`);
}

const runtimeFiles = [...walk(path.join(root, "apps")), ...walk(path.join(root, "packages"))].filter((file) =>
  /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(file),
);

for (const file of runtimeFiles) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const text = fs.readFileSync(file, "utf8");

  for (const retiredName of Object.keys(retired)) {
    const escaped = retiredName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const importPattern = new RegExp(`(?:from\\s+["']${escaped}(?:\\/[^"']*)?["']|import\\s*\\(["']${escaped}(?:\\/[^"']*)?["']\\))`);
    if (importPattern.test(text)) fail(`${rel} imports retired runtime package ${retiredName}`);
  }

  const firstChunk = text.slice(0, 300);
  const isClient = /["']use client["']\s*;?/.test(firstChunk);
  if (isClient && /@lurexa\/backend\/[^"']*\.server(?:["']|\/)/.test(text)) {
    fail(`${rel} is a Client Component importing an explicit backend server-only module`);
  }
}

if (!failures.some((item) => item.includes("retired runtime package"))) {
  pass("retired auth/database packages have no runtime consumers");
}
if (!failures.some((item) => item.includes("Client Component"))) {
  pass("Client Components do not import explicit backend server-only modules");
}

const learnNextConfig = fs.readFileSync(path.join(root, "apps/learn-web/next.config.mjs"), "utf8");
for (const retiredName of Object.keys(retired)) {
  if (learnNextConfig.includes(retiredName)) fail(`Learn transpilePackages still references retired package ${retiredName}`);
}
if (!failures.some((item) => item.includes("transpilePackages"))) {
  pass("Learn build configuration does not carry retired package hooks");
}

const backendPackage = JSON.parse(fs.readFileSync(path.join(root, "packages/backend/package.json"), "utf8"));
const backendExports = backendPackage.exports ?? {};
if (Object.prototype.hasOwnProperty.call(backendExports, "./*")) {
  fail("@lurexa/backend must not expose an unrestricted wildcard subpath export");
}
for (const requiredExport of [".", "./*.server", "./core/*.server", "./mind/*.server"]) {
  if (!Object.prototype.hasOwnProperty.call(backendExports, requiredExport)) {
    fail(`@lurexa/backend is missing required governed export ${requiredExport}`);
  }
}
if (!failures.some((item) => item.includes("@lurexa/backend"))) {
  pass("backend exports are limited to the browser-safe root and explicit server capability patterns");
}

const tsBase = fs.readFileSync(path.join(root, "packages/typescript-config/base.json"), "utf8");
if (tsBase.includes('"@lurexa/backend/*"')) {
  fail("TypeScript path aliases must not bypass the governed backend export surface with @lurexa/backend/*");
}
for (const requiredPath of [
  '"@lurexa/backend/*.server"',
  '"@lurexa/backend/core/*.server"',
  '"@lurexa/backend/mind/*.server"',
]) {
  if (!tsBase.includes(requiredPath)) fail(`TypeScript path aliases are missing ${requiredPath}`);
}
if (!failures.some((item) => item.includes("TypeScript path aliases"))) {
  pass("TypeScript backend paths mirror the governed package export surface");
}

const backendIndexPath = path.join(root, "packages/backend/src/index.ts");
const backendIndex = fs.readFileSync(backendIndexPath, "utf8");
for (const forbidden of ["./billing.service", "./marketplace.service", "./ai-guardrails.service"]) {
  if (backendIndex.includes(forbidden)) fail(`backend root barrel exposes removed authority stub ${forbidden}`);
}

for (const removed of [
  "packages/backend/src/billing.service.ts",
  "packages/backend/src/marketplace.service.ts",
  "packages/backend/src/ai-guardrails.service.ts",
]) {
  if (fs.existsSync(path.join(root, removed))) fail(`${removed} must remain removed until a governed server-owned replacement exists`);
}

if (!failures.some((item) => item.includes("authority stub")) && !failures.some((item) => item.includes("must remain removed"))) {
  pass("prototype commerce/billing/quota authority stubs remain removed");
}

if (failures.length > 0) {
  console.error("Platform package boundary verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Platform package boundary verification passed (${checks.length} checks).`);
for (const check of checks) console.log(`- ${check}`);

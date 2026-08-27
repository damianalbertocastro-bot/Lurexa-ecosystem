import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const boundaryFile = path.join(root, "packages/package-boundaries.json");
const manifest = JSON.parse(fs.readFileSync(boundaryFile, "utf8"));
const allowedClasses = new Set(["Production", "Contract", "Test", "Deprecated"]);
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
      if (["node_modules", ".next", "dist", "coverage"].includes(entry.name)) return [];
      return walk(target);
    }
    return [target];
  });
}

const declared = manifest.packages ?? {};
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
    fail(`${name} (${packagePath}) has no package-boundary classification`);
    continue;
  }
  if (!allowedClasses.has(rule.class)) {
    fail(`${name} has invalid class ${rule.class}`);
  }
  if (rule.path !== packagePath) {
    fail(`${name} declares path ${rule.path}, expected ${packagePath}`);
  }
}

for (const name of Object.keys(declared)) {
  if (!discoveredNames.has(name)) fail(`${name} is classified but no package directory exists`);
}

if (failures.length === 0) pass(`${discoveredNames.size} shared packages classified`);

const runtimeFiles = [...walk(path.join(root, "apps")), ...walk(path.join(root, "packages"))].filter((file) =>
  /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(file),
);

for (const file of runtimeFiles) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  if (rel.startsWith("packages/auth/") || rel.startsWith("packages/database/")) continue;
  const text = fs.readFileSync(file, "utf8");

  for (const deprecatedName of ["@lurexa/auth", "@lurexa/database"]) {
    const importPattern = new RegExp(`(?:from\\s+["']${deprecatedName.replace("/", "\\/")}(?:\\/[^"']*)?["']|import\\s*\\(["']${deprecatedName.replace("/", "\\/")}(?:\\/[^"']*)?["']\\))`);
    if (importPattern.test(text)) fail(`${rel} imports deprecated runtime package ${deprecatedName}`);
  }

  const firstChunk = text.slice(0, 300);
  const isClient = /["']use client["']\s*;?/.test(firstChunk);
  if (isClient && /@lurexa\/backend\/[^"']*\.server(?:["']|\/)/.test(text)) {
    fail(`${rel} is a Client Component importing an explicit backend server-only module`);
  }
}

if (!failures.some((item) => item.includes("deprecated runtime package"))) {
  pass("deprecated auth/database scaffolds have no runtime consumers");
}
if (!failures.some((item) => item.includes("Client Component"))) {
  pass("Client Components do not import explicit backend server-only modules");
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

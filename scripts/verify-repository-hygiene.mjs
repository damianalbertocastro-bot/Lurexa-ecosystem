import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);

const tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);

const forbiddenTrackedPatterns = [
  /^\.temp_val_/,
  /(^|\/)\.env(?:\.|$)/,
  /(^|\/)firebase-debug\.log$/,
  /(^|\/)firestore-debug\.log$/,
];

for (const file of tracked) {
  if (file.endsWith(".env.example")) continue;
  if (forbiddenTrackedPatterns.some((pattern) => pattern.test(file))) {
    fail(`Forbidden secret/temp artifact is tracked: ${file}`);
  }
}
if (!failures.some((item) => item.includes("tracked"))) pass("no forbidden temp or live environment artifacts are tracked");

const codeowners = path.join(root, ".github", "CODEOWNERS");
if (!fs.existsSync(codeowners)) fail(".github/CODEOWNERS is required");
else pass("CODEOWNERS establishes repository ownership");

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (!/^pnpm@\d+\.\d+\.\d+$/.test(packageJson.packageManager ?? "")) {
  fail("packageManager must pin an exact pnpm version");
} else {
  pass(`packageManager is pinned to ${packageJson.packageManager}`);
}

const registry = fs.readFileSync(path.join(root, "packages/config/src/product-registry.ts"), "utf8");
if (!registry.includes('export type LurexaCoreProductId = "learn" | "coach" | "teach" | "admin" | "insight" | "studio"')) {
  fail("the six sibling products must be explicitly typed");
}
if (!registry.includes('classification: "institutional-shell"')) {
  fail("Campus must be explicitly classified as an institutional shell");
}
if (!failures.some((item) => item.includes("sibling products") || item.includes("Campus"))) {
  pass("ecosystem taxonomy separates six products from Campus institutional shell");
}

if (failures.length) {
  console.error("\nRepository hygiene verification failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("\nRepository hygiene verification passed.");

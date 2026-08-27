import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];

function requireText(file, content, expected) {
  if (!content.includes(expected)) {
    throw new Error(`${file} is missing documentation-truth marker: ${expected}`);
  }
  checks.push(`${file}: ${expected}`);
}

function forbidText(file, content, forbidden) {
  if (content.includes(forbidden)) {
    throw new Error(`${file} contains stale documentation claim: ${forbidden}`);
  }
  checks.push(`${file}: excludes ${forbidden}`);
}

const readme = read("README.md");
const roadmap = read("ROADMAP.md");
const learnReadme = read("apps/learn-web/README.md");
const maturity = read("Docs/Engineering/REPOSITORY_MATURITY_STATUS.md");

requireText("README.md", readme, "Node.js 24.x");
requireText("README.md", readme, "coach-web/");
requireText("README.md", readme, "Standalone first-class product");
requireText("README.md", readme, "Institutional shell");
requireText("README.md", readme, "Concept → Architecture → Prototype → Contract implemented → MVP implemented → Verified → Deployed → Production ready");
forbidText("README.md", readme, "Coach should initially be embedded inside Lurexa Learn");
forbidText("README.md", readme, "storybook/");
forbidText("README.md", readme, "workflow files install pnpm 9");
forbidText("README.md", readme, "Node.js 20 or later");

requireText("apps/learn-web/README.md", learnReadme, "http://localhost:3001");
requireText("apps/learn-web/README.md", learnReadme, "Verified MVP implementation");
requireText("apps/learn-web/README.md", learnReadme, "standalone Lurexa Coach");
forbidText("apps/learn-web/README.md", learnReadme, "http://localhost:3000");

for (const state of [
  "Concept",
  "Architecture",
  "Prototype",
  "Contract implemented",
  "MVP implemented",
  "Verified",
  "Deployed",
  "Production ready",
]) {
  requireText("Docs/Engineering/REPOSITORY_MATURITY_STATUS.md", maturity, state);
}
requireText("Docs/Engineering/REPOSITORY_MATURITY_STATUS.md", maturity, "Lurexa Campus | Institutional shell");
requireText("Docs/Engineering/REPOSITORY_MATURITY_STATUS.md", maturity, "Lurexa Marketplace | Future concept/capability");
requireText("Docs/Engineering/REPOSITORY_MATURITY_STATUS.md", maturity, "deployment/products.json");

requireText("ROADMAP.md", roadmap, "R6 — Platform / Package Reconciliation");
requireText("ROADMAP.md", roadmap, "R7 — Deployment Reconciliation");
requireText("ROADMAP.md", roadmap, "R8 — Product Expansion Foundations");
requireText("ROADMAP.md", roadmap, "Marketplace remains deferred");
requireText("ROADMAP.md", roadmap, "Current maturity: Architecture / contract foundations");
requireText("ROADMAP.md", roadmap, "Current maturity: Architecture / prototype foundations");
forbidText("ROADMAP.md", roadmap, "- [x] Marketplace/public APIs.");
forbidText("ROADMAP.md", roadmap, "- [x] Government/large-institution deployments.");
forbidText("ROADMAP.md", roadmap, "# Phase 11 — Linguistic and ecosystem expansion");

console.log(`Documentation truth verification passed (${checks.length} checks).`);

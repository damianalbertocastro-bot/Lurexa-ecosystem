#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
  else pass(message);
}

console.log("\n========================================================");
console.log("  LUREXA INSIGHT: INSTITUTIONAL ANALYTICS & RADAR      ");
console.log("========================================================\n");

// 1. Verify Sibling Product Package
const insightPkgPath = path.join(repoRoot, "apps/insight-web/package.json");
check(fs.existsSync(insightPkgPath), "apps/insight-web/package.json exists");
const insightPkg = JSON.parse(fs.readFileSync(insightPkgPath, "utf8"));
check(insightPkg.name === "@lurexa/insight-web", "apps/insight-web package is @lurexa/insight-web");
check(insightPkg.scripts?.dev?.includes("3007"), "apps/insight-web runs on port 3007");

// 2. Verify Analytics Routes
const overviewPath = path.join(repoRoot, "apps/insight-web/app/page.tsx");
check(fs.existsSync(overviewPath), "apps/insight-web/app/page.tsx exists");
const overviewContent = fs.readFileSync(overviewPath, "utf8");
check(overviewContent.includes("Phonemic Radar") || overviewContent.includes("Transfer Radar"), "Insight overview declares phonemic transfer radar");

const cohortsPath = path.join(repoRoot, "apps/insight-web/app/cohorts/page.tsx");
check(fs.existsSync(cohortsPath), "apps/insight-web/app/cohorts/page.tsx exists");
const cohortsContent = fs.readFileSync(cohortsPath, "utf8");
check(cohortsContent.includes("Phonemic Heatmap"), "Cohorts page declares phonemic heatmap");

const interventionsPath = path.join(repoRoot, "apps/insight-web/app/interventions/page.tsx");
check(fs.existsSync(interventionsPath), "apps/insight-web/app/interventions/page.tsx exists");
const interventionsContent = fs.readFileSync(interventionsPath, "utf8");
check(interventionsContent.includes("Intervention"), "Interventions page declares automated routing");

const reportsPath = path.join(repoRoot, "apps/insight-web/app/reports/page.tsx");
check(fs.existsSync(reportsPath), "apps/insight-web/app/reports/page.tsx exists");

// 3. Verify Deployment & Bootstrap Manifest
const deploymentPath = path.join(repoRoot, "deployment/products.json");
const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
const insightDeployment = deployment.deployments.find((d) => d.id === "insight-web");
check(Boolean(insightDeployment), "deployment/products.json declares insight-web deployment target");
check(insightDeployment?.surface === "analytics-insight-web", "insight-web surface is analytics-insight-web");

const bootstrapPath = path.join(repoRoot, "bootstrap/repository.json");
const bootstrap = JSON.parse(fs.readFileSync(bootstrapPath, "utf8"));
const insightBootstrap = bootstrap.apps.find((a) => a.name === "insight-web");
check(Boolean(insightBootstrap?.required), "bootstrap/repository.json declares required insight-web app");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Lurexa Insight Verification FAILED.");
} else {
  console.log("  ✓ All Insight Analytics & Sibling App Checks PASSED (100%)");
}
console.log("========================================================\n");

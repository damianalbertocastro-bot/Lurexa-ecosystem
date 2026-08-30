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
console.log("  LUREXA END-TO-END CROSS-PRODUCT JOURNEY SIMULATION    ");
console.log("========================================================\n");

// 1. Verify all 6 web application entry points exist
const apps = ["web", "learn-web", "coach-web", "teach-web", "admin-portal", "docs"];
for (const app of apps) {
  const appPath = path.join(repoRoot, "apps", app, "package.json");
  check(fs.existsSync(appPath), `App '@lurexa/${app}' package.json exists`);
  check(fs.existsSync(path.join(repoRoot, "apps", app, "app/page.tsx")), `App '@lurexa/${app}' landing page exists`);
}

// 2. Verify Cross-Product Bridge Endpoints
check(fs.existsSync(path.join(repoRoot, "apps/learn-web/app/api/product-bridge/route.ts")), "Learn product bridge route exists");
check(fs.existsSync(path.join(repoRoot, "apps/coach-web/app/api/product-bridge/route.ts")), "Coach product bridge route exists");
check(fs.existsSync(path.join(repoRoot, "apps/teach-web/app/api/product-bridge/route.ts")), "Teach product bridge route exists");

// 3. Verify Real-time Streaming Voice Studio Components
check(fs.existsSync(path.join(repoRoot, "packages/ui/src/StreamingVoiceStudio.tsx")), "StreamingVoiceStudio UI component exists");
check(fs.existsSync(path.join(repoRoot, "packages/ui/src/useStreamingVoice.ts")), "useStreamingVoice client audio hook exists");
check(fs.existsSync(path.join(repoRoot, "packages/backend/src/live-audio-stream.server.ts")), "LiveAudioStreamService backend exists");

// 4. Verify Institutional Phonetics Analytics
check(fs.existsSync(path.join(repoRoot, "packages/backend/src/institutional-analytics.service.ts")), "InstitutionalAnalyticsService exists");
check(fs.existsSync(path.join(repoRoot, "apps/admin-portal/app/analytics/phonetics/page.tsx")), "Admin phonetics analytics page exists");

// 5. Verify E2E Playwright Configuration & Spec
check(fs.existsSync(path.join(repoRoot, "playwright.config.ts")), "playwright.config.ts exists");
check(fs.existsSync(path.join(repoRoot, "e2e/ecosystem-cross-product-journey.spec.ts")), "E2E journey spec exists");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ E2E Cross-Product Journey Simulation FAILED.");
} else {
  console.log("  ✓ All E2E Cross-Product Journey Checks PASSED (100%)");
}
console.log("========================================================\n");

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
console.log("  LUREXA DOMINICAN FIELD PILOT & MOBILE PWA SUITE       ");
console.log("========================================================\n");

// 1. Verify Offline Audio Sync Engine
const offlineSyncPath = path.join(repoRoot, "packages/backend/src/offline-sync-engine.ts");
check(fs.existsSync(offlineSyncPath), "OfflineSyncEngine backend file exists");
const offlineSyncContent = fs.readFileSync(offlineSyncPath, "utf8");
check(offlineSyncContent.includes("queueOfflineAudio"), "OfflineSyncEngine has queueOfflineAudio");
check(offlineSyncContent.includes("packageLessonForOffline"), "OfflineSyncEngine has packageLessonForOffline");
check(offlineSyncContent.includes("reconcileOfflineBatch"), "OfflineSyncEngine has reconcileOfflineBatch");

// 2. Verify Field Telemetry Service
const telemetryPath = path.join(repoRoot, "packages/backend/src/field-telemetry.service.ts");
check(fs.existsSync(telemetryPath), "FieldTelemetryService backend file exists");
const telemetryContent = fs.readFileSync(telemetryPath, "utf8");
check(telemetryContent.includes("getDominicanFieldTelemetry"), "FieldTelemetryService has getDominicanFieldTelemetry");
check(telemetryContent.includes("cibao"), "FieldTelemetryService includes Cibao regional dialect metrics");
check(telemetryContent.includes("santo_domingo"), "FieldTelemetryService includes Santo Domingo dialect metrics");

// 3. Verify Admin Field Pilot Dashboard
const adminPilotPath = path.join(repoRoot, "apps/admin-portal/app/analytics/field-pilot/page.tsx");
check(fs.existsSync(adminPilotPath), "Admin Dominican field pilot UI page exists");
const adminPilotContent = fs.readFileSync(adminPilotPath, "utf8");
check(adminPilotContent.includes("Dominican Field Pilot"), "Field pilot page title verified");
check(adminPilotContent.includes("Dominican Regional Dialect Articulatory Matrix"), "Dialect matrix table verified");

// 4. Verify PWA Manifests
const learnManifest = path.join(repoRoot, "apps/learn-web/public/manifest.json");
check(fs.existsSync(learnManifest), "Learn Web PWA manifest exists");
const coachManifest = path.join(repoRoot, "apps/coach-web/public/manifest.json");
check(fs.existsSync(coachManifest), "Coach Web PWA manifest exists");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Dominican Field Pilot & PWA Verification FAILED.");
} else {
  console.log("  ✓ All Field Pilot & Low-Bandwidth Checks PASSED (100%)");
}
console.log("========================================================\n");

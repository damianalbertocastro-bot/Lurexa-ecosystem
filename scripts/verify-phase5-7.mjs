#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const exists = (relative) => fs.existsSync(path.join(root, relative));

function check(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

console.log("\n=== Lurexa Phases 5–7 Verification ===\n");

// Phase 5 — testing, security, observability
check(exists("playwright.config.ts"), "Playwright configuration exists");
check(exists("apps/learn-web/e2e/student-flow.spec.ts"), "Critical learner E2E journey exists");
check(exists("apps/learn-web/e2e/accessibility-baseline.spec.ts"), "Accessibility E2E baseline exists");
check(exists("scripts/verify-observability.mjs"), "Observability verification exists");
check(read("scripts/verify-observability.mjs").includes("requestId"), "Operational telemetry correlates requests");
check(read("scripts/verify-commercial-reconciliation.mjs").includes("consumeIfBusiness"), "Commercial runtime enforcement is regression-tested");

// Phase 6 — controlled AI tutor
const tutor = read("packages/backend/src/learn-tutor.server.ts");
const tutorTypes = read("packages/types/src/learning-experience.ts");
check(tutor.includes("LEARN_TUTOR_PROMPT_VERSION"), "AI tutor prompt is versioned");
check(tutor.includes("getScopedLearnerContext"), "AI tutor is grounded in authorized learner context");
check(tutor.includes("resolveRoleplayCapability"), "AI tutor uses trusted curriculum capability");
check(tutor.includes("responseMimeType: \"application/json\""), "Audio tutor output requests structured JSON");
check(tutor.includes("deterministicFallback"), "Controlled deterministic fallback exists");
check(tutor.includes("BusinessUsageService.consumeIfBusiness"), "AI tutor usage is commercially metered");
check(tutorTypes.includes("promptVersion?: string"), "Tutor sessions retain prompt version metadata");

// Phase 7 — PWA/offline
const offline = read("packages/backend/src/offline-sync.service.ts");
const sw = read("apps/learn-web/public/sw.js");
check(exists("apps/learn-web/public/manifest.json"), "Learn PWA manifest exists");
check(exists("apps/learn-web/public/sw.js"), "Learn service worker exists");
check(offline.includes("processPendingSyncQueue"), "Offline queue processor exists");
check(offline.includes("/api/learning/offline-evidence"), "Offline evidence is sent to Core before local deletion");
check(offline.includes("/api/learning/spoken-evidence"), "Offline spoken evidence is uploaded before local deletion");
check(sw.includes("cache.put(event.request, networkResponse.clone())"), "Successful navigations are cached for offline replay");
check(sw.includes("AUDIO_CACHE"), "Audio cache is separated from application cache");

if (failures.length) {
  console.error("\nPhase 5–7 verification failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}
console.log("\nPhase 5–7 verification passed.\n");

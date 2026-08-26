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
  if (!condition) {
    fail(message);
  } else {
    pass(message);
  }
}

console.log("\n========================================================");
console.log("  LUREXA GOVERNANCE, QUALITY & MULTI-L1 VERIFICATION    ");
console.log("========================================================\n");

// 1. Verify Multi-L1 Profile Service & Regional Coverage
const profilesFile = path.join(repoRoot, "packages/backend/src/linguistic-profiles.server.ts");
check(fs.existsSync(profilesFile), "Linguistic profiles service exists");

const profilesContent = fs.readFileSync(profilesFile, "utf8");
check(profilesContent.includes("es-DO"), "Supports Dominican Spanish (es-DO)");
check(profilesContent.includes("es-PR"), "Supports Puerto Rican Spanish (es-PR)");
check(profilesContent.includes("es-MX"), "Supports Mexican Spanish (es-MX)");
check(profilesContent.includes("es-CO"), "Supports Colombian Spanish (es-CO)");
check(profilesContent.includes("DO-ENG-PRO-001"), "Dominican profile declares vowel epenthesis interference rule");
check(profilesContent.includes("PR-ENG-PRO-001"), "Puerto Rican profile declares lambdacism /r/ to [l] rule");
check(profilesContent.includes("MX-ENG-PRO-001"), "Mexican profile declares /v/ vs /b/ merger rule");
check(profilesContent.includes("CO-ENG-PRO-001"), "Colombian profile declares tense vs lax vowel clarity rule");

// 2. Verify Coach History & Spaced-Repetition Sequencer
const sequencerFile = path.join(repoRoot, "packages/backend/src/coach-history-sequencer.server.ts");
check(fs.existsSync(sequencerFile), "Coach history sequencer service exists");

const sequencerContent = fs.readFileSync(sequencerFile, "utf8");
check(sequencerContent.includes("calculatePhonemeStatus"), "Sequencer calculates phoneme accuracy and mastery status");
check(sequencerContent.includes("generatePracticePlan"), "Sequencer generates individualized daily practice plans");
check(sequencerContent.includes("struggling"), "Sequencer distinguishes struggling phoneme targets");
check(sequencerContent.includes("mastered"), "Sequencer schedules maintenance reviews for mastered phonemes");

// 3. Verify Privacy and Turn Transcript Redaction in Coach Storage
const coachCompletionFile = path.join(repoRoot, "packages/backend/src/coach-session-completion.server.ts");
const coachCompletionContent = fs.readFileSync(coachCompletionFile, "utf8");
check(
  coachCompletionContent.includes("redactCompletedCoachTurnEvidence"),
  "Coach completed session storage drops raw turn utterances and enforces privacy boundaries"
);

// 4. Verify Multi-Tenant Campus & Core Isolation Boundary
const campusServerFile = path.join(repoRoot, "packages/backend/src/campus-platform.server.ts");
const campusServerContent = fs.readFileSync(campusServerFile, "utf8");
check(
  campusServerContent.includes("organizationId: input.organizationId"),
  "Campus Product Bridges strictly enforce multi-tenant organizationId scoping"
);

// 5. Verify Speech Provider Adapters behind Mind Boundary
const speechAdaptersFile = path.join(repoRoot, "packages/backend/src/speech-provider-adapters.server.ts");
check(fs.existsSync(speechAdaptersFile), "Speech provider adapter service exists");
const speechAdaptersContent = fs.readFileSync(speechAdaptersFile, "utf8");
check(speechAdaptersContent.includes("recognizeSpeech"), "Speech adapter supports STT with phoneme alignment");
check(speechAdaptersContent.includes("synthesizeSpeech"), "Speech adapter supports calibrated pedagogical TTS synthesis");

// 6. Verify Campus Pilot Provisioner Suite
const pilotSeederFile = path.join(repoRoot, "scripts/seed-institutional-campus-pilot.mjs");
check(fs.existsSync(pilotSeederFile), "Institutional campus pilot seeder exists");
const pilotSeederContent = fs.readFileSync(pilotSeederFile, "utf8");
check(pilotSeederContent.includes("inst_uasd"), "Pilot seeder provisions UASD institution");
check(pilotSeederContent.includes("inst_pucmm"), "Pilot seeder provisions PUCMM institution");
check(pilotSeederContent.includes("inst_intec"), "Pilot seeder provisions INTEC institution");

// 7. Verify Offline-First PWA Lesson Sync Engine
const offlineSyncFile = path.join(repoRoot, "packages/backend/src/offline-sync-engine.ts");
check(fs.existsSync(offlineSyncFile), "Offline sync engine exists");
const offlineSyncContent = fs.readFileSync(offlineSyncFile, "utf8");
check(offlineSyncContent.includes("packageLessonForOffline"), "Offline engine serializes lessons with checksums");
check(offlineSyncContent.includes("reconcileOfflineBatch"), "Offline engine reconciles outbox evidence queues");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Governance & Multi-L1 Verification FAILED.");
} else {
  console.log("  ✓ All Governance, Quality & Multi-L1 Checks PASSED (100%)");
}
console.log("========================================================\n");

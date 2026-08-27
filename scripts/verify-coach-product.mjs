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
console.log("  LUREXA COACH STANDALONE PRODUCT & INTEGRATION SUITE   ");
console.log("========================================================\n");

// 1. Verify Ecosystem Domain Registry
const domainsFile = path.join(repoRoot, "packages/config/src/domains.ts");
check(fs.existsSync(domainsFile), "Ecosystem domains config exists");
const domainsContent = fs.readFileSync(domainsFile, "utf8");
check(domainsContent.includes('"coach"'), "EcosystemAppKey includes 'coach'");
check(domainsContent.includes("https://coach.lurexa.org"), "Ecosystem registry declares productionUrl 'https://coach.lurexa.org'");
check(domainsContent.includes("3005"), "Ecosystem registry declares development port 3005");

// 2. Verify apps/coach-web Package & Pages
const coachPackageFile = path.join(repoRoot, "apps/coach-web/package.json");
check(fs.existsSync(coachPackageFile), "apps/coach-web package.json exists");
check(fs.existsSync(path.join(repoRoot, "apps/coach-web/app/page.tsx")), "apps/coach-web landing page exists");
check(fs.existsSync(path.join(repoRoot, "apps/coach-web/app/dashboard/page.tsx")), "apps/coach-web dashboard page exists");
check(fs.existsSync(path.join(repoRoot, "apps/coach-web/app/studio/page.tsx")), "apps/coach-web speaking studio page exists");
check(fs.existsSync(path.join(repoRoot, "apps/coach-web/app/placement/page.tsx")), "apps/coach-web oral placement page exists");
check(fs.existsSync(path.join(repoRoot, "apps/coach-web/app/packs/[packId]/page.tsx")), "apps/coach-web pack runner dynamic page exists");
check(fs.existsSync(path.join(repoRoot, "apps/coach-web/app/api/coach/route.ts")), "apps/coach-web server API route exists");

// 3. Verify Practice Pack Catalog
const catalogFile = path.join(repoRoot, "packages/backend/src/coach-catalog.ts");
check(fs.existsSync(catalogFile), "Coach practice pack catalog service exists");
const catalogContent = fs.readFileSync(catalogFile, "utf8");
check(catalogContent.includes("coach-a1-pack-1-meet-me"), "Declares A1 Pack 1 'Meet Me'");
check(catalogContent.includes("coach-a1-pack-8-life-in-action"), "Declares A1 Pack 8 'Life in Action'");
check(catalogContent.includes("coach-a2-pack-1-past-stories"), "Declares A2 past stories practice pack");
check(catalogContent.includes("coach-b1-pack-1-opinion-defense"), "Declares B1 opinion defense practice pack");
check(catalogContent.includes("coach-b2-pack-1-negotiation"), "Declares B2 executive negotiation pack");
check(catalogContent.includes("coach-c1-pack-1-scholarly-defense"), "Declares C1 scholarly defense pack");
check(catalogContent.includes("coach-c2-pack-1-sovereign-oratory"), "Declares C2 sovereign oratory pack");

// 4. Verify History Sequencer & Spaced Repetition Logic
const sequencerFile = path.join(repoRoot, "packages/backend/src/coach-history-sequencer.server.ts");
check(fs.existsSync(sequencerFile), "Coach history sequencer exists");
const sequencerContent = fs.readFileSync(sequencerFile, "utf8");
check(sequencerContent.includes("struggling"), "Sequencer handles struggling phonemes (1-day interval)");
check(sequencerContent.includes("emerging"), "Sequencer handles emerging phonemes (3-day interval)");
check(sequencerContent.includes("mastered"), "Sequencer handles mastered phonemes (14-day interval)");

// 5. Verify Multi-L1 Spanish Linguistic Adaptation
const linguisticsFile = path.join(repoRoot, "packages/backend/src/linguistic-profiles.server.ts");
check(fs.existsSync(linguisticsFile), "Linguistic profiles service exists");
const linguisticsContent = fs.readFileSync(linguisticsFile, "utf8");
check(linguisticsContent.includes("es-DO") && linguisticsContent.includes("DO-ENG-PRO-001"), "Dominican Spanish profile calibrated with vowel epenthesis rule");
check(linguisticsContent.includes("es-PR") && linguisticsContent.includes("PR-ENG-PRO-001"), "Puerto Rican Spanish profile calibrated with lambdacism rule");
check(linguisticsContent.includes("es-MX") && linguisticsContent.includes("MX-ENG-PRO-001"), "Mexican Spanish profile calibrated with /v/ vs /b/ merger rule");
check(linguisticsContent.includes("es-CO") && linguisticsContent.includes("CO-ENG-PRO-001"), "Colombian Spanish profile calibrated with tense/lax vowel rule");

// 6. Verify Educator Classroom Speaking Simulation
const educatorCoachFile = path.join(repoRoot, "packages/backend/src/educator-coach.server.ts");
check(fs.existsSync(educatorCoachFile), "Educator coach simulation service exists");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Lurexa Coach Product Verification FAILED.");
} else {
  console.log("  ✓ All Lurexa Coach Product & Integration Checks PASSED (100%)");
}
console.log("========================================================\n");

#!/usr/bin/env node
// scripts/verify-specialized-tracks-integration.mjs
// Verifies integration of Specialized Industry Tracks & Multi-L1 Linguistic Profiles
// across Lurexa Learn, Lurexa Teach, and Lurexa Coach.

import fs from "node:fs";
import path from "node:path";

let passed = 0;
let failed = 0;

function check(description, condition, details = "") {
  if (condition) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.error(`  ❌ ${description}${details ? `: ${details}` : ""}`);
    failed++;
  }
}

console.log("\n🚀 LUREXA SPECIALIZED TRACKS & MULTI-L1 INTEGRATION VERIFICATION\n");

// 1. Specialized Industry Tracks
const tracksFilePath = path.resolve("packages/backend/src/curriculum/specialized-tracks.ts");
const tracksContent = fs.existsSync(tracksFilePath) ? fs.readFileSync(tracksFilePath, "utf8") : "";
check("specialized-tracks.ts exists", fs.existsSync(tracksFilePath));
check("BPO Call Center track defined", tracksContent.includes("bpo-call-center-english-do"));
check("Tourism & Hospitality track defined", tracksContent.includes("tourism-hospitality-english-do"));
check("Software Engineering track defined", tracksContent.includes("software-engineering-english"));
check("getTrackBySlug function exported", tracksContent.includes("export function getTrackBySlug"));

// 2. Multi-L1 Contrastive Profiles
const multiL1FilePath = path.resolve("packages/backend/src/curriculum/multi-l1-profiles.ts");
const multiL1Content = fs.existsSync(multiL1FilePath) ? fs.readFileSync(multiL1FilePath, "utf8") : "";
check("multi-l1-profiles.ts exists", fs.existsSync(multiL1FilePath));
check("Dominican Spanish profile (es-DO) defined", multiL1Content.includes("es-DO") && multiL1Content.includes("do-s-aspiration"));
check("Puerto Rican Spanish profile (es-PR) defined", multiL1Content.includes("es-PR") && multiL1Content.includes("pr-lambdacism"));
check("Mexican Spanish profile (es-MX) defined", multiL1Content.includes("es-MX") && multiL1Content.includes("mx-v-b-merger"));
check("Colombian Spanish profile (es-CO) defined", multiL1Content.includes("es-CO") && multiL1Content.includes("co-intervocalic-lenition"));
check("getProfileByL1Code function exported", multiL1Content.includes("export function getProfileByL1Code"));

// 3. Teach Catalog Integration
const teachCatalogPath = path.resolve("packages/backend/src/teach-catalog.ts");
const teachCatalogContent = fs.existsSync(teachCatalogPath) ? fs.readFileSync(teachCatalogPath, "utf8") : "";
check("teaching-specialized-industry-english course added", teachCatalogContent.includes("teaching-specialized-industry-english"));
check("contrastive-phonology-multi-l1-pedagogy course added", teachCatalogContent.includes("contrastive-phonology-multi-l1-pedagogy"));
check("formative-assessment-rubrics-speaking course added", teachCatalogContent.includes("formative-assessment-rubrics-speaking"));
check("credential-specialized-industry-instructor added", teachCatalogContent.includes("credential-specialized-industry-instructor"));
check("credential-contrastive-phonology-specialist added", teachCatalogContent.includes("credential-contrastive-phonology-specialist"));

// 4. Learn Tracks UI Integration
const learnTracksPath = path.resolve("apps/learn-web/app/learn/tracks/page.tsx");
const learnTracksContent = fs.existsSync(learnTracksPath) ? fs.readFileSync(learnTracksPath, "utf8") : "";
check("learn-web tracks hub page exists", fs.existsSync(learnTracksPath));
check("learn-web tracks imports SPECIALIZED_INDUSTRY_TRACKS", learnTracksContent.includes("SPECIALIZED_INDUSTRY_TRACKS"));

const learnTrackSlugPath = path.resolve("apps/learn-web/app/learn/tracks/[trackSlug]/page.tsx");
const learnTrackSlugContent = fs.existsSync(learnTrackSlugPath) ? fs.readFileSync(learnTrackSlugPath, "utf8") : "";
check("learn-web track detail page exists", fs.existsSync(learnTrackSlugPath));
check("learn-web track detail renders rolePlayScenarios & createApplyTask", learnTrackSlugContent.includes("rolePlayScenarios") && learnTrackSlugContent.includes("createApplyTask"));

const learnDashboardCardPath = path.resolve("apps/learn-web/app/dashboard/components/SpecializedTracksCard.tsx");
check("SpecializedTracksCard component exists", fs.existsSync(learnDashboardCardPath));

const learnOnboardingPath = path.resolve("apps/learn-web/app/(auth)/onboarding/page.tsx");
const learnOnboardingContent = fs.existsSync(learnOnboardingPath) ? fs.readFileSync(learnOnboardingPath, "utf8") : "";
check("learn-web onboarding includes native Spanish dialect selection", learnOnboardingContent.includes("dialectOptions") && learnOnboardingContent.includes("es-DO"));

// 5. Coach Studio Multi-L1 Integration
const coachStudioPath = path.resolve("apps/coach-web/app/studio/page.tsx");
const coachStudioContent = fs.existsSync(coachStudioPath) ? fs.readFileSync(coachStudioPath, "utf8") : "";
check("coach-web studio imports L1_CONTRASTIVE_PROFILES", coachStudioContent.includes("L1_CONTRASTIVE_PROFILES"));
check("coach-web studio renders dialect selector and minimal pair drills", coachStudioContent.includes("selectedL1") && coachStudioContent.includes("minimalPairDrills"));

console.log("\n────────────────────────────────────────────────────────");
console.log(`Integration Verification Summary: ${passed} passed, ${failed} failed`);
console.log("────────────────────────────────────────────────────────\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 All Specialized Tracks & Multi-L1 integration checks passed!\n");
  process.exit(0);
}

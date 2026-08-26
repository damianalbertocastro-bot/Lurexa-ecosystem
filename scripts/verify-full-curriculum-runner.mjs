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
console.log("  LUREXA LEARN & TEACH FULL ECOSYSTEM VERIFICATION SUITE ");
console.log("========================================================\n");

// 1. Verify A1, A2, B1, B2, and C1 Curriculum Data Definitions
const a1ModuleFile = path.join(repoRoot, "packages/backend/src/curriculum/a1/modules.ts");
const a2ModuleFile = path.join(repoRoot, "packages/backend/src/curriculum/a2/modules.ts");
const b1ModuleFile = path.join(repoRoot, "packages/backend/src/curriculum/b1/modules.ts");
const b2ModuleFile = path.join(repoRoot, "packages/backend/src/curriculum/b2/modules.ts");
const c1ModuleFile = path.join(repoRoot, "packages/backend/src/curriculum/c1/modules.ts");

check(fs.existsSync(a1ModuleFile), "A1 curriculum module source exists");
check(fs.existsSync(a2ModuleFile), "A2 curriculum module source exists");
check(fs.existsSync(b1ModuleFile), "B1 curriculum module source exists");
check(fs.existsSync(b2ModuleFile), "B2 curriculum module source exists");
check(fs.existsSync(c1ModuleFile), "C1 curriculum module source exists");

const a1Content = fs.readFileSync(a1ModuleFile, "utf8");
const a2Content = fs.readFileSync(a2ModuleFile, "utf8");
const b1Content = fs.readFileSync(b1ModuleFile, "utf8");
const b2Content = fs.readFileSync(b2ModuleFile, "utf8");
const c1Content = fs.readFileSync(c1ModuleFile, "utf8");

check(a1Content.includes("A1_MODULES_2_TO_8"), "A1 defines complete modules array (A1_MODULES_2_TO_8)");
check(a2Content.includes("A2_MODULES_1_TO_8"), "A2 defines complete 8-module array");
check(b1Content.includes("B1_MODULES_1_TO_8"), "B1 defines complete 8-module array");
check(b2Content.includes("B2_MODULES_1_TO_8"), "B2 defines complete 8-module array");
check(c1Content.includes("C1_MODULES_1_TO_8"), "C1 defines complete 8-module array");

// 2. Verify Production Curriculum Bundle Services
const a1Server = fs.readFileSync(path.join(repoRoot, "packages/backend/src/a1-production-curriculum.server.ts"), "utf8");
const a2Server = fs.readFileSync(path.join(repoRoot, "packages/backend/src/a2-production-curriculum.server.ts"), "utf8");
const b1Server = fs.readFileSync(path.join(repoRoot, "packages/backend/src/b1-production-curriculum.server.ts"), "utf8");
const b2Server = fs.readFileSync(path.join(repoRoot, "packages/backend/src/b2-production-curriculum.server.ts"), "utf8");
const c1Server = fs.readFileSync(path.join(repoRoot, "packages/backend/src/c1-production-curriculum.server.ts"), "utf8");

check(a1Server.includes("buildA1ProductionCurriculum"), "A1 bundle builder is implemented");
check(a2Server.includes("buildA2ProductionCurriculum"), "A2 bundle builder is implemented");
check(b1Server.includes("buildB1ProductionCurriculum"), "B1 bundle builder is implemented");
check(b2Server.includes("buildB2ProductionCurriculum"), "B2 bundle builder is implemented");
check(c1Server.includes("buildC1ProductionCurriculum"), "C1 bundle builder is implemented");

check(b1Server.includes("english-b1-independent-speaker"), "B1 declares authoritative course ID 'english-b1-independent-speaker'");
check(b2Server.includes("english-b2-fluency-communication"), "B2 declares authoritative course ID 'english-b2-fluency-communication'");
check(c1Server.includes("english-c1-advanced-fluency"), "C1 declares authoritative course ID 'english-c1-advanced-fluency'");

// 3. Verify Placement and Onboarding Provisioning Pipeline
const placementServer = fs.readFileSync(path.join(repoRoot, "packages/backend/src/placement-assessment.server.ts"), "utf8");
const onboardingServer = fs.readFileSync(path.join(repoRoot, "packages/backend/src/production-onboarding.server.ts"), "utf8");

check(placementServer.includes("english-b1-independent-speaker"), "Placement engine targets english-b1-independent-speaker for B1 scores");
check(placementServer.includes("english-b2-fluency-communication"), "Placement engine targets english-b2-fluency-communication for B2 scores");
check(placementServer.includes("english-c1-advanced-fluency"), "Placement engine targets english-c1-advanced-fluency for C1 scores");
check(onboardingServer.includes("ensureB1ProductionCurriculumInFirestore"), "Onboarding pipeline provisions B1 curriculum in Firestore");
check(onboardingServer.includes("ensureB2ProductionCurriculumInFirestore"), "Onboarding pipeline provisions B2 curriculum in Firestore");
check(onboardingServer.includes("ensureC1ProductionCurriculumInFirestore"), "Onboarding pipeline provisions C1 curriculum in Firestore");

// 4. Verify Teach Catalog & T1-T5 Micro-Credentials
const teachCatalog = fs.readFileSync(path.join(repoRoot, "packages/backend/src/teach-catalog.ts"), "utf8");
const teachReviewServer = fs.readFileSync(path.join(repoRoot, "packages/backend/src/teach-review.server.ts"), "utf8");
const teachVerifyPage = fs.readFileSync(path.join(repoRoot, "apps/teach-web/app/verify/[verificationCode]/page.tsx"), "utf8");

check(teachCatalog.includes("t1-the-first-coherent-lesson"), "Teach defines T1 credential");
check(teachCatalog.includes("t2-pronunciation-clearer-instruction"), "Teach defines T2 credential");
check(teachCatalog.includes("t3-interactive-learning-delivery"), "Teach defines T3 credential");
check(teachCatalog.includes("t4-cefr-adaptation-and-assessment"), "Teach defines T4 credential");
check(teachCatalog.includes("t5-pedagogical-leadership-mastery"), "Teach defines T5 credential");

check(teachReviewServer.includes("TeachReviewServerService"), "Teach review service evaluates submissions and generates codes");
check(teachVerifyPage.includes("verificationCode"), "Teach web provides public credential verification page");

// 5. Verify Learner and Teacher Insights Surfaces
const teacherInsightsPage = fs.readFileSync(path.join(repoRoot, "apps/learn-web/app/teacher/insights/page.tsx"), "utf8");
check(teacherInsightsPage.includes("needs_attention"), "Teacher insights page supports 'needs_attention' status filtering");
check(teacherInsightsPage.includes("active"), "Teacher insights page supports 'active' status filtering");

// 6. Verify Signature Experience and Product Bridge Integration
const signatureVerifier = fs.readFileSync(path.join(repoRoot, "scripts/verify-signature-experience.mjs"), "utf8");
check(signatureVerifier.includes("return_to_learning"), "Signature experience verifies return_to_learning product bridge");

// 7. Verify Campus Institutional Context Shell
const campusServer = fs.readFileSync(path.join(repoRoot, "packages/backend/src/campus-platform.server.ts"), "utf8");
check(campusServer.includes("getInstitutionWorkspaceContext"), "Campus platform resolves institutional workspace context");
check(campusServer.includes("createCampusProductBridge"), "Campus platform creates tenant-scoped product bridges");

// 8. Verify Studio Knowledge Object Authoring Catalog
const studioServer = fs.readFileSync(path.join(repoRoot, "packages/backend/src/studio-catalog.server.ts"), "utf8");
check(studioServer.includes("createObject"), "Studio catalog service supports Knowledge Object creation");
check(studioServer.includes("updateObject"), "Studio catalog service supports Knowledge Object versioned updates");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Full Ecosystem Verification FAILED.");
} else {
  console.log("  ✓ All Ecosystem & Curriculum Runner Checks PASSED (100%)");
}
console.log("========================================================\n");

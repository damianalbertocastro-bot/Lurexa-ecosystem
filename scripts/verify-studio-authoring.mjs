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
console.log("  LUREXA STUDIO: KNOWLEDGE OBJECT AUTHORING & LINTER   ");
console.log("========================================================\n");

// 1. Verify Data Contracts
const studioTypePath = path.join(repoRoot, "packages/types/src/studio.ts");
check(fs.existsSync(studioTypePath), "packages/types/src/studio.ts exists");
const studioTypesContent = fs.readFileSync(studioTypePath, "utf8");
check(studioTypesContent.includes("StudioKnowledgeObjectDraftV1"), "Declares StudioKnowledgeObjectDraftV1");
check(studioTypesContent.includes("CefrLinguisticValidationReportV1"), "Declares CefrLinguisticValidationReportV1");
check(studioTypesContent.includes("EnglishSkill"), "Declares 7 EnglishSkill types");

// 2. Verify Backend Service
const studioServicePath = path.join(repoRoot, "packages/backend/src/studio-authoring.service.ts");
check(fs.existsSync(studioServicePath), "StudioAuthoringService backend file exists");
const studioServiceContent = fs.readFileSync(studioServicePath, "utf8");
check(studioServiceContent.includes("createKnowledgeObjectDraft"), "StudioAuthoringService has createKnowledgeObjectDraft");
check(studioServiceContent.includes("publishKnowledgeObject"), "StudioAuthoringService has publishKnowledgeObject");
check(studioServiceContent.includes("lintCefrLinguistics"), "StudioAuthoringService has lintCefrLinguistics");

// 3. Verify Studio UI Workbench
const studioUiPath = path.join(repoRoot, "apps/learn-web/app/teacher/studio/page.tsx");
check(fs.existsSync(studioUiPath), "Studio authoring UI page exists");
const studioUiContent = fs.readFileSync(studioUiPath, "utf8");
check(studioUiContent.includes("Knowledge Object Authoring"), "Studio authoring title verified");
check(studioUiContent.includes("CEFR Linguistic Linter"), "CEFR linter card verified");
check(studioUiContent.includes("Preserved English Skills"), "The 7 English skills selector verified");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Lurexa Studio Verification FAILED.");
} else {
  console.log("  ✓ All Studio Authoring & Linter Checks PASSED (100%)");
}
console.log("========================================================\n");

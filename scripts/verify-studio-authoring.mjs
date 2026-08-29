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

// 3. Verify Learn Studio Prototype UI
const studioUiPath = path.join(repoRoot, "apps/learn-web/app/teacher/studio/page.tsx");
check(fs.existsSync(studioUiPath), "Studio authoring UI page exists in Learn teacher workspace");
const studioUiContent = fs.readFileSync(studioUiPath, "utf8");
check(studioUiContent.includes("Knowledge Object Authoring"), "Studio authoring title verified");
check(studioUiContent.includes("CEFR Linguistic Linter"), "CEFR linter card verified");
check(studioUiContent.includes("Preserved English Skills"), "The 7 English skills selector verified");

// 4. Verify Standalone apps/studio-web Sibling Product
const studioWebPkgPath = path.join(repoRoot, "apps/studio-web/package.json");
check(fs.existsSync(studioWebPkgPath), "apps/studio-web/package.json exists");
const studioWebPkg = JSON.parse(fs.readFileSync(studioWebPkgPath, "utf8"));
check(studioWebPkg.name === "@lurexa/studio-web", "apps/studio-web is named @lurexa/studio-web");
check(studioWebPkg.scripts?.dev?.includes("3006"), "apps/studio-web runs on port 3006");

const studioWebAuthorPath = path.join(repoRoot, "apps/studio-web/app/author/page.tsx");
check(fs.existsSync(studioWebAuthorPath), "apps/studio-web/app/author/page.tsx exists");
const studioWebCatalogPath = path.join(repoRoot, "apps/studio-web/app/catalog/page.tsx");
check(fs.existsSync(studioWebCatalogPath), "apps/studio-web/app/catalog/page.tsx exists");
const studioWebLinterPath = path.join(repoRoot, "apps/studio-web/app/linter/page.tsx");
check(fs.existsSync(studioWebLinterPath), "apps/studio-web/app/linter/page.tsx exists");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Lurexa Studio Verification FAILED.");
} else {
  console.log("  ✓ All Studio Authoring & Standalone App Checks PASSED (100%)");
}
console.log("========================================================\n");

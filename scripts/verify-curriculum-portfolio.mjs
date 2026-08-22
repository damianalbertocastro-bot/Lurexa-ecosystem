#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const portfolioPath = path.join(repoRoot, "Docs/Curriculum/curriculum-portfolio.json");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function exists(relativePath) {
  return Boolean(relativePath) && fs.existsSync(path.join(repoRoot, relativePath));
}

function requireExisting(relativePath, label) {
  if (!exists(relativePath)) {
    fail(`${label} references missing file: ${relativePath}`);
    return false;
  }
  return true;
}

function completeBoolean(value) {
  return value === true;
}

function completeCapstone(value) {
  return value === "implemented-and-calibrated" || value === "complete";
}

function collectCompetencyIds(source, level = "A1") {
  const pattern = new RegExp(`EN\\.${level}\\.[A-Z0-9_]+(?:\\.[A-Z0-9_]+)+`, "g");
  return new Set(source.match(pattern) ?? []);
}

if (!exists("Docs/Curriculum/curriculum-portfolio.json")) {
  fail("curriculum portfolio manifest exists");
  process.exit(1);
}

const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));

if (portfolio.schemaVersion !== "1.1.0") fail("portfolio schemaVersion must be 1.1.0");
else pass("curriculum portfolio schema is versioned");

requireExisting(portfolio.languageCore?.document ?? "", "language core");
requireExisting(portfolio.qualityAuthority ?? "", "quality authority");
requireExisting(portfolio.capstoneAuthority ?? "", "capstone authority");
requireExisting(portfolio.productContract ?? "", "product contract");

if (!Array.isArray(portfolio.priorityPath) || portfolio.priorityPath.length !== 9) {
  fail("portfolio must declare the nine-step authoritative priority path");
} else {
  pass("portfolio declares the authoritative implementation priority path");
}

const programs = Array.isArray(portfolio.programs) ? portfolio.programs : [];
if (!programs.length) fail("portfolio declares at least one program");
else pass(`portfolio declares ${programs.length} governed program entries`);

const ids = new Set();
for (const program of programs) {
  if (!program.id || typeof program.id !== "string") {
    fail("every portfolio program has a stable id");
    continue;
  }
  if (ids.has(program.id)) fail(`duplicate portfolio program id: ${program.id}`);
  ids.add(program.id);

  const documents = Array.isArray(program.documents) ? program.documents : [];
  if (!documents.length) fail(`${program.id} has at least one governing document`);
  for (const document of documents) requireExisting(document, program.id);

  if (program.kind === "learner-language" && !program.integratedCapstone) {
    fail(`${program.id} must declare an integrated level capstone status`);
  }
  if (program.kind === "teacher-development" && !program.integratedCapstone) {
    fail(`${program.id} must declare integrated professional-stage capstones`);
  }

  if (program.curriculumComplete === true) {
    for (const field of ["macroMap", "competencyMatrix", "moduleBlueprints", "productionBlueprints", "runtimeIntegrated"]) {
      if (!completeBoolean(program[field])) {
        fail(`${program.id} cannot be curriculumComplete while ${field} is not fully complete`);
      }
    }
    if (program.representativePilot !== "complete") {
      fail(`${program.id} cannot be curriculumComplete before representativePilot is complete`);
    }
    if ((program.kind === "learner-language" || program.kind === "teacher-development") && !completeCapstone(program.integratedCapstone)) {
      fail(`${program.id} cannot be curriculumComplete before its integrated capstone is implemented and calibrated`);
    }
  }
}

for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
  if (!programs.some((program) => program.kind === "learner-language" && program.language === "en" && program.level === level)) {
    fail(`English portfolio is missing ${level}`);
  }
}
if (!process.exitCode) pass("English A1-C2 portfolio entries are complete at the planning layer");

if (!programs.some((program) => program.kind === "coach-language-practice")) fail("portfolio is missing Coach curriculum");
else pass("Coach curriculum is represented in the portfolio");

if (!programs.some((program) => program.kind === "teacher-development")) fail("portfolio is missing teacher-development curriculum");
else pass("Teach curriculum is represented in the portfolio");

const a1 = programs.find((program) => program.id === "english-a1");
if (!a1) {
  fail("portfolio is missing english-a1");
} else {
  if (typeof a1.productionObjects !== "string" || !a1.productionObjects.startsWith("modules-2-8-implemented")) {
    fail("english-a1 productionObjects status must reflect the implemented Modules 2-8 bundle");
  }
  if (typeof a1.integratedCapstone !== "string" || !a1.integratedCapstone.startsWith("runtime-implemented")) {
    fail("english-a1 integratedCapstone status must reflect the implemented runtime contract");
  }
  if (typeof a1.pilotEngineeringReadiness !== "string") {
    fail("english-a1 must declare pilot engineering readiness separately from representative validation");
  }
}

for (const runtimeArtifact of [
  "packages/types/src/capstone.ts",
  "packages/backend/src/a1-production-curriculum.server.ts",
  "packages/backend/src/a1-production-validation.server.ts",
  "packages/backend/src/production-onboarding.server.ts",
  "packages/backend/src/required-learning-capabilities.server.ts",
  "packages/backend/src/a1-capstone.server.ts",
  "apps/learn-web/app/api/learning/capability-completion/route.ts",
  "apps/learn-web/app/api/learning/capstone/route.ts",
  "apps/learn-web/app/learn/a1/capstone/page.tsx",
  "Docs/Curriculum/43-A1-PILOT-ENGINEERING-READINESS-AND-CLOSURE.md",
]) {
  requireExisting(runtimeArtifact, "A1 production runtime");
}

const competencyAuthorityPath = path.join(repoRoot, "Docs/Curriculum/02-ENGLISH-COMPETENCY-MODEL.md");
const a1ProductionPath = path.join(repoRoot, "packages/backend/src/a1-production-curriculum.server.ts");
if (fs.existsSync(competencyAuthorityPath) && fs.existsSync(a1ProductionPath)) {
  const authorityIds = collectCompetencyIds(fs.readFileSync(competencyAuthorityPath, "utf8"));
  const productionIds = collectCompetencyIds(fs.readFileSync(a1ProductionPath, "utf8"));
  const unknownIds = [...productionIds].filter((id) => !authorityIds.has(id)).sort();

  if (!authorityIds.size) {
    fail("A1 competency authority must expose stable EN.A1 competency IDs");
  } else if (!productionIds.size) {
    fail("A1 production curriculum must reference stable EN.A1 competency IDs");
  } else if (unknownIds.length) {
    for (const id of unknownIds) fail(`A1 production curriculum references unknown competency ID: ${id}`);
  } else {
    pass(`A1 production curriculum uses ${productionIds.size} competency IDs defined by the competency authority`);
  }
}

const a1RuntimeSource = fs.readFileSync(path.join(repoRoot, "packages/backend/src/a1-production-curriculum.server.ts"), "utf8");
for (const requiredCalibrationMarker of [
  "function listeningCheckBlock",
  "type: \"single_choice\"",
  "stage: \"COMPREHENSION\"",
  "transcriptVisibility: \"hidden\"",
  "function functionalCapstoneReadingBlock",
  "EN.A1.READ.FUNCTIONAL_INFORMATION",
]) {
  if (!a1RuntimeSource.includes(requiredCalibrationMarker)) {
    fail(`A1 calibration runtime is missing ${requiredCalibrationMarker}`);
  }
}

const README = fs.readFileSync(path.join(repoRoot, "Docs/Curriculum/README.md"), "utf8");
for (const requiredDoc of [
  "29-LANGUAGE-CURRICULUM-CORE-ARCHITECTURE.md",
  "30-CURRICULUM-PORTFOLIO-AUDIT-2026-08-21.md",
  "31-A1-MODULES-2-8-PRODUCTION-BLUEPRINTS.md",
  "32-COACH-LANGUAGE-PRACTICE-CURRICULUM.md",
  "33-CROSS-PRODUCT-CURRICULUM-CONSUMPTION-CONTRACT.md",
  "34-B2-MODULE-AND-UNIT-BLUEPRINTS.md",
  "35-C1-MODULE-AND-UNIT-BLUEPRINTS.md",
  "36-C2-MODULE-AND-UNIT-BLUEPRINTS.md",
  "37-A1-COMPETENCY-EVIDENCE-RETRIEVAL-MAP.md",
  "38-A2-MODULES-2-8-PRODUCTION-LESSON-BLUEPRINTS.md",
  "39-B1-PRODUCTION-LESSON-BLUEPRINTS.md",
  "40-CURRICULUM-PRODUCT-IMPLEMENTATION-ROADMAP.md",
  "42-INTEGRATED-LEVEL-AND-STAGE-CAPSTONE-ASSESSMENT-STANDARD.md",
  "43-A1-PILOT-ENGINEERING-READINESS-AND-CLOSURE.md",
  "Teacher-Development/06-T3-T5-PRODUCTION-LEARNING-BLUEPRINTS.md",
]) {
  if (!README.includes(requiredDoc)) fail(`Curriculum README does not index ${requiredDoc}`);
}

if (!process.exitCode) {
  pass("curriculum source-of-truth index includes current production architecture");
  pass("A1 production and capstone runtime artifacts are present");
  console.log("\nLurexa curriculum portfolio verification passed.");
}

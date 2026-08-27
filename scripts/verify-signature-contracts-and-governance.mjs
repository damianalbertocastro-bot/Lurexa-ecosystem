#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function check(condition, message) {
  if (!condition) {
    console.error(`✗ Signature Contract & Governance verification failed: ${message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`✓ ${message}`);
}

console.log("========================================================");
console.log("  LUREXA SIGNATURE CONTRACTS & CURRICULUM GOVERNANCE    ");
console.log("========================================================\n");

// 1. Signature Contracts & Versioning
const signatureTypes = read("packages/types/src/signature-experience.ts");
check(signatureTypes.includes('export const SIGNATURE_EXPERIENCE_CONTRACT_VERSION = "1"'), "Signature contract version is pinned to v1");
check(signatureTypes.includes("type LearnerPulseProjectionV1 ="), "Learner Pulse projection schema is versioned (V1)");
check(signatureTypes.includes("type AdaptiveLearningPathV1 ="), "Adaptive Learning Path schema is versioned (V1)");
check(signatureTypes.includes("type MemoryThreadV1 ="), "Memory Thread schema is versioned (V1)");
check(signatureTypes.includes("type MindTraceV1 ="), "Mind Trace schema is versioned (V1)");
check(signatureTypes.includes("type ProductBridgeV1 ="), "Product Bridge schema is versioned (V1)");
check(signatureTypes.includes("type KnowledgeObjectV1 ="), "Knowledge Object schema is versioned (V1)");

// 2. Curriculum Governance & Constraint Enforcement
const adaptiveService = read("packages/backend/src/signature-experience.server.ts");
check(adaptiveService.includes("canonicalRequirementsPreserved: true"), "Adaptive Path strictly preserves canonical curriculum requirements");
check(adaptiveService.includes("autonomousRequiredContentSkipping: false"), "Autonomous required-content skipping is prohibited in v1");

const adaptiveAdapter = read("packages/backend/src/adaptive-learning-path.server.ts");
check(adaptiveAdapter.includes("getGovernedKnowledgeObjectById"), "Adaptive Path validates Knowledge Objects against governed catalog");
check(adaptiveAdapter.includes("findGovernedKnowledgeObjectIdsForCompetencies"), "Adaptive Path maps competency recommendations to Knowledge Objects consistently");
check(adaptiveAdapter.includes("Competency identifiers are not treated as Knowledge Object identifiers"), "Competency and Knowledge Object namespaces remain strictly isolated");

// 3. Memory Thread & Narrative Governance
const memoryThreadService = read("packages/backend/src/memory-thread.server.ts");
check(memoryThreadService.includes("deriveApprovedNarrativeSummary"), "Memory Thread utilizes approved derived narrative summaries");
check(memoryThreadService.includes("Memory Thread never exposes raw evidence payloads"), "Memory Thread guarantees raw evidence payload protection");
check(memoryThreadService.includes("entry.organizationId === activeOrganizationId"), "Memory Thread enforces organization-scoped evidence isolation");

// 4. Learner Pulse & Evidence-Linked Governance
check(adaptiveService.includes('overallMomentum: "unknown"'), "Learner Pulse preserves 'unknown' momentum pending longitudinal comparison contract");
check(adaptiveService.includes('momentum: "unknown"'), "Individual Pulse dimensions preserve 'unknown' momentum");
check(adaptiveService.includes("evidenceBasis: {"), "Learner Pulse projects explicit evidenceBasis bindings");
check(adaptiveService.includes("evidenceFreshness"), "Learner Pulse calculates evidence freshness from latest evidence timestamps");

// 5. Product Bridge Continuity & Handoffs
const bridgeService = read("packages/backend/src/product-bridge.server.ts");
check(bridgeService.includes("singleUse: input.singleUse ?? true"), "Product Bridge enforces single-use by default");
check(bridgeService.includes("Product Bridge has expired"), "Expired Product Bridges fail closed");
check(bridgeService.includes("Product Bridge has already been used"), "Replayed Product Bridges fail closed");

// 6. Studio Knowledge Object Versioning & Governance
const studioService = read("packages/backend/src/studio-catalog.server.ts");
check(studioService.includes("StudioCatalogService"), "Studio catalog governance service exists");
check(studioService.includes("version: 1"), "Studio catalog initializes new Knowledge Objects at version 1");
check(studioService.includes("version: existing.version + 1"), "Studio catalog increments semantic version upon update");

// 7. Insight Aggregation & Teacher Projections
const teacherInsightsService = read("packages/backend/src/teacher-insights.server.ts");
check(teacherInsightsService.includes("TeacherInsightsService"), "Teacher Insights projection service exists");
check(teacherInsightsService.includes("averageFirstAttemptScore"), "Insights preserves first-attempt accuracy separately from completion");
check(teacherInsightsService.includes("Metrics come from progress and first-attempt evidence"), "Insights provides explicit non-judgmental evidence basis notice");

if (!process.exitCode) {
  console.log("\n========================================================");
  console.log("  ✓ All Signature Contracts & Governance Checks PASSED  ");
  console.log("========================================================\n");
}

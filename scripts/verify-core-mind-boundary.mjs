import { readFile } from "node:fs/promises";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireText(path, content, expected) {
  if (!content.includes(expected)) {
    throw new Error(`${path} is missing required Core/Mind boundary marker: ${expected}`);
  }
}

function forbidText(path, content, forbidden) {
  if (content.includes(forbidden)) {
    throw new Error(`${path} violates the Core/Mind boundary: ${forbidden}`);
  }
}

const paths = {
  mind: "packages/backend/src/mind/learning-intelligence.server.ts",
  core: "packages/backend/src/core/learner-intelligence.server.ts",
  legacyMind: "packages/backend/src/mind-learning-intelligence.server.ts",
  legacyPipeline: "packages/backend/src/learner-intelligence-pipeline.server.ts",
  learnerModel: "packages/backend/src/learner-model.service.ts",
  firestore: "packages/backend/src/learner-firestore.server.ts",
  coursePlatform: "packages/backend/src/course-platform.server.ts",
  learnProgress: "packages/backend/src/learn-progress.server.ts",
  dashboard: "apps/learn-web/app/dashboard/page.tsx",
};

const entries = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await source(path)])),
);

requireText(paths.mind, entries.mind, "storage-agnostic");
requireText(paths.mind, entries.mind, "interpretAuthorizedEvidence");
forbidText(paths.mind, entries.mind, "firebase-admin");
forbidText(paths.mind, entries.mind, "getServerFirestore");
forbidText(paths.mind, entries.mind, "FirestoreLearningEvidenceRepository");
forbidText(paths.mind, entries.mind, ".collection(");

requireText(paths.core, entries.core, "Core-owned orchestration");
requireText(paths.core, entries.core, "FirestoreLearningEvidenceRepository");
requireText(paths.core, entries.core, "ConservativeLearningIntelligenceService");
requireText(paths.core, entries.core, "approveAndPersist");
requireText(paths.core, entries.core, 'policyId: "core-derived-observation-v1"');

requireText(paths.legacyMind, entries.legacyMind, 'from "./mind/learning-intelligence.server"');
requireText(paths.legacyPipeline, entries.legacyPipeline, 'from "./core/learner-intelligence.server"');

requireText(paths.learnerModel, entries.learnerModel, "Direct learner insight persistence is disabled");
requireText(paths.learnerModel, entries.learnerModel, "approveDerivedObservation");
requireText(paths.firestore, entries.firestore, "assertApprovableDerivedObservation");
requireText(paths.firestore, entries.firestore, "authorizedEvidenceIds");

requireText(paths.coursePlatform, entries.coursePlatform, "appendPlatformEvidence");
requireText(paths.coursePlatform, entries.coursePlatform, "refreshLearnerIntelligence");
requireText(paths.coursePlatform, entries.coursePlatform, 'source: { product: "learn"');
requireText(paths.learnProgress, entries.learnProgress, "getScopedLearnerContext");
requireText(paths.learnProgress, entries.learnProgress, "nextStep");
requireText(paths.dashboard, entries.dashboard, "Recommended next step");

console.log("Core/Mind boundary verification passed: evidence -> Core -> Mind -> Core approval -> Learn projection is enforced.");

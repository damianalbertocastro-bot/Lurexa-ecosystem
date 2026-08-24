import { readFile } from "node:fs/promises";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireText(path, content, expected) {
  if (!content.includes(expected)) throw new Error(`${path} is missing required Core/Mind marker: ${expected}`);
}

function forbidText(path, content, forbidden) {
  if (content.includes(forbidden)) throw new Error(`${path} violates the Core/Mind boundary: ${forbidden}`);
}

const paths = {
  mind: "packages/backend/src/mind/learning-intelligence.server.ts",
  core: "packages/backend/src/core/learner-intelligence.server.ts",
  pipeline: "packages/backend/src/learner-intelligence-pipeline.server.ts",
  modelService: "packages/backend/src/learner-model.service.ts",
  evidenceRepository: "packages/backend/src/learner-firestore.server.ts",
  teacherCore: "packages/backend/src/core/teacher-return-loop.server.ts",
  teacherFacade: "packages/backend/src/teacher-return-loop.service.ts",
  coursePlatform: "packages/backend/src/course-platform.server.ts",
  learnProgress: "packages/backend/src/learn-progress.server.ts",
  dashboard: "apps/learn-web/app/dashboard/page.tsx",
};

const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await source(path)])),
);

requireText(paths.mind, content.mind, "Storage-free Lurexa Mind facade");
requireText(paths.mind, content.mind, "MindLearningIntelligenceService");
forbidText(paths.mind, content.mind, "firebase-admin");
forbidText(paths.mind, content.mind, "getServerFirestore");
forbidText(paths.mind, content.mind, ".collection(");
forbidText(paths.mind, content.mind, "approveAndPersist");

requireText(paths.core, content.core, "Core-owned orchestration");
requireText(paths.core, content.core, "FirestoreLearningEvidenceRepository");
requireText(paths.core, content.core, "MindLearningIntelligenceService");
requireText(paths.core, content.core, "approveAndPersist");
requireText(paths.core, content.core, 'policyId: "core-derived-observation-v1"');
requireText(paths.pipeline, content.pipeline, 'from "./core/learner-intelligence.server"');

requireText(paths.modelService, content.modelService, "Direct learner insight persistence is disabled");
requireText(paths.modelService, content.modelService, "approveDerivedObservation");
requireText(paths.evidenceRepository, content.evidenceRepository, "assertApprovableDerivedObservation");
requireText(paths.evidenceRepository, content.evidenceRepository, "authorizedEvidenceIds");

requireText(paths.teacherCore, content.teacherCore, "Authenticated teacher does not match the guidance author");
requireText(paths.teacherCore, content.teacherCore, "FirestoreLearningEvidenceRepository");
requireText(paths.teacherCore, content.teacherCore, "refreshLearnerIntelligence");
forbidText(paths.teacherCore, content.teacherCore, 'collection("learner_models")');
forbidText(paths.teacherCore, content.teacherCore, 'collection("learning_evidence")');
requireText(paths.teacherFacade, content.teacherFacade, "Unauthenticated teacher guidance is disabled");
forbidText(paths.teacherFacade, content.teacherFacade, "getServerFirestore");

requireText(paths.coursePlatform, content.coursePlatform, "appendPlatformEvidence");
requireText(paths.coursePlatform, content.coursePlatform, "refreshLearnerIntelligence");
requireText(paths.learnProgress, content.learnProgress, "getScopedLearnerContext");
requireText(paths.learnProgress, content.learnProgress, "nextStep");
requireText(paths.dashboard, content.dashboard, "Recommended next step");

console.log("Core/Mind boundary verification passed: trusted evidence -> storage-free Mind -> Core approval -> product projection.");

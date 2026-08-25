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
  learnerContext: "packages/backend/src/learner-context.server.ts",
  educatorAccess: "packages/backend/src/educator-access.server.ts",
  coachContext: "packages/backend/src/coach-session-context.server.ts",
  teacherCore: "packages/backend/src/core/teacher-return-loop.server.ts",
  teacherFacade: "packages/backend/src/teacher-return-loop.service.ts",
  courseService: "packages/backend/src/course.service.ts",
  courseBuilder: "packages/backend/src/course-builder.service.ts",
  backendBarrel: "packages/backend/src/index.ts",
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
requireText(paths.evidenceRepository, content.evidenceRepository, "Direct learner insight repository writes are disabled");

requireText(paths.learnerContext, content.learnerContext, "allowedPurposesByProduct");
requireText(paths.learnerContext, content.learnerContext, "assertProductPurpose(request)");
requireText(paths.learnerContext, content.learnerContext, "scoped.scope.purposes.includes(request.purpose)");
requireText(paths.learnerContext, content.learnerContext, "scoped.scope.products.includes(request.requestingProduct)");
requireText(paths.learnerContext, content.learnerContext, "actorId === request.learnerId");
requireText(paths.learnerContext, content.learnerContext, 'request.purpose !== "teacher_instructional_support"');
requireText(paths.learnerContext, content.learnerContext, 'request.requestingProduct !== "learn"');
requireText(paths.learnerContext, content.learnerContext, 'learn: ["learn_adaptive_practice", "teacher_instructional_support"]');
requireText(paths.learnerContext, content.learnerContext, "teach: []");
requireText(paths.learnerContext, content.learnerContext, '!["owner", "admin", "teacher"].includes(actorMembership.role)');
requireText(paths.learnerContext, content.learnerContext, "!request.organizationId || !request.courseId");
requireText(paths.learnerContext, content.learnerContext, "getEducatorCourseAccessDecision");
requireText(paths.learnerContext, content.learnerContext, "qualification-linked authorization for this exact course");
requireText(paths.learnerContext, content.learnerContext, 'learnerMembership?.role !== "student"');
requireText(paths.learnerContext, content.learnerContext, "Delegated learner context is not authorized for this product and purpose.");
requireText(paths.learnerContext, content.learnerContext, "Context is purpose-scoped and excludes raw learner responses.");
requireText(paths.learnerContext, content.learnerContext, "broader organization-level derived insights are withheld");

requireText(paths.educatorAccess, content.educatorAccess, 'collection("user-entitlements")');
requireText(paths.educatorAccess, content.educatorAccess, 'collection("educator-qualifications")');
requireText(paths.educatorAccess, content.educatorAccess, 'collection("teaching-authorizations")');
requireText(paths.educatorAccess, content.educatorAccess, "qualificationSupportsAuthorization");
requireText(paths.educatorAccess, content.educatorAccess, "getEducatorCourseAccessDecision");
requireText(paths.educatorAccess, content.educatorAccess, "authorization.courseIds.includes(course.id)");
forbidText(paths.educatorAccess, content.educatorAccess, "governanceRole");
requireText(paths.educatorAccess, content.educatorAccess, 'teach: verifiedEducator || explicitTeach');
requireText(paths.educatorAccess, content.educatorAccess, 'coachFull: verifiedEducator || explicitCoach');
requireText(paths.educatorAccess, content.educatorAccess, 'reason: "extend_level_scope"');

requireText(paths.coachContext, content.coachContext, "getScopedLearnerContext");
requireText(paths.coachContext, content.coachContext, 'requestingProduct: "coach"');
requireText(paths.coachContext, content.coachContext, 'purpose: "coach_session_adaptation"');
forbidText(paths.coachContext, content.coachContext, "getServerFirestore");
forbidText(paths.coachContext, content.coachContext, "FirestoreLearningEvidenceRepository");
forbidText(paths.coachContext, content.coachContext, ".collection(");

requireText(paths.teacherCore, content.teacherCore, "Authenticated teacher does not match the guidance author");
requireText(paths.teacherCore, content.teacherCore, "FirestoreLearningEvidenceRepository");
requireText(paths.teacherCore, content.teacherCore, "refreshLearnerIntelligence");
forbidText(paths.teacherCore, content.teacherCore, 'collection("learner_models")');
forbidText(paths.teacherCore, content.teacherCore, 'collection("learning_evidence")');
requireText(paths.teacherFacade, content.teacherFacade, "Unauthenticated teacher guidance is disabled");
forbidText(paths.teacherFacade, content.teacherFacade, "getServerFirestore");

requireText(paths.courseService, content.courseService, "Direct browser course writes are disabled");
forbidText(paths.courseService, content.courseService, "setDoc");
requireText(paths.courseBuilder, content.courseBuilder, "Direct browser curriculum writes are disabled");
forbidText(paths.courseBuilder, content.courseBuilder, "firebase/firestore");
forbidText(paths.courseBuilder, content.courseBuilder, "setDoc");
forbidText(paths.courseBuilder, content.courseBuilder, "updateDoc");

forbidText(paths.backendBarrel, content.backendBarrel, 'export * from "./mind.service"');
forbidText(paths.backendBarrel, content.backendBarrel, 'export * from "./teacher-return-loop.service"');
forbidText(paths.backendBarrel, content.backendBarrel, 'export * from "./capstone-evaluator.service"');
forbidText(paths.backendBarrel, content.backendBarrel, 'export * from "./coach-session-context.server"');
requireText(paths.backendBarrel, content.backendBarrel, "Server-only capabilities intentionally do not belong");

requireText(paths.coursePlatform, content.coursePlatform, "appendPlatformEvidence");
requireText(paths.coursePlatform, content.coursePlatform, "refreshLearnerIntelligence");
requireText(paths.learnProgress, content.learnProgress, "getScopedLearnerContext");
requireText(paths.learnProgress, content.learnProgress, "nextStep");
requireText(paths.dashboard, content.dashboard, "Recommended next step");

console.log("Core/Mind boundary verification passed: Learn evidence -> Core -> storage-free Mind -> Core approval -> purpose-scoped learner and entitlement + qualification + exact-course authorization-backed Learn-teacher projections; Lurexa Teach has no student-context entitlement; governance role cannot substitute for teaching qualification; legacy browser mutations fail closed.");

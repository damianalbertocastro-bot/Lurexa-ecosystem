import { readFile } from "node:fs/promises";

const checks = [];

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireText(path, content, expected) {
  if (!content.includes(expected)) {
    throw new Error(`${path} is missing required architecture marker: ${expected}`);
  }
  checks.push(`${path}: ${expected}`);
}

function forbidText(path, content, forbidden) {
  if (content.includes(forbidden)) {
    throw new Error(`${path} contains forbidden legacy architecture text: ${forbidden}`);
  }
  checks.push(`${path}: excludes ${forbidden}`);
}

const [
  typeIndex,
  learnerTypes,
  learningExperienceTypes,
  coursePlatform,
  learnerContext,
  mindIntelligence,
  capabilityBoundary,
  tutorRoute,
  spokenEvidenceRoute,
  coachPlatform,
  learnDashboard,
  firestoreRules,
  coachPage,
  coachRoute,
] = await Promise.all([
  source("packages/types/src/index.ts"),
  source("packages/types/src/learner.ts"),
  source("packages/types/src/learning-experience.ts"),
  source("packages/backend/src/course-platform.server.ts"),
  source("packages/backend/src/learner-context.server.ts"),
  source("packages/backend/src/mind-learning-intelligence.server.ts"),
  source("packages/backend/src/learning-capability.server.ts"),
  source("apps/learn-web/app/api/learning/tutor/route.ts"),
  source("apps/learn-web/app/api/learning/spoken-evidence/route.ts"),
  source("packages/backend/src/coach-platform.server.ts"),
  source("apps/learn-web/app/dashboard/page.tsx"),
  source("firestore.rules"),
  source("apps/learn-web/app/coach/page.tsx"),
  source("apps/learn-web/app/api/coach/route.ts"),
]);

requireText("packages/types/src/index.ts", typeIndex, 'export * from "./learner"');
requireText("packages/types/src/index.ts", typeIndex, 'export * from "./coach"');
requireText("packages/types/src/learner.ts", learnerTypes, "export interface LearningEvidence");
requireText("packages/types/src/learner.ts", learnerTypes, "export interface LearnerContext");
requireText("packages/types/src/learner.ts", learnerTypes, "export interface LearnerInsight");
requireText("packages/types/src/learner.ts", learnerTypes, "export interface LearnerRecommendationAction");
requireText("packages/types/src/learning-experience.ts", learningExperienceTypes, "The server resolves the authoritative AI-roleplay capability");
forbidText("packages/types/src/learning-experience.ts", learningExperienceTypes, "capability: AIRoleplayCapability;");
requireText("packages/backend/src/course-platform.server.ts", coursePlatform, 'type: "curriculum_progress"');
requireText("packages/backend/src/course-platform.server.ts", coursePlatform, 'type: "assessment_result"');
requireText("packages/backend/src/course-platform.server.ts", coursePlatform, 'type: "activity_result"');
requireText("packages/backend/src/learner-context.server.ts", learnerContext, '"coach_session_adaptation"');
requireText("packages/backend/src/learner-context.server.ts", learnerContext, "context.recommendations");
requireText("packages/backend/src/learner-context.server.ts", learnerContext, "activeOrganizationId");
requireText("packages/backend/src/mind-learning-intelligence.server.ts", mindIntelligence, 'const interpretationVersion = "learn-next-step-v1"');
requireText("packages/backend/src/mind-learning-intelligence.server.ts", mindIntelligence, 'outcome: "continue"');
requireText("packages/backend/src/learning-capability.server.ts", capabilityBoundary, "resolveLearningCapability");
requireText("packages/backend/src/learning-capability.server.ts", capabilityBoundary, "persisted lesson object");
forbidText("apps/learn-web/app/api/learning/tutor/route.ts", tutorRoute, "payload.capability");
forbidText("apps/learn-web/app/api/learning/spoken-evidence/route.ts", spokenEvidenceRoute, "capabilityValue");
requireText("packages/backend/src/coach-platform.server.ts", coachPlatform, "recommendedActions");
requireText("apps/learn-web/app/dashboard/page.tsx", learnDashboard, "Recommended next step");
requireText("firestore.rules", firestoreRules, "match /learning-evidence/{evidenceId}");
requireText("firestore.rules", firestoreRules, "match /learner-insights/{insightId}");
requireText("firestore.rules", firestoreRules, "match /coach-sessions/{sessionId}");
requireText("firestore.rules", firestoreRules, "allow write: if false;");
requireText("apps/learn-web/app/api/coach/route.ts", coachRoute, "CoachPlatformService.startSession(actor)");
requireText("apps/learn-web/app/coach/page.tsx", coachPage, 'authenticatedFetch("/api/coach"');

forbidText("apps/learn-web/app/coach/page.tsx", coachPage, "student_demo");
forbidText("apps/learn-web/app/coach/page.tsx", coachPage, "Accent Reduction");
forbidText("apps/learn-web/app/coach/page.tsx", coachPage, "aiPronunciationScore");
forbidText("apps/learn-web/app/coach/page.tsx", coachPage, "Voice API Connected");

console.log(`Learner Model architecture verification passed (${checks.length} checks).`);

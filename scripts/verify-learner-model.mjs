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
  coursePlatform,
  learnerContext,
  firestoreRules,
  coachPage,
  coachRoute,
] = await Promise.all([
  source("packages/types/src/index.ts"),
  source("packages/types/src/learner.ts"),
  source("packages/backend/src/course-platform.server.ts"),
  source("packages/backend/src/learner-context.server.ts"),
  source("firestore.rules"),
  source("apps/learn-web/app/coach/page.tsx"),
  source("apps/learn-web/app/api/coach/route.ts"),
]);

requireText("packages/types/src/index.ts", typeIndex, 'export * from "./learner"');
requireText("packages/types/src/index.ts", typeIndex, 'export * from "./coach"');
requireText("packages/types/src/learner.ts", learnerTypes, "export interface LearningEvidence");
requireText("packages/types/src/learner.ts", learnerTypes, "export interface LearnerContext");
requireText("packages/types/src/learner.ts", learnerTypes, "export interface LearnerInsight");
requireText("packages/backend/src/course-platform.server.ts", coursePlatform, 'type: "curriculum_progress"');
requireText("packages/backend/src/course-platform.server.ts", coursePlatform, 'type: "assessment_result"');
requireText("packages/backend/src/course-platform.server.ts", coursePlatform, 'type: "activity_result"');
requireText("packages/backend/src/learner-context.server.ts", learnerContext, '"coach_session_adaptation"');
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

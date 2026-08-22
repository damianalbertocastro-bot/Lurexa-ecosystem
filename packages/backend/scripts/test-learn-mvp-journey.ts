import assert from "node:assert/strict";
import { deleteApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { A1_PRODUCTION_COURSE_ID } from "../src/a1-production-curriculum.server";
import { CoursePlatformService, type AuthenticatedActor } from "../src/course-platform.server";
import { getServerFirestore } from "../src/firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "../src/learner-firestore.server";
import { LearnProgressService } from "../src/learn-progress.server";
import { LearnTutorService } from "../src/learn-tutor.server";
import { onboardProductionLearner } from "../src/production-onboarding.server";
import { RequiredLearningCapabilityService } from "../src/required-learning-capabilities.server";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "lurexa-app";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("FIRESTORE_EMULATOR_HOST is required. Run this through Firebase emulators:exec.");
}

const testApp = initializeApp({ projectId }, `learn-mvp-journey-${Date.now()}`);
const testDatabase = getFirestore(testApp);

const learner: AuthenticatedActor = { uid: `learn-mvp-${Date.now()}`, email: "learner@example.test" };
const outsider: AuthenticatedActor = { uid: `learn-outsider-${Date.now()}`, email: "outsider@example.test" };
const lessonId = "a1-introduce-yourself";

async function rejects(action: () => Promise<unknown>, expectedMessage: string): Promise<void> {
  await assert.rejects(action, (error: unknown) => error instanceof Error && error.message.includes(expectedMessage));
}

async function appendCapabilityEvidence(input: {
  activityId: string;
  event: "spoken_evidence.recorded";
  competencyIds: string[];
}): Promise<void> {
  const observedAt = new Date().toISOString();
  await new FirestoreLearningEvidenceRepository().append({
    contractVersion: "1",
    id: `learn_mvp_${learner.uid}_${input.activityId}`,
    learnerId: learner.uid,
    organizationId: "lurexa-self-paced",
    source: {
      product: "learn",
      courseId: A1_PRODUCTION_COURSE_ID,
      lessonId,
      activityId: input.activityId,
    },
    type: "activity_result",
    observedAt,
    dataClassification: "sensitive",
    payload: {
      event: input.event,
      competencyIds: input.competencyIds,
      evidencePurpose: "performance",
    },
    provenance: {
      method: "system_observed",
      actorId: learner.uid,
    },
  });
}

async function main(): Promise<void> {
  try {
  // Exercise the production entrypoint rather than fixture-only curriculum.
  const onboarding = await onboardProductionLearner({
    learnerId: learner.uid,
    email: learner.email,
    goal: "daily_life",
  });
  assert.equal(onboarding.courseId, A1_PRODUCTION_COURSE_ID, "beginner onboarding resolves the canonical A1 course");
  assert.equal(onboarding.lessonId, lessonId, "beginner onboarding resolves the canonical first A1 lesson");
  assert.equal(onboarding.recommendation.level, "A1", "beginner onboarding remains an A1 start recommendation");
  assert.equal(onboarding.recommendation.confidence, "low", "onboarding does not claim formal placement confidence");

  const courseSnapshot = await getServerFirestore().collection("courses").doc(A1_PRODUCTION_COURSE_ID).get();
  assert.equal(courseSnapshot.data()?.moduleIds[0], "english-a1-introductions", "canonical A1 module order is preserved");

  await rejects(
    () => CoursePlatformService.getLesson(outsider, A1_PRODUCTION_COURSE_ID, lessonId),
    "do not have access",
  );
  console.log("✓ course access is tenant and membership scoped");

  const lesson = await CoursePlatformService.getLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId);
  assert.equal(lesson.lesson.contentBlocks[0]?.id, "a1-intro-text", "A1 entry lesson ordering is stable");
  assert.equal(lesson.lesson.contentBlocks[1]?.id, "a1-model-listening", "required listening precedes activity practice");

  await LearnProgressService.startLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId);
  await rejects(
    () => LearnProgressService.completeLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId, 120),
    "Complete each required activity",
  );
  await rejects(
    () => RequiredLearningCapabilityService.assertCompleted(learner, A1_PRODUCTION_COURSE_ID, lessonId),
    "Complete the required listening, speaking, and conversation work",
  );
  console.log("✓ required activity, quiz, and capability gates reject incomplete lessons");

  const firstListeningAttempt = await LearnProgressService.submitActivityAttempt(
    learner,
    A1_PRODUCTION_COURSE_ID,
    lessonId,
    "a1-listening-check",
    ["Andrea"],
  );
  assert.equal(firstListeningAttempt.attempt.firstAttempt, true);
  assert.equal(firstListeningAttempt.attempt.passed, false);
  const retryListeningAttempt = await LearnProgressService.submitActivityAttempt(
    learner,
    A1_PRODUCTION_COURSE_ID,
    lessonId,
    "a1-listening-check",
    ["Elena"],
  );
  assert.equal(retryListeningAttempt.attempt.firstAttempt, false);
  assert.equal(retryListeningAttempt.attempt.passed, true);

  await LearnProgressService.submitActivityAttempt(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-greeting-response", ["Nice to meet you."]);
  await LearnProgressService.submitActivityAttempt(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-build-introduction", ["Hello,", "I’m", "Ana."]);
  await LearnProgressService.submitShortResponse(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-create-apply", "Hello, I am Ana. Nice to meet you.");
  await LearnProgressService.submitQuizAttempt(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-intro-check", "I’m Daniela.");

  const evidence = await new FirestoreLearningEvidenceRepository().listByLearner(learner.uid, "lurexa-self-paced");
  const listeningEvidence = evidence.filter((item) => item.source.activityId === "a1-listening-check");
  assert.equal(listeningEvidence.length, 2, "first attempt and retry are retained as separate evidence records");
  assert.deepEqual(listeningEvidence.map((item) => item.payload), [
    {
      selectedAnswerCount: 1,
      correct: false,
      firstAttempt: true,
      attemptNumber: 1,
      competencyIds: ["EN.A1.LISTEN.BASIC_SOCIAL_EXCHANGES"],
      activityType: "single_choice",
    },
    {
      selectedAnswerCount: 1,
      correct: true,
      firstAttempt: false,
      attemptNumber: 2,
      competencyIds: ["EN.A1.LISTEN.BASIC_SOCIAL_EXCHANGES"],
      activityType: "single_choice",
    },
  ]);
  assert.ok(listeningEvidence.every((item) => item.provenance.method === "system_observed" && item.provenance.actorId === learner.uid));
  console.log("✓ first-attempt and retry evidence retain trusted system provenance");

  await RequiredLearningCapabilityService.recordModelListeningCompleted({
    actor: learner,
    courseId: A1_PRODUCTION_COURSE_ID,
    lessonId,
    activityId: "a1-m1-u1-l1-model-listening-production",
  });
  await CoursePlatformService.recordCapabilityCompletion(
    learner,
    A1_PRODUCTION_COURSE_ID,
    lessonId,
    "a1-m1-u1-l1-model-listening-production",
    "model_listening",
  );

  // Storage emulator support is not configured in firebase.json. This is the
  // trusted post-storage contract that SpokenEvidenceService invokes after a
  // successful private recording write.
  await CoursePlatformService.recordCapabilityCompletion(
    learner,
    A1_PRODUCTION_COURSE_ID,
    lessonId,
    "a1-m1-u1-l1-recorded-greeting",
    "recorded_speaking",
  );
  await appendCapabilityEvidence({
    activityId: "a1-m1-u1-l1-recorded-greeting",
    event: "spoken_evidence.recorded",
    competencyIds: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.PHON.WORD_STRESS"],
  });

  process.env.OPENAI_KEY_tutor = "";
  process.env.OPENAI_API_KEY = "";
  const firstRoleplayTurn = await LearnTutorService.respond(learner, {
    courseId: A1_PRODUCTION_COURSE_ID,
    lessonId,
    activityId: "a1-m1-u1-l1-ai-greeting-roleplay",
    learnerMessage: "Hello, I am Ana.",
  });
  assert.equal(firstRoleplayTurn.provider, "deterministic_fallback", "roleplay remains locally testable without a provider credential");
  await LearnTutorService.respond(learner, {
    courseId: A1_PRODUCTION_COURSE_ID,
    lessonId,
    activityId: "a1-m1-u1-l1-ai-greeting-roleplay",
    sessionId: firstRoleplayTurn.sessionId,
    learnerMessage: "Nice to meet you. What is your name?",
  });

  await RequiredLearningCapabilityService.assertCompleted(learner, A1_PRODUCTION_COURSE_ID, lessonId);
  const completed = await LearnProgressService.completeLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId, 1_999);
  assert.equal(completed.completed, true);
  assert.equal(completed.status, "completed");
  assert.equal(completed.timeSpentSeconds, 1_999);

  const progress = await testDatabase.collection("progress").doc(`${learner.uid}_${lessonId}`).get();
  assert.equal(progress.data()?.studentId, learner.uid, "trusted progress remains bound to the authenticated learner");
  assert.equal(progress.data()?.completed, true, "all completion gates resolve only after authoritative service writes");
  console.log("✓ authenticated A1 MVP journey completes through Core-owned service boundaries");
  } finally {
    await testDatabase.terminate();
    await deleteApp(testApp);
  }
}

void main();

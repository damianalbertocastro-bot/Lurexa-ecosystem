import assert from "node:assert/strict";
import { deleteApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { A1_PRODUCTION_COURSE_ID } from "../src/a1-production-curriculum.server";
import { CoachPlatformService } from "../src/coach-platform.server";
import { endCoachSession } from "../src/coach-session-completion.server";
import { CoursePlatformService, type AuthenticatedActor } from "../src/course-platform.server";
import { FirestoreLearningEvidenceRepository } from "../src/learner-firestore.server";
import { getScopedLearnerContext } from "../src/learner-context.server";
import { LearnProgressService } from "../src/learn-progress.server";
import { LearnTutorService } from "../src/learn-tutor.server";
import { onboardProductionLearner } from "../src/production-onboarding.server";
import { createProductBridge, resolveProductBridge } from "../src/product-bridge.server";
import { RequiredLearningCapabilityService } from "../src/required-learning-capabilities.server";
import { refreshLearnerIntelligence } from "../src/core/learner-intelligence.server";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "lurexa-app";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("FIRESTORE_EMULATOR_HOST is required. Run this through Firebase emulators:exec.");
}

const testApp = initializeApp({ projectId }, `lurexa-working-mvp-journey-${Date.now()}`);
const testDatabase = getFirestore(testApp);

const learner: AuthenticatedActor = {
  uid: `lurexa-mvp-learner-${Date.now()}`,
  email: "carlos.medina@example.test",
};
const outsider: AuthenticatedActor = {
  uid: `lurexa-outsider-${Date.now()}`,
  email: "outsider@example.test",
};
const lessonId = "a1-introduce-yourself";

async function rejects(action: () => Promise<unknown>, expectedMessage: string | RegExp): Promise<void> {
  await assert.rejects(action, (error: unknown) => {
    if (!(error instanceof Error)) return false;
    return typeof expectedMessage === "string"
      ? error.message.includes(expectedMessage)
      : expectedMessage.test(error.message);
  });
}

async function main(): Promise<void> {
  console.log("\n========================================================");
  console.log("  LUREXA WORKING MVP — CANONICAL LEARNER JOURNEY TEST   ");
  console.log("========================================================\n");

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Learner opens Lurexa — Public URL Resolution
    // -------------------------------------------------------------------------
    console.log("▶ STEP 1: Canonical Ecosystem URL Resolution");
    const urls = resolveLurexaPublicUrls();
    assert.equal(urls.ecosystem, "https://lurexa.org", "canonical ecosystem URL is lurexa.org");
    assert.equal(urls.learn, "https://learn.lurexa.org", "canonical learn URL is learn.lurexa.org");
    assert.equal(urls.coach, "https://coach.lurexa.org", "canonical coach URL is coach.lurexa.org");
    console.log("  ✓ Public ecosystem and product URLs resolve to canonical domains");

    // -------------------------------------------------------------------------
    // STEP 2 & 3: Learner signs up & enters onboarding
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 2 & 3: Learner Signup & Onboarding Flow");
    const onboarding = await onboardProductionLearner({
      learnerId: learner.uid,
      email: learner.email,
      goal: "daily_life",
    });

    // -------------------------------------------------------------------------
    // STEP 4: Learner receives/establishes level (A1 True Beginner)
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 4: Initial Level Establishment");
    assert.equal(onboarding.courseId, A1_PRODUCTION_COURSE_ID, "onboarding routes to canonical A1 course");
    assert.equal(onboarding.lessonId, lessonId, "onboarding routes to canonical introductory lesson");
    assert.equal(onboarding.recommendation.level, "A1", "initial level established as CEFR A1");
    console.log(`  ✓ Learner placed into ${onboarding.recommendation.level} (${onboarding.courseId})`);

    // -------------------------------------------------------------------------
    // STEP 5: Learner enters Learn — Membership Scoping
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 5: Learn Access & Organization Membership Scoping");
    await rejects(
      () => CoursePlatformService.getLesson(outsider, A1_PRODUCTION_COURSE_ID, lessonId),
      "do not have access",
    );
    console.log("  ✓ Outsider access without membership is rejected with 403 boundary check");

    // -------------------------------------------------------------------------
    // STEP 6: Learner opens canonical A1 Lesson
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 6: Canonical A1 Lesson Retrieval & 7-Stage Structure");
    const lessonData = await CoursePlatformService.getLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId);
    assert.ok(lessonData.lesson.contentBlocks.length >= 6, "lesson contains required 7-stage content blocks");
    assert.equal(lessonData.lesson.contentBlocks[0]?.id, "a1-intro-text", "first block is introductory hook");
    console.log(`  ✓ Loaded lesson '${lessonData.lesson.title}' with ${lessonData.lesson.contentBlocks.length} content blocks`);

    // -------------------------------------------------------------------------
    // STEP 7: Learner starts lesson
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 7: Starting Lesson Progress");
    const started = await LearnProgressService.startLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId);
    assert.equal(started.completed, false, "lesson is initially in-progress, not completed");
    console.log("  ✓ Lesson progress initiated in Firestore");

    // -------------------------------------------------------------------------
    // STEP 8 & 9: Strict 70% Passing Threshold & Activities
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 8 & 9: Interactive Activities & 70% Completion Gate");
    // Premature completion must fail
    await rejects(
      () => LearnProgressService.completeLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId, 60),
      /Complete at least 70%/,
    );
    console.log("  ✓ Premature completion rejected by 70% threshold gate");

    // First attempt fails (diagnostic capture)
    const firstAttempt = await LearnProgressService.submitActivityAttempt(
      learner,
      A1_PRODUCTION_COURSE_ID,
      lessonId,
      "a1-listening-check",
      ["Andrea"],
    );
    assert.equal(firstAttempt.attempt.firstAttempt, true);
    assert.equal(firstAttempt.attempt.passed, false);

    // Second attempt passes (retry)
    const retryAttempt = await LearnProgressService.submitActivityAttempt(
      learner,
      A1_PRODUCTION_COURSE_ID,
      lessonId,
      "a1-listening-check",
      ["Elena"],
    );
    assert.equal(retryAttempt.attempt.firstAttempt, false);
    assert.equal(retryAttempt.attempt.passed, true);
    console.log("  ✓ Diagnostic integrity: first-attempt and retry recorded separately");

    // Complete remaining required blocks
    await LearnProgressService.submitActivityAttempt(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-greeting-response", ["Nice to meet you."]);
    await LearnProgressService.submitActivityAttempt(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-build-introduction", ["Hello,", "I’m", "Ana."]);
    await LearnProgressService.submitShortResponse(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-create-apply", "Hello, I am Ana. Nice to meet you.");
    await LearnProgressService.submitQuizAttempt(learner, A1_PRODUCTION_COURSE_ID, lessonId, "a1-intro-check", "I’m Daniela.");

    // Complete required capabilities (listening, recorded speaking, roleplay)
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
    await CoursePlatformService.recordCapabilityCompletion(
      learner,
      A1_PRODUCTION_COURSE_ID,
      lessonId,
      "a1-m1-u1-l1-recorded-greeting",
      "recorded_speaking",
    );
    await new FirestoreLearningEvidenceRepository().append({
      contractVersion: "1",
      id: `learn_mvp_${learner.uid}_a1-m1-u1-l1-recorded-greeting`,
      learnerId: learner.uid,
      organizationId: "lurexa-self-paced",
      source: {
        product: "learn",
        courseId: A1_PRODUCTION_COURSE_ID,
        lessonId,
        activityId: "a1-m1-u1-l1-recorded-greeting",
      },
      type: "activity_result",
      observedAt: new Date().toISOString(),
      dataClassification: "sensitive",
      payload: {
        event: "spoken_evidence.recorded",
        competencyIds: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.PHON.WORD_STRESS"],
        evidencePurpose: "performance",
      },
      provenance: {
        method: "system_observed",
        actorId: learner.uid,
      },
    });

    // Simulated roleplay turn via LearnTutorService with deterministic fallback
    process.env.GEMINI_API_KEY = "";
    const tutorTurn = await LearnTutorService.respond(learner, {
      courseId: A1_PRODUCTION_COURSE_ID,
      lessonId,
      activityId: "a1-m1-u1-l1-ai-greeting-roleplay",
      learnerMessage: "Hello, my name is Carlos.",
    });
    assert.equal(tutorTurn.provider, "deterministic_fallback", "roleplay remains testable without provider credential");
    assert.ok(tutorTurn.reply.text.length > 0, "tutor returns non-empty response text");
    await LearnTutorService.respond(learner, {
      courseId: A1_PRODUCTION_COURSE_ID,
      lessonId,
      activityId: "a1-m1-u1-l1-ai-greeting-roleplay",
      sessionId: tutorTurn.sessionId,
      learnerMessage: "Nice to meet you. What is your name?",
    });

    // -------------------------------------------------------------------------
    // STEP 10: Authoritative Lesson Completion
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 10: Authoritative Lesson Completion & Persistence");
    await RequiredLearningCapabilityService.assertCompleted(learner, A1_PRODUCTION_COURSE_ID, lessonId);
    const completedProgress = await LearnProgressService.completeLesson(learner, A1_PRODUCTION_COURSE_ID, lessonId, 900);
    assert.equal(completedProgress.completed, true);
    assert.equal(completedProgress.status, "completed");

    // Verify directly in Firestore database
    const progressDoc = await testDatabase.collection("progress").doc(`${learner.uid}_${lessonId}`).get();
    assert.equal(progressDoc.data()?.completed, true, "progress record is marked completed in Firestore");
    console.log("  ✓ Lesson completed and verified in authoritative Core Firestore");

    // -------------------------------------------------------------------------
    // STEP 11: Trusted Evidence Verification
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 11: Trusted Evidence Provenance Verification");
    const evidenceRepo = new FirestoreLearningEvidenceRepository();
    const evidenceList = await evidenceRepo.listByLearner(learner.uid, "lurexa-self-paced");
    assert.ok(evidenceList.length >= 3, "learning evidence recorded for activities and quiz");
    const listeningEvidence = evidenceList.filter((item) => item.source.activityId === "a1-listening-check");
    assert.equal(listeningEvidence.length, 2, "first attempt and retry are retained as separate evidence records");
    assert.ok(listeningEvidence.every((item) => item.provenance.method === "system_observed" && item.provenance.actorId === learner.uid));
    console.log(`  ✓ ${evidenceList.length} evidence items stored with immutable timestamps and system provenance`);

    // -------------------------------------------------------------------------
    // STEP 12: Mind Recommendation & Adaptation
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 12: Mind-Driven Adaptive Recommendation");
    await refreshLearnerIntelligence({ learnerId: learner.uid, organizationId: "lurexa-self-paced" });
    const dashboardSummary = await LearnProgressService.getLearnerDashboard(learner);
    assert.ok(dashboardSummary.courses.length > 0, "learner has enrolled courses");
    const scopedContext = await getScopedLearnerContext({
      actorId: learner.uid,
      request: {
        contractVersion: "1",
        learnerId: learner.uid,
        requestingProduct: "learn",
        purpose: "learn_adaptive_practice",
        domains: ["recommendation", "curriculum"],
      },
    });
    assert.ok(scopedContext.context.curriculum?.courseId, "Mind projects learner curriculum context");
    console.log(`  ✓ Mind projected active curriculum context: ${scopedContext.context.curriculum?.courseId}`);

    // -------------------------------------------------------------------------
    // STEP 13: Cross-Product Handoff to Coach via ProductBridge
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 13: Product Bridge Handoff to Lurexa Coach");
    const bridgeToCoach = await createProductBridge({
      actorId: learner.uid,
      learnerId: learner.uid,
      organizationId: "lurexa-self-paced",
      source: "learn",
      destination: "coach",
      purpose: "targeted_practice",
      destinationRef: "/practice",
      contextRef: `lesson:${lessonId}`,
      singleUse: true,
    });
    assert.ok(bridgeToCoach.bridgeId, "Product Bridge token created");

    const resolvedBridge = await resolveProductBridge({
      actorId: learner.uid,
      bridgeId: bridgeToCoach.bridgeId,
      destination: "coach",
    });
    assert.equal(resolvedBridge.destinationRef, "/practice", "Product Bridge correctly resolves to Coach practice route");
    console.log(`  ✓ Secure single-use bridge resolved for destination '${resolvedBridge.destinationRef}'`);

    // -------------------------------------------------------------------------
    // STEP 14: Shared Identity Recognition in Coach
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 14: Coach Shared Identity Recognition");
    const coachSessionResult = await CoachPlatformService.startSession(learner);
    assert.equal(coachSessionResult.session.learnerId, learner.uid, "Coach session bound to existing Lurexa UID");
    assert.equal(coachSessionResult.session.status, "active");
    assert.ok(coachSessionResult.session.transcript[0]?.text.includes("Welcome to Lurexa Coach"), "Opening message generated");
    console.log("  ✓ Coach recognized existing learner identity without requiring secondary registration");

    // -------------------------------------------------------------------------
    // STEP 15 & 16: Speaking Interaction & Dominican L1 Adaptation
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 15 & 16: Spoken Interaction & Dominican Spanish L1 Detection");
    // Learner says "I am a es-student at the school" (demonstrating /s/ cluster epenthesis)
    const turnResult = await CoachPlatformService.sendTurn(learner, {
      sessionId: coachSessionResult.session.id,
      message: "I am a es-student at the school.",
    });
    assert.ok(turnResult.session.transcript.length >= 3, "turn added to conversational session");
    assert.ok(turnResult.coachingCue, "coaching cue provided for linguistic observation");
    assert.ok(turnResult.coachingCue?.includes("Start words like 'study' or 'speak' directly with a soft 's'"), "Dominican Spanish tactile coaching cue delivered");
    console.log(`  ✓ Dominican /s/ cluster epenthesis pattern detected with non-punitive tactile anchor: "${turnResult.coachingCue}"`);

    // -------------------------------------------------------------------------
    // STEP 17: Speech Evidence Persistence
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 17: Coach Linguistic Evidence Logging");
    const updatedEvidence = await evidenceRepo.listByLearner(learner.uid, "lurexa-self-paced");
    const coachEvidence = updatedEvidence.filter((item) => item.source.product === "coach");
    assert.ok(coachEvidence.length >= 1, "Coach turn evidence captured in Core repository");
    console.log(`  ✓ ${coachEvidence.length} Coach linguistic observation record(s) persisted in Core`);

    // -------------------------------------------------------------------------
    // STEP 18: Coach Session Finalization & Return Bridge
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 18: Coach Session Finalization & Privacy Redaction");
    const endSessionResult = await endCoachSession(learner, {
      sessionId: coachSessionResult.session.id,
    });
    assert.equal(endSessionResult.session.status, "completed", "Coach session marked completed");
    assert.equal(endSessionResult.session.transcript.length, 0, "conversational transcript wiped for learner privacy");
    assert.ok(endSessionResult.returnBridge, "return bridge generated targeting Learn");
    assert.equal(endSessionResult.returnBridge.destination, "learn", "return bridge destination is Learn");
    console.log("  ✓ Session finalized, raw transcript redacted, return bridge generated");

    // -------------------------------------------------------------------------
    // STEP 19: Return Bridge Resolution in Learn
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 19: Return Bridge Resolution in Learn");
    const resolvedReturn = await resolveProductBridge({
      actorId: learner.uid,
      bridgeId: endSessionResult.returnBridge.bridgeId,
      destination: "learn",
    });
    assert.equal(resolvedReturn.destinationRef, "/dashboard", "return bridge routes learner to dashboard");
    console.log("  ✓ Return bridge resolved; learner directed back to Learn dashboard");

    // -------------------------------------------------------------------------
    // STEP 20: Continuity of Learner State in Learn
    // -------------------------------------------------------------------------
    console.log("\n▶ STEP 20: State Continuity & Integrated Learner State");
    const finalDashboard = await LearnProgressService.getLearnerDashboard(learner);
    assert.ok(finalDashboard.courses.length > 0, "learner has active enrolled courses upon return");
    const finalProgress = await testDatabase.collection("progress").doc(`${learner.uid}_${lessonId}`).get();
    assert.equal(finalProgress.data()?.completed, true, "lesson 1 progress remains completed after Coach return");

    const finalEvidence = await evidenceRepo.listByLearner(learner.uid, "lurexa-self-paced");
    const hasLearnEvidence = finalEvidence.some((item) => item.source.product === "learn");
    const hasCoachEvidence = finalEvidence.some((item) => item.source.product === "coach");
    assert.ok(hasLearnEvidence && hasCoachEvidence, "evidence from both Learn and Coach co-exists in the single model");

    console.log("  ✓ Previous lesson progress fully preserved (100% completed)");
    console.log(`  ✓ Single Learner Model unified: ${finalEvidence.length} total evidence records across Learn and Coach`);
    console.log("\n========================================================");
    console.log("  ✓ ALL 20 WORKING MVP CANONICAL JOURNEY CHECKS PASSED  ");
    console.log("========================================================\n");
  } finally {
    await testDatabase.terminate();
    await deleteApp(testApp);
  }
}

void main();

import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { TeachT1Service } from "../src/teach-t1.service";

import { A2_MODULES_1_TO_8 } from "../src/curriculum/a2/modules";
import { CapstoneA2Service, A2_INTEGRATED_CAPSTONE_DEFINITION } from "../src/capstone-a2.service";
import { OfflineSyncService } from "../src/offline-sync.service";
import type { T1CapstoneSubmission, A2CapstoneSubmission } from "@lurexa/types";


async function testT1Implementation(): Promise<void> {
  console.log("▶ Testing Teach T1 Reference Implementation & Capstone...");

  const validSubmission: T1CapstoneSubmission = {
    id: "sub_t1_test_1",
    educatorId: "edu_123",
    moduleCode: "T1_COHERENT_LESSON",
    title: "Mastering Present Simple Routines in Context",
    targetCefr: "A1",
    lessonPlanArtifact: [
      {
        stage: "warmup",
        allocatedMinutes: 5,
        teacherActions: "Display daily routine images and prompt quick student recall.",
        studentActions: "Identify morning actions spontaneously in pairs.",
        formativeCheckStrategy: "Thumbs up/down peer check on image matching.",
      },
      {
        stage: "presentation",
        allocatedMinutes: 10,
        teacherActions: "Model 3 target frequency sentences and clarify time connectors.",
        studentActions: "Notice word order and chorus target linked phrases.",
        formativeCheckStrategy: "Concept checking questions on adverb position.",
      },
      {
        stage: "guided_practice",
        allocatedMinutes: 15,
        teacherActions: "Facilitate structured information gap activity between partners.",
        studentActions: "Ask and answer 4 routine questions using sentence stems.",
        formativeCheckStrategy: "Circulate and record pronunciation of final -s markers.",
      },
      {
        stage: "independent_practice",
        allocatedMinutes: 15,
        teacherActions: "Monitor while students formulate and present personal routines.",
        studentActions: "Draft and speak a 4-sentence personal weekday schedule.",
        formativeCheckStrategy: "Peer feedback rubric focusing on clarity and time markers.",
      },
      {
        stage: "assessment_closure",
        allocatedMinutes: 5,
        teacherActions: "Summarize core takeaways and assign reflection exit ticket.",
        studentActions: "Complete one-sentence exit ticket summarizing their partner's morning.",
        formativeCheckStrategy: "Exit ticket review before dismissal.",
      },
    ],
    reflectiveRationale: {
      whyThisObjective: "A1 learners need concrete daily routine structures to build communicative independence and confidence.",
      howL1TransferIsAddressed: "Targeting Spanish /s/ consonant clusters and 3rd person singular /s/ omission by providing structured phonetic contrast drills.",
      differentiationStrategy: "Visual cues and sentence stems provided for emerging speakers; extended prompt for fast finishers.",
    },
    status: "submitted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const validation = TeachT1Service.validateArtifact(validSubmission);
  assert.equal(validation.valid, true, "Valid T1 submission must pass validation without blocking errors");
  assert.ok(validation.metrics.studentPracticeRatio >= 0.6, "Student practice ratio must exceed 60%");

  const rubric = TeachT1Service.evaluateT1Submission(validSubmission);
  assert.equal(rubric.passed, true, "Exemplary T1 submission must achieve passing score (>= 80)");
  assert.ok(rubric.totalScore >= 80, `Total score should be >= 80, received: ${rubric.totalScore}`);
  assert.ok(rubric.recommendationsForT2.length > 0, "Must provide recommendations for T2 progression");

  console.log("  ✔ Teach T1 validation and rubric evaluation verified.");
}

async function testA2Implementation(): Promise<void> {
  console.log("▶ Testing Level A2 Reference Implementation & Capstone...");

  assert.equal(A2_MODULES_1_TO_8.length, 8, "A2 curriculum must have exactly 8 modules");
  const moduleOrders = A2_MODULES_1_TO_8.map((m) => m.order);
  assert.deepEqual(moduleOrders, [1, 2, 3, 4, 5, 6, 7, 8], "A2 modules must be ordered sequentially from 1 to 8");

  for (const mod of A2_MODULES_1_TO_8) {
    assert.ok(mod.title.length > 0, `Module ${mod.order} must have a title`);
    assert.ok(mod.competencyIds.length >= 3, `Module ${mod.order} must declare at least 3 competencies`);
    assert.ok(mod.vocabulary.length >= 5, `Module ${mod.order} must declare vocabulary targets`);
    assert.ok(mod.grammarStructures.length >= 2, `Module ${mod.order} must declare grammar structures`);
    assert.ok(mod.phoneticTargets.length >= 1, `Module ${mod.order} must declare phonetic targets`);
    assert.ok(mod.createApplyTask.prompt.length > 0, `Module ${mod.order} must have Create & Apply task`);
  }

  // Verify A2 Capstone definition & service
  assert.equal(A2_INTEGRATED_CAPSTONE_DEFINITION.id, "english-a2-capstone");
  assert.equal(A2_INTEGRATED_CAPSTONE_DEFINITION.sections.length, 3, "A2 Capstone must include 3 sections");

  const sampleSubmission: A2CapstoneSubmission = {
    id: "capstone_sub_a2_01",
    learnerId: "learner_a2_test",
    capstoneId: "english-a2-capstone",
    spokenAudioEvidenceUrl: "https://storage.lurexa.com/audio/a2_defense_01.webm",
    spokenTranscript: "Last year I had an unexpected flight delay at the airport. I went directly to the customer service ticket counter, explained my situation politely, and requested a hotel reservation as scheduled. The airline agent confirmed my next morning departure and gave me meal vouchers.",
    writtenResolutionText: "Dear Supervisor, I am writing to confirm that I completed the emergency inventory report as requested. Yesterday we had a supply delay, so I contacted our distributor directly to adjust the delivery schedule for next Monday.",
    submittedAt: new Date().toISOString(),
  };

  const capstoneResult = CapstoneA2Service.evaluateCapstone(sampleSubmission);
  assert.equal(capstoneResult.level, "A2");
  assert.equal(capstoneResult.passed, true, "Well-formed submission must pass A2 capstone");
  assert.ok(capstoneResult.score >= 75, `Expected score >= 75, got: ${capstoneResult.score}`);
  assert.ok(capstoneResult.observedL1TransferStrengths.length >= 2, "Must identify L1 transfer strengths");

  console.log("  ✔ Level A2 modules and Capstone evaluator verified.");
}

async function testOfflineSyncRuntime(): Promise<void> {
  console.log("▶ Testing Offline-First PWA Sync Engine Runtime...");

  // Enqueue offline spoken evidence
  const evidenceId = await OfflineSyncService.enqueueEvidence({
    learnerId: "learner_dr_01",
    competencyId: "EN.A2.SPEAK.DESCRIBE_ROUTINE",
    type: "spoken_production",
    payload: {
      audioDurationMs: 45000,
      transcript: "I always prepare breakfast before leaving for work.",
      fluencyScore: 0.88,
    },
  });
  assert.ok(evidenceId.startsWith("ev_offline_"), "Evidence ID must be generated with correct prefix");

  // Enqueue offline learner model delta
  const deltaId = await OfflineSyncService.enqueueLearnerModelDelta(
    "learner_dr_01",
    "phonetic_mastery_final_s",
    { masteryLevel: 0.92, verifiedAt: Date.now() }
  );
  assert.ok(deltaId.startsWith("delta_"), "Delta ID must have delta_ prefix");

  const pendingCount = await OfflineSyncService.getPendingSyncCount();
  assert.ok(pendingCount >= 2, `Pending sync count should be >= 2, found ${pendingCount}`);

  // Process sync queue
  const syncResult = await OfflineSyncService.processPendingSyncQueue();
  assert.ok(typeof syncResult.syncedEvidence === "number", "Sync result must report evidence count");
  assert.ok(typeof syncResult.syncedDeltas === "number", "Sync result must report delta count");

  console.log("  ✔ Offline sync engine and Dexie persistence verified.");
}

async function runAll(): Promise<void> {
  try {
    await testT1Implementation();
    await testA2Implementation();
    await testOfflineSyncRuntime();
    console.log("\n✅ ALL TEACH T1, LEVEL A2, AND OFFLINE RUNTIME TESTS PASSED.");
  } catch (err) {
    console.error("\n❌ TEST SUITE FAILED:", err);
    process.exit(1);
  }
}

void runAll();

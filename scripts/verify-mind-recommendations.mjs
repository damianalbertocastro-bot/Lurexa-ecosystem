import { ConservativeLearningIntelligenceService } from "../packages/backend/src/mind-learning-intelligence.server.ts";

const service = new ConservativeLearningIntelligenceService();
const learnerId = "fixture-learner";
const organizationId = "fixture-org";
let evidenceSequence = 0;

function evidence({ activityId, correct, competencyIds = [], attemptNumber = 1 }) {
  evidenceSequence += 1;
  return {
    id: `fixture-evidence-${evidenceSequence}`,
    learnerId,
    organizationId,
    source: {
      product: "learn",
      courseId: "course-a1",
      lessonId: "lesson-a1-1",
      activityId,
    },
    type: "activity_result",
    observedAt: new Date(Date.UTC(2026, 0, 1, 0, evidenceSequence, 0)).toISOString(),
    payload: { correct, competencyIds, attemptNumber },
    provenance: { method: "system_observed", actorId: learnerId },
  };
}

async function recommendationFor(items) {
  const result = await service.interpretLearnerEvidence({
    learnerId,
    organizationId,
    evidence: items,
    requestedDomains: ["recommendation"],
  });
  return result.insights.find((insight) => insight.domain === "recommendation") ?? null;
}

function actionOf(insight) {
  if (insight?.data?.kind !== "recommendation") return null;
  return insight.data.recommendations?.[0] ?? null;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log(`✓ ${message}`);
}

const insufficient = await recommendationFor([
  evidence({ activityId: "activity-one", correct: false, competencyIds: ["introductions"] }),
]);
assert(insufficient === null, "one failed activity is insufficient for a recommendation");

const repeatedDifficulty = await recommendationFor([
  evidence({ activityId: "activity-two", correct: false, competencyIds: ["question-formation"], attemptNumber: 1 }),
  evidence({ activityId: "activity-two", correct: false, competencyIds: ["question-formation"], attemptNumber: 2 }),
]);
const repeatedAction = actionOf(repeatedDifficulty);
assert(Boolean(repeatedDifficulty), "repeated current difficulty produces a recommendation");
assert(repeatedAction?.outcome === "targeted_practice", "competency-backed repeated difficulty becomes targeted practice");
assert(repeatedDifficulty?.basedOnEvidenceIds.length === 2, "repeated-difficulty recommendation preserves evidence references");

const successfulRetry = await recommendationFor([
  evidence({ activityId: "activity-three", correct: false, competencyIds: ["past-tense"], attemptNumber: 1 }),
  evidence({ activityId: "activity-three", correct: true, competencyIds: ["past-tense"], attemptNumber: 2 }),
]);
const retryAction = actionOf(successfulRetry);
assert(retryAction?.outcome === "continue", "successful retry supports continuation rather than a mastery claim");

const normalContinuation = await recommendationFor([
  evidence({ activityId: "activity-four", correct: true, competencyIds: ["greetings"] }),
  evidence({ activityId: "activity-five", correct: true, competencyIds: ["introductions"] }),
]);
const continuationAction = actionOf(normalContinuation);
assert(continuationAction?.outcome === "continue", "multiple recent successful observations support normal continuation");
assert(normalContinuation?.data?.kind === "recommendation" && normalContinuation.data.interpretationVersion === "learn-next-step-v1", "recommendation records interpretation version");

console.log("Mind recommendation fixtures passed.");

import { MindLearningIntelligenceService } from "../packages/backend/src/mind/learning-intelligence.server.ts";
import { assertApprovableDerivedObservation } from "../packages/backend/src/learner-firestore.server.ts";

const learnerId = "contract-fixture-learner";
const organizationId = "contract-fixture-org";
const evidence = [
  {
    contractVersion: "1",
    id: "contract-evidence-1",
    learnerId,
    organizationId,
    source: { product: "learn", activityId: "activity-1" },
    type: "activity_result",
    observedAt: "2026-08-22T00:00:00.000Z",
    dataClassification: "standard",
    payload: { correct: false, competencyIds: ["question-formation"] },
    provenance: { method: "system_observed" },
  },
  {
    contractVersion: "1",
    id: "contract-evidence-2",
    learnerId,
    organizationId,
    source: { product: "learn", activityId: "activity-1" },
    type: "activity_result",
    observedAt: "2026-08-22T00:01:00.000Z",
    dataClassification: "standard",
    payload: { correct: false, competencyIds: ["question-formation"] },
    provenance: { method: "system_observed" },
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log(`✓ ${message}`);
}

const service = new MindLearningIntelligenceService();
const result = await service.interpretAuthorizedEvidence({
  contractVersion: "1",
  requestId: "contract-request-1",
  purpose: "mind_learning_interpretation",
  interpretationTypes: ["recommendation"],
  input: { learnerId, organizationId, evidence },
  modelPolicyVersion: "mind-policy-v1",
});

const candidate = result.outputs.find((output) => output.type === "recommendation");
assert(result.contractVersion === "1", "Mind result is versioned");
assert(candidate?.status === "candidate", "Mind produces a candidate rather than persisted state");
assert(candidate?.generatedBy.ruleVersion === "learn-next-step-v1", "Learn recommendation preserves deterministic rule provenance");
assert(candidate?.basedOnEvidenceIds.length === 2, "candidate retains its authorized evidence basis");
assert(candidate?.scope.products.includes("learn"), "candidate has a bounded product scope");

assertApprovableDerivedObservation({
  candidate,
  authorizedEvidenceIds: evidence.map((entry) => entry.id),
  policyId: "core-derived-observation-v1",
});
assert(true, "Core accepts a candidate whose evidence basis is authorized");

let rejected = false;
try {
  assertApprovableDerivedObservation({
    candidate,
    authorizedEvidenceIds: [],
    policyId: "core-derived-observation-v1",
  });
} catch {
  rejected = true;
}
assert(rejected, "Core rejects a candidate with evidence outside its authorized input");

let malformedRejected = false;
try {
  assertApprovableDerivedObservation({
    candidate: { ...candidate, scope: { purposes: ["not-a-purpose"], products: ["learn"] } },
    authorizedEvidenceIds: evidence.map((entry) => entry.id),
    policyId: "core-derived-observation-v1",
  });
} catch {
  malformedRejected = true;
}
assert(malformedRejected, "Core rejects malformed candidate scopes before persistence");

let crossTenantRejected = false;
try {
  await service.interpretAuthorizedEvidence({
    contractVersion: "1",
    requestId: "contract-request-cross-tenant",
    purpose: "mind_learning_interpretation",
    interpretationTypes: ["recommendation"],
    input: { learnerId, evidence },
    modelPolicyVersion: "mind-policy-v1",
  });
} catch {
  crossTenantRejected = true;
}
assert(crossTenantRejected, "Mind rejects tenant-scoped evidence without an explicit organization boundary");

const teacherEvidence = [{
  contractVersion: "1",
  id: "teacher-review-1",
  learnerId,
  organizationId,
  source: { product: "learn", courseId: "course-1", lessonId: "lesson-1", activityId: "activity-1" },
  type: "assessment_result",
  observedAt: "2026-08-22T01:00:00.000Z",
  dataClassification: "standard",
  provenance: { method: "teacher_reported", actorId: "teacher-1", confidence: 1 },
  payload: {
    returnLoopActions: [{
      id: "return-1",
      actionType: "targeted_micropractice",
      title: "Practice question formation",
      instruction: "Complete one short supported question-formation practice before the next lesson.",
      targetCompetencyIds: ["question-formation"],
      assignedAt: "2026-08-22T01:00:00.000Z",
    }],
  },
}];
const teacherResult = await service.interpretAuthorizedEvidence({
  contractVersion: "1",
  requestId: "contract-request-teacher-1",
  purpose: "mind_learning_interpretation",
  interpretationTypes: ["recommendation"],
  input: { learnerId, organizationId, evidence: teacherEvidence },
  modelPolicyVersion: "mind-policy-v1",
});
const teacherRecommendation = teacherResult.outputs.find((output) => output.generatedBy.capability === "teacher-guidance-normalizer");
assert(teacherRecommendation?.confidence === 1, "explicit teacher guidance remains authoritative rather than being re-inferred");
assert(teacherRecommendation?.basedOnEvidenceIds[0] === "teacher-review-1", "teacher guidance recommendation retains audit provenance");
assertApprovableDerivedObservation({
  candidate: teacherRecommendation,
  authorizedEvidenceIds: ["teacher-review-1"],
  policyId: "core-derived-observation-v1",
});
assert(true, "Core approval accepts normalized teacher guidance with an authorized evidence basis");

console.log("Unified Mind interpretation and Core approval contract fixtures passed.");

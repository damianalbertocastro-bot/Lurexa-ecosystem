import { ConservativeLearningIntelligenceService } from "../packages/backend/src/mind-learning-intelligence.server.ts";
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

const service = new ConservativeLearningIntelligenceService();
const result = await service.interpretAuthorizedEvidence({
  contractVersion: "1",
  requestId: "contract-request-1",
  purpose: "mind_learning_interpretation",
  interpretationTypes: ["recommendation"],
  input: { learnerId, organizationId, evidence },
  modelPolicyVersion: "mind-policy-v1",
});

const candidate = result.outputs[0];
assert(result.contractVersion === "1", "Mind result is versioned");
assert(candidate?.status === "candidate", "Mind produces a candidate rather than persisted state");
assert(candidate?.generatedBy.ruleVersion === "learn-next-step-v1", "candidate captures deterministic rule provenance");
assert(candidate?.basedOnEvidenceIds.length === 2, "candidate retains its authorized evidence basis");
assert(candidate?.scope.products.includes("learn"), "candidate has a bounded product scope");

assertApprovableDerivedObservation({
  candidate,
  authorizedEvidenceIds: evidence.map((entry) => entry.id),
});
assert(true, "Core accepts a candidate whose evidence basis is authorized");

let rejected = false;
try {
  assertApprovableDerivedObservation({ candidate, authorizedEvidenceIds: [] });
} catch {
  rejected = true;
}
assert(rejected, "Core rejects a candidate with evidence outside its authorized input");

console.log("Mind interpretation and Core approval contract fixtures passed.");

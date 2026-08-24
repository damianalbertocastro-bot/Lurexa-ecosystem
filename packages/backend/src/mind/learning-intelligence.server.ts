import type {
  CandidateDerivedObservation,
  MindInterpretationRequestV1,
  MindInterpretationResultV1,
} from "@lurexa/types";
import { ConservativeLearningIntelligenceService } from "../mind-learning-intelligence.server";
import { MindService } from "../mind.service";

function dedupeCandidates(candidates: CandidateDerivedObservation[]): CandidateDerivedObservation[] {
  const byIdentity = new Map<string, CandidateDerivedObservation>();
  for (const candidate of candidates) {
    const identity = [
      candidate.type,
      candidate.domain,
      candidate.learnerId,
      candidate.organizationId ?? "global",
      ...candidate.basedOnEvidenceIds.slice().sort(),
    ].join("|");
    const existing = byIdentity.get(identity);
    if (!existing || candidate.confidence > existing.confidence) byIdentity.set(identity, candidate);
  }
  return [...byIdentity.values()];
}

/**
 * Storage-free Lurexa Mind facade.
 *
 * The conservative interpreter protects the existing Learn quiz/activity
 * recommendation loop. The richer adaptation engine interprets spoken and
 * linguistic evidence. Neither implementation may select Firestore data,
 * authorize access, approve candidates, or persist learner state.
 */
export class MindLearningIntelligenceService {
  private readonly conservative = new ConservativeLearningIntelligenceService();
  private readonly adaptation = new MindService();

  async interpretAuthorizedEvidence(
    request: MindInterpretationRequestV1,
  ): Promise<MindInterpretationResultV1> {
    const [conservativeResult, adaptationResult] = await Promise.all([
      this.conservative.interpretAuthorizedEvidence(request),
      this.adaptation.interpret(request),
    ]);

    const outputs = dedupeCandidates([
      ...conservativeResult.outputs,
      ...adaptationResult.outputs,
    ]);

    return {
      contractVersion: request.contractVersion,
      interpretationId: request.requestId,
      learnerId: request.input.learnerId,
      generatedAt: new Date().toISOString(),
      purpose: request.purpose,
      outputs,
      limitations: outputs.length
        ? [
            ...new Set([
              ...conservativeResult.limitations,
              ...adaptationResult.limitations,
            ]),
          ]
        : ["No evidence-supported interpretation is available for the requested types."],
      modelPolicyVersion: request.modelPolicyVersion,
    };
  }
}

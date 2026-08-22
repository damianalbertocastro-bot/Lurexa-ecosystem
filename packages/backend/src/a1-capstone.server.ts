import type {
  CapstoneAssessmentResult,
  CapstoneDecision,
  CapstoneRequirementResult,
  IntegratedCapstoneDefinition,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import type { AuthenticatedActor } from "./course-platform.server";

export const A1_CAPSTONE_ID = "english-a1-my-life-my-english";
export const A1_COURSE_ID = "english-a1-foundations";

export const A1_CAPSTONE: IntegratedCapstoneDefinition = {
  schemaVersion: "1",
  id: A1_CAPSTONE_ID,
  programId: "english-a1",
  levelOrStage: "A1",
  title: "My Life, My English",
  purpose: "learner_level_exit",
  sections: [
    {
      id: "a1-capstone-section-portfolio",
      title: "My A1 portfolio",
      mission: "Revisit and improve selected work from across A1, then explain what you can now do independently.",
      requirementIds: ["a1-capstone-reading-writing", "a1-capstone-reflection"],
      lessonId: "a1-m8-u3-l1-my-life-in-english",
    },
    {
      id: "a1-capstone-section-conversation",
      title: "A1 conversation challenge",
      mission: "Meet, ask and answer questions, make a simple plan, and repair one misunderstanding in a short unscripted interaction.",
      requirementIds: ["a1-capstone-speaking-interaction", "a1-capstone-pronunciation"],
      lessonId: "a1-m8-u3-l2-conversation-challenge",
    },
    {
      id: "a1-capstone-section-integrated",
      title: "My Life, My English",
      mission: "Use A1 English to understand practical information, respond, relay one detail, and complete a real-world communication goal.",
      requirementIds: ["a1-capstone-listening", "a1-capstone-mediation-online", "a1-capstone-transfer"],
      lessonId: "a1-m8-u3-l3-capstone",
    },
  ],
  evidenceRequirements: [
    {
      id: "a1-capstone-listening",
      title: "Understand key details in familiar spoken language",
      competencyIds: ["EN.A1.LISTEN.KEY_DETAILS", "EN.A1.LISTEN.PREDICTABLE_EXCHANGES"],
      modes: ["listening"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: false,
      criticalForExit: true,
    },
    {
      id: "a1-capstone-speaking-interaction",
      title: "Speak and sustain a short supported interaction",
      competencyIds: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"],
      modes: ["speaking", "interaction"],
      minimumIndependentArtifacts: 2,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
    {
      id: "a1-capstone-reading-writing",
      title: "Read functional information and write a short meaningful message",
      competencyIds: ["EN.A1.READ.FUNCTIONAL_INFORMATION", "EN.A1.WRITE.BASIC_MESSAGE", "EN.A1.WRITE.PERSONAL_SENTENCES"],
      modes: ["reading", "writing"],
      minimumIndependentArtifacts: 2,
      coachEvidenceAllowed: false,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: false,
      criticalForExit: true,
    },
    {
      id: "a1-capstone-pronunciation",
      title: "Produce core phrases intelligibly",
      competencyIds: ["EN.A1.PHON.INTELLIGIBLE_CORE_PHRASES", "EN.A1.PHON.WORD_STRESS", "EN.A1.PHON.BASIC_INTONATION"],
      modes: ["pronunciation", "speaking"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
    {
      id: "a1-capstone-mediation-online",
      title: "Relay simple information and complete a short digital exchange",
      competencyIds: ["EN.A1.MED.RELAY_PERSONAL_DETAIL", "EN.A1.ONLINE.SHARE_BASIC_INFORMATION"],
      modes: ["mediation", "online_interaction"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: false,
      criticalForExit: false,
    },
    {
      id: "a1-capstone-transfer",
      title: "Transfer A1 language to a new practical scenario",
      competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.STRAT.ASK_REPEAT"],
      modes: ["speaking", "interaction", "mediation"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: true,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: true,
      criticalForExit: true,
    },
    {
      id: "a1-capstone-reflection",
      title: "Reflect on demonstrated capability and identify the next target",
      competencyIds: ["EN.A1.STRAT.USE_CHUNKS"],
      modes: ["reflection", "writing"],
      minimumIndependentArtifacts: 1,
      coachEvidenceAllowed: false,
      teacherEvidenceAllowed: true,
      humanReviewRecommended: false,
      criticalForExit: false,
    },
  ],
  delayedRetrievalRequired: true,
  firstAttemptPreserved: true,
  supportedEvidenceDistinguished: true,
  decisionPolicy: {
    allowedDecisions: ["READY", "READY_WITH_TARGETS", "MORE_EVIDENCE_NEEDED", "TARGETED_REVALIDATION", "NOT_YET_READY"],
    requireAllCriticalRequirements: true,
    allowTargetedRevalidation: true,
    prohibitCompletionOnlyDecision: true,
  },
};

type EvidenceSnapshot = {
  id: string;
  competencyIds: string[];
  independent: boolean;
  qualified: boolean;
};

function readCompetencyIds(payload: Record<string, unknown>): string[] {
  return Array.isArray(payload.competencyIds)
    ? payload.competencyIds.filter((value): value is string => typeof value === "string")
    : [];
}

function isIndependentEvidence(payload: Record<string, unknown>): boolean {
  if (payload.firstAttempt === false) return false;
  if (payload.scaffolded === true || payload.supported === true || payload.hintUsed === true) return false;
  return true;
}

function isQualifiedEvidence(input: {
  type?: unknown;
  payload: Record<string, unknown>;
  provenance?: { method?: unknown };
}): boolean {
  const { payload } = input;
  if (typeof payload.performanceJudgment === "string") return payload.performanceJudgment === "meets";
  if (payload.validated === true) return true;
  if (payload.correct === true && (input.type === "assessment_result" || input.type === "activity_result")) return true;
  // Raw exposure, raw recordings, free-response submission, roleplay turns,
  // and teacher observations without an explicit positive performance judgment
  // are valuable evidence but do not prove level quality by themselves.
  return false;
}

function decisionFor(results: CapstoneRequirementResult[], rawEvidenceCount: number): CapstoneDecision {
  if (rawEvidenceCount === 0) return "MORE_EVIDENCE_NEEDED";
  const critical = A1_CAPSTONE.evidenceRequirements.filter((requirement) => requirement.criticalForExit);
  const criticalResults = critical.map((requirement) => results.find((result) => result.requirementId === requirement.id));
  const missingCritical = criticalResults.filter((result) => !result?.satisfied);
  if (missingCritical.length >= Math.ceil(critical.length / 2)) return "NOT_YET_READY";
  if (missingCritical.length) return "TARGETED_REVALIDATION";
  const missingOptional = results.filter((result) => !result.satisfied);
  return missingOptional.length ? "READY_WITH_TARGETS" : "READY";
}

export const A1CapstoneService = {
  async evaluate(actor: AuthenticatedActor): Promise<CapstoneAssessmentResult> {
    const database = getServerFirestore();
    const courseSnapshot = await database.collection("courses").doc(A1_COURSE_ID).get();
    if (!courseSnapshot.exists) throw new Error("A1 course not found.");
    const organizationId = courseSnapshot.data()?.orgId;
    if (typeof organizationId !== "string" || !organizationId) throw new Error("A1 course organization is unavailable.");

    const membership = await database.collection("user-memberships").doc(actor.uid).collection("organizations").doc(organizationId).get();
    if (!membership.exists) throw new Error("You do not have access to this course.");

    const snapshots = await database.collection("learning-evidence")
      .where("learnerId", "==", actor.uid)
      .where("organizationId", "==", organizationId)
      .get();

    const evidence: EvidenceSnapshot[] = snapshots.docs.flatMap((snapshot) => {
      const data = snapshot.data() as {
        source?: { courseId?: unknown };
        type?: unknown;
        payload?: Record<string, unknown>;
        provenance?: { method?: unknown };
      };
      if (data.source?.courseId !== A1_COURSE_ID || !data.payload) return [];
      const competencyIds = readCompetencyIds(data.payload);
      if (!competencyIds.length) return [];
      return [{
        id: snapshot.id,
        competencyIds,
        independent: isIndependentEvidence(data.payload),
        qualified: isQualifiedEvidence({ type: data.type, payload: data.payload, provenance: data.provenance }),
      }];
    });

    const requirementResults: CapstoneRequirementResult[] = A1_CAPSTONE.evidenceRequirements.map((requirement) => {
      const matching = evidence.filter((item) => item.competencyIds.some((id) => requirement.competencyIds.includes(id)));
      const qualifiedIndependent = matching.filter((item) => item.independent && item.qualified);
      const independentEvidenceCount = qualifiedIndependent.length;
      const supportedEvidenceCount = matching.length - independentEvidenceCount;
      const satisfied = independentEvidenceCount >= requirement.minimumIndependentArtifacts;
      return {
        requirementId: requirement.id,
        competencyIds: requirement.competencyIds,
        independentEvidenceCount,
        supportedEvidenceCount,
        satisfied,
        confidence: satisfied ? Math.min(0.9, 0.55 + independentEvidenceCount * 0.1) : Math.min(0.45, independentEvidenceCount * 0.15),
        evidenceIds: matching.map((item) => item.id),
      };
    });

    const decision = decisionFor(requirementResults, evidence.length);
    const targetedCompetencyIds = requirementResults
      .filter((result) => !result.satisfied)
      .flatMap((result) => result.competencyIds)
      .filter((value, index, values) => values.indexOf(value) === index);

    return {
      capstoneId: A1_CAPSTONE_ID,
      learnerId: actor.uid,
      decision,
      evaluatedAt: new Date().toISOString(),
      requirementResults,
      targetedCompetencyIds,
      rationale: decision === "READY"
        ? "The current A1 evidence bundle contains qualified independent evidence for every integrated capstone requirement. This is not a completion-only inference."
        : decision === "READY_WITH_TARGETS"
          ? "Critical A1 exit requirements have qualified independent evidence, with non-critical targets retained for retrieval and continued growth."
          : decision === "TARGETED_REVALIDATION"
            ? "Most A1 exit requirements have qualified evidence, but one or more critical requirements need targeted independent revalidation."
            : decision === "MORE_EVIDENCE_NEEDED"
              ? "There is not yet enough A1 evidence to make a level-exit interpretation. Complete the capstone tasks and return after evidence is captured."
              : "The current evidence bundle contains learning activity, but not enough qualified independent performance evidence to support A1 exit readiness yet.",
      provenance: {
        method: "system_interpreted",
        actorId: actor.uid,
      },
    };
  },
};

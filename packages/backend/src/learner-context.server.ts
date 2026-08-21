import type {
  LearnerContext,
  LearnerDomain,
  LearnerInsight,
  LearnerPattern,
  LearnerRecommendationAction,
  StudentProgress,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import {
  FirestoreLearnerInsightRepository,
  FirestoreLearningEvidenceRepository,
} from "./learner-firestore.server";

export type LearnerContextPurpose =
  | "learn_adaptive_practice"
  | "coach_session_adaptation";

export interface ScopedLearnerContext {
  contractVersion: "1";
  purpose: LearnerContextPurpose;
  context: LearnerContext;
  evidenceSummary: {
    recentEvidenceTypes: string[];
    latestEvidenceAt: string | null;
  };
  limitations: string[];
}

const allowedDomains: LearnerDomain[] = [
  "proficiency",
  "curriculum",
  "grammar",
  "vocabulary",
  "pronunciation",
  "fluency",
  "goal",
  "preference",
  "recommendation",
];

function latestInsight(insights: LearnerInsight[], kind: NonNullable<LearnerInsight["data"]>["kind"]): LearnerInsight | undefined {
  return insights
    .filter((insight) => insight.data?.kind === kind)
    .sort((first, second) => second.generatedAt.localeCompare(first.generatedAt))[0];
}

function pushUnique(target: string[], values: string[]): void {
  for (const value of values) if (!target.includes(value)) target.push(value);
}

/**
 * Trusted Core read boundary for learner context. It intentionally returns a
 * small purpose-scoped projection and never exposes raw evidence payloads.
 */
export async function getScopedLearnerContext(input: {
  actorId: string;
  learnerId: string;
  purpose: LearnerContextPurpose;
  domains: LearnerDomain[];
}): Promise<ScopedLearnerContext> {
  if (input.actorId !== input.learnerId) {
    throw new Error("You may only request your own learner context.");
  }

  const domains = input.domains.filter((domain) => allowedDomains.includes(domain));
  const domainSet = new Set(domains);
  const database = getServerFirestore();
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  const insightRepository = new FirestoreLearnerInsightRepository();

  const [progressSnapshot, evidence, insights, profileSnapshot] = await Promise.all([
    database.collection("progress").where("studentId", "==", input.learnerId).get(),
    evidenceRepository.listByLearner(input.learnerId),
    insightRepository.listActiveByLearner(input.learnerId),
    database.collection("learner-profiles").doc(input.learnerId).get(),
  ]);

  const progress = progressSnapshot.docs
    .map((snapshot) => snapshot.data() as StudentProgress)
    .sort((first, second) => second.lastAccessedAt.localeCompare(first.lastAccessedAt));
  const latestProgress = progress[0];
  const filteredInsights = insights.filter((insight) => domainSet.has(insight.domain));

  const profile = profileSnapshot.exists ? profileSnapshot.data() as { goals?: unknown } : null;
  const declaredGoals = Array.isArray(profile?.goals)
    ? profile.goals.filter((goal): goal is string => typeof goal === "string")
    : [];
  const goalInsight = latestInsight(filteredInsights, "goals");
  const goals = goalInsight?.data?.kind === "goals" ? goalInsight.data.goals : declaredGoals;

  const context: LearnerContext = {
    learnerId: input.learnerId,
    generatedAt: new Date().toISOString(),
  };

  if (domainSet.has("goal") && goals.length > 0) context.goals = goals;

  if (domainSet.has("curriculum") && latestProgress) {
    context.curriculum = {
      courseId: latestProgress.courseId,
      moduleId: latestProgress.moduleId,
      lessonId: latestProgress.lessonId,
      updatedAt: latestProgress.lastAccessedAt,
    };
  }

  const proficiencyInsight = latestInsight(filteredInsights, "cefr_estimate");
  if (domainSet.has("proficiency") && proficiencyInsight?.data?.kind === "cefr_estimate") {
    context.proficiency = {
      cefr: proficiencyInsight.data.level,
      updatedAt: proficiencyInsight.generatedAt,
    };
  }

  const targets: NonNullable<LearnerContext["activeTargets"]> = {};
  for (const insight of filteredInsights) {
    if (insight.data?.kind !== "learning_targets") continue;
    if (insight.data.domain === "grammar") {
      targets.grammar ??= [];
      pushUnique(targets.grammar, insight.data.targets);
    }
    if (insight.data.domain === "vocabulary") {
      targets.vocabulary ??= [];
      pushUnique(targets.vocabulary, insight.data.targets);
    }
    if (insight.data.domain === "pronunciation") {
      targets.pronunciation ??= [];
      pushUnique(targets.pronunciation, insight.data.targets);
    }
    if (insight.data.domain === "fluency") {
      targets.fluency ??= [];
      pushUnique(targets.fluency, insight.data.targets);
    }
  }
  if (Object.keys(targets).length > 0) context.activeTargets = targets;

  const recurringPatterns: LearnerPattern[] = filteredInsights
    .flatMap((insight) => insight.data?.kind === "recurring_pattern" ? [insight.data.pattern] : [])
    .sort((first, second) => (second.confidence ?? 0) - (first.confidence ?? 0));
  if (recurringPatterns.length > 0) context.recurringPatterns = recurringPatterns;

  if (domainSet.has("recommendation")) {
    const recommendationInsight = latestInsight(filteredInsights, "recommendation");
    if (recommendationInsight?.data?.kind === "recommendation") {
      const recommendations: LearnerRecommendationAction[] = recommendationInsight.data.recommendations ?? recommendationInsight.data.actions.map((label) => ({
        outcome: "reinforce",
        label,
        reason: recommendationInsight.summary,
      }));
      if (recommendations.length > 0) context.recommendations = recommendations.slice(0, 3);
    }
  }

  const recentActivityIds = evidence
    .slice()
    .sort((first, second) => second.observedAt.localeCompare(first.observedAt))
    .flatMap((entry) => entry.source.activityId ? [entry.source.activityId] : [])
    .filter((id, index, values) => values.indexOf(id) === index)
    .slice(0, 10);
  if (recentActivityIds.length > 0) context.recentActivityIds = recentActivityIds;

  const recentEvidence = evidence
    .slice()
    .sort((first, second) => second.observedAt.localeCompare(first.observedAt));

  return {
    contractVersion: "1",
    purpose: input.purpose,
    context,
    evidenceSummary: {
      recentEvidenceTypes: [...new Set(recentEvidence.map((entry) => entry.type))].slice(0, 10),
      latestEvidenceAt: recentEvidence[0]?.observedAt ?? null,
    },
    limitations: [
      "Context is purpose-scoped and excludes raw learner responses.",
      "Proficiency is returned only when an active, evidence-backed CEFR insight exists.",
      "Recommendations are revisable next-step guidance, not mastery or proficiency determinations.",
      "Recent activity is evidence of participation, not a mastery determination.",
      "Legacy Learn evidence is normalized at the repository boundary until its producer is migrated.",
    ],
  };
}

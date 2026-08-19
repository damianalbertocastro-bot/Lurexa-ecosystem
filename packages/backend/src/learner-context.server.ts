import type { LearnerContext, LearnerDomain } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

export type LearnerContextPurpose =
  | "learn_adaptive_practice"
  | "coach_session_adaptation";

export interface ScopedLearnerContext {
  contractVersion: "1";
  purpose: LearnerContextPurpose;
  context: LearnerContext;
  evidenceSummary: {
    recentEventTypes: string[];
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

/**
 * Trusted Core read boundary for learner context. It intentionally returns a
 * small purpose-scoped projection and never exposes raw evidence artifacts.
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
  const database = getServerFirestore();
  const [progressSnapshot, evidenceSnapshot] = await Promise.all([
    database.collection("progress").where("studentId", "==", input.learnerId).get(),
    database.collection("learning-evidence").where("learnerId", "==", input.learnerId).get(),
  ]);

  const progress = progressSnapshot.docs
    .map((snapshot) => snapshot.data() as {
      courseId?: string;
      lessonId?: string;
      lastAccessedAt?: string;
      attempts?: Array<{ quizId?: string }>;
    })
    .sort((first, second) => (second.lastAccessedAt ?? "").localeCompare(first.lastAccessedAt ?? ""));
  const latestProgress = progress[0];
  const evidence = evidenceSnapshot.docs
    .map((snapshot) => snapshot.data() as { eventType?: string; recordedAt?: string })
    .sort((first, second) => (second.recordedAt ?? "").localeCompare(first.recordedAt ?? ""));

  const context: LearnerContext = {
    learnerId: input.learnerId,
    ...(domains.includes("curriculum") && latestProgress ? {
      curriculum: {
        courseId: latestProgress.courseId,
        lessonId: latestProgress.lessonId,
        updatedAt: latestProgress.lastAccessedAt,
      },
    } : {}),
    recentActivityIds: progress.flatMap((entry) => entry.attempts?.map((attempt) => attempt.quizId).filter((id): id is string => Boolean(id)) ?? []).slice(0, 10),
    generatedAt: new Date().toISOString(),
  };

  return {
    contractVersion: "1",
    purpose: input.purpose,
    context,
    evidenceSummary: {
      recentEventTypes: [...new Set(evidence.map((entry) => entry.eventType).filter((type): type is string => Boolean(type)))].slice(0, 10),
      latestEvidenceAt: evidence[0]?.recordedAt ?? null,
    },
    limitations: [
      "Context is purpose-scoped and excludes raw learner responses.",
      "No proficiency estimate is returned until validated placement evidence exists.",
      "Recent activity is evidence of participation, not a mastery determination.",
    ],
  };
}

import type {
  Course,
  LearnerContext,
  LearnerContextPurpose,
  LearnerContextRequest,
  LearnerContextResponse,
  LearnerDomain,
  LearnerInsight,
  LearnerPattern,
  LearnerRecommendationAction,
  LearningEvidence,
  StudentProgress,
} from "@lurexa/types";
import { getEducatorCourseAccessDecision } from "./educator-access.server";
import { getServerFirestore } from "./firebase-admin.server";
import {
  FirestoreLearnerInsightRepository,
  FirestoreLearningEvidenceRepository,
} from "./learner-firestore.server";

export type ScopedLearnerContext = LearnerContextResponse;

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

const allowedPurposesByProduct: Record<LearnerContextRequest["requestingProduct"], readonly LearnerContextPurpose[]> = {
  learn: ["learn_adaptive_practice", "teacher_instructional_support"],
  coach: ["coach_session_adaptation"],
  teach: [],
  admin: [],
  insight: [],
  studio: [],
};

function assertProductPurpose(request: LearnerContextRequest): void {
  if (!allowedPurposesByProduct[request.requestingProduct].includes(request.purpose)) {
    throw new Error("The requesting product is not authorized for this learner-context purpose.");
  }
}

async function readMembership(userId: string, organizationId: string): Promise<{ role?: string } | null> {
  const snapshot = await getServerFirestore()
    .collection("user-memberships")
    .doc(userId)
    .collection("organizations")
    .doc(organizationId)
    .get();
  return snapshot.exists ? snapshot.data() as { role?: string } : null;
}

async function readCourse(courseId: string): Promise<Course> {
  const snapshot = await getServerFirestore().collection("courses").doc(courseId).get();
  if (!snapshot.exists) throw new Error("The requested Learn course does not exist.");
  return { id: snapshot.id, ...snapshot.data() } as Course;
}

async function authorizeContextRead(input: { actorId: string; request: LearnerContextRequest }): Promise<void> {
  const { actorId, request } = input;
  if (actorId === request.learnerId) {
    if (request.organizationId && !await readMembership(request.learnerId, request.organizationId)) {
      throw new Error("The learner is not a member of the requested organization.");
    }
    return;
  }

  if (request.purpose !== "teacher_instructional_support" || request.requestingProduct !== "learn") {
    throw new Error("Delegated learner context is not authorized for this product and purpose.");
  }
  if (!request.organizationId || !request.courseId) {
    throw new Error("Delegated instructional support requires explicit organization and course boundaries.");
  }

  const [actorMembership, learnerMembership, course] = await Promise.all([
    readMembership(actorId, request.organizationId),
    readMembership(request.learnerId, request.organizationId),
    readCourse(request.courseId),
  ]);
  if (!actorMembership?.role || !["owner", "admin", "teacher"].includes(actorMembership.role)) {
    throw new Error("An educator organization membership is required for delegated instructional support.");
  }
  if (learnerMembership?.role !== "student") {
    throw new Error("The supported learner must be a student member of the requested organization.");
  }
  if (course.orgId !== request.organizationId) {
    throw new Error("The requested course does not belong to the authorized organization.");
  }

  const decision = await getEducatorCourseAccessDecision({ userId: actorId, course });
  if (!decision.allowed) {
    throw new Error(`Teacher instructional support requires qualification-linked authorization for this exact course (${decision.reason}).`);
  }
}

function latestInsight(insights: LearnerInsight[], kind: NonNullable<LearnerInsight["data"]>["kind"]): LearnerInsight | undefined {
  return insights
    .filter((insight) => insight.data?.kind === kind)
    .sort((first, second) => second.generatedAt.localeCompare(first.generatedAt))[0];
}

function pushUnique(target: string[], values: string[]): void {
  for (const value of values) if (!target.includes(value)) target.push(value);
}

function scopeEvidence(
  evidence: LearningEvidence[],
  organizationId: string | null,
  courseId?: string,
): LearningEvidence[] {
  return evidence.filter((entry) => {
    if (organizationId ? entry.organizationId !== organizationId : entry.organizationId) return false;
    if (courseId && entry.source.courseId !== courseId) return false;
    return true;
  });
}

function scopeInsights(
  insights: LearnerInsight[],
  organizationId: string | null,
  request: LearnerContextRequest,
): LearnerInsight[] {
  return insights.filter((entry) => {
    if (organizationId ? entry.organizationId !== organizationId : entry.organizationId) return false;
    const scoped = entry as LearnerInsight & { scope?: { purposes?: unknown; products?: unknown } };
    if (!scoped.scope) return true;
    return Array.isArray(scoped.scope.purposes)
      && scoped.scope.purposes.includes(request.purpose)
      && Array.isArray(scoped.scope.products)
      && scoped.scope.products.includes(request.requestingProduct);
  });
}

/**
 * Trusted Core read boundary for learner context. Self-service remains the
 * default. The only v1 delegated read is Lurexa Learn teacher instructional
 * support, explicitly organization- and course-scoped. A membership role is
 * affiliation, not sufficient authority: every delegated educator requires an
 * active qualification linked to a teaching authorization for the exact course.
 * Lurexa Teach has no delegated student-context entitlement.
 */
export async function getScopedLearnerContext(input: {
  actorId: string;
  request: LearnerContextRequest;
}): Promise<ScopedLearnerContext> {
  const { request } = input;
  assertProductPurpose(request);
  await authorizeContextRead(input);

  const domains = request.domains.filter((domain) => allowedDomains.includes(domain));
  const domainSet = new Set(domains);
  const database = getServerFirestore();
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  const insightRepository = new FirestoreLearnerInsightRepository();

  const [progressSnapshot, allEvidence, allInsights, profileSnapshot] = await Promise.all([
    database.collection("progress").where("studentId", "==", request.learnerId).get(),
    evidenceRepository.listByLearner(request.learnerId),
    insightRepository.listActiveByLearner(request.learnerId),
    database.collection("learner-profiles").doc(request.learnerId).get(),
  ]);

  const allProgress = progressSnapshot.docs
    .map((snapshot) => snapshot.data() as StudentProgress)
    .sort((first, second) => second.lastAccessedAt.localeCompare(first.lastAccessedAt));

  let activeOrganizationId: string | null = request.organizationId ?? null;
  let progress = allProgress;
  if (request.courseId) {
    progress = allProgress.filter((record) => record.courseId === request.courseId);
  } else if (request.organizationId) {
    const organizationCourses = await database.collection("courses").where("orgId", "==", request.organizationId).get();
    const courseIds = new Set(organizationCourses.docs.map((document) => document.id));
    progress = allProgress.filter((record) => courseIds.has(record.courseId));
  } else {
    const latestProgress = allProgress[0];
    const latestCourseSnapshot = latestProgress
      ? await database.collection("courses").doc(latestProgress.courseId).get()
      : null;
    activeOrganizationId = latestCourseSnapshot?.exists && typeof latestCourseSnapshot.data()?.orgId === "string"
      ? latestCourseSnapshot.data()!.orgId as string
      : null;
  }

  const latestProgress = progress[0];
  const delegatedTeacher = request.purpose === "teacher_instructional_support" && input.actorId !== request.learnerId;
  const evidence = scopeEvidence(allEvidence, activeOrganizationId, delegatedTeacher ? request.courseId : undefined);
  const insights = delegatedTeacher
    ? []
    : scopeInsights(allInsights, activeOrganizationId, request);
  const filteredInsights = insights.filter((insight) => domainSet.has(insight.domain));

  const profile = profileSnapshot.exists ? profileSnapshot.data() as { goals?: unknown } : null;
  const declaredGoals = Array.isArray(profile?.goals)
    ? profile.goals.filter((goal): goal is string => typeof goal === "string")
    : [];
  const goalInsight = latestInsight(filteredInsights, "goals");
  const goals = goalInsight?.data?.kind === "goals" ? goalInsight.data.goals : declaredGoals;

  const context: LearnerContext = {
    learnerId: request.learnerId,
    ...(activeOrganizationId ? { organizationId: activeOrganizationId } : {}),
    generatedAt: new Date().toISOString(),
  };

  if (domainSet.has("goal") && goals.length > 0 && !delegatedTeacher) context.goals = goals;

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
    purpose: request.purpose,
    context,
    evidenceSummary: {
      recentEvidenceTypes: [...new Set(recentEvidence.map((entry) => entry.type))].slice(0, 10),
      latestEvidenceAt: recentEvidence[0]?.observedAt ?? null,
    },
    limitations: [
      "Context is purpose-scoped and excludes raw learner responses.",
      request.organizationId
        ? "Organization-scoped intelligence is pinned to the explicitly authorized organization boundary."
        : "Organization-scoped intelligence follows the learner's most recently accessed Learn course and is not mixed across institutions implicitly.",
      delegatedTeacher
        ? "Delegated instructional support is pinned to the explicitly authorized course; broader organization-level derived insights are withheld until derived-insight provenance supports course scope."
        : "Self-service context follows the requesting learner's authorized product purpose.",
      "Proficiency is returned only when an active, evidence-backed CEFR insight exists.",
      "Recommendations are revisable next-step guidance, not mastery or proficiency determinations.",
      "Recent activity is evidence of participation, not a mastery determination.",
      "Legacy Learn evidence is normalized at the repository boundary until its producer is migrated.",
    ],
  };
}

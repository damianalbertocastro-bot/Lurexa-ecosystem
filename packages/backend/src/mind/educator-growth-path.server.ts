import type {
  EducatorBenefitEntitlementsV1,
  EducatorGrowthMilestoneV1,
  EducatorGrowthPathV1,
  EducatorLevel,
  EducatorQualificationScopeV1,
  EducatorSubject,
} from "@lurexa/types";

const levelOrder: EducatorLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export interface EducatorGrowthPathInputV1 {
  userId: string;
  qualifications: EducatorQualificationScopeV1[];
  benefits: EducatorBenefitEntitlementsV1;
  targetSubject?: EducatorSubject;
  targetLevel?: EducatorLevel | null;
}

function currentQualification(input: EducatorGrowthPathInputV1): EducatorQualificationScopeV1 | null {
  return [...input.qualifications]
    .filter((item) => item.status !== "revoked")
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))[0] ?? null;
}

function nextLevel(qualification: EducatorQualificationScopeV1 | null): EducatorLevel | null {
  if (!qualification?.levels.length) return "A1";
  const highest = qualification.levels.reduce((best, level) => levelOrder.indexOf(level) > levelOrder.indexOf(best) ? level : best, qualification.levels[0]);
  const index = levelOrder.indexOf(highest);
  return index >= 0 && index < levelOrder.length - 1 ? levelOrder[index + 1] : highest;
}

function milestones(qualification: EducatorQualificationScopeV1 | null, coachRecommended: boolean): EducatorGrowthMilestoneV1[] {
  const items: EducatorGrowthMilestoneV1[] = [];
  if (!qualification || qualification.status === "candidate" || qualification.status === "under_review") {
    items.push({ id: "qualification-evidence", title: "Build qualification evidence", focusArea: "instructional_practice", status: "next", product: "teach", rationale: "Complete professional evidence before a governed qualification decision." });
  }
  if (!qualification || qualification.methodologyCompetencyIds.length < 2) {
    items.push({ id: "methodology", title: "Strengthen Lurexa methodology", focusArea: "methodology", status: items.length ? "recommended" : "next", product: "teach", rationale: "Methodology evidence supports safe, consistent instructional decisions." });
  }
  if (!qualification || qualification.planningCompetencyIds.length < 2) {
    items.push({ id: "planning", title: "Deepen lesson-planning practice", focusArea: "lesson_planning", status: items.length ? "recommended" : "next", product: "teach", rationale: "Planning competence is part of the professional qualification scope." });
  }
  if (!qualification || qualification.assessmentCompetencyIds.length < 2) {
    items.push({ id: "assessment", title: "Develop assessment literacy", focusArea: "assessment", status: items.length ? "recommended" : "next", product: "teach", rationale: "Assessment literacy improves evidence quality and instructional response." });
  }
  if (coachRecommended) {
    items.push({ id: "coach-language", title: "Practice professional English in Coach", focusArea: "language_proficiency", status: items.length ? "recommended" : "next", product: "coach", rationale: "Coach can strengthen pronunciation, fluency, and language control without changing qualification status." });
  }
  if (qualification?.status === "qualified") {
    items.push({ id: "authorization", title: "Connect qualification to institutional authorization", focusArea: "institution_authorization", status: "recommended", product: "teach", rationale: "Qualification and institutional teaching authorization remain separate governance decisions." });
  }
  return items.slice(0, 5);
}

/**
 * Lurexa Mind interpretation only. This engine receives already-authorized
 * professional records from Core. It never reads Firestore, grants a
 * qualification, changes an entitlement, or authorizes student access.
 */
export function buildEducatorGrowthPath(input: EducatorGrowthPathInputV1): EducatorGrowthPathV1 {
  const qualification = currentQualification(input);
  const targetSubject = input.targetSubject ?? qualification?.subject ?? "english";
  const targetLevel = input.targetLevel ?? nextLevel(qualification);
  const languageLevel = qualification?.languageProficiencyLevel ?? null;
  const coachRecommended = targetSubject === "english" && (!languageLevel || (targetLevel ? levelOrder.indexOf(languageLevel) < levelOrder.indexOf(targetLevel) : false));
  const status = qualification?.status ?? "none";

  return {
    contractVersion: "1",
    userId: input.userId,
    generatedAt: new Date().toISOString(),
    qualificationStatus: status,
    targetSubject,
    targetLevel,
    headline: status === "qualified" ? "Extend your professional teaching scope" : status === "under_review" ? "Keep building while your evidence is reviewed" : "Build a trusted path to qualification",
    summary: status === "qualified"
      ? "Your current qualification is authoritative in Core. Mind can recommend the next professional-development steps, but cannot expand or renew that qualification."
      : "This path organizes professional learning and evidence. Qualification remains a governed Core decision after review.",
    coachRecommended,
    benefitEntitlements: input.benefits,
    milestones: milestones(qualification, coachRecommended),
    evidenceSummary: {
      qualificationEvidenceCount: qualification?.evidenceRefs.length ?? 0,
      methodologyCompetencyCount: qualification?.methodologyCompetencyIds.length ?? 0,
      planningCompetencyCount: qualification?.planningCompetencyIds.length ?? 0,
      assessmentCompetencyCount: qualification?.assessmentCompetencyIds.length ?? 0,
      practiceEvidenceCount: qualification?.practiceEvidenceRefs.length ?? 0,
    },
    privacyBoundary: "This growth path uses professional qualification/evidence metadata only. Student weaknesses, raw learner evidence, student transcripts, and student recommendations are excluded.",
  };
}

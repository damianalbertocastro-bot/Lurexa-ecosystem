export type EducatorProductEntitlement = "learn_teacher" | "teach" | "coach_full";
export type EducatorEntitlementStatus = "active" | "suspended" | "expired";
export type EducatorQualificationStatus = "candidate" | "under_review" | "qualified" | "suspended" | "expired" | "revoked";
export type EducatorAuthorizationStatus = "active" | "suspended" | "expired";
export type EducatorSubject = "english" | "math" | "science" | "other";
export type EducatorLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type EducatorGrowthFocusArea = "language_proficiency" | "methodology" | "lesson_planning" | "assessment" | "instructional_practice" | "institution_authorization";

export interface EducatorEntitlementV1 {
  contractVersion: "1";
  userId: string;
  product: EducatorProductEntitlement;
  status: EducatorEntitlementStatus;
  source: "direct" | "educator_benefit" | "institution" | "subscription";
  grantedAt: string;
  expiresAt?: string | null;
}

export interface EducatorQualificationScopeV1 {
  contractVersion: "1";
  id: string;
  userId: string;
  status: EducatorQualificationStatus;
  subject: EducatorSubject;
  levels: EducatorLevel[];
  methodologyCompetencyIds: string[];
  planningCompetencyIds: string[];
  assessmentCompetencyIds: string[];
  practiceEvidenceRefs: string[];
  languageProficiencyLevel?: EducatorLevel | null;
  evidenceRefs: string[];
  provenance: {
    method: "governed_rule" | "human_review" | "verified_credential";
    actorId?: string | null;
    policyVersion: string;
  };
  issuedAt: string;
  validUntil?: string | null;
}

export interface EducatorQualificationEventV1 {
  contractVersion: "1";
  id: string;
  qualificationId: string;
  userId: string;
  fromStatus: EducatorQualificationStatus | null;
  toStatus: EducatorQualificationStatus;
  actorId: string;
  reason: string;
  evidenceRefs: string[];
  policyVersion: string;
  occurredAt: string;
}

export interface EducatorQualificationCandidateInputV1 {
  userId: string;
  subject: EducatorSubject;
  levels: EducatorLevel[];
  methodologyCompetencyIds: string[];
  planningCompetencyIds: string[];
  assessmentCompetencyIds: string[];
  practiceEvidenceRefs: string[];
  languageProficiencyLevel?: EducatorLevel | null;
  evidenceRefs: string[];
  policyVersion: string;
}

export interface EducatorQualificationTransitionInputV1 {
  userId: string;
  qualificationId: string;
  toStatus: Exclude<EducatorQualificationStatus, "candidate">;
  reason: string;
  evidenceRefs?: string[];
  validUntil?: string | null;
}

export interface TeachingAuthorizationV1 {
  contractVersion: "1";
  id: string;
  userId: string;
  status: EducatorAuthorizationStatus;
  organizationId: string;
  courseIds: string[];
  subject: EducatorSubject;
  levels: EducatorLevel[];
  qualificationId: string;
  grantedBy: string;
  grantedAt: string;
  validUntil?: string | null;
}

export interface EducatorDevelopmentRecommendationV1 {
  contractVersion: "1";
  targetSubject: EducatorSubject;
  targetLevel?: EducatorLevel | null;
  product: "teach";
  coachRecommended: boolean;
  reason: "build_qualification" | "extend_level_scope" | "obtain_teaching_authorization";
  focusAreas: EducatorGrowthFocusArea[];
  note: string;
}

export interface EducatorGrowthMilestoneV1 {
  id: string;
  title: string;
  focusArea: EducatorGrowthFocusArea;
  status: "next" | "recommended" | "complete";
  product: "teach" | "coach";
  rationale: string;
}

export interface EducatorGrowthPathV1 {
  contractVersion: "1";
  userId: string;
  generatedAt: string;
  qualificationStatus: EducatorQualificationStatus | "none";
  targetSubject: EducatorSubject;
  targetLevel?: EducatorLevel | null;
  headline: string;
  summary: string;
  coachRecommended: boolean;
  benefitEntitlements: EducatorBenefitEntitlementsV1;
  milestones: EducatorGrowthMilestoneV1[];
  evidenceSummary: {
    qualificationEvidenceCount: number;
    methodologyCompetencyCount: number;
    planningCompetencyCount: number;
    assessmentCompetencyCount: number;
    practiceEvidenceCount: number;
  };
  privacyBoundary: string;
}

export interface EducatorAccessDecisionV1 {
  contractVersion: "1";
  userId: string;
  organizationId: string;
  courseId?: string | null;
  allowed: boolean;
  entitlement: {
    learnTeacher: boolean;
    teach: boolean;
    coachFull: boolean;
  };
  qualification: EducatorQualificationScopeV1 | null;
  authorization: TeachingAuthorizationV1 | null;
  reason:
    | "authorized"
    | "missing_learn_teacher_entitlement"
    | "missing_qualification"
    | "missing_teaching_authorization"
    | "qualification_scope_mismatch"
    | "authorization_scope_mismatch";
  developmentRecommendation?: EducatorDevelopmentRecommendationV1;
}

export interface EducatorBenefitEntitlementsV1 {
  contractVersion: "1";
  userId: string;
  teach: boolean;
  coachFull: boolean;
  source: "educator_benefit" | "explicit_entitlement" | "none";
}

export interface EducatorGovernanceCourseV1 {
  id: string;
  title: string;
  subject: EducatorSubject;
  level?: EducatorLevel | null;
}

export interface EducatorGovernancePersonV1 {
  userId: string;
  displayName: string | null;
  email: string | null;
  membershipRole: "owner" | "admin" | "teacher";
  entitlements: EducatorEntitlementV1[];
  qualifications: EducatorQualificationScopeV1[];
  authorizations: TeachingAuthorizationV1[];
}

export interface EducatorGovernanceSnapshotV1 {
  contractVersion: "1";
  organizationId: string;
  organizationName: string;
  courses: EducatorGovernanceCourseV1[];
  educators: EducatorGovernancePersonV1[];
  limitations: string[];
}

export interface TeachingAuthorizationGrantInputV1 {
  organizationId: string;
  userId: string;
  qualificationId: string;
  courseIds: string[];
  validUntil?: string | null;
}

export interface TeachingAuthorizationStatusUpdateV1 {
  organizationId: string;
  userId: string;
  authorizationId: string;
  status: "active" | "suspended";
}

export interface CourseEnrollmentV1 {
  contractVersion: "1";
  courseId: string;
  organizationId: string;
  learnerId: string;
  status: "active" | "withdrawn" | "completed";
  source: "invite" | "admin" | "migration";
  enrolledAt: string;
  updatedAt: string;
}

export interface CourseInstructionalIntelligenceV1 {
  contractVersion: "1";
  organizationId: string;
  courseId: string;
  generatedAt: string;
  enrollment: {
    total: number;
    participating: number;
    notStarted: number;
    active14d: number;
  };
  progress: {
    averagePercent: number | null;
    completedLearners: number;
  };
  focusSignals: Array<{
    knowledgeObjectId: string;
    label: string;
    learnerCount: number;
    signal: "watch" | "reinforce";
  }>;
  recommendation: string;
  privacyBoundary: string;
}

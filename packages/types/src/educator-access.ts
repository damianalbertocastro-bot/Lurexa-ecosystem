export type EducatorProductEntitlement = "learn_teacher" | "teach" | "coach_full";
export type EducatorEntitlementStatus = "active" | "suspended" | "expired";
export type EducatorQualificationStatus = "candidate" | "qualified" | "suspended" | "expired";
export type EducatorAuthorizationStatus = "active" | "suspended" | "expired";
export type EducatorSubject = "english" | "math" | "science" | "other";
export type EducatorLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

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
    | "governance_role"
    | "missing_learn_teacher_entitlement"
    | "missing_qualification"
    | "missing_teaching_authorization"
    | "qualification_scope_mismatch"
    | "authorization_scope_mismatch";
}

export interface EducatorBenefitEntitlementsV1 {
  contractVersion: "1";
  userId: string;
  teach: boolean;
  coachFull: boolean;
  source: "educator_benefit" | "explicit_entitlement" | "none";
}

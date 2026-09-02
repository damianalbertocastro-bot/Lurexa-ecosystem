export type TeachCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type TeachEvidenceStatus = "draft" | "submitted" | "verified" | "rejected";
export type TeachEvidenceReviewDecision = "verified" | "rejected";
export type TeachEnrollmentStatus = "active" | "completed" | "paused";
export type TeachRecommendationStatus = "active" | "dismissed" | "completed";
export type TeachAssessmentStatus = "requested" | "in_review" | "completed" | "cancelled";
export type TeachAssessmentDomain = "cefr" | "teaching-competency";

export interface EducatorCompetency {
  id: string;
  name: string;
  level: number;
  targetLevel?: number;
  updatedAt: string;
}

export interface VerifiedEducatorCompetency {
  id: string;
  name: string;
  level: number;
  assessorId: string;
  assessmentId: string;
  verifiedAt: string;
}

export type EducatorApprovalStatus = "pending_approval" | "approved" | "rejected";

export interface EducatorProfile {
  userId: string;
  displayName: string;
  status?: EducatorApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  headline?: string;
  cefrLevel?: TeachCefrLevel;
  verifiedCefrLevel?: TeachCefrLevel;
  targetCefrLevel?: TeachCefrLevel;
  teachingExperienceYears?: number;
  interests: string[];
  goals: string[];
  competencies: EducatorCompetency[];
  verifiedCompetencies?: VerifiedEducatorCompetency[];
  communityContributionScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeachCourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  competencyIds: string[];
  evidenceRequired?: boolean;
}

export interface TeachCourse {
  id: string;
  title: string;
  description: string;
  track: "english-proficiency" | "teaching-practice" | "assessment" | "ai-digital" | "course-design";
  cefrTarget?: TeachCefrLevel;
  competencyIds: string[];
  modules: TeachCourseModule[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeachEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: TeachEnrollmentStatus;
  completedModuleIds: string[];
  progressPercent: number;
  enrolledAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TeachCommunityPost {
  id: string;
  userId: string;
  authorName: string;
  circleId?: string;
  title: string;
  body: string;
  tags: string[];
  evidenceEligible?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeachEvidenceSubmission {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "artifact" | "reflection" | "practice" | "peer-contribution";
  competencyIds: string[];
  courseId?: string;
  moduleId?: string;
  resourceUrl?: string;
  status: TeachEvidenceStatus;
  reviewerId?: string;
  reviewerNote?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  verifiedAt?: string;
}

export interface TeachAssessmentRequest {
  id: string;
  userId: string;
  domains: TeachAssessmentDomain[];
  requestedCompetencyIds: string[];
  status: TeachAssessmentStatus;
  educatorNote?: string;
  requestedAt: string;
  updatedAt: string;
  assessorId?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface TeachAssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  assessorId: string;
  verifiedCefrLevel?: TeachCefrLevel;
  verifiedCompetencies: VerifiedEducatorCompetency[];
  summary: string;
  rubricVersion: string;
  completedAt: string;
}

export interface TeachCredentialRequirement {
  id: string;
  type: "course-completion" | "verified-evidence" | "competency-level" | "cefr-level";
  courseId?: string;
  competencyId?: string;
  minimumLevel?: number;
  cefrLevel?: TeachCefrLevel;
  minimumCount?: number;
}

export interface TeachCredentialDefinition {
  id: string;
  name: string;
  description: string;
  requirements: TeachCredentialRequirement[];
  active: boolean;
}

export interface TeachCredentialAward {
  id: string;
  credentialId: string;
  userId: string;
  awardedAt: string;
  awardedBy: string;
  evidenceIds: string[];
  verificationCode?: string;
}

export interface TeachPublicCredentialRecord {
  verificationCode: string;
  credentialId: string;
  credentialName: string;
  credentialDescription: string;
  educatorDisplayName: string;
  issuer: "Lurexa Learning Technologies";
  awardedAt: string;
  status: "valid" | "revoked";
}

export interface TeachRecommendation {
  id: string;
  userId: string;
  title: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
  priority: "low" | "medium" | "high";
  status: TeachRecommendationStatus;
  sourceEvidenceIds: string[];
  createdAt: string;
}

export interface TeachEvidenceReviewResult {
  evidence: TeachEvidenceSubmission;
  newlyAwardedCredentials: TeachCredentialAward[];
  recommendation: TeachRecommendation | null;
}

export interface TeachAssessmentReviewResult {
  assessment: TeachAssessmentRequest;
  result: TeachAssessmentResult;
  newlyAwardedCredentials: TeachCredentialAward[];
  recommendation: TeachRecommendation | null;
}

export type TeachCompetencyLevel = "T1" | "T2" | "T3" | "T4" | "T5";

export interface T1LessonPlanStage {
  stage: "warmup" | "presentation" | "guided_practice" | "independent_practice" | "assessment_closure";
  allocatedMinutes: number;
  teacherActions: string;
  studentActions: string;
  formativeCheckStrategy: string;
}

export interface T1CompetencyMatrix {
  lessonStructure: {
    warmUpPresence: boolean;
    explicitObjectiveStated: boolean;
    guidedPracticeIncluded: boolean;
    independentProductionIncluded: boolean;
    closurePresent: boolean;
  };
  objectiveAlignment: {
    bloomTaxonomyLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
    cefrTargetLevel: TeachCefrLevel;
    measurableOutcomeDefined: boolean;
  };
  formativeChecks: {
    checkFrequencyPerLesson: number;
    feedbackStrategy: "immediate_corrective" | "delayed_peer" | "self_reflection";
    scaffoldingNotesProvided: boolean;
  };
  instructionalPacing: {
    totalDurationMinutes: number;
    teacherTalkTimeRatio: number;
    studentPracticeRatio: number;
  };
}

export interface T1CapstoneSubmission {
  id: string;
  educatorId: string;
  moduleCode: "T1_COHERENT_LESSON";
  title: string;
  targetCefr: TeachCefrLevel;
  lessonPlanArtifact: T1LessonPlanStage[];
  reflectiveRationale: {
    whyThisObjective: string;
    howL1TransferIsAddressed: string;
    differentiationStrategy: string;
  };
  recordedMicroTeachingUrl?: string;
  status: TeachEvidenceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface T1EvaluationDimension {
  score: number;
  maxScore: number;
  feedback: string;
}

export interface T1EvaluationRubric {
  rubricId: "T1_RUBRIC_V1";
  dimensionScores: {
    coherenceAndStructure: T1EvaluationDimension;
    objectiveMeasurability: T1EvaluationDimension;
    studentCenteredPacing: T1EvaluationDimension;
    formativeFeedbackScaffolding: T1EvaluationDimension;
  };
  totalScore: number;
  passed: boolean;
  recommendationsForT2: string[];
  evaluatedAt: string;
  evaluatorType: "mind_automated" | "peer_mentor" | "master_trainer";
}


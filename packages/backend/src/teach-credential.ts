import type {
  EducatorProfile,
  TeachCredentialDefinition,
  TeachEnrollment,
  TeachEvidenceSubmission,
} from "@lurexa/types";

const cefrRank = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;

export function evaluateTeachCredential(
  definition: TeachCredentialDefinition,
  profile: EducatorProfile | null,
  enrollments: TeachEnrollment[],
  evidence: TeachEvidenceSubmission[],
) {
  const requirementResults = definition.requirements.map((requirement) => {
    if (requirement.type === "course-completion") {
      const met = enrollments.some((item) => item.courseId === requirement.courseId && item.status === "completed");
      return { requirementId: requirement.id, met };
    }

    if (requirement.type === "verified-evidence") {
      const verified = evidence.filter((item) =>
        item.status === "verified"
        && (!requirement.competencyId || item.competencyIds.includes(requirement.competencyId)),
      );
      return { requirementId: requirement.id, met: verified.length >= (requirement.minimumCount ?? 1) };
    }

    if (requirement.type === "competency-level") {
      const competency = profile?.competencies.find((item) => item.id === requirement.competencyId);
      return { requirementId: requirement.id, met: (competency?.level ?? 0) >= (requirement.minimumLevel ?? 1) };
    }

    if (requirement.type === "cefr-level") {
      const current = profile?.cefrLevel ? cefrRank[profile.cefrLevel] : 0;
      const target = requirement.cefrLevel ? cefrRank[requirement.cefrLevel] : 0;
      return { requirementId: requirement.id, met: current >= target };
    }

    return { requirementId: requirement.id, met: false };
  });

  return {
    eligible: requirementResults.every((item) => item.met),
    requirements: requirementResults,
  };
}

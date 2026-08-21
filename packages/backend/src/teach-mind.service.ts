import type { EducatorProfile, TeachEnrollment, TeachEvidenceSubmission, TeachRecommendation } from "@lurexa/types";

function recommendation(userId: string, title: string, rationale: string, actionLabel: string, actionHref: string, priority: TeachRecommendation["priority"] = "medium", sourceEvidenceIds: string[] = []): TeachRecommendation {
  return { id: `teach-mvp-${userId}`, userId, title, rationale, actionLabel, actionHref, priority, status: "active", sourceEvidenceIds, createdAt: new Date().toISOString() };
}

export const TeachMindService = {
  recommendNextStep(profile: EducatorProfile, enrollments: TeachEnrollment[], evidence: TeachEvidenceSubmission[]): TeachRecommendation {
    if (!profile.cefrLevel) {
      return recommendation(profile.userId, "Set your current English level.", "A known starting point helps Teach avoid generic proficiency recommendations.", "Set English level", "/profile", "high");
    }
    if (!profile.goals.length) {
      return recommendation(profile.userId, "Define one professional goal.", "An explicit goal gives Teach a clearer basis for prioritizing learning and practice.", "Add professional goal", "/profile", "high");
    }
    const active = enrollments.find((item) => item.status === "active");
    if (active && active.progressPercent < 100) {
      return recommendation(profile.userId, "Continue your active professional learning path.", `You are ${active.progressPercent}% through the current course. Continuing it preserves learning momentum.`, "Continue course", `/courses/${active.courseId}`, active.progressPercent >= 70 ? "high" : "medium");
    }
    const submitted = evidence.filter((item) => item.status === "submitted");
    if (submitted.length) {
      return recommendation(profile.userId, "Keep developing while submitted evidence is reviewed.", `${submitted.length} evidence item${submitted.length === 1 ? " is" : "s are"} awaiting review.`, "Browse related learning", "/courses", "medium", submitted.map((item) => item.id));
    }
    if (!evidence.length) {
      return recommendation(profile.userId, "Create your first professional evidence item.", "Practice evidence makes professional-growth recommendations more meaningful than profile claims alone.", "Submit evidence", "/growth", "high");
    }
    return recommendation(profile.userId, "Turn your next learning cycle into evidence and peer exchange.", "Your profile already contains professional evidence, so structured peer feedback is a useful next step.", "Join the community", "/community", "medium", evidence.filter((item) => item.status === "verified").slice(0, 3).map((item) => item.id));
  },
};

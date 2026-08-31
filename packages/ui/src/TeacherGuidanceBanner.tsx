import React from "react";

export type TeacherReviewStatus =
  | "pending_review"
  | "reviewed_approved"
  | "needs_revision"
  | "remediation_assigned"
  | "exemplary";

export interface TeacherFeedbackItem {
  id: string;
  domain: string;
  feedbackText: string;
  audioFeedbackUrl?: string;
  strength: boolean;
}

export interface ReturnLoopAction {
  id: string;
  title: string;
  instruction: string;
  targetCompetencyIds?: string[];
}

export interface TeacherGuidanceData {
  reviewId: string;
  status: TeacherReviewStatus;
  reviewedAt: string;
  generalNotes?: string;
  feedbackItems?: TeacherFeedbackItem[];
  returnLoopActions?: ReturnLoopAction[];
}

export interface TeacherGuidanceBannerProps {
  guidance: TeacherGuidanceData;
  onActionClick?: (action: ReturnLoopAction) => void;
  className?: string;
}

function statusBadge(status: TeacherReviewStatus): { text: string; bg: string; textCol: string } {
  switch (status) {
    case "exemplary":
      return { text: "Exemplary Work", bg: "bg-emerald-100", textCol: "text-emerald-800" };
    case "reviewed_approved":
      return { text: "Reviewed & Approved", bg: "bg-blue-100", textCol: "text-blue-800" };
    case "remediation_assigned":
      return { text: "Follow-up Practice", bg: "bg-amber-100", textCol: "text-amber-800" };
    case "needs_revision":
      return { text: "Revision Suggested", bg: "bg-orange-100", textCol: "text-orange-800" };
    case "pending_review":
    default:
      return { text: "Pending Review", bg: "bg-[var(--lx-canvas)]", textCol: "text-[var(--lx-ink)]" };
  }
}

export const TeacherGuidanceBanner: React.FC<TeacherGuidanceBannerProps> = ({
  guidance,
  onActionClick,
  className = "",
}) => {
  const badge = statusBadge(guidance.status);

  return (
    <section
      aria-label="Teacher Guidance and Feedback"
      className={`rounded-2xl border border-[var(--color-border-default)] bg-gradient-to-br from-white to-[var(--color-background-secondary)] p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-primary)] font-semibold text-white">
            🎓
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">Teacher Guidance & Feedback</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Reviewed on {new Date(guidance.reviewedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.bg} ${badge.textCol}`}
        >
          {badge.text}
        </span>
      </div>

      {guidance.generalNotes && (
        <div className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <p className="font-medium text-[var(--color-text-primary)] mb-1">Teacher Notes:</p>
          <p className="italic bg-white/80 rounded-xl p-3 border border-[var(--color-border-default)]">{guidance.generalNotes}</p>
        </div>
      )}

      {guidance.feedbackItems && guidance.feedbackItems.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Targeted Observations</h4>
          <ul className="space-y-2">
            {guidance.feedbackItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed ${
                  item.strength
                    ? "border-emerald-200/60 bg-emerald-50/60 text-emerald-950"
                    : "border-amber-200/60 bg-amber-50/60 text-amber-950"
                }`}
              >
                <span className="mt-0.5 text-sm">{item.strength ? "✨" : "🎯"}</span>
                <div className="flex-1">
                  <span className="font-semibold">{item.domain.toUpperCase()}: </span>
                  {item.feedbackText}
                  {item.audioFeedbackUrl && (
                    <div className="mt-2">
                      <audio controls src={item.audioFeedbackUrl} className="h-8 w-full max-w-xs" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {guidance.returnLoopActions && guidance.returnLoopActions.length > 0 && (
        <div className="mt-5 border-t border-[var(--color-border-default)] pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">Recommended Return Loop Tasks</h4>
          <div className="mt-2.5 space-y-2">
            {guidance.returnLoopActions.map((action) => (
              <div
                key={action.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--lx-surface)] p-3.5 shadow-sm"
              >
                <div>
                  <h5 className="text-sm font-bold text-[var(--color-text-primary)]">{action.title}</h5>
                  <p className="text-xs text-[var(--color-text-secondary)]">{action.instruction}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onActionClick?.(action)}
                  className="shrink-0 inline-flex items-center justify-center rounded-xl bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand-secondary)] active:scale-[0.98]"
                >
                  Start Practice →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

"use client";

import { useEffect, useMemo, useState } from "react";
import { TeachMindService, TeachService } from "@lurexa/backend";
import type { TeachEnrollment, TeachEvidenceSubmission, TeachRecommendation } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";
import { Button } from "@lurexa/ui/button";
import { WelcomeTourModal, type WelcomeTourStep } from "@lurexa/ui/WelcomeTourModal";

const TEACH_TOUR_STEPS: WelcomeTourStep[] = [
  {
    title: "Welcome to Lurexa Teach",
    badge: "Educator Growth",
    icon: "🎓",
    description:
      "Teach is your independent workspace for professional CEFR English advancement, classroom pedagogy, micro-credentials, and educator community.",
    tip: "One educator profile connects your verified English proficiency and pedagogical evidence across your entire career.",
  },
  {
    title: "Classroom Diagnostic Assessment (T-PDA)",
    badge: "Oral Diagnostic",
    icon: "🎙️",
    description:
      "Verify your English proficiency across authentic teaching tasks—including activity staging, formative recasting, and phonological intelligibility rationale.",
    tip: "Complete the diagnostic assessment to establish your starting CEFR benchmark (B1–C2).",
  },
  {
    title: "Verified Credentials (T1–T5)",
    badge: "Professional Proof",
    icon: "🏅",
    description:
      "Earn tiered credentials recognizing foundational English instruction, pronunciation pedagogy, and communicative leadership.",
    tip: "Credential awards generate verifiable digital certificates accessible to academic institutions.",
  },
  {
    title: "Evidence-Informed Next Steps",
    badge: "Lurexa Mind",
    icon: "🧠",
    description:
      "Lurexa Mind analyzes your learning submissions, student insights, and teaching goals to recommend high-impact professional development modules.",
    tip: "Follow the 'Next Best Step' guidance on your dashboard to target high-leverage teaching skills.",
  },
  {
    title: "Educator Community & Collaboration",
    badge: "Peer Exchange",
    icon: "🤝",
    description:
      "Collaborate with fellow educators, share lesson adaptations for Dominican and Hispanic learners, and participate in teaching challenges.",
    tip: "You're all set! Explore available professional courses or launch your oral diagnostic.",
  },
];

const TEACH_TOUR_STORAGE_KEY = "lurexa_teach_tour_seen";

export default function DashboardPage() {
  const { user, profile } = useTeachAuth();
  const [enrollments, setEnrollments] = useState<TeachEnrollment[]>([]);
  const [evidence, setEvidence] = useState<TeachEvidenceSubmission[]>([]);
  const [recommendations, setRecommendations] = useState<TeachRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    try {
      const hasSeenTour = localStorage.getItem(TEACH_TOUR_STORAGE_KEY);
      if (!hasSeenTour) {
        setIsTourOpen(true);
      }
    } catch {
      // Ignore localStorage errors
    }

    (async () => {
      try {
        const [nextEnrollments, nextEvidence, nextRecommendations] = await Promise.all([
          TeachService.listEnrollments(user.uid),
          TeachService.listEvidence(user.uid),
          TeachService.listRecommendations(user.uid).catch(() => []),
        ]);
        setEnrollments(nextEnrollments);
        setEvidence(nextEvidence);
        setRecommendations(nextRecommendations);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const activeEnrollment = useMemo(() => enrollments.find((item) => item.status === "active") ?? enrollments[0], [enrollments]);
  const verifiedEvidence = evidence.filter((item) => item.status === "verified").length;
  const submittedEvidence = evidence.filter((item) => item.status === "submitted").length;
  const englishLabel = profile?.cefrLevel ?? "Set level";
  const target = profile?.targetCefrLevel ? `Target ${profile.targetCefrLevel}` : "Choose a target level";
  const mind = useMemo(() => recommendations[0] ?? (profile ? TeachMindService.recommendNextStep(profile, enrollments, evidence) : null), [recommendations, profile, enrollments, evidence]);

  return (
    <TeachShell active="Dashboard">
      <TeachPrivate>
        <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-extrabold tracking-[.18em] text-[var(--lx-primary)]">
                  MY PROFESSIONAL GROWTH
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsTourOpen(true)}
                  className="rounded-full border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-0.5 text-[11px] font-bold text-[var(--lx-primary)] hover:bg-[var(--lx-canvas)]"
                >
                  ✦ Welcome Tour
                </Button>
              </div>
              <h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl">
                Welcome back, {profile?.displayName || "educator"}.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--lx-muted)]">
                Your learning, evidence, credentials, and community activity now persist in one educator profile.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/assessment/diagnostic"
                className="inline-flex min-h-12 items-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-5 text-sm font-extrabold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)]"
              >
                🎙️ Oral Diagnostic (T-PDA)
              </a>
              <a
                href="/courses"
                className="inline-flex min-h-12 items-center rounded-xl bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] px-5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
              >
                Continue learning →
              </a>
            </div>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["English level", englishLabel, target],
              ["Active learning", activeEnrollment ? `${activeEnrollment.progressPercent}%` : "Not enrolled", activeEnrollment ? "Current course progress" : "Choose a professional course"],
              ["Evidence", String(evidence.length), `${verifiedEvidence} verified · ${submittedEvidence} awaiting review`],
              ["Community", String(profile?.communityContributionScore ?? 0), "Contribution score"],
            ].map(([label, value, detail], i) => (
              <article
                key={label}
                className="rounded-[24px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)]"
              >
                <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--lx-muted)]">{label}</p>
                <b className="mt-3 block text-3xl tracking-[-.05em]">{loading ? "—" : value}</b>
                <p className="mt-2 text-sm font-bold text-[var(--lx-muted)]">{detail}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">CURRENT PATH</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-.04em]">
                {activeEnrollment ? "Your current professional learning path" : "Start a professional learning path"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--lx-muted)]">
                Teach connects course progress to evidence and the persistent educator profile rather than treating completion as the final outcome.
              </p>
              <div className="mt-7 h-3 overflow-hidden rounded-full bg-[var(--lx-canvas)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--lx-primary)] via-[var(--lx-secondary)] to-[var(--lx-accent)]"
                  style={{ width: `${activeEnrollment?.progressPercent ?? 0}%` }}
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                <b>{activeEnrollment ? `${activeEnrollment.progressPercent}% complete` : "No active enrollment"}</b>
                <a href="/courses" className="font-extrabold text-[var(--lx-secondary)]">Browse learning →</a>
              </div>
            </article>

            <article className="rounded-[28px] bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--lx-secondary)] p-7 text-white shadow-xl">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-accent)]">LUREXA MIND · NEXT BEST STEP</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-.04em]">
                {mind?.title ?? "Build enough evidence for a personalized next step."}
              </h2>
              <p className="mt-4 text-sm leading-6 text-indigo-100">
                {mind?.rationale ?? "As you complete learning, submit evidence, and set goals, Lurexa Mind can recommend the next highest-value action."}
              </p>
              <a
                href={mind?.actionHref ?? "/growth"}
                className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-extrabold text-[var(--color-brand-navy)] shadow-md hover:bg-slate-100"
              >
                {mind?.actionLabel ?? "Update growth profile"} →
              </a>
              {recommendations.length === 0 && mind && (
                <p className="mt-3 text-[11px] font-bold text-indigo-200">
                  MVP recommendation generated from current authorized Teach state.
                </p>
              )}
            </article>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-[var(--lx-card-shadow)]">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">EVIDENCE PIPELINE</p>
              <h2 className="mt-2 text-2xl font-black">Professional growth with proof.</h2>
              {evidence.length ? (
                evidence.slice(0, 3).map((item) => (
                  <div key={item.id} className="mt-5 border-t border-[var(--lx-border)] pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <b>{item.title}</b>
                        <p className="mt-1 text-xs text-[var(--lx-muted)]">{item.type.replaceAll("-", " ")}</p>
                      </div>
                      <span className="rounded-full bg-[var(--lx-canvas)] border border-[var(--lx-border)] px-3 py-1.5 text-xs font-extrabold capitalize text-[var(--lx-primary)]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="mt-5 rounded-2xl bg-[var(--lx-canvas)] p-5 text-sm leading-6 text-[var(--lx-muted)]">
                  No evidence yet. Submit a classroom artifact, reflection, practice simulation, or eligible peer contribution from your growth profile.
                </p>
              )}
              <a href="/growth" className="mt-5 inline-flex min-h-11 items-center text-sm font-extrabold text-[var(--lx-secondary)]">
                Manage evidence →
              </a>
            </article>

            <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-[var(--lx-card-shadow)]">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">COMMUNITY & GROWTH</p>
              <h2 className="mt-2 text-2xl font-black">Professional learning includes contribution.</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--lx-muted)]">
                Join topic-focused circles, exchange classroom evidence, and build a professional record that can support selected competency requirements.
              </p>
              <a href="/community" className="mt-5 inline-flex min-h-11 items-center text-sm font-extrabold text-[var(--lx-secondary)]">
                Go to community →
              </a>
            </article>
          </section>
        </main>

        <WelcomeTourModal
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          storageKey={TEACH_TOUR_STORAGE_KEY}
          productName="Lurexa Teach"
          steps={TEACH_TOUR_STEPS}
        />
      </TeachPrivate>
    </TeachShell>
  );
}

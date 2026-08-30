import React from "react";
import { TeachShell } from "../../components/TeachShell";

export default function T1CoherentLessonPage() {
  return (
    <TeachShell active="Learn">
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8">
        <a href="/courses" className="text-sm font-extrabold text-[var(--lx-secondary)]">
          ← Back to learning
        </a>
        <section className="mt-6 grid gap-7 lg:grid-cols-[1fr_.38fr]">
          <div className="rounded-[30px] border border-[var(--lx-surface)] bg-white p-7 sm:p-9 shadow-sm">
            <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">
              TEACH T1 PATHWAY · FOUNDATIONAL PEDAGOGY
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl">
              The First Coherent Lesson (T1)
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--lx-muted)]">
              Master lesson coherence, structured objective alignment, balanced Teacher Talk Time (TTT), formative checking, and proactive Dominican Spanish (L1) transfer scaffolding.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "T1 Capstone",
                "5 Lesson Plan Stages",
                "TTT ≤ 35% Pacing",
                "L1 Scaffolding",
                "Mind Verified",
              ].map((x) => (
                <span
                  key={x}
                  className="rounded-full bg-[var(--lx-surface)] px-3 py-2 text-xs font-extrabold text-[var(--lx-primary)]"
                >
                  {x}
                </span>
              ))}
            </div>
            <div className="mt-9 h-3 overflow-hidden rounded-full bg-[var(--lx-surface)]">
              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-accent)]" />
            </div>
            <p className="mt-2 text-xs font-bold text-[var(--lx-muted)]">
              85% complete · Next: Final T1 Capstone Artifact Submission & Rubric Review
            </p>
          </div>

          <aside className="rounded-[30px] bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--lx-secondary)] p-7 text-white shadow-lg">
            <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-accent)]">
              CAPSTONE STATUS
            </p>
            <h2 className="mt-3 text-2xl font-black">Ready for Mind Review</h2>
            <p className="mt-3 text-sm leading-6 text-indigo-100">
              Submit your 5-stage lesson plan artifact and 3-point reflective rationale.
            </p>
            <a
              href="/growth"
              className="mt-7 block text-center min-h-12 w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[var(--color-brand-navy)] hover:bg-indigo-50 transition"
            >
              Review Rubric & Submit →
            </a>
          </aside>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_.55fr]">
          <article className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-7 shadow-sm">
            <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">
              T1 COMPETENCY BLUEPRINT
            </p>
            {[
              ["01", "Observable Lesson Objectives & CEFR Alignment", "Complete"],
              ["02", "Five-Stage Structure: Warm-up to Closure", "Complete"],
              ["03", "Instructional Pacing: STT ≥ 65% Target", "Complete"],
              ["04", "Formative Checking & Immediate Feedback", "Complete"],
              ["05", "Dominican Spanish (L1) Phonological Scaffolding", "Current"],
              ["06", "T1 Capstone: The First Coherent Lesson Defense", "Next"],
            ].map(([n, t, s]) => (
              <div
                key={n}
                className="mt-5 flex items-center gap-4 border-t border-[var(--lx-surface)] pt-5"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-black ${
                    s === "Current"
                      ? "bg-[var(--lx-primary)] text-white"
                      : s === "Complete"
                      ? "bg-[var(--lx-surface)] text-[var(--lx-success)]"
                      : "bg-[var(--lx-surface)] text-[var(--lx-muted)]"
                  }`}
                >
                  {n}
                </span>
                <div className="flex-1">
                  <b className="text-[var(--color-brand-navy)]">{t}</b>
                  <p className="mt-1 text-xs font-bold text-[var(--lx-muted)]">{s}</p>
                </div>
              </div>
            ))}
          </article>

          <aside className="space-y-5">
            <article className="rounded-[28px] border border-[var(--lx-surface)] bg-[var(--lx-warning)] p-7 shadow-sm">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-warning)]">
                EVALUATION CRITERIA
              </p>
              <h2 className="mt-3 text-xl font-black text-[var(--color-brand-navy)]">
                T1 Evaluation Rubric (Max 100)
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-[var(--lx-muted)]">
                <li>• Coherence & Stage Sequence: 25 pts</li>
                <li>• Measurable Objective Alignment: 25 pts</li>
                <li>• Student Practice Ratio (≥65%): 25 pts</li>
                <li>• L1 Scaffolding & Formative Checks: 25 pts</li>
              </ul>
              <p className="mt-3 text-xs font-bold text-[var(--lx-warning)]">
                Passing threshold: 80/100 points
              </p>
            </article>

            <article className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-7 shadow-sm">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">
                COMMUNITY & PEER REVIEW
              </p>
              <h2 className="mt-3 text-xl font-black text-[var(--color-brand-navy)]">
                Collaborate with 140+ Educators
              </h2>
              <p className="mt-2 text-sm text-[var(--lx-muted)]">
                Exchange micro-teaching feedback and lesson structure ideas in the community circle.
              </p>
              <a
                href="/community"
                className="mt-4 inline-flex min-h-11 items-center text-sm font-extrabold text-[var(--lx-secondary)]"
              >
                Join T1 Educator Circle →
              </a>
            </article>
          </aside>
        </section>
      </main>
    </TeachShell>
  );
}

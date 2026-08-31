"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { EducatorGrowthPathV1 } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";
import { getEcosystemUrl } from "@lurexa/config/domains";

const coachEducatorUrl = getEcosystemUrl("coach", "/educator");

export default function GrowthPlanPage() {
  const { user } = useTeachAuth();
  const [path, setPath] = useState<EducatorGrowthPathV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void user.getIdToken().then(async (token) => {
      const response = await fetch("/api/teach/growth-path", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(typeof body === "object" && body !== null && typeof (body as { error?: unknown }).error === "string" ? String((body as { error: string }).error) : "Unable to load your growth plan.");
      if (!cancelled) setPath(body as EducatorGrowthPathV1);
    }).catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : "Unable to load your growth plan."); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  return <TeachShell active="Growth Plan"><TeachPrivate><main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
    <section className="rounded-[32px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--lx-primary)] to-[var(--lx-secondary)] p-7 text-white shadow-xl sm:p-10">
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-200">MIND-GUIDED PROFESSIONAL GROWTH</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Your development path is yours—not your students&apos; profile.</h1>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-violet-100">Lurexa Mind interprets only your authorized professional qualification and evidence metadata here. Core remains authoritative for qualification, entitlement, and teaching authorization.</p>
    </section>

    {loading ? <div role="status" className="mt-7 rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 text-sm font-bold text-[var(--lx-muted)]">Building your professional path…</div> : null}
    {error ? <div role="alert" className="mt-7 rounded-3xl border border-rose-200 bg-rose-50 p-7 text-sm font-bold text-rose-800">{error}</div> : null}

    {path ? <>
      <section className="mt-7 grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[var(--lx-muted)]">Qualification</p><b className="mt-3 block text-2xl capitalize text-[var(--color-brand-navy)]">{path.qualificationStatus.replaceAll("_", " ")}</b><p className="mt-2 text-xs leading-5 text-[var(--lx-muted)]">Core-owned professional status</p></article>
        <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[var(--lx-muted)]">Teach access</p><b className="mt-3 block text-2xl text-[var(--color-brand-navy)]">{path.benefitEntitlements.teach ? "Included" : "Standard access"}</b><p className="mt-2 text-xs leading-5 text-[var(--lx-muted)]">Source: {path.benefitEntitlements.source.replaceAll("_", " ")}</p></article>
        <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[var(--lx-muted)]">Coach benefit</p><b className="mt-3 block text-2xl text-[var(--color-brand-navy)]">{path.benefitEntitlements.coachFull ? "Full educator benefit" : path.coachRecommended ? "Recommended" : "Optional"}</b><p className="mt-2 text-xs leading-5 text-[var(--lx-muted)]">Professional English practice when useful</p></article>
      </section>

      <section className="mt-7 rounded-[30px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 sm:p-8"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[var(--lx-primary)]">YOUR NEXT PATH</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-[var(--color-brand-navy)]">{path.headline}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--lx-muted)]">{path.summary}</p><div className="mt-6 space-y-3">{path.milestones.map((milestone, index) => <article key={milestone.id} className="flex gap-4 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-5"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--lx-surface)] text-sm font-black text-[var(--lx-primary)]">{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-[var(--color-brand-navy)]">{milestone.title}</b><span className="rounded-full bg-[var(--lx-surface)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.1em] text-[var(--lx-primary)]">{milestone.product}</span></div><p className="mt-1 text-xs leading-5 text-[var(--lx-muted)]">{milestone.rationale}</p>{milestone.product === "coach" ? <a href={coachEducatorUrl} rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center rounded-xl bg-[var(--lx-primary)] px-4 text-xs font-black text-white hover:opacity-90">Practice in Coach ↗</a> : <Link href="/courses" className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 text-xs font-black text-[var(--lx-secondary)]">Open professional learning →</Link>}</div></article>)}</div></section>

      <aside className="mt-7 rounded-2xl border border-violet-100 bg-violet-50 p-5 text-xs leading-6 text-violet-900"><b>Privacy boundary:</b> {path.privacyBoundary}</aside>
    </> : null}
  </main></TeachPrivate></TeachShell>;
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { EducatorGrowthPathV1 } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

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
    <section className="rounded-[32px] bg-gradient-to-br from-[#22105c] via-[#4d22a8] to-[#315fd7] p-7 text-white shadow-xl sm:p-10">
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-200">MIND-GUIDED PROFESSIONAL GROWTH</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Your development path is yours—not your students&apos; profile.</h1>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-violet-100">Lurexa Mind interprets only your authorized professional qualification and evidence metadata here. Core remains authoritative for qualification, entitlement, and teaching authorization.</p>
    </section>

    {loading ? <div role="status" className="mt-7 rounded-3xl border border-[#dfe6f8] bg-white p-7 text-sm font-bold text-[#6677a5]">Building your professional path…</div> : null}
    {error ? <div role="alert" className="mt-7 rounded-3xl border border-rose-200 bg-rose-50 p-7 text-sm font-bold text-rose-800">{error}</div> : null}

    {path ? <>
      <section className="mt-7 grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-[#dfe6f8] bg-white p-6"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#7180a8]">Qualification</p><b className="mt-3 block text-2xl capitalize text-[#071d67]">{path.qualificationStatus.replaceAll("_", " ")}</b><p className="mt-2 text-xs leading-5 text-[#6677a5]">Core-owned professional status</p></article>
        <article className="rounded-3xl border border-[#dfe6f8] bg-white p-6"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#7180a8]">Teach access</p><b className="mt-3 block text-2xl text-[#071d67]">{path.benefitEntitlements.teach ? "Included" : "Standard access"}</b><p className="mt-2 text-xs leading-5 text-[#6677a5]">Source: {path.benefitEntitlements.source.replaceAll("_", " ")}</p></article>
        <article className="rounded-3xl border border-[#dfe6f8] bg-white p-6"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#7180a8]">Coach benefit</p><b className="mt-3 block text-2xl text-[#071d67]">{path.benefitEntitlements.coachFull ? "Full educator benefit" : path.coachRecommended ? "Recommended" : "Optional"}</b><p className="mt-2 text-xs leading-5 text-[#6677a5]">Professional English practice when useful</p></article>
      </section>

      <section className="mt-7 rounded-[30px] border border-[#dfe6f8] bg-white p-7 sm:p-8"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#6b2bd9]">YOUR NEXT PATH</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-[#071d67]">{path.headline}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#6677a5]">{path.summary}</p><div className="mt-6 space-y-3">{path.milestones.map((milestone, index) => <article key={milestone.id} className="flex gap-4 rounded-2xl border border-[#e2e7f7] bg-[#fafbff] p-5"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eee9ff] text-sm font-black text-[#592bd6]">{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-[#071d67]">{milestone.title}</b><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[.1em] text-[#6b2bd9]">{milestone.product}</span></div><p className="mt-1 text-xs leading-5 text-[#6677a5]">{milestone.rationale}</p>{milestone.product === "coach" ? <Link href="/coach?mode=educator" className="mt-3 inline-flex min-h-10 items-center rounded-xl bg-[#071d67] px-4 text-xs font-black text-white">Practice in Coach →</Link> : <Link href="/courses" className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-[#d6def4] bg-white px-4 text-xs font-black text-[#315fd7]">Open professional learning →</Link>}</div></article>)}</div></section>

      <aside className="mt-7 rounded-2xl border border-violet-100 bg-violet-50 p-5 text-xs leading-6 text-violet-900"><b>Privacy boundary:</b> {path.privacyBoundary}</aside>
    </> : null}
  </main></TeachPrivate></TeachShell>;
}

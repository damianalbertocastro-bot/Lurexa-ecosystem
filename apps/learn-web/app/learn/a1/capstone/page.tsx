"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthService } from "@lurexa/backend";
import type { CapstoneAssessmentResult, IntegratedCapstoneDefinition } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type Payload = {
  definition: IntegratedCapstoneDefinition;
  result: CapstoneAssessmentResult;
};

function decisionLabel(decision: CapstoneAssessmentResult["decision"]): string {
  switch (decision) {
    case "READY": return "Ready for A2 progression";
    case "READY_WITH_TARGETS": return "Ready with continued A1 targets";
    case "TARGETED_REVALIDATION": return "Targeted revalidation needed";
    case "MORE_EVIDENCE_NEEDED": return "More evidence needed";
    case "NOT_YET_READY": return "Not yet ready for an A1 exit decision";
  }
}

function readError(value: unknown): string {
  if (typeof value === "object" && value !== null && "error" in value && typeof (value as { error?: unknown }).error === "string") {
    return (value as { error: string }).error;
  }
  return "Unable to load your A1 capstone.";
}

export default function A1CapstonePage() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) {
        setError("Sign in to view your A1 capstone.");
        setLoading(false);
        return;
      }
      try {
        const response = await authenticatedFetch("/api/learning/capstone");
        const body: unknown = await response.json();
        if (!response.ok) throw new Error(readError(body));
        setPayload(body as Payload);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load your A1 capstone.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) return <main className="mx-auto max-w-5xl px-6 py-16 text-slate-600">Loading your A1 project…</main>;
  if (error || !payload) return <main className="mx-auto max-w-3xl px-6 py-16"><div className="rounded-3xl bg-rose-50 p-6 text-rose-900">{error ?? "Capstone unavailable."}</div></main>;

  const { definition, result } = payload;
  const resultById = new Map(result.requirementResults.map((item) => [item.requirementId, item]));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">A1 integrated capstone</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{definition.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">This project checks what you can do across A1. It combines evidence from listening, speaking, reading, writing, interaction, mediation, pronunciation and transfer. Finishing lessons alone does not decide your level.</p>
        <div className="mt-7 inline-flex rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/15">
          Current decision: {decisionLabel(result.decision)}
        </div>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {definition.sections.map((section, index) => (
          <article key={section.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">Part {index + 1}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{section.mission}</p>
            <Link href={`/learn/english-a1-foundations/${section.lessonId}`} className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
              Open this project part
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Evidence profile</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">What your A1 evidence currently shows</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">A requirement needs independent evidence. Supported retries still matter, but they are kept separate so Lurexa does not mistake assisted completion for independent performance.</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {definition.evidenceRequirements.map((requirement) => {
            const evidence = resultById.get(requirement.id);
            const satisfied = evidence?.satisfied ?? false;
            return (
              <article key={requirement.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-950">{requirement.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{requirement.criticalForExit ? "Critical A1 exit evidence" : "Supporting A1 exit evidence"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${satisfied ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                    {satisfied ? "Evidence present" : "Needs evidence"}
                  </span>
                </div>
                <div className="mt-4 flex gap-4 text-sm text-slate-600">
                  <span>Independent: <strong className="text-slate-900">{evidence?.independentEvidenceCount ?? 0}</strong></span>
                  <span>Supported: <strong className="text-slate-900">{evidence?.supportedEvidenceCount ?? 0}</strong></span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {result.targetedCompetencyIds.length ? (
        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">Next targets</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">You do not need to repeat all of A1.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Lurexa can target the competencies that still need independent evidence or revalidation.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.targetedCompetencyIds.map((id) => <span key={id} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-amber-200">{id}</span>)}
          </div>
        </section>
      ) : null}

      <p className="mt-8 text-sm leading-6 text-slate-600">{result.rationale}</p>
    </main>
  );
}

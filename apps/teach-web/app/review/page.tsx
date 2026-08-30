"use client";

import { useCallback, useEffect, useState } from "react";
import type { TeachEvidenceReviewDecision, TeachEvidenceReviewResult, TeachEvidenceSubmission } from "@lurexa/types";
import { TeachPrivate } from "../components/TeachPrivate";
import { TeachShell } from "../components/TeachShell";
import { useTeachAuth } from "../components/TeachAuthProvider";
import { Button } from "@lurexa/ui/button";

export default function TeachReviewPage() {
  const { user } = useTeachAuth();
  const [evidence, setEvidence] = useState<TeachEvidenceSubmission[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadQueue = useCallback(async () => {
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/teach/review", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const payload = await response.json() as { evidence?: TeachEvidenceSubmission[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Review queue could not be loaded.");
      setEvidence(payload.evidence ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Review queue could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const review = async (item: TeachEvidenceSubmission, decision: TeachEvidenceReviewDecision) => {
    if (!user) return;
    const reviewerNote = notes[item.id]?.trim() ?? "";
    if (!reviewerNote) {
      setError("Add a reviewer note before making a decision.");
      return;
    }

    setWorkingId(item.id);
    setError("");
    setMessage("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/teach/review", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ evidenceId: item.id, decision, reviewerNote }),
      });
      const payload = await response.json() as TeachEvidenceReviewResult & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Evidence review could not be saved.");

      setEvidence((current) => current.filter((entry) => entry.id !== item.id));
      setNotes((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
      const awards = payload.newlyAwardedCredentials?.length ?? 0;
      setMessage(decision === "verified"
        ? awards > 0
          ? `Evidence verified. ${awards} credential${awards === 1 ? " was" : "s were"} awarded and the educator's next recommendation was refreshed.`
          : "Evidence verified. Credential eligibility and the educator's persisted recommendation were refreshed."
        : "Evidence rejected. The educator received a persisted revision recommendation.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Evidence review could not be saved.");
    } finally {
      setWorkingId(null);
    }
  };

  return <TeachShell active="Dashboard"><TeachPrivate><main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
    <section className="rounded-[32px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-[var(--lx-primary)] p-8 text-white sm:p-10">
      <p className="text-[10px] font-extrabold tracking-[.18em] text-[var(--lx-accent)]">TRUSTED CORE WORKFLOW</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-5xl">Professional evidence review</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-indigo-100">Verify demonstrated capability, reject evidence that needs another iteration, and let the trusted pipeline reconcile credential awards and the educator&apos;s next Lurexa Mind recommendation.</p>
    </section>

    {error && <p role="alert" className="mt-6 rounded-2xl bg-[var(--lx-destructive)] p-4 text-sm font-bold text-[var(--lx-destructive)]">{error}</p>}
    {message && <p role="status" className="mt-6 rounded-2xl bg-[var(--lx-surface)] p-4 text-sm font-bold text-[var(--lx-success)]">{message}</p>}

    <div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">REVIEW QUEUE</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Submitted evidence</h2></div><Button type="button" onClick={() => void loadQueue()} className="min-h-11 rounded-xl border border-[var(--lx-border)] bg-white px-4 text-sm font-extrabold text-[var(--lx-secondary)]">Refresh</Button></div>

    {loading ? <div className="mt-6 rounded-[26px] border border-[var(--lx-surface)] bg-white p-8 text-sm text-[var(--lx-muted)]">Loading trusted review queue…</div> : evidence.length === 0 ? <div className="mt-6 rounded-[26px] border border-dashed border-[var(--lx-border)] bg-white p-10 text-center"><b className="text-xl">No evidence is waiting for review.</b><p className="mt-2 text-sm text-[var(--lx-muted)]">Verified and rejected items leave this queue automatically.</p></div> : <section className="mt-6 space-y-5">{evidence.map((item) => <article key={item.id} className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-7 shadow-[0_12px_30px_rgba(32,52,128,.05)]">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[var(--lx-muted)]">{item.type.replaceAll("-", " ")}</p><h3 className="mt-2 text-2xl font-black tracking-[-.04em]">{item.title}</h3><p className="mt-2 text-xs font-bold text-[var(--lx-muted)]">Educator {item.userId} · Submitted {new Date(item.createdAt).toLocaleDateString()}</p></div><span className="rounded-full bg-[var(--lx-warning)] px-3 py-1.5 text-xs font-extrabold text-[var(--lx-warning)]">Awaiting review</span></div>
      <p className="mt-5 text-sm leading-7 text-[var(--lx-muted)]">{item.description}</p>
      {item.competencyIds.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{item.competencyIds.map((id) => <span key={id} className="rounded-full bg-[var(--lx-surface)] px-3 py-1.5 text-xs font-extrabold text-[var(--lx-primary)]">{id}</span>)}</div>}
      {item.resourceUrl && <a href={item.resourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center text-sm font-extrabold text-[var(--lx-secondary)]">Open submitted resource ↗</a>}
      <label className="mt-6 block"><span className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--lx-muted)]">Reviewer note</span><textarea value={notes[item.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))} rows={4} className="mt-2 w-full rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-4 text-sm text-[var(--color-brand-navy)] outline-none focus:border-[var(--lx-primary)] focus:ring-4 focus:ring-[var(--lx-primary)]/10" placeholder="Explain why this evidence demonstrates the competency, or what must improve before resubmission." /></label>
      <div className="mt-5 flex flex-wrap gap-3"><Button type="button" disabled={workingId === item.id} onClick={() => void review(item, "verified")} className="min-h-11 rounded-xl bg-[var(--lx-success)] px-5 text-sm font-extrabold text-white disabled:opacity-50">Verify evidence</Button><Button type="button" disabled={workingId === item.id} onClick={() => void review(item, "rejected")} className="min-h-11 rounded-xl border border-[var(--lx-destructive)] bg-[var(--lx-destructive)] px-5 text-sm font-extrabold text-[var(--lx-destructive)] disabled:opacity-50">Request revision</Button></div>
    </article>)}</section>}
  </main></TeachPrivate></TeachShell>;
}

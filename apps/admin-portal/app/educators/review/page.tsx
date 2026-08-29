"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import type {
  EducatorGovernanceSnapshotV1,
  EducatorQualificationEventV1,
  EducatorQualificationScopeV1,
  EducatorQualificationStatus,
  EducatorLevel,
  EducatorSubject,
} from "@lurexa/types";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

const LEVELS: EducatorLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const transitionMap: Record<EducatorQualificationStatus, EducatorQualificationStatus[]> = {
  candidate: ["under_review", "revoked"],
  under_review: ["qualified", "candidate", "revoked"],
  qualified: ["suspended", "expired", "revoked"],
  suspended: ["qualified", "expired", "revoked"],
  expired: [],
  revoked: [],
};

function lines(value: string): string[] {
  return [...new Set(value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean))];
}

function readError(payload: unknown): string {
  return typeof payload === "object" && payload !== null && typeof (payload as { error?: unknown }).error === "string"
    ? String((payload as { error: string }).error)
    : "Unable to complete qualification review request.";
}

export default function QualificationReviewPage() {
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState("");
  const [snapshot, setSnapshot] = useState<EducatorGovernanceSnapshotV1 | null>(null);
  const [userId, setUserId] = useState("");
  const [qualificationId, setQualificationId] = useState("");
  const [events, setEvents] = useState<EducatorQualificationEventV1[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [subject, setSubject] = useState<EducatorSubject>("english");
  const [levels, setLevels] = useState<EducatorLevel[]>(["A1"]);
  const [languageLevel, setLanguageLevel] = useState<EducatorLevel | "">("");
  const [methodology, setMethodology] = useState("");
  const [planning, setPlanning] = useState("");
  const [assessment, setAssessment] = useState("");
  const [practiceEvidence, setPracticeEvidence] = useState("");
  const [evidence, setEvidence] = useState("");
  const [policyVersion, setPolicyVersion] = useState("educator-qualification-v1");
  const [toStatus, setToStatus] = useState<Exclude<EducatorQualificationStatus, "candidate">>("under_review");
  const [reason, setReason] = useState("");
  const [transitionEvidence, setTransitionEvidence] = useState("");
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => AuthService.onUserChanged((user) => { if (!user) router.replace("/login"); }), [router]);

  const selectedPerson = useMemo(() => snapshot?.educators.find((person) => person.userId === userId) ?? null, [snapshot, userId]);
  const selectedQualification = useMemo(() => selectedPerson?.qualifications.find((item) => item.id === qualificationId) ?? null, [selectedPerson, qualificationId]);
  const allowedTransitions = selectedQualification ? transitionMap[selectedQualification.status] : [];

  const loadOrganization = useCallback(async (orgId: string) => {
    if (!orgId.trim()) return;
    setLoading(true); setError(null); setNotice(null);
    try {
      const response = await authenticatedFetch(`/api/admin/educators?organizationId=${encodeURIComponent(orgId.trim())}`, { cache: "no-store" });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      const next = body as EducatorGovernanceSnapshotV1;
      setSnapshot(next);
      const first = next.educators[0] ?? null;
      setUserId(first?.userId ?? "");
      setQualificationId(first?.qualifications[0]?.id ?? "");
      setEvents([]);
    } catch (caught) {
      setSnapshot(null); setUserId(""); setQualificationId(""); setEvents([]);
      setError(caught instanceof Error ? caught.message : "Unable to load educator governance.");
    } finally { setLoading(false); }
  }, []);

  async function loadEvents(targetUserId = userId, targetQualificationId = qualificationId) {
    if (!targetUserId || !targetQualificationId) return;
    setLoading(true); setError(null);
    try {
      const response = await authenticatedFetch("/api/admin/qualification-lifecycle", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "events", userId: targetUserId, qualificationId: targetQualificationId }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      setEvents(body as EducatorQualificationEventV1[]);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load qualification history."); }
    finally { setLoading(false); }
  }

  async function createCandidate(event: FormEvent) {
    event.preventDefault(); if (!userId) return;
    setSaving(true); setError(null); setNotice(null);
    try {
      const response = await authenticatedFetch("/api/admin/qualification-lifecycle", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_candidate", input: {
          userId, subject, levels,
          methodologyCompetencyIds: lines(methodology), planningCompetencyIds: lines(planning), assessmentCompetencyIds: lines(assessment),
          practiceEvidenceRefs: lines(practiceEvidence), languageProficiencyLevel: languageLevel || null,
          evidenceRefs: lines(evidence), policyVersion,
        } }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      const candidate = body as EducatorQualificationScopeV1;
      setQualificationId(candidate.id);
      setNotice("Qualification candidate created. It remains non-authoritative until governed review reaches qualified status.");
      await loadOrganization(organizationId);
      await loadEvents(userId, candidate.id);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to create qualification candidate."); }
    finally { setSaving(false); }
  }

  async function transition(event: FormEvent) {
    event.preventDefault(); if (!selectedQualification || !allowedTransitions.includes(toStatus)) return;
    setSaving(true); setError(null); setNotice(null);
    try {
      const response = await authenticatedFetch("/api/admin/qualification-lifecycle", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "transition", input: {
          userId, qualificationId, toStatus, reason,
          evidenceRefs: lines(transitionEvidence),
          validUntil: toStatus === "qualified" && validUntil ? new Date(`${validUntil}T23:59:59.999Z`).toISOString() : null,
        } }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      setNotice(`Qualification moved to ${toStatus.replaceAll("_", " ")}.`);
      setReason(""); setTransitionEvidence("");
      await loadOrganization(organizationId);
      await loadEvents(userId, qualificationId);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to transition qualification."); }
    finally { setSaving(false); }
  }

  return <main className="min-h-screen bg-[#f7f8fe] text-[var(--color-brand-navy)]">
    <header className="bg-gradient-to-br from-[var(--color-brand-navy)] via-[#341680] to-[var(--lx-primary)] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <ProductMark product="admin" inverse />
        <p className="mt-10 text-[10px] font-black uppercase tracking-[.18em] text-violet-200">QUALIFICATION REVIEW</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Turn professional evidence into an auditable qualification decision.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-violet-100">Review does not grant teaching access by itself. Core qualification and institution-issued course authorization remain separate decisions.</p>
      </div>
    </header>

    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8 lg:px-10">
      <form onSubmit={(event) => { event.preventDefault(); void loadOrganization(organizationId); }} className="flex flex-col gap-3 rounded-3xl border border-[var(--lx-surface)] bg-white p-5 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-black">Organization ID<Input value={organizationId} onChange={(event) => setOrganizationId(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[var(--lx-border)] px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-primary)]" placeholder="organization-id" /></label>
        <Button disabled={loading || !organizationId.trim()} className="min-h-12 rounded-xl bg-[var(--color-brand-navy)] px-5 text-sm font-black text-white disabled:opacity-50">{loading ? "Loading…" : "Open organization"}</Button>
      </form>
      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">{error}</div> : null}
      {notice ? <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800">{notice}</div> : null}

      {snapshot ? <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-3xl border border-[var(--lx-surface)] bg-white p-6">
          <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-primary)]">EDUCATOR</p>
          <select value={userId} onChange={(event) => { const next = event.target.value; setUserId(next); const person = snapshot.educators.find((item) => item.userId === next); setQualificationId(person?.qualifications[0]?.id ?? ""); setEvents([]); }} className="mt-3 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-white px-4 text-sm font-bold">
            {snapshot.educators.map((person) => <option key={person.userId} value={person.userId}>{person.displayName ?? person.email ?? person.userId}</option>)}
          </select>
          <div className="mt-5 space-y-2">{selectedPerson?.qualifications.map((item) => <Button key={item.id} type="button" onClick={() => { setQualificationId(item.id); setEvents([]); const next = transitionMap[item.status][0]; if (next && next !== "candidate") setToStatus(next); }} className={`w-full rounded-2xl border p-4 text-left ${qualificationId === item.id ? "border-[var(--lx-primary)] bg-[#f2edff]" : "border-[var(--lx-border)]"}`}><b className="text-sm capitalize">{item.subject} · {item.levels.join("–")}</b><span className="mt-1 block text-xs font-bold capitalize text-[var(--lx-muted)]">{item.status.replaceAll("_", " ")}</span></Button>)}</div>
        </section>

        <section className="space-y-6">
          <form onSubmit={createCandidate} className="rounded-3xl border border-[var(--lx-surface)] bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-secondary)]">NEW CANDIDATE</p><h2 className="mt-2 text-2xl font-black">Create an evidence-backed review record</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-black">Subject<select value={subject} onChange={(e) => setSubject(e.target.value as EducatorSubject)} className="mt-2 min-h-11 w-full rounded-xl border border-[var(--lx-border)] bg-white px-3"><option value="english">English</option><option value="math">Math</option><option value="science">Science</option><option value="other">Other</option></select></label><label className="text-sm font-black">Language proficiency<select value={languageLevel} onChange={(e) => setLanguageLevel(e.target.value as EducatorLevel | "")} className="mt-2 min-h-11 w-full rounded-xl border border-[var(--lx-border)] bg-white px-3"><option value="">Not asserted</option>{LEVELS.map((level) => <option key={level}>{level}</option>)}</select></label></div>
            <fieldset className="mt-4"><legend className="text-sm font-black">Teaching levels</legend><div className="mt-2 flex flex-wrap gap-2">{LEVELS.map((level) => <label key={level} className="flex items-center gap-2 rounded-xl border border-[var(--lx-surface)] px-3 py-2 text-xs font-bold"><input type="checkbox" checked={levels.includes(level)} onChange={(e) => setLevels((current) => e.target.checked ? [...current, level] : current.filter((item) => item !== level))} />{level}</label>)}</div></fieldset>
            {[['Methodology competency IDs', methodology, setMethodology], ['Planning competency IDs', planning, setPlanning], ['Assessment competency IDs', assessment, setAssessment], ['Practice evidence refs', practiceEvidence, setPracticeEvidence], ['Other trusted evidence refs', evidence, setEvidence]] .map(([label, value, setter]) => <label key={String(label)} className="mt-4 block text-sm font-black">{String(label)}<textarea value={String(value)} onChange={(e) => (setter as (value: string) => void)(e.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-[var(--lx-border)] px-3 py-2 text-sm" placeholder="Comma or new-line separated" /></label>)}
            <label className="mt-4 block text-sm font-black">Policy version<Input value={policyVersion} onChange={(e) => setPolicyVersion(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[var(--lx-border)] px-3" /></label>
            <Button disabled={saving || !userId || !levels.length || (!lines(evidence).length && !lines(practiceEvidence).length)} className="mt-5 min-h-11 rounded-xl bg-[var(--lx-secondary)] px-5 text-sm font-black text-white disabled:opacity-50">Create candidate</Button>
          </form>

          {selectedQualification ? <form onSubmit={transition} className="rounded-3xl border border-[var(--lx-surface)] bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-primary)]">REVIEW DECISION</p><h2 className="mt-2 text-2xl font-black capitalize">{selectedQualification.status.replaceAll("_", " ")} → next state</h2>
            {allowedTransitions.length ? <><label className="mt-5 block text-sm font-black">Transition<select value={toStatus} onChange={(e) => setToStatus(e.target.value as Exclude<EducatorQualificationStatus, "candidate">)} className="mt-2 min-h-11 w-full rounded-xl border border-[var(--lx-border)] bg-white px-3">{allowedTransitions.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></label><label className="mt-4 block text-sm font-black">Decision reason<textarea required value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-[var(--lx-border)] px-3 py-2 text-sm" /></label><label className="mt-4 block text-sm font-black">Additional evidence refs<textarea value={transitionEvidence} onChange={(e) => setTransitionEvidence(e.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-[var(--lx-border)] px-3 py-2 text-sm" /></label>{toStatus === "qualified" ? <label className="mt-4 block text-sm font-black">Valid until<Input type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[var(--lx-border)] px-3" /></label> : null}<Button disabled={saving || !reason.trim() || !allowedTransitions.includes(toStatus)} className="mt-5 min-h-11 rounded-xl bg-[var(--lx-primary)] px-5 text-sm font-black text-white disabled:opacity-50">Apply governed transition</Button></> : <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">This qualification is terminal. Create a new candidate after reassessment if a new scope is needed.</p>}
            <Button type="button" onClick={() => void loadEvents()} className="mt-4 min-h-10 rounded-xl border border-[var(--lx-border)] px-4 text-xs font-black text-[var(--lx-secondary)]">Load audit history</Button>
          </form> : null}

          {events.length ? <section className="rounded-3xl border border-[var(--lx-surface)] bg-white p-6"><p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-secondary)]">AUDIT HISTORY</p><div className="mt-4 space-y-3">{events.map((item) => <article key={item.id} className="rounded-2xl border border-[var(--lx-border)] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><b className="text-sm capitalize">{item.fromStatus ? `${item.fromStatus.replaceAll("_", " ")} → ` : ""}{item.toStatus.replaceAll("_", " ")}</b><time className="text-xs font-bold text-[var(--lx-muted)]">{new Date(item.occurredAt).toLocaleString()}</time></div><p className="mt-2 text-sm text-[#44537b]">{item.reason}</p><p className="mt-2 text-xs font-bold text-[var(--lx-muted)]">Evidence refs: {item.evidenceRefs.length} · Policy: {item.policyVersion}</p></article>)}</div></section> : null}
        </section>
      </div> : null}
    </div>
  </main>;
}

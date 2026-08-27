"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import type {
  EducatorGovernancePersonV1,
  EducatorGovernanceSnapshotV1,
  EducatorQualificationScopeV1,
  TeachingAuthorizationV1,
} from "@lurexa/types";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

function readError(payload: unknown): string {
  return typeof payload === "object" && payload !== null && typeof (payload as { error?: unknown }).error === "string"
    ? String((payload as { error: string }).error)
    : "Unable to complete educator governance request.";
}

function identityLabel(person: EducatorGovernancePersonV1): string {
  return person.displayName ?? person.email ?? person.userId;
}

function qualificationLabel(qualification: EducatorQualificationScopeV1): string {
  return `${qualification.subject} · ${qualification.levels.join("–") || "unscoped"}`;
}

function firstQualifiedId(person: EducatorGovernancePersonV1 | null): string {
  return person?.qualifications.find((qualification) => qualification.status === "qualified")?.id ?? "";
}

export default function EducatorGovernancePage() {
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState("");
  const [snapshot, setSnapshot] = useState<EducatorGovernanceSnapshotV1 | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [qualificationId, setQualificationId] = useState("");
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [validUntil, setValidUntil] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selectEducator = useCallback((person: EducatorGovernancePersonV1 | null) => {
    setSelectedUserId(person?.userId ?? null);
    setQualificationId(firstQualifiedId(person));
    setCourseIds([]);
    setValidUntil("");
  }, []);

  const load = useCallback(async (orgId: string) => {
    if (!orgId.trim()) return;
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const response = await authenticatedFetch(`/api/admin/educators?organizationId=${encodeURIComponent(orgId.trim())}`, { cache: "no-store" });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      const next = body as EducatorGovernanceSnapshotV1;
      const first = next.educators[0] ?? null;
      setSnapshot(next);
      setSelectedUserId(first?.userId ?? null);
      setQualificationId(firstQualifiedId(first));
      setCourseIds([]);
      setValidUntil("");
    } catch (caught) {
      setSnapshot(null);
      setSelectedUserId(null);
      setQualificationId("");
      setCourseIds([]);
      setValidUntil("");
      setError(caught instanceof Error ? caught.message : "Unable to load educator governance.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => AuthService.onUserChanged((user) => {
    if (!user) router.replace("/login");
  }), [router]);

  const selected = useMemo(() => snapshot?.educators.find((person) => person.userId === selectedUserId) ?? null, [snapshot, selectedUserId]);
  const activeQualifications = useMemo(() => selected?.qualifications.filter((qualification) => qualification.status === "qualified") ?? [], [selected]);
  const selectedQualification = activeQualifications.find((qualification) => qualification.id === qualificationId) ?? null;
  const eligibleCourses = useMemo(() => {
    if (!snapshot || !selectedQualification) return [];
    return snapshot.courses.filter((course) => course.subject === selectedQualification.subject && (!course.level || selectedQualification.levels.includes(course.level)));
  }, [snapshot, selectedQualification]);

  async function handleOrganization(event: FormEvent) {
    event.preventDefault();
    await load(organizationId);
  }

  async function grantAuthorization(event: FormEvent) {
    event.preventDefault();
    if (!snapshot || !selected || !qualificationId || !courseIds.length) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await authenticatedFetch("/api/admin/educators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: snapshot.organizationId,
          userId: selected.userId,
          qualificationId,
          courseIds,
          validUntil: validUntil ? new Date(`${validUntil}T23:59:59.999Z`).toISOString() : null,
        }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      setNotice("Teaching authorization granted inside the educator's verified qualification scope.");
      setCourseIds([]);
      await load(snapshot.organizationId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to grant teaching authorization.");
    } finally {
      setSaving(false);
    }
  }

  async function updateAuthorization(item: TeachingAuthorizationV1, status: "active" | "suspended") {
    if (!snapshot || !selected) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await authenticatedFetch("/api/admin/educators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: snapshot.organizationId, userId: selected.userId, authorizationId: item.id, status }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      setNotice(status === "suspended" ? "Teaching authorization suspended." : "Teaching authorization reactivated after qualification revalidation.");
      await load(snapshot.organizationId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update teaching authorization.");
    } finally {
      setSaving(false);
    }
  }

  return <main className="min-h-screen bg-[#f6f8ff] text-[#071d67]">
    <header className="border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#17398f] to-[#2355bf] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4"><ProductMark product="admin" inverse /><Link href="/" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Platform operations</Link></div>
        <p className="mt-10 text-[10px] font-extrabold tracking-[.2em] text-[#7ee9ed]">EDUCATOR GOVERNANCE</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-[-.055em] sm:text-5xl lg:text-6xl">Authorize teaching without confusing role with qualification.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-indigo-100">Membership establishes institutional affiliation. Qualification establishes what an educator is prepared to teach. Authorization grants a qualified educator access to specific courses.</p>
      </div>
    </header>

    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <form onSubmit={handleOrganization} className="flex flex-col gap-3 rounded-3xl border border-[#dfe6f8] bg-white p-5 sm:flex-row sm:items-end lg:p-6">
        <label className="flex-1 text-sm font-extrabold">Organization ID<input value={organizationId} onChange={(event) => setOrganizationId(event.target.value)} placeholder="organization-id" className="mt-2 min-h-12 w-full rounded-xl border border-[#cad6f2] px-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]" /></label>
        <button disabled={loading || !organizationId.trim()} className="min-h-12 rounded-xl bg-[#071d67] px-5 text-sm font-extrabold text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]">{loading ? "Loading…" : "Open organization"}</button>
      </form>

      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">{error}</div> : null}
      {notice ? <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800">{notice}</div> : null}

      {snapshot ? <>
        <section className="rounded-3xl border border-[#dfe6f8] bg-white p-6 lg:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#315fd7]">ORGANIZATION</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em]">{snapshot.organizationName}</h2><p className="mt-2 text-xs font-bold text-[#7180a8]">{snapshot.organizationId}</p></div><div className="rounded-2xl bg-[#edf2ff] px-4 py-3 text-right"><b className="block text-2xl">{snapshot.educators.length}</b><span className="text-xs font-bold text-[#4d5e8c]">educator-affiliated members</span></div></div></section>

        <div className="grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
          <section className="rounded-3xl border border-[#dfe6f8] bg-white p-5 lg:p-6" aria-label="Educators"><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#315fd7]">EDUCATORS</p><div className="mt-4 space-y-2">{snapshot.educators.length ? snapshot.educators.map((person) => <button key={person.userId} type="button" onClick={() => selectEducator(person)} aria-pressed={selectedUserId === person.userId} className={`w-full rounded-2xl border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7] ${selectedUserId === person.userId ? "border-[#315fd7] bg-[#edf2ff]" : "border-[#e1e7f6] bg-white"}`}><b className="block text-sm">{identityLabel(person)}</b><span className="mt-1 block text-xs font-bold capitalize text-[#7180a8]">{person.membershipRole} affiliation · {person.qualifications.length} qualification record{person.qualifications.length === 1 ? "" : "s"}</span></button>) : <p className="rounded-2xl bg-[#f7f9ff] p-4 text-sm text-[#4d5e8c]">No owner, admin, or teacher membership records were found for this organization.</p>}</div></section>

          {selected ? <section className="space-y-5"><article className="rounded-3xl border border-[#dfe6f8] bg-white p-6 lg:p-7"><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#315fd7]">ACCESS MODEL</p><h2 className="mt-2 text-2xl font-black">{identityLabel(selected)}</h2><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#f7f9ff] p-4"><span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#7180a8]">Affiliation</span><b className="mt-2 block capitalize">{selected.membershipRole}</b></div><div className="rounded-2xl bg-[#f7f9ff] p-4"><span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#7180a8]">Qualifications</span><b className="mt-2 block">{selected.qualifications.filter((item) => item.status === "qualified").length} active</b></div><div className="rounded-2xl bg-[#f7f9ff] p-4"><span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#7180a8]">Teaching grants</span><b className="mt-2 block">{selected.authorizations.filter((item) => item.status === "active").length} active</b></div></div></article>

            <article className="rounded-3xl border border-[#dfe6f8] bg-white p-6 lg:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#315fd7]">QUALIFICATION EVIDENCE</p><h3 className="mt-2 text-xl font-black">Trusted scope — read only in Admin</h3></div><span className="rounded-full bg-[#eef3ff] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#315fd7]">Cannot be edited here</span></div><div className="mt-4 space-y-3">{selected.qualifications.length ? selected.qualifications.map((qualification) => <div key={qualification.id} className="rounded-2xl border border-[#e1e7f6] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><b>{qualificationLabel(qualification)}</b><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${qualification.status === "qualified" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{qualification.status}</span></div><p className="mt-2 text-xs leading-5 text-[#7180a8]">Evidence refs: {qualification.evidenceRefs.length} · Methodology: {qualification.methodologyCompetencyIds.length} · Planning: {qualification.planningCompetencyIds.length} · Assessment: {qualification.assessmentCompetencyIds.length}</p></div>) : <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">No qualification record. Membership alone does not permit course authorization.</p>}</div></article>

            <article className="rounded-3xl border border-[#dfe6f8] bg-white p-6 lg:p-7"><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#315fd7]">TEACHING AUTHORIZATION</p><h3 className="mt-2 text-xl font-black">Grant specific courses inside a qualified scope</h3>{activeQualifications.length ? <form onSubmit={grantAuthorization} className="mt-5 space-y-4"><label className="block text-sm font-extrabold">Qualification<select value={qualificationId} onChange={(event) => { setQualificationId(event.target.value); setCourseIds([]); }} className="mt-2 min-h-12 w-full rounded-xl border border-[#cad6f2] bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]">{activeQualifications.map((qualification) => <option key={qualification.id} value={qualification.id}>{qualificationLabel(qualification)}</option>)}</select></label><fieldset><legend className="text-sm font-extrabold">Eligible courses</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{eligibleCourses.length ? eligibleCourses.map((course) => <label key={course.id} className="flex cursor-pointer gap-3 rounded-2xl border border-[#dfe6f8] p-4 text-sm font-bold"><input type="checkbox" checked={courseIds.includes(course.id)} onChange={(event) => setCourseIds((current) => event.target.checked ? [...current, course.id] : current.filter((id) => id !== course.id))} className="mt-0.5 size-4" /><span>{course.title}<small className="mt-1 block font-semibold text-[#7180a8]">{course.subject}{course.level ? ` · ${course.level}` : ""}</small></span></label>) : <p className="col-span-full rounded-2xl bg-[#f7f9ff] p-4 text-sm text-[#4d5e8c]">No organization courses fit this qualification.</p>}</div></fieldset><label className="block text-sm font-extrabold">Valid until <span className="font-medium text-[#7180a8]">(optional)</span><input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#cad6f2] px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]" /></label><button disabled={saving || !courseIds.length} className="min-h-12 rounded-xl bg-[#071d67] px-5 text-sm font-extrabold text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]">{saving ? "Saving…" : "Grant teaching authorization"}</button></form> : <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">This educator has no active qualified scope. Complete the governed qualification lifecycle before assigning courses.</p>}</article>

            <article className="rounded-3xl border border-[#dfe6f8] bg-white p-6 lg:p-7"><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#315fd7]">CURRENT GRANTS</p><div className="mt-4 space-y-3">{selected.authorizations.length ? selected.authorizations.map((item) => <div key={item.id} className="rounded-2xl border border-[#e1e7f6] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><b>{item.subject} · {item.levels.join("–")}</b><p className="mt-1 text-xs leading-5 text-[#7180a8]">{item.courseIds.length} course{item.courseIds.length === 1 ? "" : "s"} · qualification {item.qualificationId}</p></div><button type="button" disabled={saving} onClick={() => void updateAuthorization(item, item.status === "active" ? "suspended" : "active")} className={`min-h-10 rounded-xl px-3 text-xs font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7] ${item.status === "active" ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{item.status === "active" ? "Suspend" : "Reactivate"}</button></div><span className="mt-3 inline-flex rounded-full bg-[#f1f4fb] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#536a91]">{item.status}</span></div>) : <p className="rounded-2xl bg-[#f7f9ff] p-4 text-sm text-[#4d5e8c]">No teaching authorizations in this organization.</p>}</div></article>
          </section> : null}
        </div>

        <aside className="rounded-2xl bg-[#eef3ff] p-5 text-xs leading-5 text-[#536a91]"><b className="text-[#1f3d8f]">Governance boundaries:</b> {snapshot.limitations.join(" ")}</aside>
      </> : null}
    </div>
  </main>;
}

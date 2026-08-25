"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, OrganizationService } from "@lurexa/backend";
import type {
  Invitation,
  LearnerPulseProjectionV1,
  LearnTeacherInstructionalRosterV1,
  LearnTeacherRosterLearnerV1,
} from "@lurexa/types";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Input } from "@lurexa/ui/Input";
import { LearnerPulse } from "@lurexa/ui/LearnerPulse";

const signatureEnabled = process.env.NEXT_PUBLIC_LEARN_TEACHER_SIGNATURE_V1 === "on";

type AuthUser = NonNullable<Parameters<Parameters<typeof AuthService.onUserChanged>[0]>[0]>;

async function authenticatedJson<T>(user: AuthUser, url: string): Promise<T> {
  const token = await user.getIdToken();
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error ?? "Unable to load teacher workspace data.");
  return body;
}

export default function TeacherStudentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState("");
  const [roster, setRoster] = useState<LearnTeacherInstructionalRosterV1 | null>(null);
  const [selected, setSelected] = useState<LearnTeacherRosterLearnerV1 | null>(null);
  const [pulse, setPulse] = useState<LearnerPulseProjectionV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPulse, setLoadingPulse] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(currentUser);
      try {
        const membership = (await OrganizationService.getMembershipsForUser(currentUser.uid))
          .find((item) => ["owner", "admin", "teacher"].includes(item.role));
        const [nextRoster, nextInvitations] = await Promise.all([
          authenticatedJson<LearnTeacherInstructionalRosterV1>(currentUser, "/api/teacher/roster"),
          membership ? OrganizationService.getInvitationsForOrganization(membership.orgId) : Promise.resolve([]),
        ]);
        const firstLearner = nextRoster.courses.flatMap((course) => course.learners)[0] ?? null;
        setOrgId(membership?.orgId ?? null);
        setInvitations(nextInvitations);
        setRoster(nextRoster);
        if (firstLearner && signatureEnabled) setLoadingPulse(true);
        setSelected(firstLearner);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Unable to load the teacher workspace.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user || !selected || !signatureEnabled) return;
    let active = true;
    const params = new URLSearchParams({
      learnerId: selected.learnerId,
      organizationId: selected.organizationId,
      courseId: selected.courseId,
    });
    void authenticatedJson<LearnerPulseProjectionV1>(user, `/api/teacher/signature?${params.toString()}`)
      .then((value) => {
        if (!active) return;
        setPulse(value);
      })
      .catch((reason) => {
        if (!active) return;
        setPulse(null);
        setError(reason instanceof Error ? reason.message : "Unable to load learner instructional support.");
      })
      .finally(() => {
        if (active) setLoadingPulse(false);
      });
    return () => { active = false; };
  }, [user, selected]);

  function selectLearner(learner: LearnTeacherRosterLearnerV1): void {
    setPulse(null);
    setError(null);
    if (signatureEnabled) setLoadingPulse(true);
    setSelected(learner);
  }

  const learnerCount = useMemo(
    () => roster?.courses.reduce((total, course) => total + course.learners.length, 0) ?? 0,
    [roster],
  );

  const createInvitation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!orgId) return;
    setSaving(true);
    try {
      const invitation = await OrganizationService.createInvitation(orgId, email, "student");
      setInvitations((current) => [invitation, ...current]);
      setEmail("");
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Unable to create invitation.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8">
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#dfe7fb] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#315fd7]">Lurexa Learn · Teacher Workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-[#071d67]">Students</h1>
          <p className="mt-2 max-w-2xl text-[#6677a5]">Manage learner access, review course participation, and use purpose-scoped instructional support without leaving Lurexa Learn.</p>
        </div>
        <Button variant="secondary" onClick={() => router.push("/teacher/dashboard")}>Back to dashboard</Button>
      </div>

      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-800">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
        <section aria-label="Authorized course rosters" className="rounded-3xl border border-[#dfe6f8] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-[10px] font-extrabold tracking-[.16em] text-[#315fd7]">COURSE ROSTERS</p><h2 className="mt-2 text-xl font-black text-[#071d67]">Choose a learner</h2></div>
            <div className="text-right text-xs font-bold text-[#6677a5]"><b className="block text-2xl text-[#071d67]">{loading ? "—" : learnerCount}</b>participating</div>
          </div>
          <div className="mt-5 space-y-5">
            {loading ? <p aria-live="polite" className="text-sm text-[#6677a5]">Loading authorized roster…</p> : roster?.courses.length ? roster.courses.map((course) => <div key={course.courseId}>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#7180a8]">{course.courseTitle}</p>
              <div className="space-y-2">{course.learners.length ? course.learners.map((learner) => <button
                key={`${course.courseId}:${learner.learnerId}`}
                type="button"
                onClick={() => selectLearner(learner)}
                aria-pressed={selected?.learnerId === learner.learnerId && selected.courseId === learner.courseId}
                className={`w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7] ${selected?.learnerId === learner.learnerId && selected.courseId === learner.courseId ? "border-[#315fd7] bg-[#eef3ff]" : "border-[#e3e9f7] bg-[#fbfcff] hover:border-[#b9c5ea]"}`}
              >
                <div className="flex items-center justify-between gap-4"><div><b className="text-[#132a72]">{learner.displayName}</b><p className="mt-1 text-xs text-[#7180a8]">{learner.completedLessons}/{learner.totalLessons} lessons completed</p></div><span className="text-sm font-black text-[#315fd7]">{learner.progressPercent}%</span></div>
              </button>) : <p className="rounded-2xl bg-[#f7f9ff] p-4 text-sm text-[#6677a5]">No participating learners yet.</p>}</div>
            </div>) : <p className="text-sm text-[#6677a5]">No authorized course participation is available yet.</p>}
          </div>
        </section>

        <section aria-label="Learner instructional support" className="min-w-0">
          {!selected ? <div className="rounded-3xl border border-dashed border-[#cbd6f1] bg-white p-8 text-sm text-[#6677a5]">Select a learner from an authorized Learn course roster to review instructional support.</div> : <>
            <article className="mb-5 rounded-3xl border border-[#dfe6f8] bg-white p-5 shadow-sm">
              <p className="text-[10px] font-extrabold tracking-[.16em] text-[#315fd7]">SELECTED LEARNER</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black text-[#071d67]">{selected.displayName}</h2><p className="mt-1 text-sm text-[#6677a5]">{selected.courseTitle} · {selected.progressPercent}% course progress</p></div><span className="rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-bold text-[#315fd7]">Learn instructional support</span></div>
            </article>
            {!signatureEnabled ? <div className="rounded-3xl border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#315fd7]">SIGNATURE EXPERIENCE</p><h3 className="mt-2 text-xl font-black text-[#071d67]">Learner Pulse rollout is currently off.</h3><p className="mt-3 text-sm leading-6 text-[#6677a5]">Enable <code className="rounded bg-[#f1f4fb] px-1.5 py-1">NEXT_PUBLIC_LEARN_TEACHER_SIGNATURE_V1=on</code> in a controlled environment to expose the purpose-scoped projection to authorized Learn educators.</p></div> : loadingPulse ? <div role="status" aria-live="polite" className="rounded-3xl border border-[#dfe6f8] bg-white p-7 text-sm text-[#6677a5]">Loading evidence-aware learner support…</div> : pulse ? <LearnerPulse pulse={pulse} /> : <div className="rounded-3xl border border-[#dfe6f8] bg-white p-7 text-sm text-[#6677a5]">No learner projection is available for this selection.</div>}
          </>}
        </section>
      </div>

      <Card title="Invite a student" subtitle="Access management belongs to the Learn teacher workspace">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={createInvitation}><Input label="Student email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Button type="submit" variant="primary" isLoading={saving}>Create invitation</Button></form>
      </Card>

      <Card title="Student invitations" subtitle="A student becomes active after accepting an invitation">
        {loading ? <p className="text-[#6677a5]">Loading invitations...</p> : invitations.length === 0 ? <p className="text-[#6677a5]">No active invitations yet.</p> : <div className="divide-y divide-[#edf1fb]">{invitations.map((invitation) => <div key={invitation.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-[#071d67]">{invitation.email}</p><p className="text-xs text-[#6677a5]">Code: {invitation.code}</p></div><Badge variant={invitation.usedAt ? "success" : "info"}>{invitation.usedAt ? "Active" : "Invited"}</Badge></div>)}</div>}
      </Card>

      {roster?.limitations?.length ? <aside className="rounded-2xl bg-[#f7f9ff] px-5 py-4 text-xs leading-5 text-[#6677a5]"><b className="text-[#30457f]">Roster limitations:</b> {roster.limitations.join(" ")}</aside> : null}
    </div>
  </div>;
}

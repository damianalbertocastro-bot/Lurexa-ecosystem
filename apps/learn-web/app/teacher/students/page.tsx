"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";

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

  const [searchQuery, setSearchQuery] = useState("");

  function selectLearner(learner: LearnTeacherRosterLearnerV1): void {
    setPulse(null);
    setError(null);
    if (signatureEnabled) setLoadingPulse(true);
    setSelected(learner);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      document.getElementById("learner-projection-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const learnerCount = useMemo(
    () => roster?.courses.reduce((total, course) => total + course.learners.length, 0) ?? 0,
    [roster],
  );

  const filteredCourses = useMemo(() => {
    if (!roster?.courses) return [];
    if (!searchQuery.trim()) return roster.courses;
    const query = searchQuery.toLowerCase().trim();
    return roster.courses.map((c) => ({
      ...c,
      learners: c.learners.filter((l) => l.displayName.toLowerCase().includes(query)),
    })).filter((c) => c.learners.length > 0);
  }, [roster, searchQuery]);

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

  return <>
    <TeacherWorkspaceBanner
      title="Students"
      subtitle="Manage learner access, review course participation, and use purpose-scoped instructional support without leaving Lurexa Learn."
      breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Students" }]}
    />
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-800">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <section aria-label="Authorized course rosters" className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-5 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-[10px] font-extrabold tracking-[.16em] text-[var(--lx-secondary)]">COURSE ROSTERS</p><h2 className="mt-2 text-xl font-black text-[var(--color-brand-navy)]">Choose a learner</h2></div>
            <div className="text-right text-xs font-bold text-[var(--lx-muted)]"><b className="block text-2xl text-[var(--color-brand-navy)]">{loading ? "—" : learnerCount}</b>participating</div>
          </div>

          <div className="mt-4">
            <input
              type="search"
              placeholder="Search students by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-2.5 text-xs text-[var(--color-brand-navy)] placeholder:text-[var(--lx-muted)] focus:border-[var(--lx-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--lx-secondary)]"
            />
          </div>

          <div className="mt-5 space-y-5">
            {loading ? (
              <p aria-live="polite" className="text-sm text-[var(--lx-muted)]">Loading authorized roster…</p>
            ) : filteredCourses.length ? (
              filteredCourses.map((course) => (
                <div key={course.courseId}>
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[.12em] text-[var(--lx-muted)]">{course.courseTitle}</p>
                  <div className="space-y-2.5">
                    {course.learners.length ? (
                      course.learners.map((learner) => {
                        const isSelected = selected?.learnerId === learner.learnerId && selected.courseId === learner.courseId;
                        const initials = learner.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                        return (
                          <Button
                            key={`${course.courseId}:${learner.learnerId}`}
                            type="button"
                            onClick={() => selectLearner(learner)}
                            aria-pressed={isSelected}
                            className={`w-full rounded-2xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-secondary)] ${
                              isSelected
                                ? "border-[var(--lx-secondary)] bg-[var(--lx-surface)] shadow-md ring-1 ring-[var(--lx-secondary)]"
                                : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-[var(--lx-border)] hover:bg-[var(--lx-canvas)]"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black ${
                                isSelected
                                  ? "bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] text-white shadow-sm"
                                  : "bg-[var(--lx-canvas)] text-[var(--lx-primary)] border border-[var(--lx-border)]"
                              }`}>
                                {initials || "S"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <b className="truncate text-sm text-[var(--color-brand-navy)]">{learner.displayName}</b>
                                  <span className="shrink-0 text-xs font-black text-[var(--lx-secondary)]">{learner.progressPercent}%</span>
                                </div>
                                <div className="mt-1 flex items-center justify-between text-xs text-[var(--lx-muted)]">
                                  <span>{learner.completedLessons}/{learner.totalLessons} lessons</span>
                                </div>
                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--lx-canvas)]">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)] transition-all duration-300"
                                    style={{ width: `${Math.max(4, learner.progressPercent)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Button>
                        );
                      })
                    ) : (
                      <p className="rounded-2xl bg-[var(--lx-surface)] p-4 text-sm text-[var(--lx-muted)]">No participating learners match the search.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--lx-muted)]">
                {searchQuery ? "No learners found matching your search." : "No authorized course participation is available yet."}
              </p>
            )}
          </div>
        </section>

        <section id="learner-projection-section" aria-label="Learner instructional support" className="min-w-0">
          {!selected ? <div className="rounded-3xl border border-dashed border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 text-sm text-[var(--lx-muted)]">Select a learner from an authorized Learn course roster to review instructional support.</div> : <>
            <article className="mb-5 rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-5 shadow-sm">
              <p className="text-[10px] font-extrabold tracking-[.16em] text-[var(--lx-secondary)]">SELECTED LEARNER</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black text-[var(--color-brand-navy)]">{selected.displayName}</h2><p className="mt-1 text-sm text-[var(--lx-muted)]">{selected.courseTitle} · {selected.progressPercent}% course progress</p></div><span className="rounded-full bg-[var(--lx-surface)] px-3 py-1.5 text-xs font-bold text-[var(--lx-secondary)] border border-[var(--lx-border)]">Learn instructional support</span></div>
            </article>
            {!signatureEnabled ? <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7"><p className="text-[10px] font-extrabold tracking-[.16em] text-[var(--lx-secondary)]">SIGNATURE EXPERIENCE</p><h3 className="mt-2 text-xl font-black text-[var(--color-brand-navy)]">Learner Pulse rollout is currently off.</h3><p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">Enable <code className="rounded bg-[var(--lx-surface)] px-1.5 py-1">NEXT_PUBLIC_LEARN_TEACHER_SIGNATURE_V1=on</code> in a controlled environment to expose the purpose-scoped projection to authorized Learn educators.</p></div> : loadingPulse ? <div role="status" aria-live="polite" className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 text-sm text-[var(--lx-muted)]">Loading evidence-aware learner support…</div> : pulse ? <LearnerPulse pulse={pulse} /> : <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 text-sm text-[var(--lx-muted)]">No learner projection is available for this selection.</div>}
          </>}
        </section>
      </div>

      <Card title="Invite a student" subtitle="Access management belongs to the Learn teacher workspace">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={createInvitation}><Input label="Student email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Button type="submit" variant="primary" isLoading={saving}>Create invitation</Button></form>
      </Card>

      <Card title="Student invitations" subtitle="A student becomes active after accepting an invitation">
        {loading ? <p className="text-[var(--lx-muted)]">Loading invitations...</p> : invitations.length === 0 ? <p className="text-[var(--lx-muted)]">No active invitations yet.</p> : <div className="divide-y divide-[var(--lx-surface)]">{invitations.map((invitation) => <div key={invitation.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-[var(--color-brand-navy)]">{invitation.email}</p><p className="text-xs text-[var(--lx-muted)]">Code: {invitation.code}</p></div><Badge variant={invitation.usedAt ? "success" : "info"}>{invitation.usedAt ? "Active" : "Invited"}</Badge></div>)}</div>}
      </Card>

      {roster?.limitations?.length ? <aside className="rounded-2xl bg-[var(--lx-surface)] px-5 py-4 text-xs leading-5 text-[var(--lx-muted)]"><b className="text-[var(--lx-muted)]">Roster limitations:</b> {roster.limitations.join(" ")}</aside> : null}
    </div>
  </>;
}

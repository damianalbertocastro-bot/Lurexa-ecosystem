"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CourseInstructionalIntelligenceV1, LearnTeacherInstructionalRosterV1 } from "@lurexa/types";
import { AuthService } from "@lurexa/backend";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";
import { getEcosystemUrl } from "@lurexa/config/domains";

type AuthUser = NonNullable<Parameters<Parameters<typeof AuthService.onUserChanged>[0]>[0]>;
type EnrollmentLearner = { learnerId: string; displayName: string; enrolled: boolean; enrollmentStatus: "active" | "withdrawn" | "completed" | null };
type EnrollmentManagement = { contractVersion: "1"; organizationId: string; courseId: string; courseTitle: string; learners: EnrollmentLearner[] };

const teachGrowthPlanUrl = getEcosystemUrl("teach", "/growth-plan");

async function authenticatedJson<T>(user: AuthUser, url: string, init?: RequestInit): Promise<T> {
  const token = await user.getIdToken();
  const response = await fetch(url, { ...init, headers: { ...(init?.headers ?? {}), authorization: `Bearer ${token}` }, cache: "no-store" });
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error ?? "Unable to load teacher workspace data.");
  return body;
}

export default function TeacherInsightsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roster, setRoster] = useState<LearnTeacherInstructionalRosterV1 | null>(null);
  const [courseId, setCourseId] = useState("");
  const [intelligence, setIntelligence] = useState<CourseInstructionalIntelligenceV1 | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentManagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingLearnerId, setSavingLearnerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCourse = useMemo(() => roster?.courses.find((course) => course.courseId === courseId) ?? null, [roster, courseId]);

  const loadCourse = useCallback(async (activeUser: AuthUser, organizationId: string, selectedCourseId: string) => {
    const params = new URLSearchParams({ organizationId, courseId: selectedCourseId });
    const [nextIntelligence, nextEnrollment] = await Promise.all([
      authenticatedJson<CourseInstructionalIntelligenceV1>(activeUser, `/api/teacher/course-intelligence?${params.toString()}`),
      authenticatedJson<EnrollmentManagement>(activeUser, `/api/teacher/enrollment?${params.toString()}`),
    ]);
    setIntelligence(nextIntelligence);
    setEnrollment(nextEnrollment);
  }, []);

  useEffect(() => AuthService.onUserChanged((activeUser) => {
    if (!activeUser) { router.replace("/login"); return; }
    setUser(activeUser);
    setLoading(true);
    setError(null);
    void authenticatedJson<LearnTeacherInstructionalRosterV1>(activeUser, "/api/teacher/roster")
      .then(async (nextRoster) => {
        setRoster(nextRoster);
        const first = nextRoster.courses[0] ?? null;
        setCourseId(first?.courseId ?? "");
        if (first) await loadCourse(activeUser, first.organizationId, first.courseId);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Unable to load authorized teacher intelligence."))
      .finally(() => setLoading(false));
  }), [loadCourse, router]);

  async function changeCourse(nextCourseId: string) {
    setCourseId(nextCourseId);
    setIntelligence(null);
    setEnrollment(null);
    if (!user || !roster) return;
    const course = roster.courses.find((item) => item.courseId === nextCourseId);
    if (!course) return;
    setLoading(true);
    setError(null);
    try { await loadCourse(user, course.organizationId, course.courseId); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load this course."); }
    finally { setLoading(false); }
  }

  async function updateEnrollment(learner: EnrollmentLearner) {
    if (!user || !selectedCourse) return;
    setSavingLearnerId(learner.learnerId);
    setError(null);
    try {
      await authenticatedJson(user, "/api/teacher/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: selectedCourse.organizationId, courseId: selectedCourse.courseId, learnerId: learner.learnerId, action: learner.enrolled ? "withdraw" : "enroll" }),
      });
      await loadCourse(user, selectedCourse.organizationId, selectedCourse.courseId);
      const nextRoster = await authenticatedJson<LearnTeacherInstructionalRosterV1>(user, "/api/teacher/roster");
      setRoster(nextRoster);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to update enrollment."); }
    finally { setSavingLearnerId(null); }
  }

  return <>
    <TeacherWorkspaceBanner
      title="Course intelligence & enrollment"
      subtitle="Operate student learning from exact-course authorization. Core owns enrollment; Mind-derived signals stay aggregate until you deliberately open an individual learner view."
      breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Insights" }]}
      actions={
        <>
          <Button variant="secondary" onClick={() => router.push("/teacher/students")}>Individual learners</Button>
          <a href={teachGrowthPlanUrl} rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-extrabold text-violet-800">Develop yourself in Teach ↗</a>
        </>
      }
    />
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

    {roster?.courses.length ? <Card title="Authorized course" subtitle="Only courses covered by your current qualification and institutional teaching authorization appear here."><select aria-label="Authorized course" value={courseId} onChange={(event) => void changeCourse(event.target.value)} className="min-h-12 w-full max-w-xl rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 text-sm font-bold text-[var(--lx-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">{roster.courses.map((course) => <option key={course.courseId} value={course.courseId}>{course.courseTitle}</option>)}</select></Card> : null}

    {loading ? <div role="status" className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 text-sm font-bold text-[var(--lx-muted)]">Loading exact-course intelligence…</div> : null}
    {error ? <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-7 text-sm font-bold text-rose-800">{error}</div> : null}

    {intelligence ? <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card title="Enrolled"><b className="text-3xl text-indigo-700">{intelligence.enrollment.total}</b></Card>
        <Card title="Participating"><b className="text-3xl text-blue-700">{intelligence.enrollment.participating}</b></Card>
        <Card title="Not started"><b className="text-3xl text-amber-700">{intelligence.enrollment.notStarted}</b></Card>
        <Card title="Active · 14 days"><b className="text-3xl text-emerald-700">{intelligence.enrollment.active14d}</b></Card>
        <Card title="Average completion"><b className="text-3xl text-violet-700">{intelligence.progress.averagePercent === null ? "—" : `${intelligence.progress.averagePercent}%`}</b></Card>
      </section>

      <Card title="Instructional focus" subtitle="Aggregate governed Knowledge Object signals—not automated learner judgments.">
        <div className="grid gap-3 md:grid-cols-2">{intelligence.focusSignals.length ? intelligence.focusSignals.map((signal) => <div key={signal.knowledgeObjectId} className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><b className="text-sm capitalize text-[var(--lx-ink)]">{signal.label}</b><Badge variant={signal.signal === "watch" ? "warning" : "default"}>{signal.signal}</Badge></div><p className="mt-2 text-xs text-[var(--lx-muted)]">Governed evidence references from {signal.learnerCount} enrolled learner{signal.learnerCount === 1 ? "" : "s"}.</p></div>) : <p className="text-sm text-[var(--lx-muted)]">No governed Knowledge Object signals are available for this course yet.</p>}</div>
        <p className="mt-5 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900"><b>Suggested instructional action:</b> {intelligence.recommendation}</p>
      </Card>

      <aside className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-xs leading-6 text-indigo-900"><b>Privacy boundary:</b> {intelligence.privacyBoundary}</aside>
    </> : null}

    {enrollment ? <Card title="Course enrollment" subtitle="Students can be enrolled before they ever generate progress. Withdrawing preserves the enrollment record and history.">
      <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-y border-[var(--lx-border)] bg-[var(--lx-canvas)] text-xs font-black uppercase tracking-wider text-[var(--lx-muted)]"><tr><th className="px-4 py-3">Learner</th><th className="px-4 py-3">Course state</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{enrollment.learners.map((learner) => <tr key={learner.learnerId}><th className="px-4 py-4 font-bold text-[var(--lx-ink)]">{learner.displayName}</th><td className="px-4 py-4"><Badge variant={learner.enrolled ? "success" : learner.enrollmentStatus === "withdrawn" ? "warning" : "default"}>{learner.enrolled ? "Enrolled" : learner.enrollmentStatus === "withdrawn" ? "Withdrawn" : "Not enrolled"}</Badge></td><td className="px-4 py-4 text-right"><Button size="sm" variant={learner.enrolled ? "secondary" : "primary"} disabled={savingLearnerId === learner.learnerId} onClick={() => void updateEnrollment(learner)}>{savingLearnerId === learner.learnerId ? "Saving…" : learner.enrolled ? "Withdraw" : "Enroll"}</Button></td></tr>)}</tbody></table></div>
    </Card> : null}
    </div>
  </>;
}

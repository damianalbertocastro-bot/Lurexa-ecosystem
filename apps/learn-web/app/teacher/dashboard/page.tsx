"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { Course, Invitation, Lesson } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";

type TeacherCourseSummary = { course: Course; lessons: Array<{ moduleTitle: string; lesson: Lesson }> };
type InviteStatus = { label: "Active" | "Used" | "Expired"; tone: string };

export default function TeacherDashboard() {
  const router = useRouter();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [generatedInvite, setGeneratedInvite] = useState<Invitation | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [revokingInvitationId, setRevokingInvitationId] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const loadCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const response = await authenticatedFetch("/api/learning?teacherDashboard=1");
      const payload = await response.json() as TeacherCourseSummary[] & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load courses.");
      setCourses(payload);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to load courses.");
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadInvitations = async (orgId: string) => {
    setIsLoadingInvitations(true);
    try {
      const loadedInvitations = await OrganizationService.getInvitationsForOrganization(orgId);
      setInvitations(loadedInvitations);
      setCurrentTimestamp(Date.now());
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to load invitations.");
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) {
        setIsLoadingInvitations(false);
        setIsLoadingCourses(false);
        return;
      }
      const memberships = await OrganizationService.getMembershipsForUser(user.uid);
      const membership = memberships.find((item) => ["owner", "admin", "teacher"].includes(item.role));
      if (membership) {
        setCurrentOrgId(membership.orgId);
        await Promise.all([loadInvitations(membership.orgId), loadCourses()]);
      } else {
        setIsLoadingInvitations(false);
        setIsLoadingCourses(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleCreateInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentOrgId) return;
    setLoading(true);
    try {
      const invite = await OrganizationService.createInvitation(currentOrgId, studentEmail, "student");
      setGeneratedInvite(invite);
      setInvitations((current) => [invite, ...current]);
      setStudentEmail("");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to generate invite.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await AuthService.logout();
      router.replace("/login");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to sign out.");
      setIsSigningOut(false);
    }
  };

  const handleCopyInviteCode = async (invite: Invitation) => {
    try {
      await navigator.clipboard.writeText(invite.code);
    } catch {
      alert("Unable to copy the access code. Please copy it manually.");
    }
  };

  const handleRevokeInvitation = async (invite: Invitation) => {
    if (!window.confirm(`Revoke the invitation for ${invite.email}?`)) return;
    setRevokingInvitationId(invite.id);
    try {
      await OrganizationService.revokeInvitation(invite.id);
      setInvitations((current) => current.filter((item) => item.id !== invite.id));
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to revoke invitation.");
    } finally {
      setRevokingInvitationId(null);
    }
  };

  const getInvitationStatus = (invite: Invitation): InviteStatus => {
    if (invite.usedAt) return { label: "Used", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (currentTimestamp !== null && invite.expiresAtMillis <= currentTimestamp) return { label: "Expired", tone: "bg-amber-50 text-amber-900 border-amber-200" };
    return { label: "Active", tone: "bg-indigo-50 text-indigo-800 border-indigo-200" };
  };

  const activeInvites = invitations.filter((invite) => getInvitationStatus(invite).label === "Active").length;
  const publishedCourses = courses.filter(({ course }) => course.status === "published").length;

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)]">
      <header className="border-b border-[var(--learn-line)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <LurexaLearnLogo />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleSignOut} isLoading={isSigningOut}>Sign out</Button>
            <Button variant="secondary" onClick={() => router.push("/teacher/courses/new")}>Create course</Button>
            <Button variant="primary" onClick={() => setIsInviteModalOpen(true)}>Invite learner</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[.17em] text-[var(--learn-brand-strong)]">EDUCATOR WORKSPACE</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--learn-ink)]">Make the next teaching move count.</h1>
            <p className="mt-2 max-w-2xl text-[var(--learn-muted)]">Start with learning context, then create or manage what your class needs.</p>
          </div>
          <button type="button" onClick={() => setIsInviteModalOpen(true)} className="text-left text-sm font-bold text-[var(--learn-brand-strong)] hover:underline">Need to add a learner? Create an access code →</button>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <article className="rounded-3xl bg-[var(--learn-ink)] p-7 text-white sm:p-8">
            <p className="text-xs font-bold tracking-[.17em] text-sky-200">TEACHING FOCUS</p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight">Build the next useful learning experience.</h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-300">Create a course or improve an existing one. As learner evidence becomes available, this space will surface role-appropriate instructional priorities—not raw data.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => router.push("/teacher/courses/new")} className="rounded-xl bg-white px-5 py-3 font-bold text-[var(--learn-ink)] transition hover:bg-[var(--learn-sky)]">Create a course</button>
              <button type="button" onClick={() => router.push("/teacher/courses")} className="rounded-xl border border-white/25 px-5 py-3 font-bold text-white transition hover:bg-white/10">Review courses</button>
            </div>
            <p className="mt-7 border-t border-white/15 pt-4 text-sm text-slate-300"><span className="font-bold text-white">Future signal:</span> Lurexa will surface authorized learner priorities here when evidence supports an intervention.</p>
          </article>

          <aside className="rounded-3xl border border-[var(--learn-line)] bg-white p-7">
            <p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">WORKSPACE SNAPSHOT</p>
            <dl className="mt-6 space-y-5">
              <div className="flex items-end justify-between gap-4 border-b border-[var(--learn-line)] pb-4"><div><dt className="text-sm font-semibold">Published courses</dt><dd className="mt-1 text-sm text-[var(--learn-muted)]">Ready for learners</dd></div><dd className="text-3xl font-bold text-emerald-600">{isLoadingCourses ? "—" : publishedCourses}</dd></div>
              <div className="flex items-end justify-between gap-4 border-b border-[var(--learn-line)] pb-4"><div><dt className="text-sm font-semibold">Active invitations</dt><dd className="mt-1 text-sm text-[var(--learn-muted)]">Learners waiting to join</dd></div><dd className="text-3xl font-bold text-[var(--learn-brand)]">{isLoadingInvitations ? "—" : activeInvites}</dd></div>
              <div className="flex items-end justify-between gap-4"><div><dt className="text-sm font-semibold">Plan</dt><dd className="mt-1 text-sm text-[var(--learn-muted)]">Organization access</dd></div><dd><button type="button" onClick={() => router.push("/teacher/billing")} className="rounded-full bg-[var(--learn-sand)] px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100">Free tier →</button></dd></div>
            </dl>
          </aside>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">COURSE ACTIVITY</p><h2 className="mt-2 text-2xl font-bold tracking-tight">What you are building</h2></div><button type="button" onClick={() => router.push("/teacher/courses")} className="text-sm font-bold text-[var(--learn-brand-strong)] hover:underline">Manage all courses →</button></div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--learn-line)] bg-white">
            {isLoadingCourses ? <p className="p-6 text-sm text-[var(--learn-muted)]">Loading course activity…</p> : courses.length === 0 ? (
              <div className="flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold">Your teaching space is ready.</h3><p className="mt-1 text-sm text-[var(--learn-muted)]">Create the first course, then add a learning mission and activities.</p></div><Button variant="primary" onClick={() => router.push("/teacher/courses/new")}>Create first course</Button></div>
            ) : (
              <div className="divide-y divide-[var(--learn-line)]">
                {courses.map(({ course, lessons }) => (
                  <article key={course.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
                    <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[var(--learn-ink)]">{course.title}</h3><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${course.status === "published" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>{course.status}</span></div><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--learn-muted)]">{course.description}</p><p className="mt-3 text-sm text-slate-600">{lessons.length === 0 ? "No lessons yet" : `${lessons.length} lesson${lessons.length === 1 ? "" : "s"} in progress`}</p><p className="mt-2 text-xs text-slate-400">Updated {new Date(course.updatedAt).toLocaleString()}</p></div>
                    <button type="button" onClick={() => router.push("/teacher/courses")} className="shrink-0 rounded-xl border border-[var(--learn-line)] px-4 py-2.5 text-sm font-bold hover:border-indigo-200 hover:bg-indigo-50">Open course</button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">CLASS ACCESS</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Invite learners without losing context</h2></div><Button variant="secondary" onClick={() => setIsInviteModalOpen(true)}>Create invitation</Button></div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--learn-line)] bg-white">
            {isLoadingInvitations ? <p className="p-6 text-sm text-[var(--learn-muted)]">Loading invitations…</p> : invitations.length === 0 ? <p className="p-7 text-sm text-[var(--learn-muted)]">No invitations yet. Create an access code when you are ready to add a learner.</p> : (
              <div className="divide-y divide-[var(--learn-line)]">
                {invitations.map((invite) => {
                  const status = getInvitationStatus(invite);
                  const isActive = status.label === "Active";
                  return <article key={invite.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"><div><p className="font-bold">{invite.email}</p><p className="mt-1 text-sm text-[var(--learn-muted)]">Access code: <span className="font-mono font-bold tracking-widest text-[var(--learn-ink)]">{invite.code}</span> · Expires {new Date(invite.expiresAt).toLocaleDateString()}</p></div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${status.tone}`}>{status.label}</span>{isActive ? <button type="button" onClick={() => handleCopyInviteCode(invite)} className="rounded-lg border border-[var(--learn-line)] px-3 py-2 text-sm font-bold hover:bg-slate-50">Copy code</button> : null}<button type="button" disabled={revokingInvitationId === invite.id} onClick={() => handleRevokeInvitation(invite)} className="rounded-lg px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">Revoke</button></div></article>;
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal isOpen={isInviteModalOpen} onClose={() => { setIsInviteModalOpen(false); setGeneratedInvite(null); }} title="Invite a learner">
        {!generatedInvite ? (
          <form onSubmit={handleCreateInvite} className="space-y-4"><p className="text-sm leading-6 text-[var(--learn-muted)]">Create an access code for a learner. Email delivery can be added later; you can copy the code after creating it.</p><Input id="student-email" label="Learner email address" type="email" placeholder="learner@example.com" value={studentEmail} onChange={(event) => setStudentEmail(event.target.value)} required /><Button type="submit" variant="primary" className="w-full" isLoading={loading}>Create access code</Button></form>
        ) : (
          <div className="space-y-5 text-center"><p className="text-sm leading-6 text-[var(--learn-muted)]">Share this code with the learner so they can join your teaching space.</p><div className="rounded-2xl bg-[var(--learn-sky)] py-4 text-3xl font-bold tracking-[.2em] text-[var(--learn-brand-strong)]">{generatedInvite.code}</div><Button variant="primary" className="w-full" onClick={() => handleCopyInviteCode(generatedInvite)}>Copy access code</Button><Button variant="secondary" className="w-full" onClick={() => setGeneratedInvite(null)}>Create another invitation</Button></div>
        )}
      </Modal>
    </main>
  );
}

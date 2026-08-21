"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, OrganizationService } from "@lurexa/backend";
import type { Course, Invitation, Lesson } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type TeacherCourseSummary = {
  course: Course;
  lessons: Array<{ moduleTitle: string; lesson: Lesson }>;
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [generatedInvite, setGeneratedInvite] = useState<Invitation | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [revokingInvitationId, setRevokingInvitationId] = useState<string | null>(null);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  async function loadCourses() {
    setIsLoadingCourses(true);
    try {
      const response = await authenticatedFetch("/api/learning?teacherDashboard=1");
      const payload = (await response.json()) as TeacherCourseSummary[] & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load courses.");
      setCourses(payload);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to load courses.");
    } finally {
      setIsLoadingCourses(false);
    }
  }

  async function loadInvitations(orgId: string) {
    setIsLoadingInvitations(true);
    try {
      setInvitations(await OrganizationService.getInvitationsForOrganization(orgId));
      setCurrentTimestamp(Date.now());
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to load invitations.");
    } finally {
      setIsLoadingInvitations(false);
    }
  }

  useEffect(() => {
    return AuthService.onUserChanged(async (user) => {
      if (user) {
        const memberships = await OrganizationService.getMembershipsForUser(user.uid);
        const membership = memberships.find((item) => ["owner", "admin", "teacher"].includes(item.role));
        if (membership) {
          setCurrentOrgId(membership.orgId);
          await Promise.all([loadInvitations(membership.orgId), loadCourses()]);
          return;
        }
      }
      setIsLoadingInvitations(false);
      setIsLoadingCourses(false);
    });
  }, []);

  async function handleCreateInvite(event: React.FormEvent) {
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
  }

  async function handleCopyInviteCode(invite: Invitation) {
    try {
      await navigator.clipboard.writeText(invite.code);
    } catch {
      alert("Unable to copy the access code. Please copy it manually.");
    }
  }

  async function handleRevokeInvitation(invite: Invitation) {
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
  }

  function invitationStatus(invite: Invitation) {
    if (invite.usedAt) return { label: "Used", variant: "success" as const };
    if (currentTimestamp !== null && invite.expiresAtMillis <= currentTimestamp) {
      return { label: "Expired", variant: "warning" as const };
    }
    return { label: "Active", variant: "info" as const };
  }

  const activeInvitations = invitations.filter((invite) => invitationStatus(invite).label === "Active").length;
  const publishedCourses = courses.filter(({ course }) => course.status === "published").length;

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-10 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">EDUCATOR WORKSPACE · LUREXA LEARN</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-6xl">Make every lesson count.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">Create learning experiences, manage learners, and act on the next useful classroom signal. Professional growth belongs in Lurexa Teach; teaching operations stay here.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => router.push("/teacher/courses/new")} className="min-h-12 rounded-xl bg-white px-5 text-sm font-extrabold text-[#30218e] shadow-xl">Create course →</button>
            <button type="button" onClick={() => setIsInviteModalOpen(true)} className="min-h-12 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white">Invite student</button>
          </div>
        </div>
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Teacher workspace shortcuts">
        {[
          ["Dashboard", "/teacher/dashboard"],
          ["Courses", "/teacher/courses"],
          ["Students", "/teacher/students"],
          ["Insights", "/teacher/insights"],
          ["Studio", "/teacher/studio"],
          ["Billing", "/teacher/billing"],
        ].map(([label, href], index) => (
          <button key={href} type="button" onClick={() => router.push(href)} className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-extrabold ${index === 0 ? "border-[#592bd6] bg-[#592bd6] text-white" : "border-[#d7e0f6] bg-white text-[#3450a8]"}`}>{label}</button>
        ))}
      </nav>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <button type="button" onClick={() => router.push("/teacher/students")} className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 text-left shadow-[0_12px_30px_rgba(32,52,128,.06)] transition hover:-translate-y-1">
          <p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">ACTIVE INVITATIONS</p><b className="mt-2 block text-4xl tracking-[-.055em] text-[#592bd6]">{activeInvitations}</b><span className="mt-2 block text-sm font-bold text-[#315fd7]">Manage students →</span>
        </button>
        <button type="button" onClick={() => router.push("/teacher/courses")} className="rounded-[26px] border border-[#cfeee9] bg-[#e9fbf9] p-6 text-left shadow-[0_12px_30px_rgba(32,52,128,.05)] transition hover:-translate-y-1">
          <p className="text-[10px] font-extrabold tracking-[.15em] text-[#137d7f]">PUBLISHED COURSES</p><b className="mt-2 block text-4xl tracking-[-.055em] text-[#137d7f]">{publishedCourses}</b><span className="mt-2 block text-sm font-bold text-[#137d7f]">Manage courses →</span>
        </button>
        <button type="button" onClick={() => router.push("/teacher/billing")} className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 text-left shadow-[0_12px_30px_rgba(32,52,128,.06)] transition hover:-translate-y-1">
          <p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">CURRENT PLAN</p><div className="mt-3"><Badge variant="info">Free Tier</Badge></div><span className="mt-4 block text-sm font-bold text-[#315fd7]">View billing →</span>
        </button>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <article className="rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">COURSES & LESSONS</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Recent teaching activity</h2></div><Button variant="secondary" onClick={() => router.push("/teacher/courses")}>View all →</Button></div>
          {isLoadingCourses ? <p className="py-8 text-sm text-[#6677a5]">Loading courses...</p> : courses.length === 0 ? <div className="py-8"><p className="text-sm text-[#6677a5]">No courses yet. Create a course to start adding lessons.</p><Button variant="primary" className="mt-4" onClick={() => router.push("/teacher/courses/new")}>Create course</Button></div> : <div className="mt-5 divide-y divide-[#edf1fb]">{courses.slice(0, 4).map(({ course, lessons }) => <div key={course.id} className="py-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><b className="text-lg text-[#10245f]">{course.title}</b><Badge variant={course.status === "published" ? "success" : "warning"}>{course.status}</Badge></div><p className="mt-2 text-sm leading-6 text-[#6677a5]">{course.description}</p><p className="mt-2 text-xs text-[#8794b6]">{lessons.length} lesson{lessons.length === 1 ? "" : "s"} · updated {new Date(course.updatedAt).toLocaleDateString()}</p></div><Button variant="secondary" size="sm" onClick={() => router.push("/teacher/courses")}>Manage</Button></div></div>)}</div>}
        </article>

        <article className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#071d67] via-[#173a9d] to-[#315fd7] p-7 text-white shadow-[0_18px_38px_rgba(32,52,128,.2)] sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#12cdd4]/25 blur-2xl" />
          <p className="relative text-[10px] font-extrabold tracking-[.18em] text-[#9af4ef]">NEXT OPERATIONAL PRIORITY</p>
          <h2 className="relative mt-4 text-2xl font-black tracking-[-.04em]">Bring the next learner into the class.</h2>
          <p className="relative mt-4 text-sm leading-7 text-indigo-100">Create a secure invitation code, then manage active, used, or expired access from one place.</p>
          <button type="button" onClick={() => setIsInviteModalOpen(true)} className="relative mt-7 min-h-11 rounded-xl bg-white px-4 text-sm font-extrabold text-[#30218e]">Create student invitation →</button>
        </article>
      </section>

      <section className="mt-6 rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)] sm:p-8">
        <div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">STUDENT INVITATIONS</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Access management</h2><p className="mt-2 text-sm text-[#6677a5]">Share access codes manually until email delivery is configured.</p></div>
        {isLoadingInvitations ? <p className="py-8 text-sm text-[#6677a5]">Loading invitations...</p> : invitations.length === 0 ? <p className="py-8 text-sm text-[#6677a5]">No invitations have been created yet.</p> : <div className="mt-5 divide-y divide-[#edf1fb]">{invitations.map((invite) => { const status = invitationStatus(invite); const active = status.label === "Active"; return <div key={invite.id} className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"><div><b className="text-[#10245f]">{invite.email}</b><p className="mt-1 text-xs text-[#8794b6]">Code: <span className="font-semibold tracking-wider">{invite.code}</span> · Expires {new Date(invite.expiresAt).toLocaleDateString()}</p></div><div className="flex flex-wrap items-center gap-2"><Badge variant={status.variant}>{status.label}</Badge>{active ? <Button variant="secondary" size="sm" onClick={() => handleCopyInviteCode(invite)}>Copy code</Button> : null}<Button variant="destructive" size="sm" isLoading={revokingInvitationId === invite.id} onClick={() => handleRevokeInvitation(invite)}>Revoke</Button></div></div>; })}</div>}
      </section>

      <Modal isOpen={isInviteModalOpen} onClose={() => { setIsInviteModalOpen(false); setGeneratedInvite(null); }} title="Invite student to class">
        {!generatedInvite ? <form onSubmit={handleCreateInvite} className="space-y-4"><Input id="student-email" label="Student Email Address" type="email" placeholder="student@school.edu" value={studentEmail} onChange={(event) => setStudentEmail(event.target.value)} required /><Button type="submit" variant="primary" className="w-full" isLoading={loading}>Generate access code</Button></form> : <div className="space-y-4 text-center"><p className="text-sm text-slate-600">Share this 6-character code with your student to let them join:</p><div className="rounded-xl bg-[#f3f1ff] py-4 text-2xl font-black tracking-widest text-[#592bd6]">{generatedInvite.code}</div><Button variant="primary" className="w-full" onClick={() => handleCopyInviteCode(generatedInvite)}>Copy access code</Button><Button variant="secondary" className="w-full" onClick={() => setGeneratedInvite(null)}>Invite another student</Button></div>}
      </Modal>
    </main>
  );
}

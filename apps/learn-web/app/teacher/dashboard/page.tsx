"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { Course, Invitation, Lesson } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";

type TeacherCourseSummary = { course: Course; lessons: Array<{ moduleTitle: string; lesson: Lesson }> };

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
      setCurrentTimestamp(new Date().getTime());
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to load invitations.");
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (user) {
        const memberships = await OrganizationService.getMembershipsForUser(user.uid);
        const membership = memberships.find((item) =>
          ["owner", "admin", "teacher"].includes(item.role),
        );
        if (membership) {
          setCurrentOrgId(membership.orgId);
          await Promise.all([loadInvitations(membership.orgId), loadCourses()]);
          return;
        }
      }
      setIsLoadingInvitations(false);
    });
    return unsubscribe;
  }, []);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId) return;
    setLoading(true);

    try {
      const invite = await OrganizationService.createInvitation(
        currentOrgId,
        studentEmail,
        "student"
      );
      setGeneratedInvite(invite);
      setInvitations((currentInvitations) => [invite, ...currentInvitations]);
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
      setInvitations((currentInvitations) =>
        currentInvitations.filter((currentInvite) => currentInvite.id !== invite.id),
      );
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to revoke invitation.");
    } finally {
      setRevokingInvitationId(null);
    }
  };

  const getInvitationStatus = (invite: Invitation) => {
    if (invite.usedAt) return { label: "Used", variant: "success" as const };
    if (currentTimestamp !== null && invite.expiresAtMillis <= currentTimestamp) {
      return { label: "Expired", variant: "warning" as const };
    }
    return { label: "Active", variant: "info" as const };
  };

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <LurexaLearnLogo />
            <div><p className="text-xs font-bold tracking-[.16em] text-indigo-700">EDUCATOR WORKSPACE</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--learn-ink)]">Make every lesson count.</h1>
            <p className="text-slate-500">Create learning experiences and see the next useful action.</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={handleSignOut} isLoading={isSigningOut}>
              Sign out
            </Button>
            <Button variant="secondary" onClick={() => router.push("/teacher/courses/new")}>
              Create course
            </Button>
            <Button variant="primary" onClick={() => setIsInviteModalOpen(true)}>
              + Create student invitation
            </Button>
          </div>
        </div>

        {/* Workspace navigation */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-0 bg-white shadow-lg shadow-slate-200/60" title="Active Students" subtitle="View roster and manage invitations">
            <button type="button" className="w-full text-left" onClick={() => router.push("/teacher/students")}>
              <span className="text-3xl font-bold text-indigo-600">{invitations.filter((invite) => getInvitationStatus(invite).label === "Active").length}</span>
              <span className="mt-2 block text-sm font-medium text-indigo-600">Manage students →</span>
            </button>
          </Card>
          <Card className="border-0 bg-white shadow-lg shadow-slate-200/60" title="Active Courses" subtitle="Create and manage courses and lessons">
            <button type="button" className="w-full text-left" onClick={() => router.push("/teacher/courses")}>
              <span className="text-3xl font-bold text-emerald-600">{courses.filter(({ course }) => course.status === "published").length}</span>
              <span className="mt-2 block text-sm font-medium text-emerald-600">Manage courses →</span>
            </button>
          </Card>
          <Card className="border-0 bg-[var(--learn-mint)] shadow-lg shadow-emerald-950/5" title="Current Plan" subtitle="Organization tier and billing">
            <button type="button" className="w-full text-left" onClick={() => router.push("/teacher/billing")}>
              <Badge variant="info">Free Tier</Badge>
              <span className="mt-2 block text-sm font-medium text-indigo-600">View plan →</span>
            </button>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-slate-200/60" title="Courses & lessons" subtitle="Recent activity across your teaching workspace">
          {isLoadingCourses ? (
            <p className="py-3 text-sm text-slate-500">Loading courses...</p>
          ) : courses.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <p className="text-sm text-slate-500">No courses yet. Create a course to start adding lessons.</p>
              <Button variant="secondary" onClick={() => router.push("/teacher/courses/new")}>Create course</Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 pt-2">
              {courses.map(({ course, lessons }) => (
                <div key={course.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{course.title}</p>
                      <Badge variant={course.status === "published" ? "success" : "warning"}>{course.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{course.description}</p>
                    <p className="mt-2 text-xs text-slate-500">Last updated {new Date(course.updatedAt).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-slate-700">
                      {lessons.length === 0 ? "No lessons yet" : lessons.map(({ moduleTitle, lesson }) => `${moduleTitle}: ${lesson.title}`).join(" · ")}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => router.push("/teacher/courses")}>Manage</Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Student Roster Card */}
        <Card title="Class Roster" subtitle="Students with active access">
          <div className="divide-y divide-slate-100 pt-2">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">Student Account</p>
                <p className="text-xs text-slate-500">Joined via Class Code</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>

        <Card title="Student Invitations" subtitle="Share access codes manually until email delivery is configured">
          {isLoadingInvitations ? (
            <p className="py-3 text-sm text-slate-500">Loading invitations...</p>
          ) : invitations.length === 0 ? (
            <p className="py-3 text-sm text-slate-500">No invitations have been created yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 pt-2">
              {invitations.map((invite) => {
                const status = getInvitationStatus(invite);
                const isActive = status.label === "Active";

                return (
                  <div key={invite.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{invite.email}</p>
                      <p className="text-xs text-slate-500">
                        Code: <span className="font-semibold tracking-wider">{invite.code}</span> · Expires {new Date(invite.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {isActive && (
                        <Button variant="secondary" size="sm" onClick={() => handleCopyInviteCode(invite)}>
                          Copy code
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        isLoading={revokingInvitationId === invite.id}
                        onClick={() => handleRevokeInvitation(invite)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setGeneratedInvite(null);
        }}
        title="Invite Student to Class"
      >
        {!generatedInvite ? (
          <form onSubmit={handleCreateInvite} className="space-y-4">
            <Input
              id="student-email"
              label="Student Email Address"
              type="email"
              placeholder="student@school.edu"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Generate Access Code
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-600">
              Share this 6-character code with your student to let them join:
            </p>
            <div className="rounded-lg bg-slate-100 py-3 text-2xl font-bold tracking-widest text-indigo-600">
              {generatedInvite.code}
            </div>
            <Button variant="primary" className="w-full" onClick={() => handleCopyInviteCode(generatedInvite)}>
              Copy access code
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setGeneratedInvite(null)}
            >
              Invite Another Student
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

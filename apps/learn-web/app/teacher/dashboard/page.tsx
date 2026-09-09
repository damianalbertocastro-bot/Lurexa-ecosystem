"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, CourseService, OrganizationService } from "@lurexa/backend";
import { Course, Invitation, Lesson } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";

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

  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const showFeedback = (text: string, type: "error" | "success" = "error") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  useEffect(() => {
    const loadCourses = async (orgId: string) => {
      setIsLoadingCourses(true);
      try {
        const response = await authenticatedFetch("/api/learning?teacherDashboard=1");
        if (response.ok) {
          const payload = (await response.json()) as TeacherCourseSummary[];
          setCourses(payload);
          return;
        }
        // Edge/Cloudflare Workers fallback: query via client CourseService
        const orgCourses = await CourseService.getCoursesByOrg(orgId);
        setCourses(orgCourses.map((c) => ({ course: c, lessons: [] })));
      } catch {
        try {
          const orgCourses = await CourseService.getCoursesByOrg(orgId);
          setCourses(orgCourses.map((c) => ({ course: c, lessons: [] })));
        } catch {
          showFeedback("Unable to load teaching courses. Please refresh or check connection.", "error");
        }
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
        showFeedback(error instanceof Error ? error.message : "Unable to load invitations.", "error");
      } finally {
        setIsLoadingInvitations(false);
      }
    };

    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (user) {
        const memberships = await OrganizationService.getMembershipsForUser(user.uid);
        const membership = memberships.find((item) =>
          ["owner", "admin", "teacher"].includes(item.role),
        );
        if (membership) {
          setCurrentOrgId(membership.orgId);
          await Promise.all([loadInvitations(membership.orgId), loadCourses(membership.orgId)]);
          return;
        }
      }
      setIsLoadingInvitations(false);
      setIsLoadingCourses(false);
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
      showFeedback("Student invitation created successfully!", "success");
    } catch (error: unknown) {
      showFeedback(error instanceof Error ? error.message : "Failed to generate invite.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = async (invite: Invitation) => {
    try {
      await navigator.clipboard.writeText(invite.code);
      showFeedback("Access code copied to clipboard!", "success");
    } catch {
      showFeedback("Unable to copy the access code automatically. Please copy it manually.", "error");
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
      showFeedback(`Invitation for ${invite.email} has been revoked.`, "success");
    } catch (error: unknown) {
      showFeedback(error instanceof Error ? error.message : "Unable to revoke invitation.", "error");
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
    <>
      <TeacherWorkspaceBanner
        title="Make every lesson count."
        subtitle="Create learning experiences and see the next useful action."
        actions={
          <>
            <Button variant="secondary" onClick={() => router.push("/teacher/courses/new")}>Create course</Button>
            <Button variant="secondary" onClick={() => router.push("/teacher/insights")}>View class progress</Button>
            <Button variant="primary" onClick={() => setIsInviteModalOpen(true)}>+ Create student invitation</Button>
          </>
        }
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {feedbackMessage && (
          <div
            role="alert"
            className={`flex items-center justify-between rounded-xl border p-4 text-sm font-semibold transition ${
              feedbackMessage.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300"
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="ml-4 text-xs font-bold uppercase tracking-wider opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace navigation */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-0 bg-[var(--lx-surface)] shadow-lg shadow-slate-200/60" title="Active Students" subtitle="View roster and manage invitations">
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-4xl font-black tracking-tight text-[var(--lx-ink)]">
                {invitations.filter((invite) => getInvitationStatus(invite).label === "Active").length}
              </span>
              <Button variant="secondary" size="sm" onClick={() => router.push("/teacher/students")}>
                Manage students →
              </Button>
            </div>
          </Card>
          <Card className="border-0 bg-[var(--lx-surface)] shadow-lg shadow-slate-200/60" title="Active Courses" subtitle="Create and manage courses and lessons">
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-4xl font-black tracking-tight text-[var(--lx-ink)]">
                {courses.filter(({ course }) => course.status === "published").length}
              </span>
              <Button variant="secondary" size="sm" onClick={() => router.push("/teacher/courses")}>
                Manage courses →
              </Button>
            </div>
          </Card>
          <Card className="border-0 bg-[var(--learn-mint)] shadow-lg shadow-emerald-950/5" title="Current Plan" subtitle="Organization tier and billing">
            <div className="flex items-baseline justify-between pt-2">
              <Badge variant="info">Free Tier</Badge>
              <Button variant="secondary" size="sm" onClick={() => router.push("/teacher/billing")}>
                View plan →
              </Button>
            </div>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-slate-200/60" title="Courses & lessons" subtitle="Recent activity across your teaching workspace">
          {isLoadingCourses ? (
            <p className="py-3 text-sm text-[var(--lx-muted)]">Loading courses...</p>
          ) : courses.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <p className="text-sm text-[var(--lx-muted)]">No courses yet. Create a course to start adding lessons.</p>
              <Button variant="secondary" onClick={() => router.push("/teacher/courses/new")}>Create course</Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 pt-2">
              {courses.map(({ course, lessons }) => (
                <div key={course.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-[var(--lx-ink)]">{course.title}</p>
                      <Badge variant={course.status === "published" ? "success" : "warning"}>{course.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--lx-muted)]">{course.description}</p>
                    <p className="mt-2 text-xs text-[var(--lx-muted)]">Last updated {new Date(course.updatedAt).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-[var(--lx-muted)]">
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
                <p className="font-medium text-[var(--lx-ink)]">Student Account</p>
                <p className="text-xs text-[var(--lx-muted)]">Joined via Class Code</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>

        <Card title="Student Invitations" subtitle="Share access codes manually until email delivery is configured">
          {isLoadingInvitations ? (
            <p className="py-3 text-sm text-[var(--lx-muted)]">Loading invitations...</p>
          ) : invitations.length === 0 ? (
            <p className="py-3 text-sm text-[var(--lx-muted)]">No invitations have been created yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 pt-2">
              {invitations.map((invite) => {
                const status = getInvitationStatus(invite);
                const isActive = status.label === "Active";

                return (
                  <div key={invite.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-[var(--lx-ink)]">{invite.email}</p>
                      <p className="text-xs text-[var(--lx-muted)]">
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
            <p className="text-sm text-[var(--lx-muted)]">
              Share this 6-character code with your student to let them join:
            </p>
            <div className="rounded-lg bg-[var(--lx-canvas)] py-3 text-2xl font-bold tracking-widest text-indigo-600">
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
    </>
  );
}

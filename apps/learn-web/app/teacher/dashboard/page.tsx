"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { Invitation } from "@lurexa/types";

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
          await loadInvitations(membership.orgId);
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
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">LUREXA TEACH</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Your teaching workspace</h1>
            <p className="text-slate-500">Create learning experiences and manage student access.</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card title="Active Students" subtitle="Total enrolled">
            <span className="text-3xl font-bold text-indigo-600">24</span>
          </Card>
          <Card title="Active Courses" subtitle="Published modules">
            <span className="text-3xl font-bold text-emerald-600">3</span>
          </Card>
          <Card title="Current Plan" subtitle="Organization tier">
            <Badge variant="info">Free Tier</Badge>
          </Card>
        </div>

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

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { Invitation } from "@lurexa/types";

export default function TeacherDashboard() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [generatedInvite, setGeneratedInvite] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);

  useEffect(() => {
    AuthService.onUserChanged(async (user) => {
      if (user) {
        const claims = await AuthService.getUserClaims(user);
        if (claims.orgId) setCurrentOrgId(claims.orgId);
      }
    });
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
      setStudentEmail("");
    } catch (err: any) {
      alert(err.message || "Failed to generate invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Teacher Management Portal</h1>
            <p className="text-slate-500">Manage your school, classes, and student access</p>
          </div>
          <Button variant="primary" onClick={() => setIsInviteModalOpen(true)}>
            + Invite Student
          </Button>
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
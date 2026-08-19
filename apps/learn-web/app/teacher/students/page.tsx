"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { Invitation } from "@lurexa/types";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Input } from "@lurexa/ui/Input";

export default function TeacherStudentsPage() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) { setLoading(false); return; }
      const membership = (await OrganizationService.getMembershipsForUser(user.uid)).find((item) => ["owner", "admin", "teacher"].includes(item.role));
      if (!membership) { setLoading(false); return; }
      setOrgId(membership.orgId);
      setInvitations(await OrganizationService.getInvitationsForOrganization(membership.orgId));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const createInvitation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!orgId) return;
    setSaving(true);
    try {
      const invitation = await OrganizationService.createInvitation(orgId, email, "student");
      setInvitations((current) => [invitation, ...current]);
      setEmail("");
    } catch (error: unknown) { alert(error instanceof Error ? error.message : "Unable to create invitation."); } finally { setSaving(false); }
  };

  return <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8"><div className="mx-auto max-w-4xl space-y-6">
    <div className="flex flex-col gap-4 border-b border-[#dfe7fb] pb-6 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-[#071d67]">Students</h1><p className="text-[#6677a5]">Invite learners and track active access.</p></div><Button variant="secondary" onClick={() => router.push("/teacher/dashboard")}>Back to dashboard</Button></div>
    <Card title="Create student invitation" subtitle="Send the access code to the student manually"><form className="flex flex-col gap-3 sm:flex-row" onSubmit={createInvitation}><Input label="Student email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Button type="submit" variant="primary" isLoading={saving}>Create invitation</Button></form></Card>
    <Card title="Active student invitations" subtitle="A student becomes active after accepting an invitation">{loading ? <p className="text-[#6677a5]">Loading students...</p> : invitations.length === 0 ? <p className="text-[#6677a5]">No active invitations yet.</p> : <div className="divide-y divide-[#edf1fb]">{invitations.map((invitation) => <div key={invitation.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-[#071d67]">{invitation.email}</p><p className="text-xs text-[#6677a5]">Code: {invitation.code}</p></div><Badge variant={invitation.usedAt ? "success" : "info"}>{invitation.usedAt ? "Active" : "Invited"}</Badge></div>)}</div>}</Card>
  </div></div>;
}

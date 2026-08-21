"use client";

import React, { useEffect, useState } from "react";
import { AuthService, OrganizationService } from "@lurexa/backend";
import type { Invitation } from "@lurexa/types";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";

export default function TeacherStudentsPage() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => AuthService.onUserChanged(async (user) => {
    if (!user) {
      setError("Sign in as an educator to manage learner access.");
      setLoading(false);
      return;
    }
    try {
      const membership = (await OrganizationService.getMembershipsForUser(user.uid)).find((item) => ["owner", "admin", "teacher"].includes(item.role));
      if (!membership) throw new Error("No educator organization is available for this account.");
      setOrgId(membership.orgId);
      setInvitations(await OrganizationService.getInvitationsForOrganization(membership.orgId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load learner access.");
    } finally {
      setLoading(false);
    }
  }), []);

  async function createInvitation(event: React.FormEvent) {
    event.preventDefault();
    if (!orgId) return;
    setSaving(true);
    setError("");
    try {
      const invitation = await OrganizationService.createInvitation(orgId, email, "student");
      setInvitations((current) => [invitation, ...current]);
      setEmail("");
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to create invitation.");
    } finally {
      setSaving(false);
    }
  }

  const active = invitations.filter((invitation) => !invitation.usedAt).length;
  const joined = invitations.filter((invitation) => Boolean(invitation.usedAt)).length;

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-10 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="relative"><p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">LEARNER ACCESS · LUREXA LEARN</p><h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-5xl">Bring learners into the right class.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100">Create invitation codes and see whether each invitation is still waiting or has already been used.</p></div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2"><article className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">WAITING INVITATIONS</p><b className="mt-3 block text-4xl tracking-[-.055em] text-[#592bd6]">{active}</b></article><article className="rounded-[26px] border border-[#cfeee9] bg-[#e9fbf9] p-6 shadow-[0_12px_30px_rgba(32,52,128,.05)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#137d7f]">JOINED THROUGH CODE</p><b className="mt-3 block text-4xl tracking-[-.055em] text-[#137d7f]">{joined}</b></article></section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
        <article className="rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)]"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">CREATE INVITATION</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em] text-[#10245f]">Give one learner access.</h2><p className="mt-2 text-sm leading-6 text-[#6677a5]">Email delivery is not assumed yet. Create the code here and share it through your normal class communication channel.</p><form className="mt-6 space-y-4" onSubmit={createInvitation}><Input label="Student email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Button type="submit" variant="primary" className="w-full" isLoading={saving}>Create invitation →</Button></form></article>

        <article className="rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)]"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">ACCESS HISTORY</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em] text-[#10245f]">Student invitations</h2>{loading ? <p className="mt-6 text-sm text-[#6677a5]">Loading learners…</p> : error ? <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : invitations.length === 0 ? <p className="mt-6 rounded-2xl bg-[#f7f9ff] p-5 text-sm text-[#6677a5]">No invitations yet.</p> : <div className="mt-5 divide-y divide-[#edf1fb]">{invitations.map((invitation) => <div key={invitation.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><b className="text-[#10245f]">{invitation.email}</b><p className="mt-1 text-xs text-[#6677a5]">Code: <span className="font-semibold tracking-wider">{invitation.code}</span></p></div><Badge variant={invitation.usedAt ? "success" : "info"}>{invitation.usedAt ? "Joined" : "Invited"}</Badge></div>)}</div>}</article>
      </section>
    </main>
  );
}

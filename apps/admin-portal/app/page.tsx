"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AuthService } from "@lurexa/backend";
import type { AdminDashboardProjection, AdminOrgOverview } from "@lurexa/types";
import { authenticatedFetch } from "../lib/authenticated-fetch";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [projection, setProjection] = useState<AdminDashboardProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => AuthService.onUserChanged(async (user) => {
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      const claims = await AuthService.getUserClaims(user);
      if (claims.role !== "super_admin") throw new Error("Superadmin access is required.");
      const response = await authenticatedFetch("/api/admin");
      const payload = await response.json() as AdminDashboardProjection & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load platform operations.");
      setProjection(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load platform operations.");
    } finally {
      setLoading(false);
    }
  }), [router]);

  async function handleToggleOrgStatus(orgId: string, currentStatus: "active" | "suspended") {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const response = await authenticatedFetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, status: nextStatus }),
      });
      const payload = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to update organization status.");
      setProjection((current) => current ? {
        ...current,
        organizations: current.organizations.map((organization) => organization.id === orgId
          ? { ...organization, status: nextStatus }
          : organization),
      } : current);
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : "Failed to update status.");
    }
  }

  async function signOut() {
    await AuthService.logout();
    router.replace("/login");
  }

  if (loading) return <div role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#f6f8ff] px-5 text-center text-sm font-bold text-[#536aab]">Verifying platform access…</div>;

  if (error || !projection) {
    return <main className="grid min-h-screen place-items-center bg-[#f6f8ff] px-5"><section className="w-full max-w-lg rounded-[30px] border border-red-100 bg-white p-8 shadow-[0_24px_70px_rgba(31,50,120,.10)]"><ProductMark product="admin"/><p className="mt-7 text-[10px] font-extrabold tracking-[.18em] text-[#b52c49]">ACCESS REQUIRED</p><h1 className="mt-3 text-3xl font-black tracking-[-.05em] text-[#071d67]">Platform operations are restricted.</h1><p role="alert" className="mt-4 text-sm leading-6 text-[#6677a5]">{error || "Superadmin access is required."}</p><div className="mt-6 flex flex-wrap gap-3"><Button variant="secondary" onClick={() => router.replace("/login")}>Admin sign in</Button><Button variant="ghost" onClick={signOut}>Sign out</Button></div></section></main>;
  }

  const metrics = projection.metrics;
  const orgs: AdminOrgOverview[] = projection.organizations;
  const metricCards = [
    ["Monthly active learners", metrics.activeUsersMonthly.toLocaleString(), "Learners with progress activity in the last 30 days"],
    ["Organizations", metrics.totalOrganizations.toLocaleString(), "Organizations currently stored in Core"],
    ["Recorded AI tokens", metrics.totalAITokensUsed.toLocaleString(), "Tokens recorded in AI conversation telemetry"],
    ["System error rate", metrics.systemErrorRatePercent == null ? "Not instrumented" : `${metrics.systemErrorRatePercent}%`, "No value is shown until error telemetry is connected"],
  ] as const;

  return <main className="min-h-screen bg-[#f6f8ff] text-[#071d67]">
    <section className="border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#142f85] to-[#2355bf] text-white"><div className="mx-auto max-w-7xl px-5 py-6 sm:px-8"><header className="flex flex-wrap items-center justify-between gap-5"><a href={ecosystemUrl} className="rounded-xl"><ProductMark product="admin" inverse /></a><div className="flex flex-wrap items-center gap-2"><Badge variant="info">Superadmin</Badge><a href={ecosystemUrl} className="inline-flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white motion-reduce:transition-none">Ecosystem <span aria-hidden="true">↗</span></a><button type="button" onClick={signOut} className="min-h-11 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-extrabold text-white transition hover:bg-white hover:text-[#071d67] motion-reduce:transition-none">Sign out</button></div></header><div className="mt-14 max-w-2xl pb-7"><p className="text-[10px] font-extrabold tracking-[.2em] text-[#7ee9ed]">PLATFORM OPERATIONS</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">A trusted foundation<br/>for every learner.</h1><p className="mt-4 text-sm leading-6 text-indigo-100">Monitor only the operational signals the platform can currently support with real data. Missing telemetry is shown as unavailable instead of estimated.</p><p className="mt-4 text-xs font-bold text-indigo-200">Projection refreshed {new Date(projection.generatedAt).toLocaleString()}</p></div></div></section>

    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">{metricCards.map(([label, value, detail], index) => <Card key={label} className={index === 0 ? "border-[#c7d4fa] bg-[#eff3ff]" : ""}><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6c7ba4]">{label}</p><b className="mt-3 block text-3xl tracking-[-.06em] text-[#071d67]">{value}</b><p className="mt-2 text-xs font-semibold leading-5 text-[#64749b]">{detail}</p></Card>)}</div>

      <Card title="Institution directory" subtitle="Manage school tenants, access, and plan enforcement."><div className="overflow-x-auto rounded-xl"><table className="w-full min-w-[720px] text-left text-sm"><caption className="sr-only">Lurexa institution directory with plan, student count, creation date, status, and account actions.</caption><thead className="border-y border-[#e6ecfb] bg-[#f8faff] text-[10px] font-extrabold uppercase tracking-[.13em] text-[#7180a8]"><tr><th scope="col" className="px-4 py-3">Organization</th><th scope="col" className="px-4 py-3">Plan</th><th scope="col" className="px-4 py-3">Students</th><th scope="col" className="px-4 py-3">Created</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-[#edf1fb]">{orgs.length > 0 ? orgs.map((org) => <tr key={org.id} className="transition hover:bg-[#f8faff] motion-reduce:transition-none"><th scope="row" className="px-4 py-4 font-extrabold text-[#10245f]">{org.name}</th><td className="px-4 py-4 text-xs font-extrabold uppercase text-[#592bd6]">{org.plan}</td><td className="px-4 py-4 font-semibold text-[#4d629d]">{org.studentCount}</td><td className="px-4 py-4 text-xs text-[#7180a8]">{new Date(org.createdAt).toLocaleDateString()}</td><td className="px-4 py-4"><Badge variant={org.status === "active" ? "success" : "warning"}>{org.status}</Badge></td><td className="px-4 py-4 text-right"><Button variant={org.status === "active" ? "destructive" : "secondary"} size="sm" onClick={() => handleToggleOrgStatus(org.id, org.status)} aria-label={`${org.status === "active" ? "Suspend" : "Reactivate"} ${org.name}`}>{org.status === "active" ? "Suspend" : "Reactivate"}</Button></td></tr>) : <tr><td colSpan={6} className="px-4 py-10 text-center text-sm font-semibold text-[#64749b]">No institutions are available yet.</td></tr>}</tbody></table></div></Card>
    </div>
  </main>;
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AdminService, AuthService, type PlatformMetricsSummary, type AdminOrgOverview } from "@lurexa/backend";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<PlatformMetricsSummary | null>(null);
  const [orgs, setOrgs] = useState<AdminOrgOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [platformMetrics, organizations] = await Promise.all([
          AdminService.getPlatformMetrics(),
          AdminService.getOrganizationsOverview(),
        ]);
        setMetrics(platformMetrics);
        setOrgs(organizations);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to load platform operations.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleToggleOrgStatus(orgId: string, currentStatus: "active" | "suspended") {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await AdminService.updateOrgStatus(orgId, nextStatus);
      setOrgs((current) => current.map((organization) => organization.id === orgId ? { ...organization, status: nextStatus } : organization));
    } catch {
      alert("Failed to update status.");
    }
  }

  async function signOut() {
    await AuthService.logout();
    router.replace("/login");
  }

  if (loading) return <div role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#f6f8ff] px-5 text-center text-sm font-bold text-[#536aab]">Loading platform operations…</div>;

  const metricCards = [
    ["Monthly active learners", metrics?.activeUsersMonthly.toLocaleString() ?? "—", "Learners with progress activity in the last 30 days"],
    ["Organizations", metrics?.totalOrganizations.toLocaleString() ?? "—", "Organizations currently stored in Core"],
    ["Recorded AI tokens", metrics ? metrics.totalAITokensUsed.toLocaleString() : "—", "Tokens recorded in AI conversation telemetry"],
    ["System error rate", metrics?.systemErrorRatePercent == null ? "Not instrumented" : `${metrics.systemErrorRatePercent}%`, "No value is shown until error telemetry is connected"],
  ] as const;

  return <main className="min-h-screen bg-[#f6f8ff] text-[#071d67]">
    <section className="border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#142f85] to-[#2355bf] text-white"><div className="mx-auto max-w-7xl px-5 py-6 sm:px-8"><header className="flex flex-wrap items-center justify-between gap-5"><a href={ecosystemUrl} className="rounded-xl"><ProductMark product="admin" inverse /></a><div className="flex flex-wrap items-center gap-2"><Badge variant="info">Superadmin</Badge><a href={ecosystemUrl} className="inline-flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white motion-reduce:transition-none">Ecosystem <span aria-hidden="true">↗</span></a><button type="button" onClick={signOut} className="min-h-11 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-extrabold text-white transition hover:bg-white hover:text-[#071d67] motion-reduce:transition-none">Sign out</button></div></header><div className="mt-14 max-w-2xl pb-7"><p className="text-[10px] font-extrabold tracking-[.2em] text-[#7ee9ed]">PLATFORM OPERATIONS</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">A trusted foundation<br/>for every learner.</h1><p className="mt-4 text-sm leading-6 text-indigo-100">Monitor only the operational signals the platform can currently support with real data. Missing telemetry is shown as unavailable instead of estimated.</p></div></div></section>

    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
      {error ? <div role="alert" className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">{error}</div> : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">{metricCards.map(([label, value, detail], index) => <Card key={label} className={index === 0 ? "border-[#c7d4fa] bg-[#eff3ff]" : ""}><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6c7ba4]">{label}</p><b className="mt-3 block text-3xl tracking-[-.06em] text-[#071d67]">{value}</b><p className="mt-2 text-xs font-semibold leading-5 text-[#64749b]">{detail}</p></Card>)}</div>

      <Card title="Institution directory" subtitle="Manage school tenants, access, and plan enforcement."><div className="overflow-x-auto rounded-xl"><table className="w-full min-w-[720px] text-left text-sm"><caption className="sr-only">Lurexa institution directory with plan, student count, creation date, status, and account actions.</caption><thead className="border-y border-[#e6ecfb] bg-[#f8faff] text-[10px] font-extrabold uppercase tracking-[.13em] text-[#7180a8]"><tr><th scope="col" className="px-4 py-3">Organization</th><th scope="col" className="px-4 py-3">Plan</th><th scope="col" className="px-4 py-3">Students</th><th scope="col" className="px-4 py-3">Created</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-[#edf1fb]">{orgs.length > 0 ? orgs.map((org) => <tr key={org.id} className="transition hover:bg-[#f8faff] motion-reduce:transition-none"><th scope="row" className="px-4 py-4 font-extrabold text-[#10245f]">{org.name}</th><td className="px-4 py-4 text-xs font-extrabold uppercase text-[#592bd6]">{org.plan}</td><td className="px-4 py-4 font-semibold text-[#4d629d]">{org.studentCount}</td><td className="px-4 py-4 text-xs text-[#7180a8]">{org.createdAt}</td><td className="px-4 py-4"><Badge variant={org.status === "active" ? "success" : "warning"}>{org.status}</Badge></td><td className="px-4 py-4 text-right"><Button variant={org.status === "active" ? "destructive" : "secondary"} size="sm" onClick={() => handleToggleOrgStatus(org.id, org.status)} aria-label={`${org.status === "active" ? "Suspend" : "Reactivate"} ${org.name}`}>{org.status === "active" ? "Suspend" : "Reactivate"}</Button></td></tr>) : <tr><td colSpan={6} className="px-4 py-10 text-center text-sm font-semibold text-[#64749b]">No institutions are available yet.</td></tr>}</tbody></table></div></Card>
    </div>
  </main>;
}

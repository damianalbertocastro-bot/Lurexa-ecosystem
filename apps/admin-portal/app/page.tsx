"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AuthService } from "@lurexa/backend";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { getEcosystemUrl } from "@lurexa/config/domains";
import type { AdminOrgOverview, PlatformAdminSnapshot } from "@lurexa/types";
import { authenticatedFetch } from "../lib/authenticated-fetch";

const ecosystemUrl = getEcosystemUrl("root");

function readError(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<PlatformAdminSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrgId, setUpdatingOrgId] = useState<string | null>(null);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/admin/platform");
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to load trusted platform operations data."));
      setSnapshot(body as PlatformAdminSnapshot);
    } catch (caught) {
      setSnapshot(null);
      setError(caught instanceof Error ? caught.message : "Unable to load trusted platform operations data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return AuthService.onUserChanged((user) => {
      if (!user) {
        setSnapshot(null);
        setLoading(false);
        router.replace("/login");
        return;
      }
      void loadAdminData();
    });
  }, [loadAdminData, router]);

  async function handleToggleOrgStatus(org: AdminOrgOverview): Promise<void> {
    const nextStatus = org.status === "active" ? "suspended" : "active";
    setUpdatingOrgId(org.id);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/admin/platform", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: org.id, status: nextStatus }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to update organization status."));
      const updated = body as AdminOrgOverview;
      setSnapshot((current) => current ? {
        ...current,
        organizations: current.organizations.map((entry) => entry.id === updated.id ? updated : entry),
      } : current);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update organization status.");
    } finally {
      setUpdatingOrgId(null);
    }
  }

  async function signOut(): Promise<void> {
    await AuthService.logout();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#f6f8ff] px-5 text-center text-sm font-bold text-[#536aab]">
        Loading trusted platform operations…
      </div>
    );
  }

  const metrics = snapshot?.metrics ?? null;
  const organizations = snapshot?.organizations ?? [];

  return (
    <main className="min-h-screen bg-[#f6f8ff] text-[#071d67]">
      <section className="border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#142f85] to-[#2355bf] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <a href={ecosystemUrl} rel="noreferrer" className="rounded-xl"><ProductMark product="admin" inverse /></a>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Superadmin</Badge>
              <EcosystemDropdown currentApp="admin" inverse />
              <a href={ecosystemUrl} rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white motion-reduce:transition-none">
                Ecosystem <span aria-hidden="true">↗</span>
              </a>
              <button type="button" onClick={() => void signOut()} className="min-h-11 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-extrabold text-white transition hover:bg-white hover:text-[#071d67] motion-reduce:transition-none">
                Sign out
              </button>
            </div>
          </header>
          <div className="mt-14 max-w-2xl pb-7">
            <p className="text-[10px] font-extrabold tracking-[.2em] text-[#7ee9ed]">PLATFORM OPERATIONS</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">A trusted foundation<br />for every learner.</h1>
            <p className="mt-4 text-sm leading-6 text-indigo-100">Measured operational data from Lurexa Core. Uninstrumented metrics stay explicitly unavailable instead of being estimated.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
        {error ? (
          <Card title="Platform operations need attention">
            <p role="alert" className="text-sm leading-6 text-rose-700">{error}</p>
            <Button className="mt-4" variant="secondary" onClick={() => void loadAdminData()}>Try again</Button>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-[#c7d4fa] bg-[#eff3ff]">
            <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6c7ba4]">Monthly active learners</p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[#071d67]">{metrics?.activeLearnersMonthly.toLocaleString() ?? "—"}</b>
            <p className="mt-2 text-xs font-semibold text-[#64749b]">Distinct learners with trusted progress in the last 30 days</p>
          </Card>
          <Card>
            <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6c7ba4]">Organizations</p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[#071d67]">{metrics?.totalOrganizations.toLocaleString() ?? "—"}</b>
            <p className="mt-2 text-xs font-semibold text-[#64749b]">Registered organization records</p>
          </Card>
          <Card>
            <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6c7ba4]">AI tokens recorded</p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[#071d67]">{metrics?.totalAITokensRecorded.toLocaleString() ?? "—"}</b>
            <p className="mt-2 text-xs font-semibold text-[#64749b]">Only trusted conversations that recorded usage</p>
          </Card>
          <Card>
            <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6c7ba4]">System error rate</p>
            <b className="mt-3 block text-xl tracking-[-.04em] text-[#071d67]">{metrics?.systemErrorRatePercent === null || metrics === null ? "Not instrumented" : `${metrics.systemErrorRatePercent}%`}</b>
            <p className="mt-2 text-xs font-semibold text-[#64749b]">No synthetic health percentage is shown</p>
          </Card>
        </div>

        {metrics ? (
          <Card title="Measurement boundaries" subtitle={`Projection generated ${formatDate(metrics.generatedAt)}`}>
            <ul className="space-y-2 text-sm leading-6 text-[#64749b]">
              {metrics.limitations.map((limitation) => <li key={limitation}>• {limitation}</li>)}
            </ul>
          </Card>
        ) : null}

        <Card title="Institution directory" subtitle="Server-authorized organization status and measured student membership counts.">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Lurexa institution directory with plan, student count, creation date, status, and account actions.</caption>
              <thead className="border-y border-[#e6ecfb] bg-[#f8faff] text-[10px] font-extrabold uppercase tracking-[.13em] text-[#7180a8]">
                <tr><th scope="col" className="px-4 py-3">Organization</th><th scope="col" className="px-4 py-3">Plan</th><th scope="col" className="px-4 py-3">Students</th><th scope="col" className="px-4 py-3">Created</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-[#edf1fb]">
                {organizations.length > 0 ? organizations.map((org) => (
                  <tr key={org.id} className="transition hover:bg-[#f8faff] motion-reduce:transition-none">
                    <th scope="row" className="px-4 py-4 font-extrabold text-[#10245f]">{org.name}</th>
                    <td className="px-4 py-4 text-xs font-extrabold uppercase text-[#592bd6]">{org.plan}</td>
                    <td className="px-4 py-4 font-semibold text-[#4d629d]">{org.studentCount}</td>
                    <td className="px-4 py-4 text-xs text-[#7180a8]">{formatDate(org.createdAt)}</td>
                    <td className="px-4 py-4"><Badge variant={org.status === "active" ? "success" : "warning"}>{org.status}</Badge></td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        variant={org.status === "active" ? "destructive" : "secondary"}
                        size="sm"
                        disabled={updatingOrgId === org.id}
                        onClick={() => void handleToggleOrgStatus(org)}
                        aria-label={`${org.status === "active" ? "Suspend" : "Reactivate"} ${org.name}`}
                      >
                        {updatingOrgId === org.id ? "Saving…" : org.status === "active" ? "Suspend" : "Reactivate"}
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-sm font-semibold text-[#64749b]">No institutions are available yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

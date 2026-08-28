"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AuthService } from "@lurexa/backend";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

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
      setSnapshot((current) =>
        current
          ? {
              ...current,
              organizations: current.organizations.map((entry) =>
                entry.id === updated.id ? updated : entry,
              ),
            }
          : current,
      );
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

  const metrics = snapshot?.metrics ?? null;

  const filteredOrganizations = useMemo(() => {
    const rawOrganizations = snapshot?.organizations ?? [];
    return rawOrganizations.filter((org) => {
      const matchesSearch =
        !searchQuery.trim() ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.plan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || org.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [snapshot?.organizations, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-screen place-items-center bg-[var(--lx-canvas)] px-5 text-center text-sm font-bold text-[var(--lx-muted)]"
      >
        Loading trusted platform operations…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      <section className="border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#142f85] to-[#2355bf] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <a href={ecosystemUrl} rel="noreferrer" className="rounded-xl">
              <ProductMark product="admin" inverse />
            </a>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Superadmin</Badge>
              <Link
                href="/"
                className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white"
              >
                Overview
              </Link>
              <Link
                href="/billing"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Billing &amp; Licenses
              </Link>
              <Link
                href="/roster"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Roster Sync
              </Link>
              <Link
                href="/analytics/phonetics"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Phonetics &amp; Speaking
              </Link>
              <Link
                href="/analytics/field-pilot"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Dominican Field Pilot
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
              <a
                href={ecosystemUrl}
                rel="noreferrer"
                className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Ecosystem <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                onClick={() => void signOut()}
                className="min-h-10 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-white hover:text-[#071d67]"
              >
                Sign out
              </button>
            </div>
          </header>
          <div className="mt-12 max-w-2xl pb-6">
            <p className="text-[10px] font-extrabold tracking-[.2em] text-[#7ee9ed]">
              PLATFORM OPERATIONS
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">
              A trusted foundation
              <br />
              for every learner.
            </h1>
            <p className="mt-4 text-sm leading-6 text-indigo-100">
              Measured operational data from Lurexa Core. Uninstrumented metrics stay explicitly
              unavailable instead of being estimated.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
        {error ? (
          <Card title="Platform operations need attention">
            <p role="alert" className="text-sm leading-6 text-rose-700 dark:text-rose-300">
              {error}
            </p>
            <Button className="mt-4" variant="secondary" onClick={() => void loadAdminData()}>
              Try again
            </Button>
          </Card>
        ) : null}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Monthly active learners
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-primary)]">
              {metrics?.activeLearnersMonthly.toLocaleString() ?? "—"}
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Distinct learners with trusted progress in the last 30 days
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Organizations
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-ink)]">
              {metrics?.totalOrganizations.toLocaleString() ?? "—"}
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Registered organization records
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              AI tokens recorded
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-secondary)]">
              {metrics?.totalAITokensRecorded.toLocaleString() ?? "—"}
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Only trusted conversations that recorded usage
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              System error rate
            </p>
            <b className="mt-3 block text-xl tracking-[-.04em] text-[var(--lx-ink)]">
              {metrics?.systemErrorRatePercent === null || metrics === null
                ? "Not instrumented"
                : `${metrics.systemErrorRatePercent}%`}
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              No synthetic health percentage is shown
            </p>
          </div>
        </div>

        {metrics ? (
          <Card
            title="Measurement boundaries"
            subtitle={`Projection generated ${formatDate(metrics.generatedAt)}`}
          >
            <ul className="space-y-2 text-sm leading-6 text-[var(--lx-muted)]">
              {metrics.limitations.map((limitation) => (
                <li key={limitation}>• {limitation}</li>
              ))}
            </ul>
          </Card>
        ) : null}

        {/* Institution Directory Card */}
        <Card
          title="Institution directory"
          subtitle="Server-authorized organization status and measured student membership counts."
        >
          {/* Search & Filter Bar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search by organization name or plan…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-2 text-xs font-medium text-[var(--lx-ink)] outline-none focus:border-[var(--lx-primary)]"
            />
            <div className="flex items-center gap-1.5">
              {(["all", "active", "suspended"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold capitalize transition ${
                    statusFilter === st
                      ? "bg-[var(--lx-primary)] text-white shadow-xs"
                      : "bg-[var(--lx-canvas)] text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--lx-border)]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[10px] font-black uppercase tracking-[.13em] text-[var(--lx-muted)]">
                <tr>
                  <th scope="col" className="px-4 py-3">Organization</th>
                  <th scope="col" className="px-4 py-3">Plan</th>
                  <th scope="col" className="px-4 py-3">Students</th>
                  <th scope="col" className="px-4 py-3">Created</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lx-border)] bg-[var(--lx-surface)]">
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <tr key={org.id} className="transition hover:bg-[var(--lx-canvas)]/60">
                      <th scope="row" className="px-4 py-4 font-extrabold text-[var(--lx-ink)]">
                        {org.name}
                      </th>
                      <td className="px-4 py-4 text-xs font-black uppercase text-[var(--lx-primary)]">
                        {org.plan}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[var(--lx-muted)]">
                        {org.studentCount}
                      </td>
                      <td className="px-4 py-4 text-xs text-[var(--lx-muted)]">
                        {formatDate(org.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={org.status === "active" ? "success" : "warning"}>
                          {org.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant={org.status === "active" ? "destructive" : "secondary"}
                          size="sm"
                          disabled={updatingOrgId === org.id}
                          onClick={() => void handleToggleOrgStatus(org)}
                          aria-label={`${org.status === "active" ? "Suspend" : "Reactivate"} ${org.name}`}
                        >
                          {updatingOrgId === org.id
                            ? "Saving…"
                            : org.status === "active"
                            ? "Suspend"
                            : "Reactivate"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm font-semibold text-[var(--lx-muted)]">
                      No matching institutions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { Modal } from "@lurexa/ui/Modal";
import { Input } from "@lurexa/ui/Input";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { useToast } from "@lurexa/ui/Toast";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import { AuthService } from "@lurexa/backend";
import type { InstitutionalBillingAccount, InstitutionalPlanTier } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

export default function AdminBillingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { playClick, playSuccess } = useSoundEffects();

  const [accounts, setAccounts] = useState<InstitutionalBillingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");

  // Edit Modal State
  const [editingAccount, setEditingAccount] = useState<InstitutionalBillingAccount | null>(null);
  const [newSeats, setNewSeats] = useState<number>(25);
  const [newPlan, setNewPlan] = useState<InstitutionalPlanTier>("standard_institutional");
  const [saving, setSaving] = useState(false);

  const loadBillingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/admin/billing");
      if (!response.ok) throw new Error("Unable to load institutional billing accounts.");
      const data = (await response.json()) as { accounts: InstitutionalBillingAccount[] };
      setAccounts(data.accounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load billing data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return AuthService.onUserChanged((user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      void loadBillingData();
    });
  }, [loadBillingData, router]);

  const handleSaveSeats = async () => {
    if (!editingAccount) return;
    setSaving(true);
    try {
      playClick();
      const response = await authenticatedFetch("/api/admin/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: editingAccount.organizationId,
          allocatedSeats: newSeats,
          planTier: newPlan,
        }),
      });

      if (!response.ok) throw new Error("Failed to update seat licensing.");
      const result = (await response.json()) as { account: InstitutionalBillingAccount };

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.organizationId === result.account.organizationId ? result.account : acc,
        ),
      );

      playSuccess();
      toast({
        variant: "success",
        title: "Seats Updated",
        description: `Updated ${editingAccount.organizationName} to ${newSeats} seats on ${newPlan.replace("_", " ")}.`,
      });

      setEditingAccount(null);
    } catch (err) {
      toast({
        variant: "error",
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Could not update billing account.",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        !searchQuery.trim() ||
        acc.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === "all" || acc.planTier === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [accounts, searchQuery, planFilter]);

  // Aggregate Metrics
  const totalAllocatedSeats = accounts.reduce((sum, a) => sum + a.allocatedSeats, 0);
  const totalUsedSeats = accounts.reduce((sum, a) => sum + a.usedSeats, 0);
  const totalAnnualRevenue = accounts.reduce(
    (sum, a) => sum + a.allocatedSeats * a.pricePerSeatMonthlyUsd * 12,
    0,
  );

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      {/* Header */}
      <section className="border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#142f85] to-[#2355bf] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <Link href="/" className="rounded-xl">
              <ProductMark product="admin" inverse />
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Overview
              </Link>
              <Link
                href="/billing"
                className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white"
              >
                Billing &amp; Licenses
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
            </div>
          </header>

          <div className="mt-10 max-w-2xl pb-6">
            <p className="text-[10px] font-extrabold tracking-[.2em] text-[#7ee9ed]">
              ENTERPRISE LICENSING &amp; BILLING
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">
              Institutional Plans &amp; Seat Governance
            </h1>
            <p className="mt-3 text-sm leading-6 text-indigo-100">
              Manage organization tier subscriptions, provisioned student seats, contract cycles,
              and invoice histories across the ecosystem.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
        {error ? (
          <Card title="Billing synchronization notice">
            <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            <Button className="mt-3" variant="secondary" onClick={() => void loadBillingData()}>
              Retry
            </Button>
          </Card>
        ) : null}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Total Contracted Seats
            </p>
            <b className="mt-2 block text-3xl tracking-tight text-[var(--lx-primary)]">
              {totalAllocatedSeats.toLocaleString()}
            </b>
            <p className="mt-1 text-xs text-[var(--lx-muted)]">
              {totalUsedSeats.toLocaleString()} seats actively claimed ({totalAllocatedSeats ? Math.round((totalUsedSeats / totalAllocatedSeats) * 100) : 0}%)
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Active Institutions
            </p>
            <b className="mt-2 block text-3xl tracking-tight text-[var(--lx-ink)]">
              {accounts.filter((a) => a.status === "active").length}
            </b>
            <p className="mt-1 text-xs text-[var(--lx-muted)]">
              {accounts.length} total registered enterprise accounts
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Annual Contract Value (ACV)
            </p>
            <b className="mt-2 block text-3xl tracking-tight text-emerald-600 dark:text-emerald-400">
              ${totalAnnualRevenue.toLocaleString()}
            </b>
            <p className="mt-1 text-xs text-[var(--lx-muted)]">
              Estimated annual recurring subscription value
            </p>
          </div>
        </div>

        {/* Accounts Table Card */}
        <Card
          title="Institutional Subscription Accounts"
          subtitle="Provision and scale student licenses for partner schools, universities, and corporate programs."
        >
          {/* Filter & Search Bar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search institution by name or billing email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-2 text-xs font-medium text-[var(--lx-ink)] outline-none focus:border-[var(--lx-primary)]"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {(["all", "free_community", "standard_institutional", "campus_pro", "enterprise"] as const).map(
                (tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPlanFilter(tier)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-extrabold capitalize transition ${
                      planFilter === tier
                        ? "bg-[var(--lx-primary)] text-white shadow-xs"
                        : "bg-[var(--lx-canvas)] text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
                    }`}
                  >
                    {tier.replace("_", " ")}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--lx-border)]">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[10px] font-black uppercase tracking-[.13em] text-[var(--lx-muted)]">
                <tr>
                  <th scope="col" className="px-4 py-3">Institution</th>
                  <th scope="col" className="px-4 py-3">Plan Tier</th>
                  <th scope="col" className="px-4 py-3">Seat Utilization</th>
                  <th scope="col" className="px-4 py-3">Renewal Date</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lx-border)] bg-[var(--lx-surface)]">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((acc) => {
                    const percentUsed = acc.allocatedSeats
                      ? Math.round((acc.usedSeats / acc.allocatedSeats) * 100)
                      : 0;
                    return (
                      <tr key={acc.organizationId} className="transition hover:bg-[var(--lx-canvas)]/60">
                        <td className="px-4 py-4">
                          <p className="font-extrabold text-[var(--lx-ink)]">{acc.organizationName}</p>
                          <p className="text-xs text-[var(--lx-muted)]">{acc.contactEmail}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-black uppercase text-[var(--lx-primary)]">
                            {acc.planTier.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--lx-canvas)] border border-[var(--lx-border)]">
                              <div
                                className={`h-full rounded-full ${
                                  percentUsed > 90 ? "bg-rose-500" : "bg-[var(--lx-primary)]"
                                }`}
                                style={{ width: `${Math.min(100, percentUsed)}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-[var(--lx-ink)]">
                              {acc.usedSeats} / {acc.allocatedSeats} ({percentUsed}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-[var(--lx-muted)]">
                          {new Date(acc.nextRenewalDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={acc.status === "active" ? "success" : "warning"}>
                            {acc.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setEditingAccount(acc);
                              setNewSeats(acc.allocatedSeats);
                              setNewPlan(acc.planTier);
                            }}
                          >
                            Manage Seats
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm font-semibold text-[var(--lx-muted)]"
                    >
                      {loading ? "Loading accounts…" : "No matching billing accounts found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Edit Seats Modal */}
      {editingAccount ? (
        <Modal
          isOpen={true}
          onClose={() => setEditingAccount(null)}
          title={`Manage Licenses: ${editingAccount.organizationName}`}
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[var(--lx-muted)] mb-1">
                Plan Tier
              </label>
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value as InstitutionalPlanTier)}
                className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2.5 text-sm font-bold text-[var(--lx-ink)] outline-none"
              >
                <option value="free_community">Free Community ($0/seat)</option>
                <option value="standard_institutional">Standard Institutional ($5/seat/mo)</option>
                <option value="campus_pro">Campus Pro ($8/seat/mo)</option>
                <option value="enterprise">Enterprise Custom ($12/seat/mo)</option>
              </select>
            </div>

            <div>
              <Input
                label="Allocated Student Seats"
                type="number"
                min={editingAccount.usedSeats}
                value={String(newSeats)}
                onChange={(e) => setNewSeats(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              <p className="mt-1 text-[11px] text-[var(--lx-muted)]">
                Currently utilized: {editingAccount.usedSeats} seats. Minimum allocation cannot be lower than active student enrollments.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--lx-canvas)] p-4 border border-[var(--lx-border)]">
              <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-muted)]">
                Billing Impact Projection
              </p>
              <p className="mt-1 text-sm font-extrabold text-[var(--lx-ink)]">
                Annual Subscription: $
                {(
                  newSeats *
                  (newPlan === "enterprise"
                    ? 12
                    : newPlan === "campus_pro"
                    ? 8
                    : newPlan === "standard_institutional"
                    ? 5
                    : 0) *
                  12
                ).toLocaleString()}{" "}
                USD / year
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="secondary" onClick={() => setEditingAccount(null)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => void handleSaveSeats()} isLoading={saving}>
                Save License Allocation
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </main>
  );
}

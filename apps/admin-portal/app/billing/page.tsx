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
import type { AdminBillingAccount, InstitutionalBillingProfile } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

const PROFILE_LABELS: Record<string, string> = {
  free_community: "Community",
  standard_institutional: "Campus Standard",
  campus_pro: "Campus Pro",
  enterprise_legacy_migration: "Legacy Enterprise (migration)",
};

export default function AdminBillingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { playClick, playSuccess } = useSoundEffects();
  const [accounts, setAccounts] = useState<AdminBillingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [editingAccount, setEditingAccount] = useState<AdminBillingAccount | null>(null);
  const [newSeats, setNewSeats] = useState(0);
  const [saving, setSaving] = useState(false);
  const [migrating, setMigrating] = useState(false);

  const loadBillingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/admin/billing");
      if (!response.ok) throw new Error("Unable to load canonical billing accounts.");
      const data = (await response.json()) as { accounts: AdminBillingAccount[] };
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

  const migrateLegacyBilling = async () => {
    setMigrating(true);
    try {
      playClick();
      const response = await authenticatedFetch("/api/admin/billing", { method: "POST" });
      if (!response.ok) throw new Error("Legacy billing migration failed.");
      const result = (await response.json()) as {
        migrated: number;
        alreadyCanonical: number;
        skipped: number;
        failures: Array<{ organizationId: string; reason: string }>;
      };
      await loadBillingData();
      playSuccess();
      toast({
        variant: result.failures.length ? "warning" : "success",
        title: result.failures.length ? "Migration completed with exceptions" : "Legacy billing migrated",
        description: `${result.migrated} migrated, ${result.alreadyCanonical} already canonical, ${result.skipped} skipped, ${result.failures.length} failed.`,
      });
    } catch (err) {
      toast({
        variant: "error",
        title: "Migration Failed",
        description: err instanceof Error ? err.message : "Unable to migrate legacy billing.",
      });
    } finally {
      setMigrating(false);
    }
  };

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
        }),
      });
      if (!response.ok) throw new Error("Failed to update the canonical seat allowance.");
      const result = (await response.json()) as { account: AdminBillingAccount };
      setAccounts((prev) => prev.map((account) =>
        account.organizationId === result.account.organizationId ? result.account : account,
      ));
      playSuccess();
      toast({
        variant: "success",
        title: "Seat allowance updated",
        description: `${editingAccount.organizationName} now has ${newSeats.toLocaleString()} contracted seats.`,
      });
      setEditingAccount(null);
    } catch (err) {
      toast({
        variant: "error",
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Could not update the canonical billing record.",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredAccounts = useMemo(() => accounts.filter((account) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      account.organizationName.toLowerCase().includes(query) ||
      account.contactEmail.toLowerCase().includes(query);
    const matchesModel = modelFilter === "all" || account.commercialModel === modelFilter;
    return matchesSearch && matchesModel;
  }), [accounts, searchQuery, modelFilter]);

  const totalSeats = accounts.reduce((sum, account) => sum + account.seatAllowance, 0);
  const usedSeats = accounts.reduce((sum, account) => sum + account.usedSeats, 0);
  const migratedCount = accounts.filter((account) => account.migratedFromLegacy).length;
  const synchronizedInvoices = accounts.reduce((sum, account) => sum + account.invoices.length, 0);

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      <section className="border-b border-white/10 bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy-light)] to-[var(--lx-secondary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <Link href="/" className="rounded-xl"><ProductMark product="admin" inverse /></Link>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white">Overview</Link>
              <Link href="/billing" className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white">Billing &amp; Licenses</Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
            </div>
          </header>
          <div className="mt-10 max-w-3xl pb-6">
            <p className="text-[10px] font-extrabold tracking-[.2em] text-[var(--lx-accent)]">CORE COMMERCIAL BILLING</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">Canonical Billing &amp; Entitlements</h1>
            <p className="mt-3 text-sm leading-6 text-indigo-100">
              This view reads Core-owned commercial records. Legacy organization plan fields are migration inputs only; they do not authorize product access.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
        {error ? (
          <Card title="Billing synchronization notice">
            <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            <Button className="mt-3" variant="secondary" onClick={() => void loadBillingData()}>Retry</Button>
          </Card>
        ) : null}

        <Card title="Legacy migration" subtitle="Move legacy organization billing fields into the Core-owned canonical billing record before provider commerce is enabled.">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--lx-ink)]">{migratedCount} of {accounts.length} accounts expose a canonical migration record.</p>
              <p className="mt-1 text-xs text-[var(--lx-muted)]">The migration preserves the legacy source marker and does not invent provider invoices, prices, or payment methods.</p>
            </div>
            <Button variant="primary" onClick={() => void migrateLegacyBilling()} isLoading={migrating}>
              Migrate Legacy Billing
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            ["Contracted Seats", totalSeats.toLocaleString(), `${usedSeats.toLocaleString()} currently used`],
            ["Organizations", accounts.length.toLocaleString(), `${accounts.filter((a) => a.status === "active").length} active`],
            ["Business Contracts", accounts.filter((a) => a.commercialModel === "business").length.toLocaleString(), "Quote-based commercial model"],
            ["Synced Invoices", synchronizedInvoices.toLocaleString(), "Provider invoices only; no fabricated records"],
          ].map(([label, value, detail]) => (
            <div key={label} className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">{label}</p>
              <b className="mt-2 block text-3xl tracking-tight text-[var(--lx-ink)]">{value}</b>
              <p className="mt-1 text-xs text-[var(--lx-muted)]">{detail}</p>
            </div>
          ))}
        </div>

        <Card title="Organization billing accounts" subtitle="Products, capabilities, quotas, invoices and payments are shown from the canonical commercial model.">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              type="text"
              placeholder="Search organization or billing email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-2 text-xs font-medium text-[var(--lx-ink)] outline-none"
            />
            <div className="flex gap-1.5">
              {["all", "campus", "business"].map((model) => (
                <Button key={model} type="button" onClick={() => setModelFilter(model)} className={`rounded-xl px-3 py-1.5 text-xs font-extrabold capitalize ${modelFilter === model ? "bg-[var(--lx-primary)] text-white" : "bg-[var(--lx-canvas)] text-[var(--lx-muted)]"}`}>
                  {model}
                </Button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--lx-border)]">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="border-b border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[10px] font-black uppercase tracking-[.13em] text-[var(--lx-muted)]">
                <tr>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Commercial model</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Billing state</th>
                  <th className="px-4 py-3">Invoices</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lx-border)] bg-[var(--lx-surface)]">
                {filteredAccounts.length ? filteredAccounts.map((account) => {
                  const percentUsed = account.seatAllowance ? Math.round((account.usedSeats / account.seatAllowance) * 100) : 0;
                  return (
                    <tr key={account.organizationId} className="transition hover:bg-[var(--lx-canvas)]/60">
                      <td className="px-4 py-4">
                        <p className="font-extrabold">{account.organizationName}</p>
                        <p className="text-xs text-[var(--lx-muted)]">{account.contactEmail || "No billing contact synchronized"}</p>
                        {account.migratedFromLegacy ? <span className="mt-1 inline-block text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)]">legacy migrated</span> : null}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold capitalize">{account.commercialModel}</p>
                        {account.institutionalProfile ? <p className="text-xs text-[var(--lx-muted)]">{PROFILE_LABELS[account.institutionalProfile] ?? account.institutionalProfile}</p> : null}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex max-w-[280px] flex-wrap gap-1">
                          {account.productAccess.map((product) => <span key={product} className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-black">{product}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold">{account.usedSeats.toLocaleString()} / {account.seatAllowance.toLocaleString()}</span>
                        <span className="ml-1 text-xs text-[var(--lx-muted)]">({percentUsed}%)</span>
                      </td>
                      <td className="px-4 py-4"><Badge variant={account.status === "active" ? "success" : "warning"}>{account.status}</Badge></td>
                      <td className="px-4 py-4 text-xs text-[var(--lx-muted)]">{account.invoices.length} synchronized</td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="secondary" size="sm" onClick={() => { setEditingAccount(account); setNewSeats(account.seatAllowance); }}>
                          Manage seats
                        </Button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-sm font-semibold text-[var(--lx-muted)]">{loading ? "Loading accounts…" : "No matching billing accounts found."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {editingAccount ? (
        <Modal isOpen={true} onClose={() => setEditingAccount(null)} title={`Manage seats: ${editingAccount.organizationName}`}>
          <div className="space-y-4 pt-2">
            <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)]">Commercial authority</p>
              <p className="mt-1 text-sm font-bold">{editingAccount.commercialModel} · {editingAccount.institutionalProfile ? (PROFILE_LABELS[editingAccount.institutionalProfile] ?? editingAccount.institutionalProfile) : "Business contract"}</p>
              <p className="mt-1 text-xs text-[var(--lx-muted)]">Seat allowance is a canonical contract field. It is not a price calculation.</p>
            </div>
            <Input
              label="Contracted learner / seat allowance"
              type="number"
              min={editingAccount.usedSeats}
              value={String(newSeats)}
              onChange={(e) => setNewSeats(Math.max(editingAccount.usedSeats, parseInt(e.target.value, 10) || 0))}
            />
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="secondary" onClick={() => setEditingAccount(null)} disabled={saving}>Cancel</Button>
              <Button variant="primary" onClick={() => void handleSaveSeats()} isLoading={saving}>Save canonical allowance</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </main>
  );
}

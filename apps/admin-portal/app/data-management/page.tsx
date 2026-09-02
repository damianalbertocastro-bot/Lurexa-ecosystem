"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Button } from "@lurexa/ui/button";
import { Badge } from "@lurexa/ui/Badge";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");

export default function MasterDataManagementPage() {
  const router = useRouter();
  const [targetType, setTargetType] = useState<"placement" | "progress" | "evidence" | "course" | "user">("placement");
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete/reset ${targetType.toUpperCase()} with ID "${targetId}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error("Authentication required.");
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: targetType, id: targetId.trim() }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean };
      if (!res.ok) throw new Error(data.error || "Failed to execute deletion.");

      setStatusMessage(`✓ Successfully deleted/reset ${targetType} for ID "${targetId}".`);
      setTargetId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error executing deletion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      {/* Top Header */}
      <section className="border-b border-white/10 bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy-light)] to-[var(--lx-secondary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <a href={ecosystemUrl} rel="noreferrer" className="rounded-xl">
              <ProductMark product="admin" inverse />
            </a>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Superadmin</Badge>
              <Link href="/" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 hover:bg-white/10 hover:text-white">
                Overview
              </Link>
              <Link href="/users" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 hover:bg-white/10 hover:text-white">
                Users &amp; Profiles
              </Link>
              <Link href="/tools" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 hover:bg-white/10 hover:text-white">
                Ecosystem Tools
              </Link>
              <Link href="/data-management" className="rounded-xl bg-rose-600/30 border border-rose-400/50 px-3 py-1.5 text-xs font-black text-white">
                Master Deletion 🗑️
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
              <Button
                type="button"
                onClick={async () => {
                  await AuthService.logout();
                  router.replace("/login");
                }}
                className="min-h-10 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-white hover:text-[var(--color-brand-navy)]"
              >
                Sign out
              </Button>
            </div>
          </header>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-rose-300">
              Platform Master Operations
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-white">
              Master Data &amp; File Deletion
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-rose-100">
              Permanently delete or reset any test modification, learner attempt, diagnostic baseline, evidence submission, or created file across the entire ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Main Panel */}
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 space-y-6">
        {statusMessage && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 shadow-sm">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-900 shadow-sm">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-rose-200 bg-[var(--lx-surface)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[var(--lx-border)] pb-4">
            <h2 className="text-lg font-black text-[var(--lx-ink)]">
              Targeted Entity Deletion &amp; Reset
            </h2>
            <p className="text-xs text-[var(--lx-muted)] mt-1">
              Select the category of record or file you wish to delete or reset.
            </p>
          </div>

          <form onSubmit={handleDelete} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-2">
                Entity Category
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { id: "placement", label: "Placement Test", desc: "Reset diagnostic" },
                  { id: "progress", label: "Lesson Progress", desc: "Wipe scores" },
                  { id: "evidence", label: "Evidence Submissions", desc: "Delete artifacts" },
                  { id: "course", label: "Drafted Course", desc: "Remove course" },
                  { id: "user", label: "Full User Account", desc: "Purge account" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetType(item.id as any)}
                    className={`flex flex-col items-center rounded-2xl border p-3 text-center transition ${
                      targetType === item.id
                        ? "border-rose-600 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-500/20"
                        : "border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[var(--lx-muted)] hover:border-slate-400"
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-[var(--lx-muted)]">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-1.5">
                Target Record / User ID
              </label>
              <input
                type="text"
                required
                placeholder={
                  targetType === "user" || targetType === "placement"
                    ? "Enter User UID (e.g. from Users directory)"
                    : "Enter Record or Document ID"
                }
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full min-h-11 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 text-xs font-mono font-medium text-[var(--lx-ink)] outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              />
              <p className="mt-1 text-[11px] text-[var(--lx-muted)]">
                {targetType === "placement"
                  ? "Resetting placement removes the test history for that user, allowing them to re-take the diagnostic test on Learn."
                  : targetType === "user"
                  ? "Permanently deletes the user from Firebase Authentication, Core profiles, and progress."
                  : "Permanently deletes the specified entity from Core Firestore."}
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !targetId.trim()}
              className="w-full rounded-xl bg-rose-600 py-3 text-xs font-black text-white hover:bg-rose-500 shadow-md transition disabled:opacity-50"
            >
              {loading ? "Executing Deletion…" : `Permanently Delete / Reset ${targetType.toUpperCase()} →`}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

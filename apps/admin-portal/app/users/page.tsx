"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Button } from "@lurexa/ui/button";
import { Badge } from "@lurexa/ui/Badge";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");

interface EcosystemUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  cefrLevel?: string;
  profileType: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<EcosystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<EcosystemUser | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = (await res.json()) as { users?: EcosystemUser[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load users.");
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading users.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const unsub = AuthService.onUserChanged((user) => {
      if (!user) {
        router.replace("/login");
      } else {
        void loadUsers();
      }
    });
    return unsub;
  }, [loadUsers, router]);

  const handleDeleteUser = async (targetUser: EcosystemUser) => {
    setDeletingId(targetUser.uid);
    setStatusMessage(null);
    try {
      const user = AuthService.getCurrentUser();
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "user", id: targetUser.uid }),
      });
      if (res.ok) {
        setStatusMessage(`✓ User ${targetUser.email || targetUser.uid} deleted successfully.`);
        setConfirmDeleteUser(null);
        await loadUsers();
      } else {
        const data = (await res.json()) as { error?: string };
        alert(data.error || "Failed to delete user.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting user.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetPlacement = async (targetUser: EcosystemUser) => {
    setDeletingId(targetUser.uid);
    setStatusMessage(null);
    try {
      const user = AuthService.getCurrentUser();
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "placement", id: targetUser.uid }),
      });
      if (res.ok) {
        setStatusMessage(`✓ Diagnostic placement reset for ${targetUser.email || targetUser.uid}. User can now retake test.`);
        await loadUsers();
      } else {
        const data = (await res.json()) as { error?: string };
        alert(data.error || "Failed to reset placement.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error resetting placement.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search.trim() ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.displayName && u.displayName.toLowerCase().includes(search.toLowerCase())) ||
      u.uid.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter || u.profileType === roleFilter;
    return matchesSearch && matchesRole;
  });

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
              <Link href="/users" className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white">
                Users &amp; Profiles
              </Link>
              <Link href="/tools" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 hover:bg-white/10 hover:text-white">
                Ecosystem Tools
              </Link>
              <Link href="/data-management" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-rose-200 hover:bg-rose-500/20 hover:text-white">
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
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-300">
              Superadmin Central Directory
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Ecosystem User Profiles
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-indigo-100">
              Inspect and manage all accounts across Lurexa Learn, Coach, Teach, Insight, and Studio. Reset placement test baselines or delete test accounts.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 space-y-6">
        {statusMessage && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 shadow-sm animate-fade-slide-up">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-900 shadow-sm">
            {error}
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, email, or UID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-10 w-72 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3 text-xs font-medium text-[var(--lx-ink)] outline-none focus:border-[var(--lx-primary)]"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="min-h-10 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3 text-xs font-bold text-[var(--lx-ink)] outline-none"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Superadmin</option>
              <option value="admin">Admin / Campus Owner</option>
              <option value="educator">Educator / Teacher</option>
              <option value="student">Student / Learner</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--lx-muted)]">
              Total Users: <strong>{filtered.length}</strong>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void loadUsers()}
              className="text-xs font-bold text-[var(--lx-primary)]"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-[var(--lx-muted)]">
              Loading ecosystem user directory…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--lx-muted)]">
              No matching user profiles found.
            </div>
          ) : (
            <div className="divide-y divide-[var(--lx-border)]">
              {filtered.map((u) => (
                <article
                  key={u.uid}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 hover:bg-[var(--lx-canvas)] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <b className="text-sm font-bold text-[var(--lx-ink)]">
                        {u.displayName || u.email?.split("@")[0] || "Unnamed User"}
                      </b>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          u.role === "super_admin"
                            ? "bg-violet-100 text-violet-900 border border-violet-300"
                            : u.profileType === "educator"
                            ? "bg-teal-100 text-teal-900 border border-teal-300"
                            : "bg-slate-100 text-slate-800 border border-slate-300"
                        }`}
                      >
                        {u.role === "super_admin" ? "Superadmin 👑" : u.profileType}
                      </span>
                      {u.cefrLevel && (
                        <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                          CEFR: {u.cefrLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--lx-muted)]">
                      {u.email || "No email"} · UID: <code className="font-mono text-[11px]">{u.uid}</code>
                      {u.createdAt ? ` · Joined: ${new Date(u.createdAt).toLocaleDateString()}` : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleResetPlacement(u)}
                      disabled={deletingId === u.uid}
                      className="rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50"
                    >
                      Reset Placement 🔄
                    </Button>

                    {u.role !== "super_admin" && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setConfirmDeleteUser(u)}
                        disabled={deletingId === u.uid}
                        className="rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 hover:bg-rose-100"
                      >
                        Delete User 🗑️
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDeleteUser && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-[var(--lx-surface)] p-6 shadow-2xl border border-[var(--lx-border)] space-y-4">
              <h3 className="text-lg font-black text-rose-600">
                Confirm Deletion: {confirmDeleteUser.displayName || confirmDeleteUser.email}
              </h3>
              <p className="text-xs text-[var(--lx-muted)] leading-relaxed">
                As Superadmin, this action will completely delete this user from Firebase Auth, Core profiles, progress records, and evidence submissions across the entire ecosystem. This action is irreversible.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDeleteUser(null)}
                  className="text-xs font-bold text-[var(--lx-muted)]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleDeleteUser(confirmDeleteUser)}
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-black text-white hover:bg-rose-500"
                >
                  Yes, Permanently Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

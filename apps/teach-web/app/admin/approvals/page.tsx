"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { EducatorProfile } from "@lurexa/types";
import { TeachShell } from "../../components/TeachShell";
import { TeachPrivate } from "../../components/TeachPrivate";
import { useTeachAuth } from "../../components/TeachAuthProvider";
import { Button } from "@lurexa/ui/button";

export default function EducatorApprovalsPage() {
  const { user, loading: authLoading } = useTeachAuth();
  const [pending, setPending] = useState<EducatorProfile[]>([]);
  const [approved, setApproved] = useState<EducatorProfile[]>([]);
  const [rejected, setRejected] = useState<EducatorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModalUser, setRejectModalUser] = useState<EducatorProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/teach/approval?admin=1", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as {
          pending: EducatorProfile[];
          approved: EducatorProfile[];
          rejected: EducatorProfile[];
        };
        setPending(data.pending || []);
        setApproved(data.approved || []);
        setRejected(data.rejected || []);
      }
    } catch (err) {
      console.error("Failed to load approval requests:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      let isMounted = true;
      user.getIdToken().then(async (token) => {
        const res = await fetch("/api/teach/approval?admin=1", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.ok && isMounted) {
          const data = (await res.json()) as {
            pending: EducatorProfile[];
            approved: EducatorProfile[];
            rejected: EducatorProfile[];
          };
          setPending(data.pending || []);
          setApproved(data.approved || []);
          setRejected(data.rejected || []);
        }
      }).catch((err) => {
        console.error("Failed to load approval requests:", err);
      }).finally(() => {
        if (isMounted) setLoading(false);
      });
      return () => { isMounted = false; };
    }
  }, [authLoading, user]);

  const handleApprove = async (targetUserId: string) => {
    if (!user) return;
    setProcessingId(targetUserId);
    setStatusMessage(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/teach/approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "approve", targetUserId }),
      });
      if (res.ok) {
        setStatusMessage("✓ Educator access approved successfully.");
        await loadRequests();
      } else {
        const errData = (await res.json()) as { error?: string };
        alert(errData.error || "Failed to approve educator.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error approving educator.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!user || !rejectModalUser) return;
    setProcessingId(rejectModalUser.userId);
    setStatusMessage(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/teach/approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "reject",
          targetUserId: rejectModalUser.userId,
          reason: rejectionReason.trim() || undefined,
        }),
      });
      if (res.ok) {
        setStatusMessage("✓ Educator request was rejected.");
        setRejectModalUser(null);
        setRejectionReason("");
        await loadRequests();
      } else {
        const errData = (await res.json()) as { error?: string };
        alert(errData.error || "Failed to reject educator.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error rejecting educator.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <TeachShell active="Dashboard">
      <TeachPrivate>
        <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-800">
                  Superuser &amp; Campus Admin Gate
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-[-.05em] text-[var(--lx-ink)] sm:text-4xl">
                Educator Access Approvals
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--lx-muted)]">
                Review and authorize educator accounts for Lurexa Teach. Only verified educators and teacher trainees receive full platform access.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-5 text-xs font-black text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)]"
            >
              ← Back to Teach Dashboard
            </Link>
          </div>

          {statusMessage && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 shadow-sm animate-fade-slide-up">
              {statusMessage}
            </div>
          )}

          {/* Stats Cards */}
          <section className="grid gap-4 sm:grid-cols-3">
            <article
              onClick={() => setActiveTab("pending")}
              className={`cursor-pointer rounded-[24px] border p-6 transition shadow-sm ${
                activeTab === "pending"
                  ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] ring-2 ring-[var(--lx-primary)]/20"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-slate-400"
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Pending Review</p>
              <b className="mt-2 block text-3xl font-black text-[var(--lx-ink)]">{pending.length}</b>
              <p className="mt-1 text-xs text-[var(--lx-muted)]">Awaiting administrator decision</p>
            </article>

            <article
              onClick={() => setActiveTab("approved")}
              className={`cursor-pointer rounded-[24px] border p-6 transition shadow-sm ${
                activeTab === "approved"
                  ? "border-emerald-500 bg-[var(--lx-surface)] ring-2 ring-emerald-500/20"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-slate-400"
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Authorized Educators</p>
              <b className="mt-2 block text-3xl font-black text-[var(--lx-ink)]">{approved.length}</b>
              <p className="mt-1 text-xs text-[var(--lx-muted)]">Approved active teachers</p>
            </article>

            <article
              onClick={() => setActiveTab("rejected")}
              className={`cursor-pointer rounded-[24px] border p-6 transition shadow-sm ${
                activeTab === "rejected"
                  ? "border-rose-500 bg-[var(--lx-surface)] ring-2 ring-rose-500/20"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-slate-400"
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-600">Rejected / Denied</p>
              <b className="mt-2 block text-3xl font-black text-[var(--lx-ink)]">{rejected.length}</b>
              <p className="mt-1 text-xs text-[var(--lx-muted)]">Unapproved requests</p>
            </article>
          </section>

          {/* List Table / Cards */}
          <section className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-4 mb-6">
              <h2 className="text-lg font-black text-[var(--lx-ink)] capitalize">
                {activeTab === "pending" ? "Awaiting Review" : activeTab === "approved" ? "Active Educators" : "Rejected Profiles"} ({
                  activeTab === "pending" ? pending.length : activeTab === "approved" ? approved.length : rejected.length
                })
              </h2>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => void loadRequests()}
                className="text-xs font-bold text-[var(--lx-primary)]"
              >
                🔄 Refresh
              </Button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm font-bold text-[var(--lx-muted)]">
                Loading educator requests…
              </div>
            ) : (
              (() => {
                const currentList = activeTab === "pending" ? pending : activeTab === "approved" ? approved : rejected;

                if (currentList.length === 0) {
                  return (
                    <div className="py-12 text-center text-sm text-[var(--lx-muted)]">
                      No {activeTab} educator requests at this time.
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {currentList.map((req) => (
                      <article
                        key={req.userId}
                        className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-black text-[var(--lx-ink)]">{req.displayName}</h3>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                req.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : req.status === "rejected"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {req.status || "pending"}
                            </span>
                          </div>

                          <p className="text-xs text-[var(--lx-muted)]">
                            User ID: <code className="text-[11px] font-mono">{req.userId}</code> · Registered: {new Date(req.createdAt).toLocaleDateString()}
                          </p>

                          {req.headline ? (
                            <p className="text-xs font-medium text-[var(--lx-ink)]">{req.headline}</p>
                          ) : null}

                          {req.targetCefrLevel ? (
                            <p className="text-[11px] text-[var(--lx-muted)]">
                              Target CEFR: <strong>{req.targetCefrLevel}</strong>
                              {req.cefrLevel ? ` · Calibrated: ${req.cefrLevel}` : ""}
                            </p>
                          ) : null}

                          {req.rejectionReason ? (
                            <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-1">
                              Reason: {req.rejectionReason}
                            </p>
                          ) : null}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {req.status !== "approved" && (
                            <Button
                              type="button"
                              onClick={() => void handleApprove(req.userId)}
                              disabled={processingId === req.userId}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-500 transition active:scale-95 disabled:opacity-50"
                            >
                              {processingId === req.userId ? "Saving…" : "✓ Approve Access"}
                            </Button>
                          )}

                          {req.status !== "rejected" && (
                            <Button
                              type="button"
                              onClick={() => setRejectModalUser(req)}
                              disabled={processingId === req.userId}
                              className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-black text-rose-800 hover:bg-rose-100 transition active:scale-95 disabled:opacity-50"
                            >
                              Reject Request
                            </Button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                );
              })()
            )}
          </section>

          {/* Reject Reason Modal */}
          {rejectModalUser && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
              <div className="w-full max-w-md rounded-3xl bg-[var(--lx-surface)] p-6 shadow-2xl border border-[var(--lx-border)] space-y-4 animate-fade-slide-up">
                <h3 className="text-lg font-black text-[var(--lx-ink)]">
                  Reject Educator Access: {rejectModalUser.displayName}
                </h3>
                <p className="text-xs text-[var(--lx-muted)] leading-relaxed">
                  Provide optional feedback or reason for rejecting this educator request. The user will see this note when attempting to sign in.
                </p>

                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Please verify your institution teaching affiliation before requesting Teach access."
                  rows={3}
                  className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-xs font-medium text-[var(--lx-ink)] outline-none focus:border-rose-500"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRejectModalUser(null);
                      setRejectionReason("");
                    }}
                    className="text-xs font-bold text-[var(--lx-muted)]"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={() => void handleReject()}
                    disabled={processingId === rejectModalUser.userId}
                    className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-black text-white hover:bg-rose-500 transition"
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </TeachPrivate>
    </TeachShell>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeachAuth } from "./TeachAuthProvider";

export function TeachPrivate({ children }: { children: React.ReactNode }) {
  const { user, profile, canAccessTeach, isPendingApproval, isRejected, loading, requestAccess, logout } = useTeachAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-[55vh] place-items-center px-5 text-sm font-bold text-[var(--lx-muted)]" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-[var(--lx-primary)] border-t-transparent" />
          <span>Verifying educator credentials…</span>
        </div>
      </div>
    );
  }

  // Security Gate: User is authenticated but not yet approved for Teach
  if (!canAccessTeach) {
    return (
      <main className="mx-auto flex min-h-[75vh] max-w-[700px] flex-col items-center justify-center px-5 py-12 text-center">
        <div className="w-full rounded-[32px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 shadow-xl sm:p-12">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-500/10 text-3xl">
            {isRejected ? "🚫" : "🛡️"}
          </div>

          <h2 className="mt-6 text-2xl font-black text-[var(--color-brand-navy)] sm:text-3xl">
            {isRejected
              ? "Educator Access Not Approved"
              : isPendingApproval
              ? "Educator Access Pending Approval"
              : "Educator Authorization Required"}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[var(--lx-muted)]">
            {isRejected
              ? profile?.rejectionReason || "Your request to access Lurexa Teach was reviewed and could not be approved at this time. Please reach out to your Campus Administrator."
              : isPendingApproval
              ? "Your Lurexa Teach access request has been submitted and is currently under review by a Superuser or Campus Administrator."
              : "Lurexa Teach is reserved for verified educators and teacher trainees. Access requires prior authorization from a Superuser or Campus Administrator."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {!isPendingApproval && !isRejected ? (
              <button
                type="button"
                onClick={() => void requestAccess()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--lx-primary)] px-6 text-sm font-black text-white hover:opacity-90 transition"
              >
                Submit Educator Access Request
              </button>
            ) : null}

            <a
              href="https://learn.lurexa.com"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-6 text-sm font-bold text-[var(--color-brand-navy)] hover:bg-[var(--lx-surface)] transition"
            >
              Return to Lurexa Learn →
            </a>

            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-transparent px-4 text-xs font-semibold text-[var(--lx-muted)] hover:text-rose-600 transition"
            >
              Sign out
            </button>
          </div>

          <div className="mt-8 border-t border-[var(--lx-border)] pt-5 text-xs text-[var(--lx-muted)]">
            <span>Signed in as <strong>{user.email}</strong></span>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}


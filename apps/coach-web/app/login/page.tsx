"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AuthService } from "@lurexa/backend";

export default function CoachLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await AuthService.login(email, password);
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <ProductMark product="coach" size="lg" />
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-.04em] text-[var(--lx-ink)]">
          Sign in to Lurexa Coach
        </h1>
        <p className="mt-2 text-xs text-[var(--lx-muted)]">
          Continue your personalized AI speaking and pronunciation journey.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div role="alert" className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--lx-ink)] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-2.5 text-sm text-[var(--lx-ink)] outline-none focus:border-[#12cdd4] focus:ring-1 focus:ring-[#12cdd4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--lx-ink)] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-2.5 text-sm text-[var(--lx-ink)] outline-none focus:border-[#12cdd4] focus:ring-1 focus:ring-[#12cdd4]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#592bd6] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#4a22b8] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In to Coach"}
            </button>
          </form>

          <div className="mt-6 border-t border-[var(--lx-border)] pt-6">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] py-2.5 text-xs font-bold text-[var(--lx-ink)] transition hover:bg-[var(--lx-border)]/50 active:scale-95"
            >
              🚀 Quick Demo Access (Guest Learner)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-[var(--lx-muted)]">
            <span>New to Lurexa Coach? </span>
            <Link href="/placement" className="font-bold text-[#592bd6] hover:underline">
              Take Free Speaking Placement
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

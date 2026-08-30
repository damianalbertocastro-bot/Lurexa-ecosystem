"use client";

import React, { Suspense, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AuthService } from "@lurexa/backend";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

function readSafeContinueTo(value: string | null): string | null {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

function CoachLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await AuthService.login(email, password);
      } else {
        await AuthService.register(email, password);
      }

      const continueTo = readSafeContinueTo(searchParams.get("continue"));
      router.replace(continueTo || "/dashboard");
    } catch (cause) {
      const code =
        typeof cause === "object" && cause !== null && "code" in cause
          ? String((cause as { code?: unknown }).code)
          : "";
      if (code === "auth/email-already-in-use") {
        setError("This email already belongs to a Lurexa account. Sign in with your same Lurexa account instead.");
      } else {
        setError(
          cause instanceof Error
            ? cause.message
            : mode === "login"
            ? "Unable to sign in with your same Lurexa account. Please verify your credentials."
            : "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--lx-surface)] via-[var(--lx-surface)] to-[var(--lx-surface)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <ProductMark product="coach" size="lg" />
        </Link>
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--lx-primary)]">
          One Lurexa Identity
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-[-0.04em] text-slate-900">
          {mode === "login" ? "Continue your speaking journey" : "Create your Lurexa account"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          {mode === "login"
            ? "Sign in with your existing same Lurexa account across Learn and Teach. No second account is required."
            : "One account connects your practice across Coach, Learn, and Teach."}
        </p>

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-[var(--lx-border)] bg-white p-7 sm:p-9 shadow-[0_24px_70px_rgba(31,50,120,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 font-semibold"
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Email address
              </label>
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--lx-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--lx-primary)]/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--lx-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--lx-primary)]/10"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)] py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-purple-500/20 transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
            >
              {loading
                ? "Working…"
                : mode === "login"
                ? "Sign In to Coach"
                : "Create Lurexa Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === "login" ? "register" : "login");
              }}
              className="text-xs font-bold text-[var(--lx-secondary)] hover:underline"
            >
              {mode === "login"
                ? "New to Lurexa? Create an account"
                : "Already have a Learn, Teach, or Coach account? Sign in"}
            </Button>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <Button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
            >
              🚀 Quick Demo Access (Guest Learner)
            </Button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Want to test your English speaking level first? </span>
            <Link href="/placement" className="font-bold text-[var(--lx-primary)] hover:underline">
              Take Free Speaking Placement
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CoachLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--lx-surface)] flex items-center justify-center p-8 text-sm text-slate-600">
          Loading Coach sign in…
        </div>
      }
    >
      <CoachLoginForm />
    </Suspense>
  );
}

"use client";

import React, { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService, UserService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { GoogleSignInButton } from "@lurexa/ui/GoogleSignInButton";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { LanguageSelector } from "@lurexa/ui/LanguageSelector";
import { Card } from "@lurexa/ui/Card";
import { Input } from "@lurexa/ui/Input";
import { Button } from "@lurexa/ui/button";
import { useTranslation } from "@lurexa/i18n";

function readSafeContinueTo(target: string | null): string | null {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return null;
  return target;
}

function InsightLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const continueTo = readSafeContinueTo(searchParams.get("continue"));

  async function handleGoogleLogin(): Promise<void> {
    setGoogleLoading(true);
    setError(null);

    try {
      const { user, isNewUser } = await AuthService.loginWithGoogle();
      if (isNewUser) {
        // Seed institutional educator role in Core
        await UserService.updateUserProfile(user.uid, {
          role: "admin",
          headline: "Institutional Lead · Lurexa Insight",
          primaryGoal: "institutional_analytics",
        });
      }
      router.replace(continueTo || "/");
    } catch (cause: unknown) {
      if (!AuthService.isPopupDismissedError(cause)) {
        setError(cause instanceof Error ? cause.message : "Unable to sign in with Google.");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await AuthService.login(email.trim(), password);
      } else {
        const user = await AuthService.register(email.trim(), password);
        await UserService.updateUserProfile(user.uid, {
          displayName: institutionName.trim() || undefined,
          role: "admin",
          headline: "Institutional Lead · Lurexa Insight",
          primaryGoal: "institutional_analytics",
        });
      }
      router.replace(continueTo || "/");
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-gradient-to-br from-[var(--lx-surface)] via-[var(--lx-canvas)] to-[var(--lx-surface)] px-5 py-10 text-[var(--lx-ink)]">
      {/* Top Utility Controls */}
      <div className="fixed right-6 top-6 z-20 flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 shadow-2xs">
        <LanguageSelector variant="segmented" compact />
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
        <ThemeToggle className="h-8 w-8 rounded-lg border-0 bg-transparent shadow-none hover:bg-slate-100 dark:hover:bg-slate-800" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-7 flex flex-col items-center justify-center gap-2 text-center">
          <Link href="/" aria-label="Lurexa Insight Home" className="transition hover:opacity-90">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-500/20">
                <ProductMark product="insight" compact size="md" />
              </span>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Lurexa <span className="text-indigo-600 dark:text-indigo-400">Insight</span>
              </span>
            </div>
          </Link>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300">
            Institutional Intelligence &amp; Analytics
          </span>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Cohort tracking, phonemic difficulty heatmaps, and intervention routing for schools and enterprise teams.
          </p>
        </div>

        <Card
          title={mode === "login" ? "Sign in to Insight" : "Institutional Access"}
          subtitle="Institutional analytics for educational leaders, bilingual program directors, and independent teachers."
          className="border-slate-200 dark:border-slate-800 p-7 sm:p-8 shadow-[var(--lx-card-shadow)] bg-white dark:bg-slate-900"
        >
          {/* Mode Switcher */}
          <div className="mb-5 flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              New Institution
            </button>
          </div>

          {/* Google Sign-In Button */}
          <div className="mb-4 space-y-3">
            <GoogleSignInButton
              onClick={handleGoogleLogin}
              isLoading={googleLoading}
              disabled={loading || googleLoading}
            />
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {t("actions.orContinueWithEmail", "or continue with email")}
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form className="space-y-4 pt-1" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label
                  htmlFor="institutionName"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Institution / School Name
                </label>
                <Input
                  id="institutionName"
                  name="institutionName"
                  type="text"
                  placeholder="e.g. Instituto Politécnico Loyola"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Institutional Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="director@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 px-3.5 py-3 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800"
              >
                {error}
              </p>
            )}

            <Button className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white" type="submit" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Signing in…"
                  : "Registering Institution…"
                : mode === "login"
                ? "Sign in to Insight →"
                : "Create Institutional Profile →"}
            </Button>
          </form>

          <p className="mt-5 text-[11px] leading-4 text-slate-400 dark:text-slate-500 text-center">
            Insight aggregates student proficiency data governed under Lurexa Core privacy contracts.
          </p>
        </Card>
      </div>
    </main>
  );
}

export default function InsightLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <InsightLoginForm />
    </Suspense>
  );
}

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

function StudioLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
        // Seed author/educator role in Core
        await UserService.updateUserProfile(user.uid, {
          role: "author",
          headline: "Curriculum Architect · Lurexa Studio",
          primaryGoal: "curriculum_design",
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
          displayName: fullName.trim() || undefined,
          role: "author",
          headline: "Curriculum Architect · Lurexa Studio",
          primaryGoal: "curriculum_design",
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
      <div className="fixed right-6 top-6 z-20 flex items-center gap-1.5 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)]/90 backdrop-blur-md p-1 shadow-2xs">
        <LanguageSelector variant="segmented" compact />
        <div className="h-4 w-px bg-[var(--lx-border)]" aria-hidden="true" />
        <ThemeToggle className="h-8 w-8 rounded-lg border-0 bg-transparent shadow-none hover:bg-[var(--lx-canvas)]" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-7 flex flex-col items-center justify-center gap-2 text-center">
          <Link href="/" aria-label="Lurexa Studio Home" className="transition hover:opacity-90">
            <ProductMark product="studio" />
          </Link>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-800 dark:bg-violet-950/70 dark:text-violet-300">
            Authoring &amp; Curriculum Design
          </span>
          <p className="mt-1 text-xs text-[var(--lx-muted)] max-w-xs">
            Create, lint, and calibrate immutable CEFR learning objects for educators and learners.
          </p>
        </div>

        <Card
          title={mode === "login" ? "Sign in to Studio" : "Create Author Account"}
          subtitle="Governed knowledge object authoring for educators and curriculum architects."
          className="border-[var(--lx-border)] p-7 sm:p-8 shadow-[var(--lx-card-shadow)]"
        >
          {/* Mode Switcher */}
          <div className="mb-5 flex rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                mode === "login"
                  ? "bg-[var(--lx-surface)] text-[var(--lx-ink)] shadow-xs"
                  : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
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
                  ? "bg-[var(--lx-surface)] text-[var(--lx-ink)] shadow-xs"
                  : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              }`}
            >
              New Author
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
              <div className="w-full border-t border-[var(--lx-border)]" />
              <span className="relative bg-[var(--lx-surface)] px-3 text-[11px] font-bold text-[var(--lx-muted)]">
                {t("actions.orContinueWithEmail", "or continue with email")}
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form className="space-y-4 pt-1" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--lx-ink)]"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Professor Elena Rodriguez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--lx-ink)]"
              >
                Educator Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="author@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--lx-ink)]"
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

            <Button className="w-full font-bold" type="submit" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating Author Account…"
                : mode === "login"
                ? "Sign in to Studio →"
                : "Create Author Profile →"}
            </Button>
          </form>

          <p className="mt-5 text-[11px] leading-4 text-[var(--lx-muted)] text-center">
            Studio authored assets are stored in Lurexa Core and published across Learn, Coach, and Teach.
          </p>
        </Card>
      </div>
    </main>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[var(--lx-canvas)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--lx-primary)] border-t-transparent" />
        </div>
      }
    >
      <StudioLoginForm />
    </Suspense>
  );
}

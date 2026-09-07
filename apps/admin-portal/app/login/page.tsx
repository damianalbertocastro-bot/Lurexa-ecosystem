"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Input } from "@lurexa/ui/Input";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "setup">("signin");
  const [email, setEmail] = useState("damianalbertocastro@gmail.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === "setup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        // Call server bootstrap endpoint
        const res = await fetch("/api/admin/bootstrap-superadmin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(data.error || "Failed to set up superadmin credentials.");
        }
        setSuccessMessage("Superadmin password configured! Signing in to console…");
      }

      // Perform authentication
      const user = await AuthService.login(email.trim(), password);
      const claims = await AuthService.getUserClaims(user);
      if (claims.role !== "super_admin") {
        await AuthService.logout();
        throw new Error("This account does not have Lurexa Admin access.");
      }
      router.replace("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to complete action.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-gradient-to-br from-[var(--lx-surface)] via-[var(--lx-canvas)] to-[var(--lx-surface)] px-5 py-10 text-[var(--color-brand-navy)]">
      {/* Light / Dark Mode Toggle */}
      <div className="fixed right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-7 flex flex-col items-center justify-center gap-2">
          <ProductMark product="admin" />
          <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-800 dark:bg-violet-950/70 dark:text-violet-300">
            Ecosystem Master Administration
          </span>
        </div>

        <Card
          title={mode === "signin" ? "Sign in to Lurexa Admin" : "First-Time Superadmin Setup"}
          subtitle="Platform operations and master controls are restricted to verified superadmin accounts."
          titleClassName="text-black dark:text-white dark:!text-white"
        >
          {/* Mode Switcher */}
          <div className="mb-4 flex rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                mode === "signin"
                  ? "bg-white text-[var(--lx-ink)] shadow-xs dark:bg-black dark:text-white"
                  : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)] dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("setup");
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                mode === "setup"
                  ? "bg-white text-[var(--lx-ink)] shadow-xs dark:bg-black dark:text-white"
                  : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)] dark:hover:text-white"
              }`}
            >
              Set / Reset Password
            </button>
          </div>

          <form className="space-y-4 pt-2" onSubmit={(event) => void submit(event)}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)] dark:text-white">
                Superadmin Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-[var(--lx-border)] bg-white px-3.5 text-sm text-[var(--color-brand-navy)] outline-none transition focus:border-[var(--lx-primary)] focus:ring-4 focus:ring-[var(--lx-primary)]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)] dark:text-white">
                {mode === "setup" ? "New Superadmin Password" : "Password"}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "setup" ? "new-password" : "current-password"}
                required
                placeholder={mode === "setup" ? "At least 6 characters" : "••••••••"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-[var(--lx-border)] bg-white px-3.5 text-sm text-[var(--color-brand-navy)] outline-none transition focus:border-[var(--lx-primary)] focus:ring-4 focus:ring-[var(--lx-primary)]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {mode === "setup" && (
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)] dark:text-white">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="min-h-11 w-full rounded-xl border border-[var(--lx-border)] bg-white px-3.5 text-sm text-[var(--color-brand-navy)] outline-none transition focus:border-[var(--lx-primary)] focus:ring-4 focus:ring-[var(--lx-primary)]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            )}

            {error ? (
              <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800">
                {error}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-xl bg-emerald-50 px-3.5 py-3 text-xs font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800">
                {successMessage}
              </p>
            ) : null}

            <Button className="w-full font-bold" type="submit" disabled={loading}>
              {loading
                ? mode === "setup" ? "Configuring Superadmin…" : "Signing in…"
                : mode === "setup" ? "Save Password & Sign In →" : "Sign in to Admin Portal"}
            </Button>
          </form>

          <p className="mt-5 text-[11px] leading-4 text-[var(--lx-muted)]">
            Designated superadmin operations are governed by Lurexa Core security contracts. All changes and administrative deletions are tracked with cryptographic provenance.
          </p>
        </Card>
      </div>
    </main>
  );
}

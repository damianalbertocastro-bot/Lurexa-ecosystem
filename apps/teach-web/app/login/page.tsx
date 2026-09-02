"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [accountType, setAccountType] = useState<"independent" | "institutional">("independent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [teachingFocus, setTeachingFocus] = useState("secondary-english");
  const [cefrGoal, setCefrGoal] = useState("C1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") {
        await AuthService.login(email, password);
        router.replace("/dashboard");
      } else {
        await AuthService.register(email, password);
        if (accountType === "independent") {
          router.replace("/assessment/diagnostic?onboarding=1");
        } else {
          router.replace("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not complete that request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--lx-canvas)] px-5 py-10">
      <section className="w-full max-w-lg rounded-[30px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-[0_24px_70px_rgba(31,50,120,.12)] sm:p-9">
        <ProductMark product="teach" />
        <p className="mt-8 text-[10px] font-black tracking-[.18em] text-[var(--lx-primary)]">
          PROFESSIONAL GROWTH SPACE
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-.05em] text-[var(--lx-ink)]">
          {mode === "login" ? "Continue with your Lurexa account." : "Start your Lurexa educator journey."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">
          {mode === "login"
            ? "Already teach in Lurexa Learn? Use the same account—no second Teach registration is required. Your professional learning stays connected to your Lurexa identity."
            : "Create your professional educator profile to unlock personalized pedagogical development, diagnostic benchmarks, and verified credentials."}
        </p>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          {mode === "register" && (
            <>
              {/* Account Pathway Selection */}
              <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5">
                <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-muted)] mb-2.5">
                  Educator Profile Type
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType("independent")}
                    className={`rounded-xl border p-3 text-left transition ${
                      accountType === "independent"
                        ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] shadow-xs"
                        : "border-[var(--lx-border)] bg-[var(--lx-canvas)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span className="block text-xs font-black text-[var(--lx-ink)]">🌟 Independent Educator</span>
                    <span className="mt-1 block text-[11px] text-[var(--lx-muted)]">
                      Diagnostic placement test & level-based course assignment.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType("institutional")}
                    className={`rounded-xl border p-3 text-left transition ${
                      accountType === "institutional"
                        ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] shadow-xs"
                        : "border-[var(--lx-border)] bg-[var(--lx-canvas)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span className="block text-xs font-black text-[var(--lx-ink)]">🏫 School / Campus</span>
                    <span className="mt-1 block text-[11px] text-[var(--lx-muted)]">
                      Affiliated with a partner school or university campus.
                    </span>
                  </button>
                </div>
              </div>

              <label className="block text-xs font-extrabold text-[var(--lx-muted)]">
                Full Name
                <Input
                  type="text"
                  required
                  placeholder="e.g. Professor Maria Santos"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-4 text-sm font-semibold text-[var(--lx-ink)] outline-none focus:border-[var(--lx-secondary)] focus:ring-4 focus:ring-[var(--lx-secondary)]/10"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs font-extrabold text-[var(--lx-muted)]">
                  Teaching Focus
                  <select
                    value={teachingFocus}
                    onChange={(e) => setTeachingFocus(e.target.value)}
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3 text-sm font-semibold text-[var(--lx-ink)] outline-none focus:border-[var(--lx-secondary)]"
                  >
                    <option value="primary-esl">Primary / Elementary ESL</option>
                    <option value="secondary-english">Secondary English / High School</option>
                    <option value="higher-ed">Higher Education / University</option>
                    <option value="bilingual-immersion">Bilingual / Dual Immersion</option>
                    <option value="adult-business">Adult / Business English</option>
                  </select>
                </label>

                <label className="block text-xs font-extrabold text-[var(--lx-muted)]">
                  Target CEFR Goal
                  <select
                    value={cefrGoal}
                    onChange={(e) => setCefrGoal(e.target.value)}
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3 text-sm font-semibold text-[var(--lx-ink)] outline-none focus:border-[var(--lx-secondary)]"
                  >
                    <option value="B2">B2 (Vantage / Upper Intermediate)</option>
                    <option value="C1">C1 (Effective Operational Proficiency)</option>
                    <option value="C2">C2 (Mastery / Native Intelligibility)</option>
                  </select>
                </label>
              </div>
            </>
          )}

          <label className="block text-xs font-extrabold text-[var(--lx-muted)]">
            Email
            <Input
              type="email"
              required
              placeholder="you@institution.edu"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-4 text-sm font-semibold text-[var(--lx-ink)] outline-none focus:border-[var(--lx-secondary)] focus:ring-4 focus:ring-[var(--lx-secondary)]/10"
            />
          </label>

          <label className="block text-xs font-extrabold text-[var(--lx-muted)]">
            Password
            <Input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-4 text-sm font-semibold text-[var(--lx-ink)] outline-none focus:border-[var(--lx-secondary)] focus:ring-4 focus:ring-[var(--lx-secondary)]/10"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-bold text-slate-900 shadow-xs dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100"
            >
              {error}
            </p>
          )}

          <Button
            disabled={busy}
            className="min-h-12 w-full rounded-xl bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] px-5 text-sm font-extrabold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
          >
            {busy
              ? "Working…"
              : mode === "login"
              ? "Enter Lurexa Teach"
              : accountType === "independent"
              ? "Create Profile & Start Diagnostic Placement →"
              : "Create Educator Profile"}
          </Button>
        </form>

        <Button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-5 min-h-11 w-full text-sm font-extrabold text-[var(--lx-secondary)] hover:underline"
        >
          {mode === "login"
            ? "New to all of Lurexa? Create an educator account"
            : "Already use any Lurexa product? Sign in"}
        </Button>
      </section>
    </main>
  );
}

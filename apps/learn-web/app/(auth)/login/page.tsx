"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await AuthService.login(email, password);
      const claims = await AuthService.getUserClaims(user);
      const memberships = await OrganizationService.getMembershipsForUser(user.uid);
      const isTeacher = memberships.some((membership) => ["owner", "admin", "teacher"].includes(membership.role));
      router.replace(claims.role === "teacher" || claims.role === "admin" || isTeacher ? "/teacher/dashboard" : "/dashboard");
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not sign you in. Check your email and password, then try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-[var(--learn-line)] bg-white shadow-xl shadow-slate-200/40 lg:grid-cols-[1.02fr_.98fr]">
        <section className="relative overflow-hidden bg-[var(--learn-ink)] p-7 text-white sm:p-10 lg:p-12">
          <div aria-hidden="true" className="absolute inset-0 [background:radial-gradient(circle_at_80%_18%,rgba(79,70,229,.55),transparent_29%),radial-gradient(circle_at_15%_86%,rgba(45,212,191,.18),transparent_26%)]" />
          <div className="relative flex h-full flex-col">
            <LurexaLearnLogo inverse />
            <div className="my-auto max-w-md py-14">
              <p className="text-xs font-bold tracking-[.18em] text-sky-200">WELCOME BACK</p>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Continue the work that is making your English more useful.</h1>
              <p className="mt-6 text-base leading-7 text-slate-300">Your learning path, course progress, and teaching workspace are ready when you are.</p>
            </div>
            <p className="text-sm text-slate-400">Lurexa keeps your next step close—without making you start over.</p>
          </div>
        </section>

        <section className="flex items-center p-7 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">SIGN IN</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--learn-ink)]">Pick up where you left off.</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--learn-muted)]">Use the account connected to your learner or educator workspace.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <Input id="email" label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              <Input id="password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>Continue to Lurexa</Button>
            </form>

            <div className="mt-7 border-t border-[var(--learn-line)] pt-6 text-center text-sm text-[var(--learn-muted)]">
              New to Lurexa? <Link href="/signup" className="font-bold text-[var(--learn-brand-strong)] underline-offset-4 hover:underline">Create your account</Link>
            </div>
            <Link href="/" className="mt-6 block text-center text-sm font-semibold text-slate-500 hover:text-[var(--learn-brand-strong)]">← Back to Lurexa Learn</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

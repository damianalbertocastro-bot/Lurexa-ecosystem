"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";

function readSafeContinueTo(value: string | null): string | null {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate credentials
      const user = await AuthService.login(email, password);

      // 2. Validate session & claims
      const claims = await AuthService.getUserClaims(user);
      const memberships = await OrganizationService.getMembershipsForUser(user.uid);
      const isTeacher = memberships.some((membership) =>
        ["owner", "admin", "teacher"].includes(membership.role),
      );

      // Preserve an explicitly requested, same-origin route after authentication.
      const continueTo = readSafeContinueTo(searchParams.get("continue"));
      if (continueTo) {
        router.replace(continueTo);
      } else if (claims.role === "teacher" || claims.role === "admin" || isTeacher) {
        router.replace("/teacher/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[var(--lx-canvas)]">
      {/* Left Brand Panel — hidden on mobile */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        {/* Ambient Glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10">
          <LurexaLearnLogo inverse />
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1 text-xs font-bold text-sky-300 backdrop-blur-md">
            <span>✨</span> One Learner. One Evolving Model.
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Pick up your learning right where you left off.
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Every practice turn, conversational session, and assessment strengthens your personal path across the Lurexa ecosystem.
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
            <div>
              <p className="font-bold text-white">CEFR Aligned</p>
              <p>Levels A1 through C2</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-bold text-white">Instant Feedback</p>
              <p>Speech & phonetic clarity</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Lurexa Learning Technologies
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-6">
            <LurexaLearnLogo />
          </div>

          <Card
            title="Welcome back"
            subtitle="Sign in to continue your personalized learning journey."
            className="border-[var(--lx-border)] p-8 shadow-[var(--lx-card-shadow)]"
          >
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
              />

              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {error && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Sign In
              </Button>

              <div className="space-y-2 text-center text-xs text-[var(--lx-muted)] pt-3 border-t border-[var(--lx-border)]">
                <p>
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-bold text-[var(--lx-primary)] hover:underline">
                    Create student account
                  </Link>
                </p>
                <p>
                  Educator?{" "}
                  <Link href="/signup?role=educator" className="font-bold text-[var(--lx-secondary)] hover:underline">
                    Educator portal registration
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--lx-canvas)] p-8 text-sm text-slate-600">Loading sign in…</div>}>
      <LoginForm />
    </Suspense>
  );
}

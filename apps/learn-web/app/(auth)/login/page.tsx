"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mb-7"><LurexaLearnLogo href={ecosystemUrl} /></div>
      <Card
        title="Welcome back."
        subtitle="Continue the path you were building."
        className="w-full max-w-md border-[#dfe7fb] p-7 sm:p-8"
      >
        <form onSubmit={handleLogin} className="space-y-4">
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
            required
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Sign In
          </Button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-bold text-[#592bd6] hover:text-[#1d5add]">
              Sign up here
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--learn-canvas)] p-8 text-sm text-slate-600">Loading sign in…</div>}>
      <LoginForm />
    </Suspense>
  );
}

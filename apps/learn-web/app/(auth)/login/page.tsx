"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { AuthService, OrganizationService } from "@lurexa/backend";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

export default function LoginPage() {
  const router = useRouter();
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

      // 3. Redirect based on authenticated session
      if (claims.role === "teacher" || claims.role === "admin" || isTeacher) {
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--learn-canvas)] p-4 sm:p-8">
      <a href={ecosystemUrl} className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 transition hover:text-indigo-600" aria-label="Return to the Lurexa ecosystem">
        lurexa<span className="text-indigo-600">.</span>
        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">Learn</span>
      </a>
      <Card
        title="Welcome back to Lurexa"
        subtitle="Log in to your learning workspace"
        className="w-full max-w-md"
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
            <a href="/signup" className="text-indigo-600 hover:underline font-medium">
              Sign up here
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"teacher" | "student">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await AuthService.register(email, password);
      if (mode === "teacher") {
        if (!orgName) throw new Error("Enter your school or institution name to continue.");
        const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        await OrganizationService.createOrganization(orgName, slug, user.uid);
      } else {
        if (!inviteCode) throw new Error("Enter the class access code shared by your teacher.");
        await OrganizationService.joinViaCode(user.uid, user.email ?? email, inviteCode);
      }
      router.replace(mode === "teacher" ? "/teacher/dashboard" : "/dashboard");
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = mode === "student";

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-[var(--learn-line)] bg-white shadow-xl shadow-slate-200/40 lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[var(--learn-sky)] p-7 sm:p-10 lg:p-12">
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-200/70 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <LurexaLearnLogo />
            <div className="my-auto max-w-sm py-14">
              <p className="text-xs font-bold tracking-[.18em] text-[var(--learn-brand-strong)]">START WITH A MEANINGFUL STEP</p>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[var(--learn-ink)]">A clearer path for learning—and for teaching.</h1>
              <p className="mt-6 leading-7 text-[var(--learn-ink-soft)]">Choose the space that fits what you are here to do. Lurexa will take you directly to the next useful setup step.</p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-white/80 p-4 text-sm leading-6 text-slate-600">
              Your account connects your learning or teaching work over time. You can manage your access through your organization.
            </div>
          </div>
        </section>

        <section className="flex items-center p-7 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">CREATE ACCOUNT</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--learn-ink)]">{isStudent ? "Join your learning path." : "Create your teaching space."}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--learn-muted)]">{isStudent ? "Use the class access code your teacher shared with you." : "Set up the space where you will create courses and support learners."}</p>

            <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Choose account type">
              <button type="button" role="tab" aria-selected={isStudent} onClick={() => setMode("student")} className={`rounded-lg px-3 py-3 text-sm font-bold transition ${isStudent ? "bg-white text-[var(--learn-ink)] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>I&apos;m learning</button>
              <button type="button" role="tab" aria-selected={!isStudent} onClick={() => setMode("teacher")} className={`rounded-lg px-3 py-3 text-sm font-bold transition ${!isStudent ? "bg-white text-[var(--learn-ink)] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>I&apos;m teaching</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Input id="email" label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              <Input id="password" label="Create a password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              {isStudent ? (
                <div>
                  <Input id="invite-code" label="Class access code" placeholder="For example: X7K9PQ" value={inviteCode} onChange={(event) => setInviteCode(event.target.value.toUpperCase())} required />
                  <p className="mt-2 text-xs leading-5 text-[var(--learn-muted)]">Ask your teacher for this code if you do not have it yet.</p>
                </div>
              ) : (
                <div>
                  <Input id="organization-name" label="School or institution name" placeholder="For example: ABC Language Academy" value={orgName} onChange={(event) => setOrgName(event.target.value)} required />
                  <p className="mt-2 text-xs leading-5 text-[var(--learn-muted)]">This creates your organization&apos;s teaching workspace.</p>
                </div>
              )}
              {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>{isStudent ? "Join my class" : "Create teaching space"}</Button>
            </form>

            <p className="mt-7 text-center text-sm text-[var(--learn-muted)]">Already have an account? <Link href="/login" className="font-bold text-[var(--learn-brand-strong)] underline-offset-4 hover:underline">Sign in</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}

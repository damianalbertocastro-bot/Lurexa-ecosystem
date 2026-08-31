"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"teacher" | "student">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [studentPath, setStudentPath] = useState<"self-paced" | "class">("self-paced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Register User in Firebase Auth
      const user = await AuthService.register(email, password);

      // 2. Process Organization Assignment
      if (mode === "teacher") {
        if (!orgName) throw new Error("Organization name is required.");
        const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        await OrganizationService.createOrganization(orgName, slug, user.uid);
      } else if (studentPath === "class") {
        if (!inviteCode) throw new Error("Invitation code is required.");
        await OrganizationService.joinViaCode(user.uid, user.email ?? email, inviteCode);
      }

      router.replace(mode === "teacher" ? "/teacher/dashboard" : studentPath === "self-paced" ? "/onboarding" : "/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mb-7"><LurexaLearnLogo href={ecosystemUrl} /></div>
      <Card title="Start your Lurexa path." subtitle="Join a class or create your educator space." className="w-full max-w-md border-[var(--lx-border)] p-7 sm:p-8">
        <div className="mb-7 flex rounded-xl bg-[var(--lx-surface)] p-1.5">
          <Button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "student" ? "bg-[var(--lx-surface)] text-[var(--color-brand-navy)] shadow-sm" : "text-[var(--lx-muted)]"
            }`}
            onClick={() => setMode("student")}
          >
            I am a Student
          </Button>
          <Button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "teacher" ? "bg-[var(--lx-surface)] text-[var(--lx-ink)] shadow-sm" : "text-[var(--lx-muted)]"
            }`}
            onClick={() => setMode("teacher")}
          >
            I am an Educator
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          {mode === "teacher" ? (
            <Input
              id="organization-name"
              label="School / Institution Name"
              placeholder="e.g. Lincoln High School"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--lx-ink)]">How are you starting?</p>
              <label className={`block cursor-pointer rounded-xl border p-4 ${studentPath === "self-paced" ? "border-indigo-500 bg-indigo-50" : "border-[var(--lx-border)]"}`}>
                <input type="radio" name="student-path" className="mr-2" checked={studentPath === "self-paced"} onChange={() => setStudentPath("self-paced")} />
                <span className="font-semibold text-[var(--lx-ink)]">Learn independently</span>
                <span className="mt-1 block text-xs leading-5 text-[var(--lx-muted)]">Start a self-paced English path with no class code.</span>
              </label>
              <label className={`block cursor-pointer rounded-xl border p-4 ${studentPath === "class" ? "border-indigo-500 bg-indigo-50" : "border-[var(--lx-border)]"}`}>
                <input type="radio" name="student-path" className="mr-2" checked={studentPath === "class"} onChange={() => setStudentPath("class")} />
                <span className="font-semibold text-[var(--lx-ink)]">Join a teacher&apos;s class</span>
                <span className="mt-1 block text-xs leading-5 text-[var(--lx-muted)]">Use the invitation code your teacher gave you.</span>
              </label>
              {studentPath === "class" && <Input
                id="invite-code"
                label="6-Character Class Code"
                placeholder="e.g. X7K9PQ"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />}
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            {mode === "teacher" ? "Create School Account" : studentPath === "self-paced" ? "Create my learning path" : "Join Class"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

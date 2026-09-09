"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./Input";
import { Card } from "./card";

export interface StandardSignupPayload {
  mode: "student" | "teacher";
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  password?: string;
  orgName?: string;
  studentPath?: "self-paced" | "class";
  inviteCode?: string;
}

export interface StandardSignupCardProps {
  title?: string;
  subtitle?: string;
  defaultMode?: "student" | "teacher";
  showModeToggle?: boolean;
  onRegister: (data: StandardSignupPayload) => Promise<void>;
  loginUrl?: string;
  className?: string;
}

export function StandardSignupCard({
  title = "Start your Lurexa path.",
  subtitle = "Join a class or create your educator space.",
  defaultMode = "student",
  showModeToggle = true,
  onRegister,
  loginUrl = "/login",
  className = "",
}: StandardSignupCardProps) {
  const [mode, setMode] = useState<"teacher" | "student">(defaultMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
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
      if (mode === "student" && studentPath === "class" && !inviteCode.trim()) {
        throw new Error("Invitation code is required to join a class.");
      }

      const resolvedOrgName =
        mode === "teacher"
          ? orgName.trim() || `${firstName.trim() || "Educator"}'s Workspace`
          : undefined;

      await onRegister({
        mode,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim(),
        password,
        orgName: resolvedOrgName,
        studentPath: mode === "student" ? studentPath : undefined,
        inviteCode: mode === "student" && studentPath === "class" ? inviteCode.trim() : undefined,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={`w-full max-w-md border-[var(--lx-border)] p-7 sm:p-8 shadow-xl ${className}`}
    >
      {showModeToggle && (
        <div className="mb-6 flex rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-1.5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "student"}
            className={`flex-1 rounded-lg py-2.5 text-xs transition-all duration-200 ${
              mode === "student"
                ? "bg-white font-black text-[var(--lx-primary)] shadow-sm dark:bg-slate-800 dark:text-white"
                : "font-semibold text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
            }`}
            onClick={() => {
              setMode("student");
              setError("");
            }}
          >
            I am a Student
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "teacher"}
            className={`flex-1 rounded-lg py-2.5 text-xs transition-all duration-200 ${
              mode === "teacher"
                ? "bg-white font-black text-[var(--lx-primary)] shadow-sm dark:bg-slate-800 dark:text-white"
                : "font-semibold text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
            }`}
            onClick={() => {
              setMode("teacher");
              setError("");
            }}
          >
            I am an Educator
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="first-name"
            label="First Name"
            type="text"
            placeholder="e.g. Maria"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="text-black dark:text-white"
          />
          <Input
            id="last-name"
            label="Last Name"
            type="text"
            placeholder="e.g. Santos"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="text-black dark:text-white"
          />
        </div>

        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="e.g. +1 (809) 555-0123"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="text-black dark:text-white"
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black dark:text-white"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-black dark:text-white"
        />

        {mode === "teacher" ? (
          <Input
            id="organization-name"
            label="School or Institution Name (Optional)"
            placeholder="e.g. Lincoln High School or leave blank for independent tutor"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="text-black dark:text-white"
          />
        ) : (
          <div className="space-y-3 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--lx-ink)]">
              How are you starting?
            </p>
            <label
              className={`block cursor-pointer rounded-2xl border p-3.5 transition ${
                studentPath === "self-paced"
                  ? "border-[var(--lx-primary)] bg-[var(--lx-primary)]/5 ring-1 ring-[var(--lx-primary)]"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:bg-[var(--lx-canvas)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="student-path"
                  checked={studentPath === "self-paced"}
                  onChange={() => setStudentPath("self-paced")}
                  className="accent-[var(--lx-primary)]"
                />
                <span className="text-xs font-extrabold text-[var(--lx-ink)]">
                  Learn independently
                </span>
              </div>
              <span className="mt-1 block pl-5 text-[11px] leading-relaxed text-[var(--lx-muted)]">
                Start a self-paced English path with no class code.
              </span>
            </label>

            <label
              className={`block cursor-pointer rounded-2xl border p-3.5 transition ${
                studentPath === "class"
                  ? "border-[var(--lx-primary)] bg-[var(--lx-primary)]/5 ring-1 ring-[var(--lx-primary)]"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:bg-[var(--lx-canvas)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="student-path"
                  checked={studentPath === "class"}
                  onChange={() => setStudentPath("class")}
                  className="accent-[var(--lx-primary)]"
                />
                <span className="text-xs font-extrabold text-[var(--lx-ink)]">
                  Join a teacher&apos;s class
                </span>
              </div>
              <span className="mt-1 block pl-5 text-[11px] leading-relaxed text-[var(--lx-muted)]">
                Use the invitation code your teacher gave you.
              </span>
            </label>

            {studentPath === "class" && (
              <Input
                id="invite-code"
                label="6-Character Class Code"
                placeholder="e.g. X7K9PQ"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                required
                className="text-black dark:text-white uppercase font-mono tracking-widest"
              />
            )}
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full font-bold"
          disabled={loading}
        >
          {loading
            ? "Creating account…"
            : mode === "teacher"
            ? "Create Educator Account →"
            : studentPath === "self-paced"
            ? "Create Learning Path →"
            : "Join Class & Start →"}
        </Button>

        {loginUrl && (
          <p className="pt-2 text-center text-xs text-[var(--lx-muted)]">
            Already have a Lurexa account?{" "}
            <a
              href={loginUrl}
              className="font-extrabold text-[var(--lx-primary)] hover:underline"
            >
              Sign In
            </a>
          </p>
        )}
      </form>
    </Card>
  );
}

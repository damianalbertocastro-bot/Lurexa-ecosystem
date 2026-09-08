"use client";

import React, { FormEvent, useState } from "react";
import { Button } from "./button";
import { Input } from "./Input";
import { Card } from "./card";

export interface StandardProfileData {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  targetCefrLevel?: string;
  primaryGoal?: string;
  preferredAccent?: string;
  interests?: string[];
  headline?: string;
  currentCefrLevel?: string;
  teachingExperienceYears?: number;
  goals?: string[];
  role?: string;
  accountTypeLabel?: string;
}

export interface StandardProfileViewProps {
  profile: StandardProfileData;
  userType?: "student" | "educator" | "admin";
  onSaveProfile: (updated: Partial<StandardProfileData>) => Promise<void>;
  onSignOut?: () => Promise<void> | void;
  children?: React.ReactNode;
  ecosystemLinks?: Array<{ label: string; href: string; icon?: string }>;
  stats?: Array<{ label: string; value: string | number; description?: string }>;
}

export function StandardProfileView({
  profile,
  userType = "student",
  onSaveProfile,
  onSignOut,
  children,
  ecosystemLinks = [],
  stats = [],
}: StandardProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Student form state
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [targetCefrLevel, setTargetCefrLevel] = useState(profile.targetCefrLevel || "B1");
  const [primaryGoal, setPrimaryGoal] = useState(profile.primaryGoal || "daily_conversation");
  const [preferredAccent, setPreferredAccent] = useState(profile.preferredAccent || "dominican");

  // Educator form state
  const [headline, setHeadline] = useState(profile.headline || "");
  const [currentCefrLevel, setCurrentCefrLevel] = useState(profile.currentCefrLevel || "B2");
  const [teachingExperienceYears, setTeachingExperienceYears] = useState(
    profile.teachingExperienceYears !== undefined ? String(profile.teachingExperienceYears) : ""
  );
  const [interests, setInterests] = useState((profile.interests || []).join(", "));
  const [goals, setGoals] = useState((profile.goals || []).join(", "));

  const initials = (profile.displayName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const computedDisplayName = displayName.trim() || [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || profile.displayName;

      if (userType === "student") {
        await onSaveProfile({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          displayName: computedDisplayName,
          phone: phone.trim() || undefined,
          targetCefrLevel,
          primaryGoal,
          preferredAccent,
        });
      } else {
        await onSaveProfile({
          displayName: computedDisplayName,
          headline: headline.trim() || undefined,
          currentCefrLevel: currentCefrLevel || undefined,
          targetCefrLevel: targetCefrLevel || undefined,
          teachingExperienceYears: teachingExperienceYears ? Number(teachingExperienceYears) : undefined,
          interests: interests ? interests.split(",").map((x) => x.trim()).filter(Boolean) : [],
          goals: goals ? goals.split(",").map((x) => x.trim()).filter(Boolean) : [],
        });
      }

      setSuccessMessage("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to save profile updates.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner matching Teach Profile structure */}
      <section className="rounded-[30px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-[var(--lx-primary)] p-8 text-white sm:p-10 shadow-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-[28px] bg-white/12 text-3xl font-black shadow-inner border border-white/20">
            {initials}
          </span>
          <div>
            <p className="text-[10px] font-extrabold tracking-[.18em] text-[var(--lx-accent)] uppercase">
              {profile.accountTypeLabel || (userType === "educator" ? "EDUCATOR PROFILE" : userType === "admin" ? "MASTER ADMINISTRATOR" : "LEARNER IDENTITY")}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-[-.055em]">
              {profile.displayName || "Lurexa User"}
            </h1>
            <p className="mt-2 text-sm text-indigo-100">
              {profile.headline || profile.email || "Governed by Lurexa Core security contracts and persistent Learner Model."}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <Button
              type="button"
              onClick={() => {
                setEditing(!editing);
                setError("");
              }}
              className="min-h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-extrabold hover:bg-white/20 transition"
            >
              {editing ? "Close editor" : "Edit profile"}
            </Button>
            {onSignOut && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => void onSignOut()}
                className="min-h-11 rounded-xl px-4 text-sm font-extrabold"
              >
                Sign out
              </Button>
            )}
          </div>
        </div>
      </section>

      {successMessage && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
          ✓ {successMessage}
        </div>
      )}

      {/* Profile Editor Form */}
      {editing && (
        <Card
          title={userType === "student" ? "Edit Learner Profile" : "Edit Professional Profile"}
          subtitle="Changes sync with your persistent profile across the Lurexa ecosystem."
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {userType === "student" ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="firstName"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="text-black dark:text-white"
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="text-black dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="displayName"
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Preferred display name"
                    className="text-black dark:text-white"
                  />
                  <Input
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (809) 555-0123"
                    className="text-black dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
                  <div>
                    <label htmlFor="targetCefr" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                      Target CEFR Level
                    </label>
                    <select
                      id="targetCefr"
                      value={targetCefrLevel}
                      onChange={(e) => setTargetCefrLevel(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-bold text-black dark:text-white outline-none focus:border-[var(--lx-primary)]"
                    >
                      <option value="A1">A1 - Beginner Foundations</option>
                      <option value="A2">A2 - Elementary Independence</option>
                      <option value="B1">B1 - Intermediate Fluency</option>
                      <option value="B2">B2 - Spoken & Professional Control</option>
                      <option value="C1">C1 - Effective Operational Fluency</option>
                      <option value="C2">C2 - Mastery & Precision</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="primaryGoal" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                      Primary Learning Goal
                    </label>
                    <select
                      id="primaryGoal"
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-bold text-black dark:text-white outline-none focus:border-[var(--lx-primary)]"
                    >
                      <option value="academic">Academic Success & Exams</option>
                      <option value="career">Career Growth & Workplace</option>
                      <option value="daily_conversation">Spoken Confidence & Fluency</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredAccent" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                      Preferred Accent Model
                    </label>
                    <select
                      id="preferredAccent"
                      value={preferredAccent}
                      onChange={(e) => setPreferredAccent(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-bold text-black dark:text-white outline-none focus:border-[var(--lx-primary)]"
                    >
                      <option value="dominican">Dominican Spanish L1 Contrastive</option>
                      <option value="general_american">General American</option>
                      <option value="british">British Received Pronunciation</option>
                      <option value="neutral_international">Neutral International</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="displayName"
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="text-black dark:text-white"
                  />
                  <Input
                    id="headline"
                    label="Professional Headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="English educator · Speaking instruction"
                    className="text-black dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="currentCefr" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                      Current CEFR
                    </label>
                    <select
                      id="currentCefr"
                      value={currentCefrLevel}
                      onChange={(e) => setCurrentCefrLevel(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-bold text-black dark:text-white outline-none"
                    >
                      {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="targetCefr" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                      Target CEFR
                    </label>
                    <select
                      id="targetCefr"
                      value={targetCefrLevel}
                      onChange={(e) => setTargetCefrLevel(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-bold text-black dark:text-white outline-none"
                    >
                      {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    id="exp"
                    label="Experience (Years)"
                    type="number"
                    value={teachingExperienceYears}
                    onChange={(e) => setTeachingExperienceYears(e.target.value)}
                    className="text-black dark:text-white"
                  />
                </div>

                <Input
                  id="interests"
                  label="Professional Interests (comma separated)"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="speaking pedagogy, phonetics, AI scaffolding"
                  className="text-black dark:text-white"
                />

                <div>
                  <label htmlFor="goals" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                    Professional Goals (comma separated)
                  </label>
                  <textarea
                    id="goals"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-3 text-xs font-medium text-black dark:text-white outline-none"
                    placeholder="Attain C1 verification, master Dominican contrastive phonetics"
                  />
                </div>
              </>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
              >
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? "Saving changes…" : "Save Profile Details"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Profile Overview Grid: Left (Identity & Preferences), Right (Records & Ecosystem) */}
      <section className="grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
        <aside className="space-y-6">
          <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-xs">
            <p className="text-[10px] font-extrabold tracking-[.18em] text-[var(--lx-primary)] uppercase">
              IDENTITY &amp; PREFERENCES
            </p>
            <div className="mt-4 space-y-4">
              {[
                ["Display Name", profile.displayName],
                ["Email Address", profile.email],
                ["Phone", profile.phone || "Not set"],
                ["Target CEFR", profile.targetCefrLevel || "B1 - Intermediate"],
                ["Primary Goal", profile.primaryGoal ? profile.primaryGoal.replaceAll("_", " ") : "Spoken Fluency"],
                ["Accent Model", profile.preferredAccent ? profile.preferredAccent.replaceAll("_", " ") : "Dominican Spanish L1 Transfer"],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-[var(--lx-border)] pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">{k}</p>
                  <b className="mt-0.5 block text-sm font-black text-black dark:text-white capitalize">{v}</b>
                </div>
              ))}
            </div>
          </article>

          {stats.length > 0 && (
            <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-xs">
              <p className="text-[10px] font-extrabold tracking-[.18em] text-[var(--lx-primary)] uppercase">
                LEARNING BENCHMARKS
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-[var(--lx-canvas)] p-4">
                    <b className="text-2xl font-black text-black dark:text-white">{s.value}</b>
                    <p className="mt-1 text-xs font-extrabold text-[var(--lx-muted)]">{s.label}</p>
                    {s.description && (
                      <p className="mt-0.5 text-[10px] text-[var(--lx-muted)]">{s.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </article>
          )}
        </aside>

        <div className="space-y-6">
          <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-xs">
            <p className="text-[10px] font-extrabold tracking-[.18em] text-[var(--lx-primary)] uppercase">
              SINGLE LEARNER MODEL
            </p>
            <h3 className="mt-2 text-2xl font-black text-black dark:text-white tracking-[-.03em]">
              One evolving model across all Lurexa experiences.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">
              Your diagnostic benchmarks, speaking acoustic evidence, lesson mastery, and professional progress adapt in real-time. Mind interprets authorized evidence, while Core ensures sovereign cryptographic recordkeeping.
            </p>

            {ecosystemLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {ecosystemLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-4 py-2.5 text-xs font-extrabold text-black dark:text-white hover:border-[var(--lx-primary)] transition"
                  >
                    {link.icon && <span>{link.icon}</span>}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </article>

          {children}
        </div>
      </section>
    </div>
  );
}

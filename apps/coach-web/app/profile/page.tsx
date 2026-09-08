"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CoachShell } from "../components/CoachShell";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { AuthService, type AuthenticatedUser } from "@lurexa/backend";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

export default function CoachProfilePage() {
  const router = useRouter();
  const urls = resolveLurexaPublicUrls();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [targetLevel, setTargetLevel] = useState("B1");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [turnsCount, setTurnsCount] = useState(14);
  const [intelligibility] = useState(78);

  useEffect(() => {
    const unsub = AuthService.onUserChanged((currentUser) => {
      setUser(currentUser);
      const guest = AuthService.isGuestUser(currentUser);
      setIsGuest(guest);

      if (currentUser?.displayName) {
        setDisplayName(currentUser.displayName);
      } else if (currentUser?.email) {
        setDisplayName(currentUser.email.split("@")[0]);
      } else if (guest) {
        setDisplayName("Guest Learner");
      }
    });

    // Try reading stored turns or preferences
    if (typeof window !== "undefined") {
      try {
        const storedTarget = localStorage.getItem("lurexa_coach_target_level");
        if (storedTarget) setTargetLevel(storedTarget);
        const guestData = window.sessionStorage.getItem("lurexa.coach.guest-session");
        if (guestData) {
          const parsed = JSON.parse(guestData) as { lessonsCompleted?: number };
          if (parsed.lessonsCompleted) {
            setTurnsCount(parsed.lessonsCompleted * 8);
          }
        }
      } catch {
        // safe
      }
    }

    return () => unsub();
  }, []);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("lurexa_coach_target_level", targetLevel);
      localStorage.setItem("lurexa_coach_display_name", displayName);
    }
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await AuthService.logout();
    router.push("/login");
  };

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "LC";

  return (
    <CoachShell active="Profile">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header Banner */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-[var(--color-brand-navy)] to-[var(--lx-primary)] p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/10 text-2xl font-black shadow-inner border border-white/20">
                {initials}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[var(--lx-accent)]/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--lx-accent)]">
                    {isGuest ? "Guest Speaking Session" : "Speaking Profile"}
                  </span>
                  <Badge variant="info">CEFR A1–B1</Badge>
                </div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-[-.04em]">
                  {displayName || "Learner"}
                </h1>
                <p className="mt-1 text-xs text-slate-300 font-medium">
                  {user?.email || "Guest Demo Learner · Dominican Spanish L1 Adaptation"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl bg-white/15 text-white border border-white/25 hover:bg-white/25 text-xs font-extrabold"
              >
                {isEditing ? "Close Editor" : "Edit Profile"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="rounded-xl text-xs font-extrabold"
              >
                Sign out
              </Button>
            </div>
          </div>
        </section>

        {savedSuccess && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            ✓ Speaking profile and CEFR preferences updated successfully!
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <Card
            title="Edit Speaking Profile"
            subtitle="Customize how Lurexa Coach identifies your spoken practice goals."
          >
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="displayName" className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    Display Name
                  </label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full text-black dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="targetLevel" className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    Target CEFR Speaking Level
                  </label>
                  <select
                    id="targetLevel"
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    className="h-10 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-bold text-black dark:text-white outline-none focus:border-[var(--lx-primary)]"
                  >
                    <option value="A1">A1 - Breakthrough Speaker</option>
                    <option value="A2">A2 - Elementary Conversationalist</option>
                    <option value="B1">B1 - Intermediate Fluency</option>
                    <option value="B2">B2 - Professional English Proficiency</option>
                    <option value="C1">C1 - Advanced Spoken Mastery</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Profile Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card
            title="Acoustic Intelligibility"
            subtitle="Dominican Spanish L1 Speech Model"
            className="flex flex-col justify-between"
          >
            <div className="space-y-3 pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-black dark:text-white">
                  {intelligibility}%
                </span>
                <span className="text-xs font-bold text-emerald-600">Communicative Ease</span>
              </div>
              <ProgressBar value={intelligibility} />
              <p className="text-[11px] leading-relaxed text-black dark:text-slate-200 font-medium">
                High clarity on vowel centers. Focus on terminal consonant releases (/t/, /d/) and onset s-clusters.
              </p>
            </div>
          </Card>

          <Card
            title="Speech Turns & History"
            subtitle="Spoken Practice Volume"
            className="flex flex-col justify-between"
          >
            <div className="space-y-3 pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-black dark:text-white">
                  {turnsCount}
                </span>
                <span className="text-xs font-bold text-[var(--lx-primary)]">Turns Logged</span>
              </div>
              <p className="text-[11px] leading-relaxed text-black dark:text-slate-200 font-medium">
                Consistent daily spoken retrieval reinforces neural articulation patterns.
              </p>
              <Link
                href="/history"
                className="mt-2 inline-flex items-center text-xs font-bold text-[var(--lx-primary)] hover:underline"
              >
                View Speaking History →
              </Link>
            </div>
          </Card>

          <Card
            title="Oral Placement"
            subtitle="CEFR Oral Benchmark"
            className="flex flex-col justify-between"
          >
            <div className="space-y-3 pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-black dark:text-white">
                  Calibrated
                </span>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-[11px] leading-relaxed text-black dark:text-slate-200 font-medium">
                Diagnostic placement accurately adapts AI turns to your current oral proficiency level.
              </p>
              <Link
                href="/placement"
                className="mt-2 inline-flex items-center text-xs font-bold text-[var(--lx-secondary)] hover:underline"
              >
                Retake Oral Diagnostic →
              </Link>
            </div>
          </Card>
        </div>

        {/* L1 Transfer & Phoneme Focus */}
        <Card
          title="Dominican Spanish L1 Contrastive Focus"
          subtitle="Acoustic areas tracked by Lurexa Mind for targeted practice"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-black dark:text-white uppercase tracking-wider">
                  Final Consonant Codas
                </h4>
                <Badge variant="warning">In Progress</Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-black dark:text-slate-200 font-medium">
                Dominican Spanish naturally elides word-final /s/, /t/, and /d/. Coach emphasizes complete release in words like <em>asked</em>, <em>passed</em>, and <em>states</em>.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-black dark:text-white uppercase tracking-wider">
                  Onset /s/ Clusters
                </h4>
                <Badge variant="success">Strong</Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-black dark:text-slate-200 font-medium">
                Preventing the intrusive epenthetic /e/ vowel before onset clusters (<em>student</em> instead of <em>estudent</em>).
              </p>
            </div>
          </div>
        </Card>

        {/* Connected Ecosystem */}
        <Card
          title="Single Learner Model Integration"
          subtitle="One learner. One evolving model. Every Lurexa experience adapts around it."
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs leading-relaxed text-black dark:text-slate-200 font-medium">
              Your speaking practice evidence in Lurexa Coach automatically updates your master learner model in Lurexa Core, unlocking personalized vocabulary recommendations and CEFR progression across the entire ecosystem.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={urls.learn}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-4 py-2 text-xs font-bold text-black dark:text-white hover:border-[var(--lx-primary)] transition"
              >
                <span>📘</span>
                <span>Open Lurexa Learn</span>
              </a>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--lx-primary)] px-4 py-2 text-xs font-bold text-white hover:brightness-110 transition"
              >
                <span>🎙️</span>
                <span>Launch Speaking Studio</span>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </CoachShell>
  );
}

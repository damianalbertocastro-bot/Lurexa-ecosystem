"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CoachShell } from "../components/CoachShell";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { PhoneticChip } from "@lurexa/ui/PhoneticChip";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { MasterMark } from "@lurexa/ui/MasterMark";
import { WelcomeTourModal, type WelcomeTourStep } from "@lurexa/ui/WelcomeTourModal";
import { AuthService, type AuthenticatedUser, COACH_PRACTICE_PACKS, type CoachPracticePack } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

const COACH_TOUR_STEPS: WelcomeTourStep[] = [
  {
    title: "Welcome to Lurexa Coach",
    badge: "Speaking Intelligence",
    icon: "🎙️",
    description:
      "Coach is your low-pressure environment for spoken English practice, real-time waveform feedback, and conversational confidence.",
    tip: "You can practice freely at your own pace without fear of making mistakes.",
  },
  {
    title: "Intelligibility First",
    badge: "Authentic Voice",
    icon: "🎯",
    description:
      "We focus on acoustic clarity, natural pacing, and communicative ease—never forced accent erasure. Your unique voice matters.",
    tip: "Focus on clear syllable stress and consonant releases rather than sounding like a native speaker.",
  },
  {
    title: "Dominican Spanish Transfer Focus",
    badge: "L1 Adaptation",
    icon: "🇩🇴",
    description:
      "Targeted support designed for Hispanic and Dominican Spanish speakers—addressing /s/ cluster onsets, final consonant codas, and vowel durations.",
    tip: "Check out the Pronunciation section to drill specific phoneme contrasts like /b/ vs /v/ and /ʃ/ vs /tʃ/.",
  },
  {
    title: "Spaced-Repetition Speech Queue",
    badge: "Long-Term Retention",
    icon: "⚡",
    description:
      "Coach retains your acoustic history and surfaces phonemes and speech patterns just before you forget them for maximum memory retention.",
    tip: "Complete 10 minutes of daily speaking to maintain your active momentum.",
  },
  {
    title: "Unified Ecosystem Progress",
    badge: "Single Learner Model",
    icon: "🔗",
    description:
      "Every speech turn directly informs your Lurexa Learner Model in Core. Your lessons in Learn and speaking in Coach adapt in perfect harmony.",
    tip: "You're ready to start! Jump into a practice pack or quick conversation studio.",
  },
];

const COACH_TOUR_STORAGE_KEY = "lurexa_coach_tour_seen";

export default function CoachDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestLessonsCompleted, setGuestLessonsCompleted] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "ALL">("ALL");
  const urls = resolveLurexaPublicUrls();
  const [learnerCefr, setLearnerCefr] = useState<CefrLevel>("A1");
  const [intelligibilityScore, setIntelligibilityScore] = useState<number>(75);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      setCurrentUser(user);
      const guestStatus = AuthService.isGuestUser(user);
      setIsGuest(guestStatus);

      if (guestStatus && typeof window !== "undefined") {
        try {
          const guestData = window.sessionStorage.getItem("lurexa.coach.guest-session");
          if (guestData) {
            const parsed = JSON.parse(guestData) as { lessonsCompleted?: number };
            setGuestLessonsCompleted(parsed.lessonsCompleted || 0);
          }
        } catch {
          // safe
        }
      }

      if (user) {
        try {
          const hasSeenTour = localStorage.getItem(COACH_TOUR_STORAGE_KEY);
          if (!hasSeenTour && !guestStatus) {
            setIsTourOpen(true);
          }
        } catch {
          // Ignore localStorage errors
        }

        try {
          const response = await fetch("/api/coach", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify({ action: "startSession" }),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.learnerContext?.proficiency?.cefr) {
              setLearnerCefr(data.learnerContext.proficiency.cefr as CefrLevel);
            }
            if (data.learnerContext?.proficiency?.intelligibilityScore) {
              setIntelligibilityScore(data.learnerContext.proficiency.intelligibilityScore);
            }
          }
        } catch {
          // Fallback to initial local state
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStartSession = (href: string) => {
    if (isGuest && guestLessonsCompleted >= 1) {
      router.push("/login?mode=register&guestUpgrade=true");
      return;
    }
    router.push(href);
  };

  const filteredPacks =
    selectedLevel === "ALL"
      ? COACH_PRACTICE_PACKS
      : COACH_PRACTICE_PACKS.filter((p: CoachPracticePack) => p.cefrLevel === selectedLevel);

  return (
    <CoachShell active="Dashboard">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 space-y-8">
        {/* Guest Demo Banner */}
        {isGuest && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/50 p-4 text-xs font-semibold text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-slide-up">
            <div>
              <span className="font-black text-amber-800 dark:text-amber-300 block text-sm">
                🚀 Guest Demo Account ({guestLessonsCompleted >= 1 ? "0" : "1"} Free Lesson Remaining)
              </span>
              <span>
                {guestLessonsCompleted >= 1
                  ? "You have completed your 1 free demo lesson. Create a full account or choose a plan for unlimited access."
                  : "Enjoy 1 interactive speaking workout or practice pack. Sign up to save your universal progress and unlock unlimited practice."}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
              onClick={() => router.push("/login?mode=register&guestUpgrade=true")}
            >
              Sign Up / Unlock Plans →
            </Button>
          </div>
        )}

        {/* Hero Banner with Unified Progress Radar */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--lx-primary)] to-[var(--color-brand-navy)] p-7 text-white shadow-xl sm:p-9">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-200 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
                Adaptive Dominican Speaking Studio
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Master English Spoken Fluency.
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed">
                Acoustic intelligence, phonemic contrast drills, and conversational ease tailored for Dominican Spanish speakers.
              </p>
            </div>

            {/* Live Progress KPIs */}
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-xl border border-white/15">
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">DAILY RETENTION</p>
                <p className="text-xl sm:text-2xl font-black text-white">🔥 Active</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">CEFR LEVEL</p>
                <p className="text-xl sm:text-2xl font-black text-white">{learnerCefr}</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">INTELLIGIBILITY</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-300">{intelligibilityScore}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Grid: Recommended Session & Retention Spectrum */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Area: Daily Spaced-Repetition Queue & Practice Packs */}
          <section className="space-y-8 lg:col-span-2">
            {/* Daily Recommended Session Card */}
            <Card
              className="border border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-md"
              title="Today's Recommended Speaking Review"
              subtitle="Daily Spaced-Repetition Queue · 10 Minutes"
              action={<Badge variant="info">Priority Queue</Badge>}
            >
              <div className="space-y-4 pt-2">
                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/60 dark:bg-rose-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                      🔴 High-Priority Remediation (1-Day Interval)
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">Accuracy: 58%</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                    Initial /s/ Clusters without Prosthetic /e/ (es-DO Epenthesis)
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <PhoneticChip ipa="/st-/" example="student" category="cluster" />
                    <PhoneticChip ipa="/sp-/" example="speak" category="cluster" />
                    <PhoneticChip ipa="/sk-/" example="school" category="cluster" />
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      🟡 Emerging Consolidation (3-Day Interval)
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">Accuracy: 74%</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                    Past Regular -ed Endings (/t/, /d/, /ɪd/)
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <PhoneticChip ipa="/-t/" example="walked" category="consonant" textColor="white" />
                    <PhoneticChip ipa="/-ɪd/" example="decided" category="consonant" textColor="white" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={() => handleStartSession("/practice")}
                    className="bg-[var(--lx-primary)] hover:bg-[var(--lx-primary)]"
                  >
                    Start Today&apos;s Speaking Session 🎙️
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/pronunciation")}
                  >
                    Explore Phonetics Map →
                  </Button>
                </div>
              </div>
            </Card>

            {/* Practice Packs Explorer */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-[var(--color-brand-navy)]">
                    Speaking Practice Packs
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Targeted oral simulations across all CEFR proficiency levels
                  </p>
                </div>

                {/* Level Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {(["ALL", "A1", "A2", "B1", "B2", "C1", "C2"] as const).map((lvl) => (
                    <Button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`rounded-xl px-3 py-1 text-xs font-black transition ${
                        selectedLevel === lvl
                          ? "bg-[var(--lx-primary)] text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-[var(--lx-primary)]"
                      }`}
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grid of Packs */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {filteredPacks.map((pack: CoachPracticePack) => (
                  <Card
                    key={pack.id}
                    className="border-0 bg-white shadow-lg shadow-slate-200/60 transition-all hover:shadow-xl flex flex-col justify-between"
                    title={pack.title}
                    subtitle={pack.subtitle}
                    action={
                      <Badge variant="info">
                        {pack.cefrLevel}
                      </Badge>
                    }
                  >
                    <div className="space-y-4 pt-2 flex-1 flex flex-col justify-between">
                      <p className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium line-clamp-2">
                        {pack.description}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 font-bold">
                          <span>Partner: <strong className="text-slate-950 dark:text-white">{pack.scenarioRole}</strong></span>
                          <span>{pack.suggestedTurns} Turns</span>
                        </div>

                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => handleStartSession(`/packs/${pack.id}`)}
                        >
                          Launch Pack 🎙️
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar: Mastery Spectrum, Placement & Connected Bridges */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Phoneme Mastery Spectrum Card */}
            <Card
              className="border-0 bg-white shadow-lg shadow-slate-200/60"
              title="Phoneme Health & Retention"
              subtitle="Spaced-Repetition Review Curves"
            >
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-700">🟢 Mastered (14-day cycle)</span>
                    <span className="font-mono">24 Sounds</span>
                  </div>
                  <ProgressBar value={65} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-amber-700">🟡 Emerging (3-day cycle)</span>
                    <span className="font-mono">8 Sounds</span>
                  </div>
                  <ProgressBar value={22} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-rose-700">🔴 Struggling (1-day cycle)</span>
                    <span className="font-mono">4 Sounds</span>
                  </div>
                  <ProgressBar value={13} />
                </div>

                <div className="rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-600 leading-relaxed border border-slate-200/70">
                  <strong className="text-slate-800">Pedagogical Guardrail:</strong> Coach targets phonemes that materially improve communicative intelligibility without accent erasure.
                </div>
              </div>
            </Card>

            {/* Oral Diagnostic / Placement Card */}
            <Card
              className="border-0 bg-white shadow-lg shadow-slate-200/60"
              title="Oral Speaking Diagnostic"
              subtitle="Calibrate your CEFR oral profile"
            >
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Take an adaptive 3-minute oral diagnostic to assess your pronunciation, fluency, and conversational spontaneity across A1–C1.
                </p>
                <Button
                  variant="primary"
                  className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-black hover:brightness-105"
                  onClick={() => router.push("/placement")}
                >
                  Take Free Oral Placement 🎯
                </Button>
              </div>
            </Card>

            {/* Cross-Product Bridge Card with Visual Logos */}
            <Card
              className="border border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-md"
              title="Connected Lurexa Workspace"
              subtitle="Continue learning across products"
            >
              <div className="space-y-3 pt-2">
                <a
                  href={urls.learn}
                  className="group flex items-center gap-3.5 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5 transition hover:bg-[var(--lx-surface)] hover:border-indigo-400 dark:hover:border-indigo-500"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lx-surface)] border border-[var(--lx-border)] shadow-xs transition group-hover:scale-105">
                    <ProductMark product="learn" compact size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[var(--lx-ink)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Open Learn ↗</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--lx-muted)] truncate">Resume interactive curriculum and lessons.</p>
                  </div>
                </a>

                <a
                  href={urls.teach}
                  className="group flex items-center gap-3.5 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5 transition hover:bg-[var(--lx-surface)] hover:border-violet-400 dark:hover:border-violet-500"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lx-surface)] border border-[var(--lx-border)] shadow-xs transition group-hover:scale-105">
                    <ProductMark product="teach" compact size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[var(--lx-ink)] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">Open Teach ↗</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--lx-muted)] truncate">Educator training &amp; CEFR growth.</p>
                  </div>
                </a>

                <a
                  href={urls.ecosystem}
                  className="group flex items-center gap-3.5 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5 transition hover:bg-[var(--lx-surface)] hover:border-teal-400 dark:hover:border-teal-500"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lx-surface)] border border-[var(--lx-border)] shadow-xs transition group-hover:scale-105">
                    <MasterMark compact size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[var(--lx-ink)] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">All Lurexa products ↗</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--lx-muted)] truncate">Platform tools, docs, and services.</p>
                  </div>
                </a>
              </div>
            </Card>

          </aside>
        </div>
      </main>

      <WelcomeTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        storageKey={COACH_TOUR_STORAGE_KEY}
        productName="Lurexa Coach"
        steps={COACH_TOUR_STEPS}
      />
    </CoachShell>
  );
}

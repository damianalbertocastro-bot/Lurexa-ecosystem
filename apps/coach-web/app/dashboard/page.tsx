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
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "ALL">("ALL");
  const urls = resolveLurexaPublicUrls();
  const [learnerCefr, setLearnerCefr] = useState<CefrLevel>("A1");
  const [intelligibilityScore, setIntelligibilityScore] = useState<number>(75);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const hasSeenTour = localStorage.getItem(COACH_TOUR_STORAGE_KEY);
          if (!hasSeenTour) {
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
          // Graceful fallback
        }
      }
    });
    return unsubscribe;
  }, []);

  const filteredPacks =
    selectedLevel === "ALL"
      ? COACH_PRACTICE_PACKS
      : COACH_PRACTICE_PACKS.filter((p: CoachPracticePack) => p.cefrLevel === selectedLevel);

  return (
    <CoachShell active="Dashboard">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 space-y-8">
        {/* Top Greeting Header */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1931] via-[#15274f] to-[var(--lx-primary)] p-7 sm:p-10 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-extrabold tracking-wide text-cyan-300 backdrop-blur-md">
                  <span>🎙️</span>
                  CONTINUOUS SPOKEN INTELLIGENCE
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsTourOpen(true)}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[11px] font-bold text-white hover:bg-white/20"
                >
                  ✦ Welcome Tour
                </Button>
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl text-white">
                {currentUser ? `Welcome back, ${currentUser.displayName || currentUser.email?.split("@")[0]}` : "Welcome to your Speaking Studio"}
              </h1>
              <p className="mt-2 text-sm text-indigo-100 max-w-2xl leading-relaxed">
                Coach personalizes your daily oral fluency practice and spaced-repetition phoneme queue according to your latest speech evidence.
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-md">
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">STREAK</p>
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
                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-700">
                      🔴 High-Priority Remediation (1-Day Interval)
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600">Accuracy: 58%</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-slate-900">
                    Initial /s/ Clusters without Prosthetic /e/ (es-DO Epenthesis)
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <PhoneticChip ipa="/st-/" example="student" category="cluster" />
                    <PhoneticChip ipa="/sp-/" example="speak" category="cluster" />
                    <PhoneticChip ipa="/sk-/" example="school" category="cluster" />
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                      🟡 Emerging Consolidation (3-Day Interval)
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600">Accuracy: 74%</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-slate-900">
                    Past Regular -ed Endings (/t/, /d/, /ɪd/)
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <PhoneticChip ipa="/-t/" example="walked" category="consonant" />
                    <PhoneticChip ipa="/-ɪd/" example="decided" category="consonant" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={() => router.push("/practice")}
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
                          onClick={() => router.push(`/packs/${pack.id}`)}
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
              className="border-0 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/60"
              title="Connected Lurexa Workspace"
              subtitle="Continue learning across products"
            >
              <div className="space-y-3 pt-2">
                <a
                  href={urls.learn}
                  className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:bg-slate-100/90 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs transition group-hover:scale-105">
                    <ProductMark product="learn" compact size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-950 dark:text-white group-hover:text-indigo-600 transition">Open Learn ↗</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 truncate">Resume interactive curriculum and lessons.</p>
                  </div>
                </a>

                <a
                  href={urls.teach}
                  className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:bg-slate-100/90 hover:border-violet-300 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs transition group-hover:scale-105">
                    <ProductMark product="teach" compact size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-950 dark:text-white group-hover:text-violet-600 transition">Open Teach ↗</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 truncate">Educator training &amp; CEFR growth.</p>
                  </div>
                </a>

                <a
                  href={urls.ecosystem}
                  className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:bg-slate-100/90 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs transition group-hover:scale-105">
                    <MasterMark compact size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-950 dark:text-white group-hover:text-teal-600 transition">All Lurexa products ↗</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 truncate">Platform tools, docs, and services.</p>
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

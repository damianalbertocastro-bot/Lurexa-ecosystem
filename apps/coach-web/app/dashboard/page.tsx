"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CoachShell } from "../components/CoachShell";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { PhoneticChip } from "@lurexa/ui/PhoneticChip";
import { AuthService, type AuthenticatedUser, COACH_PRACTICE_PACKS, type CoachPracticePack } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

export default function CoachDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const urls = resolveLurexaPublicUrls();

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
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
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#071d67] via-[#1d1b64] to-[#592bd6] p-7 sm:p-10 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-extrabold tracking-wide text-cyan-300 backdrop-blur-md">
                <span>🎙️</span>
                CONTINUOUS SPOKEN INTELLIGENCE
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
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
                <p className="text-xl sm:text-2xl font-black">🔥 5 Days</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">CEFR LEVEL</p>
                <p className="text-xl sm:text-2xl font-black">A2</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">INTELLIGIBILITY</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-300">88%</p>
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
              className="border-0 bg-white shadow-lg shadow-indigo-100/70"
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
                    className="bg-[var(--lx-primary)] hover:bg-[#4a22b8]"
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
                  <h2 className="text-xl font-black tracking-tight text-[#071d67]">
                    Speaking Practice Packs
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Targeted oral simulations across all CEFR proficiency levels
                  </p>
                </div>

                {/* Level Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {(["ALL", "A1", "A2", "B1", "B2", "C1", "C2"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`rounded-xl px-3 py-1 text-xs font-black transition ${
                        selectedLevel === lvl
                          ? "bg-[var(--lx-primary)] text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900"
                      }`}
                    >
                      {lvl}
                    </button>
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
                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                        {pack.description}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Partner: <strong>{pack.scenarioRole}</strong></span>
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

            {/* Cross-Product Bridge Card */}
            <Card
              className="border-0 bg-white shadow-lg shadow-slate-200/60"
              title="Connected Lurexa Workspace"
              subtitle="Continue learning in other products"
            >
              <div className="space-y-3 pt-2">
                <a
                  href={urls.learn}
                  className="block rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:bg-slate-100 hover:border-slate-300"
                >
                  <p className="text-xs font-black text-[#071d67]">Lurexa Learn ↗</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Resume course lessons, curriculum pathways, and assignments.</p>
                </a>
                <a
                  href={urls.teach}
                  className="block rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:bg-slate-100 hover:border-slate-300"
                >
                  <p className="text-xs font-black text-[#6b2bd9]">Lurexa Teach ↗</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Educator training, CEFR proficiency growth, and credentials.</p>
                </a>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </CoachShell>
  );
}

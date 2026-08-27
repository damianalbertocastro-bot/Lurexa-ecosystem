"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { PhoneticChip } from "@lurexa/ui/PhoneticChip";
import { COACH_PRACTICE_PACKS, type CoachPracticePack } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";

export default function CoachDashboardPage() {
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "ALL">("ALL");

  const filteredPacks = selectedLevel === "ALL"
    ? COACH_PRACTICE_PACKS
    : COACH_PRACTICE_PACKS.filter((p: CoachPracticePack) => p.cefrLevel === selectedLevel);

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)] pb-16">
      {/* Top App Header */}
      <header className="border-b border-[var(--lx-border)] bg-[var(--lx-surface)] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/">
              <ProductMark product="coach" size="md" />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="rounded-xl bg-[var(--lx-primary)]/10 px-3 py-1.5 text-xs font-black text-[var(--lx-primary)]"
              >
                Dashboard
              </Link>
              <Link
                href="/studio"
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-[var(--lx-muted)] hover:text-[var(--lx-ink)] transition"
              >
                Speaking Studio
              </Link>
              <Link
                href="/placement"
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-[var(--lx-muted)] hover:text-[var(--lx-ink)] transition"
              >
                Diagnostic
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="rounded-xl bg-gradient-to-r from-[#12cdd4] to-[#0ba5a8] px-4 py-2 text-xs font-black text-[#071d67] shadow-sm hover:opacity-90 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>🎙️</span>
              <span>Quick Practice</span>
            </Link>
            <ThemeToggle />
            <EcosystemDropdown currentApp="coach" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 space-y-8">
        {/* Welcome & Streak Banner */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#071d67] via-[#211d70] to-[#592bd6] p-7 sm:p-10 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-[#12cdd4]/20 border border-[#12cdd4]/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#9dfbf9]">
                Continuous Spoken Intelligence
              </span>
              <h1 className="mt-3 text-3xl font-black tracking-[-.05em] sm:text-4xl">
                Welcome back to your Speaking Studio
              </h1>
              <p className="mt-2 text-sm text-indigo-100 max-w-2xl leading-relaxed">
                Coach adapts your daily practice queue according to your latest speech evidence and spaced-repetition retention curves.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-md">
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#9dfbf9]">STREAK</p>
                <p className="text-2xl font-black">5 Days</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#9dfbf9]">CEFR LEVEL</p>
                <p className="text-2xl font-black">A2</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center px-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#9dfbf9]">INTELLIGIBILITY</p>
                <p className="text-2xl font-black">88%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Phoneme Mastery & Spaced-Repetition Queue Grid */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* Daily Spaced-Repetition Queue */}
          <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-4 mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">DAILY QUEUE</p>
                <h2 className="text-lg font-bold text-[var(--lx-ink)]">Today&apos;s Recommended Session</h2>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-[var(--lx-primary)]">
                ⏱️ 10 Minutes
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:bg-rose-950/20 dark:border-rose-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    🔴 High-Priority Remediation (1-Day Interval)
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600">Accuracy: 58%</span>
                </div>
                <p className="mt-1 text-sm font-bold text-[var(--lx-ink)]">
                  Initial /s/ Clusters without Prosthetic /e/
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <PhoneticChip ipa="/st-/" example="student" category="cluster" />
                  <PhoneticChip ipa="/sp-/" example="speak" category="cluster" />
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:bg-amber-950/20 dark:border-amber-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    🟡 Emerging Consolidation (3-Day Interval)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600">Accuracy: 74%</span>
                </div>
                <p className="mt-1 text-sm font-bold text-[var(--lx-ink)]">
                  Past Regular -ed Endings (/t/, /d/, /ɪd/)
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <PhoneticChip ipa="/-t/" example="walked" category="consonant" />
                  <PhoneticChip ipa="/-ɪd/" example="decided" category="consonant" />
                </div>
              </div>
            </div>

            <Link
              href="/studio"
              className="mt-6 block text-center rounded-2xl bg-[var(--lx-primary)] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-[#4a22b8] transition active:scale-95"
            >
              Start Today&apos;s Review Session →
            </Link>
          </article>

          {/* Phoneme Mastery Spectrum */}
          <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#0ba5a8]">MASTERY SPECTRUM</p>
            <h2 className="text-lg font-bold text-[var(--lx-ink)] mt-1">Phoneme Health &amp; Retention</h2>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">🟢 Mastered (14-day cycle)</span>
                  <span>24 Phonemes</span>
                </div>
                <div className="h-2.5 w-full bg-[var(--lx-canvas)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-amber-600 dark:text-amber-400">🟡 Emerging (3-day cycle)</span>
                  <span>8 Phonemes</span>
                </div>
                <div className="h-2.5 w-full bg-[var(--lx-canvas)] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "22%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-rose-600 dark:text-rose-400">🔴 Struggling (1-day cycle)</span>
                  <span>4 Phonemes</span>
                </div>
                <div className="h-2.5 w-full bg-[var(--lx-canvas)] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "13%" }} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--lx-canvas)] p-4 border border-[var(--lx-border)] text-xs text-[var(--lx-muted)] leading-5">
              <strong className="text-[var(--lx-ink)]">Pedagogical Guardrail:</strong> Coach focuses strictly on intelligible communicative impact and never penalizes harmless regional accents.
            </div>
          </article>
        </section>

        {/* Practice Pack Catalog */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--lx-border)] pb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">SCENARIO LIBRARY</p>
              <h2 className="text-2xl font-extrabold text-[var(--lx-ink)]">Coach Practice Packs</h2>
            </div>

            {/* Level Filter */}
            <div className="flex flex-wrap gap-1.5">
              {(["ALL", "A1", "A2", "B1", "B2", "C1", "C2"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                    selectedLevel === lvl
                      ? "bg-[var(--lx-primary)] text-white shadow-sm"
                      : "bg-[var(--lx-surface)] text-[var(--lx-muted)] border border-[var(--lx-border)] hover:text-[var(--lx-ink)]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Practice Packs */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPacks.map((pack: CoachPracticePack) => (
              <article
                key={pack.id}
                className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-black text-[var(--lx-primary)] uppercase">
                      {pack.cefrLevel}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--lx-muted)] uppercase">
                      {pack.mode.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-[var(--lx-ink)]">
                    {pack.title}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--lx-muted)] mt-0.5">
                    {pack.subtitle}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-[var(--lx-muted)] line-clamp-2">
                    {pack.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[var(--lx-border)] flex items-center justify-between text-[11px] text-[var(--lx-muted)]">
                    <span>Partner: <strong>{pack.scenarioRole}</strong></span>
                    <span>{pack.suggestedTurns} Turns</span>
                  </div>
                </div>

                <Link
                  href={`/packs/${pack.id}`}
                  className="mt-5 block text-center rounded-xl bg-[var(--lx-canvas)] border border-[var(--lx-border)] py-2.5 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-primary)] hover:text-white hover:border-transparent transition active:scale-95"
                >
                  Launch Pack 🎙️
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

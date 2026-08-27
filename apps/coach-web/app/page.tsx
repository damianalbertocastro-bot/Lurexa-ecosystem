"use client";

import React from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { PhoneticChip } from "@lurexa/ui/PhoneticChip";
import { getEcosystemUrl } from "@lurexa/config/domains";

export default function CoachLandingPage() {
  const rootUrl = getEcosystemUrl("root");
  const learnUrl = getEcosystemUrl("learn");

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#1d1b64] to-[#43149c] text-white">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#592bd6]/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8">
          {/* Header Navigation */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <Link href="/" className="flex items-center gap-3">
              <ProductMark product="coach" inverse size="md" />
            </Link>

            <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl px-3.5 py-2 text-xs font-black text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/studio"
                className="rounded-xl bg-[#12cdd4] px-4 py-2 text-xs font-black text-[#071d67] shadow-sm transition hover:bg-[#28e1e8] active:scale-95"
              >
                Launch Studio 🎙️
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="coach" inverse />
              <a
                href={rootUrl}
                className="hidden rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-extrabold text-white transition hover:bg-white/15 sm:inline-flex"
              >
                Ecosystem ↗
              </a>
            </nav>
          </header>

          {/* Hero Content */}
          <div className="grid gap-12 pb-16 pt-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#12cdd4]/40 bg-[#12cdd4]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[.18em] text-[#9dfbf9]">
                <span>🎙️ Standalone AI Speaking Studio</span>
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-[.96] tracking-[-.065em] sm:text-6xl">
                Speak first.<br />
                <span className="bg-gradient-to-r from-[#9dfbf9] via-[#65f0d3] to-[#c6b6ff] bg-clip-text text-transparent">
                  Refine what matters.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg">
                The AI speaking and pronunciation product engineered for genuine intelligibility, natural rhythm, and communicative confidence—without accent erasure.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/placement"
                  className="rounded-2xl bg-gradient-to-r from-[#12cdd4] to-[#2dd4bf] px-8 py-4 text-sm font-black text-[#071d67] shadow-[0_12px_28px_rgba(18,205,212,.3)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(18,205,212,.4)] active:scale-95"
                >
                  Start Free Speaking Test →
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                >
                  Open Studio Dashboard
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-3 text-xs text-indigo-200">
                <span>✓ Direct independent access</span>
                <span>•</span>
                <span>✓ Seamless Learn integration</span>
                <span>•</span>
                <span>✓ Multi-L1 Spanish profiles</span>
              </div>
            </div>

            {/* Interactive Feature Showcase Card */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#9dfbf9]">DIALECT FOCUS</p>
                  <p className="text-base font-extrabold text-white">Dominican Spanish → English</p>
                </div>
                <span className="rounded-full bg-[#12cdd4]/20 px-3 py-1 text-xs font-bold text-[#9dfbf9]">
                  es-DO Active
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold text-indigo-200">
                  Targeted Phono-Articulatory Transfer Highlights:
                </p>
                <div className="flex flex-wrap gap-2">
                  <PhoneticChip
                    ipa="/st-/"
                    example="student"
                    category="cluster"
                    l1Note="Continuous [s] breath onset without Spanish [e] vowel prefix."
                  />
                  <PhoneticChip
                    ipa="/-d/"
                    example="decided"
                    category="consonant"
                    l1Note="Audible /ɪd/ coda release preserves past tense meaning."
                  />
                  <PhoneticChip
                    ipa="/ð/"
                    example="they"
                    category="consonant"
                    l1Note="Light tongue-tip interdental contact prevents hard [d]."
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-black/30 p-4 border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#9dfbf9] mb-1">
                  PEDAGOGICAL CONTRACT
                </p>
                <p className="text-xs leading-5 text-slate-200">
                  “Coach corrects patterns that materially improve communicative comprehension. It never penalizes your cultural identity or accents.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[11px] font-black uppercase tracking-[.2em] text-[var(--lx-primary)]">
            HOW LUREXA COACH WORKS
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-.05em] sm:text-4xl">
            Built for Autonomous &amp; Ecosystem Learners
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">
            Use Coach directly as your daily speaking trainer, or connect it with your Lurexa Learn and Teach courses for unified progress.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm transition hover:shadow-md">
            <span className="text-2xl">⚡</span>
            <h3 className="mt-4 text-lg font-bold">1. Spaced-Repetition Review</h3>
            <p className="mt-2 text-xs leading-6 text-[var(--lx-muted)]">
              Phonemes are classified into <em>Struggling</em> (1-day), <em>Emerging</em> (3-day), and <em>Mastered</em> (14-day) review cycles to reinforce retention.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm transition hover:shadow-md">
            <span className="text-2xl">🇩🇴</span>
            <h3 className="mt-4 text-lg font-bold">2. Deep L1 Linguistic Profiles</h3>
            <p className="mt-2 text-xs leading-6 text-[var(--lx-muted)]">
              Specialized transfer models for Dominican, Puerto Rican, Mexican, and Colombian Spanish speakers addressing specific articulatory interference.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm transition hover:shadow-md">
            <span className="text-2xl">🔗</span>
            <h3 className="mt-4 text-lg font-bold">3. One Unified Learner Model</h3>
            <p className="mt-2 text-xs leading-6 text-[var(--lx-muted)]">
              All spoken evidence automatically feeds your persistent Learner Model in Core. Progress synchronizes seamlessly if you join Learn or Teach.
            </p>
          </div>
        </div>

        {/* Action Callout */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#071d67] to-[#2160df] p-8 text-white text-center sm:p-12">
          <h3 className="text-2xl font-extrabold sm:text-3xl">Ready to practice your spoken English?</h3>
          <p className="mt-3 text-sm text-indigo-100 max-w-xl mx-auto">
            Take the 3-minute oral placement diagnostic or explore our A1–C2 interactive practice packs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/placement"
              className="rounded-2xl bg-[#12cdd4] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#071d67] shadow-lg transition hover:bg-[#28e1e8] active:scale-95"
            >
              Take Oral Diagnostic →
            </Link>
            <a
              href={learnUrl}
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white/20"
            >
              Go to Lurexa Learn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

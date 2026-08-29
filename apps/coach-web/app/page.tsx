"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CoachShell } from "./components/CoachShell";
import { PhoneticChip } from "@lurexa/ui/PhoneticChip";
import { COACH_PRACTICE_PACKS, type CoachPracticePack } from "@lurexa/backend";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";
import { Button } from "@lurexa/ui/button";

const corePillars = [
  {
    icon: "🎯",
    tag: "Intelligibility First",
    title: "Clarity without Accent Erasure",
    description:
      "Coach focuses on real-world communicative comprehension. We celebrate your authentic voice while targeting specific phonetic and articulatory friction points.",
  },
  {
    icon: "⚡",
    tag: "Adaptive Memory",
    title: "Continuous Learner Model",
    description:
      "Every speech turn and conversation contributes to your persistent Learner Model in Lurexa Core—so Coach never asks you to start over.",
  },
  {
    icon: "🇩🇴",
    tag: "L1 Transfer Intelligence",
    title: "Dominican & Hispanic Focus",
    description:
      "Deeply calibrated for Dominican and Latin American Spanish speakers, proactively addressing vowel epenthesis, coda deletions, and rhythm transfer.",
  },
];

export default function CoachHomePage() {
  const [activeTab, setActiveTab] = useState<string>("A1");
  const urls = resolveLurexaPublicUrls();

  const previewPacks = COACH_PRACTICE_PACKS.filter((p: CoachPracticePack) => p.cefrLevel === activeTab);

  return (
    <CoachShell active="Home" inverse>
      <main className="text-[var(--lx-ink)]">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          {/* Ambient Lighting Spheres */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[130px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-10 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[140px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]"
          />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:pb-32 lg:pt-20">
            {/* Left Column: Heading & Value Prop */}
            <div className="animate-fade-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-extrabold tracking-wide text-cyan-300 backdrop-blur-md">
                <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
                AI ENGLISH SPEAKING &amp; PRONUNCIATION STUDIO
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
                Speak English.
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                  Sound like you—only clearer.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Lurexa Coach is your personal oral fluency and pronunciation partner. Practice spontaneous
                conversations, refine sound contrasts, and build spoken confidence with real-time feedback.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/placement"
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 px-7 py-3.5 text-center font-black text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:shadow-cyan-400/35 active:scale-95"
                >
                  Take Free Speaking Test 🎯
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-center font-bold text-slate-100 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Open Speaking Dashboard
                </Link>
              </div>

              <p className="mt-4 text-xs font-medium text-slate-400">
                ✓ Free oral diagnostic &nbsp;·&nbsp; ✓ CEFR Levels A1 to C2 &nbsp;·&nbsp; ✓ One Lurexa Identity
              </p>
            </div>

            {/* Right Column: Live Interactive Coach Studio Simulation Card */}
            <div className="animate-scale-in relative rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/15 to-white/5 p-3 shadow-[0_24px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl">
              <div className="rounded-[1.6rem] bg-slate-900/90 p-6 text-white sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">
                      LIVE COACHING TURN
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Intelligibility 94%
                  </span>
                </div>

                {/* Simulated Audio Waveform */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-[11px] font-mono text-slate-400 mb-2">Learner Spoken Input:</p>
                  <p className="text-sm font-semibold text-slate-100 leading-snug">
                    “I am going to the <span className="text-cyan-300 font-bold underline decoration-cyan-400">student</span> center to study for the test.”
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-1 h-8">
                    {[40, 65, 30, 85, 95, 70, 45, 80, 60, 90, 50, 35, 75, 90, 65, 40].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-indigo-400 transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Phoneme Clarity & Transfer Feedback */}
                <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 to-violet-950/70 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-200">
                      PHONETIC OBSERVATION · es-DO
                    </p>
                    <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-200">
                      Mastered /st-/
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-white">
                    Clean continuous [s] onset without vowel prefix [e]!
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <PhoneticChip ipa="/st-/" example="student" category="cluster" />
                    <PhoneticChip ipa="/-t/" example="test" category="consonant" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
              PEDAGOGICAL EXCELLENCE
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--lx-ink)] sm:text-4xl">
              An AI Speaking Experience Grounded in Real Pedagogy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--lx-muted)]">
              Coach avoids generic voice chatbots. Every turn is structured around proven CEFR competencies,
              phonetic contrasts, and communicative confidence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {corePillars.map((pillar, idx) => (
              <article
                key={pillar.title}
                className="animate-fade-slide-up rounded-[24px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-[var(--lx-card-shadow)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--lx-card-hover-shadow)]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="text-3xl">{pillar.icon}</span>
                <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-[var(--lx-primary)]">
                  {pillar.tag}
                </p>
                <h3 className="mt-1 text-lg font-bold text-[var(--lx-ink)]">{pillar.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--lx-muted)]">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Practice Pack Explorer Section */}
        <section className="border-t border-[var(--lx-border)] bg-[var(--lx-surface)] py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
                  SCENARIO CATALOG
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--lx-ink)]">
                  Explore Speaking Practice Packs
                </h2>
              </div>

              {/* Level Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 rounded-2xl bg-[var(--lx-canvas)] p-1.5 border border-[var(--lx-border)]">
                {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((lvl) => (
                  <Button
                    key={lvl}
                    type="button"
                    onClick={() => setActiveTab(lvl)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition ${
                      activeTab === lvl
                        ? "bg-[var(--lx-primary)] text-white shadow-sm"
                        : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
                    }`}
                  >
                    {lvl}
                  </Button>
                ))}
              </div>
            </div>

            {/* Packs Grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {previewPacks.slice(0, 3).map((pack: CoachPracticePack) => (
                <article
                  key={pack.id}
                  className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-6 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[var(--lx-primary)]/10 px-2.5 py-0.5 text-[10px] font-black text-[var(--lx-primary)] uppercase">
                        {pack.cefrLevel} • {pack.mode.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--lx-muted)]">
                        {pack.suggestedTurns} Turns
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-[var(--lx-ink)]">{pack.title}</h3>
                    <p className="text-xs font-semibold text-[var(--lx-primary)] mt-0.5">{pack.subtitle}</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--lx-muted)] line-clamp-3">
                      {pack.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[var(--lx-border)] text-[11px] text-[var(--lx-muted)] flex items-center justify-between">
                      <span>Partner: <strong>{pack.scenarioRole}</strong></span>
                      <span className="font-semibold text-emerald-600">Adaptive AI</span>
                    </div>
                  </div>

                  <Link
                    href={`/packs/${pack.id}`}
                    className="mt-6 block text-center rounded-xl bg-white border border-[var(--lx-border)] py-2.5 text-xs font-extrabold text-[var(--lx-ink)] hover:bg-[var(--lx-primary)] hover:text-white transition active:scale-95 shadow-sm"
                  >
                    Launch Practice Pack 🎙️
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Connected Ecosystem Banner */}
        <section className="mx-auto my-16 max-w-7xl px-5 sm:px-8">
          <div className="rounded-[32px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[#1f1966] to-[var(--lx-primary)] p-8 text-white sm:p-12 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-300">
                  <span>✨</span> Unified Lurexa Platform
                </span>
                <h3 className="mt-4 text-2xl font-black sm:text-4xl tracking-tight">
                  Seamlessly connected with Learn &amp; Teach.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-indigo-100 max-w-2xl">
                  Log in with your existing Lurexa account. Practice speaking turns in Coach and return to
                  your lessons in Learn or educator training in Teach with persistent evidence and recognized progress.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/placement"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg transition hover:bg-cyan-300 active:scale-95"
                >
                  Start Speaking Now →
                </Link>
                <a
                  href={urls.learn}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white/20"
                >
                  Visit Learn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </CoachShell>
  );
}

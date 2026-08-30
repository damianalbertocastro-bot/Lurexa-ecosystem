"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getTrackBySlug, type SpecializedModule } from "@lurexa/backend";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trackSlug = typeof params?.trackSlug === "string" ? params.trackSlug : "";
  const track = getTrackBySlug(trackSlug);

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  if (!track) {
    return (
      <main className="min-h-screen bg-[var(--lx-canvas)] px-4 py-16 text-center text-[var(--lx-ink)]">
        <div className="mx-auto max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Track not found</h1>
          <p className="text-sm text-[var(--lx-muted)]">
            The requested specialized industry track does not exist or has been relocated.
          </p>
          <Link href="/learn/tracks">
            <Button variant="primary">← Back to Specialized Tracks</Button>
          </Link>
        </div>
      </main>
    );
  }

  const activeModule: SpecializedModule | undefined = track.modules[activeModuleIndex];

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] px-4 py-10 sm:px-8 text-[var(--lx-ink)]">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Breadcrumbs & Banner */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs font-bold text-[var(--lx-muted)]">
            <Link href="/dashboard" className="hover:text-[var(--lx-ink)]">Dashboard</Link>
            <span>/</span>
            <Link href="/learn/tracks" className="hover:text-[var(--lx-ink)]">Specialized Tracks</Link>
            <span>/</span>
            <span className="text-[var(--lx-primary)]">{track.title}</span>
          </nav>

          <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-[var(--lx-primary)] p-8 text-white shadow-xl sm:p-10">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="info">{track.targetIndustry}</Badge>
                <Badge variant="success">Min Level: {track.minimumCefrLevel}</Badge>
                <Badge variant="default">{track.estimatedHours} Hours</Badge>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {track.title}
              </h1>
              <p className="text-xs font-semibold text-[var(--lx-accent)]">
                {track.titleEs}
              </p>
              <p className="text-sm leading-relaxed text-indigo-100">
                {track.description}
              </p>
            </div>
          </section>
        </div>

        {/* 2-Column Layout: Module Roadmap on Left, Active Module Deep-Dive on Right */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.8fr]">
          {/* Module Navigation List */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-[var(--lx-muted)]">
                Modules ({track.modules.length})
              </h2>
            </div>

            <div className="space-y-2.5">
              {track.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  onClick={() => setActiveModuleIndex(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Module ${mod.order}: ${mod.title}`}
                  className={`group flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 transition-all duration-200 ${
                    activeModuleIndex === idx
                      ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] shadow-md ring-2 ring-[var(--lx-primary)]/20"
                      : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-[var(--lx-primary)]/40 hover:bg-[var(--lx-canvas)]"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black ${
                      activeModuleIndex === idx
                        ? "bg-[var(--lx-primary)] text-white"
                        : "bg-[var(--lx-canvas)] text-[var(--lx-muted)]"
                    }`}
                  >
                    {mod.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[var(--lx-ink)]">
                      {mod.title}
                    </p>
                    <p className="truncate text-[11px] text-[var(--lx-muted)]">
                      {mod.vocabulary.length} vocab · {mod.spokenPrompts.length} spoken prompts
                    </p>
                  </div>
                  <span className="text-xs text-[var(--lx-muted)] group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Active Module Details */}
          {activeModule && (
            <section className="space-y-6">
              <Card
                title={`Module ${activeModule.order}: ${activeModule.title}`}
                subtitle={activeModule.mission}
              >
                <div className="space-y-6 pt-2">
                  {/* Competency Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.competencyIds.map((cid) => (
                      <span
                        key={cid}
                        className="rounded-full bg-[var(--lx-canvas)] border border-[var(--lx-border)] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[var(--lx-primary)]"
                      >
                        {cid}
                      </span>
                    ))}
                  </div>

                  {/* Domain Vocabulary Chips */}
                  <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/60 p-4 space-y-2.5">
                    <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-muted)]">
                      🎯 Targeted Domain Vocabulary
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeModule.vocabulary.map((word) => (
                        <span
                          key={word}
                          className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-1 text-xs font-semibold text-[var(--lx-ink)] shadow-2xs"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Grammar & Dialogue Structures */}
                  <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/60 p-4 space-y-2.5">
                    <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-muted)]">
                      💬 Key Discourse &amp; Grammar Structures
                    </p>
                    <ul className="space-y-1.5 text-xs text-[var(--lx-ink)]">
                      {activeModule.grammarStructures.map((struct, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[var(--lx-secondary)] font-bold">›</span>
                          <span className="font-medium italic">"{struct}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Phonetic Targets & Remediation */}
                  <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-800/40 p-4 space-y-2.5">
                    <p className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      🎙️ Dominican Phonetic Intelligibility Focus
                    </p>
                    <ul className="space-y-1.5 text-xs text-[var(--lx-ink)]">
                      {activeModule.phoneticTargets.map((target, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Spoken Prompts & Role-Plays */}
                  <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/60 p-4 space-y-3">
                    <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-muted)]">
                      🎭 Authentic Spoken Role-Play Scenarios
                    </p>
                    <div className="space-y-3">
                      {activeModule.rolePlayScenarios.map((rp) => (
                        <div
                          key={rp.id}
                          className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <b className="text-xs text-[var(--lx-primary)]">{rp.title}</b>
                            <span className="text-[10px] font-bold text-[var(--lx-muted)]">
                              Roles: {rp.roles.join(" ↔ ")}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--lx-muted)]">{rp.setting}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rp.evaluationCriteria.map((crit, idx) => (
                              <Badge key={idx} variant="info">{crit}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Create & Apply Task */}
                  <div className="rounded-2xl border border-[var(--lx-primary)]/30 bg-[var(--lx-primary)]/5 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-primary)]">
                        🚀 Create &amp; Apply Capstone Task
                      </p>
                      <Badge variant="success">Stage 7: Production</Badge>
                    </div>
                    <b className="block text-sm font-bold text-[var(--lx-ink)]">
                      {activeModule.createApplyTask.title}
                    </b>
                    <p className="text-xs leading-5 text-[var(--lx-muted)]">
                      {activeModule.createApplyTask.prompt}
                    </p>
                  </div>

                  {/* Launch Simulation in Coach */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      variant="primary"
                      onClick={() => router.push("/learn/a1-preview")}
                    >
                      Practice in Lesson Runtime →
                    </Button>
                    <a href="http://localhost:3002/studio" target="_blank" rel="noreferrer">
                      <Button variant="secondary">
                        Acoustic Practice in Coach Studio ↗
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

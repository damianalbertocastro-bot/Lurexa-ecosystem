"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SPECIALIZED_INDUSTRY_TRACKS } from "@lurexa/backend";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";

export default function SpecializedTracksPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  const industries = ["all", "BPO", "Tourism & Hospitality", "Software Engineering"];

  const filteredTracks = selectedIndustry === "all"
    ? SPECIALIZED_INDUSTRY_TRACKS
    : SPECIALIZED_INDUSTRY_TRACKS.filter((t) => t.targetIndustry.toLowerCase().includes(selectedIndustry.toLowerCase()));

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] px-4 py-10 sm:px-8 text-[var(--lx-ink)]">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Banner */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-[var(--lx-primary)] p-8 text-white shadow-xl sm:p-12">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[var(--lx-accent)] backdrop-blur-md">
              ⚡ Specialized Career Tracks
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Industry English for high-growth Dominican careers.
            </h1>
            <p className="text-sm leading-relaxed text-indigo-100 sm:text-base">
              Targeted communicative fluency, domain vocabulary, authentic client role-plays, and intelligibility refinement tailored for Dominican professionals.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mr-2">
            Industry:
          </span>
          {industries.map((ind) => (
            <Button
              key={ind}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                selectedIndustry === ind
                  ? "bg-[var(--lx-primary)] text-white shadow-sm"
                  : "bg-[var(--lx-surface)] text-[var(--lx-muted)] border border-[var(--lx-border)] hover:text-[var(--lx-ink)]"
              }`}
            >
              {ind === "all" ? "All Career Tracks" : ind}
            </Button>
          ))}
        </section>

        {/* Tracks Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((track) => (
            <Card
              key={track.id}
              interactive
              className="flex flex-col justify-between"
              title={track.title}
              subtitle={track.titleEs}
            >
              <div className="space-y-4 pt-2">
                <p className="text-xs leading-5 text-[var(--lx-muted)]">
                  {track.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info">Min CEFR: {track.minimumCefrLevel}</Badge>
                  <Badge variant="default">{track.estimatedHours} Hours</Badge>
                  <Badge variant="success">{track.modules.length} Modules</Badge>
                </div>

                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/70 p-3.5 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)]">
                    Curriculum Highlights
                  </p>
                  <ul className="space-y-1 text-xs text-[var(--lx-ink)]">
                    {track.modules.slice(0, 3).map((mod) => (
                      <li key={mod.id} className="flex items-center gap-2">
                        <span className="text-[var(--lx-primary)] font-bold">•</span>
                        <span className="truncate">{mod.title}</span>
                      </li>
                    ))}
                    {track.modules.length > 3 && (
                      <li className="text-[11px] font-medium text-[var(--lx-muted)]">
                        + {track.modules.length - 3} more specialized modules
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link href={`/learn/tracks/${track.slug}`} className="block w-full">
                    <Button variant="primary" className="w-full">
                      Explore Track &amp; Modules →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

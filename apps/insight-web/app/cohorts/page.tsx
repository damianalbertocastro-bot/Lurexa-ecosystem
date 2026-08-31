"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import { InsightShell } from "../components/InsightShell";

interface PhonemeCell {
  phoneme: string;
  category: string;
  errorRate: number;
  sampleWord: string;
  targetWord: string;
}

const HEATMAP_DATA: Record<string, PhonemeCell[]> = {
  "Santo Domingo Cohort Alpha": [
    { phoneme: "/s/ (final)", category: "Coda Weakening", errorRate: 48, sampleWord: "tha'", targetWord: "that / that's" },
    { phoneme: "/st-/ (cluster)", category: "Epenthesis", errorRate: 42, sampleWord: "estudy", targetWord: "study" },
    { phoneme: "/l/ vs /r/", category: "Liquid Neutralization", errorRate: 31, sampleWord: "pualto", targetWord: "puerto / portal" },
    { phoneme: "/i/ vs /ɪ/", category: "Vowel Tenseness", errorRate: 25, sampleWord: "sheep", targetWord: "ship" },
    { phoneme: "-s (3rd person)", category: "Inflection", errorRate: 22, sampleWord: "he work", targetWord: "he works" },
    { phoneme: "/θ/ vs /t/", category: "Interdental Stopping", errorRate: 18, sampleWord: "tink", targetWord: "think" },
  ],
  "Santiago Regional ESL-2": [
    { phoneme: "/s/ (final)", category: "Coda Weakening", errorRate: 39, sampleWord: "focu'", targetWord: "focus" },
    { phoneme: "/st-/ (cluster)", category: "Epenthesis", errorRate: 35, sampleWord: "eschool", targetWord: "school" },
    { phoneme: "/l/ vs /r/", category: "Liquid Neutralization", errorRate: 36, sampleWord: "cuelpo", targetWord: "cuerpo / corporate" },
    { phoneme: "/i/ vs /ɪ/", category: "Vowel Tenseness", errorRate: 21, sampleWord: "feet", targetWord: "fit" },
    { phoneme: "-s (3rd person)", category: "Inflection", errorRate: 16, sampleWord: "she live", targetWord: "she lives" },
    { phoneme: "/θ/ vs /t/", category: "Interdental Stopping", errorRate: 14, sampleWord: "trough", targetWord: "through" },
  ],
};

export default function CohortHeatmapPage() {
  const [selectedCohort, setSelectedCohort] = useState("Santo Domingo Cohort Alpha");
  const data = HEATMAP_DATA[selectedCohort] || HEATMAP_DATA["Santo Domingo Cohort Alpha"];

  return (
    <InsightShell active="Phonemic Heatmaps">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-bold text-[var(--lx-secondary)] hover:underline">
                ← Overview
              </Link>
              <span className="text-[var(--lx-muted)]">/</span>
              <span className="text-xs text-[var(--lx-muted)]">Phonemic Heatmaps</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              Cohort-Wide Phonemic Error Heatmap
            </h1>
            <p className="text-xs sm:text-sm text-[var(--lx-muted)]">
              Granular analysis of L1 transfer patterns across acoustic evidence logs in Cloud Storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3.5 py-2 text-xs font-bold text-[var(--lx-ink)] shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--lx-secondary)]"
            >
              <option value="Santo Domingo Cohort Alpha">Santo Domingo Cohort Alpha (140 Learners)</option>
              <option value="Santiago Regional ESL-2">Santiago Regional ESL-2 (210 Learners)</option>
            </select>
          </div>
        </section>

        {/* Heatmap Matrix Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((cell, idx) => {
            const isHigh = cell.errorRate >= 40;
            const isMed = cell.errorRate >= 25 && cell.errorRate < 40;

            return (
              <Card
                key={idx}
                className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-secondary)] transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[var(--lx-canvas)] px-2.5 py-1 text-xs font-mono font-bold text-[var(--lx-secondary)] border border-[var(--lx-border)]">
                    {cell.phoneme}
                  </span>
                  <Badge
                    variant={isHigh ? "warning" : isMed ? "info" : "success"}
                    className="text-xs font-bold"
                  >
                    {cell.errorRate}% Error Rate
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                    {cell.category}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--lx-ink)]">
                    Target: <span className="font-mono text-[var(--lx-primary)]">{cell.targetWord}</span>
                  </p>
                  <p className="text-xs text-[var(--lx-muted)]">
                    Common L1 realization: <span className="font-mono text-[var(--lx-destructive)]">{cell.sampleWord}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--lx-border)]">
                  <span className="text-[11px] text-[var(--lx-muted)]">Evidence: 120+ audio logs</span>
                  <Link href="/interventions">
                    <Button size="sm" variant="secondary" className="text-[11px] font-bold rounded-lg">
                      Dispatch Drill →
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </InsightShell>
  );
}

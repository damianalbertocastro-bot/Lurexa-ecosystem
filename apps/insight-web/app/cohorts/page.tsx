"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
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
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                ← Overview
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500 font-medium">Phonemic Heatmaps</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Cohort-Wide Phonemic Error Heatmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Granular analysis of L1 transfer patterns across acoustic evidence logs in Cloud Storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            const badgeClass = isHigh
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : isMed
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200";

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-indigo-700 border border-slate-200">
                    {cell.phoneme}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                    {cell.errorRate}% Error Rate
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {cell.category}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    Target: <span className="font-mono text-indigo-600">{cell.targetWord}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Common L1 realization: <span className="font-mono text-rose-600">{cell.sampleWord}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Evidence: 120+ audio logs</span>
                  <Link href="/interventions">
                    <button
                      type="button"
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Dispatch Drill →
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </InsightShell>
  );
}

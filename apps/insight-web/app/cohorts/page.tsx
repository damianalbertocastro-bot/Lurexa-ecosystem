"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PhonemeCell {
  phoneme: string;
  category: string;
  errorRate: number; // 0 to 100
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs font-bold text-indigo-400 hover:underline">
              ← Overview
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">Phonemic Heatmaps</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cohort-Wide Phonemic Heatmap
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Granular analysis of L1 transfer patterns across acoustic evidence logs in Google Cloud Storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Santo Domingo Cohort Alpha">Santo Domingo Cohort Alpha (140 Learners)</option>
            <option value="Santiago Regional ESL-2">Santiago Regional ESL-2 (210 Learners)</option>
          </select>
        </div>
      </div>

      {/* Heatmap Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((cell, idx) => {
          const isHigh = cell.errorRate >= 40;
          const isMed = cell.errorRate >= 25 && cell.errorRate < 40;

          return (
            <div
              key={idx}
              className={`rounded-xl border p-5 space-y-4 transition ${
                isHigh
                  ? "border-rose-500/40 bg-rose-950/20"
                  : isMed
                  ? "border-amber-500/40 bg-amber-950/20"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
                  {cell.phoneme}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isHigh
                    ? "bg-rose-500/20 text-rose-400"
                    : isMed
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {cell.errorRate}% Error Rate
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-white">{cell.category}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Dominican L1 Transfer: observed <span className="font-mono text-amber-300">&quot;{cell.sampleWord}&quot;</span> vs expected <span className="font-mono text-emerald-400">&quot;{cell.targetWord}&quot;</span>.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Evidence status</span>
                <span className="font-medium text-indigo-400">Active Drills in Coach</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Automated Remediation Recommendation */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-6 space-y-4">
        <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
          Mind Pedagogical Prescription
        </h3>
        <p className="text-sm text-slate-200">
          Based on the <strong>{selectedCohort}</strong> phonemic distribution, dispatching a 3-unit phonetics drill on <strong>Coda Weakening &amp; /s/-cluster Epenthesis</strong> will yield an estimated <strong>+18% fluency gain</strong> within 10 days of targeted practice.
        </p>
        <div>
          <Link
            href="/interventions"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500 transition"
          >
            Dispatch Remediation Assignment →
          </Link>
        </div>
      </div>
    </div>
  );
}

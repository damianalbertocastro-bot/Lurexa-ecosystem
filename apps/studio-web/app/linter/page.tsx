"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";

const CEFR_LEVELS: CefrLevel[] = ["PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"];

export default function CefrLinterToolPage() {
  const [targetCefr, setTargetCefr] = useState<CefrLevel>("A1");
  const [inputText, setInputText] = useState(
    "Hello! My name is Juan and I live in Santo Domingo. I want to learn English to speak with friends."
  );

  const report = useMemo(() => {
    return StudioAuthoringService.lintCefrLinguistics(inputText, targetCefr);
  }, [inputText, targetCefr]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs font-bold text-amber-600 hover:underline">
              ← Studio Dashboard
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            CEFR Linguistic Diagnostic Linter
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Paste any English lesson prompt, dialogue, or assessment script to evaluate CEFR band alignment, syntactic density, and out-of-level vocabulary.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Text Input & Target CEFR */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="diagnostic-target" className="text-xs font-bold text-slate-700">
                Target Benchmark CEFR Level
              </label>
              <select
                id="diagnostic-target"
                value={targetCefr}
                onChange={(e) => setTargetCefr(e.target.value as CefrLevel)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900"
              >
                {CEFR_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="diagnostic-text" className="text-xs font-bold text-slate-700">
                Input Text for Analysis
              </label>
              <textarea
                id="diagnostic-text"
                rows={8}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste lesson sentences, listening passages, or oral exam prompts here..."
                className="w-full rounded-2xl border border-slate-200 p-4 text-xs font-mono text-slate-900 leading-relaxed focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 font-medium">
              <span>Characters: {inputText.length}</span>
              <span>Words: {report.totalWords}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Report */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Diagnostic Verdict</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                  report.isApproved
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {report.isApproved ? "Aligned ✓" : "Review Level ⚠"}
              </span>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Target CEFR</span>
                <span className="text-2xl font-black text-slate-900">{report.targetCefr}</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Calculated CEFR</span>
                <span className="text-2xl font-black text-amber-600">{report.calculatedCefrScore}</span>
              </div>
            </div>

            {/* Vocabulary Breakdown */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700">Vocabulary Frequency Bands</span>
              <div className="space-y-2">
                {Object.entries(report.vocabularyBandPercentages).map(([band, pct]) => (
                  <div key={band} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Band {band}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Syntactic Complexity */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Syntactic Complexity Ratio</span>
                <span>{(report.syntacticComplexityScore * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${report.syntacticComplexityScore * 100}%` }}
                />
              </div>
            </div>

            {/* Out of Level Words */}
            {report.outOfLevelWords.length > 0 ? (
              <div className="space-y-2">
                <span className="block text-xs font-bold text-rose-700">
                  Out-of-Level Vocabulary Flags ({report.outOfLevelWords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.outOfLevelWords.map((word) => (
                    <span
                      key={word}
                      className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-xs font-bold text-rose-800"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                No out-of-level vocabulary detected for {report.targetCefr}.
              </div>
            )}

            {/* Recommendations */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <span className="block text-xs font-bold text-slate-700">Pedagogical Guidance</span>
              <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

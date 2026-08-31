"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { StudioShell } from "../components/StudioShell";

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
    <StudioShell active="CEFR Linter">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-bold text-[var(--lx-primary)] hover:underline">
                ← Studio Dashboard
              </Link>
              <span className="text-[var(--lx-muted)]">/</span>
              <span className="text-xs text-[var(--lx-muted)]">CEFR Linter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              CEFR Linguistic Diagnostic Linter
            </h1>
            <p className="text-xs sm:text-sm text-[var(--lx-muted)]">
              Paste any English lesson prompt, dialogue, or assessment script to evaluate CEFR band alignment, syntactic density, and out-of-level vocabulary.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Text Input & Target CEFR */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 sm:p-8 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-5">
              <div className="flex items-center justify-between">
                <label htmlFor="diagnostic-target" className="text-xs font-bold text-[var(--lx-ink)]">
                  Target Benchmark CEFR Level
                </label>
                <select
                  id="diagnostic-target"
                  value={targetCefr}
                  onChange={(e) => setTargetCefr(e.target.value as CefrLevel)}
                  className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-1.5 text-xs font-bold text-[var(--lx-ink)]"
                >
                  {CEFR_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="diagnostic-text" className="text-xs font-bold text-[var(--lx-ink)]">
                  Input Text for Analysis
                </label>
                <textarea
                  id="diagnostic-text"
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste lesson sentences, listening passages, or oral exam prompts here..."
                  className="w-full rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4 text-xs font-mono text-[var(--lx-ink)] leading-relaxed focus:border-[var(--lx-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-[var(--lx-muted)] font-medium border-t border-[var(--lx-border)]">
                <span>Characters: {inputText.length}</span>
                <span>Words: {report.totalWords}</span>
              </div>
            </Card>
          </div>

          {/* Right Column: Diagnostic Report */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-4">
                <h2 className="text-base font-black text-[var(--lx-ink)]">Diagnostic Verdict</h2>
                <Badge
                  variant={report.isApproved ? "success" : "warning"}
                  className="text-xs font-bold uppercase"
                >
                  {report.isApproved ? "Aligned ✓" : "Review Level ⚠"}
                </Badge>
              </div>

              {/* Score Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                    Complexity Index
                  </span>
                  <p className="mt-1 text-2xl font-black text-[var(--lx-ink)]">
                    {Math.round(report.syntacticComplexityScore * 100)}/100
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                    CEFR Alignment
                  </span>
                  <p className="mt-1 text-2xl font-black text-[var(--lx-primary)]">{targetCefr}</p>
                </div>
              </div>

              {/* Vocabulary Frequency Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[var(--lx-ink)]">Vocabulary Level Distribution</span>
                <div className="space-y-2">
                  {Object.entries(report.vocabularyBandPercentages).map(([lvl, pct]) => (
                    <div key={lvl} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[var(--lx-muted)]">{lvl.replace("_", "/")}:</span>
                      <span className="font-bold text-[var(--lx-ink)]">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Out-of-Level Warnings */}
              {report.outOfLevelWords.length > 0 ? (
                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4 space-y-2">
                  <span className="text-xs font-bold text-[var(--lx-warning)]">
                    ⚠ Detected Words Above {targetCefr}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.outOfLevelWords.map((w, idx) => (
                      <Badge key={idx} variant="warning" className="font-mono text-[10px]">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4 text-xs font-semibold text-[var(--lx-primary)]">
                  ✓ 100% of vocabulary words fall within or below {targetCefr}.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </StudioShell>
  );
}

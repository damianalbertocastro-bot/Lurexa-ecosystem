"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InstitutionalAnalyticsService, type InstitutionalCohortAnalytics } from "@lurexa/backend";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { InsightShell } from "./components/InsightShell";

export default function InsightOverviewPage() {
  const [analytics] = useState<InstitutionalCohortAnalytics>(() =>
    InstitutionalAnalyticsService.getCohortAnalytics("uasd-santo-domingo")
  );

  return (
    <InsightShell active="Overview">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Executive Hero / Header */}
        <section className="relative overflow-hidden rounded-3xl border border-[var(--lx-border)] bg-gradient-to-br from-[var(--lx-surface)] via-[var(--lx-canvas)] to-[var(--lx-surface)] p-6 sm:p-8 shadow-[var(--lx-card-shadow)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-secondary)]">
                  INSTITUTIONAL INTELLIGENCE
                </span>
                <span className="text-[var(--lx-muted)]">·</span>
                <Badge variant="info" className="text-[10px]">
                  {analytics.organizationName}
                </Badge>
                <Badge variant="success" className="text-[10px]">
                  Core Governed
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
                Executive CEFR Velocity &amp; Learning Radar
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--lx-muted)]">
                Longitudinal CEFR progression, Dominican Spanish linguistic transfer metrics, and dropout early-warning telemetry calibrated with Lurexa Mind models.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/cohorts">
                <Button className="rounded-xl bg-[var(--lx-primary)] px-4 py-2.5 text-xs font-black text-white shadow-xs hover:opacity-95 transition">
                  Phonemic Heatmaps →
                </Button>
              </Link>
              <Link href="/interventions">
                <Button
                  variant="secondary"
                  className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 py-2.5 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)]"
                >
                  Active Interventions
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Top-Level KPI Metric Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-secondary)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                Active Cohort
              </span>
              <Badge variant="success" className="text-[10px]">
                ↑ +18% MoM
              </Badge>
            </div>
            <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              {analytics.activeLearnersCount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[var(--lx-muted)]">Enrolled students in active terms</p>
          </Card>

          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-secondary)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                Speaking Velocity
              </span>
              <Badge variant="info" className="text-[10px]">
                Active Weekly
              </Badge>
            </div>
            <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              {analytics.averageSpeakingMinutesPerLearner} min
            </p>
            <p className="mt-1 text-xs text-[var(--lx-muted)]">Average weekly spoken practice</p>
          </Card>

          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-secondary)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                Grading SLA (&lt;24h)
              </span>
              <Badge variant="success" className="text-[10px]">
                Target Met
              </Badge>
            </div>
            <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              {Math.round(
                (analytics.assignmentSla.gradedWithin24Hours /
                  analytics.assignmentSla.totalSubmitted) *
                  100
              )}
              %
            </p>
            <p className="mt-1 text-xs text-[var(--lx-muted)]">
              Avg turnaround: {analytics.assignmentSla.averageGradingHours} hours
            </p>
          </Card>

          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-secondary)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                Mind AI Grade Alignment
              </span>
              <Badge variant="warning" className="text-[10px]">
                Educator Verified
              </Badge>
            </div>
            <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              {analytics.assignmentSla.aiSuggestedGradesAcceptedPercent}%
            </p>
            <p className="mt-1 text-xs text-[var(--lx-muted)]">Instructor review acceptance rate</p>
          </Card>
        </section>

        {/* CEFR Longitudinal Velocity Radar */}
        <Card className="p-6 sm:p-8 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--lx-border)] pb-4">
            <div>
              <h2 className="text-lg font-black text-[var(--lx-ink)]">
                CEFR Milestone Progression &amp; Velocity Benchmarks
              </h2>
              <p className="text-xs text-[var(--lx-muted)]">
                Empirical time-to-proficiency compared against international CEFR duration guidelines
              </p>
            </div>
            <Badge variant="success" className="w-fit text-xs font-bold">
              ⚡ Accelerated Progression Rate
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {analytics.cefrVelocity.map((v, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-[var(--lx-secondary)]">
                    {v.fromLevel} → {v.toLevel}
                  </span>
                  <Badge variant="info" className="text-[10px]">
                    {Math.round(v.completionRate * 100)}% Pass Rate
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[var(--lx-muted)]">
                    <span>Observed Velocity:</span>
                    <b className="text-[var(--lx-ink)]">{v.averageWeeksToComplete} weeks</b>
                  </div>
                  <div className="flex justify-between text-[var(--lx-muted)]">
                    <span>Standard Timeline:</span>
                    <span>{v.benchmarkWeeks} weeks</span>
                  </div>
                </div>

                <ProgressBar
                  value={Math.min(
                    100,
                    Math.round((v.benchmarkWeeks / v.averageWeeksToComplete) * 75)
                  )}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Dominican Spanish Linguistic Transfer Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-3">
              <div>
                <h3 className="font-black text-[var(--lx-ink)]">
                  Top Dominican Phonological Transfer Patterns
                </h3>
                <p className="text-xs text-[var(--lx-muted)]">
                  Acoustic error frequency detected in speaking submissions
                </p>
              </div>
              <Link href="/cohorts" className="text-xs font-bold text-[var(--lx-secondary)] hover:underline">
                View Heatmap →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { rule: "Coda /s/ Aspiration / Deletion", error: "48%", impact: "Loss of plural & 3rd-person inflections", severity: "warning" as const },
                { rule: "Initial /s/-cluster Epenthesis", error: "42%", impact: "Vowel insertion before 'sp-', 'st-', 'sk-'", severity: "warning" as const },
                { rule: "Liquid Neutralization (/l/ vs /r/)", error: "31%", impact: "Lateralization in syllable codas", severity: "info" as const },
                { rule: "Tense vs. Lax Vowel Confusion (/i/ vs /ɪ/)", error: "25%", impact: "Minimal pair distinction (sheep vs ship)", severity: "info" as const },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-[var(--lx-ink)]">{item.rule}</p>
                    <p className="text-[11px] text-[var(--lx-muted)]">{item.impact}</p>
                  </div>
                  <Badge variant={item.severity} className="text-xs font-bold">
                    {item.error}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-3">
              <div>
                <h3 className="font-black text-[var(--lx-ink)]">
                  At-Risk Cohort Early Warning Telemetry
                </h3>
                <p className="text-xs text-[var(--lx-muted)]">
                  Real-time indicators for learners falling behind pace
                </p>
              </div>
              <Link href="/interventions" className="text-xs font-bold text-[var(--lx-secondary)] hover:underline">
                Manage Interventions →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { name: "Carlos Ramirez", cohort: "Santo Domingo Cohort Alpha", risk: "3 inactive days after failed /s/-cluster quiz", action: "Trigger 5-min Coach Drill" },
                { name: "Maria Santos", cohort: "Santiago Regional ESL-2", risk: "Liquid neutralization blocking A1 capstone", action: "Assign Studio Remediation" },
                { name: "Yomaira Gomez", cohort: "UASD English Immersion B1", risk: "Speaking practice duration 40% below target", action: "Send Study Reminder" },
              ].map((student, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <b className="text-[var(--lx-ink)]">{student.name}</b>
                      <span className="text-[11px] text-[var(--lx-muted)]">({student.cohort})</span>
                    </div>
                    <p className="text-[11px] text-[var(--lx-destructive)] font-medium">{student.risk}</p>
                  </div>
                  <Link href="/interventions">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-lg text-[11px] font-bold border-[var(--lx-border)]"
                    >
                      {student.action}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </InsightShell>
  );
}

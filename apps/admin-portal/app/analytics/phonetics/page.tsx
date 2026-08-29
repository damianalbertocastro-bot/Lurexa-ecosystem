"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { PhoneticChip } from "@lurexa/ui/PhoneticChip";
import {
  InstitutionalAnalyticsService,
  type InstitutionalCohortAnalytics,
  type PhonemeStruggleEntry,
} from "@lurexa/backend";

export default function AdminPhoneticsAnalyticsPage() {
  const [data] = useState<InstitutionalCohortAnalytics>(() => InstitutionalAnalyticsService.getCohortAnalytics());

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)] pb-16">
      {/* Header */}
      <section className="border-b border-white/10 bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy-light)] to-[var(--lx-secondary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <Link href="/" className="rounded-xl">
              <ProductMark product="admin" inverse />
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Overview
              </Link>
              <Link
                href="/billing"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Billing &amp; Licenses
              </Link>
              <Link
                href="/analytics/phonetics"
                className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white"
              >
                Phonetics &amp; Speaking
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
            </div>
          </header>

          <div className="mt-10 max-w-3xl pb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lx-accent)]/40 bg-[var(--lx-accent)]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[.18em] text-[var(--lx-accent)]">
              <span>📊 Institutional Phonological Intelligence</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-5xl">
              Phonological Struggle Matrix
            </h1>
            <p className="mt-3 text-sm leading-6 text-indigo-100">
              Aggregated articulatory and L1 Spanish interference telemetry across active learner cohorts for {data.organizationName}.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 space-y-8">
        {/* Cohort Overview Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Cohort Learners
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-primary)]">
              {data.activeLearnersCount}
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Enrolled students with spoken evidence
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Avg Speaking Time
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-ink)]">
              {data.averageSpeakingMinutesPerLearner} min
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Per student active speaking practice
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Dominant L1 Profile
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[#0ba5a8]">
              es-DO (74%)
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Dominican Spanish native speakers
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Primary Level
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-secondary)]">
              A1 / A2 (71%)
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Foundational &amp; elementary proficiency
            </p>
          </div>
        </div>

        {/* Phoneme Struggle Heatmap Table */}
        <section className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-4 mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">COHORT HEATMAP</p>
              <h2 className="text-xl font-bold text-[var(--lx-ink)]">Targeted Articulatory Intervention Queue</h2>
            </div>
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-[var(--lx-primary)]">
              {data.phonemeStruggleMatrix.length} Priority Phonemes
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--lx-border)]">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[10px] font-black uppercase tracking-[.13em] text-[var(--lx-muted)]">
                <tr>
                  <th scope="col" className="px-4 py-3">Phoneme / Target</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Affected Students</th>
                  <th scope="col" className="px-4 py-3">Accuracy</th>
                  <th scope="col" className="px-4 py-3">Severity</th>
                  <th scope="col" className="px-4 py-3">Recommended Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lx-border)] bg-[var(--lx-surface)]">
                {data.phonemeStruggleMatrix.map((entry: PhonemeStruggleEntry) => (
                  <tr key={entry.phoneme} className="transition hover:bg-[var(--lx-canvas)]/60">
                    <td className="px-4 py-4">
                      <PhoneticChip
                        ipa={entry.ipa}
                        example={entry.phoneme}
                        category={entry.category}
                      />
                    </td>
                    <td className="px-4 py-4 text-xs font-bold uppercase text-[var(--lx-muted)]">
                      {entry.category}
                    </td>
                    <td className="px-4 py-4 font-bold text-[var(--lx-ink)]">
                      {entry.affectedLearnersCount} ({Math.round((entry.affectedLearnersCount / data.activeLearnersCount) * 100)}%)
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-xs">
                      {Math.round(entry.averageAccuracy * 100)}%
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          entry.severity === "high"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : entry.severity === "moderate"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {entry.severity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-[var(--lx-muted)] leading-5 max-w-xs">
                      {entry.recommendedIntervention}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

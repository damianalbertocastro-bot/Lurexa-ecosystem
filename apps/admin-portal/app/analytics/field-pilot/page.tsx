"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { Card } from "@lurexa/ui/card";
import { FieldTelemetryService, type DominicanFieldPilotTelemetryReport } from "@lurexa/backend";

export default function DominicanFieldPilotAnalyticsPage() {
  const [telemetry] = useState<DominicanFieldPilotTelemetryReport>(
    FieldTelemetryService.getDominicanFieldTelemetry()
  );

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
                href="/roster"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Roster Sync
              </Link>
              <Link
                href="/analytics/phonetics"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Phonetics &amp; Speaking
              </Link>
              <Link
                href="/analytics/field-pilot"
                className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white"
              >
                Dominican Field Pilot
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
            </div>
          </header>

          <div className="mt-10 max-w-3xl pb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lx-accent)]/40 bg-[var(--lx-accent)]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[.18em] text-[var(--lx-accent)]">
              <span>📱 Low-Bandwidth &amp; Regional Dialect Pilot</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-5xl">
              Dominican Field Pilot &amp; PWA Telemetry
            </h1>
            <p className="mt-3 text-sm leading-6 text-indigo-100">
              Live mobile telemetry under 3G/4G connectivity, offline audio sync reconciliation rates, and regional Dominican Spanish dialect articulatory metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Main Metrics */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Active Field Learners
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-primary)]">
              {telemetry.totalFieldLearners}
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Across 4 regional pilot cohorts in Dominican Republic
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Offline Audio Sync Health
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-emerald-600">
              {telemetry.offlineSyncPerformance.reconciledSuccessfulPercent}%
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              {telemetry.offlineSyncPerformance.totalOfflineAudioCaptured} offline spoken recordings reconciled
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              Mobile Network Mix
            </p>
            <b className="mt-3 block text-2xl tracking-[-.04em] text-[var(--lx-ink)]">
              42% 3G · 45% 4G
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Avg RTT: {telemetry.networkTelemetry.averageRoundTripLatencyMs}ms · Loss: {telemetry.networkTelemetry.audioPacketLossPercent}%
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--lx-muted)]">
              PWA Caching Efficiency
            </p>
            <b className="mt-3 block text-3xl tracking-[-.06em] text-[var(--lx-secondary)]">
              98.2%
            </b>
            <p className="mt-2 text-xs font-medium text-[var(--lx-muted)]">
              Core audio models served locally via Service Worker
            </p>
          </div>
        </div>

        {/* Regional Dominican Dialect Breakdown */}
        <Card
          title="Dominican Regional Dialect Articulatory Matrix"
          subtitle="Acoustic variance patterns across Cibao, Santo Domingo, Sur, and Este cohorts"
        >
          <div className="overflow-x-auto rounded-2xl border border-[var(--lx-border)] mt-4">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="sticky top-0 border-b border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[10px] font-black uppercase tracking-[.13em] text-[var(--lx-muted)]">
                <tr>
                  <th className="px-4 py-3">Region &amp; Dialect</th>
                  <th className="px-4 py-3">Cohort Share</th>
                  <th className="px-4 py-3">Dominant L1 Transfer Pattern</th>
                  <th className="px-4 py-3">Articulatory Target</th>
                  <th className="px-4 py-3 text-right">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lx-border)] bg-[var(--lx-surface)]">
                {telemetry.dialectCohorts.map((cohort) => (
                  <tr key={cohort.region} className="hover:bg-[var(--lx-canvas)] transition-colors">
                    <td className="px-4 py-3 font-bold text-[var(--lx-ink)]">
                      {cohort.regionName}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[var(--lx-primary)]">
                      {cohort.learnerPercentage}%
                    </td>
                    <td className="px-4 py-3 text-[var(--lx-ink)] max-w-xs">
                      {cohort.primaryL1TransferPattern}
                    </td>
                    <td className="px-4 py-3 text-[var(--lx-muted)] max-w-xs">
                      {cohort.articulatoryRemediationPriority}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-[var(--lx-success)]">
                      {cohort.averageIntelligibilityScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

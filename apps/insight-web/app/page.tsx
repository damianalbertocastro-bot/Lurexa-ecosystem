"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InstitutionalAnalyticsService, type InstitutionalCohortAnalytics } from "@lurexa/backend";

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  trend: "up" | "down" | "neutral";
  color: "indigo" | "cyan" | "emerald" | "amber";
}

function MetricCard({ label, value, subtext, trend, color }: MetricCardProps) {
  const colorMap = {
    indigo: "border-indigo-500/30 bg-indigo-950/20 text-indigo-400",
    cyan: "border-cyan-500/30 bg-cyan-950/20 text-cyan-400",
    emerald: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
    amber: "border-amber-500/30 bg-amber-950/20 text-amber-400",
  };

  return (
    <div className={`rounded-xl border p-5 transition hover:border-slate-700 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <span className="text-xs font-medium">
          {trend === "up" ? "↑ Positive" : trend === "down" ? "↓ Attention" : "— Steady"}
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-white tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtext}</p>
    </div>
  );
}

export default function InsightOverviewPage() {
  const [analytics] = useState<InstitutionalCohortAnalytics>(() =>
    InstitutionalAnalyticsService.getCohortAnalytics("uasd-santo-domingo")
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30">
              Institutional Intelligence
            </span>
            <span className="text-xs text-slate-500">{analytics.organizationName}</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Executive Learning & CEFR Velocity Radar
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Longitudinal CEFR progression, Dominican Spanish linguistic transfer metrics, and dropout early-warning telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cohorts"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
          >
            Explore Phonemic Heatmaps
          </Link>
          <Link
            href="/interventions"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            Active Interventions
          </Link>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active Cohort Learners"
          value={analytics.activeLearnersCount.toLocaleString()}
          subtext="+18% enrollment this semester"
          trend="up"
          color="indigo"
        />
        <MetricCard
          label="Avg. Speaking Practice"
          value={`${analytics.averageSpeakingMinutesPerLearner} min`}
          subtext="Per learner / weekly active average"
          trend="up"
          color="emerald"
        />
        <MetricCard
          label="Grading SLA (<24h)"
          value={`${Math.round((analytics.assignmentSla.gradedWithin24Hours / analytics.assignmentSla.totalSubmitted) * 100)}%`}
          subtext={`Avg turnaround: ${analytics.assignmentSla.averageGradingHours} hours`}
          trend="up"
          color="cyan"
        />
        <MetricCard
          label="Mind AI Grade Acceptance"
          value={`${analytics.assignmentSla.aiSuggestedGradesAcceptedPercent}%`}
          subtext="Instructor alignment rate"
          trend="up"
          color="amber"
        />
      </div>

      {/* CEFR Velocity Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">CEFR Cohort Velocity & Milestone Benchmarks</h2>
            <p className="text-xs text-slate-400">Time-to-proficiency vs international benchmark timelines</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
            ⚡ Accelerating Track
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {analytics.cefrVelocity.map((v, idx) => (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-indigo-400">
                  {v.fromLevel} → {v.toLevel}
                </span>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                  {Math.round(v.completionRate * 100)}% Pass Rate
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Actual Velocity:</span>
                  <span className="font-bold text-white">{v.averageWeeksToComplete} wks</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Standard Benchmark:</span>
                  <span>{v.benchmarkWeeks} wks</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                  style={{ width: `${Math.min(100, (v.benchmarkWeeks / v.averageWeeksToComplete) * 80)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Phonemic Transfer Summary & Early Warning Risk System */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dominican Spanish Phonological Interference Radar */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Dominican Spanish → US English Transfer Radar</h2>
              <p className="text-xs text-slate-400">Classroom-wide detection density across key phonological categories</p>
            </div>
            <Link href="/cohorts" className="text-xs font-semibold text-indigo-400 hover:underline">
              View Matrix →
            </Link>
          </div>

          <div className="space-y-4">
            {analytics.phonemeStruggleMatrix.map((struggle, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-200">
                    {idx + 1}. {struggle.phoneme} ({struggle.ipa}) — {struggle.recommendedIntervention}
                  </span>
                  <span className={`font-bold ${
                    struggle.severity === "high" ? "text-amber-400" : struggle.severity === "moderate" ? "text-cyan-400" : "text-emerald-400"
                  }`}>
                    {Math.round((1 - struggle.averageAccuracy) * 100)}% Interference Rate
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      struggle.severity === "high" ? "bg-amber-500" : struggle.severity === "moderate" ? "bg-cyan-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.round((1 - struggle.averageAccuracy) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-indigo-950/30 border border-indigo-500/20 p-4 text-xs text-indigo-200 flex items-center justify-between">
            <span>
              💡 <strong>Pedagogical Insight:</strong> Regular past <em>-ed</em> morpheme boundary exercises are showing a <strong>34% accuracy boost</strong> in cohorts using the new L1 contrastive practice sessions.
            </span>
          </div>
        </div>

        {/* Right 1 Col: Early Warning Risk Alerts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Early Warning Radar</h2>
            <p className="text-xs text-slate-400">At-risk learners requiring intervention</p>
          </div>

          <div className="space-y-3">
            {analytics.earlyWarningRisks.map((risk, i) => (
              <div key={i} className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{risk.learnerName}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30">
                    Risk {risk.riskScore}/100
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {risk.recommendedAction}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Level: {risk.currentCefr}</span>
                  <span>{risk.daysInactive} days inactive</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/interventions"
            className="block text-center rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-md transition"
          >
            Dispatch Automated Interventions →
          </Link>
        </div>
      </div>
    </div>
  );
}

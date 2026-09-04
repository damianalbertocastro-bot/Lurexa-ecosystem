"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InstitutionalAnalyticsService, type InstitutionalCohortAnalytics } from "@lurexa/backend";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { InsightShell } from "./components/InsightShell";

export default function InsightOverviewPage() {
  const [analytics] = useState<InstitutionalCohortAnalytics>(() =>
    InstitutionalAnalyticsService.getCohortAnalytics("uasd-santo-domingo")
  );

  return (
    <InsightShell active="Overview">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Executive SaaS Hero Header */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  Institutional Intelligence
                </span>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-xs font-semibold text-slate-700">
                  {analytics.organizationName}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  ✓ Core Governed
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Executive CEFR Velocity &amp; Learning Radar
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500 font-normal">
                Longitudinal CEFR progression, Dominican Spanish linguistic transfer metrics, and dropout early-warning telemetry calibrated with Lurexa Mind models.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cohorts"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Phonemic Heatmaps →
              </Link>
              <Link
                href="/interventions"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
              >
                Active Interventions
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Top-Row Metric KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Active Cohort */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <span>👥</span> Active Cohort
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium text-xs px-2.5 py-0.5 rounded-full">
                +18% MoM
              </span>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight my-2">
              {analytics.activeLearnersCount.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 font-normal">Enrolled students in active terms</p>
          </div>

          {/* Card 2: Speaking Velocity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <span>🎙️</span> Speaking Velocity
              </span>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium text-xs px-2.5 py-0.5 rounded-full">
                Active Weekly
              </span>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight my-2">
              {analytics.averageSpeakingMinutesPerLearner} <span className="text-xl font-semibold text-slate-500">min</span>
            </p>
            <p className="text-xs text-slate-500 font-normal">Average weekly spoken practice</p>
          </div>

          {/* Card 3: Grading SLA */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <span>⏱️</span> Grading SLA (&lt;24h)
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium text-xs px-2.5 py-0.5 rounded-full">
                Target Met
              </span>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight my-2">
              {Math.round(
                (analytics.assignmentSla.gradedWithin24Hours /
                  analytics.assignmentSla.totalSubmitted) *
                  100
              )}
              %
            </p>
            <p className="text-xs text-slate-500 font-normal">
              Avg turnaround: {analytics.assignmentSla.averageGradingHours} hours
            </p>
          </div>

          {/* Card 4: Mind AI Grade Alignment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <span>🤖</span> Mind AI Alignment
              </span>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium text-xs px-2.5 py-0.5 rounded-full">
                Verified
              </span>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight my-2">
              {analytics.assignmentSla.aiSuggestedGradesAcceptedPercent}%
            </p>
            <p className="text-xs text-slate-500 font-normal">Instructor review acceptance rate</p>
          </div>
        </section>

        {/* 3. CEFR Milestone Progression & Velocity Benchmarks Card */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                CEFR Milestone Progression &amp; Velocity Benchmarks
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Empirical time-to-proficiency compared against international CEFR duration guidelines
              </p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium text-xs px-3 py-1 rounded-full w-fit">
              ⚡ Accelerated Progression Rate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {analytics.cefrVelocity.map((v, idx) => {
              const passRatePercent = Math.round(v.completionRate * 100);
              const progressWidth = Math.min(
                100,
                Math.round((v.benchmarkWeeks / v.averageWeeksToComplete) * 75)
              );

              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="milestone-title font-semibold text-slate-900 text-sm">
                      {v.fromLevel} → {v.toLevel}
                    </span>
                    <span className="bg-white text-slate-700 border border-slate-200 font-semibold text-xs px-2 py-0.5 rounded shadow-2xs">
                      {passRatePercent}% Pass Rate
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Observed Velocity</span>
                      <span className="font-bold text-slate-900 text-sm">{v.averageWeeksToComplete} weeks</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Standard Benchmark</span>
                      <span className="text-xs font-semibold text-slate-600">{v.benchmarkWeeks} weeks</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Bottom Grid: Phonological Patterns & At-Risk Interventions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card: Top Dominican Phonological Transfer Patterns */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Top Dominican Phonological Transfer Patterns
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acoustic error frequency detected in speaking submissions
                </p>
              </div>
              <Link href="/cohorts" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View Heatmap →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { rule: "Coda /s/ Aspiration / Deletion", error: "48%", impact: "Loss of plural & 3rd-person inflections" },
                { rule: "Initial /s/-cluster Epenthesis", error: "42%", impact: "Vowel insertion before 'sp-', 'st-', 'sk-'" },
                { rule: "Liquid Neutralization (/l/ vs /r/)", error: "31%", impact: "Lateralization in syllable codas" },
                { rule: "Tense vs. Lax Vowel Confusion (/i/ vs /ɪ/)", error: "25%", impact: "Minimal pair distinction (sheep vs ship)" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-slate-900">{item.rule}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.impact}</p>
                  </div>
                  <span className="bg-slate-200/80 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md">
                    {item.error}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: At-Risk Cohort Early Warning Telemetry */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  At-Risk Cohort Early Warning Telemetry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time indicators for learners falling behind pace
                </p>
              </div>
              <Link href="/interventions" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Manage Interventions →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: "Carlos Ramirez",
                  cohort: "Santo Domingo Cohort Alpha",
                  risk: "3 inactive days after failed /s/-cluster quiz",
                  action: "Trigger 5-min Coach Drill",
                  btnClass: "bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm",
                },
                {
                  name: "Maria Santos",
                  cohort: "Santiago Regional ESL-2",
                  risk: "Liquid neutralization blocking A1 capstone",
                  action: "Assign Studio Remediation",
                  btnClass: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors",
                },
                {
                  name: "Yomaira Gomez",
                  cohort: "UASD English Immersion B1",
                  risk: "Speaking practice duration 40% below target",
                  action: "Send Study Reminder",
                  btnClass: "bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2 rounded-lg transition-colors",
                },
              ].map((student, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{student.name}</span>
                      <span className="text-xs text-slate-400 font-normal">({student.cohort})</span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1 font-medium">{student.risk}</p>
                  </div>
                  <Link href="/interventions" className="shrink-0">
                    <button type="button" className={student.btnClass}>
                      {student.action}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </InsightShell>
  );
}

"use client";

import React from "react";
import Link from "next/link";

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
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30">
              Institutional Intelligence
            </span>
            <span className="text-xs text-slate-500">Autonomous Evidence Analytics</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Institutional Learning & Phonemic Radar
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time aggregate diagnostics, Dominican Spanish linguistic transfer metrics, and classroom intervention dispatch.
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
          value="1,420"
          subtext="+18% enrollment this semester"
          trend="up"
          color="indigo"
        />
        <MetricCard
          label="Average Spoken Fluency"
          value="78.4%"
          subtext="Speech onset latency: 340ms avg"
          trend="up"
          color="emerald"
        />
        <MetricCard
          label="Top Transfer Bottleneck"
          value="Coda Weakening"
          subtext="41% of A1-A2 learners affected"
          trend="down"
          color="amber"
        />
        <MetricCard
          label="Resolved Interventions"
          value="94.2%"
          subtext="182 automated assignments dispatched"
          trend="up"
          color="cyan"
        />
      </div>

      {/* Grid: Phonemic Transfer Summary & Quick Cohort Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dominican Spanish Phonological Interference Radar */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Dominican Spanish → US English Transfer Radar</h2>
              <p className="text-xs text-slate-400">Classroom-wide detection density across 6 key phonological categories</p>
            </div>
            <Link href="/cohorts" className="text-xs font-semibold text-indigo-400 hover:underline">
              View Matrix →
            </Link>
          </div>

          <div className="space-y-4">
            {/* Category 1: Final /s/ and Coda Deletion */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-200">1. Coda /s/ and Final Consonant Deletion (/s/, /d/, /t/, /z/)</span>
                <span className="text-amber-400 font-bold">42% Occurrence Rate</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "42%" }} />
              </div>
            </div>

            {/* Category 2: Epenthesis before initial /s/ */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-200">2. Epenthesis before Initial /s/-clusters (e.g. &quot;espeak&quot; for speak)</span>
                <span className="text-indigo-400 font-bold">36% Occurrence Rate</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "36%" }} />
              </div>
            </div>

            {/* Category 3: Liquid Neutralization */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-200">3. Liquid Neutralization (/l/ vs /r/ coda lambdacism)</span>
                <span className="text-cyan-400 font-bold">28% Occurrence Rate</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: "28%" }} />
              </div>
            </div>

            {/* Category 4: Vowel Duration Gap */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-200">4. Vowel Tenseness & Duration Gap (Spanish 5-vowel vs English 12+)</span>
                <span className="text-emerald-400 font-bold">22% Occurrence Rate</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>

            {/* Category 5: 3rd-person singular inflection */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-200">5. 3rd-Person Singular Inflection Drops (-s/-es present tense)</span>
                <span className="text-purple-400 font-bold">19% Occurrence Rate</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "19%" }} />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-indigo-950/30 border border-indigo-500/20 p-4 text-xs text-indigo-200 flex items-center justify-between">
            <span>
              💡 <strong>Pedagogical Insight:</strong> Coda weakening is showing a <strong>32% decline</strong> in cohorts practicing the new B1 Capstone interactive audio drills.
            </span>
          </div>
        </div>

        {/* Right 1 Col: Quick Cohort Health & Milestones */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Active Cohorts</h2>
            <p className="text-xs text-slate-400">Classroom milestone velocity</p>
          </div>

          <div className="space-y-3">
            {[
              { name: "Santo Domingo Cohort Alpha", level: "A1 Foundations", students: 140, health: "Optimal" },
              { name: "Santiago Regional ESL-2", level: "A2 Breakthrough", students: 210, health: "Optimal" },
              { name: "UASD English Immersion B1", level: "B1 Intermediate", students: 320, health: "Review Needed" },
              { name: "Educator PD Cohort T1", level: "Teach Level 1", students: 85, health: "Optimal" },
            ].map((cohort, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-200">{cohort.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    cohort.health === "Optimal"
                      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                  }`}>
                    {cohort.health}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{cohort.level}</span>
                  <span>{cohort.students} learners</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/interventions"
            className="block text-center rounded-lg border border-slate-800 bg-slate-950 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            Launch Targeted Remediation →
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";

export default function ReportsPage() {
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
            <span className="text-xs text-slate-400">Milestone Reports</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            CEFR Growth &amp; Institutional Milestone Reports
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Exportable longitudinal reports for accreditation, institutional stakeholders, and academic leadership.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Q3 2026 Institutional CEFR Growth Audit",
            description: "Full longitudinal progression tracking across A1, A2, and B1 cohorts with speaking onset gain analysis.",
            date: "August 2026",
            format: "PDF / CSV",
          },
          {
            title: "Dominican Spanish Phonological Remediation Study",
            description: "Evidence correlation between Lurexa Coach voice practice and reduction in coda /s/-weakening.",
            date: "August 2026",
            format: "PDF / JSON",
          },
          {
            title: "Educator PD Milestone & T1-T5 Certification Census",
            description: "Teacher development hours, classroom observation ratings, and credential verification metrics.",
            date: "July 2026",
            format: "PDF",
          },
          {
            title: "Multi-Modal Diagnostic & Placement Calibration Log",
            description: "Diagnostic accuracy validation across 1,200+ initial learner placement assessments.",
            date: "June 2026",
            format: "CSV / Parquet",
          },
        ].map((report, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{report.date}</span>
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-mono font-bold text-indigo-400 ring-1 ring-indigo-500/20">
                {report.format}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{report.title}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{report.description}</p>
            </div>
            <button
              onClick={() => alert(`Downloading ${report.title}...`)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
            >
              Export Report Data ↓
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

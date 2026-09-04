"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { InsightShell } from "../components/InsightShell";

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloading(title);
    setTimeout(() => {
      setDownloading(null);
      alert(`Report generated: "${title}" is ready for download.`);
    }, 1000);
  };

  return (
    <InsightShell active="Milestone Reports">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                ← Overview
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500 font-medium">Milestone Reports</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              CEFR Growth &amp; Institutional Milestone Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Exportable longitudinal reports for accreditation, institutional stakeholders, and academic leadership.
            </p>
          </div>
        </section>

        {/* Reports Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Q3 2026 Institutional CEFR Growth Audit",
              description:
                "Full longitudinal progression tracking across A1, A2, and B1 cohorts with speaking onset gain analysis.",
              date: "August 2026",
              format: "PDF / CSV",
            },
            {
              title: "Dominican Spanish Phonological Remediation Study",
              description:
                "Evidence correlation between Lurexa Coach voice practice and reduction in coda /s/-weakening.",
              date: "August 2026",
              format: "PDF / JSON",
            },
            {
              title: "Educator PD Milestone & T1-T5 Certification Census",
              description:
                "Teacher development hours, classroom observation ratings, and credential verification metrics.",
              date: "July 2026",
              format: "PDF",
            },
            {
              title: "Multi-Modal Diagnostic & Placement Calibration Log",
              description:
                "Diagnostic accuracy validation across 1,200+ initial learner placement assessments.",
              date: "June 2026",
              format: "CSV / Parquet",
            },
          ].map((report, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{report.date}</span>
                <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full">
                  {report.format}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{report.description}</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleDownload(report.title)}
                  disabled={downloading === report.title}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  {downloading === report.title ? "Generating Data..." : "Export Report Data ↓"}
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </InsightShell>
  );
}

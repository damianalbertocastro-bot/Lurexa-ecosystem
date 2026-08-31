"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
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
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-bold text-[var(--lx-secondary)] hover:underline">
                ← Overview
              </Link>
              <span className="text-[var(--lx-muted)]">/</span>
              <span className="text-xs text-[var(--lx-muted)]">Milestone Reports</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              CEFR Growth &amp; Institutional Milestone Reports
            </h1>
            <p className="text-xs sm:text-sm text-[var(--lx-muted)]">
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
            <Card
              key={i}
              className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-secondary)] transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--lx-muted)]">{report.date}</span>
                <Badge variant="info" className="text-[10px] font-mono font-bold">
                  {report.format}
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--lx-ink)]">{report.title}</h3>
                <p className="mt-1 text-xs text-[var(--lx-muted)] leading-relaxed">{report.description}</p>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  onClick={() => handleDownload(report.title)}
                  disabled={downloading === report.title}
                  className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 py-2 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)]"
                >
                  {downloading === report.title ? "Generating Data..." : "Export Report Data ↓"}
                </Button>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </InsightShell>
  );
}

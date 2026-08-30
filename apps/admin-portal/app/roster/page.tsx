"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { Card } from "@lurexa/ui/card";
import { Button } from "@lurexa/ui/button";
import { Badge } from "@lurexa/ui/Badge";
import {
  RosterImportService,
  type RosterStudentEntry,
  type RosterImportBatchResult,
} from "@lurexa/backend";

const SAMPLE_CSV = `Full Name,Email,Class,Target CEFR,L1 Profile
Juan Perez,juan.perez@dominicanschool.edu,Morning A1 Cohort,A1,es-DO
Maria Santos,maria.santos@dominicanschool.edu,Morning A1 Cohort,A1,es-DO
Carlos Diaz,carlos.diaz@dominicanschool.edu,Evening A2 Intensive,A2,es-DO
Ana Gomez,ana.gomez@dominicanschool.edu,Business English B1,B1,es-DO
Luis Rodriguez,luis.rodriguez@dominicanschool.edu,Executive C1 Defense,C1,es-DO`;

export default function AdminRosterPage() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [parsedEntries, setParsedEntries] = useState<RosterStudentEntry[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<RosterImportBatchResult | null>(null);
  const [importing, setImporting] = useState(false);

  const handleParse = () => {
    const { entries, errors } = RosterImportService.parseCSV(csvText);
    setParsedEntries(entries);
    setParseErrors(errors);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (parsedEntries.length === 0) return;
    setImporting(true);
    try {
      const result = await RosterImportService.importRoster(
        { uid: "admin-super", id: "admin-super", email: "admin@lurexa.org" } as never,
        "org-demo",
        parsedEntries
      );
      setImportResult(result);
    } catch (err) {
      setParseErrors([err instanceof Error ? err.message : "Roster import failed."]);
    } finally {
      setImporting(false);
    }
  };

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
                className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white"
              >
                Roster Sync
              </Link>
              <Link
                href="/analytics/phonetics"
                className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 transition hover:bg-white/10 hover:text-white"
              >
                Phonetics &amp; Speaking
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
            </div>
          </header>

          <div className="mt-10 max-w-3xl pb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lx-accent)]/40 bg-[var(--lx-accent)]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[.18em] text-[var(--lx-accent)]">
              <span>👥 Multi-Tenant Institutional Onboarding</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-5xl">
              Bulk Student Roster Sync
            </h1>
            <p className="mt-3 text-sm leading-6 text-indigo-100">
              Import and auto-provision classroom cohorts, default CEFR starting placements, and L1 transfer profiles for school partners.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* CSV Input Card */}
          <Card title="CSV Roster Input" subtitle="Paste CSV data or load standard template">
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4 font-mono text-xs text-[var(--lx-ink)] outline-none focus:border-[var(--lx-primary)]"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button variant="secondary" onClick={() => setCsvText(SAMPLE_CSV)}>
                Reset to Sample Template
              </Button>
              <Button variant="primary" onClick={handleParse}>
                Validate &amp; Preview Roster →
              </Button>
            </div>

            {parseErrors.length > 0 && (
              <div className="mt-4 rounded-xl bg-[var(--lx-destructive-surface)] border border-[var(--lx-destructive)]/30 p-3 text-xs text-[var(--lx-destructive)]">
                <p className="font-bold mb-1">Validation Issues Found:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {parseErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Import Summary Card */}
          <Card title="Roster Batch Actions" subtitle="Provision accounts into active tenant">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold border-b border-[var(--lx-border)] pb-3">
                <span className="text-[var(--lx-muted)]">Validated Records:</span>
                <span className="text-base text-[var(--lx-ink)]">{parsedEntries.length} Students</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold border-b border-[var(--lx-border)] pb-3">
                <span className="text-[var(--lx-muted)]">Target Institution:</span>
                <span className="text-[var(--lx-primary)]">Dominican Language Institute (org-demo)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold border-b border-[var(--lx-border)] pb-3">
                <span className="text-[var(--lx-muted)]">Single Learner Model Sync:</span>
                <span className="text-[var(--lx-success)]">✓ Enabled across Learn &amp; Coach</span>
              </div>

              <Button
                variant="primary"
                className="w-full mt-2"
                disabled={parsedEntries.length === 0 || importing}
                onClick={() => void handleImport()}
              >
                {importing ? "Provisioning Accounts…" : `Execute Import (${parsedEntries.length} Students)`}
              </Button>

              {importResult && (
                <div className="rounded-2xl bg-[var(--lx-success-surface)] border border-[var(--lx-success)]/30 p-4 text-xs text-[var(--lx-success)] mt-4">
                  <p className="font-bold text-sm">🎉 Batch Import Successful!</p>
                  <p className="mt-1">
                    Successfully provisioned <strong>{importResult.importedCount}</strong> student accounts with classroom group bindings.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Parsed Preview Table */}
        {parsedEntries.length > 0 && (
          <section className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-primary)]">PREVIEW TABLE</p>
                <h2 className="text-lg font-bold text-[var(--lx-ink)]">Validated Learner Accounts</h2>
              </div>
              <Badge variant="success">{parsedEntries.length} Ready</Badge>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--lx-border)]">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="sticky top-0 z-10 border-b border-[var(--lx-border)] bg-[var(--lx-canvas)]/95 backdrop-blur-md shadow-xs text-[10px] font-black uppercase tracking-[.13em] text-[var(--lx-muted)]">
                  <tr>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Class Cohort</th>
                    <th className="px-4 py-3">CEFR Target</th>
                    <th className="px-4 py-3">L1 Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--lx-border)] bg-[var(--lx-surface)]">
                  {parsedEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-[var(--lx-canvas)] transition-colors">
                      <td className="px-4 py-3 font-bold text-[var(--lx-ink)]">{entry.fullName}</td>
                      <td className="px-4 py-3 text-[var(--lx-muted)]">{entry.email}</td>
                      <td className="px-4 py-3 font-semibold text-[var(--lx-ink)]">{entry.className}</td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{entry.targetCefr}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--lx-muted)]">{entry.l1Profile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

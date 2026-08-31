"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import { InsightShell } from "../components/InsightShell";

interface Intervention {
  id: string;
  studentName: string;
  cohort: string;
  detectedPattern: string;
  severity: "high" | "medium" | "low";
  suggestedAction: string;
  dispatched: boolean;
}

const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: "INT-801",
    studentName: "Carlos Ramirez",
    cohort: "Santo Domingo Cohort Alpha",
    detectedPattern: "Coda /s/ Deletion in Work Contexts",
    severity: "high",
    suggestedAction: "Assign 5-min Coach drill: 'Workplace Final Consonants'",
    dispatched: false,
  },
  {
    id: "INT-802",
    studentName: "Maria Santos",
    cohort: "Santiago Regional ESL-2",
    detectedPattern: "Initial /s/-cluster epenthesis ('estudent')",
    severity: "high",
    suggestedAction: "Assign Studio Knowledge Object: 'Dominican /s/-cluster mastery'",
    dispatched: false,
  },
  {
    id: "INT-803",
    studentName: "Alejandro Diaz",
    cohort: "Santo Domingo Cohort Alpha",
    detectedPattern: "Liquid Neutralization (/l/ in 'always')",
    severity: "medium",
    suggestedAction: "Trigger Capstone phonemic review card in Learn Web",
    dispatched: true,
  },
  {
    id: "INT-804",
    studentName: "Yomaira Gomez",
    cohort: "UASD English Immersion B1",
    detectedPattern: "3rd-person inflection drops in monologue",
    severity: "medium",
    suggestedAction: "Dispatch B1 dialogue simulation in Coach Web",
    dispatched: false,
  },
];

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>(INITIAL_INTERVENTIONS);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const dispatchIntervention = (id: string) => {
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dispatched: true } : item))
    );
    setStatusMessage(`Intervention ${id} successfully dispatched to student and teacher workspace.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const dispatchAll = () => {
    setInterventions((prev) => prev.map((item) => ({ ...item, dispatched: true })));
    setStatusMessage("All pending interventions dispatched via Lurexa Core message bus.");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <InsightShell active="Intervention Routing">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-bold text-[var(--lx-secondary)] hover:underline">
                ← Overview
              </Link>
              <span className="text-[var(--lx-muted)]">/</span>
              <span className="text-xs text-[var(--lx-muted)]">Intervention Routing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              Automated Instructional Interventions
            </h1>
            <p className="text-xs sm:text-sm text-[var(--lx-muted)]">
              Real-time pedagogical intervention triggers connecting Mind diagnostics with Learn &amp; Coach assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={dispatchAll}
              className="rounded-xl bg-[var(--lx-primary)] px-4 py-2 text-xs font-black text-white shadow-xs hover:opacity-95 transition"
            >
              Dispatch All Pending
            </Button>
          </div>
        </section>

        {statusMessage && (
          <div className="animate-spring-pop rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-4 text-xs font-bold text-[var(--lx-secondary)] shadow-sm">
            ✓ {statusMessage}
          </div>
        )}

        {/* Interventions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interventions.map((item) => (
            <Card
              key={item.id}
              className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-secondary)] transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--lx-muted)]">{item.id}</span>
                  <Badge
                    variant={item.severity === "high" ? "warning" : "info"}
                    className="text-[10px] font-bold uppercase"
                  >
                    {item.severity} severity
                  </Badge>
                </div>
                {item.dispatched ? (
                  <Badge variant="success" className="text-[10px]">
                    ✓ Dispatched
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-[10px]">
                    Pending
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--lx-ink)]">{item.studentName}</h3>
                <p className="text-xs text-[var(--lx-muted)]">{item.cohort}</p>
              </div>

              <div className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5 space-y-1 text-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                  Detected Pattern:
                </p>
                <p className="font-semibold text-[var(--lx-ink)]">{item.detectedPattern}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                  Action Recommendation:
                </p>
                <p className="text-[var(--lx-secondary)] font-medium">{item.suggestedAction}</p>
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button
                  disabled={item.dispatched}
                  onClick={() => dispatchIntervention(item.id)}
                  size="sm"
                  className={`rounded-xl text-xs font-bold ${
                    item.dispatched
                      ? "opacity-60"
                      : "bg-[var(--lx-secondary)] text-white hover:opacity-95"
                  }`}
                >
                  {item.dispatched ? "Dispatched" : "Dispatch Intervention →"}
                </Button>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </InsightShell>
  );
}

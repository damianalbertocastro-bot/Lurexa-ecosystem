"use client";

import React, { useState } from "react";
import Link from "next/link";
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
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                ← Overview
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500 font-medium">Intervention Routing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Automated Instructional Interventions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time pedagogical intervention triggers connecting Mind diagnostics with Learn &amp; Coach assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={dispatchAll}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Dispatch All Pending
            </button>
          </div>
        </section>

        {statusMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-sm">
            ✓ {statusMessage}
          </div>
        )}

        {/* Interventions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interventions.map((item) => {
            const isHigh = item.severity === "high";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{item.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        isHigh
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {item.severity} severity
                    </span>
                  </div>
                  {item.dispatched ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ✓ Dispatched
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.studentName}</h3>
                  <p className="text-xs text-slate-500">{item.cohort}</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1 text-xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Detected Pattern:
                  </p>
                  <p className="font-semibold text-slate-800">{item.detectedPattern}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Action Recommendation:
                  </p>
                  <p className="text-indigo-700 font-medium">{item.suggestedAction}</p>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    disabled={item.dispatched}
                    onClick={() => dispatchIntervention(item.id)}
                    className={`rounded-lg text-xs font-semibold px-4 py-2 transition-colors ${
                      item.dispatched
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    {item.dispatched ? "Dispatched" : "Dispatch Intervention →"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </InsightShell>
  );
}

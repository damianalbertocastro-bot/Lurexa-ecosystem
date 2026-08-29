"use client";

import React, { useState } from "react";
import Link from "next/link";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs font-bold text-indigo-400 hover:underline">
              ← Overview
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">Intervention Routing</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Automated Instructional Interventions
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time pedagogical intervention triggers connecting Mind diagnostics with Learn &amp; Coach assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={dispatchAll}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-indigo-500 transition"
          >
            Dispatch All Pending
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-4 text-xs font-semibold text-emerald-300">
          ✓ {statusMessage}
        </div>
      )}

      {/* Interventions List */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="divide-y divide-slate-800">
          {interventions.map((item) => (
            <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    item.severity === "high"
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {item.severity} Priority
                  </span>
                  <span className="text-xs text-slate-400">• {item.cohort}</span>
                </div>
                <p className="text-sm font-bold text-white">{item.studentName}</p>
                <p className="text-xs text-slate-300">
                  <span className="text-slate-500">Trigger:</span> {item.detectedPattern}
                </p>
                <p className="text-xs text-indigo-400 font-medium">
                  <span className="text-slate-500">Action:</span> {item.suggestedAction}
                </p>
              </div>

              <div>
                {item.dispatched ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                    ✓ Dispatched
                  </span>
                ) : (
                  <button
                    onClick={() => dispatchIntervention(item.id)}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-100 transition"
                  >
                    Dispatch Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

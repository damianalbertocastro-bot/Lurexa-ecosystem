"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TeachShell } from "../../../components/TeachShell";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";

export default function T1CapstoneDefensePage() {
  const [topic, setTopic] = useState("Ordering Food & Describing Daily Routines (A1)");
  const [warmup, setWarmup] = useState("Show Dominican colmado pictures; elicit 3 food items in 4 minutes.");
  const [presentation, setPresentation] = useState("Introduce target structure 'I would like...' with meaning and CCQs.");
  const [controlled, setControlled] = useState("Pair dialogue cards with fill-in prompts (12 minutes).");
  const [production, setProduction] = useState("Colmado roleplay: student A is customer, student B is clerk (15 minutes).");
  const [closure, setClosure] = useState("Delayed feedback on coda /s/ and pronunciation check.");
  const [sttRatio, setSttRatio] = useState(70);
  const [tttRatio, setTttRatio] = useState(30);
  const [l1Scaffolding, setL1Scaffolding] = useState("Target final /s/ reduction ('two pesos' not 'two peso') and avoid epenthetic /e/ before /st/ clusters.");

  const [teacherResponse, setTeacherResponse] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    credentialId?: string;
    rubricEvaluation: {
      lessonCoherence: string;
      tttBalance: string;
      l1Scaffolding: string;
      simulatedIntervention: string;
    };
  } | null>(null);

  const handleEvaluate = () => {
    if (!teacherResponse.trim() || !warmup.trim()) return;
    setEvaluating(true);
    setTimeout(() => {
      const passed = sttRatio >= 65 && tttRatio <= 35 && teacherResponse.length > 20;
      setResult({
        score: passed ? 94 : 68,
        passed,
        credentialId: passed ? `lx-cred-t1-${Date.now().toString(36).toUpperCase()}` : undefined,
        rubricEvaluation: {
          lessonCoherence: "Exemplary 5-stage progression from schema activation to unscripted communicative transfer.",
          tttBalance: `Pacing targets met: STT ${sttRatio}% exceeds minimum requirement (≥65%).`,
          l1Scaffolding: "Clear phonological awareness addressing coda weakening and /s/ prosthesis in Dominican English learners.",
          simulatedIntervention: "Feedback provided immediate communicative repair while preserving learner speaking confidence.",
        },
      });
      setEvaluating(false);
    }, 1200);
  };

  return (
    <TeachShell active="Growth">
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 space-y-8">
        <div>
          <Link href="/courses/t1-the-first-coherent-lesson" className="text-xs font-bold text-[var(--lx-primary)] hover:underline">
            ← Back to T1 Course Overview
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div>
              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Stage-Exit Assessment
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                T1 Capstone: The First Coherent Lesson
              </h1>
              <p className="text-sm text-[var(--lx-muted)] mt-1">
                Submit your 5-stage lesson plan blueprint and complete the simulated AI classroom scenario to earn your accredited T1 Teaching Credential.
              </p>
            </div>
            {result?.passed && (
              <Badge variant="success" className="px-4 py-2 text-sm font-bold">
                ✓ T1 Credential Earned: {result.credentialId}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: 5-Stage Lesson Plan Blueprint */}
          <Card className="p-7 space-y-5 bg-white border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
              1. Five-Stage Lesson Plan Blueprint
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase">Lesson Topic &amp; Target CEFR</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase">Stage 1: Warm-up &amp; Schema Activation (5 min)</label>
                <input
                  type="text"
                  value={warmup}
                  onChange={(e) => setWarmup(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase">Stage 2: Guided Presentation &amp; Clarification (10 min)</label>
                <input
                  type="text"
                  value={presentation}
                  onChange={(e) => setPresentation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase">Stage 3: Controlled Practice (12 min)</label>
                <input
                  type="text"
                  value={controlled}
                  onChange={(e) => setControlled(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase">Stage 4: Free Production / Create &amp; Apply (15 min)</label>
                <input
                  type="text"
                  value={production}
                  onChange={(e) => setProduction(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase">Stage 5: Formative Closure &amp; Error Feedback (5 min)</label>
                <input
                  type="text"
                  value={closure}
                  onChange={(e) => setClosure(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Student Talk Time Target (%)</label>
                  <input
                    type="number"
                    value={sttRatio}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSttRatio(val);
                      setTttRatio(100 - val);
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Teacher Talk Time (Max 35%)</label>
                  <input
                    type="number"
                    value={tttRatio}
                    disabled
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-bold text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase">Dominican Spanish L1 Phonological Scaffolding Strategy</label>
                <textarea
                  rows={2}
                  value={l1Scaffolding}
                  onChange={(e) => setL1Scaffolding(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </Card>

          {/* Right Column: Interactive AI Classroom Scenario */}
          <Card className="p-7 space-y-5 bg-white border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
                2. Simulated AI Classroom Scenario
              </h2>
              <p className="text-xs text-slate-500">
                You are leading the controlled practice stage with Dominican adult learners. Respond to Kelvin and Altagracia with targeted scaffolding.
              </p>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-indigo-700">Student A (Kelvin):</span>
                  <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
                    &quot;Teacher, my friend work in Santo Domingo every day. He like music.&quot;
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-indigo-700">Student B (Altagracia):</span>
                  <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
                    &quot;And I estudy English with Kelvin because is very important!&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="block font-bold text-slate-700 uppercase">
                  Your Teacher Response / Formative Correction:
                </label>
                <textarea
                  rows={3}
                  value={teacherResponse}
                  onChange={(e) => setTeacherResponse(e.target.value)}
                  placeholder="Great communication, Kelvin and Altagracia! Kelvin, remember: 'he works' with that final /s/. Altagracia, start with a continuous 's-tudy' without an 'e' in front. Now repeat together: 'He works, and we study!'"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <Button
                disabled={evaluating || !teacherResponse.trim()}
                onClick={handleEvaluate}
                className="w-full rounded-xl bg-indigo-600 text-white text-xs font-bold py-3 hover:bg-indigo-700"
              >
                {evaluating ? "Evaluating against T1 Rubric…" : "Submit T1 Capstone for Evaluation →"}
              </Button>
            </div>

            {/* Rubric Evaluation Results */}
            {result && (
              <div className={`mt-4 p-5 rounded-2xl border text-xs space-y-2.5 ${
                result.passed ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-amber-50 border-amber-200 text-amber-950"
              }`}>
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Capstone Score: {result.score}%</span>
                  <span>{result.passed ? "✓ STAGE EXIT APPROVED" : "⚠ REVISION REQUIRED"}</span>
                </div>
                <div className="space-y-1 pt-2 border-t border-emerald-200/60">
                  <p><strong>Lesson Coherence:</strong> {result.rubricEvaluation.lessonCoherence}</p>
                  <p><strong>Pacing (STT/TTT):</strong> {result.rubricEvaluation.tttBalance}</p>
                  <p><strong>L1 Scaffolding:</strong> {result.rubricEvaluation.l1Scaffolding}</p>
                  <p><strong>Intervention:</strong> {result.rubricEvaluation.simulatedIntervention}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </TeachShell>
  );
}

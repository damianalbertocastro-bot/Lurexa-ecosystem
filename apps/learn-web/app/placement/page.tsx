"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

type PlacementSkill = "listening" | "grammar" | "vocabulary" | "reading" | "phonetics";

interface PlacementProbeItem {
  id: string;
  cefr: CefrLevel;
  skill: PlacementSkill;
  title: string;
  prompt: string;
  contextText?: string;
  audioPrompt?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  focusArea: string;
}

interface PlacementDiagnosticResult {
  estimatedLevel: CefrLevel;
  confidence: "low" | "medium" | "high";
  recommendedCourseId: string;
  recommendedLessonId: string;
  recommendedStartingPoint: string;
  overallScorePercent: number;
  skillBreakdown: Record<PlacementSkill, { score: number; maxScore: number; level: CefrLevel }>;
  priorityReinforcements: string[];
  rationale: string;
}

const skillConfig: Record<PlacementSkill, { label: string; icon: string; badgeColor: string }> = {
  listening: { label: "Listening Comprehension", icon: "🎧", badgeColor: "bg-sky-50 text-sky-800 border-sky-200" },
  grammar: { label: "Grammar & Structure", icon: "🧩", badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  vocabulary: { label: "Vocabulary in Context", icon: "📚", badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  reading: { label: "Reading & Discourse", icon: "📖", badgeColor: "bg-violet-50 text-violet-800 border-violet-200" },
  phonetics: { label: "Phonetics & Pronunciation", icon: "🗣️", badgeColor: "bg-amber-50 text-amber-800 border-amber-200" },
};

export default function PlacementPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [stage, setStage] = useState<"intro" | "testing" | "evaluating" | "results">("intro");
  const [goal, setGoal] = useState<string>("daily_life");
  const [items, setItems] = useState<PlacementProbeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlacementDiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged((user) => {
      if (!user) {
        router.push("/login?returnUrl=/placement");
      } else {
        setAuthReady(true);
      }
    });
    return unsubscribe;
  }, [router]);

  async function startPlacement() {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/learning/placement");
      const data = (await response.json()) as { probes?: PlacementProbeItem[]; error?: string };
      if (!response.ok || !data.probes?.length) {
        throw new Error(data.error ?? "Unable to initialize placement probes.");
      }
      setItems(data.probes);
      setCurrentIndex(0);
      setAnswers({});
      setSelectedOption(null);
      setStage("testing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load placement test.");
    } finally {
      setLoading(false);
    }
  }

  function playAudioPrompt(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onstart = () => setAudioPlaying(true);
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  async function handleNextQuestion() {
    if (!selectedOption) return;
    const currentItem = items[currentIndex];
    if (!currentItem) return;

    const updatedAnswers = { ...answers, [currentItem.id]: selectedOption };
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    // If there are more items currently loaded in this batch, advance
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // Otherwise check adaptive escalation
    setLoading(true);
    try {
      const adaptiveResponse = await authenticatedFetch("/api/learning/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "adaptiveNext", answers: updatedAnswers }),
      });
      const adaptiveData = (await adaptiveResponse.json()) as {
        completed: boolean;
        nextItems: PlacementProbeItem[];
      };

      if (!adaptiveData.completed && adaptiveData.nextItems?.length > 0) {
        // Escalate with higher-level diagnostic items
        setItems((prev) => [...prev, ...adaptiveData.nextItems]);
        setCurrentIndex((prev) => prev + 1);
        setLoading(false);
        return;
      }

      // Finish and finalize placement
      setStage("evaluating");
      const submitResponse = await authenticatedFetch("/api/learning/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submitPlacement", answers: updatedAnswers, goal }),
      });
      const finalResult = (await submitResponse.json()) as PlacementDiagnosticResult & { error?: string };
      if (!submitResponse.ok || !finalResult.estimatedLevel) {
        throw new Error(finalResult.error ?? "Placement evaluation failed.");
      }
      setResult(finalResult);
      setStage("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error evaluating placement.");
      setStage("testing");
    } finally {
      setLoading(false);
    }
  }

  if (!authReady) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Verifying session…</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const progressPercent = items.length > 0 ? Math.round(((currentIndex + 1) / items.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] pb-16 pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition flex items-center gap-1"
          >
            <span>←</span>
            <span>Dashboard</span>
          </Link>
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-700">
            Lurexa Diagnostic Engine (A1–C1)
          </span>
        </div>

        {/* STAGE 1: INTRO */}
        {stage === "intro" ? (
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              🎯 Adaptive Placement
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Find Your Optimal Starting Level
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Lurexa adapts to what you already know. This short multi-skill diagnostic evaluates your listening, grammar, reading, and pronunciation readiness to place you directly into the most relevant curriculum module.
            </p>

            {/* Communicative Goal Selection */}
            <div className="mt-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Select Your Primary English Goal:
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { id: "daily_life", label: "Daily Life", icon: "💬" },
                  { id: "work", label: "Professional", icon: "💼" },
                  { id: "travel", label: "Travel & Culture", icon: "✈️" },
                  { id: "study", label: "Academic / Exam", icon: "🎓" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                      goal === item.id
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic Feature Callouts */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <span className="text-lg">⚡</span>
                <h3 className="mt-1 text-xs font-bold text-slate-900">Adaptive Routing</h3>
                <p className="mt-1 text-[11px] text-slate-500">Probes escalate or descend based on your answers.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <span className="text-lg">🎧</span>
                <h3 className="mt-1 text-xs font-bold text-slate-900">Multi-Skill Check</h3>
                <p className="mt-1 text-[11px] text-slate-500">Evaluates listening, grammar, and phonetics in context.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <span className="text-lg">📈</span>
                <h3 className="mt-1 text-xs font-bold text-slate-900">Learner Model Synced</h3>
                <p className="mt-1 text-[11px] text-slate-500">Immediately saves your CEFR baseline to Lurexa Core.</p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800" role="alert">
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => void startPlacement()}
                className="rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {loading ? "Starting Assessment…" : "Begin Diagnostic Test →"}
              </button>
              <span className="text-xs text-slate-500">Takes ~4–6 minutes • No penalty for errors</span>
            </div>
          </section>
        ) : null}

        {/* STAGE 2: TESTING */}
        {stage === "testing" && currentItem ? (
          <div className="space-y-6">
            {/* Header & Progress */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 font-bold border ${
                      skillConfig[currentItem.skill].badgeColor
                    }`}
                  >
                    {skillConfig[currentItem.skill].icon} {skillConfig[currentItem.skill].label}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-600">
                    Target: {currentItem.cefr}
                  </span>
                </div>
                <span className="font-bold text-slate-500">
                  Question {currentIndex + 1} of {items.length}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Probe Content Card */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">{currentItem.title}</h2>

              {/* Context Text for Reading */}
              {currentItem.contextText ? (
                <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Passage Context:</p>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                    “{currentItem.contextText}”
                  </p>
                </div>
              ) : null}

              {/* Audio Prompt for Listening */}
              {currentItem.audioPrompt ? (
                <div className="mt-4 rounded-2xl bg-sky-50 border border-sky-200 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-sky-900">Audio Comprehension Sample</p>
                    <p className="text-xs text-sky-700">Listen carefully to the spoken excerpt:</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playAudioPrompt(currentItem.audioPrompt!)}
                    className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-500 transition flex items-center gap-1.5"
                  >
                    <span>{audioPlaying ? "🔊 Playing…" : "▶ Play Audio"}</span>
                  </button>
                </div>
              ) : null}

              {/* Question Prompt */}
              <div className="mt-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4">
                <p className="text-base font-bold text-slate-900">{currentItem.prompt}</p>
              </div>

              {/* Options */}
              <div className="mt-6 grid gap-3" role="radiogroup" aria-label={currentItem.prompt}>
                {currentItem.options.map((option) => {
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedOption(option)}
                      className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected ? <span className="text-xs font-bold text-indigo-600">✓ Selected</span> : null}
                    </button>
                  );
                })}
              </div>

              {/* Next Action */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                <span className="text-xs text-slate-400">Select an answer to proceed.</span>
                <button
                  type="button"
                  disabled={!selectedOption || loading}
                  onClick={() => void handleNextQuestion()}
                  className="rounded-2xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition"
                >
                  {loading
                    ? "Evaluating…"
                    : currentIndex + 1 < items.length
                    ? "Next Question →"
                    : "Finish & Evaluate →"}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {/* STAGE 3: EVALUATING */}
        {stage === "evaluating" ? (
          <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
            <h2 className="mt-6 text-xl font-bold text-slate-950">Synthesizing Diagnostic Model</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Evaluating multi-skill accuracies, mapping CEFR competencies, and recording initial Learner Model baseline in Lurexa Core…
            </p>
          </div>
        ) : null}

        {/* STAGE 4: RESULTS */}
        {stage === "results" && result ? (
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                ✓ Diagnostic Placement Complete
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                Confidence: {result.confidence.toUpperCase()}
              </span>
            </div>

            {/* CEFR Level Hero Badge */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-300">
                  Estimated Proficiency
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-black sm:text-6xl text-white">{result.estimatedLevel}</span>
                  <span className="text-lg font-bold text-slate-300">({result.overallScorePercent}% Mastery)</span>
                </div>
                <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-300">{result.rationale}</p>
              </div>

              <div className="shrink-0 rounded-2xl bg-white/10 border border-white/10 p-4 text-center sm:text-right">
                <p className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Recommended Entry:</p>
                <p className="mt-1 text-sm font-bold text-white max-w-xs">{result.recommendedStartingPoint}</p>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                Multi-Skill Performance Breakdown:
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.entries(result.skillBreakdown) as [PlacementSkill, { score: number; maxScore: number; level: CefrLevel }][]).map(
                  ([skill, data]) => {
                    const pct = data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0;
                    return (
                      <div key={skill} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>{skillConfig[skill].icon}</span>
                            <span>{skillConfig[skill].label}</span>
                          </span>
                          <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 font-bold text-indigo-700">
                            {data.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">{pct}%</span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Priority Focus Areas */}
            {result.priorityReinforcements.length > 0 ? (
              <div className="mt-8 rounded-2xl bg-amber-50/70 border border-amber-200 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                  🎯 Priority Reinforcement Focus Areas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.priorityReinforcements.map((focus) => (
                    <span
                      key={focus}
                      className="rounded-xl bg-white border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-900 shadow-sm"
                    >
                      • {focus}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => router.push(`/learn/${result.recommendedCourseId}/${result.recommendedLessonId}`)}
                className="rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition"
              >
                Start Your Recommended Path →
              </button>
              <Link
                href="/coach"
                className="rounded-2xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Practice Spoken English in Coach 🗣️
              </Link>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-2xl px-5 py-4 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

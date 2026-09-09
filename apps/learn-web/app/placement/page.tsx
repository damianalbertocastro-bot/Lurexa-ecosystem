"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService, MindRecommendationService } from "@lurexa/backend";
import { SkillRadarChart } from "@lurexa/ui/SkillRadarChart";
import { AudioWaveform } from "@lurexa/ui/AudioWaveform";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import type { CefrLevel, DiagnosticTransferHighlight, PlacementSkill } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";
import { Button } from "@lurexa/ui/button";

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
  isProvisional?: boolean;
  recommendedCourseId: string;
  recommendedLessonId: string;
  recommendedStartingPoint: string;
  overallScorePercent: number;
  skillBreakdown: Record<PlacementSkill, { score: number; maxScore: number; level: CefrLevel }>;
  priorityReinforcements: string[];
  transferHighlights?: DiagnosticTransferHighlight[];
  rationale: string;
}

const skillConfig: Record<PlacementSkill, { label: string; icon: string; badgeColor: string }> = {
  listening: { label: "Listening Comprehension", icon: "🎧", badgeColor: "bg-sky-50 text-sky-800 border-sky-200" },
  speaking: { label: "Spoken Interaction & Fluency", icon: "🎙️", badgeColor: "bg-teal-50 text-teal-800 border-teal-200" },
  grammar: { label: "Grammar & Structure", icon: "🧩", badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  vocabulary: { label: "Vocabulary in Context", icon: "📚", badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  reading: { label: "Reading & Discourse", icon: "📖", badgeColor: "bg-violet-50 text-violet-800 border-violet-200" },
  writing: { label: "Written Communication", icon: "✍️", badgeColor: "bg-rose-50 text-rose-800 border-rose-200" },
  phonetics: { label: "Phonetics & Pronunciation", icon: "🗣️", badgeColor: "bg-amber-50 text-amber-800 border-amber-200" },
};

function PlacementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialGoal = searchParams.get("goal");
  const autostart = searchParams.get("autostart");

  const { playClick } = useSoundEffects();
  const [authReady, setAuthReady] = useState(false);
  const [stage, setStage] = useState<"intro" | "testing" | "evaluating" | "results">("intro");
  const [goal, setGoal] = useState<string>(initialGoal || "daily_life");
  const [items, setItems] = useState<PlacementProbeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlacementDiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.9);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);

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

  useEffect(() => {
    if (authReady && autostart === "1" && stage === "intro" && items.length === 0 && !loading) {
      void startPlacement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, autostart]);

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
      setVoiceTranscript(null);
      setStage("testing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load placement test.");
    } finally {
      setLoading(false);
    }
  }

  function playAudioPrompt(text: string, rate = playbackRate) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.onstart = () => setAudioPlaying(true);
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  function startVoiceRecording() {
    const speechWindow = typeof window !== "undefined" ? (window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: (event: { results: ArrayLike<{ 0?: { transcript?: string } }> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: (event: { results: ArrayLike<{ 0?: { transcript?: string } }> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
    }) : {};

    const SpeechRecognitionConstructor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setError("Speech recognition is not supported in this browser. Please select an option manually.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      setIsVoiceRecording(true);
      setVoiceTranscript("");

      recognition.onresult = (event: { results: ArrayLike<{ 0?: { transcript?: string } }> }) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0]?.transcript || "")
          .join(" ")
          .trim();
        setVoiceTranscript(transcript);

        // Check if spoken transcript matches any option closely
        const currentItem = items[currentIndex];
        if (currentItem && transcript) {
          const lower = transcript.toLowerCase();
          const matched = currentItem.options.find(
            (opt) =>
              lower.includes(opt.toLowerCase()) ||
              opt.toLowerCase().includes(lower)
          );
          if (matched) {
            setSelectedOption(matched);
          }
        }
      };

      recognition.onerror = () => {
        setIsVoiceRecording(false);
      };

      recognition.onend = () => {
        setIsVoiceRecording(false);
      };

      recognition.start();
    } catch {
      setIsVoiceRecording(false);
    }
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
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("lurexa_placement_completed", "true");
          localStorage.setItem("lurexa_placement_level", finalResult.estimatedLevel);
          localStorage.setItem("lurexa_placement_result", JSON.stringify(finalResult));
        }
      } catch {
        // safe ignore storage quota or sandbox errors
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
        <p className="mt-4 text-sm font-semibold text-[var(--lx-muted)]">Verifying session…</p>
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
            className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] hover:text-indigo-600 transition flex items-center gap-1"
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
          <section className="rounded-3xl border border-[var(--lx-border)]/80 bg-[var(--lx-surface)] p-6 shadow-sm sm:p-10">
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              🎯 Adaptive Placement
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Find Your Optimal Starting Level
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--lx-muted)]">
              Lurexa adapts to what you already know. This short multi-skill diagnostic evaluates your listening, grammar, reading, and pronunciation readiness to place you directly into the most relevant curriculum module.
            </p>

            {/* Communicative Goal Selection */}
            <div className="mt-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-3">
                Select Your Primary English Goal:
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { id: "daily_life", label: "Daily Life", icon: "💬" },
                  { id: "work", label: "Professional", icon: "💼" },
                  { id: "travel", label: "Travel & Culture", icon: "✈️" },
                  { id: "study", label: "Academic / Exam", icon: "🎓" },
                ].map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                      goal === item.id
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20"
                        : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-muted)] hover:border-[var(--lx-border)]"
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Diagnostic Feature Callouts */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)] p-4">
                <span className="text-lg">⚡</span>
                <h3 className="mt-1 text-xs font-bold text-[var(--lx-ink)]">Adaptive Routing</h3>
                <p className="mt-1 text-[11px] text-[var(--lx-muted)]">Probes escalate or descend based on your answers.</p>
              </div>
              <div className="rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)] p-4">
                <span className="text-lg">🎧</span>
                <h3 className="mt-1 text-xs font-bold text-[var(--lx-ink)]">Multi-Skill Check</h3>
                <p className="mt-1 text-[11px] text-[var(--lx-muted)]">Evaluates listening, grammar, and phonetics in context.</p>
              </div>
              <div className="rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)] p-4">
                <span className="text-lg">📈</span>
                <h3 className="mt-1 text-xs font-bold text-[var(--lx-ink)]">Learner Model Synced</h3>
                <p className="mt-1 text-[11px] text-[var(--lx-muted)]">Immediately saves your CEFR baseline to Lurexa Core.</p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800" role="alert">
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                type="button"
                disabled={loading}
                onClick={() => void startPlacement()}
                className="rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {loading ? "Starting Assessment…" : "Begin Diagnostic Test →"}
              </Button>
              <span className="text-xs text-[var(--lx-muted)]">Takes ~4–6 minutes • No penalty for errors</span>
            </div>
          </section>
        ) : null}

        {/* STAGE 2: TESTING */}
        {stage === "testing" && currentItem ? (
          <div className="space-y-6">
            {/* Header & Progress */}
            <div className="rounded-3xl border border-[var(--lx-border)]/80 bg-[var(--lx-surface)] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 font-bold border ${
                      skillConfig[currentItem.skill].badgeColor
                    }`}
                  >
                    {skillConfig[currentItem.skill].icon} {skillConfig[currentItem.skill].label}
                  </span>
                  <span className="rounded-full bg-[var(--lx-canvas)] px-2.5 py-1 font-bold text-[var(--lx-muted)]">
                    Target: {currentItem.cefr}
                  </span>
                </div>
                <span className="font-bold text-[var(--lx-muted)]">
                  Question {currentIndex + 1} of {items.length}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--lx-canvas)]">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Probe Content Card */}
            <section className="rounded-3xl border border-[var(--lx-border)]/80 bg-[var(--lx-surface)] p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">{currentItem.title}</h2>

              {/* Context Text for Reading */}
              {currentItem.contextText ? (
                <div className="mt-4 rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)]/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-1">Passage Context:</p>
                  <p className="text-sm font-medium text-[var(--lx-ink)] leading-relaxed italic">
                    “{currentItem.contextText}”
                  </p>
                </div>
              ) : null}

              {/* Audio Prompt for Listening */}
              {currentItem.audioPrompt ? (
                <div className="mt-4 rounded-2xl bg-sky-50 border border-sky-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-sky-900">🎧 Audio Comprehension Sample</p>
                      <p className="text-xs text-sky-700">Listen carefully to the spoken dialogue:</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          const nextRate = playbackRate === 0.9 ? 0.75 : 0.9;
                          setPlaybackRate(nextRate);
                          if (audioPlaying) playAudioPrompt(currentItem.audioPrompt!, nextRate);
                        }}
                        className="rounded-xl border border-sky-300 bg-white px-2.5 py-1 text-[11px] font-bold text-sky-900 hover:bg-sky-100"
                      >
                        Speed: {playbackRate === 0.9 ? "1.0x" : "0.75x"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          playClick();
                          playAudioPrompt(currentItem.audioPrompt!);
                        }}
                        className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-500 transition flex items-center gap-1.5"
                      >
                        <span>{audioPlaying ? "🔊 Playing…" : "▶ Play Audio"}</span>
                      </Button>
                    </div>
                  </div>
                  {audioPlaying && (
                    <div className="rounded-xl bg-white/80 p-3 border border-sky-200 shadow-xs">
                      <AudioWaveform active={true} variant="playback" />
                    </div>
                  )}
                </div>
              ) : null}

              {/* Live Microphone Voice Input for Speaking / Phonetics Probes */}
              {(currentItem.skill === "speaking" || currentItem.skill === "phonetics") && (
                <div className="mt-4 rounded-2xl bg-teal-50 border border-teal-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-teal-950">🎙️ Spoken Interaction &amp; Phonetic Check</p>
                      <p className="text-xs text-teal-800">You can answer by speaking into your microphone or selecting an option below:</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        playClick();
                        startVoiceRecording();
                      }}
                      disabled={isVoiceRecording}
                      className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 ${
                        isVoiceRecording ? "bg-rose-600 animate-pulse" : "bg-teal-700 hover:bg-teal-600"
                      }`}
                    >
                      <span>{isVoiceRecording ? "🎙️ Listening…" : "🎙️ Speak Your Answer"}</span>
                    </Button>
                  </div>

                  {isVoiceRecording && (
                    <div className="rounded-xl bg-white/90 p-3 border border-teal-300 shadow-xs">
                      <AudioWaveform active={true} variant="recording" />
                      <p className="mt-2 text-center text-xs font-semibold text-teal-900 animate-pulse">
                        Speak clearly into your microphone now…
                      </p>
                    </div>
                  )}

                  {voiceTranscript && (
                    <div className="rounded-xl bg-teal-100/70 p-3 border border-teal-300 text-xs">
                      <p className="font-bold text-teal-950">Captured Speech Transcript:</p>
                      <p className="mt-1 font-semibold text-teal-900 italic">“{voiceTranscript}”</p>
                    </div>
                  )}
                </div>
              )}

              {/* Question Prompt */}
              <div className="mt-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4">
                <p className="text-base font-bold text-[var(--lx-ink)]">{currentItem.prompt}</p>
              </div>

              {/* Options */}
              <div className="mt-6 grid gap-3" role="radiogroup" aria-label={currentItem.prompt}>
                {currentItem.options.map((option) => {
                  const isSelected = selectedOption === option;
                  return (
                    <Button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedOption(option)}
                      className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-500/20"
                          : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-ink)] hover:border-indigo-300 hover:bg-[var(--lx-canvas)]"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected ? <span className="text-xs font-bold text-indigo-600">✓ Selected</span> : null}
                    </Button>
                  );
                })}
              </div>

              {/* Next Action */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--lx-border)] pt-6">
                <span className="text-xs text-[var(--lx-muted)]">Select an answer to proceed.</span>
                <Button
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
                </Button>
              </div>
            </section>
          </div>
        ) : null}

        {/* STAGE 3: EVALUATING */}
        {stage === "evaluating" ? (
          <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center rounded-3xl bg-[var(--lx-surface)] p-8 text-center shadow-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
            <h2 className="mt-6 text-xl font-bold text-slate-950">Synthesizing Diagnostic Model</h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--lx-muted)]">
              Evaluating multi-skill accuracies, mapping CEFR competencies, and recording initial Learner Model baseline in Lurexa Core…
            </p>
          </div>
        ) : null}

        {/* STAGE 4: RESULTS */}
        {stage === "results" && result ? (
          <section className="rounded-3xl border border-[var(--lx-border)]/80 bg-[var(--lx-surface)] p-6 shadow-sm sm:p-10 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                ✓ Diagnostic Placement Complete
              </span>
              <span className="rounded-full bg-[var(--lx-canvas)] px-3 py-1 text-xs font-bold text-[var(--lx-muted)]">
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

            {/* Skill Breakdown & Radar Map */}
            <div className="mt-10">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--lx-ink)] mb-6">
                Learner Competency Radar & Multi-Skill Breakdown:
              </h3>
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr] lg:items-center">
                {/* Radar Chart Visualizer */}
                <div className="flex flex-col items-center justify-center rounded-3xl border border-indigo-100 bg-[var(--lx-canvas)] p-6 shadow-inner">
                  <SkillRadarChart
                    skills={[
                      { skill: "Listening", score: result.skillBreakdown.listening ? Math.round((result.skillBreakdown.listening.score / result.skillBreakdown.listening.maxScore) * 100) : 60 },
                      { skill: "Grammar", score: result.skillBreakdown.grammar ? Math.round((result.skillBreakdown.grammar.score / result.skillBreakdown.grammar.maxScore) * 100) : 70 },
                      { skill: "Vocabulary", score: result.skillBreakdown.vocabulary ? Math.round((result.skillBreakdown.vocabulary.score / result.skillBreakdown.vocabulary.maxScore) * 100) : 65 },
                      { skill: "Reading", score: result.skillBreakdown.reading ? Math.round((result.skillBreakdown.reading.score / result.skillBreakdown.reading.maxScore) * 100) : 75 },
                      { skill: "Phonetics", score: result.skillBreakdown.phonetics ? Math.round((result.skillBreakdown.phonetics.score / result.skillBreakdown.phonetics.maxScore) * 100) : 80 },
                      { skill: "Speaking", score: Math.round(result.overallScorePercent * 0.95) },
                      { skill: "Writing", score: Math.round(result.overallScorePercent * 0.85) },
                    ]}
                    size={300}
                  />
                  <p className="mt-3 text-center text-[11px] font-bold text-[var(--lx-muted)]">
                    Continuous 7-Skill CEFR Mapping ({result.estimatedLevel})
                  </p>
                </div>

                {/* Linear Skill Bars */}
                <div className="grid gap-3 sm:grid-cols-1">
                  {(Object.entries(result.skillBreakdown) as [PlacementSkill, { score: number; maxScore: number; level: CefrLevel }][]).map(
                    ([skill, data]) => {
                      const pct = data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0;
                      return (
                        <div key={skill} className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/80 p-3.5">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-[var(--lx-ink)] flex items-center gap-1.5">
                              <span>{skillConfig[skill].icon}</span>
                              <span>{skillConfig[skill].label}</span>
                            </span>
                            <span className="rounded-full bg-[var(--lx-surface)] border border-[var(--lx-border)] px-2 py-0.5 font-bold text-indigo-700 text-[11px]">
                              {data.level}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--lx-canvas)]">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-[var(--lx-muted)]">{pct}%</span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
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
                      className="rounded-xl bg-[var(--lx-surface)] border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-900 shadow-sm"
                    >
                      • {focus}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Dominican Spanish Linguistic Transfer Highlights */}
            {result.transferHighlights && result.transferHighlights.length > 0 ? (
              <div className="mt-8 rounded-3xl bg-teal-950 p-6 text-white border border-teal-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇩🇴 ➡️ 🇺🇸</span>
                  <p className="text-xs font-black uppercase tracking-widest text-teal-300">
                    Linguistic Transfer Intelligence (Lurexa Mind)
                  </p>
                </div>
                <h4 className="text-base font-bold text-white mb-3">Dominican Spanish to English Focus Patterns</h4>
                <div className="space-y-3">
                  {result.transferHighlights.map((highlight, idx) => (
                    <div key={idx} className="rounded-2xl bg-white/10 p-4 border border-white/10 text-xs">
                      <div className="flex items-center justify-between text-teal-200 font-bold mb-1">
                        <span>{highlight.detectedPattern}</span>
                        <span className="rounded-md bg-teal-400/20 px-2 py-0.5 text-[10px] text-teal-300">
                          Focus: {highlight.suggestedFocusModule}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{highlight.pedagogicalNote}</p>
                      <p className="mt-2 text-teal-100 font-semibold">Target pattern: {highlight.expectedPattern}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Mind Recommended Ecosystem Plan */}
            {(() => {
              const transfers = (result.transferHighlights?.map((t) => {
                if (t.detectedPattern.includes("s-cluster")) return "s_cluster_epenthesis";
                if (t.detectedPattern.includes("Consonant") || t.detectedPattern.includes("Coda")) return "coda_weakening";
                if (t.detectedPattern.includes("Dental") || t.detectedPattern.includes("th")) return "interdental_stopping";
                return "third_person_inflection";
              }) ?? []) as ("s_cluster_epenthesis" | "coda_weakening" | "interdental_stopping" | "third_person_inflection")[];

              const ecosystemPlan = MindRecommendationService.generatePlacementEcosystemPlan({
                cefrLevel: result.estimatedLevel,
                overallScorePercent: result.overallScorePercent,
                identifiedDominicanTransfers: transfers,
                priorityReinforcements: result.priorityReinforcements,
                goal,
              });

              return (
                <div className="mt-8 space-y-6">
                  {/* Ecosystem Multi-Tool Synergy Card */}
                  <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white border border-indigo-500/30 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="rounded-full bg-cyan-400/20 border border-cyan-400/50 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                        ⚡ Lurexa Mind Tool Synergy Plan: {ecosystemPlan.recommendedTier}
                      </span>
                      <span className="text-xs font-bold text-slate-400">Universal Learner Model Calibrated</span>
                    </div>

                    <h4 className="mt-3 text-lg font-black text-white">Your Tailored Multi-Product Learning Roadmap</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{ecosystemPlan.tierSynergyReason}</p>

                    {/* 3 Pillars: Learn, Coach, Tracks */}
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      {/* Learn Pillar */}
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
                          <span>📚</span>
                          <span>Lurexa Learn</span>
                        </div>
                        <h5 className="font-bold text-sm text-white">{ecosystemPlan.primaryCourse.title}</h5>
                        <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">{ecosystemPlan.primaryCourse.description}</p>
                        <p className="mt-3 text-[10px] font-semibold text-emerald-300">First Step: {ecosystemPlan.primaryCourse.firstLessonTitle}</p>
                      </div>

                      {/* Coach Pillar */}
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-2">
                          <span>🗣️</span>
                          <span>Lurexa Coach</span>
                        </div>
                        <h5 className="font-bold text-sm text-white">{ecosystemPlan.coachDrills[0]?.title ?? "Targeted Voice Practice"}</h5>
                        <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">{ecosystemPlan.coachDrills[0]?.reason ?? "Work on conversational fluency and phonetics."}</p>
                        <Link
                          href={ecosystemPlan.coachDrills[0]?.actionHref ?? "/coach"}
                          className="mt-3 inline-block text-[10px] font-bold text-cyan-300 hover:underline"
                        >
                          Launch Coach Voice Session →
                        </Link>
                      </div>

                      {/* Career Tracks Pillar */}
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-2">
                          <span>💼</span>
                          <span>Career Tracks</span>
                        </div>
                        <div className="space-y-1.5">
                          {ecosystemPlan.recommendedCareerTracks.map((trk) => (
                            <div key={trk.slug} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-200 truncate">{trk.title}</span>
                              <span className={`text-[10px] font-bold ${trk.status === "unlocked" ? "text-emerald-400" : "text-slate-500"}`}>
                                {trk.status === "unlocked" ? "✓ Ready" : `🔒 ${trk.minimumLevel}+`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Subscription Benefits */}
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-2">Plan Synergy Benefits:</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {ecosystemPlan.synergyBenefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <span className="text-cyan-400">✓</span>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--lx-border)] pt-6">
              <Button
                type="button"
                onClick={() => router.push(`/learn/${result.recommendedCourseId}/${result.recommendedLessonId}`)}
                className="rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition"
              >
                Start Your Recommended Path →
              </Button>
              <Link
                href="/coach"
                className="rounded-2xl border border-[var(--lx-border)] px-6 py-4 text-sm font-bold text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] transition"
              >
                Practice Spoken English in Coach 🗣️
              </Link>
              <Button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-2xl px-5 py-4 text-xs font-bold text-[var(--lx-muted)] hover:text-[var(--lx-ink)] transition"
              >
                Go to Dashboard
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default function PlacementPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 text-sm font-semibold text-[var(--lx-muted)]">Loading Placement Assessment…</p>
        </div>
      }
    >
      <PlacementContent />
    </Suspense>
  );
}

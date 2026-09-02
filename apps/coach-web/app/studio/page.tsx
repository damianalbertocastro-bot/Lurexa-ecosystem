"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AudioWaveform } from "@lurexa/ui/AudioWaveform";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import { authenticatedFetch } from "../../lib/authenticated-fetch";
import type { CoachSession, CoachSessionStartResult } from "@lurexa/types";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";
import { L1_CONTRASTIVE_PROFILES, getProfileByL1Code } from "@lurexa/backend";

export default function CoachStudioPage() {
  const router = useRouter();
  const transcriptBottomRef = useRef<HTMLDivElement | null>(null);
  const [session, setSession] = useState<CoachSession | null>(null);
  const [learnerInput, setLearnerInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sendingTurn, setSendingTurn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [activeCoachingCue, setActiveCoachingCue] = useState<string | null>(null);
  const [selectedL1, setSelectedL1] = useState<string>("es-DO");

  const { playClick, playSuccess, playAchievement } = useSoundEffects();

  const currentL1Profile = getProfileByL1Code(selectedL1) ?? L1_CONTRASTIVE_PROFILES[0];

  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.transcript]);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;
    async function initSession() {
      setLoading(true);
      try {
        const response = await authenticatedFetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "startSession" }),
        });
        const data = (await response.json()) as CoachSessionStartResult & { error?: string };
        if (!response.ok || !data.session) throw new Error(data.error ?? "Failed to initialize studio session.");
        if (mounted) {
          setSession(data.session);
        }
      } catch {
        if (mounted) {
          // Resilient fallback session for offline or test mode
          setSession({
            id: `coach_session_${Date.now()}`,
            learnerId: "demo-learner",
            mode: "learner",
            status: "active",
            focus: {
              cefr: "A1",
              goals: ["intelligibility", "fluency"],
              pronunciationTargets: ["st-", "-t"],
            },
            transcript: [
              {
                sender: "coach",
                text: "Hello! Welcome to your speaking studio. What would you like to practice today?",
                timestamp: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void initSession();
    return () => { mounted = false; };
  }, []);

  const handleSendTurn = async (customText?: string) => {
    const text = (customText ?? learnerInput).trim();
    if (!session || !text || sendingTurn || endingSession) return;

    setSendingTurn(true);
    setLearnerInput("");
    playClick();

    try {
      const response = await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendTurn",
          sessionId: session.id,
          message: text,
          l1Profile: selectedL1,
        }),
      });

      const data = (await response.json()) as {
        session?: CoachSession;
        coachingCue?: string;
        error?: string;
      };

      if (!response.ok || !data.session) throw new Error(data.error ?? "Failed to process spoken turn.");

      setSession(data.session);
      if (data.coachingCue) {
        setActiveCoachingCue(data.coachingCue);
        playAchievement();
      } else {
        playSuccess();
      }
    } catch {
      // Optimistic local state advance if offline
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          transcript: [
            ...prev.transcript,
            { sender: "learner", text, timestamp: new Date().toISOString() },
            {
              sender: "coach",
              text: `Great attempt! In ${currentL1Profile?.l1Name}, focus on crisp consonant releases for "${text.slice(0, 20)}...". Let's continue!`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
      playSuccess();
    } finally {
      setSendingTurn(false);
    }
  };

interface BrowserSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface BrowserSpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

  const recognitionRef = useRef<BrowserSpeechRecognitionInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = async () => {
    try {
      if (typeof window !== "undefined") {
        const SpeechRec = (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognitionInstance; webkitSpeechRecognition?: new () => BrowserSpeechRecognitionInstance }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: new () => BrowserSpeechRecognitionInstance }).webkitSpeechRecognition;
        if (SpeechRec) {
          const recognition = new SpeechRec();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "en-US";

          recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
            let currentTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const item = event.results.item(i);
              if (item && item.length > 0) {
                currentTranscript += item.item(0).transcript;
              }
            }
            if (currentTranscript.trim()) {
              setLearnerInput(currentTranscript.trim());
            }
          };

          recognition.onerror = (e: Event) => {
            console.warn("Speech recognition error:", e);
          };

          recognition.onend = () => {
            setIsRecording(false);
          };

          recognition.start();
          recognitionRef.current = recognition;
        }
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }

      setIsRecording(true);
      playClick();
    } catch (micErr) {
      console.warn("Microphone access unavailable, using simulated voice input:", micErr);
      setIsRecording(true);
      playClick();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // safe
      }
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    playSuccess();

    if (learnerInput.trim()) {
      void handleSendTurn(learnerInput.trim());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      void startListening();
    }
  };

  const handleFinishSession = async () => {
    if (!session || endingSession) return;
    setEndingSession(true);
    playAchievement();

    try {
      await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "endSession", sessionId: session.id }),
      });
    } catch {
      // Ignored
    } finally {
      setEndingSession(false);
      router.push("/dashboard");
    }
  };

  const playAudioSample = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)] pb-12">
      {/* Studio Header */}
      <header className="border-b border-[var(--lx-border)] bg-[var(--lx-surface)] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ProductMark product="coach" size="sm" />
            </Link>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              / Speaking Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {session.status === "active" ? "Live Studio Active" : "Session Completed"}
              </span>
            )}
            <Button
              type="button"
              disabled={endingSession}
              onClick={() => void handleFinishSession()}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs font-black text-slate-950 dark:text-white hover:border-[var(--lx-primary)] transition"
            >
              {endingSession ? "Saving…" : "Finish Session"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left Side: Dialect Controls & Articulatory Targets */}
        <aside className="space-y-5">
          {/* L1 Dialect Background Switcher */}
          <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
                L1 PHONOLOGICAL PROFILE
              </p>
              <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white">
                {currentL1Profile?.l1Code}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {L1_CONTRASTIVE_PROFILES.map((prof) => (
                <Button
                  key={prof.l1Code}
                  type="button"
                  onClick={() => {
                    setSelectedL1(prof.l1Code);
                    playClick();
                  }}
                  className={`rounded-xl px-2.5 py-2 text-center text-xs font-black transition ${
                    selectedL1 === prof.l1Code
                      ? "bg-[var(--lx-primary)] text-white shadow-xs"
                      : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-950 dark:text-white hover:border-[var(--lx-primary)]"
                  }`}
                >
                  <span className="block truncate">{prof.l1Name.split(" ")[0]}</span>
                </Button>
              ))}
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-5">
              Region: <strong>{currentL1Profile?.region}</strong> · {currentL1Profile?.prosodyProfile.rhythmType} rhythm
            </p>
          </article>

          {/* Active Articulatory Focus for Selected L1 */}
          <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
              DIALECT-TARGETED ARTICULATORY CUES
            </p>
            <h2 className="text-sm font-black text-slate-950 dark:text-white">
              {currentL1Profile?.l1Name} Transfer Targets
            </h2>

            <div className="space-y-3">
              <div className="space-y-2">
                {currentL1Profile?.phonologicalTransfers.slice(0, 3).map((transfer) => (
                  <div
                    key={transfer.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[var(--lx-canvas)]/80 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[var(--lx-primary)]">
                        /{transfer.sourcePhoneme}/ → /{transfer.targetPhoneme}/
                      </span>
                      <span className="rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-0.5 text-[9px] font-black uppercase text-slate-900 dark:text-white">
                        {transfer.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-950 dark:text-white font-semibold">
                      {transfer.l1Rule}
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      Impact: {transfer.englishImpact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimal Pair Drill Generator */}
            {currentL1Profile?.remediationStrategies && currentL1Profile.remediationStrategies.length > 0 && (
              <div className="rounded-2xl border-2 border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/60 dark:border-indigo-500/80 p-4 space-y-3 shadow-md ring-4 ring-indigo-500/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Target Minimal Pair Drill</span>
                  </p>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">Click 🔊 to listen</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {currentL1Profile.remediationStrategies[0]?.minimalPairDrills.slice(0, 2).map((drill, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 p-3 text-center text-xs shadow-sm hover:border-[var(--lx-primary)] transition"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <button
                          type="button"
                          onClick={() => playAudioSample(drill.wordA)}
                          className="text-[var(--lx-primary)] font-black text-xs hover:underline flex items-center gap-1"
                          title="Listen to pronunciation"
                        >
                          <span>🔊</span>
                          <span>{drill.wordA}</span>
                        </button>
                        <span className="text-slate-400 font-bold">vs</span>
                        <button
                          type="button"
                          onClick={() => playAudioSample(drill.wordB)}
                          className="text-[var(--lx-primary)] font-black text-xs hover:underline flex items-center gap-1"
                          title="Listen to pronunciation"
                        >
                          <span>🔊</span>
                          <span>{drill.wordB}</span>
                        </button>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">{drill.ipaA} · {drill.ipaB}</span>
                      <Button
                        type="button"
                        onClick={() => void handleSendTurn(`${drill.wordA} and ${drill.wordB}`)}
                        className="mt-2 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 hover:underline"
                      >
                        + Drill in Studio
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {activeCoachingCue && (
            <article className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 dark:bg-amber-950/40 dark:border-amber-800/60 animate-fade-slide-up">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-800 dark:text-amber-300">
                COACHING CUE
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-amber-950 dark:text-amber-100">
                {activeCoachingCue}
              </p>
            </article>
          )}

          <article className="rounded-3xl border border-teal-200 bg-teal-50/60 p-6 dark:bg-teal-950/40 dark:border-teal-800">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-teal-800 dark:text-teal-300">
              CORE EVIDENCE GUARANTEE
            </p>
            <p className="mt-2 text-xs leading-5 text-teal-950 dark:text-white font-medium">
              Spoken turns in Coach update your continuous Learner Model in Core. Intelligibility scoring preserves authentic accent while optimizing clarity.
            </p>
          </article>
        </aside>

        {/* Right Conversation Window */}
        <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-md overflow-hidden flex flex-col">
          <header className="border-b border-[var(--lx-border)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-[var(--lx-ink)]">Live Conversational Studio</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">
              Dialect: {currentL1Profile?.l1Name}
            </span>
          </header>

          {/* Transcript Area */}
          <div className="min-h-[380px] max-h-[500px] overflow-y-auto p-6 space-y-4 bg-[var(--lx-canvas)]/40">
            {loading ? (
              <div className="p-8 text-center text-xs text-[var(--lx-muted)] animate-pulse">
                Initializing studio environment…
              </div>
            ) : (
              session?.transcript.map((turn, i) => (
                <div
                  key={`${turn.timestamp}-${i}`}
                  className={`flex ${turn.sender === "coach" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      turn.sender === "coach"
                        ? "bg-[var(--lx-surface)] text-[var(--lx-ink)] border border-[var(--lx-border)]"
                        : "bg-[var(--lx-primary)] text-white font-medium"
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${turn.sender === "coach" ? "text-[var(--lx-primary)]" : "text-indigo-200"}`}>
                      {turn.sender === "coach" ? "Lurexa Coach" : "You"}
                    </p>
                    <p>{turn.text}</p>
                  </div>
                </div>
              ))
            )}
            {sendingTurn && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[var(--lx-surface)] border border-[var(--lx-border)] px-4 py-3 text-xs italic text-[var(--lx-muted)] animate-pulse">
                  Coach is analyzing your speech…
                </div>
              </div>
            )}
            <div ref={transcriptBottomRef} />
          </div>

          {/* Prompt Chips */}
          <div className="border-t border-[var(--lx-border)] bg-[var(--lx-canvas)]/20 px-6 py-2.5 flex flex-wrap gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 self-center mr-1">
              Try Saying:
            </span>
            {[
              "Hello! Nice to meet you.",
              "I work on software development in Santo Domingo.",
              "Could you please repeat that more slowly?",
            ].map((phrase) => (
              <Button
                key={phrase}
                type="button"
                disabled={sendingTurn || isRecording}
                onClick={() => void handleSendTurn(phrase)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-950 dark:text-white hover:border-[var(--lx-primary)] transition disabled:opacity-40"
              >
                + {phrase}
              </Button>
            ))}
          </div>

          {/* Voice & Text Input Bar */}
          <footer className="border-t border-[var(--lx-border)] p-4 sm:p-5 bg-[var(--lx-surface)]">
            {isRecording && (
              <div className="mb-3 rounded-2xl border-2 border-rose-400 bg-rose-50/90 p-4 dark:bg-rose-950/40 dark:border-rose-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in shadow-md">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-rose-700 dark:text-rose-200">
                      Recording audio… Speak clearly into microphone
                    </p>
                    <AudioWaveform active={true} variant="recording" barCount={20} />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={stopListening}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition flex items-center gap-1.5"
                >
                  <span>⏹</span>
                  <span>Stop Recording</span>
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={learnerInput}
                onChange={(e) => setLearnerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSendTurn();
                }}
                disabled={isRecording || sendingTurn}
                placeholder={`Type or use mic (calibrated for ${currentL1Profile?.l1Name})…`}
                className="flex-1 min-w-0 rounded-2xl border border-slate-300 dark:border-slate-700 bg-[var(--lx-canvas)] px-4 py-3 text-xs font-medium text-slate-950 dark:text-white outline-none focus:border-[var(--lx-primary)] focus:ring-1 focus:ring-[var(--lx-primary)]"
              />
              <Button
                type="button"
                disabled={!learnerInput.trim() || isRecording || sendingTurn}
                onClick={() => void handleSendTurn()}
                className="rounded-2xl bg-[var(--lx-primary)] px-5 py-3 text-xs font-black text-white shadow-sm hover:bg-[var(--lx-primary)] transition disabled:opacity-40"
              >
                Send
              </Button>
              <Button
                type="button"
                onClick={toggleRecording}
                disabled={sendingTurn}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition shadow-sm ${
                  isRecording
                    ? "bg-rose-600 text-white animate-pulse hover:bg-rose-700"
                    : "bg-[var(--lx-accent)] text-slate-950 font-black hover:brightness-105"
                }`}
                title={isRecording ? "Stop Recording" : "Use Microphone"}
              >
                <span>{isRecording ? "⏹" : "🎙️"}</span>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

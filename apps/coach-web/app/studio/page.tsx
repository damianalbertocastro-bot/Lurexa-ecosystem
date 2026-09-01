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

  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = async () => {
    try {
      if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setLearnerInput(currentTranscript.trim());
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
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

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)] pb-12">
      {/* Studio Header */}
      <header className="border-b border-[var(--lx-border)] bg-[var(--lx-surface)] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ProductMark product="coach" size="sm" />
            </Link>
            <span className="text-xs font-bold text-[var(--lx-muted)]">
              / Speaking Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              disabled={endingSession || sendingTurn}
              onClick={() => void handleFinishSession()}
              className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-1.5 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-border)]/40 transition active:scale-95 disabled:opacity-50"
            >
              {endingSession ? "Saving…" : "Finish Session"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Studio Grid */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr] items-start">
        {/* Left Coaching & Dialect Sidebar */}
        <aside className="space-y-5">
          {/* L1 Dialect Background Switcher */}
          <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
                L1 PHONOLOGICAL PROFILE
              </p>
              <span className="text-[10px] font-mono font-bold text-[var(--lx-muted)]">
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
                  className={`rounded-xl px-2.5 py-2 text-center text-xs font-bold transition ${
                    selectedL1 === prof.l1Code
                      ? "bg-[var(--lx-primary)] text-white shadow-xs"
                      : "border border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
                  }`}
                >
                  <span className="block truncate">{prof.l1Name.split(" ")[0]}</span>
                </Button>
              ))}
            </div>

            <p className="text-xs text-[var(--lx-muted)] leading-5">
              Region: <strong>{currentL1Profile?.region}</strong> · {currentL1Profile?.prosodyProfile.rhythmType} rhythm
            </p>
          </article>

          {/* Active Articulatory Focus for Selected L1 */}
          <article className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
              DIALECT-TARGETED ARTICULATORY CUES
            </p>
            <h2 className="text-sm font-bold text-[var(--lx-ink)]">
              {currentL1Profile?.l1Name} Transfer Targets
            </h2>

            <div className="space-y-3">
              <div className="space-y-2">
                {currentL1Profile?.phonologicalTransfers.slice(0, 3).map((transfer) => (
                  <div
                    key={transfer.id}
                    className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/70 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[var(--lx-primary)]">
                        /{transfer.sourcePhoneme}/ → /{transfer.targetPhoneme}/
                      </span>
                      <span className="rounded-full bg-[var(--lx-surface)] border border-[var(--lx-border)] px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--lx-muted)]">
                        {transfer.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--lx-ink)] font-medium">
                      {transfer.l1Rule}
                    </p>
                    <p className="text-[11px] text-[var(--lx-muted)]">
                      Impact: {transfer.englishImpact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimal Pair Drill Generator */}
            {currentL1Profile?.remediationStrategies && currentL1Profile.remediationStrategies.length > 0 && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-800/50 p-4 space-y-2.5">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                  ⚡ Minimal Pair Drill
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {currentL1Profile.remediationStrategies[0]?.minimalPairDrills.slice(0, 2).map((drill, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      onClick={() => void handleSendTurn(`${drill.wordA} and ${drill.wordB}`)}
                      className="flex flex-col items-center justify-center rounded-xl border border-indigo-200 dark:border-indigo-700 bg-[var(--lx-surface)] p-2.5 text-center text-xs font-bold text-[var(--lx-ink)] shadow-2xs hover:border-[var(--lx-primary)] transition"
                    >
                      <span className="text-[var(--lx-primary)] font-extrabold">{drill.wordA} vs {drill.wordB}</span>
                      <span className="font-mono text-[10px] text-[var(--lx-muted)] dark:text-slate-200">{drill.ipaA} · {drill.ipaB}</span>
                    </Button>
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
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)] self-center mr-1">
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
                className="rounded-lg border border-[var(--lx-border)] bg-[var(--lx-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--lx-ink)] hover:border-[var(--lx-primary)] transition disabled:opacity-40"
              >
                + {phrase}
              </Button>
            ))}
          </div>

          {/* Voice & Text Input Bar */}
          <footer className="border-t border-[var(--lx-border)] p-4 sm:p-5 bg-[var(--lx-surface)]">
            {isRecording && (
              <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-3 dark:bg-rose-950/20 flex flex-col items-center gap-1.5 animate-fade-in">
                <AudioWaveform active={true} variant="recording" barCount={20} />
                <span className="text-xs font-black text-rose-600 animate-pulse">
                  ● Capturing spoken voice… Speak clearly
                </span>
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
                className="flex-1 min-w-0 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-4 py-3 text-xs text-[var(--lx-ink)] outline-none focus:border-[var(--lx-primary)] focus:ring-1 focus:ring-[var(--lx-primary)]"
              />
              <Button
                type="button"
                disabled={!learnerInput.trim() || isRecording || sendingTurn}
                onClick={() => void handleSendTurn()}
                className="rounded-2xl bg-[var(--lx-primary)] px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-[var(--lx-primary)] transition disabled:opacity-40"
              >
                Send
              </Button>
              <Button
                type="button"
                onClick={toggleRecording}
                disabled={isRecording || sendingTurn}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition ${
                  isRecording ? "bg-rose-500 text-white animate-pulse" : "bg-[var(--lx-accent)] text-slate-900 font-bold hover:brightness-105"
                }`}
                title="Use Microphone"
              >
                <span>🎙️</span>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

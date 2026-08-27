"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { TypingIndicator } from "./TypingIndicator";
import type {
  CoachSession,
  CoachSessionEndResult,
  CoachSessionStartResult,
  LearnerContext,
  ProductBridgeResolutionV1,
} from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

const COACH_SESSION_STORAGE_KEY = "lurexa.coach.active-session";

function MessageBubble({ sender, text }: { sender: "coach" | "learner"; text: string }) {
  const isCoach = sender === "coach";
  return (
    <div className={`animate-fade-slide-up flex ${isCoach ? "justify-start" : "justify-end"}`}>
      <article
        className={`max-w-[88%] rounded-[24px] px-5 py-4 text-sm leading-6 shadow-sm sm:max-w-[76%] ${
          isCoach
            ? "rounded-tl-md border border-violet-100 bg-white text-[#18306f]"
            : "rounded-tr-md bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] text-white shadow-[0_12px_30px_rgba(75,46,180,.18)]"
        }`}
      >
        <p className={`mb-1.5 text-[10px] font-black uppercase tracking-[.16em] ${isCoach ? "text-[var(--lx-primary)]" : "text-cyan-100"}`}>
          {isCoach ? "Lurexa Coach" : "You"}
        </p>
        <p className="whitespace-pre-wrap">{text}</p>
      </article>
    </div>
  );
}

export default function LurexaCoachPage() {
  const router = useRouter();
  const transcriptBottomRef = useRef<HTMLDivElement | null>(null);
  const [session, setSession] = useState<CoachSession | null>(null);
  const [learnerContext, setLearnerContext] = useState<LearnerContext | null>(null);
  const [learnerInput, setLearnerInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingTurn, setSendingTurn] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCoachingCue, setActiveCoachingCue] = useState<string | null>(null);

  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.transcript]);

  useEffect(() => {
    const storedSessionId = window.sessionStorage.getItem(COACH_SESSION_STORAGE_KEY);
    if (!storedSessionId) return;

    let cancelled = false;
    void authenticatedFetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resumeSession", sessionId: storedSessionId }),
    })
      .then(async (response) => {
        const payload = (await response.json()) as CoachSessionStartResult & { error?: string };
        if (!response.ok || !payload.session) throw new Error(payload.error ?? "Unable to restore Coach session.");
        if (cancelled) return;
        setSession(payload.session);
        setLearnerContext(payload.learnerContext);
      })
      .catch(() => {
        if (!cancelled) window.sessionStorage.removeItem(COACH_SESSION_STORAGE_KEY);
      });

    return () => { cancelled = true; };
  }, []);

  const handleStartCoaching = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "startSession" }),
      });
      const payload = (await response.json()) as CoachSessionStartResult & { error?: string };
      if (!response.ok || !payload.session) throw new Error(payload.error ?? "Unable to start Coach session.");
      window.sessionStorage.setItem(COACH_SESSION_STORAGE_KEY, payload.session.id);
      setSession(payload.session);
      setLearnerContext(payload.learnerContext);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start Coach session.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTurn = async (textToSend?: string) => {
    const text = (textToSend ?? learnerInput).trim();
    if (!session || !text || sendingTurn || endingSession) return;

    setSendingTurn(true);
    setError(null);
    setLearnerInput("");

    try {
      const response = await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendTurn",
          sessionId: session.id,
          message: text,
        }),
      });

      const result = (await response.json()) as {
        session: CoachSession;
        coachingCue?: string;
        intelligibilityScore?: number;
        error?: string;
      };

      if (!response.ok || !result.session) {
        throw new Error(result.error ?? "Unable to send turn to Coach.");
      }

      setSession(result.session);
      if (result.coachingCue) {
        setActiveCoachingCue(result.coachingCue);
      }
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send response.");
    } finally {
      setSendingTurn(false);
    }
  };

  const handleFinishSession = async () => {
    if (!session || endingSession || sendingTurn) return;

    setEndingSession(true);
    setError(null);
    try {
      const completionResponse = await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "endSession", sessionId: session.id }),
      });
      const completion = (await completionResponse.json()) as CoachSessionEndResult & { error?: string };
      if (!completionResponse.ok || !completion.returnBridge) {
        throw new Error(completion.error ?? "Unable to finish this Coach session safely.");
      }

      const resolutionResponse = await authenticatedFetch("/api/product-bridge?action=resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bridgeId: completion.returnBridge.bridgeId,
          destination: "learn",
        }),
      });
      const resolution = (await resolutionResponse.json()) as ProductBridgeResolutionV1 & { error?: string };
      if (!resolutionResponse.ok || !resolution.destinationRef) {
        throw new Error(resolution.error ?? "Your return to Learn could not be validated.");
      }

      window.sessionStorage.removeItem(COACH_SESSION_STORAGE_KEY);
      setSession(completion.session);
      router.push(resolution.destinationRef);
    } catch (finishError) {
      setError(finishError instanceof Error ? finishError.message : "Unable to finish this Coach session.");
    } finally {
      setEndingSession(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!session || isRecording || sendingTurn || endingSession) return;
    setIsRecording(true);

    // Voice recognition simulation / fallback turn
    setTimeout(() => {
      setIsRecording(false);
      void handleSendTurn("I'm practicing my English speaking with Lurexa Coach today.");
    }, 2000);
  };

  const contextItems = learnerContext
    ? [
        learnerContext.proficiency?.cefr ? `CEFR ${learnerContext.proficiency.cefr}` : "CEFR A1",
        learnerContext.curriculum?.lessonId ? "Recent Learn Work Connected" : "Learn A1 Foundations",
        learnerContext.activeTargets?.pronunciation?.length
          ? `Pronunciation · ${learnerContext.activeTargets.pronunciation.slice(0, 2).join(", ")}`
          : "Focus · Intelligibility & Rhythm",
        learnerContext.activeTargets?.fluency?.length
          ? `Fluency · ${learnerContext.activeTargets.fluency.slice(0, 2).join(", ")}`
          : "Fluency · Spoken Confidence",
      ]
    : [];

  const starterTopics = [
    "Hello! My name is...",
    "I'm from the Dominican Republic.",
    "On weekdays, I wake up at six and study English.",
    "I'd like a coffee and water, please.",
    "Could you repeat that more slowly?",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4fbff] text-[#071d67]">
      {/* Top Header */}
      <section className="relative border-b border-[#dcebf6] bg-gradient-to-br from-[#071d67] via-[#39228f] to-[#6b2bd9] text-white">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#12cdd4]/15 blur-3xl" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#58e4b8]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ProductMark product="coach" inverse />
              {session ? (
                <button
                  type="button"
                  disabled={endingSession || sendingTurn}
                  onClick={() => void handleFinishSession()}
                  className="text-xs font-bold uppercase tracking-wider text-indigo-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#39228f] disabled:opacity-60"
                >
                  {endingSession ? "Finishing session…" : "Finish & return to Learn"}
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-xs font-bold uppercase tracking-wider text-indigo-200 hover:text-white transition"
                >
                  ← Back to Dashboard
                </Link>
              )}
            </div>
            <span
              className={`inline-flex min-h-10 items-center rounded-full border px-4 text-xs font-black uppercase tracking-[.12em] ${
                session
                  ? "border-[#7ef1df]/35 bg-[#7ef1df]/10 text-[#a9fff1]"
                  : "border-white/15 bg-white/10 text-indigo-100"
              }`}
            >
              <span className={`mr-2 h-2 w-2 rounded-full ${session ? "bg-[#65f0d3] animate-pulse motion-reduce:animate-none" : "bg-indigo-300"}`} />
              {endingSession ? "Saving Session" : session ? "Adaptive Session Active" : "Speaking Space"}
            </span>
          </header>

          <div className="grid gap-10 pb-10 pt-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.2em] text-[#92f2e8]">YOUR AI SPEAKING SPACE</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[.94] tracking-[-.065em] sm:text-6xl">
                Speak first.<br />
                <span className="text-[#8df4ef]">Refine what matters.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                Coach connects directly with your Learner Model to practice pronunciation, intelligibility, and natural rhythm—without asking you to start over.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#8df4ef]">PEDAGOGICAL PRINCIPLE</p>
              <p className="mt-2 text-base font-bold leading-6">
                Intelligibility, naturalness, and spoken confidence—never accent erasure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Experience */}
      <section className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {!session ? (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <article className="relative overflow-hidden rounded-[34px] border border-[#d8e7f6] bg-white p-7 shadow-[0_20px_60px_rgba(39,61,132,.08)] sm:p-10">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#6b2bd9]/8 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#6b2bd9]">CONTINUOUS ADAPTATION</p>
                <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-.05em] sm:text-4xl">
                  Continue from where you are.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6074a5]">
                  Coach uses your verified CEFR level, recent Learn lessons, and Dominican Spanish pronunciation targets to adapt each turn automatically.
                </p>
                {error && (
                  <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleStartCoaching}
                  className="mt-8 inline-flex min-h-14 items-center rounded-2xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-8 text-sm font-black text-white shadow-[0_16px_34px_rgba(75,46,180,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(75,46,180,.28)] disabled:opacity-60"
                >
                  {loading ? "Connecting your context…" : "Start Speaking Session →"}
                </button>
              </div>
            </article>

            <aside className="rounded-[34px] bg-[#071d67] p-7 text-white shadow-[0_20px_50px_rgba(7,29,103,.14)] sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8df4ef]">COACH ADVANTAGES</p>
              <div className="mt-6 space-y-5">
                {[
                  ["01", "Adaptive Context", "Loads your current CEFR level and Learn targets seamlessly."],
                  ["02", "Dominican L1 Awareness", "Helps with final consonant closure, /s/ endings, and natural rhythm."],
                  ["03", "Core Evidence Sync", "Every speaking turn contributes authentic evidence to your Learner Model."],
                ].map(([number, title, copy]) => (
                  <div key={number} className="border-t border-white/10 pt-4">
                    <span className="text-xs font-black text-[#8df4ef]">{number}</span>
                    <b className="ml-3 text-sm">{title}</b>
                    <p className="mt-1.5 text-xs leading-5 text-indigo-200">{copy}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[.75fr_1.25fr] xl:items-start">
            {/* Sidebar Context */}
            <aside className="space-y-5 xl:sticky xl:top-6">
              <article className="rounded-[28px] border border-[#d8e7f6] bg-white p-6 shadow-[0_12px_34px_rgba(39,61,132,.07)]">
                <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#6b2bd9]">SESSION CONTEXT</p>
                <h2 className="mt-2 text-xl font-black tracking-[-.04em]">What Coach is using</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {contextItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#d9d6ff] bg-[#f3f0ff] px-3.5 py-1.5 text-xs font-bold text-[#5a36b5]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>

              {activeCoachingCue ? (
                <article className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 animate-in fade-in duration-300 motion-reduce:animate-none">
                  <p className="text-[10px] font-black uppercase tracking-[.17em] text-amber-800">COACHING TIP</p>
                  <p className="mt-2 text-sm font-semibold text-amber-950 leading-relaxed">{activeCoachingCue}</p>
                </article>
              ) : null}

              <article className="rounded-[28px] border border-[#bfeee7] bg-[#eafffb] p-6">
                <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#147c78]">CORE EVIDENCE BOUNDARY</p>
                <p className="mt-2 text-xs leading-5 text-[#315e69]">
                  Spoken observations in Coach are recorded in Lurexa Core to reinforce your continuous Learner Model without altering verified placement prematurely.
                </p>
              </article>

              <button
                type="button"
                disabled={endingSession || sendingTurn}
                onClick={() => void handleFinishSession()}
                className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {endingSession ? "Saving session & validating return…" : "Finish session & return to Learn →"}
              </button>
              <p className="px-2 text-[11px] leading-5 text-slate-500">
                Finishing records the session outcome, refreshes your learner intelligence, and validates a one-time return bridge before Learn opens.
              </p>
            </aside>

            {/* Conversation Window */}
            <article className="overflow-hidden rounded-[34px] border border-[#d8e7f6] bg-white shadow-[0_24px_70px_rgba(39,61,132,.1)]">
              <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf2f9] px-6 py-5 sm:px-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#6b2bd9]">CONVERSATION &amp; PRACTICE</p>
                  <h2 className="mt-1 text-xl font-black">Live Speaking Session</h2>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#e6faf5] px-3.5 py-1.5 text-xs font-black text-[#147c68]">
                  <span className="mr-2 h-2 w-2 rounded-full bg-[#31c99b] animate-ping motion-reduce:animate-none" />
                  {endingSession ? "Finishing" : "Active"}
                </span>
              </header>

              {/* Chat Transcript */}
              <div className="min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 bg-gradient-to-b from-[#fbfdff] to-[#f5f6ff] px-5 py-7 sm:px-8">
                {session.transcript.map((message, index) => (
                  <MessageBubble
                    key={`${message.timestamp}-${index}`}
                    sender={message.sender as "coach" | "learner"}
                    text={message.text}
                  />
                ))}
                {sendingTurn ? (
                  <div className="flex justify-start">
                    <TypingIndicator label="Coach is analyzing your speech & preparing feedback…" />
                  </div>
                ) : null}
                <div ref={transcriptBottomRef} />
              </div>

              {/* Prompt Suggestions */}
              <div className="border-t border-[#edf2f9] bg-[#f8fbff] px-6 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Try Saying:</p>
                <div className="flex flex-wrap gap-2">
                  {starterTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      disabled={sendingTurn || endingSession}
                      onClick={() => void handleSendTurn(topic)}
                      className="rounded-xl border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 transition disabled:opacity-40"
                    >
                      + {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Footer */}
              <footer className="border-t border-[#edf2f9] bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={learnerInput}
                      disabled={endingSession}
                      onChange={(e) => setLearnerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleSendTurn();
                      }}
                      placeholder="Type your response or question in English…"
                      className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                      type="button"
                      disabled={!learnerInput.trim() || sendingTurn || endingSession}
                      onClick={() => void handleSendTurn()}
                      className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition"
                    >
                      {sendingTurn ? "…" : "Send"}
                    </button>
                    <button
                      type="button"
                      onClick={toggleVoiceRecording}
                      disabled={isRecording || sendingTurn || endingSession}
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition ${
                        isRecording
                          ? "bg-rose-500 text-white animate-pulse motion-reduce:animate-none"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      }`}
                      title={isRecording ? "Listening…" : "Speak with microphone"}
                    >
                      <span>🎙️</span>
                    </button>
                  </div>

                  {error ? (
                    <p className="text-xs font-semibold text-red-600" role="alert">
                      {error}
                    </p>
                  ) : null}
                </div>
              </footer>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}

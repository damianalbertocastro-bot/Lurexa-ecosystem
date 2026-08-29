"use client";

import { useEffect, useRef, useState } from "react";
import type { CoachSession, CoachSessionEndResult, CoachSessionStartResult, LearnerContext, ProductBridgeResolutionV1 } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

const ACTIVE_SESSION_KEY = "lurexa.coach.active-session";

function Bubble({ sender, text }: { sender: "coach" | "learner"; text: string }) {
  const coach = sender === "coach";
  return <div className={`flex ${coach ? "justify-start" : "justify-end"}`}><article className={`max-w-[86%] rounded-[22px] px-5 py-4 text-sm leading-6 shadow-sm sm:max-w-[74%] ${coach ? "rounded-tl-md border border-violet-100 bg-white text-[#18306f]" : "rounded-tr-md bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] text-white"}`}><p className={`mb-1 text-[10px] font-black uppercase tracking-[.16em] ${coach ? "text-[#6b2bd9]" : "text-cyan-100"}`}>{coach ? "Lurexa Coach" : "You"}</p><p className="whitespace-pre-wrap">{text}</p></article></div>;
}

function goTo(ref: string) {
  if (/^https?:\/\//i.test(ref)) window.location.assign(ref);
  else window.location.assign(ref);
}

export default function PracticePage() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [session, setSession] = useState<CoachSession | null>(null);
  const [context, setContext] = useState<LearnerContext | null>(null);
  const [input, setInput] = useState("");
  const [cue, setCue] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [session?.transcript]);

  useEffect(() => {
    const sessionId = window.sessionStorage.getItem(ACTIVE_SESSION_KEY);
    if (!sessionId) return;
    let cancelled = false;
    void authenticatedFetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "resumeSession", sessionId }) })
      .then(async (response) => {
        const payload = await response.json() as CoachSessionStartResult & { error?: string };
        if (!response.ok || !payload.session) throw new Error(payload.error ?? "Unable to restore Coach session.");
        if (!cancelled) { setSession(payload.session); setContext(payload.learnerContext); }
      }).catch(() => { if (!cancelled) window.sessionStorage.removeItem(ACTIVE_SESSION_KEY); });
    return () => { cancelled = true; };
  }, []);

  async function start() {
    setBusy(true); setError("");
    try {
      const response = await authenticatedFetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "startSession" }) });
      const payload = await response.json() as CoachSessionStartResult & { error?: string };
      if (!response.ok || !payload.session) throw new Error(payload.error ?? "Unable to start Coach session.");
      window.sessionStorage.setItem(ACTIVE_SESSION_KEY, payload.session.id);
      setSession(payload.session); setContext(payload.learnerContext);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to start Coach session."); }
    finally { setBusy(false); }
  }

  const [diagnosticReport, setDiagnosticReport] = useState<{
    score?: number;
    patterns?: string[];
    remedialAction?: string;
  } | null>(null);

  async function send(textToSend?: string) {
    const message = (textToSend ?? input).trim();
    if (!session || !message || busy || ending) return;
    setBusy(true); setError(""); setInput("");
    try {
      const response = await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendCascadedTurn", sessionId: session.id, message }),
      });
      const payload = await response.json() as {
        session?: CoachSession;
        coachingCue?: string;
        turn?: {
          fastTurn: { replyText: string; speechAudioBase64?: string; latencyMs: number };
          deepDiagnostic?: { overallScore: number; detectedTransferPatterns: string[]; remedialAction?: string };
        };
        error?: string;
      };

      if (!response.ok || !payload.session) throw new Error(payload.error ?? "Unable to send your Coach turn.");
      setSession(payload.session);
      setCue(payload.coachingCue ?? null);

      if (payload.turn?.deepDiagnostic) {
        setDiagnosticReport({
          score: payload.turn.deepDiagnostic.overallScore,
          patterns: payload.turn.deepDiagnostic.detectedTransferPatterns,
          remedialAction: payload.turn.deepDiagnostic.remedialAction,
        });
      }

      // If synthesized audio base64 is delivered by fast turn loop, play audio
      if (payload.turn?.fastTurn?.speechAudioBase64 && typeof window !== "undefined") {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${payload.turn.fastTurn.speechAudioBase64}`);
          void audio.play();
        } catch {
          // Fallback to speech synthesis
        }
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to send your response."); }
    finally { setBusy(false); }
  }

  async function finish() {
    if (!session || busy || ending) return;
    setEnding(true); setError("");
    try {
      const completionResponse = await authenticatedFetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "endSession", sessionId: session.id }) });
      const completion = await completionResponse.json() as CoachSessionEndResult & { error?: string };
      if (!completionResponse.ok || !completion.returnBridge) throw new Error(completion.error ?? "Unable to finish this Coach session safely.");
      const destination = completion.returnBridge.destination;
      const resolutionResponse = await authenticatedFetch("/api/product-bridge?action=resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bridgeId: completion.returnBridge.bridgeId, destination }) });
      const resolution = await resolutionResponse.json() as ProductBridgeResolutionV1 & { error?: string };
      if (!resolutionResponse.ok || !resolution.destinationRef) throw new Error(resolution.error ?? "The return to your Lurexa product could not be validated.");
      window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
      goTo(resolution.destinationRef);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to finish this Coach session."); setEnding(false); }
  }

  const returnLabel = session?.mode === "educator_professional" ? "Finish & return to Teach" : "Finish & return to Learn";
  const contextItems = context ? [context.proficiency?.cefr ? `CEFR ${context.proficiency.cefr}` : "CEFR context available", context.curriculum?.lessonId ? "Recent Learn work connected" : "Curriculum context", context.activeTargets?.pronunciation?.length ? `Pronunciation · ${context.activeTargets.pronunciation.slice(0, 2).join(", ")}` : "Pronunciation focus", context.activeTargets?.fluency?.length ? `Fluency · ${context.activeTargets.fluency.slice(0, 2).join(", ")}` : "Fluency focus"] : [];
  const starters = ["Tell me about your day.", "Help me practice a difficult sound.", "I want to sound clearer when I speak.", "Let's practice a work conversation."];

  if (!session) return <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]"><article className="rounded-[34px] border border-[#d8e7f6] bg-white p-8 shadow-[0_20px_60px_rgba(39,61,132,.08)]"><p className="text-[10px] font-black tracking-[.18em] text-[#6b2bd9]">ADAPTIVE SPEAKING SESSION</p><h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl">Continue from where you are.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#6074a5]">Coach requests your authorized learner context when the session starts, then adapts conversation, pronunciation, fluency, and feedback around it.</p>{error ? <p role="alert" className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-800">{error}</p> : null}<button type="button" disabled={busy} onClick={() => void start()} className="mt-8 min-h-14 rounded-2xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-8 text-sm font-black text-white shadow-lg disabled:opacity-60">{busy ? "Connecting your context…" : "Start speaking session →"}</button></article><aside className="rounded-[34px] bg-[#071d67] p-8 text-white"><p className="text-[10px] font-black tracking-[.18em] text-[#8df4ef]">COACH BOUNDARY</p><h2 className="mt-3 text-2xl font-black">Coach owns practice. Core owns the trusted record.</h2><p className="mt-4 text-sm leading-7 text-indigo-200">Coach interprets and practices with authorized context. It does not become the authority for placement, qualification, course enrollment, or persistence.</p></aside></section>;

  return <section className="grid gap-6 xl:grid-cols-[.72fr_1.28fr] xl:items-start"><aside className="space-y-4 xl:sticky xl:top-28"><article className="rounded-[28px] border border-[#d8e7f6] bg-white p-6"><p className="text-[10px] font-black tracking-[.17em] text-[#6b2bd9]">SESSION CONTEXT</p><div className="mt-4 flex flex-wrap gap-2">{contextItems.map((item) => <span key={item} className="rounded-full border border-[#d9d6ff] bg-[#f3f0ff] px-3 py-1.5 text-xs font-bold text-[#5a36b5]">{item}</span>)}</div></article>{cue ? <article className="rounded-[28px] border border-amber-200 bg-amber-50 p-6"><p className="text-[10px] font-black tracking-[.17em] text-amber-800">COACHING TIP</p><p className="mt-2 text-sm font-semibold leading-6 text-amber-950">{cue}</p></article> : null}{diagnosticReport ? <article className="rounded-[28px] border border-sky-200 bg-sky-50 p-6"><p className="text-[10px] font-black tracking-[.17em] text-sky-800">ACOUSTIC &amp; L1 DIAGNOSTIC</p><p className="mt-2 text-xs font-bold text-sky-900">Score: {Math.round((diagnosticReport.score ?? 0.85) * 100)}% Intelligibility</p>{diagnosticReport.patterns?.length ? <div className="mt-2 flex flex-wrap gap-1">{diagnosticReport.patterns.map((p) => <span key={p} className="rounded-md bg-white border border-sky-300 px-2 py-0.5 text-[10px] font-bold text-sky-800">{p}</span>)}</div> : null}{diagnosticReport.remedialAction ? <p className="mt-2 text-[11px] text-sky-950 font-medium">{diagnosticReport.remedialAction}</p> : null}</article> : null}<article className="rounded-[28px] border border-[#bfeee7] bg-[#eafffb] p-6"><p className="text-[10px] font-black tracking-[.17em] text-[#147c78]">EVIDENCE BOUNDARY</p><p className="mt-2 text-xs leading-5 text-[#315e69]">Learner-mode sessions can contribute minimized learning evidence. Educator-professional sessions stay in professional evidence and do not enter the ordinary learner evidence pipeline.</p></article><button type="button" disabled={busy || ending} onClick={() => void finish()} className="w-full min-h-12 rounded-xl bg-[#071d67] px-5 text-sm font-black text-white disabled:opacity-50">{ending ? "Saving & validating return…" : `${returnLabel} →`}</button></aside>
    <article className="overflow-hidden rounded-[34px] border border-[#d8e7f6] bg-white shadow-[0_24px_70px_rgba(39,61,132,.1)]"><header className="flex items-center justify-between border-b border-[#edf2f9] px-6 py-5"><div><p className="text-[10px] font-black tracking-[.17em] text-[#6b2bd9]">LIVE PRACTICE</p><h2 className="mt-1 text-xl font-black">{session.mode === "educator_professional" ? "Professional English Coach" : "Adaptive Speaking Coach"}</h2></div><span className="rounded-full bg-[#e6faf5] px-3 py-1.5 text-xs font-black text-[#147c68]">Active</span></header><div className="min-h-[390px] max-h-[540px] space-y-4 overflow-y-auto bg-gradient-to-b from-[#fbfdff] to-[#f5f6ff] px-5 py-7 sm:px-8">{session.transcript.map((message, index) => <Bubble key={`${message.timestamp}-${index}`} sender={message.sender} text={message.text} />)}{busy ? <div className="text-xs italic text-[#7182aa]">Coach is preparing feedback…</div> : null}<div ref={bottomRef}/></div><div className="border-t border-[#edf2f9] bg-[#f8fbff] px-6 py-3"><div className="flex flex-wrap gap-2">{starters.map((starter) => <button key={starter} type="button" disabled={busy || ending} onClick={() => void send(starter)} className="rounded-xl border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 disabled:opacity-40">+ {starter}</button>)}</div></div><footer className="border-t border-[#edf2f9] p-5"><div className="flex gap-3"><input value={input} disabled={ending} onChange={(event)=>setInput(event.target.value)} onKeyDown={(event)=>{ if (event.key === "Enter") void send(); }} placeholder="Type your response in English…" className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-indigo-600"/><button type="button" disabled={!input.trim() || busy || ending} onClick={() => void send()} className="rounded-2xl bg-indigo-600 px-6 text-sm font-black text-white disabled:opacity-40">Send</button></div>{error ? <p role="alert" className="mt-3 text-xs font-bold text-rose-700">{error}</p> : null}</footer></article></section>;
}

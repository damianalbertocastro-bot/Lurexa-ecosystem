"use client";

import React, { useState } from "react";
import { ProductMark } from "@lurexa/ui/ProductMark";
import type { CoachSession, CoachSessionStartResult, LearnerContext } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

function MessageBubble({ sender, text }: { sender: "coach" | "learner"; text: string }) {
  const isCoach = sender === "coach";
  return (
    <div className={`flex ${isCoach ? "justify-start" : "justify-end"}`}>
      <article className={`max-w-[88%] rounded-[24px] px-5 py-4 text-sm leading-6 shadow-sm sm:max-w-[76%] ${isCoach ? "rounded-tl-md border border-violet-100 bg-white text-[#18306f]" : "rounded-tr-md bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] text-white shadow-[0_12px_30px_rgba(75,46,180,.18)]"}`}>
        <p className={`mb-1.5 text-[10px] font-black uppercase tracking-[.16em] ${isCoach ? "text-[#6b2bd9]" : "text-cyan-100"}`}>{isCoach ? "Lurexa Coach" : "You"}</p>
        <p>{text}</p>
      </article>
    </div>
  );
}

export default function LurexaCoachPage() {
  const [session, setSession] = useState<CoachSession | null>(null);
  const [learnerContext, setLearnerContext] = useState<LearnerContext | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartCoaching = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/coach", { method: "POST" });
      const payload = await response.json() as CoachSessionStartResult & { error?: string };
      if (!response.ok || !payload.session) throw new Error(payload.error ?? "Unable to start Coach session.");
      setSession(payload.session);
      setLearnerContext(payload.learnerContext);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start Coach session.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecordingPrototype = () => {
    if (!session) return;
    setIsRecording((current) => !current);
    if (!isRecording) {
      setTimeout(() => {
        const now = new Date().toISOString();
        setSession((current) => current ? {
          ...current,
          transcript: [
            ...current.transcript,
            { sender: "learner", text: "I have been practicing my English pronunciation today.", timestamp: now },
            { sender: "coach", text: "Your message was clear. Production speech analysis is not enabled in this prototype yet, so I will not invent a pronunciation score. Future feedback will use evidence-backed pronunciation observations and your existing learner context.", timestamp: now },
          ],
          updatedAt: now,
        } : null);
        setIsRecording(false);
      }, 1200);
    }
  };

  const contextItems = learnerContext ? [
    learnerContext.proficiency?.cefr ? `CEFR ${learnerContext.proficiency.cefr}` : null,
    learnerContext.curriculum?.lessonId ? "Recent Learn context" : null,
    learnerContext.activeTargets?.pronunciation?.length ? `Pronunciation · ${learnerContext.activeTargets.pronunciation.slice(0, 2).join(", ")}` : null,
    learnerContext.activeTargets?.fluency?.length ? `Fluency · ${learnerContext.activeTargets.fluency.slice(0, 2).join(", ")}` : null,
  ].filter((item): item is string => Boolean(item)) : [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4fbff] text-[#071d67]">
      <section className="relative border-b border-[#dcebf6] bg-gradient-to-br from-[#071d67] via-[#39228f] to-[#6b2bd9] text-white">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#12cdd4]/15 blur-3xl" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#58e4b8]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <ProductMark product="coach" inverse />
            <span className={`inline-flex min-h-10 items-center rounded-full border px-4 text-xs font-black uppercase tracking-[.12em] ${session ? "border-[#7ef1df]/35 bg-[#7ef1df]/10 text-[#a9fff1]" : "border-white/15 bg-white/10 text-indigo-100"}`}>
              <span className={`mr-2 h-2 w-2 rounded-full ${session ? "bg-[#65f0d3]" : "bg-indigo-300"}`} />
              {session ? "Context connected" : "Speaking prototype"}
            </span>
          </header>

          <div className="grid gap-10 pb-10 pt-14 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.2em] text-[#92f2e8]">YOUR SPEAKING SPACE</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[.94] tracking-[-.065em] sm:text-7xl">Speak first.<br /><span className="text-[#8df4ef]">Refine what matters.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-indigo-100 sm:text-lg">Coach uses what Lurexa already knows about your learning to make speaking practice more relevant—without asking you to start over.</p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#8df4ef]">COACH PRINCIPLE</p>
              <p className="mt-3 text-lg font-bold leading-7">Intelligibility, naturalness, fluency, and confidence—not accent erasure.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {!session ? (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <article className="relative overflow-hidden rounded-[34px] border border-[#d8e7f6] bg-white p-7 shadow-[0_20px_60px_rgba(39,61,132,.08)] sm:p-10">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#6b2bd9]/8 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#6b2bd9]">READY WHEN YOU ARE</p>
                <h2 className="mt-4 max-w-xl text-3xl font-black tracking-[-.05em] sm:text-4xl">Continue from the learner you already are.</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6074a5]">Your CEFR level, recent learning context, recurring speaking targets, and future verified pronunciation observations can shape the session when authorized context is available.</p>
                {error && <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</p>}
                <button type="button" disabled={loading} onClick={handleStartCoaching} className="mt-8 inline-flex min-h-14 items-center rounded-2xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(75,46,180,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(75,46,180,.28)] disabled:cursor-wait disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none">
                  {loading ? "Connecting your context…" : "Start speaking session →"}
                </button>
              </div>
            </article>

            <aside className="rounded-[34px] bg-[#071d67] p-7 text-white shadow-[0_20px_50px_rgba(7,29,103,.14)] sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8df4ef]">HOW COACH SHOULD FEEL</p>
              <div className="mt-6 space-y-5">
                {[
                  ["01", "Conversational", "The speaking turn is the primary interaction—not navigation chrome."],
                  ["02", "Context-aware", "Existing learner evidence can shape useful practice without exposing private data unnecessarily."],
                  ["03", "Evidence-honest", "Coach never invents pronunciation scores when production analysis is unavailable."],
                ].map(([number, title, copy]) => <div key={number} className="border-t border-white/10 pt-5"><span className="text-xs font-black text-[#8df4ef]">{number}</span><b className="ml-3 text-sm">{title}</b><p className="mt-2 text-xs leading-6 text-indigo-200">{copy}</p></div>)}
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr] xl:items-start">
            <aside className="space-y-5 xl:sticky xl:top-6">
              <article className="rounded-[28px] border border-[#d8e7f6] bg-white p-6 shadow-[0_12px_34px_rgba(39,61,132,.07)]">
                <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#6b2bd9]">SESSION CONTEXT</p>
                <h2 className="mt-2 text-xl font-black tracking-[-.04em]">What Coach is using</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {contextItems.length > 0 ? contextItems.map((item) => <span key={item} className="rounded-full border border-[#d9d6ff] bg-[#f3f0ff] px-3 py-2 text-xs font-bold text-[#5a36b5]">{item}</span>) : <p className="text-sm leading-6 text-[#6074a5]">Coach is starting with limited context and will adapt only as reliable evidence develops.</p>}
                </div>
              </article>

              <article className="rounded-[28px] border border-[#bfeee7] bg-[#eafffb] p-6">
                <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#147c78]">PRIVACY & TRUST</p>
                <p className="mt-3 text-sm leading-6 text-[#315e69]">Only authorized learner context should influence this session. Coach guidance is interpretation; trusted records remain governed by Lurexa Core.</p>
              </article>
            </aside>

            <article className="overflow-hidden rounded-[34px] border border-[#d8e7f6] bg-white shadow-[0_24px_70px_rgba(39,61,132,.1)]">
              <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf2f9] px-6 py-5 sm:px-8">
                <div><p className="text-[10px] font-black uppercase tracking-[.17em] text-[#6b2bd9]">LIVE PRACTICE</p><h2 className="mt-1 text-xl font-black">Speaking session</h2></div>
                <span className="inline-flex items-center rounded-full bg-[#e6faf5] px-3 py-2 text-xs font-black text-[#147c68]"><span className="mr-2 h-2 w-2 rounded-full bg-[#31c99b]" />Session active</span>
              </header>

              <div className="min-h-[360px] space-y-4 bg-gradient-to-b from-[#fbfdff] to-[#f5f6ff] px-5 py-7 sm:px-8">
                {session.transcript.length > 0 ? session.transcript.map((message, index) => <MessageBubble key={`${message.timestamp}-${index}`} sender={message.sender as "coach" | "learner"} text={message.text} />) : <div className="grid min-h-[300px] place-items-center text-center"><div><p className="text-sm font-bold text-[#6b2bd9]">The conversation starts with your voice.</p><p className="mt-2 text-sm text-[#7180a8]">Use the speaking control below when you are ready.</p></div></div>}
              </div>

              <footer className="border-t border-[#edf2f9] bg-white p-5 sm:p-7">
                <div className="flex flex-col items-center text-center">
                  <button type="button" onClick={toggleRecordingPrototype} className={`group relative grid h-20 w-20 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6b2bd9]/30 motion-reduce:transition-none ${isRecording ? "bg-[#ef5f75] shadow-[0_0_0_10px_rgba(239,95,117,.12),0_18px_35px_rgba(180,40,70,.2)]" : "bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] shadow-[0_0_0_10px_rgba(107,43,217,.08),0_18px_35px_rgba(75,46,180,.22)] hover:scale-[1.03] motion-reduce:hover:scale-100"}`} aria-label={isRecording ? "Finish prototype speaking sample" : "Start prototype speaking sample"}>
                    {isRecording ? <span className="h-6 w-6 rounded-md bg-white" /> : <span className="relative h-8 w-5 rounded-full border-[3px] border-white before:absolute before:-bottom-2 before:left-1/2 before:h-2 before:w-8 before:-translate-x-1/2 before:rounded-b-full before:border-b-[3px] before:border-l-[3px] before:border-r-[3px] before:border-white after:absolute after:-bottom-4 after:left-1/2 after:h-2 after:w-[3px] after:-translate-x-1/2 after:bg-white" />}
                  </button>
                  <p className={`mt-4 text-sm font-black ${isRecording ? "text-[#cf3957]" : "text-[#536ba5]"}`}>{isRecording ? "Listening to your sample…" : "Tap when you are ready to speak"}</p>
                  <p className="mt-1 max-w-xl text-xs leading-5 text-[#8190b7]">Production speech recognition and pronunciation analysis are not enabled on this screen yet. Prototype feedback remains evidence-honest.</p>
                </div>
              </footer>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}

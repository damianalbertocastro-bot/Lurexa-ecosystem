"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AuthService } from "@lurexa/backend";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type Choice = { label: string; correct: boolean };

const greetingChoices: Choice[] = [
  { label: "Nice to meet you.", correct: true },
  { label: "I am fine, thank you.", correct: false },
  { label: "See you yesterday.", correct: false },
];

export default function A1PreviewPage() {
  const [selectedGreeting, setSelectedGreeting] = useState("");
  const [greetingChecked, setGreetingChecked] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [speakingCompleted, setSpeakingCompleted] = useState(false);
  const [createSubmitted, setCreateSubmitted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => AuthService.onUserChanged((user) => setSignedIn(Boolean(user))), []);

  const completedSteps = useMemo(
    () => [greetingChecked, speakingCompleted, createSubmitted].filter(Boolean).length,
    [greetingChecked, speakingCompleted, createSubmitted],
  );

  async function recordEvidence(eventType: string, payload: Record<string, unknown>) {
    if (!signedIn) return;
    setSaveState("saving");
    try {
      const response = await authenticatedFetch("/api/learning/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          source: {
            product: "learn",
            courseId: "english-a1-foundations",
            lessonId: "a1-introduce-yourself",
          },
          payload,
          idempotencyKey: `a1-introduce-yourself:${eventType}:${Date.now()}`,
        }),
      });
      if (!response.ok) throw new Error("Evidence was not accepted.");
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function checkGreeting() {
    if (!selectedGreeting) return;
    setGreetingChecked(true);
    void recordEvidence("learning_activity.submitted", {
      activityId: "greeting-response",
      firstAttempt: true,
      correct: greetingChoices.find((choice) => choice.label === selectedGreeting)?.correct ?? false,
      competencyIds: ["EN-A1-SPK-INTRO-01"],
    });
  }

  function completeSpeaking() {
    setSpeakingCompleted(true);
    void recordEvidence("speaking_practice.completed", {
      activityId: "say-it-aloud",
      target: "Hello, I am ___. Nice to meet you.",
      selfReportedCompletion: true,
      competencyIds: ["EN-A1-PHON-INTRO-01"],
    });
  }

  function submitCreateApply() {
    if (introduction.trim().length < 12) return;
    setCreateSubmitted(true);
    void recordEvidence("create_apply.submitted", {
      activityId: "two-sentence-introduction",
      submitted: true,
      characterCount: introduction.trim().length,
      competencyIds: ["EN-A1-SPK-INTRO-01"],
    });
  }

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[.16em] text-indigo-700">A1 ENGLISH FOUNDATIONS · 12 MIN</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--learn-ink)]">Introduce yourself</h1>
            <p className="mt-2 text-slate-600">By the end, you can greet someone and give a short introduction.</p>
          </div>
          <Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">My learning space</Link>
        </header>

        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex justify-between text-sm font-semibold text-slate-700"><span>Your path</span><span>{completedSteps}/3 steps</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-400 transition-all" style={{ width: `${(completedSteps / 3) * 100}%` }} /></div>
          {!signedIn && <p className="mt-3 text-sm text-slate-600">You can try the lesson now. <Link href="/login" className="font-semibold text-indigo-700 underline">Sign in</Link> to save your learning evidence.</p>}
          {signedIn && <p className="mt-3 text-sm text-slate-600">{saveState === "saving" ? "Saving your learning evidence…" : saveState === "saved" ? "Your progress evidence is saved." : saveState === "error" ? "Your practice is complete, but saving did not work. Try again after reconnecting." : "Your activity evidence is kept separately from mastery."}</p>}
        </div>

        <section className="space-y-6">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold tracking-[.14em] text-indigo-700">1 · NOTICE</p>
            <h2 className="mt-2 text-xl font-bold">A simple first conversation</h2>
            <div className="mt-5 rounded-xl bg-sky-50 p-4 text-slate-800">
              <p><strong>Andrea:</strong> Hi, I&apos;m Andrea. What&apos;s your name?</p>
              <p className="mt-2"><strong>Luis:</strong> Hello, I&apos;m Luis. Nice to meet you.</p>
              <p className="mt-2"><strong>Andrea:</strong> Nice to meet you too.</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">Use <strong>I&apos;m…</strong> to say your name. Use <strong>Nice to meet you</strong> when you meet someone for the first time.</p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold tracking-[.14em] text-indigo-700">2 · PRACTISE</p>
            <h2 className="mt-2 text-xl font-bold">Choose the natural response</h2>
            <p className="mt-2 text-slate-600">Someone says: “Hi, I&apos;m Carlos. Nice to meet you.”</p>
            <div className="mt-5 space-y-3">{greetingChoices.map((choice) => <label key={choice.label} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm hover:border-indigo-300"><input type="radio" name="greeting" checked={selectedGreeting === choice.label} onChange={() => setSelectedGreeting(choice.label)} />{choice.label}</label>)}</div>
            <button type="button" disabled={!selectedGreeting} onClick={checkGreeting} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Check answer</button>
            {greetingChecked && <p className={greetingChoices.find((choice) => choice.label === selectedGreeting)?.correct ? "mt-4 font-medium text-emerald-700" : "mt-4 font-medium text-amber-700"}>{greetingChoices.find((choice) => choice.label === selectedGreeting)?.correct ? "Correct. This is a natural response when you meet someone." : "Try again. “Nice to meet you” is the natural response here."}</p>}
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold tracking-[.14em] text-indigo-700">3 · SAY IT ALOUD</p>
            <h2 className="mt-2 text-xl font-bold">Speak with a clear rhythm</h2>
            <p className="mt-2 rounded-xl bg-amber-50 p-4 text-slate-700">Say: <strong>“Hello, I&apos;m [your name]. Nice to meet you.”</strong></p>
            <p className="mt-4 text-sm leading-6 text-slate-600">Stress the important words: <strong>HEL-lo</strong>, <strong>NAME</strong>, <strong>NICE</strong>, <strong>MEET</strong>. Your goal is clear communication—not copying another person&apos;s accent.</p>
            <button type="button" onClick={completeSpeaking} className="mt-5 rounded-xl border border-indigo-300 px-5 py-3 text-sm font-bold text-indigo-800">{speakingCompleted ? "Practice recorded ✓" : "I said it aloud"}</button>
          </article>

          <article className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-bold tracking-[.14em] text-sky-200">CREATE & APPLY</p>
            <h2 className="mt-2 text-xl font-bold">Write your two-sentence introduction</h2>
            <p className="mt-2 text-sm text-slate-300">Example: “Hello, I&apos;m Ana. I&apos;m from Santo Domingo.”</p>
            <label className="mt-5 block text-sm font-semibold" htmlFor="introduction">Your introduction</label>
            <textarea id="introduction" value={introduction} onChange={(event) => setIntroduction(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-white/20 bg-white p-3 text-slate-950" placeholder="Hello, I&apos;m…" />
            <button type="button" disabled={introduction.trim().length < 12} onClick={submitCreateApply} className="mt-4 rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-500">{createSubmitted ? "Submitted ✓" : "Submit my introduction"}</button>
            {createSubmitted && <p className="mt-4 text-sm text-teal-100">You communicated a real message. Next, you will practise asking another person the same question.</p>}
          </article>
        </section>
      </div>
    </main>
  );
}

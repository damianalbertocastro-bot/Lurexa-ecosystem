"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type Goal = "daily_life" | "work" | "travel" | "study";
type StartingPoint = "beginner" | "start_check";
type PlacementAnswer = "nice_to_meet_you" | "fine_thanks" | "i_live_in" | "i_live" | "are" | "is" | "going_to" | "go";

const goalOptions: Array<{ value: Goal; label: string; description: string }> = [
  { value: "daily_life", label: "Daily life", description: "Talk with people, manage everyday situations, and feel more independent." },
  { value: "work", label: "Work", description: "Communicate more confidently in professional situations." },
  { value: "travel", label: "Travel", description: "Use English comfortably when you travel or meet visitors." },
  { value: "study", label: "Study", description: "Build a foundation for classes, tests, or future goals." },
];

const startCheck: Array<{ prompt: string; options: Array<{ value: PlacementAnswer; label: string }> }> = [
  { prompt: "Someone says: “Hi, I’m Laura. Nice to meet you.” What is the best response?", options: [{ value: "nice_to_meet_you", label: "Nice to meet you, too." }, { value: "fine_thanks", label: "I’m fine, thank you." }] },
  { prompt: "Choose the sentence that describes where you live.", options: [{ value: "i_live_in", label: "I live in Santo Domingo." }, { value: "i_live", label: "I live Santo Domingo." }] },
  { prompt: "Choose the question that asks about someone’s plans.", options: [{ value: "are", label: "What are you going to do this weekend?" }, { value: "is", label: "What is you going to do this weekend?" }] },
  { prompt: "Complete the sentence: “I’m ___ meet my friend at three.”", options: [{ value: "going_to", label: "going to" }, { value: "go", label: "go" }] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal>("daily_life");
  const [startingPoint, setStartingPoint] = useState<StartingPoint>("beginner");
  const [placementAnswers, setPlacementAnswers] = useState<PlacementAnswer[]>([]);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => AuthService.onUserChanged((user) => {
    if (!user) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }), [router]);

  async function startLearning() {
    setSubmitting(true);
    setError("");
    try {
      const response = await authenticatedFetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, ...(startingPoint === "start_check" ? { placementAnswers } : {}) }),
      });
      const payload = await response.json() as { courseId?: string; lessonId?: string; recommendation?: { level: "A1" | "A2" }; error?: string };
      if (!response.ok || !payload.courseId || !payload.lessonId) {
        throw new Error(payload.error ?? "Unable to create your learning path.");
      }
      router.replace(`/learn/${payload.courseId}/${payload.lessonId}?startingLevel=${payload.recommendation?.level ?? "A1"}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create your learning path.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <main className="min-h-screen bg-[var(--learn-canvas)] p-8 text-slate-600">Preparing your learning path…</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-2xl">
        <p className="text-xs font-bold tracking-[.16em] text-indigo-700">YOUR STARTING POINT</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--learn-ink)]">What do you want English to help you do?</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">Choose the goal that matters most right now, then choose a starting route. A short check can recommend the available early A2 path, but it does not certify a CEFR level.</p>

        <div className="mt-8 grid gap-3">
          {goalOptions.map((option) => (
            <label key={option.value} className={`cursor-pointer rounded-2xl border bg-white p-5 transition ${goal === option.value ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-300"}`}>
              <input className="sr-only" type="radio" name="goal" value={option.value} checked={goal === option.value} onChange={() => setGoal(option.value)} />
              <span className="block text-lg font-bold text-slate-900">{option.label}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">{option.description}</span>
            </label>
          ))}
        </div>

        <fieldset className="mt-8 space-y-3">
          <legend className="text-lg font-bold text-[var(--learn-ink)]">Where should we start?</legend>
          <label className={`block cursor-pointer rounded-2xl border bg-white p-5 transition ${startingPoint === "beginner" ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-300"}`}>
            <input className="mr-3" type="radio" name="starting-point" checked={startingPoint === "beginner"} onChange={() => setStartingPoint("beginner")} />
            <span className="font-bold text-slate-900">I’m new to English</span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">Start with the practical A1 foundations lesson.</span>
          </label>
          <label className={`block cursor-pointer rounded-2xl border bg-white p-5 transition ${startingPoint === "start_check" ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-300"}`}>
            <input className="mr-3" type="radio" name="starting-point" checked={startingPoint === "start_check"} onChange={() => setStartingPoint("start_check")} />
            <span className="font-bold text-slate-900">I know some English</span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">Take four quick questions for a provisional A1 or early A2 recommendation.</span>
          </label>
        </fieldset>

        {startingPoint === "start_check" && <fieldset className="mt-8 space-y-6 rounded-2xl border border-indigo-100 bg-white p-5"><legend className="px-2 text-lg font-bold text-[var(--learn-ink)]">Quick start check</legend>{startCheck.map((question, index) => <div key={question.prompt}><p className="font-semibold text-slate-900">{index + 1}. {question.prompt}</p><div className="mt-3 grid gap-2">{question.options.map((option) => <label key={option.value} className={`cursor-pointer rounded-xl border p-3 text-sm ${placementAnswers[index] === option.value ? "border-indigo-500 bg-indigo-50" : "border-slate-200"}`}><input className="mr-3" type="radio" name={`placement-${index}`} checked={placementAnswers[index] === option.value} onChange={() => setPlacementAnswers((answers) => { const next = [...answers]; next[index] = option.value; return next; })} />{option.label}</label>)}</div></div>)}</fieldset>}

        {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

        <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
          <p className="font-bold">{startingPoint === "beginner" ? "Your first lesson: Introduce yourself" : "Your next lesson is based on your start check"}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{startingPoint === "beginner" ? "You will greet someone, say your name, practise a clear spoken introduction, and create a real two-sentence message." : "Your answers create a provisional recommendation. Future speaking and listening evidence can refine your path."}</p>
          <button type="button" onClick={startLearning} disabled={submitting || (startingPoint === "start_check" && placementAnswers.length !== startCheck.length)} className="mt-5 rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-500">{submitting ? "Creating your path…" : startingPoint === "beginner" ? "Start my A1 lesson" : "Get my recommendation"}</button>
        </div>
      </section>
    </main>
  );
}

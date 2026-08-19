"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type Goal = "daily_life" | "work" | "travel" | "study";

const goalOptions: Array<{ value: Goal; label: string; description: string }> = [
  { value: "daily_life", label: "Daily life", description: "Talk with people, manage everyday situations, and feel more independent." },
  { value: "work", label: "Work", description: "Communicate more confidently in professional situations." },
  { value: "travel", label: "Travel", description: "Use English comfortably when you travel or meet visitors." },
  { value: "study", label: "Study", description: "Build a foundation for classes, tests, or future goals." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal>("daily_life");
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
        body: JSON.stringify({ goal }),
      });
      const payload = await response.json() as { courseId?: string; lessonId?: string; error?: string };
      if (!response.ok || !payload.courseId || !payload.lessonId) {
        throw new Error(payload.error ?? "Unable to create your learning path.");
      }
      router.replace(`/learn/${payload.courseId}/${payload.lessonId}`);
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
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">Choose the goal that matters most right now. You are starting on the beginner path; this helps Lurexa make your next activities more relevant.</p>

        <div className="mt-8 grid gap-3">
          {goalOptions.map((option) => (
            <label key={option.value} className={`cursor-pointer rounded-2xl border bg-white p-5 transition ${goal === option.value ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-300"}`}>
              <input className="sr-only" type="radio" name="goal" value={option.value} checked={goal === option.value} onChange={() => setGoal(option.value)} />
              <span className="block text-lg font-bold text-slate-900">{option.label}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">{option.description}</span>
            </label>
          ))}
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

        <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
          <p className="font-bold">Your first lesson: Introduce yourself</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">You will greet someone, say your name, practise a clear spoken introduction, and create a real two-sentence message.</p>
          <button type="button" onClick={startLearning} disabled={submitting} className="mt-5 rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-500">{submitting ? "Creating your path…" : "Start my A1 lesson"}</button>
        </div>
      </section>
    </main>
  );
}

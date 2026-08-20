"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

type Goal = "daily_life" | "work" | "travel" | "study";

type PlacementQuestion = {
  id: number;
  prompt: string;
  options: { label: string; value: string }[];
};

const placementQuestions: PlacementQuestion[] = [
  {
    id: 1,
    prompt: "Someone says: 'Hi! I'm Maria. Nice to meet you.' What do you say?",
    options: [
      { label: "Nice to meet you too.", value: "nice_to_meet_you" },
      { label: "I am fine, thank you.", value: "fine_thanks" },
    ],
  },
  {
    id: 2,
    prompt: "Complete the sentence: '___ in Santo Domingo.'",
    options: [
      { label: "I live", value: "i_live_in" },
      { label: "I living", value: "i_live" },
    ],
  },
  {
    id: 3,
    prompt: "Which word completes: 'Where ___ you from?'",
    options: [
      { label: "are", value: "are" },
      { label: "is", value: "is" },
    ],
  },
  {
    id: 4,
    prompt: "Complete the plan: 'Tomorrow I am ___ study English.'",
    options: [
      { label: "going to", value: "going_to" },
      { label: "go", value: "go" },
    ],
  },
];

const goalOptions: { value: Goal; title: string; desc: string; icon: string }[] = [
  {
    value: "daily_life",
    title: "Daily Life & Conversation",
    desc: "Speak comfortably in everyday situations, with neighbors, friends, and family.",
    icon: "💬",
  },
  {
    value: "work",
    title: "Work & Career Growth",
    desc: "Communicate professionally in workplace emails, calls, and meetings.",
    icon: "💼",
  },
  {
    value: "travel",
    title: "Travel & Exploration",
    desc: "Navigate airports, hotels, restaurants, and directions while traveling.",
    icon: "✈️",
  },
  {
    value: "study",
    title: "Study & Academics",
    desc: "Prepare for English exams, academic reading, and educational goals.",
    icon: "🎓",
  },
];

export default function OnboardingPage() {
  const router = Router();
  const [step, setStep] = useState<"goal" | "placement" | "submitting">("goal");
  const [selectedGoal, setSelectedGoal] = useState<Goal>("daily_life");
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    return AuthService.onUserChanged((user) => {
      setSignedIn(Boolean(user));
    });
  }, []);

  function handleOptionSelect(questionIndex: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = value;
      return next;
    });
  }

  async function handleSubmitOnboarding() {
    setError(null);
    setStep("submitting");

    try {
      if (signedIn) {
        const response = await authenticatedFetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal: selectedGoal,
            placementAnswers: answers,
          }),
        });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to save onboarding selection.");
        }
      }

      // Seamlessly transition to the A1 vertical slice lesson
      router.push("/learn/english-a1/introduce-yourself");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("placement");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header Branding */}
        <header className="mb-10 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-sky-400">LUREXA LEARN · PERSONALIZED PATH</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {step === "goal" ? "What is your main English goal?" : "Quick 1-Minute Placement Check"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {step === "goal"
              ? "Every Lurexa experience adapts around your goals and evolving learner context."
              : "Answer 4 short questions so we can start your path at the exact right spot."}
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-200">
            {error}
          </div>
        )}

        {/* Step 1: Goal Selection */}
        {step === "goal" && (
          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {goalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedGoal(option.value)}
                  className={`flex flex-col text-left rounded-2xl p-5 border transition-all ${
                    selectedGoal === option.value
                      ? "border-sky-400 bg-sky-500/10 ring-2 ring-sky-400/50"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="text-3xl mb-3">{option.icon}</span>
                  <h2 className="text-lg font-bold text-white">{option.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{option.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between pt-4">
              <Link href="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-white">
                Skip to Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setStep("placement")}
                className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-sky-300 transition"
              >
                Continue to Placement →
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Placement Questions */}
        {step === "placement" && (
          <section className="space-y-6">
            {placementQuestions.map((q, idx) => (
              <article key={q.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
                <p className="text-xs font-bold text-sky-400">QUESTION {idx + 1} OF 4</p>
                <h2 className="mt-2 text-base font-semibold text-white">{q.prompt}</h2>
                <div className="mt-4 space-y-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition ${
                        answers[idx] === opt.value
                          ? "border-sky-400 bg-sky-500/20 text-white ring-1 ring-sky-400"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={answers[idx] === opt.value}
                        onChange={() => handleOptionSelect(idx, opt.value)}
                        className="accent-sky-400"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </article>
            ))}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep("goal")}
                className="text-sm font-semibold text-slate-400 hover:text-white"
              >
                ← Back to Goal
              </button>
              <button
                type="button"
                disabled={answers.some((a) => !a)}
                onClick={handleSubmitOnboarding}
                className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-sky-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start My A1 Foundation Path →
              </button>
            </div>
          </section>
        )}

        {/* Submitting state */}
        {step === "submitting" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent mb-4" />
            <h2 className="text-xl font-bold">Initializing your personalized path…</h2>
            <p className="mt-2 text-sm text-slate-400">
              Saving goal and starting context into your single Learner Model.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function Router() {
  return useRouter();
}

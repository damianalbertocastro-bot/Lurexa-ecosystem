"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";
import { Button } from "@lurexa/ui/button";

type Goal = "daily_life" | "work" | "travel" | "study";
type StartingPoint = "beginner" | "placement";
type Dialect = "es-DO" | "es-PR" | "es-MX" | "es-CO";

const onboardingIntentKey = "lurexa_onboarding_intent";

const dialectOptions: Array<{ value: Dialect; label: string; description: string; flag: string }> = [
  { value: "es-DO", label: "Dominican Republic", description: "Tailors phonetics to Caribbean rhythm, coda /s/ clarity, and rhotic pronunciation.", flag: "🇩🇴" },
  { value: "es-PR", label: "Puerto Rico", description: "Adapts to Caribbean cadence, lateralization patterns, and syllable timing.", flag: "🇵🇷" },
  { value: "es-MX", label: "Mexico", description: "Optimizes for continental vowel reduction, consonant retention, and /v/ vs /b/ clarity.", flag: "🇲🇽" },
  { value: "es-CO", label: "Colombia", description: "Calibrated for clear consonant articulation, /z/ voicing, and intonation control.", flag: "🇨🇴" },
];

const goalOptions: Array<{ value: Goal; label: string; description: string; icon: string }> = [
  { value: "daily_life", label: "Daily life", description: "Talk with people, manage everyday situations, and feel more independent.", icon: "💬" },
  { value: "work", label: "Work & Career", description: "Communicate more confidently in professional and workplace situations.", icon: "💼" },
  { value: "travel", label: "Travel & Culture", description: "Use English comfortably when you travel or meet international visitors.", icon: "✈️" },
  { value: "study", label: "Academic & Exams", description: "Build an advanced foundation for classes, tests, or academic goals.", icon: "🎓" },
];

function readOnboardingIntent(value: string | null): { goal: Goal; startingPoint: StartingPoint; dialect: Dialect } | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    const candidate = parsed as { goal?: unknown; startingPoint?: unknown; dialect?: unknown };
    const goal = goalOptions.find((option) => option.value === candidate.goal)?.value ?? "daily_life";
    const dialect = dialectOptions.find((opt) => opt.value === candidate.dialect)?.value ?? "es-DO";
    const startingPoint = candidate.startingPoint === "beginner" ? "beginner" : "placement";
    return { goal, startingPoint, dialect };
  } catch {
    return null;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [dialect, setDialect] = useState<Dialect>("es-DO");
  const [goal, setGoal] = useState<Goal>("daily_life");
  const [startingPoint, setStartingPoint] = useState<StartingPoint>("placement");
  const [currentUser, setCurrentUser] = useState<unknown | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return AuthService.onUserChanged((user) => {
      const intent = readOnboardingIntent(window.localStorage.getItem(onboardingIntentKey));
      if (intent) {
        setGoal(intent.goal);
        setStartingPoint(intent.startingPoint);
        setDialect(intent.dialect);
      }
      setCurrentUser(user);
      setReady(true);
    });
  }, []);

  async function handleStart() {
    setSubmitting(true);
    setError("");
    try {
      // If learner chose Placement Test (L-PDA)
      if (startingPoint === "placement") {
        if (typeof window !== "undefined") {
          localStorage.setItem(onboardingIntentKey, JSON.stringify({ goal, startingPoint, dialect }));
        }
        if (!currentUser) {
          router.push(`/signup?returnUrl=${encodeURIComponent(`/placement?goal=${goal}&dialect=${dialect}&autostart=1`)}`);
          return;
        }
        // If authenticated, route directly to the interactive placement assessment
        window.localStorage.removeItem(onboardingIntentKey);
        router.push(`/placement?goal=${goal}&dialect=${dialect}&autostart=1`);
        return;
      }

      // If learner chose beginner A1 Foundations
      if (!currentUser) {
        if (typeof window !== "undefined") {
          localStorage.setItem(onboardingIntentKey, JSON.stringify({ goal, startingPoint, dialect }));
        }
        router.push("/signup");
        return;
      }

      const response = await authenticatedFetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, dialect }),
      });
      const payload = (await response.json()) as {
        courseId?: string;
        lessonId?: string;
        recommendation?: { level: "A1" | "A2" };
        error?: string;
      };
      if (!response.ok || !payload.courseId || !payload.lessonId) {
        throw new Error(payload.error ?? "Unable to create your learning path.");
      }
      window.localStorage.removeItem(onboardingIntentKey);
      router.replace(`/learn/${payload.courseId}/${payload.lessonId}?startingLevel=${payload.recommendation?.level ?? "A1"}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create your learning path.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--learn-canvas)] p-8 text-[var(--lx-muted)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-semibold">Preparing your learning path…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-700">
          <span>🚀</span>
          YOUR STARTING POINT
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--lx-ink)] sm:text-4xl">
          Personalize your learning path.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--lx-muted)]">
          Lurexa adapts phonetics, vocabulary transfer, and speaking coaching to your native Spanish variety and personal goals.
        </p>

        {/* 1. Spanish Variety Profile Selection */}
        <div className="mt-10 space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[var(--lx-ink)]">
            1. What Spanish variety do you speak?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dialectOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition ${
                  dialect === opt.value
                    ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] shadow-md ring-2 ring-[var(--lx-primary)]/20"
                    : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-[var(--lx-primary)]/40"
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="dialect"
                  value={opt.value}
                  checked={dialect === opt.value}
                  onChange={() => setDialect(opt.value)}
                />
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{opt.flag}</span>
                  <span className="font-bold text-[var(--lx-ink)]">{opt.label}</span>
                </div>
                <span className="mt-2 block text-xs leading-5 text-[var(--lx-muted)]">
                  {opt.description}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 2. English Goal Selection */}
        <div className="mt-10 space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[var(--lx-ink)]">
            2. What do you want English to help you do?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {goalOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition ${
                  goal === option.value
                    ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] shadow-md ring-2 ring-[var(--lx-primary)]/20"
                    : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-[var(--lx-primary)]/40"
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="goal"
                  value={option.value}
                  checked={goal === option.value}
                  onChange={() => setGoal(option.value)}
                />
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-bold text-[var(--lx-ink)]">{option.label}</span>
                </div>
                <span className="mt-2 block text-xs leading-5 text-[var(--lx-muted)]">
                  {option.description}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Starting Path Selection (A1 vs L-PDA Placement Assessment) */}
        <div className="mt-10 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[var(--lx-ink)]">
            3. Where should we start?
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* OPTION A: Placement Test (Recommended for anyone with prior knowledge) */}
            <label
              className={`relative flex cursor-pointer flex-col justify-between rounded-3xl border p-6 transition ${
                startingPoint === "placement"
                  ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] shadow-lg ring-2 ring-[var(--lx-primary)]/25"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-[var(--lx-primary)]/50"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="starting-point"
                checked={startingPoint === "placement"}
                onChange={() => setStartingPoint("placement")}
              />
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-800">
                    🎯 Recommended
                  </span>
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="mt-3 text-lg font-black text-[var(--lx-ink)]">
                  I know some English
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--lx-muted)]">
                  Take our comprehensive <strong>Placement & Diagnostic Assessment (L-PDA)</strong> across 7 English skills (Listening, Speaking, Reading, Writing, Vocabulary, Grammar, Phonetics).
                </p>
                <div className="mt-4 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-[11px] text-[var(--lx-muted)] space-y-1">
                  <p className="font-bold text-[var(--lx-ink)]">✦ Multi-Skill Calibration (A1–C2)</p>
                  <p>Includes live audio probes, acoustic speech analysis, and Dominican Spanish L1 transfer markers.</p>
                </div>
              </div>
            </label>

            {/* OPTION B: Absolute Beginner */}
            <label
              className={`relative flex cursor-pointer flex-col justify-between rounded-3xl border p-6 transition ${
                startingPoint === "beginner"
                  ? "border-[var(--lx-primary)] bg-[var(--lx-surface)] shadow-lg ring-2 ring-[var(--lx-primary)]/25"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-[var(--lx-primary)]/50"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="starting-point"
                checked={startingPoint === "beginner"}
                onChange={() => setStartingPoint("beginner")}
              />
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-indigo-700">
                    A1 Foundations
                  </span>
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="mt-3 text-lg font-black text-[var(--lx-ink)]">
                  I’m new to English
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--lx-muted)]">
                  Start from the absolute basics with practical A1 Foundations: real greetings, introducing yourself, and core conversational phrases.
                </p>
                <div className="mt-4 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-[11px] text-[var(--lx-muted)] space-y-1">
                  <p className="font-bold text-[var(--lx-ink)]">✦ Lesson 1: Real Introductions</p>
                  <p>Step-by-step interactive exercises without skipping prerequisite vocabulary.</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">
            {error}
          </div>
        )}

        {/* Action Panel */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-[var(--lx-primary)] p-7 text-white shadow-xl sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {startingPoint === "placement" ? "🎯 Diagnostic Placement" : "🌱 Foundations Starting Point"}
              </p>
              <h3 className="mt-1 text-xl font-black">
                {startingPoint === "placement"
                  ? "Launch Placement & Diagnostic Assessment (L-PDA)"
                  : "Begin Lesson 1: Introduce Yourself"}
              </h3>
              <p className="mt-1 text-xs text-indigo-100 max-w-lg leading-relaxed">
                {startingPoint === "placement"
                  ? "Evaluates your listening, phonetics, and grammar in 5–8 minutes to unlock your calibrated course and custom learner model."
                  : "Jump straight into your first structured lesson and start earning momentum rewards."}
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={handleStart}
              disabled={submitting}
              className="whitespace-nowrap rounded-2xl px-7 py-4 text-sm font-black shadow-lg transition hover:brightness-110"
            >
              {submitting
                ? "Launching…"
                : startingPoint === "placement"
                ? "Start Placement Test (L-PDA) →"
                : "Start my A1 lesson →"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

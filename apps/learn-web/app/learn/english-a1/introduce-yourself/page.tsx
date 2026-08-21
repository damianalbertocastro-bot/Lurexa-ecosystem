"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AuthService } from "@lurexa/backend";
import { authenticatedFetch } from "../../../../lib/authenticated-fetch";

type VocabPair = {
  term: string;
  meaning: string;
  audioHint: string;
};

type QuizQuestion = {
  id: number;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

const vocabList: VocabPair[] = [
  { term: "Hello", meaning: "Greeting (neutral / formal)", audioHint: "hel-LOH" },
  { term: "Nice to meet you", meaning: "Polite phrase when meeting someone", audioHint: "NICE to MEET you" },
  { term: "I'm...", meaning: "Short form of 'I am' to give your name", audioHint: "EYE-m" },
  { term: "How are you?", meaning: "Asking about someone's wellbeing", audioHint: "HOW-er-YOO" },
];

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Ana says: 'Hi! I'm Ana.' What is the best natural response?",
    options: ["Nice to meet you, Ana. I'm Carlos.", "Yes, I am fine today.", "See you yesterday."],
    answer: "Nice to meet you, Ana. I'm Carlos.",
    explanation: "Responding with 'Nice to meet you' and stating your name is the natural greeting.",
  },
  {
    id: 2,
    prompt: "Which sentence correctly introduces your name?",
    options: ["I am call Luis.", "I'm Luis. / My name is Luis.", "Me name is Luis."],
    answer: "I'm Luis. / My name is Luis.",
    explanation: "Use 'I'm [name]' or 'My name is [name]'.",
  },
  {
    id: 3,
    prompt: "In English pronunciation, which syllable is stressed in 'Hello'?",
    options: ["The second syllable: hel-LO", "The first syllable: HEL-lo", "Both syllables equally"],
    answer: "The second syllable: hel-LO",
    explanation: "In natural English speech, stress falls on the second syllable: hel-LO.",
  },
];

export default function A1IntroduceYourselfPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [contextMessage, setContextMessage] = useState<string | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null);
  const [vocabCompleted, setVocabCompleted] = useState(false);
  const [phoneticsSpoken, setPhoneticsSpoken] = useState(false);
  const [createApplyText, setCreateApplyText] = useState("");
  const [createApplySubmitted, setCreateApplySubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    return AuthService.onUserChanged((user) => {
      setSignedIn(Boolean(user));

      if (!user) {
        setContextMessage(null);
        return;
      }

      void (async () => {
        try {
          const response = await authenticatedFetch(
            "/api/learner-context?purpose=learn_adaptive_practice&domain=curriculum",
          );
          if (!response.ok) throw new Error("Context unavailable");

          const data = (await response.json()) as {
            context?: { curriculum?: { lessonId?: string } };
          };

          const lessonId = data.context?.curriculum?.lessonId;
          setContextMessage(
            lessonId
              ? `Continuing path from previous context (${lessonId}).`
              : "Your progress evidence will save to your personal Learner Model.",
          );
        } catch {
          setContextMessage("Your progress evidence will save to your personal Learner Model.");
        }
      })();
    });
  }, []);

  async function sendEvidence(eventType: string, payload: Record<string, unknown>) {
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
            lessonId: "a1-unit1-introduce-yourself",
          },
          payload,
          idempotencyKey: `a1-unit1:${eventType}:${Date.now()}`,
        }),
      });

      if (!response.ok) throw new Error("Evidence rejection");
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function handleVocabComplete() {
    setVocabCompleted(true);
    void sendEvidence("vocabulary_practice.completed", {
      activityId: "vocab-matching-a1-unit1",
      masteredTerms: vocabList.map((item) => item.term),
      competencyIds: ["EN-A1-VOC-INTRO-01"],
    });
  }

  function handlePhoneticsSpoken() {
    setPhoneticsSpoken(true);
    void sendEvidence("phonetics_practice.completed", {
      activityId: "phonetics-vowel-stress",
      focus: "intelligibility_and_stress",
      l1Profile: "dominican_spanish",
      target: "hel-LO / NICE to MEET you",
      competencyIds: ["EN-A1-PHON-INTRO-01"],
    });
  }

  function handleCreateApplySubmit() {
    const text = createApplyText.trim();
    if (text.length < 10) return;

    setCreateApplySubmitted(true);
    void sendEvidence("create_apply.submitted", {
      activityId: "create-apply-introduction",
      text,
      characterCount: text.length,
      competencyIds: ["EN-A1-WRT-INTRO-01", "EN-A1-SPK-INTRO-01"],
    });
  }

  function handleQuizSubmit() {
    const score = quizQuestions.reduce(
      (total, question) => total + (quizAnswers[question.id] === question.answer ? 1 : 0),
      0,
    );

    setQuizScore(score);
    setQuizSubmitted(true);
    void sendEvidence("quiz.completed", {
      quizId: "a1-unit1-quiz",
      score,
      total: quizQuestions.length,
      passed: score >= 2,
      competencyIds: ["EN-A1-SPK-INTRO-01", "EN-A1-PHON-INTRO-01"],
    });
  }

  const completedSteps = useMemo(
    () => [vocabCompleted, phoneticsSpoken, createApplySubmitted, quizSubmitted].filter(Boolean).length,
    [vocabCompleted, phoneticsSpoken, createApplySubmitted, quizSubmitted],
  );

  const saveStatus =
    saveState === "saving"
      ? "Saving evidence…"
      : saveState === "saved"
        ? "Evidence saved to Core ✓"
        : saveState === "error"
          ? "Evidence could not be saved"
          : "Connected";

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-8 text-slate-950 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center justify-between" aria-label="Lesson navigation">
          <Link href="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            ← Back to My Learning Space
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>A1 UNIT 1</span> · <span>LESSON 1</span>
          </div>
        </nav>

        <header className="mb-8 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-sky-400">LESSON 1 · 15 MIN</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Introduce Yourself &amp; Greet People</h1>
          <p className="mt-2 text-sm text-slate-300">
            Learn to say your name, greet others naturally, and pronounce English stress patterns with confidence.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs font-medium text-slate-300">
            <span>Progress: {completedSteps} / 4 Activities</span>
            {signedIn ? (
              <span className={saveState === "error" ? "text-rose-300" : "text-teal-300"} role="status">
                {saveStatus}
              </span>
            ) : (
              <span>
                <Link href="/login" className="text-sky-300 underline">Sign in</Link> to save progress
              </span>
            )}
          </div>
          {contextMessage && <p className="mt-2 text-xs text-sky-200">{contextMessage}</p>}
        </header>

        <div className="space-y-8">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-600">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5">STAGE 1</span>
              <span>NOTICE THE DIALOGUE</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Meeting someone for the first time</h2>
            <div className="mt-4 space-y-3 rounded-2xl bg-sky-50/80 p-5 text-sm text-slate-800">
              <p><strong>Carlos:</strong> Hi! I&apos;m Carlos. What&apos;s your name?</p>
              <p><strong>Elena:</strong> Hello Carlos! I&apos;m Elena. Nice to meet you.</p>
              <p><strong>Carlos:</strong> Nice to meet you too, Elena!</p>
            </div>
            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-indigo-900">
              <p className="font-bold">Key Pattern:</p>
              <p className="mt-1">Use <strong>I&apos;m [name]</strong> or <strong>My name is [name]</strong>. Use <strong>Nice to meet you</strong> as a polite response.</p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-600">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5">STAGE 2</span>
              <span>VOCABULARY IN CONTEXT</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Explore key greeting phrases</h2>
            <p className="mt-1 text-sm text-slate-600">Select a phrase to review its stress guidance and meaning.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {vocabList.map((vocab) => (
                <button
                  key={vocab.term}
                  type="button"
                  aria-pressed={selectedVocab === vocab.term}
                  onClick={() => setSelectedVocab(vocab.term)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedVocab === vocab.term
                      ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-900">{vocab.term}</span>
                    <span className="font-mono text-xs font-medium text-indigo-600">{vocab.audioHint}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{vocab.meaning}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleVocabComplete}
              className={`mt-6 w-full rounded-2xl py-3 text-sm font-bold transition ${
                vocabCompleted ? "bg-emerald-100 text-emerald-800" : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              {vocabCompleted ? "Vocabulary Completed ✓" : "Mark Vocabulary Mastered"}
            </button>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-600">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-800">STAGE 3</span>
              <span>PHONETICS &amp; SPEAKING RHYTHM</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Pronunciation &amp; Word Stress</h2>
            <div className="mt-4 space-y-3 rounded-2xl bg-amber-50/80 p-5 text-sm text-slate-800">
              <p className="font-semibold text-amber-900">Linguistic tip for Spanish speakers:</p>
              <p className="text-xs leading-relaxed text-slate-700">
                Spanish is often more syllable-timed than English. English relies more heavily on stressed syllables and reduced unstressed syllables. Practice <strong>hel-LO</strong> and <strong>NICE to MEET you</strong> without trying to erase your accent.
              </p>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-xs font-bold text-slate-500">PRACTICE SENTENCE</p>
              <p className="mt-2 text-lg font-bold text-slate-900">“Hello! I&apos;m <span className="text-indigo-600">[your name]</span>. Nice to meet you.”</p>
              <p className="mt-1 text-xs text-slate-500">Focus on communicative clarity and natural stress.</p>
              <button
                type="button"
                onClick={handlePhoneticsSpoken}
                className={`mt-4 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition ${
                  phoneticsSpoken ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
              >
                <span aria-hidden="true">🎙️</span>
                <span>{phoneticsSpoken ? "Spoken Practice Recorded ✓" : "I Said It Aloud"}</span>
              </button>
            </div>
          </section>

          <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-md sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal-400">
              <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5">STAGE 4</span>
              <span>CREATE &amp; APPLY</span>
            </div>
            <h2 className="mt-3 text-xl font-bold">Write Your Introduction</h2>
            <p className="mt-1 text-sm text-slate-300">Write 2 sentences introducing yourself and saying where you are from.</p>
            <div className="mt-4 space-y-3">
              <label htmlFor="learner-introduction" className="sr-only">Your introduction</label>
              <textarea
                id="learner-introduction"
                value={createApplyText}
                onChange={(event) => setCreateApplyText(event.target.value)}
                rows={3}
                placeholder="Hello, I'm... I am from..."
                className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none"
              />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Minimum 10 characters</span>
                <span>{createApplyText.trim().length} characters</span>
              </div>
              <button
                type="button"
                disabled={createApplyText.trim().length < 10}
                onClick={handleCreateApplySubmit}
                className="w-full rounded-2xl bg-teal-400 py-3 text-sm font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createApplySubmitted ? "Submitted to Evidence ✓" : "Submit Introduction"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-600">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5">STAGE 5</span>
              <span>FORMATIVE QUIZ</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Check Your Knowledge</h2>
            <div className="mt-6 space-y-6">
              {quizQuestions.map((question) => (
                <fieldset key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                  <legend className="text-sm font-semibold text-slate-900">{question.id}. {question.prompt}</legend>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-xs font-medium transition ${
                          quizAnswers[question.id] === option
                            ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-500"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${question.id}`}
                          checked={quizAnswers[question.id] === option}
                          onChange={() => setQuizAnswers((previous) => ({ ...previous, [question.id]: option }))}
                          className="accent-indigo-600"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className="mt-3 text-xs text-slate-600">{question.explanation}</p>
                  )}
                </fieldset>
              ))}
            </div>
            <button
              type="button"
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              onClick={handleQuizSubmit}
              className="mt-6 w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {quizSubmitted ? `Quiz Submitted (Score: ${quizScore}/${quizQuestions.length}) ✓` : "Submit Quiz & Save Evidence"}
            </button>
            {quizSubmitted && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center" role="status">
                <p className="text-base font-bold text-emerald-900">🎉 Great Job! Lesson 1 Complete.</p>
                <p className="mt-1 text-xs text-emerald-700">Your lesson evidence has been submitted. Continue from your dashboard when you are ready.</p>
                <Link
                  href="/dashboard"
                  className="mt-4 inline-block rounded-xl border border-emerald-600 px-5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                >
                  View My Dashboard
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

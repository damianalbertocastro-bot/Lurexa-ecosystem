"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import type {
  LearnerLearningActivity,
  LearnerQuizContentBlockData,
  LearningCapability,
  Lesson,
  StudentProgress,
} from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";
import {
  AIRoleplayActivity,
  ModelListeningActivity,
  RecordedSpeakingActivity,
} from "./AdvancedLearningCapabilities";
import { InteractiveGrammarCard } from "./InteractiveGrammarCard";
import { Button } from "@lurexa/ui/button";

type LessonPayload = {
  lesson: Lesson;
  progress: StudentProgress | null;
  nextLesson: Lesson | null;
};

type Feedback = {
  passed: boolean;
  message: string;
  kind?: "error" | "notice";
};

type LessonRuntimeProps = {
  courseId: string;
  lessonId: string;
  retrievalScheduleId?: string;
};

function readError(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

function readText(data: Record<string, unknown>): string | null {
  return typeof data.text === "string" ? data.text : null;
}

function readMediaUrl(data: Record<string, unknown>): string | null {
  for (const key of ["url", "src", "videoUrl", "imageUrl"]) {
    if (typeof data[key] === "string") return data[key] as string;
  }
  return null;
}

function readQuiz(data: Record<string, unknown>): LearnerQuizContentBlockData | null {
  if (typeof data.prompt !== "string" || !Array.isArray(data.options) || !data.options.every((option) => typeof option === "string")) return null;
  return { prompt: data.prompt, options: data.options as string[] };
}

function readActivity(data: Record<string, unknown>): LearnerLearningActivity | null {
  const activity = data.activity;
  if (typeof activity !== "object" || activity === null || Array.isArray(activity)) return null;
  const candidate = activity as Partial<LearnerLearningActivity>;
  if (
    candidate.schemaVersion !== "1" ||
    typeof candidate.type !== "string" ||
    typeof candidate.stage !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.instructions !== "string" ||
    typeof candidate.prompt !== "string"
  ) {
    return null;
  }
  return candidate as LearnerLearningActivity;
}

function readCapability(data: Record<string, unknown>): LearningCapability | null {
  const capability = data.capability;
  if (typeof capability !== "object" || capability === null || Array.isArray(capability)) return null;
  const candidate = capability as Partial<LearningCapability>;
  if (
    candidate.schemaVersion !== "1" ||
    !["model_listening", "recorded_speaking", "ai_roleplay"].includes(candidate.kind ?? "") ||
    typeof candidate.id !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.instructions !== "string" ||
    !Array.isArray(candidate.competencyIds) ||
    !candidate.competencyIds.every((id) => typeof id === "string")
  ) {
    return null;
  }
  return candidate as LearningCapability;
}

function getStageBadge(stage?: string): { label: string; color: string; icon: string } {
  switch (stage) {
    case "CONTEXTUAL_INPUT":
      return { label: "Contextual Input", color: "bg-[var(--lx-info-surface)] text-[var(--lx-info)] border-[var(--lx-info)]/30", icon: "🎧" };
    case "COMPREHENSION":
      return { label: "Comprehension Check", color: "bg-[var(--lx-canvas)] text-[var(--lx-primary)] border-[var(--lx-primary)]/30", icon: "🎯" };
    case "GUIDED_PRACTICE":
      return { label: "Guided Practice", color: "bg-[var(--lx-canvas)] text-[var(--lx-secondary)] border-[var(--lx-secondary)]/30", icon: "🧩" };
    case "PHONETICS_FOCUS":
      return { label: "Phonetics & Pronunciation", color: "bg-[var(--lx-warning-surface)] text-[var(--lx-warning)] border-[var(--lx-warning)]/30", icon: "🗣️" };
    case "CONVERSATION":
      return { label: "AI Conversation", color: "bg-[var(--lx-canvas)] text-[var(--lx-accent)] border-[var(--lx-accent)]/30", icon: "💬" };
    case "CREATE_APPLY":
      return { label: "Create & Apply", color: "bg-[var(--lx-destructive-surface)] text-[var(--lx-destructive)] border-[var(--lx-destructive)]/30", icon: "✍️" };
    default:
      return { label: "Interactive Practice", color: "bg-[var(--lx-canvas)] text-[var(--lx-muted)] border-[var(--lx-border)]", icon: "⚡" };
  }
}

export function LessonRuntime({ courseId, lessonId, retrievalScheduleId }: LessonRuntimeProps) {
  const router = useRouter();
  const openedAt = useRef<number | null>(null);
  const [payload, setPayload] = useState<LessonPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [retrievalCompleted, setRetrievalCompleted] = useState(false);
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);
  const [incompleteTargetBlockId, setIncompleteTargetBlockId] = useState<string | null>(null);
  const [incompleteTargetTitle, setIncompleteTargetTitle] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) {
        setError("Sign in to continue this lesson.");
        setLoading(false);
        return;
      }

      openedAt.current = Date.now();
      try {
        const response = await authenticatedFetch(
          `/api/learning?courseId=${encodeURIComponent(courseId)}&lessonId=${encodeURIComponent(lessonId)}`
        );
        const body: unknown = await response.json();
        if (!response.ok) throw new Error(readError(body, "Unable to load this lesson."));
        const lessonPayload = body as LessonPayload;
        setPayload(lessonPayload);

        if (!lessonPayload.progress?.completed) {
          const startResponse = await authenticatedFetch("/api/learning", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "startLesson", courseId, lessonId }),
          });
          const startBody: unknown = await startResponse.json();
          if (!startResponse.ok) throw new Error(readError(startBody, "Unable to save lesson progress."));
          setPayload((current) => (current ? { ...current, progress: startBody as StudentProgress } : current));
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load this lesson.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [courseId, lessonId]);

  // Content blocks sorted
  const blocks = useMemo(() => {
    if (!payload?.lesson?.contentBlocks) return [];
    return [...payload.lesson.contentBlocks].sort((a, b) => a.order - b.order);
  }, [payload]);

  const totalInteractiveBlocks = useMemo(() => {
    return blocks.filter((b) => b.type === "interactive" || b.type === "quiz_embed").length;
  }, [blocks]);

  const completedInteractiveBlocks = useMemo(() => {
    if (!payload?.progress?.attempts) return 0;
    const completedIds = new Set(payload.progress.attempts.map((a) => a.quizId));
    return blocks.filter((b) => (b.type === "interactive" || b.type === "quiz_embed") && completedIds.has(b.id)).length;
  }, [blocks, payload]);

  const progressPercent = totalInteractiveBlocks > 0
    ? Math.min(100, Math.round((completedInteractiveBlocks / totalInteractiveBlocks) * 100))
    : 0;

  function scrollToBlock(blockId: string) {
    setHighlightedBlockId(blockId);
    const element = document.getElementById(`block-${blockId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setHighlightedBlockId((curr) => (curr === blockId ? null : curr));
    }, 4500);
  }

  function handleCapabilityCompleted(activityId: string, score: number = 100) {
    setPayload((current) => {
      if (!current) return current;
      const existingAttempts = current.progress?.attempts ?? [];
      const updatedAttempts = [
        ...existingAttempts.filter((a) => a.quizId !== activityId),
        {
          quizId: activityId,
          score: Math.max(0, Math.min(100, Math.round(score))),
          maxScore: 100,
          passed: score >= 60,
          completedAt: new Date().toISOString(),
          firstAttemptPassed: score >= 60,
          timeSpentSeconds: 15,
        },
      ];
      return {
        ...current,
        progress: current.progress
          ? {
              ...current.progress,
              attempts: updatedAttempts,
            }
          : null,
      };
    });
  }

  function handleSingleChoice(blockId: string, option: string) {
    setSelections((current) => ({ ...current, [blockId]: [option] }));
  }

  function handleMultipleChoice(blockId: string, option: string) {
    setSelections((current) => {
      const existing = current[blockId] ?? [];
      const updated = existing.includes(option)
        ? existing.filter((item) => item !== option)
        : [...existing, option];
      return { ...current, [blockId]: updated };
    });
  }

  function addSentenceToken(blockId: string, token: string) {
    setSelections((current) => {
      const existing = current[blockId] ?? [];
      return { ...current, [blockId]: [...existing, token] };
    });
  }

  function removeSentenceToken(blockId: string, indexToRemove: number) {
    setSelections((current) => {
      const existing = current[blockId] ?? [];
      return {
        ...current,
        [blockId]: existing.filter((_, index) => index !== indexToRemove),
      };
    });
  }

  function clearSentenceBuilder(blockId: string) {
    setSelections((current) => ({ ...current, [blockId]: [] }));
  }

  async function submitBlock(blockId: string, kind: "quiz" | "activity", activity?: LearnerLearningActivity) {
    const answers = selections[blockId] ?? [];
    if (!answers.length) {
      setFeedback((current) => ({
        ...current,
        [blockId]: { passed: false, message: "Choose or assemble an answer before submitting.", kind: "notice" },
      }));
      return;
    }

    setSubmittingId(blockId);
    try {
      const requestBody =
        kind === "quiz"
          ? { action: "submitQuizAttempt", courseId, lessonId, quizId: blockId, answer: answers[0] }
          : { action: "submitActivityAttempt", courseId, lessonId, activityId: blockId, answers };
      const response = await authenticatedFetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to submit this activity."));
      const result = body as { attempt: StudentProgress["attempts"][number]; explanation: string | null };
      const message =
        result.explanation ??
        (result.attempt.passed
          ? "Excellent! Your response is correct and saved to your learning evidence."
          : "Your attempt was saved. Review the clue and try again when you are ready.");
      setFeedback((current) => ({ ...current, [blockId]: { passed: result.attempt.passed, message, kind: "notice" } }));
      setPayload((current) =>
        current
          ? {
              ...current,
              progress: current.progress
                ? {
                    ...current.progress,
                    lastAccessedAt: result.attempt.completedAt,
                    attempts: [
                      ...current.progress.attempts.filter((a) => a.quizId !== blockId),
                      result.attempt,
                    ],
                  }
                : current.progress,
            }
          : current
      );
      if (activity?.type === "single_choice") setSelections((current) => ({ ...current, [blockId]: answers.slice(0, 1) }));
    } catch (caught) {
      setFeedback((current) => ({
        ...current,
        [blockId]: { passed: false, message: caught instanceof Error ? caught.message : "Unable to submit this activity.", kind: "error" },
      }));
    } finally {
      setSubmittingId(null);
    }
  }

  async function submitShortResponse(blockId: string) {
    const responseText = (responses[blockId] ?? "").trim();
    if (responseText.length < 8) {
      setFeedback((current) => ({
        ...current,
        [blockId]: { passed: false, message: "Write at least a full phrase (8+ characters) before saving.", kind: "notice" },
      }));
      return;
    }
    setSubmittingId(blockId);
    try {
      const response = await authenticatedFetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submitShortResponse", courseId, lessonId, activityId: blockId, response: responseText }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to submit this response."));
      const result = body as { attempt: StudentProgress["attempts"][number]; explanation: string | null };
      setFeedback((current) => ({
        ...current,
        [blockId]: { passed: true, message: result.explanation ?? "Your response was preserved as authentic productive evidence.", kind: "notice" },
      }));
      setPayload((current) =>
        current
          ? {
              ...current,
              progress: current.progress
                ? {
                    ...current.progress,
                    lastAccessedAt: result.attempt.completedAt,
                    attempts: [
                      ...current.progress.attempts.filter((a) => a.quizId !== blockId),
                      result.attempt,
                    ],
                  }
                : current.progress,
            }
          : current
      );
    } catch (caught) {
      setFeedback((current) => ({
        ...current,
        [blockId]: { passed: false, message: caught instanceof Error ? caught.message : "Unable to submit this response.", kind: "error" },
      }));
    } finally {
      setSubmittingId(null);
    }
  }

  async function finish() {
    if (!payload || completing) return;
    setCompleting(true);
    try {
      if (retrievalScheduleId) {
        const response = await authenticatedFetch("/api/learning/adaptation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "completeRetrieval", scheduleId: retrievalScheduleId }),
        });
        const body: unknown = await response.json();
        if (!response.ok) throw new Error(readError(body, "Unable to complete this retrieval check."));
        setRetrievalCompleted(true);
        setFeedback((current) => ({
          ...current,
          completion: {
            passed: true,
            message: "Retrieval evidence saved! This reinforces long-term retention in your Learner Model.",
            kind: "notice",
          },
        }));
        return;
      }

      const startedAt = openedAt.current ?? Date.now();
      const timeSpentSeconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
      const response = await authenticatedFetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, timeSpentSeconds }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to complete this lesson."));
      setPayload((current) => (current ? { ...current, progress: body as StudentProgress } : current));

      let retrievalScheduled = false;
      try {
        const retrievalResponse = await authenticatedFetch("/api/learning/adaptation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "scheduleLessonRetrieval", courseId, lessonId }),
        });
        retrievalScheduled = retrievalResponse.ok;
      } catch {
        retrievalScheduled = false;
      }

      setFeedback((current) => ({
        ...current,
        completion: {
          passed: true,
          kind: "notice",
          message: retrievalScheduled
            ? "Lesson complete! +25 XP earned and spaced retrieval scheduled."
            : "Lesson complete! +25 XP earned and progress saved.",
        },
      }));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to finish this learning step.";
      let targetId: string | null = null;
      let targetTitle: string | null = null;

      // Identify the incomplete activity from the message or by finding first incomplete interactive block
      for (const block of blocks) {
        const cap = readCapability(block.data);
        const act = readActivity(block.data);
        const title = cap?.title ?? act?.title ?? (block.type === "quiz_embed" ? "Quiz" : "");
        if (title && message.toLowerCase().includes(title.toLowerCase())) {
          targetId = block.id;
          targetTitle = title;
          break;
        }
      }

      if (!targetId) {
        const completedIds = new Set(payload.progress?.attempts.map((a) => a.quizId) ?? []);
        const firstIncomplete = blocks.find(
          (b) => (b.type === "interactive" || b.type === "quiz_embed") && !completedIds.has(b.id)
        );
        if (firstIncomplete) {
          targetId = firstIncomplete.id;
          const cap = readCapability(firstIncomplete.data);
          const act = readActivity(firstIncomplete.data);
          targetTitle = cap?.title ?? act?.title ?? "Incomplete activity";
        }
      }

      setIncompleteTargetBlockId(targetId);
      setIncompleteTargetTitle(targetTitle);
      setFeedback((current) => ({
        ...current,
        completion: { passed: false, message, kind: "error" },
      }));

      // Programmatically auto-scroll to the incomplete exercise section
      if (targetId) {
        scrollToBlock(targetId);
      }
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center" role="status" aria-live="polite" aria-busy="true">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="mt-4 text-sm font-semibold text-[var(--lx-muted)]">Loading interactive lesson…</p>
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Lurexa Learn</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">This lesson is not available.</h1>
          <p className="mt-3 text-[var(--lx-muted)]">{error ?? "We could not find this lesson in your learning path."}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500" onClick={() => router.refresh()}>Try again</Button>
            <Button className="rounded-xl border border-indigo-200 px-5 py-3 font-semibold text-indigo-700 hover:bg-indigo-50" onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  const { lesson, progress, nextLesson } = payload;
  const inRetrievalMode = Boolean(retrievalScheduleId);
  const isLessonCompleted = Boolean(progress?.completed || retrievalCompleted);

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] pb-16">
      {/* Sticky Top Header & Progress */}
      <header className="sticky top-0 z-30 border-b border-[var(--lx-border)]/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] hover:text-indigo-600 transition"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Button>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
                A1 Foundations
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${isLessonCompleted ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}>
                {inRetrievalMode ? "Retrieval Review" : isLessonCompleted ? "✓ Completed" : "In Progress"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--lx-canvas)]">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[var(--lx-muted)]">
              {completedInteractiveBlocks}/{totalInteractiveBlocks} done ({progressPercent}%)
            </span>
          </div>
        </div>
      </header>

      {/* Lesson Content Body */}
      <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6 sm:px-8">
        {/* Title Hero */}
        <section className="rounded-3xl bg-[var(--lx-surface)] p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">English A1 Core Lesson</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            {lesson.title}
          </h1>
          {lesson.summary ? <p className="mt-3 max-w-2xl text-base text-[var(--lx-muted)] leading-relaxed">{lesson.summary}</p> : null}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--lx-muted)]">
            <span className="flex items-center gap-1.5">
              <span>⏱️</span>
              <span>~{lesson.estimatedMinutes} minutes</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>✨</span>
              <span>+25 XP upon completion</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>💾</span>
              <span>Progress saves automatically</span>
            </span>
          </div>
        </section>

        {inRetrievalMode ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-800">Spaced Retrieval Session</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">Recall before reviewing solutions.</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">
              Complete at least one activity from memory now. Lurexa records retention evidence without lowering your existing level.
            </p>
          </section>
        ) : null}

        {/* Content Blocks */}
        {blocks.map((block) => {
          const isHighlighted = highlightedBlockId === block.id;
          const blockWrapperClass = `transition-all duration-500 ${
            isHighlighted
              ? "ring-4 ring-indigo-500 shadow-2xl scale-[1.01] rounded-3xl"
              : ""
          }`;

          const text = readText(block.data);
          if (block.type === "text" && text) {
            const isGrammar =
              block.data.category === "grammar" ||
              text.includes("Grammar Focus") ||
              block.id.includes("grammar");

            if (isGrammar) {
              return (
                <InteractiveGrammarCard
                  key={block.id}
                  blockId={block.id}
                  rawText={text}
                  wrapperClass={blockWrapperClass}
                  initialDialect="es-DO"
                />
              );
            }

            return (
              <section
                key={block.id}
                id={`block-${block.id}`}
                className={`rounded-3xl bg-[var(--lx-surface)] p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8 ${blockWrapperClass}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="rounded-full bg-[var(--lx-canvas)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                    📖 Lesson Dialogue &amp; Goal
                  </span>
                </div>
                <div className="whitespace-pre-wrap leading-7 text-[var(--lx-ink)] font-medium">
                  {text}
                </div>
              </section>
            );
          }

          if (block.type === "video" || block.type === "image") {
            const url = readMediaUrl(block.data);
            return (
              <section
                key={block.id}
                id={`block-${block.id}`}
                className={`rounded-3xl bg-[var(--lx-surface)] p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8 ${blockWrapperClass}`}
              >
                <p className="text-sm font-semibold text-[var(--lx-ink)]">Learning Media</p>
                {url ? (
                  <a className="mt-3 inline-flex items-center gap-1 font-semibold text-indigo-700 underline hover:text-indigo-900" href={url} target="_blank" rel="noreferrer">
                    <span>Open resource</span>
                    <span>↗</span>
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-[var(--lx-muted)]">This media resource is unavailable.</p>
                )}
              </section>
            );
          }

          if (block.type === "quiz_embed") {
            const quiz = readQuiz(block.data);
            if (!quiz) return null;
            const selected = selections[block.id] ?? [];
            const blockFeedback = feedback[block.id];
            const isSubmitted = Boolean(blockFeedback);

            return (
              <section
                key={block.id}
                id={`block-${block.id}`}
                className={`rounded-3xl bg-[var(--lx-surface)] p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8 ${blockWrapperClass}`}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
                    🎯 Quick Comprehension Check
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-950">{quiz.prompt}</h2>
                <div className="mt-5 grid gap-3" role="group" aria-label={quiz.prompt}>
                  {quiz.options.map((option) => {
                    const isSelected = selected.includes(option);
                    let optionStyle = "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-ink)] hover:border-indigo-300 hover:bg-[var(--lx-canvas)]";
                    if (isSelected) {
                      optionStyle = "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20";
                    }
                    if (isSubmitted && isSelected) {
                      optionStyle = blockFeedback.passed
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20"
                        : "border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20";
                    }

                    return (
                      <Button
                        key={option}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSingleChoice(block.id, option)}
                        className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-medium transition ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isSelected ? <span className="text-xs font-bold">✓</span> : null}
                      </Button>
                    );
                  })}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Button
                    disabled={submittingId === block.id || !selected.length}
                    onClick={() => void submitBlock(block.id, "quiz")}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition"
                  >
                    {submittingId === block.id ? "Checking…" : "Check Answer"}
                  </Button>
                </div>
                {blockFeedback ? (
                  <div
                    className={`mt-4 rounded-2xl p-4 text-sm leading-relaxed ${
                      blockFeedback.passed ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}
                    role={blockFeedback.kind === "error" ? "alert" : "status"}
                  >
                    <p className="font-semibold">{blockFeedback.passed ? "✓ Correct" : "Keep going"}</p>
                    <p className="mt-1">{blockFeedback.message}</p>
                  </div>
                ) : null}
              </section>
            );
          }

          if (block.type === "interactive") {
            const capability = readCapability(block.data);
            if (capability?.kind === "model_listening") {
              return (
                <div key={block.id} id={`block-${block.id}`} className={blockWrapperClass}>
                  <ModelListeningActivity
                    capability={capability}
                    courseId={courseId}
                    lessonId={lessonId}
                    onCompleted={handleCapabilityCompleted}
                  />
                </div>
              );
            }
            if (capability?.kind === "recorded_speaking") {
              return (
                <div key={block.id} id={`block-${block.id}`} className={blockWrapperClass}>
                  <RecordedSpeakingActivity
                    key={block.id}
                    courseId={courseId}
                    lessonId={lessonId}
                    capability={capability}
                    onCompleted={handleCapabilityCompleted}
                  />
                </div>
              );
            }
            if (capability?.kind === "ai_roleplay") {
              return (
                <div key={block.id} id={`block-${block.id}`} className={blockWrapperClass}>
                  <AIRoleplayActivity
                    key={block.id}
                    courseId={courseId}
                    lessonId={lessonId}
                    capability={capability}
                    onCompleted={handleCapabilityCompleted}
                  />
                </div>
              );
            }

            const activity = readActivity(block.data);
            if (!activity) return null;
            const selected = selections[block.id] ?? [];
            const blockFeedback = feedback[block.id];
            const isSubmitted = Boolean(blockFeedback);
            const stageBadge = getStageBadge(activity.stage);

            return (
              <section
                key={block.id}
                id={`block-${block.id}`}
                className={`rounded-3xl bg-[var(--lx-surface)] p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8 ${blockWrapperClass}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${stageBadge.color}`}>
                    {stageBadge.icon} {stageBadge.label}
                  </span>
                  {activity.required ? (
                    <span className="text-xs font-bold text-[var(--lx-muted)]">Required Activity</span>
                  ) : null}
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-950">{activity.title}</h2>
                <p className="mt-2 text-sm text-[var(--lx-muted)] leading-relaxed">{activity.instructions}</p>
                <div className="mt-4 rounded-2xl bg-[var(--lx-canvas)] p-4 border border-[var(--lx-border)]">
                  <p className="text-sm font-semibold text-[var(--lx-ink)]">{activity.prompt}</p>
                </div>

                {/* Short Response Type */}
                {activity.type === "short_response" ? (
                  <div className="mt-5 space-y-3">
                    <label className="sr-only" htmlFor={`response-${block.id}`}>
                      Your response to: {activity.prompt}
                    </label>
                    <textarea
                      id={`response-${block.id}`}
                      value={responses[block.id] ?? ""}
                      onChange={(event) =>
                        setResponses((current) => ({ ...current, [block.id]: event.target.value }))
                      }
                      className="min-h-32 w-full rounded-2xl border border-[var(--lx-border)] p-4 text-sm text-[var(--lx-ink)] placeholder:text-[var(--lx-muted)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Write your response in English…"
                    />
                    <div className="flex items-center justify-between text-xs text-[var(--lx-muted)]">
                      <span>{(responses[block.id] ?? "").length} characters written</span>
                      <span>Target: Clear, short A1 sentences</span>
                    </div>
                    <Button
                      disabled={submittingId === block.id || !(responses[block.id] ?? "").trim()}
                      onClick={() => void submitShortResponse(block.id)}
                      className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition"
                    >
                      {submittingId === block.id ? "Saving…" : "Save Response"}
                    </Button>
                  </div>
                ) : null}

                {/* Sentence Builder Type */}
                {activity.type === "sentence_builder" ? (
                  <div className="mt-5 space-y-4">
                    {/* Active Assembly Slot */}
                    <div className="min-h-16 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">
                        Your Built Sentence (Tap a word to remove):
                      </p>
                      {selected.length === 0 ? (
                        <p className="text-sm italic text-[var(--lx-muted)]">Tap the word chips below to build your sentence in order.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selected.map((token, index) => (
                            <Button
                              key={`${token}-${index}`}
                              type="button"
                              onClick={() => removeSentenceToken(block.id, index)}
                              className="rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-600 transition flex items-center gap-1.5"
                            >
                              <span>{token}</span>
                              <span className="text-xs opacity-75">✕</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Word Bank */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-2">Available Words:</p>
                      <div className="flex flex-wrap gap-2">
                        {(activity.options ?? []).map((token, index) => (
                          <Button
                            key={`${token}-${index}`}
                            type="button"
                            onClick={() => addSentenceToken(block.id, token)}
                            className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--lx-ink)] shadow-sm hover:border-indigo-500 hover:bg-indigo-50 transition"
                          >
                            + {token}
                          </Button>
                        ))}
                        {selected.length > 0 ? (
                          <Button
                            type="button"
                            onClick={() => clearSentenceBuilder(block.id)}
                            className="rounded-xl border border-[var(--lx-border)] px-3 py-2 text-xs font-bold text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] transition"
                          >
                            Reset
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <Button
                      disabled={submittingId === block.id || selected.length === 0}
                      onClick={() => void submitBlock(block.id, "activity", activity)}
                      className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition"
                    >
                      {submittingId === block.id ? "Checking…" : "Submit Sentence"}
                    </Button>
                  </div>
                ) : null}

                {/* Single Choice / Multiple Selection */}
                {activity.type === "single_choice" || activity.type === "multiple_selection" ? (
                  <div className="mt-5 space-y-4">
                    <div className="grid gap-3" role="group" aria-label={activity.prompt}>
                      {(activity.options ?? []).map((option) => {
                        const isSelected = selected.includes(option);
                        let optionStyle = "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-ink)] hover:border-indigo-300 hover:bg-[var(--lx-canvas)]";
                        if (isSelected) {
                          optionStyle = "border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500/20";
                        }
                        if (isSubmitted && isSelected) {
                          optionStyle = blockFeedback.passed
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20"
                            : "border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20";
                        }

                        return (
                          <Button
                            key={option}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() =>
                              activity.type === "multiple_selection"
                                ? handleMultipleChoice(block.id, option)
                                : handleSingleChoice(block.id, option)
                            }
                            className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-medium transition ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {isSelected ? <span className="text-xs font-bold">✓</span> : null}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      disabled={submittingId === block.id || selected.length === 0}
                      onClick={() => void submitBlock(block.id, "activity", activity)}
                      className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition"
                    >
                      {submittingId === block.id ? "Checking…" : "Submit Answer"}
                    </Button>
                  </div>
                ) : null}

                {/* Feedback Callout */}
                {blockFeedback ? (
                  <div
                    className={`mt-4 rounded-2xl p-4 text-sm leading-relaxed ${
                      blockFeedback.passed
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                        : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}
                    role={blockFeedback.kind === "error" ? "alert" : "status"}
                  >
                    <p className="font-semibold">{blockFeedback.passed ? "✓ Great work" : "Almost there"}</p>
                    <p className="mt-1">{blockFeedback.message}</p>
                  </div>
                ) : null}
              </section>
            );
          }

          return null;
        })}

        {/* Finish & Progression Section */}
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-400">
                {inRetrievalMode ? "Finish Retrieval Review" : "Lesson Milestone"}
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {isLessonCompleted ? "🎉 Lesson Completed!" : "Ready to Save Your Progress?"}
              </h2>
            </div>
            {isLessonCompleted ? (
              <span className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                +25 XP Earned
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {isLessonCompleted
              ? "Your learning evidence is safely recorded in your Learner Model. Continue your journey below!"
              : inRetrievalMode
              ? "Retrieval completion requires fresh evidence from this review session."
              : "Completing this lesson records authentic progress across listening, speaking, grammar, and applied communication."}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {inRetrievalMode ? (
              !retrievalCompleted ? (
                <Button
                  disabled={completing}
                  onClick={() => void finish()}
                  className="rounded-xl bg-[var(--lx-surface)] px-6 py-3 font-bold text-slate-950 hover:bg-[var(--lx-canvas)] disabled:opacity-50 transition"
                >
                  {completing ? "Saving Evidence…" : "Complete Retrieval Check"}
                </Button>
              ) : null
            ) : !isLessonCompleted ? (
              <Button
                disabled={completing}
                onClick={() => void finish()}
                className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-slate-950 shadow-md hover:bg-emerald-400 disabled:opacity-50 transition"
              >
                {completing ? "Saving Progress…" : "Complete Lesson & Save Progress"}
              </Button>
            ) : null}

            {isLessonCompleted && nextLesson ? (
              <Button
                onClick={() => router.push(`/learn/${courseId}/${nextLesson.id}`)}
                className="rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white shadow-md hover:bg-indigo-400 transition"
              >
                Continue to Next Lesson →
              </Button>
            ) : null}

            {isLessonCompleted ? (
              <Link
                href="/coach"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                Practice Spoken English in Coach 🗣️
              </Link>
            ) : null}

            {isLessonCompleted ? (
              <Button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 hover:text-white hover:border-slate-500 transition"
              >
                Return to Dashboard
              </Button>
            ) : null}
          </div>

          {/* Actionable Validation Banner with Deep-Link Trigger */}
          {feedback.completion ? (
            <div
              className={`mt-5 rounded-2xl p-5 border transition-all ${
                feedback.completion.passed
                  ? "bg-emerald-950/80 text-emerald-100 border-emerald-800"
                  : "bg-amber-950/90 text-amber-100 border-amber-800 shadow-lg"
              }`}
              role={feedback.completion.kind === "error" ? "alert" : "status"}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  {!feedback.completion.passed ? (
                    <p className="font-bold text-amber-200 flex items-center gap-2 mb-1">
                      <span>⚠️</span>
                      <span>Required Learning Step Incomplete</span>
                    </p>
                  ) : null}
                  <p className="text-sm leading-relaxed">{feedback.completion.message}</p>
                </div>
                {!feedback.completion.passed && incompleteTargetBlockId ? (
                  <Button
                    type="button"
                    onClick={() => scrollToBlock(incompleteTargetBlockId)}
                    className="shrink-0 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-300 transition flex items-center gap-1.5"
                  >
                    <span>Jump to {incompleteTargetTitle ?? "Activity"}</span>
                    <span>↑</span>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

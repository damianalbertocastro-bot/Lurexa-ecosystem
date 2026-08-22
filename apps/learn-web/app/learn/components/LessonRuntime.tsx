"use client";

import { useEffect, useRef, useState } from "react";
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
  if (candidate.schemaVersion !== "1" || typeof candidate.type !== "string" || typeof candidate.stage !== "string" || typeof candidate.title !== "string" || typeof candidate.instructions !== "string" || typeof candidate.prompt !== "string") return null;
  return candidate as LearnerLearningActivity;
}

function readCapability(data: Record<string, unknown>): LearningCapability | null {
  const capability = data.capability;
  if (typeof capability !== "object" || capability === null || Array.isArray(capability)) return null;
  const candidate = capability as Partial<LearningCapability>;
  if (
    candidate.schemaVersion !== "1"
    || !["model_listening", "recorded_speaking", "ai_roleplay"].includes(candidate.kind ?? "")
    || typeof candidate.id !== "string"
    || typeof candidate.title !== "string"
    || typeof candidate.instructions !== "string"
    || !Array.isArray(candidate.competencyIds)
    || !candidate.competencyIds.every((id) => typeof id === "string")
  ) return null;
  return candidate as LearningCapability;
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

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) {
        setError("Sign in to continue this lesson.");
        setLoading(false);
        return;
      }

      openedAt.current = Date.now();
      try {
        const response = await authenticatedFetch(`/api/learning?courseId=${encodeURIComponent(courseId)}&lessonId=${encodeURIComponent(lessonId)}`);
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
          setPayload((current) => current ? { ...current, progress: startBody as StudentProgress } : current);
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load this lesson.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [courseId, lessonId]);

  function toggleOption(blockId: string, option: string, type: LearnerLearningActivity["type"] | "quiz") {
    setSelections((current) => {
      const existing = current[blockId] ?? [];
      if (type === "multiple_selection") {
        return { ...current, [blockId]: existing.includes(option) ? existing.filter((item) => item !== option) : [...existing, option] };
      }
      if (type === "sentence_builder") {
        return { ...current, [blockId]: existing.includes(option) ? existing.filter((item) => item !== option) : [...existing, option] };
      }
      return { ...current, [blockId]: [option] };
    });
  }

  async function submitBlock(blockId: string, kind: "quiz" | "activity", activity?: LearnerLearningActivity) {
    const answers = selections[blockId] ?? [];
    if (!answers.length) {
      setFeedback((current) => ({ ...current, [blockId]: { passed: false, message: "Choose an answer before submitting.", kind: "notice" } }));
      return;
    }

    setSubmittingId(blockId);
    try {
      const requestBody = kind === "quiz"
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
      const message = result.explanation ?? (result.attempt.passed ? "Nice work. Your response was saved." : "Your response was saved. Try again when you are ready.");
      setFeedback((current) => ({ ...current, [blockId]: { passed: result.attempt.passed, message, kind: "notice" } }));
      setPayload((current) => current ? {
        ...current,
        progress: current.progress ? { ...current.progress, lastAccessedAt: result.attempt.completedAt } : current.progress,
      } : current);
      if (activity?.type === "single_choice") setSelections((current) => ({ ...current, [blockId]: answers.slice(0, 1) }));
    } catch (caught) {
      setFeedback((current) => ({ ...current, [blockId]: { passed: false, message: caught instanceof Error ? caught.message : "Unable to submit this activity.", kind: "error" } }));
    } finally {
      setSubmittingId(null);
    }
  }

  async function submitShortResponse(blockId: string) {
    const responseText = (responses[blockId] ?? "").trim();
    if (responseText.length < 8) {
      setFeedback((current) => ({ ...current, [blockId]: { passed: false, message: "Write a little more before submitting.", kind: "notice" } }));
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
      setFeedback((current) => ({ ...current, [blockId]: { passed: true, message: result.explanation ?? "Your response was saved as learning evidence.", kind: "notice" } }));
    } catch (caught) {
      setFeedback((current) => ({ ...current, [blockId]: { passed: false, message: caught instanceof Error ? caught.message : "Unable to submit this response.", kind: "error" } }));
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
        setFeedback((current) => ({ ...current, completion: { passed: true, message: "Retrieval evidence saved. This strengthens retention evidence without changing mastery by itself.", kind: "notice" } }));
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
      setPayload((current) => current ? { ...current, progress: body as StudentProgress } : current);

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
            ? "Lesson complete. Progress is saved and delayed retrieval has been scheduled; completion is not a mastery claim."
            : "Lesson complete. Progress is saved; delayed retrieval scheduling can be retried later.",
        },
      }));
    } catch (caught) {
      setFeedback((current) => ({ ...current, completion: { passed: false, message: caught instanceof Error ? caught.message : "Unable to finish this learning step.", kind: "error" } }));
    } finally {
      setCompleting(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-3xl px-6 py-16 text-slate-500" role="status" aria-live="polite" aria-busy="true">Loading lesson…</div>;

  if (error || !payload) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Lurexa Learn</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">This lesson is not available.</h1>
          <p className="mt-3 text-slate-600">{error ?? "We could not find this lesson in your learning path."}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white" onClick={() => router.refresh()}>Try again</button>
            <button className="rounded-xl border border-indigo-200 px-5 py-3 font-semibold text-indigo-700" onClick={() => router.push("/dashboard")}>Back to dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const { lesson, progress, nextLesson } = payload;
  const blocks = [...lesson.contentBlocks].sort((first, second) => first.order - second.order);
  const inRetrievalMode = Boolean(retrievalScheduleId);

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button className="text-sm font-semibold text-indigo-700" onClick={() => router.push("/dashboard")}>← Dashboard</button>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-indigo-700">
              {inRetrievalMode ? "Retrieval review" : progress?.completed ? "Completed" : "In progress"}
            </span>
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Production lesson</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{lesson.title}</h1>
          {lesson.summary ? <p className="mt-3 max-w-2xl text-slate-600">{lesson.summary}</p> : null}
          <p className="mt-4 text-sm text-slate-500">About {lesson.estimatedMinutes} minutes · progress saves automatically</p>
        </header>

        {inRetrievalMode ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-800">Delayed retrieval</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">Recall before you review.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">Complete at least one activity from memory now. Lurexa will only close this retrieval check after fresh activity or assessment evidence is captured.</p>
          </section>
        ) : null}

        {blocks.map((block) => {
          const text = readText(block.data);
          if (block.type === "text" && text) {
            return <section key={block.id} className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"><p className="whitespace-pre-wrap leading-7 text-slate-700">{text}</p></section>;
          }

          if (block.type === "video" || block.type === "image") {
            const url = readMediaUrl(block.data);
            return (
              <section key={block.id} className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-semibold text-slate-900">Learning media</p>
                {url ? <a className="mt-3 inline-block font-semibold text-indigo-700 underline" href={url} target="_blank" rel="noreferrer">Open resource ↗</a> : <p className="mt-2 text-sm text-slate-500">This media resource is unavailable.</p>}
              </section>
            );
          }

          if (block.type === "quiz_embed") {
            const quiz = readQuiz(block.data);
            if (!quiz) return null;
            const selected = selections[block.id] ?? [];
            return (
              <section key={block.id} className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Quick check</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">{quiz.prompt}</h2>
                <div className="mt-5 grid gap-3" role="group" aria-label={quiz.prompt}>
                  {quiz.options.map((option) => <button key={option} type="button" aria-pressed={selected.includes(option)} onClick={() => toggleOption(block.id, option, "quiz")} className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${selected.includes(option) ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}>{option}</button>)}
                </div>
                <button disabled={submittingId === block.id} onClick={() => void submitBlock(block.id, "quiz")} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{submittingId === block.id ? "Saving…" : "Check answer"}</button>
                {feedback[block.id] ? <p className={`mt-4 rounded-xl p-3 text-sm ${feedback[block.id].passed ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`} role={feedback[block.id].kind === "error" ? "alert" : "status"} aria-live={feedback[block.id].kind === "error" ? "assertive" : "polite"}>{feedback[block.id].message}</p> : null}
              </section>
            );
          }

          if (block.type === "interactive") {
            const capability = readCapability(block.data);
            if (capability?.kind === "model_listening") return <ModelListeningActivity key={block.id} capability={capability} />;
            if (capability?.kind === "recorded_speaking") return <RecordedSpeakingActivity key={block.id} courseId={courseId} lessonId={lessonId} capability={capability} />;
            if (capability?.kind === "ai_roleplay") return <AIRoleplayActivity key={block.id} courseId={courseId} lessonId={lessonId} capability={capability} />;

            const activity = readActivity(block.data);
            if (!activity) return null;
            const selected = selections[block.id] ?? [];
            return (
              <section key={block.id} className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-violet-700">{activity.stage.replaceAll("_", " ")}</span>
                  {activity.required ? <span className="text-xs font-semibold text-slate-500">Required</span> : null}
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-950">{activity.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{activity.instructions}</p>
                <p className="mt-4 font-semibold text-slate-900">{activity.prompt}</p>

                {activity.type === "short_response" ? (
                  <>
                    <label className="sr-only" htmlFor={`response-${block.id}`}>Your response to: {activity.prompt}</label>
                    <textarea id={`response-${block.id}`} value={responses[block.id] ?? ""} onChange={(event) => setResponses((current) => ({ ...current, [block.id]: event.target.value }))} className="mt-4 min-h-32 w-full rounded-2xl border border-slate-200 p-4 text-slate-800 outline-none focus:border-indigo-500" placeholder="Write your response…" />
                    <button disabled={submittingId === block.id} onClick={() => void submitShortResponse(block.id)} className="mt-4 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{submittingId === block.id ? "Saving…" : "Save response"}</button>
                  </>
                ) : (
                  <>
                    {activity.type === "sentence_builder" && selected.length ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">Your sequence: {selected.join(" ")}</p> : null}
                    <div className="mt-4 grid gap-3" role="group" aria-label={activity.prompt}>
                      {(activity.options ?? []).map((option) => <button key={option} type="button" aria-pressed={selected.includes(option)} onClick={() => toggleOption(block.id, option, activity.type)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${selected.includes(option) ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}>{option}</button>)}
                    </div>
                    <button disabled={submittingId === block.id} onClick={() => void submitBlock(block.id, "activity", activity)} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{submittingId === block.id ? "Saving…" : "Submit activity"}</button>
                  </>
                )}
                {feedback[block.id] ? <p className={`mt-4 rounded-xl p-3 text-sm ${feedback[block.id].passed ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`} role={feedback[block.id].kind === "error" ? "alert" : "status"} aria-live={feedback[block.id].kind === "error" ? "assertive" : "polite"}>{feedback[block.id].message}</p> : null}
              </section>
            );
          }

          return null;
        })}

        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-300">{inRetrievalMode ? "Finish retrieval" : "Finish the lesson"}</p>
          <h2 className="mt-2 text-2xl font-bold">{inRetrievalMode ? "Save the recall you demonstrated." : "Save what you accomplished."}</h2>
          <p className="mt-2 text-sm text-slate-300">{inRetrievalMode ? "Retrieval completion requires fresh evidence from this review session." : "Completing a lesson records progress; it does not claim mastery by itself."}</p>
          {inRetrievalMode ? (
            !retrievalCompleted ? <button disabled={completing} onClick={() => void finish()} className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{completing ? "Checking evidence…" : "Complete retrieval check"}</button> : null
          ) : !progress?.completed ? (
            <button disabled={completing} onClick={() => void finish()} className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{completing ? "Saving…" : "Complete lesson"}</button>
          ) : null}
          {feedback.completion ? <p className={`mt-4 rounded-xl p-3 text-sm ${feedback.completion.passed ? "bg-emerald-950 text-emerald-100" : "bg-amber-950 text-amber-100"}`} role={feedback.completion.kind === "error" ? "alert" : "status"} aria-live={feedback.completion.kind === "error" ? "assertive" : "polite"}>{feedback.completion.message}</p> : null}
          {retrievalCompleted ? <button onClick={() => router.push("/dashboard")} className="mt-5 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white">Return to dashboard</button> : null}
          {!inRetrievalMode && progress?.completed && nextLesson ? <button onClick={() => router.push(`/learn/${courseId}/${nextLesson.id}`)} className="mt-5 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white">Continue to next lesson →</button> : null}
          {!inRetrievalMode && progress?.completed && !nextLesson ? <button onClick={() => router.push("/dashboard")} className="mt-5 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white">Return to dashboard</button> : null}
        </section>
      </div>
    </main>
  );
}

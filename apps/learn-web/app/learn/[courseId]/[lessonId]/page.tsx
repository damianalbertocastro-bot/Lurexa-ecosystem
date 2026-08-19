"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { AITutorWidget } from "../../components/AITutorWidget";
import { AuthService } from "@lurexa/backend";
import { LearnerLearningActivity, LearnerLearningActivityContentBlockData, LearnerQuizContentBlockData, Lesson, StudentProgress } from "@lurexa/types";
import { authenticatedFetch } from "../../../../lib/authenticated-fetch";

export default function CoursePlayerPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<string, { passed: boolean; explanation: string | null }>>({});
  const [submittingQuizId, setSubmittingQuizId] = useState<string | null>(null);
  const [activityAnswers, setActivityAnswers] = useState<Record<string, string[]>>({});
  const [activityFeedback, setActivityFeedback] = useState<Record<string, { passed: boolean; explanation: string | null }>>({});
  const [submittingActivityId, setSubmittingActivityId] = useState<string | null>(null);

  useEffect(() => AuthService.onUserChanged(async (user) => {
    if (!user) { setError("Sign in is required."); setLoading(false); return; }
    try {
      const response = await authenticatedFetch(`/api/learning?courseId=${encodeURIComponent(params.courseId)}&lessonId=${encodeURIComponent(params.lessonId)}`);
      const payload = await response.json() as { lesson?: Lesson; progress?: StudentProgress | null; nextLesson?: Lesson | null; error?: string };
      if (!response.ok || !payload.lesson) throw new Error(payload.error ?? "Unable to load lesson.");
      setLesson(payload.lesson);
      setNextLesson(payload.nextLesson ?? null);
      setCompleted(payload.progress?.completed ?? false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load lesson."); }
    finally { setLoading(false); }
  }), [params.courseId, params.lessonId]);

  const handleMarkComplete = async () => {
    if (completed && nextLesson) {
      router.push(`/learn/${params.courseId}/${nextLesson.id}`);
      return;
    }
    setSyncing(true);
    try {
      const response = await authenticatedFetch("/api/learning", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: params.courseId, lessonId: params.lessonId, timeSpentSeconds: 180 }),
      });
      if (!response.ok) throw new Error("Unable to save progress.");
      setCompleted(true);
    } catch {
      alert("Failed to sync progress.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmitQuiz = async (quizId: string) => {
    const answer = answers[quizId];
    if (!answer) return;
    setSubmittingQuizId(quizId);
    try {
      const response = await authenticatedFetch("/api/learning", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submitQuizAttempt", courseId: params.courseId, lessonId: params.lessonId, quizId, answer }) });
      const payload = await response.json() as { attempt?: { passed: boolean }; explanation?: string | null; error?: string };
      if (!response.ok || !payload.attempt) throw new Error(payload.error ?? "Unable to submit activity.");
      setQuizFeedback((current) => ({ ...current, [quizId]: { passed: payload.attempt!.passed, explanation: payload.explanation ?? null } }));
    } catch (cause) { alert(cause instanceof Error ? cause.message : "Unable to submit activity."); }
    finally { setSubmittingQuizId(null); }
  };

  const handleSubmitActivity = async (activityId: string) => {
    const answersForActivity = activityAnswers[activityId] ?? [];
    if (!answersForActivity.length) return;
    setSubmittingActivityId(activityId);
    try {
      const response = await authenticatedFetch("/api/learning", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submitActivityAttempt", courseId: params.courseId, lessonId: params.lessonId, activityId, answers: answersForActivity }) });
      const payload = await response.json() as { attempt?: { passed: boolean }; explanation?: string | null; error?: string };
      if (!response.ok || !payload.attempt) throw new Error(payload.error ?? "Unable to submit activity.");
      setActivityFeedback((current) => ({ ...current, [activityId]: { passed: payload.attempt!.passed, explanation: payload.explanation ?? null } }));
    } catch (cause) { alert(cause instanceof Error ? cause.message : "Unable to submit activity."); }
    finally { setSubmittingActivityId(null); }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Loading lesson...</div>;
  if (error || !lesson) return <div className="min-h-screen bg-slate-50 p-8 text-red-600">{error ?? "Lesson not found."}</div>;
  const text = lesson.contentBlocks.filter((block) => block.type === "text")
    .map((block) => typeof block.data.text === "string" ? block.data.text : "").filter(Boolean).join("\n\n");
  const quizzes = lesson.contentBlocks.filter((block) => block.type === "quiz_embed").flatMap((block) => {
    const { prompt, options } = block.data as LearnerQuizContentBlockData;
    return typeof prompt === "string" && Array.isArray(options) && options.every((option) => typeof option === "string") ? [{ id: block.id, prompt, options }] : [];
  });
  const activities = lesson.contentBlocks.filter((block) => block.type === "interactive").flatMap((block) => {
    const activity = (block.data as LearnerLearningActivityContentBlockData).activity;
    return activity && typeof activity === "object" && typeof activity.title === "string" && typeof activity.prompt === "string" && typeof activity.instructions === "string" && Array.isArray(activity.options) ? [{ id: block.id, activity: activity as LearnerLearningActivity }] : [];
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
              <p className="text-xs text-slate-500">Course ID: {params.courseId}</p>
            </div>
            <Badge variant={completed ? "success" : "info"}>
              {completed ? "Completed ✓" : "In Progress"}
            </Badge>
          </div>

          <Card className="prose max-w-none">
            <div className="whitespace-pre-line text-slate-700 leading-relaxed">
              {text || "This lesson has no readable text content yet."}
            </div>
          </Card>

          {quizzes.map((quiz) => {
            const feedback = quizFeedback[quiz.id];
            return <Card key={quiz.id} title="Quick check" subtitle="Answer to confirm your understanding"><fieldset className="space-y-3 pt-3"><legend className="font-semibold text-slate-900">{quiz.prompt}</legend>{quiz.options.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700"><input type="radio" name={quiz.id} value={option} checked={answers[quiz.id] === option} onChange={() => setAnswers((current) => ({ ...current, [quiz.id]: option }))} />{option}</label>)}<Button type="button" onClick={() => handleSubmitQuiz(quiz.id)} isLoading={submittingQuizId === quiz.id} disabled={!answers[quiz.id]}>Check answer</Button>{feedback && <p className={feedback.passed ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-red-700"}>{feedback.passed ? "Correct — well done." : "Not quite. Try again."}{feedback.explanation ? ` ${feedback.explanation}` : ""}</p>}</fieldset></Card>;
          })}

          {activities.map(({ id, activity }) => {
            const selected = activityAnswers[id] ?? [];
            const feedback = activityFeedback[id];
            const isMultiSelect = activity.type === "multiple_selection";
            const isSentenceBuilder = activity.type === "sentence_builder";
            const toggleAnswer = (option: string) => setActivityAnswers((current) => {
              const currentAnswers = current[id] ?? [];
              if (isSentenceBuilder) return { ...current, [id]: currentAnswers.includes(option) ? currentAnswers.filter((answer) => answer !== option) : [...currentAnswers, option] };
              if (isMultiSelect) return { ...current, [id]: currentAnswers.includes(option) ? currentAnswers.filter((answer) => answer !== option) : [...currentAnswers, option] };
              return { ...current, [id]: [option] };
            });
            return <Card key={id} title={activity.title} subtitle={`${activity.stage.replaceAll("_", " ")} · ${activity.estimatedMinutes} min`}><fieldset className="space-y-3 pt-3"><legend className="font-semibold text-slate-900">{activity.prompt}</legend><p className="text-sm text-slate-600">{activity.instructions}</p>{isSentenceBuilder && selected.length > 0 && <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-950">Your sentence: {selected.join(" ")}</div>}<div className="space-y-2">{activity.options?.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700"><input type={isMultiSelect || isSentenceBuilder ? "checkbox" : "radio"} name={id} value={option} checked={selected.includes(option)} onChange={() => toggleAnswer(option)} />{option}</label>)}</div><Button type="button" onClick={() => handleSubmitActivity(id)} isLoading={submittingActivityId === id} disabled={!selected.length}>Check answer</Button>{feedback && <p className={feedback.passed ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-red-700"}>{feedback.passed ? "Correct — well done." : "Not quite. Try again."}{feedback.explanation ? ` ${feedback.explanation}` : ""}</p>}</fieldset></Card>;
          })}

          <div className="flex justify-end pt-4">
            <Button
              variant={completed ? "secondary" : "primary"}
              onClick={handleMarkComplete}
              isLoading={syncing}
              disabled={completed && !nextLesson}
            >
              {completed ? (nextLesson ? "Continue to next lesson →" : "Course completed ✓") : "Mark lesson complete"}
            </Button>
          </div>
        </div>

        {/* AI Tutor Sidebar (1 Col) */}
        <div className="lg:col-span-1">
          <AITutorWidget
            lessonTitle={lesson.title}
            lessonContext={text}
          />
        </div>
      </div>
    </div>
  );
}

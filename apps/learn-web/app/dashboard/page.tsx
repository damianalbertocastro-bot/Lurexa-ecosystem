"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { AuthService } from "@lurexa/backend";
import type { Course, LearnerRecommendationAction, Lesson, NextLearningAction } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";
import { LurexaLearnLogo } from "../components/LurexaLearnLogo";

interface LearnerCourseSummary {
  course: Course;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  nextLesson: Lesson | null;
}

interface LearnerGamificationSummary {
  streakDays: number;
  totalPoints: number;
  lastActivityAt: string | null;
}

interface LearnerDashboardSummary {
  courses: LearnerCourseSummary[];
  gamification: LearnerGamificationSummary;
  nextStep: LearnerRecommendationAction | null;
}

function nextStepBadge(outcome: LearnerRecommendationAction["outcome"]): string {
  if (outcome === "continue") return "Continue";
  if (outcome === "retry") return "Retry";
  if (outcome === "targeted_practice") return "Targeted practice";
  return "Reinforce";
}

function nextActionSource(action: NextLearningAction): string {
  if (action.kind === "retrieval") return "Delayed retrieval";
  if (action.kind === "teacher_recommendation") return "Teacher guidance";
  if (action.kind === "mind_recommendation") return "Lurexa Mind";
  return "Curriculum sequence";
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<LearnerCourseSummary[]>([]);
  const [gamification, setGamification] = useState<LearnerGamificationSummary | null>(null);
  const [nextAction, setNextAction] = useState<NextLearningAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      setLoading(true);
      setError(null);
      try {
        if (user) {
          const [dashboardResponse, adaptationResponse] = await Promise.all([
            authenticatedFetch("/api/learning?studentDashboard=1"),
            authenticatedFetch("/api/learning/adaptation"),
          ]);
          if (!dashboardResponse.ok) throw new Error("Unable to load dashboard.");
          const dashboard = await dashboardResponse.json() as LearnerDashboardSummary;
          setCourses(dashboard.courses);
          setGamification(dashboard.gamification);

          if (adaptationResponse.ok) {
            setNextAction(await adaptationResponse.json() as NextLearningAction);
          } else if (dashboard.nextStep) {
            setNextAction({ kind: "mind_recommendation", recommendation: dashboard.nextStep });
          }
        } else {
          setCourses([]);
          setGamification(null);
          setNextAction(null);
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [reloadKey]);

  const recommendation = nextAction?.recommendation ?? null;
  const recommendationHref = recommendation?.courseId && recommendation.lessonId
    ? nextAction?.kind === "retrieval"
      ? `/learn/${recommendation.courseId}/${recommendation.lessonId}?retrieval=${encodeURIComponent(nextAction.scheduleId)}`
      : `/learn/${recommendation.courseId}/${recommendation.lessonId}`
    : null;

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><LurexaLearnLogo /><div>
            <p className="text-xs font-bold tracking-[.16em] text-indigo-700">YOUR LEARNING SPACE</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--learn-ink)]">Keep your momentum.</h1>
            <p className="text-slate-500">Pick up exactly where you left off.</p>
          </div></div>
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2" onClick={() => router.push("/dashboard/streak")} aria-label="View streak details">
              <Badge variant="warning">🔥 {gamification?.streakDays ?? 0} Day Streak</Badge>
            </button>
            <button type="button" className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => router.push("/dashboard/points")} aria-label="View points and rewards">
              <Badge variant="info">⭐ {gamification?.totalPoints ?? 0} Points</Badge>
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">
            <p className="font-semibold">Your dashboard could not be loaded.</p>
            <p className="mt-1">{error}</p>
            <Button className="mt-3" variant="secondary" onClick={() => setReloadKey((current) => current + 1)}>Try again</Button>
          </div>
        ) : null}

        {nextAction && recommendation && (
          <Card
            className="border-0 bg-white shadow-lg shadow-indigo-100/70"
            title="Recommended next step"
            subtitle={`${nextActionSource(nextAction)} · evidence-informed guidance`}
            action={<Badge variant="info">{nextStepBadge(recommendation.outcome)}</Badge>}
          >
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-base font-semibold text-[var(--learn-ink)]">{recommendation.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.reason}</p>
              </div>
              {recommendation.competencyIds?.length ? (
                <p className="text-xs font-medium text-indigo-700">Focus: {recommendation.competencyIds.slice(0, 3).join(" · ")}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                {recommendationHref ? (
                  <Button variant="primary" onClick={() => router.push(recommendationHref)}>
                    {nextAction.kind === "retrieval" ? "Retrieve now" : "Use this next step"}
                  </Button>
                ) : null}
                <span className="text-xs text-slate-500">This is guidance, not a mastery or proficiency decision.</span>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-0 bg-white shadow-lg shadow-slate-200/60" title="Courses" subtitle="Your active learning paths">
            <span className="text-3xl font-bold text-indigo-600">{courses.length}</span>
            <p className="mt-2 text-sm text-slate-500">Choose a course below to continue learning.</p>
          </Card>
          <Card className="border-0 bg-white shadow-lg shadow-slate-200/60" title="Learning streak" subtitle="Come back consistently to build momentum">
            <button type="button" className="w-full text-left" onClick={() => router.push("/dashboard/streak")}>
              <span className="text-3xl font-bold text-amber-600">🔥 {gamification?.streakDays ?? 0}</span>
              <span className="mt-2 block text-sm font-medium text-amber-700">View streak →</span>
            </button>
          </Card>
          <Card className="border-0 bg-[var(--learn-mint)] shadow-lg shadow-emerald-950/5" title="Points" subtitle="Earned by completing lessons">
            <button type="button" className="w-full text-left" onClick={() => router.push("/dashboard/points")}>
              <span className="text-3xl font-bold text-indigo-600">⭐ {gamification?.totalPoints ?? 0}</span>
              <span className="mt-2 block text-sm font-medium text-indigo-700">View points & rewards →</span>
            </button>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loading ? (
            <p className="text-slate-500" role="status" aria-live="polite" aria-busy="true">Loading your courses...</p>
          ) : courses.length === 0 ? (
            <Card title="No Courses Enrolled">
              <p className="mb-4 text-sm text-slate-500">
                Start a self-paced A1 path, or ask your teacher for a class code.
              </p>
              <Button variant="primary" onClick={() => router.push("/onboarding")}>Start my A1 path</Button>
            </Card>
          ) : (
            courses.map(({ course, completedLessons, totalLessons, progressPercent, nextLesson }) => (
              <Card className="border-0 shadow-lg shadow-slate-200/60"
                key={course.id}
                title={course.title}
                subtitle={course.description}
                action={<Badge variant="success">Enrolled</Badge>}
              >
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <ProgressBar value={progressPercent} />
                  </div>

                  <p className="text-xs text-slate-500">{completedLessons} of {totalLessons} lessons completed</p>
                  <p className="text-xs text-slate-500">Course last updated {new Date(course.updatedAt).toLocaleDateString()}</p>

                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && router.push(`/learn/${course.id}/${nextLesson.id}`)}
                  >
                    {nextLesson ? "Resume Learning" : "Course Complete"}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

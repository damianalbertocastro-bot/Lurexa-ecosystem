"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { MasterMark } from "@lurexa/ui/MasterMark";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AuthService } from "@lurexa/backend";
import type { Course, LearnerRecommendationAction, Lesson, NextLearningAction } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

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

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
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
        }
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const recommendation = nextAction?.recommendation ?? null;
  const recommendationHref = recommendation?.courseId && recommendation.lessonId
    ? nextAction?.kind === "retrieval"
      ? `/learn/${recommendation.courseId}/${recommendation.lessonId}?retrieval=${encodeURIComponent(nextAction.scheduleId)}`
      : `/learn/${recommendation.courseId}/${recommendation.lessonId}`
    : null;

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-[#0b1f5f]">
      <header className="sticky top-0 z-40 border-b border-[#dfe6f8]/90 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-3 sm:px-8">
          <a href="/dashboard" aria-label="Lurexa Learn dashboard" className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]"><ProductMark product="learn" /></a>
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Lurexa Learn student navigation">
            <a href="/dashboard" aria-current="page" className="rounded-xl bg-[#eee9ff] px-3.5 py-2.5 text-sm font-extrabold text-[#592bd6]">Dashboard</a>
            <a href="/learn" className="rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-[#596b9c] transition hover:bg-[#f3f6ff] hover:text-[#071d67]">Learn</a>
            <a href="/coach" className="rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-[#596b9c] transition hover:bg-[#f3f6ff] hover:text-[#071d67]">Coach</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="hidden rounded-full sm:block" onClick={() => router.push("/dashboard/streak")} aria-label="View streak details"><Badge variant="warning">🔥 {gamification?.streakDays ?? 0} Day Streak</Badge></button>
            <button type="button" className="hidden rounded-full sm:block" onClick={() => router.push("/dashboard/points")} aria-label="View points and rewards"><Badge variant="info">⭐ {gamification?.totalPoints ?? 0} Points</Badge></button>
            <a href={process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com"} aria-label="Lurexa ecosystem" className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfe6f8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><MasterMark compact size="sm" /></a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12">
        <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-9 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#12cdd4]/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">YOUR LEARNING SPACE</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-6xl">Keep your momentum.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">Pick up exactly where you left off. Your next step is shaped by your course progress, recent evidence, and the support available to you.</p>
            <div className="mt-6 flex flex-wrap gap-3 sm:hidden"><Badge variant="warning">🔥 {gamification?.streakDays ?? 0} Day Streak</Badge><Badge variant="info">⭐ {gamification?.totalPoints ?? 0} Points</Badge></div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">ACTIVE PATHS</p><b className="mt-2 block text-4xl tracking-[-.055em] text-[#592bd6]">{courses.length}</b><p className="mt-2 text-sm text-[#6677a5]">Courses ready for you to continue.</p></article>
          <article className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">LEARNING STREAK</p><button type="button" className="mt-2 block text-left" onClick={() => router.push("/dashboard/streak")}><b className="text-4xl tracking-[-.055em] text-[#a05e20]">🔥 {gamification?.streakDays ?? 0}</b><span className="mt-2 block text-sm font-bold text-[#a05e20]">View streak →</span></button></article>
          <article className="rounded-[26px] border border-[#cfeee9] bg-[#e9fbf9] p-6 shadow-[0_12px_30px_rgba(32,52,128,.05)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#137d7f]">POINTS</p><button type="button" className="mt-2 block text-left" onClick={() => router.push("/dashboard/points")}><b className="text-4xl tracking-[-.055em] text-[#137d7f]">⭐ {gamification?.totalPoints ?? 0}</b><span className="mt-2 block text-sm font-bold text-[#137d7f]">View rewards →</span></button></article>
        </div>

        {nextAction && recommendation && (
          <section className="mt-6 overflow-hidden rounded-[30px] border border-[#dfe6f8] bg-white shadow-[0_16px_40px_rgba(32,52,128,.08)]">
            <div className="grid lg:grid-cols-[.72fr_1.28fr]">
              <div className="bg-gradient-to-br from-[#592bd6] to-[#315fd7] p-7 text-white sm:p-9"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#9af4ef]">RECOMMENDED NEXT STEP</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em]">{recommendation.label}</h2><p className="mt-4 text-sm leading-6 text-indigo-100">{nextActionSource(nextAction)} · evidence-informed guidance</p></div>
              <div className="p-7 sm:p-9"><div className="flex flex-wrap items-start justify-between gap-3"><p className="max-w-2xl text-sm leading-7 text-[#6677a5]">{recommendation.reason}</p><Badge variant="info">{nextStepBadge(recommendation.outcome)}</Badge></div>{recommendation.competencyIds?.length ? <p className="mt-4 text-xs font-bold text-[#592bd6]">Focus: {recommendation.competencyIds.slice(0, 3).join(" · ")}</p> : null}<div className="mt-6 flex flex-wrap items-center gap-3">{recommendationHref ? <Button variant="primary" onClick={() => router.push(recommendationHref)}>{nextAction.kind === "retrieval" ? "Retrieve now" : "Use this next step"}</Button> : null}<span className="text-xs text-[#8794b6]">Guidance, not a mastery or proficiency decision.</span></div></div>
            </div>
          </section>
        )}

        <section className="mt-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[.18em] text-[#592bd6]">YOUR COURSES</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Continue learning.</h2></div></div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {loading ? <p className="text-[#6677a5]">Loading your courses...</p> : courses.length === 0 ? <Card title="No courses enrolled"><p className="mb-4 text-sm text-[#6677a5]">Start a self-paced A1 path, or ask your teacher for a class code.</p><Button variant="primary" onClick={() => router.push("/onboarding")}>Start my A1 path</Button></Card> : courses.map(({ course, completedLessons, totalLessons, progressPercent, nextLesson }) => (
              <article key={course.id} className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)] sm:p-7"><div className="flex items-start justify-between gap-4"><div><Badge variant="success">Enrolled</Badge><h3 className="mt-4 text-2xl font-black tracking-[-.04em]">{course.title}</h3><p className="mt-2 text-sm leading-6 text-[#6677a5]">{course.description}</p></div></div><div className="mt-6"><div className="mb-2 flex justify-between text-xs font-bold text-[#7280a6]"><span>Progress</span><span>{progressPercent}%</span></div><ProgressBar value={progressPercent} /></div><p className="mt-3 text-xs text-[#8794b6]">{completedLessons} of {totalLessons} lessons completed</p><Button variant="primary" className="mt-6 w-full" disabled={!nextLesson} onClick={() => nextLesson && router.push(`/learn/${course.id}/${nextLesson.id}`)}>{nextLesson ? "Resume learning" : "Course complete"}</Button></article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

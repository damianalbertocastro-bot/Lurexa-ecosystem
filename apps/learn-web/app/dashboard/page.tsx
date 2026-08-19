"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { Course, Lesson } from "@lurexa/types";
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
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<LearnerCourseSummary[]>([]);
  const [gamification, setGamification] = useState<LearnerGamificationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      try {
        if (!user) return;
        const response = await authenticatedFetch("/api/learning?studentDashboard=1");
        if (!response.ok) throw new Error("Unable to load your learning path.");
        const dashboard = await response.json() as LearnerDashboardSummary;
        setCourses(dashboard.courses);
        setGamification(dashboard.gamification);
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : "Unable to load your learning path.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const activeCourse = courses.find(({ nextLesson }) => nextLesson) ?? courses[0];
  const nextLesson = activeCourse?.nextLesson;
  const updatedLabel = activeCourse ? new Date(activeCourse.course.updatedAt).toLocaleDateString() : "";

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)]">
      <header className="border-b border-[var(--learn-line)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-10">
          <LurexaLearnLogo />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => router.push("/dashboard/streak")} className="rounded-full border border-amber-200 bg-[var(--learn-sand)] px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" aria-label="View streak details">
              🔥 {gamification?.streakDays ?? 0} day streak
            </button>
            <button type="button" onClick={() => router.push("/dashboard/points")} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-800 transition hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="View points and rewards">
              ✦ {gamification?.totalPoints ?? 0} points
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[.17em] text-[var(--learn-brand-strong)]">YOUR LEARNING SPACE</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--learn-ink)]">Keep your momentum.</h1>
            <p className="mt-2 text-[var(--learn-muted)]">One meaningful step is enough for today.</p>
          </div>
          {gamification?.lastActivityAt ? <p className="text-sm text-[var(--learn-muted)]">Last activity: {new Date(gamification.lastActivityAt).toLocaleDateString()}</p> : null}
        </section>

        {loading ? (
          <section className="mt-8 rounded-3xl border border-[var(--learn-line)] bg-white p-8 text-[var(--learn-muted)]">Loading your learning path…</section>
        ) : !activeCourse ? (
          <section className="mt-8 rounded-3xl border border-[var(--learn-line)] bg-white p-8 sm:p-10">
            <p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">YOUR NEXT STEP</p>
            <h2 className="mt-3 text-2xl font-bold">You&apos;re ready to join a class.</h2>
            <p className="mt-3 max-w-xl leading-7 text-[var(--learn-muted)]">Your teacher can share a class access code to connect your account to a learning path.</p>
            <button type="button" onClick={() => router.push("/signup")} className="mt-6 rounded-xl bg-[var(--learn-brand)] px-5 py-3 font-bold text-white transition hover:bg-[var(--learn-brand-strong)]">Join a class</button>
          </section>
        ) : (
          <>
            <section className="mt-8 grid gap-5 lg:grid-cols-[1.45fr_.55fr]">
              <article className="overflow-hidden rounded-3xl bg-[var(--learn-ink)] p-7 text-white shadow-xl shadow-slate-300/40 sm:p-9">
                <p className="text-xs font-bold tracking-[.17em] text-sky-200">CONTINUE YOUR PATH</p>
                <div className="mt-8 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                  <div className="max-w-xl">
                    <p className="text-sm font-semibold text-sky-200">{activeCourse.course.title}</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{nextLesson ? nextLesson.title : "You completed this course."}</h2>
                    <p className="mt-4 leading-7 text-slate-300">{nextLesson ? "Continue with the next lesson in your current learning sequence." : "Take a moment to review your progress and ask your teacher what to explore next."}</p>
                  </div>
                  {nextLesson ? <button type="button" onClick={() => router.push(`/learn/${activeCourse.course.id}/${nextLesson.id}`)} className="shrink-0 rounded-xl bg-white px-5 py-3.5 font-bold text-[var(--learn-ink)] transition hover:bg-[var(--learn-sky)]">Start lesson →</button> : null}
                </div>
                <div className="mt-9 border-t border-white/15 pt-5 text-sm text-slate-300">
                  <span className="font-semibold text-white">Why this next:</span> it follows the progress you have already made in this course.
                </div>
              </article>

              <aside className="rounded-3xl border border-[var(--learn-line)] bg-white p-7">
                <p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">YOUR PROGRESS</p>
                <p className="mt-5 text-4xl font-bold tracking-tight">{activeCourse.progressPercent}%</p>
                <p className="mt-1 text-sm text-[var(--learn-muted)]">through {activeCourse.course.title}</p>
                <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-teal-500" style={{ width: `${activeCourse.progressPercent}%` }} /></div>
                <p className="mt-3 text-sm text-[var(--learn-muted)]">{activeCourse.completedLessons} of {activeCourse.totalLessons} lessons completed</p>
                <button type="button" onClick={() => router.push("/dashboard/streak")} className="mt-7 w-full rounded-xl bg-[var(--learn-sand)] px-4 py-3 text-left text-sm font-bold text-amber-900 transition hover:bg-amber-100">Build a sustainable streak →</button>
              </aside>
            </section>

            <section className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <div><p className="text-xs font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">YOUR COURSES</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Your active learning paths</h2></div>
                <p className="hidden text-sm text-[var(--learn-muted)] sm:block">Progress is a guide, not a grade.</p>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {courses.map(({ course, completedLessons, totalLessons, progressPercent, nextLesson: courseNextLesson }) => (
                  <article key={course.id} className="rounded-2xl border border-[var(--learn-line)] bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{course.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--learn-muted)]">{course.description}</p></div><span className="rounded-full bg-[var(--learn-mint)] px-2.5 py-1 text-xs font-bold text-emerald-800">Active</span></div>
                    <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[var(--learn-brand)]" style={{ width: `${progressPercent}%` }} /></div>
                    <p className="mt-3 text-sm text-[var(--learn-muted)]">{completedLessons} of {totalLessons} lessons · {progressPercent}%</p>
                    <p className="mt-3 text-xs text-slate-400">Updated {new Date(course.updatedAt).toLocaleDateString()}</p>
                    <button type="button" disabled={!courseNextLesson} onClick={() => courseNextLesson && router.push(`/learn/${course.id}/${courseNextLesson.id}`)} className="mt-6 w-full rounded-xl border border-[var(--learn-line)] px-4 py-2.5 text-sm font-bold text-[var(--learn-ink)] transition hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50">{courseNextLesson ? "Continue course" : "Course complete"}</button>
                  </article>
                ))}
              </div>
              <p className="mt-5 text-xs text-slate-400">Current path updated {updatedLabel}.</p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

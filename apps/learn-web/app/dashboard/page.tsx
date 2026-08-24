"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { AuthService, type AuthenticatedUser } from "@lurexa/backend";
import type { Course, LearnerRecommendationAction, Lesson, NextLearningAction } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";
import { DashboardGreetingHeader } from "./components/DashboardGreetingHeader";
import { DashboardTourModal } from "./components/DashboardTourModal";
import { VisualStreakTracker } from "./components/VisualStreakTracker";
import { MilestoneAchievementsCard } from "./components/MilestoneAchievementsCard";
import { CoachPracticeCard } from "./components/CoachPracticeCard";
import { SupportHelpModal } from "./components/SupportHelpModal";

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

const TOUR_STORAGE_KEY = "lurexa_tour_seen";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [courses, setCourses] = useState<LearnerCourseSummary[]>([]);
  const [gamification, setGamification] = useState<LearnerGamificationSummary | null>(null);
  const [nextAction, setNextAction] = useState<NextLearningAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      setLoading(true);
      setError(null);
      setCurrentUser(user);

      try {
        if (user) {
          const [dashboardResponse, adaptationResponse] = await Promise.all([
            authenticatedFetch("/api/learning?studentDashboard=1"),
            authenticatedFetch("/api/learning/adaptation"),
          ]);
          if (!dashboardResponse.ok) throw new Error("Unable to load dashboard.");
          const dashboard = (await dashboardResponse.json()) as LearnerDashboardSummary;
          setCourses(dashboard.courses);
          setGamification(dashboard.gamification);

          if (adaptationResponse.ok) {
            setNextAction((await adaptationResponse.json()) as NextLearningAction);
          } else if (dashboard.nextStep) {
            setNextAction({ kind: "mind_recommendation", recommendation: dashboard.nextStep });
          }

          // Check if onboarding tour has been completed
          try {
            const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
            if (!hasSeenTour) {
              setIsTourOpen(true);
            }
          } catch {
            // LocalStorage might be inaccessible in some sandbox contexts
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
  const recommendationHref =
    recommendation?.courseId && recommendation.lessonId
      ? nextAction?.kind === "retrieval"
        ? `/learn/${recommendation.courseId}/${recommendation.lessonId}?retrieval=${encodeURIComponent(nextAction.scheduleId)}`
        : `/learn/${recommendation.courseId}/${recommendation.lessonId}`
      : null;

  const totalCompletedLessons = courses.reduce(
    (accum, item) => accum + item.completedLessons,
    0,
  );
  const hasCompletedCourse = courses.some((c) => c.progressPercent === 100);

  const handleStartFirstLesson = () => {
    if (courses.length > 0 && courses[0]?.nextLesson) {
      router.push(`/learn/${courses[0].course.id}/${courses[0].nextLesson.id}`);
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Task 1: Dynamic Personalized Greeting Header */}
        <DashboardGreetingHeader
          user={currentUser}
          streakDays={gamification?.streakDays ?? 0}
          totalPoints={gamification?.totalPoints ?? 0}
          onOpenTour={() => setIsTourOpen(true)}
        />

        {error ? (
          <div
            className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900 shadow-sm"
            role="alert"
          >
            <p className="font-bold">Your dashboard could not be loaded.</p>
            <p className="mt-1 text-rose-700">{error}</p>
            <Button
              className="mt-4"
              variant="secondary"
              onClick={() => setReloadKey((current) => current + 1)}
            >
              Try again
            </Button>
          </div>
        ) : null}

        {/* Responsive Grid Layout (Main Content + Sidebar) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column (lg:col-span-2) */}
          <main className="space-y-8 lg:col-span-2">
            {/* Recommended Next Step Card */}
            {nextAction && recommendation && (
              <Card
                className="border-0 bg-white shadow-lg shadow-indigo-100/70"
                title="Recommended next step"
                subtitle={`${nextActionSource(nextAction)} · evidence-informed guidance`}
                action={<Badge variant="info">{nextStepBadge(recommendation.outcome)}</Badge>}
              >
                <div className="space-y-4 pt-2">
                  <div>
                    <p className="text-base font-bold text-[#071d67]">
                      {recommendation.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {recommendation.reason}
                    </p>
                  </div>
                  {recommendation.competencyIds?.length ? (
                    <p className="text-xs font-semibold text-indigo-700">
                      Focus: {recommendation.competencyIds.slice(0, 3).join(" · ")}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {recommendationHref ? (
                      <Button
                        variant="primary"
                        onClick={() => router.push(recommendationHref)}
                      >
                        {nextAction.kind === "retrieval"
                          ? "Retrieve now"
                          : "Use this next step"}
                      </Button>
                    ) : null}
                    <span className="text-xs text-slate-500">
                      This is guidance, not a mastery or proficiency decision.
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Enrolled Courses Section */}
            <section className="space-y-4" aria-labelledby="enrolled-courses-heading">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    id="enrolled-courses-heading"
                    className="text-xl font-black tracking-tight text-[#071d67]"
                  >
                    Your Courses
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Structured CEFR English pathways
                  </p>
                </div>
                <Badge variant="info">{courses.length} Active</Badge>
              </div>

              {loading ? (
                <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                  <p role="status" aria-live="polite" aria-busy="true">
                    Loading your learning paths...
                  </p>
                </div>
              ) : courses.length === 0 ? (
                <Card
                  className="border-0 bg-white shadow-lg shadow-slate-200/60"
                  title="No Courses Enrolled"
                >
                  <p className="mb-4 text-sm text-slate-500">
                    Start a self-paced A1 English path, or ask your teacher for a class code.
                  </p>
                  <Button variant="primary" onClick={() => router.push("/onboarding")}>
                    Start my A1 path
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {courses.map(
                    ({
                      course,
                      completedLessons,
                      totalLessons,
                      progressPercent,
                      nextLesson,
                    }) => (
                      <Card
                        className="border-0 bg-white shadow-lg shadow-slate-200/60 transition-all hover:shadow-xl hover:shadow-indigo-950/5 flex flex-col justify-between"
                        key={course.id}
                        title={course.title}
                        subtitle={course.description}
                        action={<Badge variant="success">Enrolled</Badge>}
                      >
                        <div className="space-y-4 pt-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                              <span>Progress</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <ProgressBar value={progressPercent} />
                            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                              <span>
                                {completedLessons} of {totalLessons} lessons
                              </span>
                              <span>
                                Updated {new Date(course.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            className="w-full"
                            disabled={!nextLesson}
                            onClick={() =>
                              nextLesson &&
                              router.push(`/learn/${course.id}/${nextLesson.id}`)
                            }
                          >
                            {nextLesson ? "Resume Learning →" : "Course Complete ✓"}
                          </Button>
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </section>

            {/* Task 5 / Task 0: Dedicated Practice with Lurexa Coach Card */}
            <CoachPracticeCard />
          </main>

          {/* Sidebar Column (lg:col-span-1) */}
          <aside className="space-y-8 lg:col-span-1" aria-label="Learning momentum and rewards">
            {/* Task 3: Visual 7-Day Streak Tracker */}
            <VisualStreakTracker
              streakDays={gamification?.streakDays ?? 0}
              lastActivityAt={gamification?.lastActivityAt}
            />

            {/* Task 4: Recent Milestone & Achievements Card */}
            <MilestoneAchievementsCard
              completedLessonsCount={totalCompletedLessons}
              streakDays={gamification?.streakDays ?? 0}
              totalPoints={gamification?.totalPoints ?? 0}
              hasCompletedCourse={hasCompletedCourse}
              onStartLesson={handleStartFirstLesson}
            />

            {/* Adaptive Placement Card */}
            <Card
              className="border-0 bg-white shadow-lg shadow-slate-200/60"
              title="Placement Diagnostic"
              subtitle="Calibrate your CEFR proficiency level"
            >
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Take the adaptive multi-skill diagnostic to evaluate your listening, grammar, and pronunciation readiness across A1–C1.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push("/placement")}
                >
                  Take Diagnostic Placement 🎯
                </Button>
              </div>
            </Card>

            {/* Points & Learning Rewards Summary */}
            <Card
              className="border-0 bg-white shadow-lg shadow-slate-200/60"
              title="Points & Rewards"
              subtitle="Earn 10 points per completed lesson"
            >
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⭐</span>
                    <div>
                      <p className="text-2xl font-black text-indigo-600">
                        {gamification?.totalPoints ?? 0}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        Cumulative points balance
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push("/dashboard/points")}
                  >
                    Details →
                  </Button>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs text-indigo-950">
                  <p className="font-bold">✦ Momentum Reward</p>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    Complete upcoming lessons to unlock badges and advance along your CEFR proficiency path.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Task 2: First-Session Onboarding Tour Modal */}
      <DashboardTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* Task 5: Consolidate Coach Entry Points into Floating Support trigger */}
      <SupportHelpModal />
    </div>
  );
}

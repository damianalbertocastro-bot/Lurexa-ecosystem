"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { AuthService } from "@lurexa/backend";
import { Course, Lesson } from "@lurexa/types";
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
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<LearnerCourseSummary[]>([]);
  const [gamification, setGamification] = useState<LearnerGamificationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      try {
        if (user) {
          const response = await authenticatedFetch("/api/learning?studentDashboard=1");
          if (!response.ok) throw new Error("Unable to load dashboard.");
          const dashboard = await response.json() as LearnerDashboardSummary;
          setCourses(dashboard.courses);
          setGamification(dashboard.gamification);
        }
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header with Gamification */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Student Workspace</h1>
            <p className="text-slate-500">Pick up right where you left off</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2" onClick={() => router.push("/dashboard/streak")} aria-label="View streak details">
              <Badge variant="warning">🔥 {gamification?.streakDays ?? 0} Day Streak</Badge>
            </button>
            <button type="button" className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => router.push("/dashboard/points")} aria-label="View points and rewards">
              <Badge variant="info">⭐ {gamification?.totalPoints ?? 0} Points</Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card title="Courses" subtitle="Your active learning paths">
            <span className="text-3xl font-bold text-indigo-600">{courses.length}</span>
            <p className="mt-2 text-sm text-slate-500">Choose a course below to continue learning.</p>
          </Card>
          <Card title="Learning streak" subtitle="Come back consistently to build momentum">
            <button type="button" className="w-full text-left" onClick={() => router.push("/dashboard/streak")}>
              <span className="text-3xl font-bold text-amber-600">🔥 {gamification?.streakDays ?? 0}</span>
              <span className="mt-2 block text-sm font-medium text-amber-700">View streak →</span>
            </button>
          </Card>
          <Card title="Points" subtitle="Earned by completing lessons">
            <button type="button" className="w-full text-left" onClick={() => router.push("/dashboard/points")}>
              <span className="text-3xl font-bold text-indigo-600">⭐ {gamification?.totalPoints ?? 0}</span>
              <span className="mt-2 block text-sm font-medium text-indigo-700">View points & rewards →</span>
            </button>
          </Card>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loading ? (
            <p className="text-slate-500">Loading your courses...</p>
          ) : courses.length === 0 ? (
            <Card title="No Courses Enrolled">
              <p className="text-sm text-slate-500 mb-4">
                You are not enrolled in any courses yet. Ask your teacher for a class code.
              </p>
            </Card>
          ) : (
            courses.map(({ course, completedLessons, totalLessons, progressPercent, nextLesson }) => (
              <Card
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

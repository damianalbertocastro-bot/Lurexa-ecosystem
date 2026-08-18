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

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<LearnerCourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.onUserChanged(async (user) => {
      if (user) {
        const response = await authenticatedFetch("/api/learning");
        if (!response.ok) throw new Error("Unable to load courses.");
        setCourses(await response.json() as LearnerCourseSummary[]);
      }
      setLoading(false);
    });
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
            <Badge variant="warning">🔥 5 Day Streak</Badge>
            <Badge variant="info">⭐ 320 Points</Badge>
          </div>
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

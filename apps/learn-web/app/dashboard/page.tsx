"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { CourseService, AuthService } from "@lurexa/backend";
import { Course } from "@lurexa/types";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.onUserChanged(async (user) => {
      if (user) {
        const claims = await AuthService.getUserClaims(user);
        if (claims.orgId) {
          const orgCourses = await CourseService.getCoursesByOrg(claims.orgId);
          setCourses(orgCourses);
        }
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
            courses.map((course) => (
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
                      <span>40%</span>
                    </div>
                    <ProgressBar value={40} />
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      router.push(`/learn/${course.id}/lesson_1`);
                    }}
                  >
                    Resume Learning
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

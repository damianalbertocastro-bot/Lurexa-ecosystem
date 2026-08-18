"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Course, Lesson } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type TeacherCourseSummary = { course: Course; lessons: Array<{ moduleTitle: string; lesson: Lesson }> };

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await authenticatedFetch("/api/learning?teacherDashboard=1");
        const payload = await response.json() as TeacherCourseSummary[] & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load courses.");
        setCourses(payload);
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : "Unable to load courses.");
      } finally {
        setLoading(false);
      }
    }
    void loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-3xl font-bold text-slate-900">Course management</h1><p className="text-slate-500">Create courses and review the lessons in each course.</p></div>
          <div className="flex gap-3"><Button variant="secondary" onClick={() => router.push("/teacher/dashboard")}>Back to dashboard</Button><Button variant="primary" onClick={() => router.push("/teacher/courses/new")}>Create course</Button></div>
        </div>
        {loading ? <p className="text-slate-500">Loading courses...</p> : courses.length === 0 ? <Card title="No courses yet"><p className="text-slate-500">Create a course, then add modules and lessons in the course builder.</p></Card> : courses.map(({ course, lessons }) => (
          <Card key={course.id} title={course.title} subtitle={`Last updated ${new Date(course.updatedAt).toLocaleString()}`}>
            <div className="flex flex-wrap items-center gap-3 pt-2"><Badge variant={course.status === "published" ? "success" : "warning"}>{course.status}</Badge><span className="text-sm text-slate-600">{course.description}</span></div>
            <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
              {lessons.length === 0 ? <p className="py-3 text-sm text-slate-500">No lessons yet.</p> : lessons.map(({ moduleTitle, lesson }) => <div key={lesson.id} className="py-3 text-sm"><span className="font-medium text-slate-900">{lesson.title}</span><span className="text-slate-500"> · {moduleTitle} · {lesson.estimatedMinutes} min</span></div>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

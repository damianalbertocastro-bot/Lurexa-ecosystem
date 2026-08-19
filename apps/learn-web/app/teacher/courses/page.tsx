"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import { ContentBlock, Course, Lesson } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type TeacherCourseSummary = { course: Course; lessons: Array<{ moduleTitle: string; lesson: Lesson }> };

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [saving, setSaving] = useState(false);

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

  const saveChange = async <T,>(body: Record<string, unknown>): Promise<T> => {
    const response = await authenticatedFetch("/api/learning", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const payload = await response.json() as T & { error?: string };
    if (!response.ok) throw new Error(payload.error ?? "Unable to save changes.");
    return payload;
  };

  const openCourseEditor = (course: Course) => { setEditingCourse(course); setCourseTitle(course.title); setCourseDescription(course.description); };
  const openLessonEditor = (lesson: Lesson) => { setEditingLesson(lesson); setLessonTitle(lesson.title); setLessonContent(typeof lesson.contentBlocks.find((block) => block.type === "text")?.data.text === "string" ? lesson.contentBlocks.find((block) => block.type === "text")!.data.text as string : ""); };

  const handleUpdateCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingCourse) return;
    setSaving(true);
    try {
      const updated = await saveChange<Course>({ action: "updateCourse", courseId: editingCourse.id, title: courseTitle.trim(), description: courseDescription.trim() });
      setCourses((current) => current.map((item) => item.course.id === updated.id ? { ...item, course: updated } : item));
      setEditingCourse(null);
    } catch (error: unknown) { alert(error instanceof Error ? error.message : "Unable to update course."); } finally { setSaving(false); }
  };

  const handleUpdateLesson = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingLesson) return;
    setSaving(true);
    try {
      const contentBlocks: ContentBlock[] = editingLesson.contentBlocks.map((block) => block.type === "text" ? { ...block, data: { ...block.data, text: lessonContent.trim() } } : block);
      const updated = await saveChange<Lesson>({ action: "updateLesson", lessonId: editingLesson.id, title: lessonTitle.trim(), contentBlocks });
      setCourses((current) => current.map((item) => ({ ...item, lessons: item.lessons.map((entry) => entry.lesson.id === updated.id ? { ...entry, lesson: updated } : entry) })));
      setEditingLesson(null);
    } catch (error: unknown) { alert(error instanceof Error ? error.message : "Unable to update lesson."); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-3xl font-bold text-slate-900">Course management</h1><p className="text-slate-500">Create courses and review the lessons in each course.</p></div>
          <div className="flex gap-3"><Button variant="secondary" onClick={() => router.push("/teacher/dashboard")}>Back to dashboard</Button><Button variant="primary" onClick={() => router.push("/teacher/courses/new")}>Create course</Button></div>
        </div>
        {loading ? <p className="text-slate-500">Loading courses...</p> : courses.length === 0 ? <Card title="No courses yet"><p className="text-slate-500">Create a course, then add modules and lessons in the course builder.</p></Card> : courses.map(({ course, lessons }) => (
          <Card key={course.id} title={course.title} subtitle={`Last updated ${new Date(course.updatedAt).toLocaleString()}`}>
            <div className="flex flex-wrap items-center gap-3 pt-2"><Badge variant={course.status === "published" ? "success" : "warning"}>{course.status}</Badge><span className="text-sm text-slate-600">{course.description}</span><Button variant="secondary" size="sm" onClick={() => openCourseEditor(course)}>Edit course</Button></div>
            <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
              {lessons.length === 0 ? <p className="py-3 text-sm text-slate-500">No lessons yet.</p> : lessons.map(({ moduleTitle, lesson }) => <div key={lesson.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span><span className="font-medium text-slate-900">{lesson.title}</span><span className="text-slate-500"> · {moduleTitle} · {lesson.estimatedMinutes} min · {lesson.contentBlocks.filter((block) => block.type === "interactive" || block.type === "quiz_embed").length} activities</span></span><span className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => openLessonEditor(lesson)}>Edit text</Button><Button variant="secondary" size="sm" onClick={() => router.push(`/teacher/courses/new?courseId=${encodeURIComponent(course.id)}&lessonId=${encodeURIComponent(lesson.id)}`)}>Edit activities</Button></span></div>)}
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={editingCourse !== null} onClose={() => setEditingCourse(null)} title="Edit course details"><form onSubmit={handleUpdateCourse} className="space-y-4"><Input label="Course title" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} required /><Input label="Description" value={courseDescription} onChange={(event) => setCourseDescription(event.target.value)} required /><Button type="submit" className="w-full" isLoading={saving}>Save course changes</Button></form></Modal>
      <Modal isOpen={editingLesson !== null} onClose={() => setEditingLesson(null)} title="Edit lesson"><form onSubmit={handleUpdateLesson} className="space-y-4"><Input label="Lesson title" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} required /><label className="block text-sm font-medium text-slate-700">Lesson content<textarea className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-slate-900" value={lessonContent} onChange={(event) => setLessonContent(event.target.value)} rows={8} required /></label><Button type="submit" className="w-full" isLoading={saving}>Save lesson changes</Button></form></Modal>
    </div>
  );
}

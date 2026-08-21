"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Modal } from "@lurexa/ui/Modal";
import type { ContentBlock, Course, Lesson } from "@lurexa/types";
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
    void (async () => {
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
    })();
  }, []);

  async function saveChange<T>(body: Record<string, unknown>): Promise<T> {
    const response = await authenticatedFetch("/api/learning", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const payload = await response.json() as T & { error?: string };
    if (!response.ok) throw new Error(payload.error ?? "Unable to save changes.");
    return payload;
  }

  function openCourseEditor(course: Course) {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
  }

  function openLessonEditor(lesson: Lesson) {
    const textBlock = lesson.contentBlocks.find((block) => block.type === "text");
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonContent(typeof textBlock?.data.text === "string" ? textBlock.data.text : "");
  }

  async function handleUpdateCourse(event: React.FormEvent) {
    event.preventDefault();
    if (!editingCourse) return;
    setSaving(true);
    try {
      const updated = await saveChange<Course>({ action: "updateCourse", courseId: editingCourse.id, title: courseTitle.trim(), description: courseDescription.trim() });
      setCourses((current) => current.map((item) => item.course.id === updated.id ? { ...item, course: updated } : item));
      setEditingCourse(null);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to update course.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateLesson(event: React.FormEvent) {
    event.preventDefault();
    if (!editingLesson) return;
    setSaving(true);
    try {
      const contentBlocks: ContentBlock[] = editingLesson.contentBlocks.map((block) => block.type === "text" ? { ...block, data: { ...block.data, text: lessonContent.trim() } } : block);
      const updated = await saveChange<Lesson>({ action: "updateLesson", lessonId: editingLesson.id, title: lessonTitle.trim(), contentBlocks });
      setCourses((current) => current.map((item) => ({ ...item, lessons: item.lessons.map((entry) => entry.lesson.id === updated.id ? { ...entry, lesson: updated } : entry) })));
      setEditingLesson(null);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to update lesson.");
    } finally {
      setSaving(false);
    }
  }

  const published = courses.filter(({ course }) => course.status === "published").length;
  const lessonCount = courses.reduce((total, item) => total + item.lessons.length, 0);

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-10 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">COURSE OPERATIONS · LUREXA LEARN</p><h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-5xl">Build and maintain the learning path.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100">Manage course structure, lesson text, and activity authoring from the Learn teacher workspace.</p></div><Button variant="primary" onClick={() => router.push("/teacher/courses/new")}>Create course →</Button></div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[["COURSES", courses.length], ["PUBLISHED", published], ["LESSONS", lessonCount]].map(([label, value]) => <article key={label} className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">{label}</p><b className="mt-3 block text-4xl tracking-[-.055em] text-[#592bd6]">{value}</b></article>)}
      </section>

      <section className="mt-6 space-y-4">
        {loading ? <div className="rounded-[26px] border border-[#dfe6f8] bg-white p-7 text-[#6677a5]">Loading courses…</div> : courses.length === 0 ? <div className="rounded-[30px] border border-dashed border-[#bdc9e8] bg-white p-8 text-center"><h2 className="text-2xl font-black text-[#10245f]">No courses yet.</h2><p className="mt-2 text-sm text-[#6677a5]">Create a course, then add modules, lessons, and structured learning activities.</p><Button variant="primary" className="mt-5" onClick={() => router.push("/teacher/courses/new")}>Create first course</Button></div> : courses.map(({ course, lessons }) => <article key={course.id} className="rounded-[30px] border border-[#dfe6f8] bg-white p-6 shadow-[0_14px_36px_rgba(32,52,128,.07)] sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-2"><Badge variant={course.status === "published" ? "success" : "warning"}>{course.status}</Badge><span className="text-xs font-bold text-[#8794b6]">Updated {new Date(course.updatedAt).toLocaleDateString()}</span></div><h2 className="mt-3 text-2xl font-black tracking-[-.04em] text-[#10245f]">{course.title}</h2><p className="mt-2 text-sm leading-6 text-[#6677a5]">{course.description}</p></div><Button variant="secondary" size="sm" onClick={() => openCourseEditor(course)}>Edit course</Button></div><div className="mt-6 divide-y divide-[#edf1fb] overflow-hidden rounded-2xl border border-[#dfe6f8]">{lessons.length === 0 ? <p className="p-5 text-sm text-[#6677a5]">No lessons yet.</p> : lessons.map(({ moduleTitle, lesson }) => <div key={lesson.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><b className="text-[#10245f]">{lesson.title}</b><p className="mt-1 text-xs text-[#6677a5]">{moduleTitle} · {lesson.estimatedMinutes} min · {lesson.contentBlocks.filter((block) => block.type === "interactive" || block.type === "quiz_embed").length} activities</p></div><div className="flex flex-wrap gap-2"><Button variant="ghost" size="sm" onClick={() => openLessonEditor(lesson)}>Edit text</Button><Button variant="secondary" size="sm" onClick={() => router.push(`/teacher/courses/new?courseId=${encodeURIComponent(course.id)}&lessonId=${encodeURIComponent(lesson.id)}`)}>Edit activities</Button></div></div>)}</div></article>)}
      </section>

      <Modal isOpen={editingCourse !== null} onClose={() => setEditingCourse(null)} title="Edit course details"><form onSubmit={handleUpdateCourse} className="space-y-4"><Input label="Course title" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} required /><Input label="Description" value={courseDescription} onChange={(event) => setCourseDescription(event.target.value)} required /><Button type="submit" className="w-full" isLoading={saving}>Save course changes</Button></form></Modal>
      <Modal isOpen={editingLesson !== null} onClose={() => setEditingLesson(null)} title="Edit lesson"><form onSubmit={handleUpdateLesson} className="space-y-4"><Input label="Lesson title" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} required /><label className="block text-sm font-medium text-[#314b88]">Lesson content<textarea className="mt-1 w-full rounded-xl border border-[#d7e0f6] p-3 text-[#071d67]" value={lessonContent} onChange={(event) => setLessonContent(event.target.value)} rows={8} required /></label><Button type="submit" className="w-full" isLoading={saving}>Save lesson changes</Button></form></Modal>
    </main>
  );
}

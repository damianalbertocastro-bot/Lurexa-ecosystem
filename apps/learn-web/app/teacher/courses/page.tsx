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
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";

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
    <>
      <TeacherWorkspaceBanner
        title="Course management"
        subtitle="Create courses and review the lessons in each course."
        breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Courses" }]}
        actions={
          <Button variant="primary" onClick={() => router.push("/teacher/courses/new")}>Create course</Button>
        }
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? <p className="text-[#4d5e8c]">Loading courses...</p> : courses.length === 0 ? <Card title="No courses yet"><p className="text-[#4d5e8c]">Create a course, then add modules and lessons in the course builder.</p></Card> : courses.map(({ course, lessons }) => (
          <Card key={course.id} title={course.title} subtitle={`Last updated ${new Date(course.updatedAt).toLocaleString()}`}>
            <div className="flex flex-wrap items-center gap-3 pt-2"><Badge variant={course.status === "published" ? "success" : "warning"}>{course.status}</Badge><span className="text-sm text-[#5d6f9d]">{course.description}</span><Button variant="secondary" size="sm" onClick={() => openCourseEditor(course)}>Edit course</Button></div>
            <div className="mt-4 divide-y divide-[#edf1fb] rounded-xl border border-[#dfe7fb] px-4">
              {lessons.length === 0 ? <p className="py-3 text-sm text-[#4d5e8c]">No lessons yet.</p> : lessons.map(({ moduleTitle, lesson }) => <div key={lesson.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span><span className="font-medium text-[#071d67]">{lesson.title}</span><span className="text-[#4d5e8c]"> · {moduleTitle} · {lesson.estimatedMinutes} min · {lesson.contentBlocks.filter((block) => block.type === "interactive" || block.type === "quiz_embed").length} activities</span></span><span className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => openLessonEditor(lesson)}>Edit text</Button><Button variant="secondary" size="sm" onClick={() => router.push(`/teacher/courses/new?courseId=${encodeURIComponent(course.id)}&lessonId=${encodeURIComponent(lesson.id)}`)}>Edit activities</Button></span></div>)}
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={editingCourse !== null} onClose={() => setEditingCourse(null)} title="Edit course details"><form onSubmit={handleUpdateCourse} className="space-y-4"><Input label="Course title" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} required /><Input label="Description" value={courseDescription} onChange={(event) => setCourseDescription(event.target.value)} required /><Button type="submit" className="w-full" isLoading={saving}>Save course changes</Button></form></Modal>
      <Modal isOpen={editingLesson !== null} onClose={() => setEditingLesson(null)} title="Edit lesson"><form onSubmit={handleUpdateLesson} className="space-y-4"><Input label="Lesson title" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} required /><label className="block text-sm font-medium text-[#314b88]">Lesson content<textarea className="mt-1 w-full rounded-xl border border-[#d7e0f6] p-3 text-[#071d67]" value={lessonContent} onChange={(event) => setLessonContent(event.target.value)} rows={8} required /></label><Button type="submit" className="w-full" isLoading={saving}>Save lesson changes</Button></form></Modal>
    </>
  );
}

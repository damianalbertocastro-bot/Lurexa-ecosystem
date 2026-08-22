"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, OrganizationService } from "@lurexa/backend";
import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { authenticatedFetch } from "../../../../lib/authenticated-fetch";
import {
  buildActivityBlocks,
  LearningActivityEditor,
  readActivityDrafts,
  type ActivityDraft,
} from "./LearningActivityEditor";
import {
  buildLearningCapabilityBlocks,
  LearningCapabilityEditor,
  readLearningCapabilityDrafts,
  type CapabilityDraft,
} from "./LearningCapabilityEditor";

async function saveCourseChange<T>(body: Record<string, unknown>): Promise<T> {
  const response = await authenticatedFetch("/api/learning", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "Unable to save course changes.");
  return payload;
}

type ModuleSummary = { id: string; title: string };

type TeacherCoursePayload = Array<{
  course: Course;
  lessons: Array<{ moduleTitle: string; lesson: Lesson }>;
}> & { error?: string };

function CourseBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCourseId = searchParams.get("courseId");
  const requestedLessonId = searchParams.get("lessonId");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teacherContext, setTeacherContext] = useState<{ orgId: string; userId: string } | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleSummary | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [activityDrafts, setActivityDrafts] = useState<ActivityDraft[]>([]);
  const [capabilityDrafts, setCapabilityDrafts] = useState<CapabilityDraft[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    return AuthService.onUserChanged(async (user) => {
      if (!user) return;
      const memberships = await OrganizationService.getMembershipsForUser(user.uid);
      const membership = memberships.find((item) => ["owner", "admin", "teacher"].includes(item.role));
      if (membership) setTeacherContext({ orgId: membership.orgId, userId: user.uid });
    });
  }, []);

  useEffect(() => {
    if (!requestedCourseId) return;
    return AuthService.onUserChanged(async (user) => {
      if (!user) return;
      try {
        const response = await authenticatedFetch("/api/learning?teacherDashboard=1");
        const payload = await response.json() as TeacherCoursePayload;
        if (!response.ok) throw new Error(payload.error ?? "Unable to load this course.");
        const selected = payload.find((item) => item.course.id === requestedCourseId);
        if (!selected) throw new Error("Course not found or unavailable to this teacher.");

        setActiveCourseId(selected.course.id);
        setTitle(selected.course.title);
        setDescription(selected.course.description);

        const grouped = selected.lessons.reduce<Record<string, Lesson[]>>((current, entry) => ({
          ...current,
          [entry.lesson.moduleId]: [...(current[entry.lesson.moduleId] ?? []), entry.lesson],
        }), {});
        setLessonsByModule(grouped);

        const moduleNames = new Map(selected.lessons.map((entry) => [entry.lesson.moduleId, entry.moduleTitle]));
        setModules([...moduleNames.entries()].map(([id, moduleTitle]) => ({ id, title: moduleTitle })));

        if (requestedLessonId) {
          const requested = selected.lessons.find((entry) => entry.lesson.id === requestedLessonId)?.lesson;
          if (!requested) throw new Error("Lesson not found in this course.");
          openLessonEditor({ id: requested.moduleId, title: moduleNames.get(requested.moduleId) ?? "Module" }, requested);
        }
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : "Unable to load this course.");
      }
    });
  }, [requestedCourseId, requestedLessonId]);

  function openLessonEditor(module: ModuleSummary, lesson?: Lesson) {
    setActiveModule(module);
    setEditingLesson(lesson ?? null);
    setLessonTitle(lesson?.title ?? "");
    setLessonContent(String(lesson?.contentBlocks.find((block) => block.type === "text")?.data.text ?? ""));
    setActivityDrafts(lesson ? readActivityDrafts(lesson) : []);
    setCapabilityDrafts(lesson ? readLearningCapabilityDrafts(lesson) : []);
  }

  function closeLessonEditor() {
    setActiveModule(null);
    setEditingLesson(null);
    setLessonTitle("");
    setLessonContent("");
    setActivityDrafts([]);
    setCapabilityDrafts([]);
  }

  async function handleCreateCourse(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (!teacherContext) throw new Error("A teacher organization is required.");
      const course = await saveCourseChange<Course>({ action: "createCourse", title, description, subject: "english" });
      setActiveCourseId(course.id);
      alert("Course draft created successfully!");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to create course.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveLesson(event: React.FormEvent) {
    event.preventDefault();
    if (!activeModule || !lessonTitle.trim() || !lessonContent.trim()) return;
    setIsSavingLesson(true);
    try {
      const textBlock: ContentBlock = {
        id: editingLesson?.contentBlocks.find((block) => block.type === "text")?.id ?? crypto.randomUUID(),
        type: "text",
        data: { text: lessonContent.trim() },
        order: 1,
      };
      const contentBlocks = [textBlock, ...buildActivityBlocks(activityDrafts), ...buildLearningCapabilityBlocks(capabilityDrafts)]
        .sort((first, second) => first.order - second.order);
      const estimatedMinutes = Math.max(5, Math.round(
        3
        + activityDrafts.reduce((sum, item) => sum + item.estimatedMinutes, 0)
        + capabilityDrafts.reduce((sum, item) => sum + item.estimatedMinutes, 0),
      ));

      const lesson = editingLesson
        ? await saveCourseChange<Lesson>({ action: "updateLesson", lessonId: editingLesson.id, title: lessonTitle.trim(), contentBlocks })
        : await saveCourseChange<Lesson>({
            action: "saveLesson",
            moduleId: activeModule.id,
            title: lessonTitle.trim(),
            contentBlocks,
            order: (lessonsByModule[activeModule.id]?.length ?? 0) + 1,
            estimatedMinutes,
          });

      setLessonsByModule((current) => ({
        ...current,
        [activeModule.id]: editingLesson
          ? (current[activeModule.id] ?? []).map((item) => item.id === lesson.id ? lesson : item)
          : [...(current[activeModule.id] ?? []), lesson],
      }));
      closeLessonEditor();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to save lesson.");
    } finally {
      setIsSavingLesson(false);
    }
  }

  async function handleDeleteLesson(moduleId: string, lesson: Lesson) {
    if (!window.confirm(`Delete the lesson “${lesson.title}”?`)) return;
    try {
      await saveCourseChange<{ ok: true }>({ action: "deleteLesson", lessonId: lesson.id });
      setLessonsByModule((current) => ({
        ...current,
        [moduleId]: (current[moduleId] ?? []).filter((item) => item.id !== lesson.id),
      }));
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to delete lesson.");
    }
  }

  async function handlePublish() {
    if (!activeCourseId) return;
    setIsPublishing(true);
    try {
      await saveCourseChange<{ ok: true }>({ action: "publishCourse", courseId: activeCourseId });
      alert("Course published. Students in your organization can now access it.");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to publish course.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleAddModule() {
    if (!activeCourseId || !newModuleTitle.trim()) return;
    try {
      const createdModule = await saveCourseChange<Module>({
        action: "addModule",
        courseId: activeCourseId,
        title: newModuleTitle.trim(),
        order: modules.length + 1,
      });
      setModules((current) => [...current, { id: createdModule.id, title: createdModule.title }]);
      setNewModuleTitle("");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to add module.");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-[#dfe7fb] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#071d67]">Course Builder</h1>
            <p className="text-[#6677a5]">Design modules, lessons, evidence, and AI-assisted learning experiences.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={activeCourseId ? "success" : "warning"}>{activeCourseId ? "Draft Created" : "Unsaved"}</Badge>
            {activeCourseId ? <Button variant="primary" onClick={handlePublish} isLoading={isPublishing}>Publish Course</Button> : null}
            <Button variant="secondary" onClick={() => router.push("/teacher/courses")}>Return to courses</Button>
          </div>
        </div>

        <Card title="1. Course Overview" subtitle="General course configuration">
          <form onSubmit={handleCreateCourse} className="space-y-4 pt-2">
            <Input label="Course Title" placeholder="e.g. English B1 — Conversational Basics" value={title} onChange={(event) => setTitle(event.target.value)} disabled={Boolean(activeCourseId)} required />
            <Input label="Description" placeholder="Summary of learning goals..." value={description} onChange={(event) => setDescription(event.target.value)} disabled={Boolean(activeCourseId)} required />
            {!activeCourseId ? <Button type="submit" variant="primary" isLoading={loading}>Create Course Shell</Button> : null}
          </form>
        </Card>

        {activeCourseId ? (
          <Card title="2. Course Modules" subtitle="Organize lessons into sequential modules">
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <Input placeholder="Module title" value={newModuleTitle} onChange={(event) => setNewModuleTitle(event.target.value)} />
                <Button variant="secondary" onClick={handleAddModule}>+ Add Module</Button>
              </div>

              <div className="space-y-3 pt-4">
                {modules.map((module, index) => (
                  <section key={module.id} className="rounded-xl border border-[#dfe7fb] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#592bd6]">Module {index + 1}</span>
                        <h2 className="font-semibold text-[#071d67]">{module.title}</h2>
                        <p className="text-xs text-[#6677a5]">{lessonsByModule[module.id]?.length ?? 0} lesson(s)</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => openLessonEditor(module)}>+ Add Lesson</Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(lessonsByModule[module.id] ?? []).map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between border-t border-[#edf1fb] pt-3 text-sm">
                          <span>{lesson.title}</span>
                          <span className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openLessonEditor(module, lesson)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => void handleDeleteLesson(module.id, lesson)}>Delete</Button>
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </Card>
        ) : null}
      </div>

      <Modal
        isOpen={activeModule !== null}
        onClose={closeLessonEditor}
        title={activeModule ? `${editingLesson ? "Edit" : "Add"} lesson ${editingLesson ? "in" : "to"} ${activeModule.title}` : "Add lesson"}
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <Input label="Lesson title" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} required />
          <label className="block text-sm font-medium text-[#314b88]">
            Lesson content
            <textarea className="mt-1 w-full rounded-xl border border-[#d7e0f6] p-3 text-[#071d67]" value={lessonContent} onChange={(event) => setLessonContent(event.target.value)} rows={8} required />
          </label>

          <LearningActivityEditor drafts={activityDrafts} onChange={setActivityDrafts} />
          <LearningCapabilityEditor drafts={capabilityDrafts} onChange={setCapabilityDrafts} />

          <div className="rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-indigo-900">
            Lesson content is validated again on the trusted server boundary. Advanced capabilities cannot supply provider models, API credentials, arbitrary system prompts, or storage configuration.
          </div>
          <Button type="submit" className="w-full" isLoading={isSavingLesson}>{editingLesson ? "Save changes" : "Save lesson"}</Button>
        </form>
      </Modal>
    </div>
  );
}

export default function CourseBuilderPage() {
  return (
    <Suspense fallback={<div role="status" className="min-h-screen bg-[var(--learn-canvas)] p-8 text-sm text-slate-600">Loading course builder…</div>}>
      <CourseBuilderContent />
    </Suspense>
  );
}

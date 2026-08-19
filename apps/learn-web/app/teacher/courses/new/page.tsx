"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, OrganizationService } from "@lurexa/backend";
import { ContentBlock, Course, LearningActivity, LearningActivityType, Lesson, LessonStage, Module } from "@lurexa/types";
import { authenticatedFetch } from "../../../../lib/authenticated-fetch";

async function saveCourseChange<T>(body: Record<string, unknown>): Promise<T> {
  const response = await authenticatedFetch("/api/learning", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const payload = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "Unable to save course changes.");
  return payload;
}

type ActivityDraft = { id: string; type: LearningActivityType; stage: LessonStage; title: string; instructions: string; prompt: string; options: string; correctAnswers: string; explanation: string; competencyIds: string; estimatedMinutes: number };
const defaultActivity = (): ActivityDraft => ({ id: crypto.randomUUID(), type: "single_choice", stage: "GUIDED_PRACTICE", title: "Quick check", instructions: "Choose the best answer.", prompt: "", options: "", correctAnswers: "", explanation: "", competencyIds: "", estimatedMinutes: 2 });

function readActivityBlocks(lesson: Lesson): ActivityDraft[] {
  return lesson.contentBlocks.filter((block) => block.type === "interactive").flatMap((block) => {
    const activity = block.data.activity;
    if (typeof activity !== "object" || activity === null || Array.isArray(activity)) return [];
    const value = activity as Record<string, unknown>;
    if (!["single_choice", "multiple_selection", "sentence_builder"].includes(value.type as string) || typeof value.title !== "string" || typeof value.instructions !== "string" || typeof value.prompt !== "string" || !Array.isArray(value.options) || !value.options.every((option) => typeof option === "string") || !Array.isArray(value.correctAnswers) || !value.correctAnswers.every((answer) => typeof answer === "string")) return [];
    return [{ id: block.id, type: value.type as LearningActivityType, stage: typeof value.stage === "string" ? value.stage as LessonStage : "GUIDED_PRACTICE", title: value.title, instructions: value.instructions, prompt: value.prompt, options: value.options.join("\n"), correctAnswers: value.correctAnswers.join("\n"), explanation: typeof value.explanation === "string" ? value.explanation : "", competencyIds: Array.isArray(value.competencyIds) ? value.competencyIds.filter((id): id is string => typeof id === "string").join(", ") : "", estimatedMinutes: typeof value.estimatedMinutes === "number" ? value.estimatedMinutes : 2 }];
  });
}

export default function CourseBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCourseId = searchParams.get("courseId");
  const requestedLessonId = searchParams.get("lessonId");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const subject = "english" as const;
  const [modules, setModules] = useState<Array<{ id: string; title: string }>>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teacherContext, setTeacherContext] = useState<{ orgId: string; userId: string } | null>(null);
  const [activeModule, setActiveModule] = useState<{ id: string; title: string } | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [activityDrafts, setActivityDrafts] = useState<ActivityDraft[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) return;

      const memberships = await OrganizationService.getMembershipsForUser(user.uid);
      const membership = memberships.find((item) =>
        ["owner", "admin", "teacher"].includes(item.role),
      );
      if (membership) setTeacherContext({ orgId: membership.orgId, userId: user.uid });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!requestedCourseId) return;
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) return;
      try {
        const response = await authenticatedFetch("/api/learning?teacherDashboard=1");
        const payload = await response.json() as Array<{ course: Course; lessons: Array<{ moduleTitle: string; lesson: Lesson }> }> & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load this course.");
        const selected = payload.find((item) => item.course.id === requestedCourseId);
        if (!selected) throw new Error("Course not found or unavailable to this teacher.");
        setActiveCourseId(selected.course.id);
        setTitle(selected.course.title);
        setDescription(selected.course.description);
        const groupedLessons = selected.lessons.reduce<Record<string, Lesson[]>>((current, entry) => ({ ...current, [entry.lesson.moduleId]: [...(current[entry.lesson.moduleId] ?? []), entry.lesson] }), {});
        setLessonsByModule(groupedLessons);
        const moduleNames = new Map(selected.lessons.map((entry) => [entry.lesson.moduleId, entry.moduleTitle]));
        setModules([...moduleNames.entries()].map(([id, moduleTitle]) => ({ id, title: moduleTitle })));
        if (requestedLessonId) {
          const requested = selected.lessons.find((entry) => entry.lesson.id === requestedLessonId)?.lesson;
          if (!requested) throw new Error("Lesson not found in this course.");
          const moduleTitle = moduleNames.get(requested.moduleId) ?? "Module";
          setEditingLesson(requested);
          setLessonTitle(requested.title);
          setLessonContent(String(requested.contentBlocks.find((block) => block.type === "text")?.data.text ?? ""));
          setActivityDrafts(readActivityBlocks(requested));
          setActiveModule({ id: requested.moduleId, title: moduleTitle });
        }
      } catch (error: unknown) { alert(error instanceof Error ? error.message : "Unable to load this course."); }
    });
    return unsubscribe;
  }, [requestedCourseId, requestedLessonId]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!teacherContext) throw new Error("A teacher organization is required.");
      const course = await saveCourseChange<Course>({ action: "createCourse", title, description, subject });
      setActiveCourseId(course.id);
      alert("Course draft created successfully!");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLesson = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeModule || !lessonTitle.trim() || !lessonContent.trim()) return;

    setIsSavingLesson(true);
    try {
      const contentBlocks: ContentBlock[] = [{
          id: crypto.randomUUID(),
          type: "text",
          data: { text: lessonContent.trim() },
          order: 1,
        }];
      for (const [index, draft] of activityDrafts.entries()) {
        const options = draft.options.split("\n").map((option) => option.trim()).filter(Boolean);
        const correctAnswers = draft.correctAnswers.split("\n").map((answer) => answer.trim()).filter(Boolean);
        if (!draft.title.trim() || !draft.instructions.trim() || !draft.prompt.trim() || options.length < 2 || !correctAnswers.length || correctAnswers.some((answer) => !options.includes(answer))) throw new Error(`Activity ${index + 1} needs a title, instructions, prompt, at least two options, and correct answers from the option list.`);
        if (draft.type === "single_choice" && correctAnswers.length !== 1) throw new Error(`Activity ${index + 1} is single choice, so it needs exactly one correct answer.`);
        const activity: LearningActivity = { schemaVersion: "1", type: draft.type, stage: draft.stage, title: draft.title.trim(), instructions: draft.instructions.trim(), prompt: draft.prompt.trim(), options, correctAnswers, competencyIds: draft.competencyIds.split(",").map((id) => id.trim()).filter(Boolean), estimatedMinutes: Math.max(1, Math.round(draft.estimatedMinutes)), required: true, ...(draft.explanation.trim() ? { explanation: draft.explanation.trim() } : {}) };
        contentBlocks.push({ id: draft.id, type: "interactive", data: { activity }, order: index + 2 });
      }
      const lesson = editingLesson
        ? await saveCourseChange<Lesson>({ action: "updateLesson", lessonId: editingLesson.id, title: lessonTitle.trim(), contentBlocks })
        : await saveCourseChange<Lesson>({ action: "saveLesson", moduleId: activeModule.id, title: lessonTitle.trim(), contentBlocks, order: (lessonsByModule[activeModule.id]?.length ?? 0) + 1, estimatedMinutes: 10 });
      setLessonsByModule((current) => ({
        ...current,
        [activeModule.id]: editingLesson
          ? (current[activeModule.id] ?? []).map((currentLesson) => currentLesson.id === lesson.id ? lesson : currentLesson)
          : [...(current[activeModule.id] ?? []), lesson],
      }));
      setLessonTitle("");
      setLessonContent("");
      setActivityDrafts([]);
      setActiveModule(null);
      setEditingLesson(null);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to save lesson.");
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lesson: Lesson) => {
    if (!window.confirm(`Delete the lesson “${lesson.title}”?`)) return;
    try {
      await saveCourseChange<{ ok: true }>({ action: "deleteLesson", lessonId: lesson.id });
      setLessonsByModule((current) => ({ ...current, [moduleId]: (current[moduleId] ?? []).filter((item) => item.id !== lesson.id) }));
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to delete lesson.");
    }
  };

  const handlePublish = async () => {
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
  };

  const handleAddModule = async () => {
    if (!activeCourseId || !newModuleTitle) return;

    try {
      const mod = await saveCourseChange<Module>({ action: "addModule", courseId: activeCourseId, title: newModuleTitle, order: modules.length + 1 });
      setModules([...modules, { id: mod.id, title: mod.title }]);
      setNewModuleTitle("");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to add module.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Course Builder</h1>
            <p className="text-slate-500">Design modules, lessons, and AI-assisted content</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={activeCourseId ? "success" : "warning"}>
              {activeCourseId ? "Draft Created" : "Unsaved"}
            </Badge>
            {activeCourseId && (
              <Button variant="primary" onClick={handlePublish} isLoading={isPublishing}>
                Publish Course
              </Button>
            )}
            <Button variant="secondary" onClick={() => router.push("/teacher/courses")}>
              Return to courses
            </Button>
          </div>
        </div>

        {/* Step 1: Course Info */}
        <Card title="1. Course Overview" subtitle="General course configuration">
          <form onSubmit={handleCreateCourse} className="space-y-4 pt-2">
            <Input
              label="Course Title"
              placeholder="e.g. English B1 — Conversational Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!!activeCourseId}
              required
            />
            <Input
              label="Description"
              placeholder="Summary of learning goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!!activeCourseId}
              required
            />
            {!activeCourseId && (
              <Button type="submit" variant="primary" isLoading={loading}>
                Create Course Shell
              </Button>
            )}
          </form>
        </Card>

        {/* Step 2: Modules & Lessons */}
        {activeCourseId && (
          <Card title="2. Course Modules" subtitle="Organize lessons into sequential modules">
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <Input
                  placeholder="Module Title (e.g. Unit 1: Present Tense)"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                />
                <Button variant="secondary" onClick={handleAddModule}>
                  + Add Module
                </Button>
              </div>

              <div className="space-y-2 pt-4">
                {modules.map((mod, index) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 bg-white"
                  >
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                        Module {index + 1}
                      </span>
                      <h4 className="font-semibold text-slate-900">{mod.title}</h4>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingLesson(null); setLessonTitle(""); setLessonContent(""); setActivityDrafts([]); setActiveModule(mod); }}>
                      + Add Lesson
                    </Button>
                    <p className="text-xs text-slate-500">
                      {lessonsByModule[mod.id]?.length ?? 0} lesson(s)
                    </p>
                    {(lessonsByModule[mod.id] ?? []).map((lesson) => (
                      <div key={lesson.id} className="flex w-full items-center justify-between border-t border-slate-100 pt-3 text-sm">
                        <span>{lesson.title}</span>
                        <span className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => { setEditingLesson(lesson); setLessonTitle(lesson.title); setLessonContent(String(lesson.contentBlocks.find((block) => block.type === "text")?.data.text ?? "")); setActivityDrafts(readActivityBlocks(lesson)); setActiveModule(mod); }}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDeleteLesson(mod.id, lesson)}>Delete</Button></span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={activeModule !== null}
        onClose={() => { setActiveModule(null); setEditingLesson(null); }}
        title={activeModule ? `${editingLesson ? "Edit" : "Add"} lesson ${editingLesson ? "in" : "to"} ${activeModule.title}` : "Add lesson"}
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <Input
            label="Lesson title"
            value={lessonTitle}
            onChange={(event) => setLessonTitle(event.target.value)}
            required
          />
          <label className="block text-sm font-medium text-slate-700">
            Lesson content
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-slate-900"
              value={lessonContent}
              onChange={(event) => setLessonContent(event.target.value)}
              rows={8}
              required
            />
          </label>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">Learning activities</p><p className="text-xs text-slate-600">Add stages from the Lurexa cycle. Students receive immediate feedback and retries.</p></div><Button type="button" size="sm" variant="secondary" onClick={() => setActivityDrafts((current) => [...current, defaultActivity()])}>+ Add activity</Button></div>
            {activityDrafts.map((draft, index) => <div key={draft.id} className="space-y-3 rounded-lg border border-slate-200 bg-white p-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Activity {index + 1}</p><Button type="button" size="sm" variant="destructive" onClick={() => setActivityDrafts((current) => current.filter((activity) => activity.id !== draft.id))}>Remove</Button></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Activity type<select className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900" value={draft.type} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, type: event.target.value as LearningActivityType } : activity))}><option value="single_choice">Single-choice question</option><option value="multiple_selection">Multiple selection</option><option value="sentence_builder">Sentence builder</option></select></label><label className="text-sm font-medium text-slate-700">Lesson stage<select className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900" value={draft.stage} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, stage: event.target.value as LessonStage } : activity))}>{["HOOK", "VOCABULARY_BUILDER", "COMPREHENSION", "GRAMMAR_FOCUS", "PHONETICS_FOCUS", "GUIDED_PRACTICE", "CONVERSATION", "CREATE_APPLY", "REVIEW", "QUIZ", "REFLECTION"].map((stage) => <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>)}</select></label></div><Input label="Activity title" value={draft.title} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, title: event.target.value } : activity))} /><Input label="Student instructions" value={draft.instructions} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, instructions: event.target.value } : activity))} /><Input label="Prompt" value={draft.prompt} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, prompt: event.target.value } : activity))} /><label className="block text-sm font-medium text-slate-700">Options, one per line<textarea className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-slate-900" value={draft.options} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, options: event.target.value } : activity))} rows={4} /></label><label className="block text-sm font-medium text-slate-700">Correct answer{draft.type === "multiple_selection" ? "s, one per line" : ""}<textarea className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-slate-900" value={draft.correctAnswers} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, correctAnswers: event.target.value } : activity))} rows={draft.type === "multiple_selection" ? 3 : 1} /></label><Input label="Feedback explanation" value={draft.explanation} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, explanation: event.target.value } : activity))} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Input label="Competency IDs (comma separated)" value={draft.competencyIds} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, competencyIds: event.target.value } : activity))} placeholder="A1.SPK.INTRO.01" /><Input label="Estimated minutes" type="number" min="1" value={String(draft.estimatedMinutes)} onChange={(event) => setActivityDrafts((current) => current.map((activity) => activity.id === draft.id ? { ...activity, estimatedMinutes: Number(event.target.value) || 1 } : activity))} /></div></div>)}
          </div>
          <Button type="submit" className="w-full" isLoading={isSavingLesson}>
            {editingLesson ? "Save changes" : "Save lesson"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Modal } from "@lurexa/ui/Modal";
import { AuthService, CourseBuilderService, OrganizationService } from "@lurexa/backend";
import { Lesson } from "@lurexa/types";

export default function CourseBuilderPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const subject = "english" as const;
  const [modules, setModules] = useState<Array<{ id: string; title: string }>>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teacherContext, setTeacherContext] = useState<{ orgId: string; userId: string } | null>(null);
  const [activeModule, setActiveModule] = useState<{ id: string; title: string } | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
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

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!teacherContext) throw new Error("A teacher organization is required.");
      const course = await CourseBuilderService.createCourse(
        teacherContext.orgId,
        teacherContext.userId,
        title,
        description,
        subject
      );
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
      const lesson = await CourseBuilderService.saveLesson(
        activeModule.id,
        null,
        lessonTitle.trim(),
        [{
          id: crypto.randomUUID(),
          type: "text",
          data: { text: lessonContent.trim() },
          order: 1,
        }],
        (lessonsByModule[activeModule.id]?.length ?? 0) + 1,
        10,
      );
      setLessonsByModule((current) => ({
        ...current,
        [activeModule.id]: [...(current[activeModule.id] ?? []), lesson],
      }));
      setLessonTitle("");
      setLessonContent("");
      setActiveModule(null);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to save lesson.");
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handlePublish = async () => {
    if (!activeCourseId) return;
    setIsPublishing(true);
    try {
      await CourseBuilderService.publishCourse(activeCourseId);
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
      const mod = await CourseBuilderService.addModule(
        activeCourseId,
        newModuleTitle,
        modules.length + 1
      );
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
          <Badge variant={activeCourseId ? "success" : "warning"}>
            {activeCourseId ? "Draft Created" : "Unsaved"}
          </Badge>
          {activeCourseId && (
            <Button variant="primary" onClick={handlePublish} isLoading={isPublishing}>
              Publish Course
            </Button>
          )}
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
                    <Button variant="ghost" size="sm" onClick={() => setActiveModule(mod)}>
                      + Add Lesson
                    </Button>
                    <p className="text-xs text-slate-500">
                      {lessonsByModule[mod.id]?.length ?? 0} lesson(s)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={activeModule !== null}
        onClose={() => setActiveModule(null)}
        title={activeModule ? `Add lesson to ${activeModule.title}` : "Add lesson"}
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
          <Button type="submit" className="w-full" isLoading={isSavingLesson}>
            Save Lesson
          </Button>
        </form>
      </Modal>
    </div>
  );
}

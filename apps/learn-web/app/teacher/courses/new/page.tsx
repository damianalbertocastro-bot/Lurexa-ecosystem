"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { CourseBuilderService } from "@lurexa/backend";
import { ContentBlock } from "@lurexa/types";

export default function CourseBuilderPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState<"english" | "math" | "science" | "other">("english");
  const [modules, setModules] = useState<Array<{ id: string; title: string }>>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo org/author IDs - wired to auth context in production
      const course = await CourseBuilderService.createCourse(
        "org_demo",
        "teacher_demo",
        title,
        description,
        subject
      );
      setActiveCourseId(course.id);
      alert("Course draft created successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to create course.");
    } finally {
      setLoading(false);
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
    } catch (err: any) {
      alert(err.message || "Failed to add module.");
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
                    <Button variant="ghost" size="sm">
                      + Add Lesson
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
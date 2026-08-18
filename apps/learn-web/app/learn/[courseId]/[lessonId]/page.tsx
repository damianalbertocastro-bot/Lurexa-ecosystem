"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { AITutorWidget } from "../../components/AITutorWidget";
import { AuthService } from "@lurexa/backend";
import { Lesson, StudentProgress } from "@lurexa/types";
import { authenticatedFetch } from "../../../../lib/authenticated-fetch";

export default function CoursePlayerPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const [completed, setCompleted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => AuthService.onUserChanged(async (user) => {
    if (!user) { setError("Sign in is required."); setLoading(false); return; }
    try {
      const response = await authenticatedFetch(`/api/learning?courseId=${encodeURIComponent(params.courseId)}&lessonId=${encodeURIComponent(params.lessonId)}`);
      const payload = await response.json() as { lesson?: Lesson; progress?: StudentProgress | null; error?: string };
      if (!response.ok || !payload.lesson) throw new Error(payload.error ?? "Unable to load lesson.");
      setLesson(payload.lesson);
      setCompleted(payload.progress?.completed ?? false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load lesson."); }
    finally { setLoading(false); }
  }), [params.courseId, params.lessonId]);

  const handleMarkComplete = async () => {
    setSyncing(true);
    try {
      const response = await authenticatedFetch("/api/learning", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: params.courseId, lessonId: params.lessonId, timeSpentSeconds: 180 }),
      });
      if (!response.ok) throw new Error("Unable to save progress.");
      setCompleted(true);
    } catch {
      alert("Failed to sync progress.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Loading lesson...</div>;
  if (error || !lesson) return <div className="min-h-screen bg-slate-50 p-8 text-red-600">{error ?? "Lesson not found."}</div>;
  const text = lesson.contentBlocks.filter((block) => block.type === "text")
    .map((block) => typeof block.data.text === "string" ? block.data.text : "").filter(Boolean).join("\n\n");

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
              <p className="text-xs text-slate-500">Course ID: {params.courseId}</p>
            </div>
            <Badge variant={completed ? "success" : "info"}>
              {completed ? "Completed ✓" : "In Progress"}
            </Badge>
          </div>

          <Card className="prose max-w-none">
            <div className="whitespace-pre-line text-slate-700 leading-relaxed">
              {text || "This lesson has no readable text content yet."}
            </div>
          </Card>

          <div className="flex justify-end pt-4">
            <Button
              variant={completed ? "secondary" : "primary"}
              onClick={handleMarkComplete}
              isLoading={syncing}
            >
              {completed ? "Lesson Completed ✓" : "Mark as Complete & Next →"}
            </Button>
          </div>
        </div>

        {/* AI Tutor Sidebar (1 Col) */}
        <div className="lg:col-span-1">
          <AITutorWidget
            lessonTitle={lesson.title}
            lessonContext={text}
          />
        </div>
      </div>
    </div>
  );
}

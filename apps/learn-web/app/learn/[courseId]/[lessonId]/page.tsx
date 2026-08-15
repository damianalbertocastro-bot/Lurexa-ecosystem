"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { AITutorWidget } from "../../components/AITutorWidget";
import { ProgressService } from "@lurexa/backend";

export default function CoursePlayerPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const [completed, setCompleted] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const lessonData = {
    title: "Lesson 1: Present Simple vs. Continuous",
    content: `
      ### Key Differences
      * **Present Simple**: Used for habits, routines, and permanent states.
        * *Example*: "I teach English every weekday."
      * **Present Continuous**: Used for actions happening right now at the moment of speech.
        * *Example*: "I am writing on the board right now."
    `,
  };

  const handleMarkComplete = async () => {
    setSyncing(true);
    try {
      await ProgressService.syncProgress({
        id: `demo_${params.lessonId}`,
        studentId: "student_demo",
        lessonId: params.lessonId,
        moduleId: "mod_demo",
        courseId: params.courseId,
        completed: true,
        timeSpentSeconds: 180,
        attempts: [],
        lastAccessedAt: new Date().toISOString(),
      });
      setCompleted(true);
    } catch {
      alert("Failed to sync progress.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{lessonData.title}</h1>
              <p className="text-xs text-slate-500">Course ID: {params.courseId}</p>
            </div>
            <Badge variant={completed ? "success" : "info"}>
              {completed ? "Completed ✓" : "In Progress"}
            </Badge>
          </div>

          <Card className="prose max-w-none">
            <div className="whitespace-pre-line text-slate-700 leading-relaxed">
              {lessonData.content}
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
            lessonTitle={lessonData.title}
            lessonContext={lessonData.content}
          />
        </div>
      </div>
    </div>
  );
}

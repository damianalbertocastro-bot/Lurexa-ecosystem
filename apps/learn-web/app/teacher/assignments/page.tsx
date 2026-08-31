"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Modal } from "@lurexa/ui/Modal";
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";
import {
  AssignmentService,
  type AssignmentV1,
  type AssignmentSubmissionV1,
  type AssignmentTargetType,
} from "@lurexa/backend";
import { auth } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";
import { Input } from "@lurexa/ui/Input";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentV1[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentV1 | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmissionV1[]>([]);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmissionV1 | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [targetType, setTargetType] = useState<AssignmentTargetType>("speaking_task");
  const [targetLevel, setTargetLevel] = useState<CefrLevel>("A1");
  const [dueDate, setDueDate] = useState("");
  const [creating, setCreating] = useState(false);

  // Grading Form State
  const [gradeScore, setGradeScore] = useState<number>(9);
  const [gradeFeedback, setGradeFeedback] = useState("");
  const [grading, setGrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    void AssignmentService.listAssignmentsForClass("ALL").then((list) => {
      if (!ignore) {
        setAssignments(list);
        setLoading(false);
      }
    }).catch((err) => {
      if (!ignore) {
        console.error(err);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    const actor = user ? { uid: user.uid, id: user.uid, email: user.email || "" } : { uid: "teacher-carolina", id: "teacher-carolina", email: "carolina@dominicanschool.edu" };

    setCreating(true);
    setErrorMessage(null);
    try {
      await AssignmentService.createAssignment(actor as never, {
        organizationId: "org-demo",
        courseId: "english-a1-foundations",
        classId: "class-dominican-morning-101",
        teacherId: actor.uid || actor.id,
        title,
        description,
        instructions,
        targetType,
        targetRef: "a1-speaking-intro",
        targetLevel,
        status: "published",
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
        rubric: [
          {
            id: "r1-intelligibility",
            name: "Intelligibility & Syllable Codas",
            description: "Clear consonant codas and audible cluster beginnings.",
            maxScore: 10,
            weight: 0.6,
          },
          {
            id: "r2-fluency",
            name: "Natural Pace & Flow",
            description: "Fluent speech rhythm without excessive hesitation.",
            maxScore: 10,
            weight: 0.4,
          },
        ],
      });
      setIsCreateModalOpen(false);
      setTitle("");
      setDescription("");
      setInstructions("");
      const updated = await AssignmentService.listAssignmentsForClass("ALL");
      setAssignments(updated);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create assignment.");
    } finally {
      setCreating(false);
    }
  };

  const handleOpenSubmissions = async (assignment: AssignmentV1) => {
    setSelectedAssignment(assignment);
    const list = await AssignmentService.listSubmissionsForAssignment(assignment.id);
    setSubmissions(list);
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    const user = auth.currentUser;
    const actor = user ? { uid: user.uid, id: user.uid, email: user.email || "" } : { uid: "teacher-demo", id: "teacher-demo", email: "teacher@school.edu" };

    setGrading(true);
    setErrorMessage(null);
    try {
      await AssignmentService.gradeSubmission(actor as never, gradingSubmission.id, {
        score: gradeScore,
        maxScore: 10,
        feedback: gradeFeedback,
      });
      setGradingSubmission(null);
      if (selectedAssignment) {
        const list = await AssignmentService.listSubmissionsForAssignment(selectedAssignment.id);
        setSubmissions(list);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to grade submission.");
    } finally {
      setGrading(false);
    }
  };

  return (
    <>
      <TeacherWorkspaceBanner
        title="Class Assignments & Spoken Homework"
        subtitle="Distribute targeted speaking tasks, lesson activities, and Coach practice packs with AI Mind grading assistance."
        actions={
          <>
            <Link href="/teacher/dashboard" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20">
              ← Workspace Overview
            </Link>
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              + Create Assignment
            </Button>
          </>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {errorMessage && (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800">
            {errorMessage}
          </div>
        )}
        {/* Assignment Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Active Assignments" subtitle="Currently open for submission">
            <span className="text-3xl font-black text-indigo-600">
              {assignments.filter((a) => a.status === "published").length}
            </span>
          </Card>

          <Card title="Target Dialect Focus" subtitle="L1 Spanish Transfer Awareness">
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="info">Dominican (es-DO)</Badge>
              <Badge variant="success">A1–C2</Badge>
            </div>
          </Card>

          <Card title="Mind AI Assistance" subtitle="Automated phonological scoring">
            <span className="text-sm font-bold text-emerald-600">
              ✨ Real-time Rubric Evaluation Active
            </span>
          </Card>
        </div>

        {/* Assignments List */}
        <Card title="Published Assignments" subtitle="Tasks assigned to your classes">
          {loading ? (
            <p className="py-6 text-sm text-[var(--lx-muted)] text-center">Loading class assignments…</p>
          ) : assignments.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[var(--lx-muted)] mb-3">No assignments created yet.</p>
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                Create First Assignment
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--lx-ink)] text-base">{assignment.title}</span>
                      <Badge variant="info">{assignment.targetLevel}</Badge>
                      <Badge variant="success">{assignment.targetType.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-xs text-[var(--lx-muted)] mt-1 max-w-2xl">{assignment.description}</p>
                    <p className="text-[11px] text-[var(--lx-muted)] mt-1">
                      Due: <strong>{new Date(assignment.dueDate).toLocaleDateString()}</strong> · Class: {assignment.classId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleOpenSubmissions(assignment)}
                    >
                      View Submissions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Submissions Section for Selected Assignment */}
        {selectedAssignment && (
          <section className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">STUDENT SUBMISSIONS</p>
                <h3 className="text-lg font-bold text-[var(--lx-ink)]">{selectedAssignment.title}</h3>
              </div>
              <Button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="text-xs font-bold text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              >
                Close ✕
              </Button>
            </div>

            {submissions.length === 0 ? (
              <p className="text-xs text-[var(--lx-muted)] py-4">No student submissions received yet for this task.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div key={sub.id} className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--lx-ink)]">{sub.studentName}</span>
                        <Badge variant={sub.status === "graded" ? "success" : "warning"}>
                          {sub.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--lx-muted)] mt-1 italic">&ldquo;{sub.payload.textResponse}&rdquo;</p>

                      {sub.mindEvaluation && (
                        <div className="mt-2 rounded-xl bg-teal-50 border border-teal-200 p-2 text-xs text-teal-900">
                          <p className="font-bold">✨ Mind AI Evaluation (Score: {sub.mindEvaluation.suggestedOverallScore}/100):</p>
                          <ul className="mt-0.5 list-disc list-inside text-[11px] text-teal-800">
                            {sub.mindEvaluation.articulatoryFeedback.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sub.teacherGrade && (
                        <div className="mt-2 text-xs text-indigo-900 font-semibold">
                          Teacher Grade: <strong>{sub.teacherGrade.score}/{sub.teacherGrade.maxScore}</strong> · &ldquo;{sub.teacherGrade.feedback}&rdquo;
                        </div>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setGradingSubmission(sub);
                        setGradeScore(sub.mindEvaluation ? Math.round(sub.mindEvaluation.suggestedOverallScore / 10) : 9);
                        setGradeFeedback(sub.mindEvaluation?.articulatoryFeedback.join(" ") || "Great work!");
                      }}
                    >
                      {sub.status === "graded" ? "Edit Grade" : "Review & Grade"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Class Assignment"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Assignment Title</label>
            <Input
              type="text"
              required
              placeholder="e.g. Module 2 Speaking Defense"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Description &amp; Objective</label>
            <textarea
              required
              rows={2}
              placeholder="Explain the purpose of the assignment…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Student Instructions</label>
            <textarea
              required
              rows={2}
              placeholder="Instructions for the student when completing the task…"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Task Type</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as AssignmentTargetType)}
                className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none"
              >
                <option value="speaking_task">🎙️ Speaking Task</option>
                <option value="lesson_stage">📖 Lesson Activity</option>
                <option value="coach_pack">🎧 Coach Practice Pack</option>
                <option value="custom_prompt">✍️ Custom Prompt</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Target CEFR Level</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as CefrLevel)}
                className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none"
              >
                <option value="A1">A1 - Foundations</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Threshold</option>
                <option value="B2">B2 - Vantage</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Mastery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={creating}>
            Publish Assignment to Class
          </Button>
        </form>
      </Modal>

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <Modal
          isOpen={Boolean(gradingSubmission)}
          onClose={() => setGradingSubmission(null)}
          title={`Grade: ${gradingSubmission.studentName}`}
        >
          <form onSubmit={handleGradeSubmission} className="space-y-4">
            <div className="rounded-xl bg-[var(--lx-canvas)] p-3 text-xs text-[var(--lx-muted)]">
              <p className="font-bold mb-1">Student Response:</p>
              <p className="italic">&ldquo;{gradingSubmission.payload.textResponse}&rdquo;</p>
            </div>

            {gradingSubmission.mindEvaluation && (
              <div className="rounded-xl bg-teal-50 border border-teal-200 p-3 text-xs text-teal-900">
                <p className="font-bold">✨ Mind AI Score Suggestion: {gradingSubmission.mindEvaluation.suggestedOverallScore}%</p>
                <p className="mt-1">{gradingSubmission.mindEvaluation.articulatoryFeedback.join(" ")}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Teacher Score (out of 10)</label>
              <Input
                type="number"
                min={1}
                max={10}
                required
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--lx-muted)] mb-1">Educator Feedback &amp; Recommendations</label>
              <textarea
                rows={3}
                required
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                placeholder="Write actionable feedback for the student…"
                className="w-full rounded-xl border border-[var(--lx-border)] p-2.5 text-xs outline-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={grading}>
              Submit Verified Grade
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Modal } from "@lurexa/ui/Modal";
import {
  AssignmentService,
  type AssignmentV1,
  type AssignmentSubmissionV1,
} from "@lurexa/backend";
import { auth } from "@lurexa/backend";
import { getEcosystemUrl } from "@lurexa/config/domains";

export default function StudentAssignmentsPage() {
  const [items, setItems] = useState<Array<{ assignment: AssignmentV1; submission?: AssignmentSubmissionV1 }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [submittingItem, setSubmittingItem] = useState<AssignmentV1 | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const user = auth.currentUser;
    const studentId = user ? user.uid : "student-juan-perez";
    void AssignmentService.listStudentAssignments("org-demo", studentId).then((list) => {
      if (!ignore) {
        setItems(list);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingItem || !responseText.trim()) return;
    const user = auth.currentUser;
    const actor = user ? { uid: user.uid, id: user.uid, email: user.email || "" } : { uid: "student-juan-perez", id: "student-juan-perez", email: "juan@school.edu" };

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await AssignmentService.submitAssignment(actor as never, {
        assignmentId: submittingItem.id,
        studentName: user?.displayName || "Juan Pérez",
        payload: {
          textResponse: responseText,
        },
      });
      setSubmittingItem(null);
      setResponseText("");
      const studentId = user ? user.uid : "student-juan-perez";
      const updated = await AssignmentService.listStudentAssignments("org-demo", studentId);
      setItems(updated);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  const pendingItems = items.filter((item) => !item.submission || item.submission.status === "pending");
  const completedItems = items.filter((item) => item.submission && item.submission.status !== "pending");

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] pb-16">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          {errorMessage && (
            <div role="alert" className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="text-xs font-bold text-indigo-600 hover:underline">
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Your Assignments &amp; Homework</h1>
              <p className="mt-1 text-sm text-slate-500">
                Tasks assigned by your teacher. Complete spoken defenses, lessons, or Coach practice packs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === "pending"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                Due Soon ({pendingItems.length})
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab("completed")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === "completed"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                Completed &amp; Graded ({completedItems.length})
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 space-y-6">
        {loading ? (
          <p className="py-12 text-center text-sm font-bold text-slate-400">Loading assignments…</p>
        ) : activeTab === "pending" ? (
          pendingItems.length === 0 ? (
            <Card title="All caught up! 🎉" subtitle="You have no pending assignments right now.">
              <p className="text-xs text-slate-500 mt-2">Check back when your teacher schedules your next task.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingItems.map(({ assignment }) => (
                <div
                  key={assignment.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{assignment.title}</h2>
                      <Badge variant="info">{assignment.targetLevel}</Badge>
                      <Badge variant="success">{assignment.targetType.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">{assignment.description}</p>
                    <p className="text-[11px] text-amber-700 font-bold mt-2">
                      ⏰ Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {assignment.targetType === "coach_pack" ? (
                      <a
                        href={`${getEcosystemUrl("coach")}/studio`}
                        className="rounded-xl bg-gradient-to-r from-[var(--lx-accent)] to-[var(--lx-accent)] px-4 py-2.5 text-xs font-black text-[var(--color-brand-navy)] shadow-sm hover:opacity-90 transition active:scale-95"
                      >
                        Launch Coach Studio 🎙️
                      </a>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => setSubmittingItem(assignment)}
                      >
                        Submit Response
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          completedItems.length === 0 ? (
            <Card title="No completed assignments yet" subtitle="Assignments you complete and submit will appear here.">
              <p className="text-xs text-slate-500 mt-2">Submit your pending tasks to receive teacher and AI Mind feedback.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedItems.map(({ assignment, submission }) => (
                <div
                  key={assignment.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{assignment.title}</h2>
                      <p className="text-xs text-slate-500">Submitted {new Date(submission!.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={submission?.status === "graded" ? "success" : "info"}>
                      {submission?.status === "graded" ? "✓ Graded by Teacher" : "Evaluated by Mind AI"}
                    </Badge>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
                    <p className="font-bold text-slate-500 mb-1">Your Submission:</p>
                    <p className="italic">&ldquo;{submission?.payload.textResponse}&rdquo;</p>
                  </div>

                  {/* Mind AI Feedback */}
                  {submission?.mindEvaluation && (
                    <div className="rounded-2xl bg-teal-50 border border-teal-200 p-4 text-xs text-teal-900">
                      <div className="flex items-center justify-between">
                        <p className="font-bold">✨ Mind AI Phonological Accuracy:</p>
                        <span className="font-mono font-bold text-teal-700 text-sm">{submission.mindEvaluation.phonologicalScore}%</span>
                      </div>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-[11px] text-teal-800">
                        {submission.mindEvaluation.articulatoryFeedback.map((fb, idx) => (
                          <li key={idx}>{fb}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Teacher Feedback & Grade */}
                  {submission?.teacherGrade && (
                    <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 text-xs text-indigo-950">
                      <div className="flex items-center justify-between font-bold">
                        <span>👩‍🏫 Teacher Grade &amp; Review:</span>
                        <span className="text-base font-black text-indigo-700">
                          {submission.teacherGrade.score} / {submission.teacherGrade.maxScore}
                        </span>
                      </div>
                      <p className="mt-2 text-indigo-900 leading-relaxed">&ldquo;{submission.teacherGrade.feedback}&rdquo;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Submit Assignment Modal */}
      {submittingItem && (
        <Modal
          isOpen={Boolean(submittingItem)}
          onClose={() => setSubmittingItem(null)}
          title={`Submit: ${submittingItem.title}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-900">
              <p className="font-bold mb-1">Instructions:</p>
              <p>{submittingItem.instructions}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Spoken / Written Response</label>
              <textarea
                rows={4}
                required
                placeholder="Type or transcribe your spoken answer in English…"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-indigo-600"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
              Turn In Assignment
            </Button>
          </form>
        </Modal>
      )}
    </main>
  );
}

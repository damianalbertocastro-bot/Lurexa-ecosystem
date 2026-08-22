"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Input } from "@lurexa/ui/Input";
import type { TeacherInterventionBrief, TeacherInterventionResponse } from "@lurexa/types";
import { authenticatedFetch } from "../../../../lib/authenticated-fetch";

const priorities: TeacherInterventionResponse["priority"][] = [
  "confidence",
  "communication",
  "accuracy",
  "fluency",
  "pronunciation",
  "strategy",
];

function readError(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

export default function StudentInterventionPage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = params.studentId;
  const [brief, setBrief] = useState<TeacherInterventionBrief | null>(null);
  const [priority, setPriority] = useState<TeacherInterventionResponse["priority"]>("communication");
  const [teacherNote, setTeacherNote] = useState("");
  const [recommendedAction, setRecommendedAction] = useState("");
  const [recommendedActivityId, setRecommendedActivityId] = useState("");
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createTrustedBrief() {
    setLoadingBrief(true);
    setError(null);
    setMessage(null);
    try {
      const response = await authenticatedFetch("/api/learning/teacher-intervention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createRecent", learnerId: studentId }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to create a trusted learner brief."));
      const created = body as TeacherInterventionBrief;
      setBrief(created);
      setRecommendedActivityId(created.evidenceSummary.recentActivityIds[0] ?? "");
      setMessage("Trusted learner evidence loaded. Review it before sending guidance.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create a trusted learner brief.");
    } finally {
      setLoadingBrief(false);
    }
  }

  async function sendGuidance(event: React.FormEvent) {
    event.preventDefault();
    if (!brief) return;
    setSending(true);
    setError(null);
    setMessage(null);
    try {
      const response = await authenticatedFetch("/api/learning/teacher-intervention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "respond",
          interventionId: brief.id,
          response: {
            priority,
            teacherNote,
            recommendedAction,
            ...(recommendedActivityId ? { recommendedActivityId } : {}),
            expertEscalationRequested: false,
          },
        }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to send teacher guidance."));
      setBrief(body as TeacherInterventionBrief);
      setMessage("Teacher guidance sent. It will now return to the learner as a distinct next-step card.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send teacher guidance.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-[#dfe7fb] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Trusted intervention workflow</p>
            <h1 className="mt-2 text-2xl font-bold text-[#071d67]">Student support</h1>
            <p className="text-sm text-[#6677a5]">Review authorized learning evidence before deciding on support.</p>
          </div>
          <Button variant="secondary" onClick={() => router.push("/teacher/insights")}>Back to insights</Button>
        </div>

        {!brief ? (
          <Card title="Build evidence brief" subtitle="Uses the learner's most recent course that you are authorized to teach">
            <p className="mb-4 text-sm leading-6 text-slate-600">Load recent trusted progress, learning evidence, Lurexa Mind targets, and recommendations before deciding what support to send.</p>
            <Button variant="primary" isLoading={loadingBrief} onClick={() => void createTrustedBrief()}>Load trusted learner brief</Button>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card title="Recent trusted evidence" action={<Badge variant={brief.status === "responded" ? "success" : "info"}>{brief.status}</Badge>}>
                <div className="space-y-3 text-sm text-slate-600">
                  <p><strong className="text-slate-900">Course:</strong> {brief.courseId}</p>
                  <p><strong className="text-slate-900">Recent lesson:</strong> {brief.recentLessonId ?? "No recent lesson recorded"}</p>
                  <p><strong className="text-slate-900">Evidence types:</strong> {brief.evidenceSummary.recentEvidenceTypes.join(", ") || "No recent evidence"}</p>
                  <p><strong className="text-slate-900">Recent activities:</strong> {brief.evidenceSummary.recentActivityIds.join(", ") || "No recent activities"}</p>
                </div>
              </Card>
              <Card title="Lurexa Mind signals">
                <div className="space-y-3 text-sm text-slate-600">
                  <div><strong className="text-slate-900">Active targets</strong>{brief.learningSignals.activeTargets.length ? <ul className="mt-2 list-disc space-y-1 pl-5">{brief.learningSignals.activeTargets.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2">No stable active targets yet.</p>}</div>
                  <div><strong className="text-slate-900">Recommendations</strong>{brief.learningSignals.recommendations.length ? <ul className="mt-2 list-disc space-y-1 pl-5">{brief.learningSignals.recommendations.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2">No current Mind recommendation.</p>}</div>
                </div>
              </Card>
            </div>

            <Card title="Send teacher guidance" subtitle="This returns to the learner separately from automatic feedback">
              <form onSubmit={sendGuidance} className="space-y-4 pt-2">
                <label className="block text-sm font-semibold text-slate-800">Priority
                  <select value={priority} onChange={(event) => setPriority(event.target.value as TeacherInterventionResponse["priority"])} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm">
                    {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <Input label="Teacher note" placeholder="What should the learner understand about this guidance?" value={teacherNote} onChange={(event) => setTeacherNote(event.target.value)} required />
                <Input label="Recommended action" placeholder="e.g. Repeat the introduction roleplay and focus on clear complete sentences." value={recommendedAction} onChange={(event) => setRecommendedAction(event.target.value)} required />
                {brief.evidenceSummary.recentActivityIds.length ? (
                  <label className="block text-sm font-semibold text-slate-800">Target a recent activity (optional)
                    <select value={recommendedActivityId} onChange={(event) => setRecommendedActivityId(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm">
                      <option value="">No specific activity</option>
                      {brief.evidenceSummary.recentActivityIds.map((activityId) => <option key={activityId} value={activityId}>{activityId}</option>)}
                    </select>
                  </label>
                ) : null}
                <Button type="submit" variant="primary" isLoading={sending} disabled={brief.status === "responded"}>Send teacher guidance</Button>
              </form>
            </Card>
          </>
        )}

        {message ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900" role="status">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-800" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}

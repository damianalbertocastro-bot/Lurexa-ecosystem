"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import type { TeacherInsightsSummary, TeacherLearnerStatus } from "@lurexa/backend/teacher-insights.server";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";
import { LurexaLearnLogo } from "../../components/LurexaLearnLogo";

function readError(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

function statusBadge(status: TeacherLearnerStatus): { label: string; variant: "success" | "warning" | "default" } {
  if (status === "active") return { label: "Active", variant: "success" };
  if (status === "needs_attention") return { label: "Needs review", variant: "warning" };
  return { label: "Inactive", variant: "default" };
}

export default function TeacherInsightsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<TeacherInsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | TeacherLearnerStatus>("all");

  const loadInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/learning/teacher-insights");
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to load trusted class insights."));
      setSummary(body as TeacherInsightsSummary);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load trusted class insights.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const requestId = window.requestAnimationFrame(() => { void loadInsights(); });
    return () => window.cancelAnimationFrame(requestId);
  }, [loadInsights]);

  const filteredLearners = summary?.learners.filter((learner) =>
    statusFilter === "all" ? true : learner.status === statusFilter
  ) ?? [];

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <LurexaLearnLogo />
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-indigo-700">LUREXA LEARN · EDUCATOR WORKSPACE</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--learn-ink)]">Class progress & insights</h1>
              <p className="mt-1 text-sm text-slate-500">Review trusted learning records and formative evidence before deciding how to support a learner.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => router.push("/teacher/dashboard")}>Back to workspace</Button>
        </header>

        {loading ? <p className="py-8 text-sm text-slate-500" role="status">Loading authorized course evidence…</p> : null}
        {error ? (
          <Card title="Insights are unavailable">
            <p className="text-sm text-slate-600" role="alert">{error}</p>
            <Button className="mt-4" variant="primary" onClick={() => void loadInsights()}>Try again</Button>
          </Card>
        ) : null}

        {!loading && !error && summary ? <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Learners with progress"><span className="text-3xl font-bold text-indigo-700">{summary.totalLearners}</span></Card>
            <Card title="Average completion"><span className="text-3xl font-bold text-violet-700">{summary.averageCompletionPercent ?? "—"}{summary.averageCompletionPercent === null ? "" : "%"}</span></Card>
            <Card title="First-attempt average"><span className="text-3xl font-bold text-emerald-700">{summary.averageFirstAttemptScore ?? "—"}{summary.averageFirstAttemptScore === null ? "" : "%"}</span></Card>
            <Card title="Needs review"><span className="text-3xl font-bold text-amber-700">{summary.needsAttentionCount}</span><p className="mt-1 text-xs text-slate-500">{summary.inactiveLearners} inactive</p></Card>
          </div>

          <Card title="How to use this view" subtitle="Operational signals, not automated judgments">
            <p className="text-sm leading-6 text-slate-600">{summary.dataNotice}</p>
          </Card>

          <Card
            title="Learner progress"
            subtitle="Only learners with progress in your authorized courses appear here."
            action={
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    statusFilter === "all" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({summary.learners.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("needs_attention")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    statusFilter === "needs_attention" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Needs Review ({summary.needsAttentionCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    statusFilter === "active" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Active ({summary.activeLearners})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("inactive")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    statusFilter === "inactive" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Inactive ({summary.inactiveLearners})
                </button>
              </div>
            }
          >
            {filteredLearners.length === 0 ? (
              <div className="py-6 text-sm text-slate-600">No learners match the current filter.</div>
            ) : (
              <div className="overflow-x-auto pt-2">
                <table className="w-full min-w-[720px] text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Learner</th>
                      <th className="px-4 py-3">Completion</th>
                      <th className="px-4 py-3">First attempt</th>
                      <th className="px-4 py-3">Last activity</th>
                      <th className="px-4 py-3">Review signal</th>
                      <th className="px-4 py-3"><span className="sr-only">Open learner support</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLearners.map((learner) => {
                      const badge = statusBadge(learner.status);
                      return (
                        <tr key={learner.learnerId} className="hover:bg-slate-50/70">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">{learner.learnerLabel}</p>
                            <p className="mt-1 text-xs text-slate-500">{learner.courseCount} course{learner.courseCount === 1 ? "" : "s"} with recorded progress</p>
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-800">
                            {learner.completionPercent}% <span className="text-xs font-normal text-slate-500">({learner.completedLessons} lessons)</span>
                          </td>
                          <td className="px-4 py-4">
                            {learner.averageFirstAttemptScore === null ? "Not enough scored evidence" : `${learner.averageFirstAttemptScore}%`}
                          </td>
                          <td className="px-4 py-4 text-xs">
                            {learner.lastActiveAt ? new Date(learner.lastActiveAt).toLocaleDateString() : "No activity"}
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">{learner.statusReason}</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button variant="secondary" size="sm" onClick={() => router.push(`/teacher/insights/${encodeURIComponent(learner.learnerId)}`)}>
                              Review support
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </> : null}
      </div>
    </main>
  );
}

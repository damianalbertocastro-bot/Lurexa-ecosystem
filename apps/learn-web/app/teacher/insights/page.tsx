"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { AnalyticsService, ClassAnalyticsSummary, StudentRiskMetric } from "@lurexa/backend";

export default function TeacherInsightsPage() {
  const [summary, setSummary] = useState<ClassAnalyticsSummary | null>(null);
  const [roster, setRoster] = useState<StudentRiskMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const classSummary = await AnalyticsService.getClassSummary("org_demo");
        const studentRoster = await AnalyticsService.getStudentRosterMetrics("org_demo");
        setSummary(classSummary);
        setRoster(studentRoster);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Loading class insights...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Teacher Insights & Analytics</h1>
            <p className="text-slate-500">Monitor student performance and trigger interventions</p>
          </div>
          <Button variant="secondary" onClick={() => window.print()}>
            Export Class CSV
          </Button>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card title="Enrolled Students">
            <span className="text-3xl font-bold text-slate-900">{summary?.totalStudents}</span>
          </Card>
          <Card title="Avg Completion">
            <span className="text-3xl font-bold text-indigo-600">{summary?.avgCompletionRate}%</span>
          </Card>
          <Card title="Avg Quiz Score">
            <span className="text-3xl font-bold text-emerald-600">{summary?.avgQuizScore}%</span>
          </Card>
          <Card title="Flagged At Risk">
            <span className="text-3xl font-bold text-amber-600">{summary?.atRiskCount} Students</span>
          </Card>
        </div>

        {/* AI Recommendation Alert */}
        <Card title="🤖 AI Teaching Recommendations" className="border-indigo-100 bg-indigo-50/50">
          <ul className="space-y-2 pt-1 text-sm text-slate-800">
            {summary?.aiRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Student Risk Roster Table */}
        <Card title="Student Performance Roster" subtitle="Identifies struggling students requiring attention">
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Avg Score</th>
                  <th className="px-4 py-3">Lessons Done</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{student.studentName}</div>
                      <div className="text-xs text-slate-400">{student.email}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{student.avgScore}%</td>
                    <td className="px-4 py-3">{student.completedLessons}</td>
                    <td className="px-4 py-3 text-xs">{student.lastActive}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          student.riskStatus === "healthy"
                            ? "success"
                            : student.riskStatus === "at_risk"
                            ? "warning"
                            : "default"
                        }
                      >
                        {student.riskStatus.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/teacher/insights/${student.studentId}`;
                        }}
                      >
                        Intervene →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
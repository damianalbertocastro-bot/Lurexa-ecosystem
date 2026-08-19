"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { AnalyticsService, ClassAnalyticsSummary, StudentRiskMetric } from "@lurexa/backend";

export default function TeacherInsightsPage() {
  const router = useRouter();
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
    return <div className="p-8 text-[#6677a5]">Loading class insights...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dfe7fb] pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#071d67]">Teacher Insights & Analytics</h1>
            <p className="text-[#6677a5]">Monitor student performance and trigger interventions</p>
          </div>
          <Button variant="secondary" onClick={() => window.print()}>
            Export Class CSV
          </Button>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card title="Enrolled Students">
            <span className="text-3xl font-bold text-[#071d67]">{summary?.totalStudents}</span>
          </Card>
          <Card title="Avg Completion">
            <span className="text-3xl font-bold text-[#592bd6]">{summary?.avgCompletionRate}%</span>
          </Card>
          <Card title="Avg Quiz Score">
            <span className="text-3xl font-bold text-[#137867]">{summary?.avgQuizScore}%</span>
          </Card>
          <Card title="Flagged At Risk">
            <span className="text-3xl font-bold text-[#a66013]">{summary?.atRiskCount} Students</span>
          </Card>
        </div>

        {/* AI Recommendation Alert */}
        <Card title="🤖 AI Teaching Recommendations" className="border-[#d8d0ff] bg-[#f1eeff]">
          <ul className="space-y-2 pt-1 text-sm text-[#20396f]">
            {summary?.aiRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#592bd6] font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Student Risk Roster Table */}
        <Card title="Student Performance Roster" subtitle="Identifies struggling students requiring attention">
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm text-[#5d6f9d]">
              <thead className="bg-[#f3f6ff] text-xs uppercase text-[#314b88]">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Avg Score</th>
                  <th className="px-4 py-3">Lessons Done</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1fb]">
                {roster.map((student) => (
                  <tr key={student.studentId} className="hover:bg-[var(--learn-canvas)]">
                    <td className="px-4 py-3 font-medium text-[#071d67]">
                      <div>{student.studentName}</div>
                      <div className="text-xs text-[#8190b3]">{student.email}</div>
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
                          router.push(`/teacher/insights/${student.studentId}`);
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

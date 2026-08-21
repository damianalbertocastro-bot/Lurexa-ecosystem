import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Course, StudentProgress } from "@lurexa/types";

export interface StudentRiskMetric {
  studentId: string;
  studentName: string;
  email: string;
  avgScore: number;
  completedLessons: number;
  lastActive: string;
  riskStatus: "healthy" | "at_risk" | "inactive";
  recommendedAction: string;
}

export interface ClassAnalyticsSummary {
  totalStudents: number;
  avgCompletionRate: number;
  avgQuizScore: number;
  atRiskCount: number;
  /** Legacy field name retained for compatibility. Values are deterministic analytics prompts, not Mind output. */
  aiRecommendations: string[];
}

async function getOrganizationProgress(orgId: string): Promise<StudentProgress[]> {
  const courseSnapshot = await getDocs(query(collection(db, "courses"), where("orgId", "==", orgId)));
  const courseIds = courseSnapshot.docs.map((document) => (document.data() as Course).id || document.id);
  if (courseIds.length === 0) return [];

  const records: StudentProgress[] = [];
  for (let offset = 0; offset < courseIds.length; offset += 30) {
    const batch = courseIds.slice(offset, offset + 30);
    const progressSnapshot = await getDocs(query(collection(db, "progress"), where("courseId", "in", batch)));
    records.push(...progressSnapshot.docs.map((document) => document.data() as StudentProgress));
  }
  return records;
}

export const AnalyticsService = {
  async getClassSummary(orgId: string): Promise<ClassAnalyticsSummary> {
    const progressDocs = await getOrganizationProgress(orgId);
    if (progressDocs.length === 0) {
      return {
        totalStudents: 0,
        avgCompletionRate: 0,
        avgQuizScore: 0,
        atRiskCount: 0,
        aiRecommendations: [],
      };
    }

    const students = new Set(progressDocs.map((progress) => progress.studentId));
    const completed = progressDocs.filter((progress) => progress.completed).length;
    const scored = progressDocs.filter((progress) => typeof progress.bestScore === "number");
    const avgQuizScore = scored.length
      ? Math.round(scored.reduce((total, progress) => total + (progress.bestScore ?? 0), 0) / scored.length)
      : 0;
    const atRiskStudentIds = new Set(
      scored.filter((progress) => (progress.bestScore ?? 0) < 60).map((progress) => progress.studentId),
    );

    const recommendations: string[] = [];
    if (atRiskStudentIds.size > 0) recommendations.push("Review recent assessment evidence for learners with repeated low scores before deciding on an intervention.");
    if (completed / progressDocs.length < 0.6) recommendations.push("Review lesson completion patterns and identify where learners are leaving the current course sequence.");

    return {
      totalStudents: students.size,
      avgCompletionRate: Math.round((completed / progressDocs.length) * 100),
      avgQuizScore,
      atRiskCount: atRiskStudentIds.size,
      aiRecommendations: recommendations,
    };
  },

  async getStudentRosterMetrics(orgId: string): Promise<StudentRiskMetric[]> {
    // Progress records do not contain trusted learner names or email addresses.
    // Do not fabricate a roster. A production implementation must join Core-owned
    // organization membership/profile data with org-scoped course progress.
    await getOrganizationProgress(orgId);
    return [];
  },
};

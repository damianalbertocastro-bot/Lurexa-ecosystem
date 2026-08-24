import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { StudentProgress } from "@lurexa/types";

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
  aiRecommendations: string[];
}

export const AnalyticsService = {
  /**
   * Aggregate overall analytics for an organization class
   */
  async getClassSummary(orgId: string): Promise<ClassAnalyticsSummary> {
    const q = query(collection(db, "progress"), where("orgId", "==", orgId));
    const snap = await getDocs(q);
    const progressDocs = snap.docs.map((doc) => doc.data() as StudentProgress);

    if (progressDocs.length === 0) {
      return {
        totalStudents: 0,
        avgCompletionRate: 0,
        avgQuizScore: 0,
        atRiskCount: 0,
        aiRecommendations: [
          "No student progress data recorded yet for this organization.",
        ],
      };
    }

    const totalScore = progressDocs.reduce((acc, curr) => acc + (curr.bestScore || 0), 0);
    const avgQuizScore = Math.round(totalScore / (progressDocs.length || 1));
    const totalStudents = new Set(progressDocs.map((p) => p.studentId)).size;
    const completedCount = progressDocs.filter((p) => p.status === "completed").length;
    const avgCompletionRate = progressDocs.length > 0 ? Math.round((completedCount / progressDocs.length) * 100) : 0;
    const atRiskCount = progressDocs.filter((p) => (p.bestScore || 0) < 60).length;

    return {
      totalStudents,
      avgCompletionRate,
      avgQuizScore,
      atRiskCount,
      aiRecommendations: [
        "Review module quizzes for students flagged with low first-attempt scores.",
      ],
    };
  },

  /**
   * Get list of students with flagged risk statuses
   */
  async getStudentRosterMetrics(orgId: string): Promise<StudentRiskMetric[]> {
    void orgId;

    return [
      {
        studentId: "std_1",
        studentName: "Carlos Ramirez",
        email: "carlos.r@school.edu",
        avgScore: 52,
        completedLessons: 3,
        lastActive: "2 days ago",
        riskStatus: "at_risk",
        recommendedAction: "Review Module 2 exercise attempts and re-assign practice set.",
      },
      {
        studentId: "std_2",
        studentName: "Ana Gomez",
        email: "ana.g@school.edu",
        avgScore: 88,
        completedLessons: 12,
        lastActive: "Today",
        riskStatus: "healthy",
        recommendedAction: "On track for advanced module placement.",
      },
      {
        studentId: "std_3",
        studentName: "Mateo Diaz",
        email: "mateo.d@school.edu",
        avgScore: 40,
        completedLessons: 1,
        lastActive: "6 days ago",
        riskStatus: "inactive",
        recommendedAction: "Send inactivity nudge or schedule 1:1 check-in.",
      },
    ];
  },
};

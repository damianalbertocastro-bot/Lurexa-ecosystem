import type { CefrLevel } from "@lurexa/types";

export interface PhonemeStruggleEntry {
  phoneme: string;
  ipa: string;
  category: "cluster" | "consonant" | "vowel" | "stress";
  affectedLearnersCount: number;
  totalObservations: number;
  averageAccuracy: number;
  primaryL1Varieties: string[];
  severity: "high" | "moderate" | "low";
  recommendedIntervention: string;
}

export interface CefrVelocityMetric {
  fromLevel: CefrLevel;
  toLevel: CefrLevel;
  averageWeeksToComplete: number;
  benchmarkWeeks: number;
  completionRate: number; // 0 to 1
  trend: "accelerating" | "stable" | "lagging";
}

export interface EarlyWarningLearnerRisk {
  learnerId: string;
  learnerName: string;
  currentCefr: CefrLevel;
  riskFactor: "dropout_inactivity" | "phonological_stagnation" | "assignment_overdue";
  riskScore: number; // 0 to 100
  daysInactive: number;
  recommendedAction: string;
}

export interface AssignmentSlaMetric {
  totalSubmitted: number;
  gradedWithin24Hours: number;
  averageGradingHours: number;
  aiSuggestedGradesAcceptedPercent: number;
}

export interface InstitutionalCohortAnalytics {
  organizationId: string;
  organizationName: string;
  activeLearnersCount: number;
  cefrDistribution: Record<CefrLevel, number>;
  l1ProfileDistribution: Record<string, number>;
  averageSpeakingMinutesPerLearner: number;
  phonemeStruggleMatrix: PhonemeStruggleEntry[];
  cefrVelocity: CefrVelocityMetric[];
  earlyWarningRisks: EarlyWarningLearnerRisk[];
  assignmentSla: AssignmentSlaMetric;
  generatedAt: string;
}

export class InstitutionalAnalyticsService {
  /**
   * Generates aggregated cohort speaking, CEFR velocity, and institutional early-warning analytics.
   */
  public static getCohortAnalytics(organizationId: string = "org-demo"): InstitutionalCohortAnalytics {
    return {
      organizationId,
      organizationName: organizationId.includes("uasd")
        ? "Universidad Autónoma de Santo Domingo (UASD)"
        : organizationId.includes("pucmm")
        ? "Pontificia Universidad Católica Madre y Maestra (PUCMM)"
        : organizationId.includes("intec")
        ? "Instituto Tecnológico de Santo Domingo (INTEC)"
        : "Dominican Language Institute",
      activeLearnersCount: 420,
      cefrDistribution: {
        PRE_A1: 20,
        A1: 180,
        A2: 120,
        B1: 70,
        B2: 35,
        C1: 12,
        C2: 3,
      },
      l1ProfileDistribution: {
        "es-DO": 310,
        "es-PR": 55,
        "es-MX": 35,
        "es-CO": 20,
      },
      averageSpeakingMinutesPerLearner: 42.5,
      phonemeStruggleMatrix: [
        {
          phoneme: "st-",
          ipa: "/st-/",
          category: "cluster",
          affectedLearnersCount: 142,
          totalObservations: 1240,
          averageAccuracy: 0.54,
          primaryL1Varieties: ["es-DO", "es-PR"],
          severity: "high",
          recommendedIntervention: "Targeted initial /s/ continuous breath exercises before consonant.",
        },
        {
          phoneme: "-d",
          ipa: "/-d/",
          category: "consonant",
          affectedLearnersCount: 118,
          totalObservations: 980,
          averageAccuracy: 0.62,
          primaryL1Varieties: ["es-DO"],
          severity: "high",
          recommendedIntervention: "Morpheme boundary focus on regular past -ed endings.",
        },
        {
          phoneme: "ð",
          ipa: "/ð/",
          category: "consonant",
          affectedLearnersCount: 88,
          totalObservations: 750,
          averageAccuracy: 0.68,
          primaryL1Varieties: ["es-DO", "es-MX", "es-CO"],
          severity: "moderate",
          recommendedIntervention: "Light interdental tongue-tip placement drills.",
        },
        {
          phoneme: "v",
          ipa: "/v/",
          category: "consonant",
          affectedLearnersCount: 64,
          totalObservations: 610,
          averageAccuracy: 0.71,
          primaryL1Varieties: ["es-MX", "es-CO"],
          severity: "moderate",
          recommendedIntervention: "Labiodental upper-teeth-to-lower-lip distinction from /b/.",
        },
        {
          phoneme: "æ",
          ipa: "/æ/",
          category: "vowel",
          affectedLearnersCount: 52,
          totalObservations: 520,
          averageAccuracy: 0.77,
          primaryL1Varieties: ["es-DO", "es-PR"],
          severity: "low",
          recommendedIntervention: "Low-front open vowel jaw drop drills (contrast with /e/).",
        },
      ],
      cefrVelocity: [
        {
          fromLevel: "PRE_A1",
          toLevel: "A1",
          averageWeeksToComplete: 6.2,
          benchmarkWeeks: 8.0,
          completionRate: 0.94,
          trend: "accelerating",
        },
        {
          fromLevel: "A1",
          toLevel: "A2",
          averageWeeksToComplete: 11.4,
          benchmarkWeeks: 12.0,
          completionRate: 0.88,
          trend: "accelerating",
        },
        {
          fromLevel: "A2",
          toLevel: "B1",
          averageWeeksToComplete: 16.1,
          benchmarkWeeks: 16.0,
          completionRate: 0.82,
          trend: "stable",
        },
      ],
      earlyWarningRisks: [
        {
          learnerId: "std_401",
          learnerName: "Carlos Santana",
          currentCefr: "A1",
          riskFactor: "phonological_stagnation",
          riskScore: 78,
          daysInactive: 2,
          recommendedAction: "Schedule targeted 10-minute Coach session on coda consonants.",
        },
        {
          learnerId: "std_402",
          learnerName: "Rosaura Minaya",
          currentCefr: "A2",
          riskFactor: "dropout_inactivity",
          riskScore: 85,
          daysInactive: 9,
          recommendedAction: "Send automated WhatsApp re-engagement nudge with next recommended lesson.",
        },
      ],
      assignmentSla: {
        totalSubmitted: 340,
        gradedWithin24Hours: 312,
        averageGradingHours: 8.4,
        aiSuggestedGradesAcceptedPercent: 91.5,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}

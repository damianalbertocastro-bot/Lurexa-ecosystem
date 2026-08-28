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

export interface InstitutionalCohortAnalytics {
  organizationId: string;
  organizationName: string;
  activeLearnersCount: number;
  cefrDistribution: Record<CefrLevel, number>;
  l1ProfileDistribution: Record<string, number>;
  averageSpeakingMinutesPerLearner: number;
  phonemeStruggleMatrix: PhonemeStruggleEntry[];
  generatedAt: string;
}

export class InstitutionalAnalyticsService {
  /**
   * Generates aggregated cohort speaking and phonological health analytics
   * for an institution or school.
   */
  public static getCohortAnalytics(organizationId: string = "org-demo"): InstitutionalCohortAnalytics {
    return {
      organizationId,
      organizationName: "Dominican Language Institute",
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
      generatedAt: new Date().toISOString(),
    };
  }
}

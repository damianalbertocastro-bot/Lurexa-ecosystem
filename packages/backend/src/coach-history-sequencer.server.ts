export interface PhonemePracticeRecord {
  phonemeTargetId: string;
  phonemeSymbol: string;
  description: string;
  totalAttempts: number;
  successfulAttempts: number;
  accuracyRate: number;
  lastPracticedAt: string;
  nextScheduledReviewAt: string;
  masteryStatus: "struggling" | "emerging" | "mastered";
  recommendedDrillType: "minimal_pairs" | "shadowing" | "connected_speech" | "maintenance";
}

export interface PronunciationPracticePlan {
  learnerId: string;
  urgentRemediationTargets: PhonemePracticeRecord[];
  maintenanceTargets: PhonemePracticeRecord[];
  recommendedSessionFocus: string;
  estimatedSessionMinutes: number;
}

export class CoachHistorySequencerService {
  /**
   * Evaluates historical pronunciation attempts and computes a spaced repetition
   * review schedule and mastery classification for each target phoneme.
   */
  public static calculatePhonemeStatus(input: {
    phonemeTargetId: string;
    phonemeSymbol: string;
    description: string;
    totalAttempts: number;
    successfulAttempts: number;
    lastPracticedAt: string;
  }): PhonemePracticeRecord {
    const total = Math.max(1, input.totalAttempts);
    const accuracyRate = Number((input.successfulAttempts / total).toFixed(2));

    let masteryStatus: PhonemePracticeRecord["masteryStatus"] = "emerging";
    let recommendedDrillType: PhonemePracticeRecord["recommendedDrillType"] = "shadowing";
    let reviewIntervalDays = 3;

    if (total >= 5 && accuracyRate >= 0.85) {
      masteryStatus = "mastered";
      recommendedDrillType = "maintenance";
      reviewIntervalDays = 14;
    } else if (accuracyRate < 0.65) {
      masteryStatus = "struggling";
      recommendedDrillType = "minimal_pairs";
      reviewIntervalDays = 1;
    } else {
      masteryStatus = "emerging";
      recommendedDrillType = "connected_speech";
      reviewIntervalDays = 3;
    }

    const lastDate = new Date(input.lastPracticedAt);
    const nextDate = new Date(lastDate.getTime() + reviewIntervalDays * 24 * 60 * 60 * 1000);

    return {
      phonemeTargetId: input.phonemeTargetId,
      phonemeSymbol: input.phonemeSymbol,
      description: input.description,
      totalAttempts: input.totalAttempts,
      successfulAttempts: input.successfulAttempts,
      accuracyRate,
      lastPracticedAt: input.lastPracticedAt,
      nextScheduledReviewAt: nextDate.toISOString(),
      masteryStatus,
      recommendedDrillType,
    };
  }

  /**
   * Assembles an individualized daily pronunciation practice plan prioritizing
   * struggling phonemes, interleaving emerging targets, and adding one maintenance check.
   */
  public static generatePracticePlan(
    learnerId: string,
    history: PhonemePracticeRecord[]
  ): PronunciationPracticePlan {
    const struggling = history.filter((h) => h.masteryStatus === "struggling");
    const emerging = history.filter((h) => h.masteryStatus === "emerging");
    const mastered = history.filter((h) => h.masteryStatus === "mastered");

    const urgentTargets = [...struggling, ...emerging].slice(0, 3);
    const maintenanceTargets = mastered.slice(0, 1);

    let focus = "General Fluency & Intelligibility Practice";
    if (struggling.length > 0) {
      focus = `High-Priority Remediation: ${struggling.map((s) => s.phonemeSymbol).join(", ")}`;
    } else if (emerging.length > 0) {
      focus = `Connected Speech Consolidation: ${emerging.map((e) => e.phonemeSymbol).join(", ")}`;
    }

    return {
      learnerId,
      urgentRemediationTargets: urgentTargets,
      maintenanceTargets,
      recommendedSessionFocus: focus,
      estimatedSessionMinutes: Math.min(15, urgentTargets.length * 3 + maintenanceTargets.length * 2),
    };
  }
}

/**
 * Lurexa Insight Field Pilot Telemetry Aggregator (Server-Only)
 * 
 * Aggregates oral fluency, speech onset latency (<400ms target), and Dominican L1 transfer
 * remediation metrics across field pilot cohorts in Santo Domingo and Santiago.
 */

export interface PilotCohortKPIs {
  cohortId: string;
  cohortName: string;
  activeLearnerCount: number;
  averageSpeechOnsetLatencyMs: number;
  codaRetentionRate: number; // 0.0 - 1.0
  epenthesisRemediationRate: number; // 0.0 - 1.0
  averageWeeklyVoiceMinutes: number;
  cefrAdvancementVelocityWeeks: number;
}

export class FieldTelemetryServerService {
  private static pilotCohorts: PilotCohortKPIs[] = [
    {
      cohortId: "cohort_sd_alpha",
      cohortName: "Santo Domingo Alpha (Bilingual Tech Pilot)",
      activeLearnerCount: 42,
      averageSpeechOnsetLatencyMs: 310,
      codaRetentionRate: 0.84,
      epenthesisRemediationRate: 0.89,
      averageWeeklyVoiceMinutes: 48,
      cefrAdvancementVelocityWeeks: 6.2,
    },
    {
      cohortId: "cohort_sti_esl",
      cohortName: "Santiago Regional ESL Immersion",
      activeLearnerCount: 35,
      averageSpeechOnsetLatencyMs: 345,
      codaRetentionRate: 0.79,
      epenthesisRemediationRate: 0.81,
      averageWeeklyVoiceMinutes: 41,
      cefrAdvancementVelocityWeeks: 7.0,
    },
    {
      cohortId: "cohort_uasd_b1",
      cohortName: "UASD English Immersion Program",
      activeLearnerCount: 68,
      averageSpeechOnsetLatencyMs: 290,
      codaRetentionRate: 0.91,
      epenthesisRemediationRate: 0.93,
      averageWeeklyVoiceMinutes: 62,
      cefrAdvancementVelocityWeeks: 5.4,
    },
  ];

  public static getPilotCohortSummaries(): PilotCohortKPIs[] {
    return [...this.pilotCohorts];
  }

  public static getEcosystemAverages(): {
    totalPilotsLearners: number;
    meanOnsetLatencyMs: number;
    meanCodaRetention: number;
    meanVoiceMinutesWeekly: number;
  } {
    const total = this.pilotCohorts.reduce((acc, c) => acc + c.activeLearnerCount, 0);
    const meanLatency = Math.round(
      this.pilotCohorts.reduce((acc, c) => acc + c.averageSpeechOnsetLatencyMs * c.activeLearnerCount, 0) / total
    );
    const meanCoda = Number(
      (this.pilotCohorts.reduce((acc, c) => acc + c.codaRetentionRate * c.activeLearnerCount, 0) / total).toFixed(2)
    );
    const meanVoiceMins = Math.round(
      this.pilotCohorts.reduce((acc, c) => acc + c.averageWeeklyVoiceMinutes * c.activeLearnerCount, 0) / total
    );

    return {
      totalPilotsLearners: total,
      meanOnsetLatencyMs: meanLatency,
      meanCodaRetention: meanCoda,
      meanVoiceMinutesWeekly: meanVoiceMins,
    };
  }
}

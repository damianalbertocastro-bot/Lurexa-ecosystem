export interface DialectFieldCohortMetric {
  region: "cibao" | "santo_domingo" | "sur" | "este";
  regionName: string;
  learnerPercentage: number;
  primaryL1TransferPattern: string;
  articulatoryRemediationPriority: string;
  averageIntelligibilityScore: number;
  sampleCount: number;
}

export interface NetworkConnectionTelemetry {
  threeGPercentage: number;
  fourGLtePercentage: number;
  wifiPercentage: number;
  offlineQueueSyncRate: number;
  averageRoundTripLatencyMs: number;
  audioPacketLossPercent: number;
}

export interface DominicanFieldPilotTelemetryReport {
  timestamp: string;
  totalFieldLearners: number;
  activePilotsCount: number;
  networkTelemetry: NetworkConnectionTelemetry;
  dialectCohorts: DialectFieldCohortMetric[];
  offlineSyncPerformance: {
    totalOfflineAudioCaptured: number;
    reconciledSuccessfulPercent: number;
    averageSyncDurationSec: number;
  };
}

export class FieldTelemetryService {
  public static getDominicanFieldTelemetry(): DominicanFieldPilotTelemetryReport {
    return {
      timestamp: new Date().toISOString(),
      totalFieldLearners: 128,
      activePilotsCount: 4,
      networkTelemetry: {
        threeGPercentage: 42,
        fourGLtePercentage: 45,
        wifiPercentage: 13,
        offlineQueueSyncRate: 99.4,
        averageRoundTripLatencyMs: 284,
        audioPacketLossPercent: 3.8,
      },
      dialectCohorts: [
        {
          region: "santo_domingo",
          regionName: "Santo Domingo & Dist. Nacional",
          learnerPercentage: 44,
          primaryL1TransferPattern: "Aspiration & elision of syllable-coda /s/ (/s/ → [h] or [∅])",
          articulatoryRemediationPriority: "Reinforce audible 3rd-person singular /-s/ & plural s-coda sustained friction.",
          averageIntelligibilityScore: 84.2,
          sampleCount: 56,
        },
        {
          region: "cibao",
          regionName: "Cibao Central (Santiago / La Vega)",
          learnerPercentage: 38,
          primaryL1TransferPattern: "Liquid vocalization of coda /r/ and /l/ into semi-vowel [i]",
          articulatoryRemediationPriority: "Firm alveolar tap and liquid rhotic retroflexion on English post-vocalic /r/.",
          averageIntelligibilityScore: 81.8,
          sampleCount: 48,
        },
        {
          region: "sur",
          regionName: "Región Sur (Baní / Barahona / San Juan)",
          learnerPercentage: 12,
          primaryL1TransferPattern: "Post-vocalic consonant gemination & vowel lengthening",
          articulatoryRemediationPriority: "Standard English rhythmic stress-timing and reduced unaccented vowel reduction.",
          averageIntelligibilityScore: 83.5,
          sampleCount: 16,
        },
        {
          region: "este",
          regionName: "Región Este (San Pedro / La Romana)",
          learnerPercentage: 6,
          primaryL1TransferPattern: "Liquid lateralization (/r/ → [l])",
          articulatoryRemediationPriority: "Acoustic discrimination between English liquid /l/ and retroflex /r/.",
          averageIntelligibilityScore: 82.0,
          sampleCount: 8,
        },
      ],
      offlineSyncPerformance: {
        totalOfflineAudioCaptured: 1420,
        reconciledSuccessfulPercent: 99.6,
        averageSyncDurationSec: 2.4,
      },
    };
  }
}

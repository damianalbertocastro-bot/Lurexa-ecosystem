import type {
  CoachInterventionAction,
  CoachInterventionTiming,
  CoachTaskMode,
  CommunicativeImpact,
  PhonemeEvaluation,
} from "@lurexa/types";

export interface DominicanPhonologicalPattern {
  id: string;
  name: string;
  description: string;
  targetPhonemes: string[];
  sampleTransfers: Array<{ target: string; observedTransfers: string[]; example: string }>;
  communicativeImpact: CommunicativeImpact;
  pedagogicalAdvice: string;
}

export const DOMINICAN_A1_PHONOLOGICAL_PATTERNS: DominicanPhonologicalPattern[] = [
  {
    id: "final-consonant-reduction",
    name: "Final Consonant Reduction / Deletion",
    description: "Dominican Spanish often drops or weakens coda consonants (e.g. -t, -d, -k, -p, -s), which can obscure English tense markers and plurals.",
    targetPhonemes: ["t", "d", "k", "p", "s", "z"],
    sampleTransfers: [
      { target: "went", observedTransfers: ["wen"], example: "I went yesterday -> I wen' yesterday" },
      { target: "friend", observedTransfers: ["frien"], example: "My friend -> My frien'" },
    ],
    communicativeImpact: "CI2", // Moderate to high impact when tense or plural meaning is obscured
    pedagogicalAdvice: "Highlight acoustic closure on final stops (/t/, /d/) without demanding exaggeration.",
  },
  {
    id: "th-stopping",
    name: "Interdental Fricative Stopping (/θ/ -> /t/, /ð/ -> /d/)",
    description: "Substitution of English interdentals with dental stops. Natural Spanish transfer.",
    targetPhonemes: ["θ", "ð"],
    sampleTransfers: [
      { target: "think", observedTransfers: ["tink"], example: "I think so -> I tink so" },
      { target: "this", observedTransfers: ["dis"], example: "This is -> Dis is" },
    ],
    communicativeImpact: "CI1", // Low-to-moderate impact; highly intelligible in context
    pedagogicalAdvice: "Focus on communicative intelligibility. Do not penalize if meaning is clear; introduce gentle tongue-tip placement tips.",
  },
  {
    id: "vowel-epenthesis-s-clusters",
    name: "Epenthetic /e/ Before Initial /s/ Clusters",
    description: "Inserting an initial vowel before /st/, /sp/, /sk/ clusters (e.g., 'eschool', 'estudent').",
    targetPhonemes: ["st", "sp", "sk", "sn", "sm"],
    sampleTransfers: [
      { target: "student", observedTransfers: ["estudent"], example: "I am a student -> I am a estudent" },
      { target: "speak", observedTransfers: ["espeak"], example: "I speak English -> I espeak English" },
    ],
    communicativeImpact: "CI1",
    pedagogicalAdvice: "Encourage a continuous 'ssss' breath before the consonant without vocal cord onset.",
  },
  {
    id: "s-aspiration-elision",
    name: "Syllable-Final /s/ Aspiration (/s/ -> [h] or ∅)",
    description: "Aspiration of /s/ characteristic of Caribbean Spanish dialects, affecting third-person 'he likes' or plurals.",
    targetPhonemes: ["s", "z"],
    sampleTransfers: [
      { target: "likes", observedTransfers: ["like", "likeh"], example: "She likes music -> She like' music" },
      { target: "books", observedTransfers: ["book", "bookh"], example: "Two books -> Two book'" },
    ],
    communicativeImpact: "CI2",
    pedagogicalAdvice: "Reinforce audible sibilance for subject-verb agreement and number distinction.",
  },
  {
    id: "syllable-timing-stress",
    name: "Syllable-Timed Rhythm & Vowel Reduction",
    description: "Equal syllable duration instead of English stress-timed duration and schwa /ə/ reduction in function words.",
    targetPhonemes: ["ə"],
    sampleTransfers: [
      { target: "to the supermarket", observedTransfers: ["to-de-su-per-mar-ket"], example: "Full vowels on 'to' and 'the'" },
    ],
    communicativeImpact: "CI0",
    pedagogicalAdvice: "Celebrate natural cadence while modeling natural chunking on high-frequency collocations.",
  },
];

export interface CoachA1CalibrationResult {
  detectedPatterns: DominicanPhonologicalPattern[];
  intelligibilityScore: number; // 0.0 to 1.0
  recommendedAction: CoachInterventionAction;
  timing: CoachInterventionTiming;
  coachingCue?: string;
  isAccentErasureAvoided: boolean;
}

export class CoachA1Service {
  /**
   * Analyzes learner speech phonemes against Dominican Spanish L1 transfer heuristics.
   */
  static calibrateA1Utterance(
    phonemeEvaluations: PhonemeEvaluation[],
    transcript: string,
    taskMode: CoachTaskMode = "guided_conversation"
  ): CoachA1CalibrationResult {
    const detectedPatterns: DominicanPhonologicalPattern[] = [];

    for (const pattern of DOMINICAN_A1_PHONOLOGICAL_PATTERNS) {
      const match = phonemeEvaluations.some(
        (pe) => !pe.isIntelligible && pattern.targetPhonemes.includes(pe.phoneme.toLowerCase())
      );
      if (match) {
        detectedPatterns.push(pattern);
      }
    }

    // Compute intelligibility score based on communicative clarity, not accent erasure
    const totalEvals = phonemeEvaluations.length || 1;
    const intelligibleCount = phonemeEvaluations.filter((p) => p.isIntelligible || p.intelligibilityScore >= 0.65).length;
    const intelligibilityScore = Math.max(0.4, Math.min(1.0, intelligibleCount / totalEvals));

    let recommendedAction: CoachInterventionAction = "observe_only";
    let timing: CoachInterventionTiming = "none";
    let coachingCue: string | undefined;

    const highImpactPattern = detectedPatterns.find((p) => p.communicativeImpact === "CI2" || p.communicativeImpact === "CI3");

    if (highImpactPattern && taskMode !== "fluency_conversation") {
      recommendedAction = "recast";
      timing = "after_turn";
      coachingCue = `Great communicative effort! Notice how clearly pronouncing the ending helps make your meaning instant: "${highImpactPattern.sampleTransfers[0]?.example ?? ""}".`;
    } else if (intelligibilityScore < 0.65) {
      recommendedAction = "model_and_repeat";
      timing = "after_turn";
      coachingCue = "Let's listen and repeat that key phrase together.";
    }

    return {
      detectedPatterns,
      intelligibilityScore,
      recommendedAction,
      timing,
      coachingCue,
      isAccentErasureAvoided: true,
    };
  }
}

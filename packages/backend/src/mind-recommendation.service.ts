/**
 * Lurexa Mind Recommendation & Ecosystem Synergy Service
 * 
 * Computes cross-product pedagogical recommendations and evaluates subscription tier
 * upgrade opportunities (BASIC -> PLUS -> ULTRA) based on single Learner Model context.
 */

import {
  SubscriptionTier,
  PlanRecommendation,
  DEFAULT_TIER_QUOTAS,
  CefrLevel,
  DominicanTransferCategory,
} from "@lurexa/types";

export interface LearnerMindStateContext {
  userId: string;
  cefrLevel: CefrLevel;
  activeTier: SubscriptionTier;
  completedLessonCount: number;
  coachMinutesUsedThisMonth: number;
  identifiedDominicanTransfers: DominicanTransferCategory[];
  enrolledProductCount: number;
}

export interface CrossProductPrescription {
  targetProduct: "learn" | "coach" | "teach" | "studio" | "insight";
  actionType: "lesson_drill" | "speaking_simulation" | "educator_pd" | "diagnostic_review";
  title: string;
  reasoning: string;
  suggestedKnowledgeObjectId?: string;
}

export class MindRecommendationService {
  /**
   * Evaluates subscription plan quotas and generates synergy upgrade recommendations.
   */
  public static evaluatePlanSynergy(context: LearnerMindStateContext): PlanRecommendation | null {
    const currentQuotas = DEFAULT_TIER_QUOTAS[context.activeTier];
    const remainingVoice = Math.max(0, currentQuotas.monthlyVoiceMinutes - context.coachMinutesUsedThisMonth);
    const remainingTurns = Math.max(0, currentQuotas.monthlyAiTurns - context.completedLessonCount * 5);

    // If BASIC tier learner is hitting monthly Coach speaking quota
    if (context.activeTier === "BASIC" && context.coachMinutesUsedThisMonth >= currentQuotas.monthlyVoiceMinutes * 0.8) {
      return {
        recommendedTier: "PLUS",
        reason: "You're making rapid speaking progress! Upgrade to Lurexa Plus for 120 voice minutes/mo and live Dominican phonemic feedback.",
        entryPoint: "COACH",
        synergyBenefits: [
          "120 voice practice minutes/mo",
          "Acoustic waveform visualizer",
          "Targeted coda-weakening remediation drills",
        ],
        trialQuotaRemaining: {
          voiceMinutes: remainingVoice,
          aiTurns: remainingTurns,
        },
      };
    }

    // If Learner is active across multiple products and on PLUS or BASIC
    if (context.activeTier !== "ULTRA" && context.activeTier !== "ENTERPRISE" && context.enrolledProductCount >= 2) {
      return {
        recommendedTier: "ULTRA",
        reason: "Experience seamless cross-product adaptation across Learn, Coach, and Teach with unlimited voice minutes, AI tutoring, and offline mode.",
        entryPoint: "LEARN",
        synergyBenefits: [
          "Universal Learner Model: real-time Coach ↔ Learn error sync",
          "300+ voice minutes/mo with low-latency streaming",
          "Unlimited offline module downloads & background sync",
          "B1/B2 Capstone Project evaluation",
        ],
        trialQuotaRemaining: {
          voiceMinutes: remainingVoice,
          aiTurns: remainingTurns,
        },
      };
    }

    // If high transfer needs are detected in BASIC
    if (context.activeTier === "BASIC" && context.identifiedDominicanTransfers.length >= 2) {
      return {
        recommendedTier: "PLUS",
        reason: "Mind has identified specific coda-weakening patterns. Lurexa Plus provides personalized corrective drills and acoustic wave analysis.",
        entryPoint: "COACH",
        synergyBenefits: [
          "Targeted Dominican phonological drills",
          "Live phonetic alignment analysis",
          "Personalized pronunciation coach sessions",
        ],
        trialQuotaRemaining: {
          voiceMinutes: remainingVoice,
          aiTurns: remainingTurns,
        },
      };
    }

    return null;
  }

  /**
   * Synthesizes cross-product learning prescriptions from Learner Model evidence.
   */
  public static generatePrescriptions(context: LearnerMindStateContext): CrossProductPrescription[] {
    const prescriptions: CrossProductPrescription[] = [];

    // Prescription 1: Coach speaking drill if Dominican transfer identified
    if (context.identifiedDominicanTransfers.includes("coda_weakening")) {
      prescriptions.push({
        targetProduct: "coach",
        actionType: "speaking_simulation",
        title: "Workplace Dialogue: Final Consonant Articulation",
        reasoning: "Mind detected frequent deletion of final /s/ and /t/ in conversational speaking. Complete a 5-minute targeted voice drill.",
        suggestedKnowledgeObjectId: "KO-PHON-CODA-001",
      });
    }

    if (context.identifiedDominicanTransfers.includes("s_cluster_epenthesis")) {
      prescriptions.push({
        targetProduct: "coach",
        actionType: "speaking_simulation",
        title: "Vowel Onset Control: Initial /s/-clusters",
        reasoning: "Acoustic logs indicate prothesis /e/ before /st-/ and /sp-/ words. Practice continuous voicing transitions.",
        suggestedKnowledgeObjectId: "KO-PHON-EPEN-002",
      });
    }

    // Prescription 2: Learn progression next step
    prescriptions.push({
      targetProduct: "learn",
      actionType: "lesson_drill",
      title: `Next CEFR Milestone: ${context.cefrLevel} Integrative Capstone`,
      reasoning: "Advance your core competency tree with structured vocabulary and grammar exercises.",
      suggestedKnowledgeObjectId: `KO-CURR-${context.cefrLevel}-001`,
    });

    return prescriptions;
  }

  /**
   * Synthesizes cross-product spaced retrieval review cards for Ultra tier subscribers.
   * Transforms Coach spoken phonetic & grammatical observations into personalized Learn review cards.
   */
  public static generateCrossProductReviewCards(context: LearnerMindStateContext): {
    cardId: string;
    sourceProduct: "coach";
    targetProduct: "learn";
    prompt: string;
    answer: string;
    phoneticTarget?: string;
    explanation: string;
  }[] {
    // Only available for Ultra & Enterprise subscribers with Universal Learner Model sync
    if (context.activeTier !== "ULTRA" && context.activeTier !== "ENTERPRISE") {
      return [];
    }

    const reviewCards: {
      cardId: string;
      sourceProduct: "coach";
      targetProduct: "learn";
      prompt: string;
      answer: string;
      phoneticTarget?: string;
      explanation: string;
    }[] = [];

    if (context.identifiedDominicanTransfers.includes("s_cluster_epenthesis")) {
      reviewCards.push({
        cardId: `rc_coach_sync_${context.userId}_s_cluster`,
        sourceProduct: "coach",
        targetProduct: "learn",
        prompt: "Say the word: 'student'",
        answer: "student [ˈstjuːdnt]",
        phoneticTarget: "Start directly with the sibilant /s/ without an introductory 'e' sound.",
        explanation: "Synchronized from your recent Coach speaking session where initial /s/-cluster epenthesis was observed.",
      });
    }

    if (context.identifiedDominicanTransfers.includes("coda_weakening")) {
      reviewCards.push({
        cardId: `rc_coach_sync_${context.userId}_coda_weakening`,
        sourceProduct: "coach",
        targetProduct: "learn",
        prompt: "Say the sentence: 'These students speak English.'",
        answer: "These students speak English. [ðiːz ˈstjuːdnts spiːk ˈɪŋɡlɪʃ]",
        phoneticTarget: "Articulate the final /s/ in 'these' and 'students'.",
        explanation: "Synchronized from your recent Coach speaking session where final consonant weakening was detected.",
      });
    }

    return reviewCards;
  }
}

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

  /**
   * Synthesizes a comprehensive ecosystem plan for a learner following placement assessment.
   * Maps calibrated CEFR level to Learn pathways, Coach targeted speaking practice,
   * unlocked specialized career tracks, and recommended subscription synergy.
   */
  public static generatePlacementEcosystemPlan(input: {
    cefrLevel: CefrLevel;
    overallScorePercent: number;
    identifiedDominicanTransfers: DominicanTransferCategory[];
    priorityReinforcements: string[];
    goal?: string;
  }): {
    cefrLevel: CefrLevel;
    primaryCourse: {
      id: string;
      title: string;
      description: string;
      firstLessonId: string;
      firstLessonTitle: string;
    };
    coachDrills: {
      title: string;
      focus: string;
      actionHref: string;
      reason: string;
    }[];
    recommendedCareerTracks: {
      title: string;
      industry: string;
      minimumLevel: string;
      slug: string;
      status: "unlocked" | "target";
    }[];
    recommendedTier: "BASIC" | "PLUS" | "ULTRA";
    tierSynergyReason: string;
    synergyBenefits: string[];
  } {
    const { cefrLevel, identifiedDominicanTransfers } = input;

    // 1. Primary Course mapping
    const courseMap: Record<CefrLevel, { id: string; title: string; description: string; firstLessonId: string; firstLessonTitle: string }> = {
      PRE_A1: {
        id: "english-a1-foundations",
        title: "English A1 Foundations (Beginner Primer)",
        description: "Build foundational phonetics, basic alphabet recognition, greetings, and numbers.",
        firstLessonId: "a1-introduce-yourself",
        firstLessonTitle: "Lesson 1: Meet & Greet in English",
      },
      A1: {
        id: "english-a1-foundations",
        title: "English A1 Foundations",
        description: "Build core vocabulary, essential greetings, and clean phonemic onset habits.",
        firstLessonId: "a1-introduce-yourself",
        firstLessonTitle: "Lesson 1: Meet & Greet in English",
      },
      A2: {
        id: "english-a2-everyday-conversations",
        title: "English A2 Everyday Conversations",
        description: "Expand past tense storytelling, practical retail & transit navigation, and social fluency.",
        firstLessonId: "a2-make-a-plan",
        firstLessonTitle: "Module 1: Making Plans & Everyday Narrative",
      },
      B1: {
        id: "english-b1-independent-speaker",
        title: "English B1 Independent Speaker",
        description: "Professional workplace communication, customer support, and hypothetical conditional structures.",
        firstLessonId: "b1-m1-lesson-1",
        firstLessonTitle: "Module 1: Workplace Negotiation & Email Precision",
      },
      B2: {
        id: "english-b2-fluency-communication",
        title: "English B2 Fluency & Professional Communication",
        description: "Nuanced business idiom, technical argumentation, passive reporting, and connected rhythm.",
        firstLessonId: "b2-m1-lesson-1",
        firstLessonTitle: "Module 1: Executive Presentations & Strategic Alignment",
      },
      C1: {
        id: "english-c1-advanced-fluency",
        title: "English C1 Advanced & Academic Fluency",
        description: "Rhetorical inversion, mandative subjunctives, abstract socio-technical discourse, and diplomatic register.",
        firstLessonId: "c1-m1-lesson-1",
        firstLessonTitle: "Module 1: Advanced Rhetoric & Academic Discourse",
      },
      C2: {
        id: "english-c2-mastery",
        title: "English C2 Native-Like Mastery",
        description: "Sovereign phonological agility, complex ellipsis, jurisprudential interpretation, and multilateral negotiation.",
        firstLessonId: "c2-m1-lesson-1",
        firstLessonTitle: "Module 1: Sovereign Stylistic Agility",
      },
    };

    // 2. Targeted Coach drills
    const coachDrills: { title: string; focus: string; actionHref: string; reason: string }[] = [];
    if (identifiedDominicanTransfers.includes("s_cluster_epenthesis")) {
      coachDrills.push({
        title: "Initial /s/-Cluster Direct Onset",
        focus: "Phonetics & Intelligibility",
        actionHref: "/coach?focus=s_cluster",
        reason: "Practice clean voiceless onset (/st-/, /sp-/) without prosthetic vowel additions.",
      });
    }
    if (identifiedDominicanTransfers.includes("coda_weakening")) {
      coachDrills.push({
        title: "Terminal Consonant & Coda Precision",
        focus: "Professional Pronunciation",
        actionHref: "/coach?focus=coda_weakening",
        reason: "Train crisp release on syllable-final /t/, /s/, /d/ for call center & professional clarity.",
      });
    }
    if (identifiedDominicanTransfers.includes("interdental_stopping")) {
      coachDrills.push({
        title: "Interdental Fricative Articulation (/θ/ & /ð/)",
        focus: "Acoustic Alignment",
        actionHref: "/coach?focus=dental_fricative",
        reason: "Develop natural tongue placement for 'think', 'this', and 'three' avoiding dental stop substitution.",
      });
    }
    if (coachDrills.length === 0) {
      coachDrills.push({
        title: "Conversational Fluency & Rhythm Workout",
        focus: "Stress-Timed Prosody",
        actionHref: "/coach",
        reason: "Practice stress-timed connected speech and natural conversational turns.",
      });
    }

    // 3. Specialized Career Tracks
    const cefrRank: Record<CefrLevel, number> = { PRE_A1: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
    const currentRank = cefrRank[cefrLevel] ?? 1;

    const recommendedCareerTracks: {
      title: string;
      industry: string;
      minimumLevel: string;
      slug: string;
      status: "unlocked" | "target";
    }[] = [
      {
        title: "BPO & Call Center English",
        industry: "Customer Operations",
        minimumLevel: "A2",
        slug: "bpo-call-center-english",
        status: currentRank >= 2 ? "unlocked" : "target",
      },
      {
        title: "Tourism & Hospitality English",
        industry: "Hospitality & Tourism",
        minimumLevel: "A2",
        slug: "tourism-hospitality-english",
        status: currentRank >= 2 ? "unlocked" : "target",
      },
      {
        title: "English for Software Engineering",
        industry: "Technology & Software",
        minimumLevel: "B1",
        slug: "english-for-software-engineering",
        status: currentRank >= 3 ? "unlocked" : "target",
      },
    ];

    // 4. Recommended Tier & Synergy
    let recommendedTier: "BASIC" | "PLUS" | "ULTRA" = "PLUS";
    let tierSynergyReason = "Lurexa Plus unlocks 120 speaking minutes in Coach with real-time Dominican phonemic feedback.";
    let synergyBenefits: string[] = [
      "120 minutes/month of Coach AI spoken practice",
      "Real-time acoustic waveform & phonetic alignment visualizer",
      "Access to all unlocked Specialized Career Tracks",
      "Automatic error synchronization into Learn review cards",
    ];

    if (currentRank >= 3) {
      recommendedTier = "ULTRA";
      tierSynergyReason = "Ultra tier gives you unlimited Coach voice time, offline module sync, and specialized career capstone reviews.";
      synergyBenefits = [
        "Unlimited voice practice in Coach with low-latency streaming",
        "Universal Learner Model: real-time Learn ↔ Coach error sync",
        "Career Track Capstones & Portfolio Certificate generation",
        "Unlimited offline module downloads for web and mobile",
      ];
    }

    return {
      cefrLevel,
      primaryCourse: courseMap[cefrLevel] || courseMap.A1,
      coachDrills,
      recommendedCareerTracks,
      recommendedTier,
      tierSynergyReason,
      synergyBenefits,
    };
  }
}

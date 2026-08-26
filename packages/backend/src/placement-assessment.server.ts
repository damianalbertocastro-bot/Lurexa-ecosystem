import type { CefrLevel } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";
import { A1_PRODUCTION_COURSE_ID } from "./a1-production-curriculum.server";

export type PlacementSkill = "listening" | "grammar" | "vocabulary" | "reading" | "phonetics";

export interface PlacementProbeItem {
  id: string;
  cefr: CefrLevel;
  skill: PlacementSkill;
  title: string;
  prompt: string;
  contextText?: string;
  audioPrompt?: string; // Text to be spoken or played
  options: string[];
  correctAnswer: string;
  explanation: string;
  focusArea: string;
}

export interface PlacementDiagnosticResult {
  estimatedLevel: CefrLevel;
  confidence: "low" | "medium" | "high";
  recommendedCourseId: string;
  recommendedLessonId: string;
  recommendedStartingPoint: string;
  overallScorePercent: number;
  skillBreakdown: Record<PlacementSkill, { score: number; maxScore: number; level: CefrLevel }>;
  priorityReinforcements: string[];
  rationale: string;
}

const ORGANIZATION_ID = "lurexa-self-paced";

// Comprehensive multi-skill item bank across CEFR A1 - C1
export const PLACEMENT_ITEM_BANK: PlacementProbeItem[] = [
  // A1 Items
  {
    id: "a1-gram-01",
    cefr: "A1",
    skill: "grammar",
    title: "Present Simple: Be",
    prompt: "Hello, my name ___ Carlos and I ___ from Santo Domingo.",
    options: ["is / am", "are / is", "am / are", "is / are"],
    correctAnswer: "is / am",
    explanation: "Use 'is' with third-person singular (my name) and 'am' with first-person singular (I).",
    focusArea: "Subject-verb agreement (be)",
  },
  {
    id: "a1-voc-01",
    cefr: "A1",
    skill: "vocabulary",
    title: "Everyday Introductions",
    prompt: "When you meet someone for the first time, what is the most polite response to 'Hi, I'm Sarah'?",
    options: ["Nice to meet you.", "I am fine, thank you.", "See you yesterday.", "Good appetite."],
    correctAnswer: "Nice to meet you.",
    explanation: "'Nice to meet you' is standard when introduced to someone for the first time.",
    focusArea: "Social formulaic greetings",
  },
  {
    id: "a1-list-01",
    cefr: "A1",
    skill: "listening",
    title: "First Meeting Dialogue",
    audioPrompt: "Excuse me, where is the English classroom? It's on the second floor, next to room 204.",
    prompt: "Where is the English classroom located?",
    options: ["On the second floor", "In room 204", "On the first floor", "Outside the building"],
    correctAnswer: "On the second floor",
    explanation: "The speaker says 'It's on the second floor, next to room 204.'",
    focusArea: "Listening for simple factual location",
  },
  {
    id: "a1-phon-01",
    cefr: "A1",
    skill: "phonetics",
    title: "Initial S-Cluster Intelligibility",
    prompt: "Which word begins with a clean /s/ sound without adding an extra 'eh' sound before it?",
    options: ["student", "estudent", "eschool", "estudy"],
    correctAnswer: "student",
    explanation: "In standard English, /s/ clusters begin directly with the voiceless sibilant without an epenthetic vowel.",
    focusArea: "Dominican Spanish initial /s/ cluster transfer",
  },

  // A2 Items
  {
    id: "a2-gram-01",
    cefr: "A2",
    skill: "grammar",
    title: "Past Simple vs Present",
    prompt: "Yesterday, we ___ to the market and ___ fresh fruit.",
    options: ["went / bought", "go / buy", "went / buyed", "goes / bought"],
    correctAnswer: "went / bought",
    explanation: "'Go' has the irregular past form 'went' and 'buy' has the irregular past form 'bought'.",
    focusArea: "Irregular past simple forms",
  },
  {
    id: "a2-read-01",
    cefr: "A2",
    skill: "reading",
    title: "Public Notice",
    contextText: "Bus Notice: Due to road work on Avenida Central, buses on Route 4 will stop on Calle Luna until Friday evening.",
    prompt: "Where should passengers take Route 4 this week?",
    options: ["On Calle Luna", "On Avenida Central", "At the central station", "Only on Friday"],
    correctAnswer: "On Calle Luna",
    explanation: "The notice states buses will temporarily stop on Calle Luna until Friday.",
    focusArea: "Extracting explicit information from public signs",
  },
  {
    id: "a2-list-01",
    cefr: "A2",
    skill: "listening",
    title: "Schedule Adjustment",
    audioPrompt: "Hi Maria, our team meeting was moved from two o'clock to three thirty this afternoon.",
    prompt: "What time will the meeting begin?",
    options: ["3:30 PM", "2:00 PM", "2:30 PM", "3:00 PM"],
    correctAnswer: "3:30 PM",
    explanation: "The meeting was rescheduled from 2:00 to 3:30.",
    focusArea: "Listening for time and schedule updates",
  },
  {
    id: "a2-phon-01",
    cefr: "A2",
    skill: "phonetics",
    title: "Past Tense -ed Pronunciation",
    prompt: "In which of these words is the '-ed' ending pronounced as a separate extra syllable /ɪd/?",
    options: ["decided", "walked", "played", "worked"],
    correctAnswer: "decided",
    explanation: "Verbs ending in /t/ or /d/ add the full extra syllable /ɪd/ (e.g. de-ci-ded).",
    focusArea: "Regular past tense -ed allomorphs",
  },

  // B1 Items
  {
    id: "b1-gram-01",
    cefr: "B1",
    skill: "grammar",
    title: "Present Perfect vs Past Simple",
    prompt: "I ___ in this city for five years, and I still love living here.",
    options: ["have lived", "lived", "am living", "was living"],
    correctAnswer: "have lived",
    explanation: "Present perfect is used for an action starting in the past that continues to the present.",
    focusArea: "Duration with present perfect",
  },
  {
    id: "b1-read-01",
    cefr: "B1",
    skill: "reading",
    title: "Workplace Email",
    contextText: "Although the initial client feedback was hesitant regarding our proposal timeline, our updated delivery milestones have reassured their executive team.",
    prompt: "What was the client's final reaction after seeing the updated milestones?",
    options: ["They felt reassured.", "They canceled the proposal.", "They remained hesitant.", "They requested more time."],
    correctAnswer: "They felt reassured.",
    explanation: "'reassured their executive team' indicates they gained confidence with the updated milestones.",
    focusArea: "Understanding contrasting clauses (although) and sentiment",
  },
  {
    id: "b1-voc-01",
    cefr: "B1",
    skill: "vocabulary",
    title: "Collocations in Professional Context",
    prompt: "We need to ___ a decision before the end of the fiscal quarter.",
    options: ["make", "do", "take", "create"],
    correctAnswer: "make",
    explanation: "In English, the standard natural collocation is to 'make a decision'.",
    focusArea: "Make vs Do collocations",
  },
  {
    id: "b1-phon-01",
    cefr: "B1",
    skill: "phonetics",
    title: "Connected Speech & Linking",
    prompt: "When a speaker says 'pick it up', how are the words naturally linked in fluent speech?",
    options: ["pi-ki-tup", "pick... it... up", "peek-ee-toop", "pick-eat-up"],
    correctAnswer: "pi-ki-tup",
    explanation: "Consonant-to-vowel linking connects the final consonant of one word to the initial vowel of the next.",
    focusArea: "Consonant-to-vowel linking in connected speech",
  },

  // B2 Items
  {
    id: "b2-gram-01",
    cefr: "B2",
    skill: "grammar",
    title: "Mixed Conditionals & Regret",
    prompt: "If I ___ harder at university, I ___ working in a different industry today.",
    options: ["had worked / would be", "worked / will be", "would work / am", "had worked / had been"],
    correctAnswer: "had worked / would be",
    explanation: "A mixed conditional pairs past condition (past perfect) with present result (would + base verb).",
    focusArea: "Mixed conditionals (past condition, present outcome)",
  },
  {
    id: "b2-read-01",
    cefr: "B2",
    skill: "reading",
    title: "Academic Analysis",
    contextText: "The rapid adoption of remote work infrastructure has not merely altered daily commuting patterns; it has fundamentally reorganized urban commercial real estate demand and talent retention strategies.",
    prompt: "According to the author, remote work has:",
    options: [
      "Had broad impacts beyond transportation, affecting real estate and talent.",
      "Only reduced traffic congestion in metropolitan centers.",
      "Lowered employee productivity across most commercial sectors.",
      "Made real estate investment in cities unnecessary.",
    ],
    correctAnswer: "Had broad impacts beyond transportation, affecting real estate and talent.",
    explanation: "'Not merely altered... but fundamentally reorganized...' expresses a multi-dimensional impact.",
    focusArea: "Synthesizing complex argumentation and discourse markers",
  },

  // C1 Items
  {
    id: "c1-gram-01",
    cefr: "C1",
    skill: "grammar",
    title: "Inversion for Emphasis",
    prompt: "Rarely ___ such unanimous consensus among diverse stakeholders during policy negotiations.",
    options: ["have we witnessed", "we have witnessed", "we witnessed", "had witnessed we"],
    correctAnswer: "have we witnessed",
    explanation: "Negative and restrictive adverbs (rarely, seldom, scarcely) trigger subject-auxiliary inversion when placed at the beginning of a clause.",
    focusArea: "Negative inversion and sophisticated rhetorical style",
  },
  {
    id: "c1-voc-01",
    cefr: "C1",
    skill: "vocabulary",
    title: "Nuanced Register & Idiomatic Precision",
    prompt: "The CEO decided to ___ the issue during the press conference rather than addressing it head-on.",
    options: ["skirt around", "run across", "make up", "break down"],
    correctAnswer: "skirt around",
    explanation: "'To skirt around an issue' means to deliberately avoid discussing or dealing with it directly.",
    focusArea: "Nuanced phrasal verbs and figurative register",
  },
];

export class PlacementAssessmentService {
  /**
   * Returns initial screening probe set representing baseline A1-B1 competencies.
   */
  static getInitialProbes(): PlacementProbeItem[] {
    return PLACEMENT_ITEM_BANK.filter((item) => item.cefr === "A1" || item.cefr === "A2");
  }

  /**
   * Evaluates answers and determines the next adaptive probe items or completion.
   */
  static getAdaptiveNextProbes(currentAnswers: Record<string, string>): {
    completed: boolean;
    nextItems: PlacementProbeItem[];
    currentPerformanceLevel: CefrLevel;
  } {
    const answeredItems = PLACEMENT_ITEM_BANK.filter((item) => currentAnswers[item.id] !== undefined);
    if (answeredItems.length === 0) {
      return {
        completed: false,
        nextItems: this.getInitialProbes(),
        currentPerformanceLevel: "A1",
      };
    }

    const correctCount = answeredItems.filter(
      (item) => currentAnswers[item.id]?.trim().toLowerCase() === item.correctAnswer.toLowerCase()
    ).length;
    const accuracy = correctCount / answeredItems.length;

    const hasBItems = answeredItems.some((item) => item.cefr === "B1" || item.cefr === "B2");
    const hasCItems = answeredItems.some((item) => item.cefr === "C1");

    // If learner performed well on A1/A2 (>= 75%) and hasn't seen B1/B2, serve B1/B2
    if (!hasBItems && accuracy >= 0.75) {
      const bItems = PLACEMENT_ITEM_BANK.filter((item) => item.cefr === "B1" || item.cefr === "B2");
      return {
        completed: false,
        nextItems: bItems,
        currentPerformanceLevel: "B1",
      };
    }

    // If learner performed well on B1/B2 (>= 75%) and hasn't seen C1, serve C1
    if (hasBItems && !hasCItems && accuracy >= 0.8) {
      const cItems = PLACEMENT_ITEM_BANK.filter((item) => item.cefr === "C1");
      return {
        completed: false,
        nextItems: cItems,
        currentPerformanceLevel: "B2",
      };
    }

    // Sufficient diagnostic evidence collected
    return {
      completed: true,
      nextItems: [],
      currentPerformanceLevel: accuracy >= 0.85 ? "B2" : accuracy >= 0.65 ? "A2" : "A1",
    };
  }

  /**
   * Finalizes placement assessment, calculates multi-skill breakdown,
   * updates the Learner Model via Core, and persists trusted evidence.
   */
  static async finalizePlacement(input: {
    actorId: string;
    email: string | null;
    goal?: string;
    answers: Record<string, string>;
  }): Promise<PlacementDiagnosticResult> {
    const answeredItems = PLACEMENT_ITEM_BANK.filter((item) => input.answers[item.id] !== undefined);
    const totalAnswered = Math.max(1, answeredItems.length);

    let correctTotal = 0;
    const skillStats: Record<PlacementSkill, { correct: number; total: number }> = {
      listening: { correct: 0, total: 0 },
      grammar: { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      phonetics: { correct: 0, total: 0 },
    };

    const failedFocusAreas: string[] = [];

    for (const item of answeredItems) {
      const isCorrect = input.answers[item.id]?.trim().toLowerCase() === item.correctAnswer.toLowerCase();
      skillStats[item.skill].total += 1;
      if (isCorrect) {
        correctTotal += 1;
        skillStats[item.skill].correct += 1;
      } else {
        failedFocusAreas.push(item.focusArea);
      }
    }

    const overallScorePercent = Math.round((correctTotal / totalAnswered) * 100);

    // Calculate level per skill
    function calculateSkillLevel(correct: number, total: number): CefrLevel {
      if (total === 0) return "A1";
      const ratio = correct / total;
      if (ratio >= 0.9) return "B2";
      if (ratio >= 0.75) return "B1";
      if (ratio >= 0.5) return "A2";
      return "A1";
    }

    // Overall CEFR determination
    let estimatedLevel: CefrLevel = "A1";
    let recommendedCourseId = A1_PRODUCTION_COURSE_ID;
    let recommendedLessonId = "a1-introduce-yourself";
    let recommendedStartingPoint = "English A1 Foundations — Lesson 1 (Meet & Greet)";
    let rationale = "Recommended entry at A1 Foundations to build communicative confidence and clean pronunciation habits.";

    if (overallScorePercent >= 88 && answeredItems.some((i) => i.cefr === "C1")) {
      estimatedLevel = "C1";
      recommendedCourseId = "english-c1-advanced-fluency";
      recommendedLessonId = "c1-m1-lesson-1";
      recommendedStartingPoint = "English C1 Advanced & Academic Fluency — Module 1";
      rationale = "High command across discourse, nuance, and structural control. Recommended placement in doctoral-level advanced modules.";
    } else if (overallScorePercent >= 80 && answeredItems.some((i) => i.cefr === "B1" || i.cefr === "B2")) {
      estimatedLevel = "B2";
      recommendedCourseId = "english-b2-fluency-communication";
      recommendedLessonId = "b2-m1-lesson-1";
      recommendedStartingPoint = "English B2 Fluency & Professional Communication — Module 1";
      rationale = "Strong mastery of complex syntax and connected speech. Recommended placement in upper-intermediate fluency practice.";
    } else if (overallScorePercent >= 65 && answeredItems.some((i) => i.cefr === "B1")) {
      estimatedLevel = "B1";
      recommendedCourseId = "english-b1-independent-speaker";
      recommendedLessonId = "b1-m1-lesson-1";
      recommendedStartingPoint = "English B1 Intermediate Track — Module 1";
      rationale = "Solid foundational grammar and listening comprehension. Ready for independent communication and varied registers.";
    } else if (overallScorePercent >= 50) {
      estimatedLevel = "A2";
      recommendedCourseId = "english-a2-everyday-conversations";
      recommendedLessonId = "a2-make-a-plan";
      recommendedStartingPoint = "English A2 Everyday Conversations — Module 1";
      rationale = "Demonstrated control of basic greetings and simple past forms. Ready for everyday conversational scenarios.";
    }

    const priorityReinforcements = Array.from(new Set(failedFocusAreas)).slice(0, 4);
    if (priorityReinforcements.length === 0) {
      priorityReinforcements.push("Spoken fluency refinement", "Connected speech & rhythm");
    }

    const skillBreakdown: Record<PlacementSkill, { score: number; maxScore: number; level: CefrLevel }> = {
      listening: {
        score: skillStats.listening.correct,
        maxScore: skillStats.listening.total,
        level: calculateSkillLevel(skillStats.listening.correct, skillStats.listening.total),
      },
      grammar: {
        score: skillStats.grammar.correct,
        maxScore: skillStats.grammar.total,
        level: calculateSkillLevel(skillStats.grammar.correct, skillStats.grammar.total),
      },
      vocabulary: {
        score: skillStats.vocabulary.correct,
        maxScore: skillStats.vocabulary.total,
        level: calculateSkillLevel(skillStats.vocabulary.correct, skillStats.vocabulary.total),
      },
      reading: {
        score: skillStats.reading.correct,
        maxScore: skillStats.reading.total,
        level: calculateSkillLevel(skillStats.reading.correct, skillStats.reading.total),
      },
      phonetics: {
        score: skillStats.phonetics.correct,
        maxScore: skillStats.phonetics.total,
        level: calculateSkillLevel(skillStats.phonetics.correct, skillStats.phonetics.total),
      },
    };

    const confidence: "low" | "medium" | "high" =
      totalAnswered >= 10 ? "high" : totalAnswered >= 5 ? "medium" : "low";

    // Save trusted placement evidence record into Core
    const db = getServerFirestore();
    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    const now = new Date().toISOString();
    const placementEvidenceId = `evidence-placement-${input.actorId}-${Date.now()}`;

    await Promise.all([
      db.collection("learners").doc(input.actorId).set(
        {
          learnerId: input.actorId,
          email: input.email,
          placement: {
            estimatedLevel,
            confidence,
            overallScorePercent,
            skillBreakdown,
            priorityReinforcements,
            recommendedCourseId,
            recommendedLessonId,
            completedAt: now,
          },
          onboarding: {
            path: "adaptive-placement",
            completedAt: now,
            recommendation: `${estimatedLevel} Diagnostic Placement`,
            recommendedCourseId,
            confidence,
          },
          updatedAt: now,
        },
        { merge: true }
      ),
      evidenceRepository.append({
        contractVersion: "1",
        id: placementEvidenceId,
        learnerId: input.actorId,
        organizationId: ORGANIZATION_ID,
        source: {
          product: "learn",
          courseId: recommendedCourseId,
          lessonId: recommendedLessonId,
          activityId: "adaptive-placement-test",
        },
        type: "assessment_result",
        observedAt: now,
        dataClassification: "sensitive",
        payload: {
          estimatedLevel,
          overallScorePercent,
          confidence,
          skillBreakdown,
          priorityReinforcements,
          itemsAnsweredCount: totalAnswered,
          scope: "adaptive_cefr_diagnostic",
        },
        provenance: {
          method: "system_observed",
          actorId: input.actorId,
          confidence: confidence === "high" ? 0.9 : 0.7,
        },
      }),
    ]);

    // Refresh Learner Model Mind intelligence
    try {
      await refreshLearnerIntelligence({
        learnerId: input.actorId,
        organizationId: ORGANIZATION_ID,
        requestedDomains: ["proficiency", "goal"],
      });
    } catch (mindError) {
      console.warn("Learner intelligence refresh after placement encountered a minor warning.", mindError);
    }

    return {
      estimatedLevel,
      confidence,
      recommendedCourseId,
      recommendedLessonId,
      recommendedStartingPoint,
      overallScorePercent,
      skillBreakdown,
      priorityReinforcements,
      rationale,
    };
  }
}

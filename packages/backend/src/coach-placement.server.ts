import type { CefrLevel } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";
import type { AuthenticatedActor } from "./course-platform.server";
import { A1_PRODUCTION_COURSE_ID, provisionA1ProductionCurriculum } from "./a1-production-curriculum.server";
import { ensureA2ProductionCurriculumInFirestore } from "./a2-production-curriculum.server";
import { ensureB1ProductionCurriculumInFirestore } from "./b1-production-curriculum.server";
import { ensureB2ProductionCurriculumInFirestore } from "./b2-production-curriculum.server";

export interface SpokenTaskEvaluationInput {
  taskIndex: number;
  targetLevel: CefrLevel;
  prompt: string;
  transcript: string;
  audioBase64?: string;
  durationMs?: number;
}

export interface CoachOralPlacementInput {
  actor: AuthenticatedActor;
  tasks: SpokenTaskEvaluationInput[];
}

export interface TaskDiagnosticScore {
  taskIndex: number;
  targetLevel: CefrLevel;
  intelligibilityScore: number; // 0 - 100
  passedBenchmark: boolean;
  detectedPatterns: string[];
  feedbackNotes: string;
}

export interface CoachOralPlacementResult {
  estimatedLevel: CefrLevel;
  overallIntelligibilityScore: number;
  confidence: "low" | "medium" | "high";
  taskScores: TaskDiagnosticScore[];
  detectedTransferPatterns: string[];
  recommendedCourseId: string;
  recommendedStartingFocus: string;
  priorityTargets: string[];
  feedback: string;
  evaluatedAt: string;
}

const ORGANIZATION_ID = "lurexa-self-paced";

/**
 * Evaluates individual spoken performance against CEFR task benchmarks.
 */
function evaluateTaskSpokenSample(task: SpokenTaskEvaluationInput): TaskDiagnosticScore {
  const text = (task.transcript || "").trim().toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const detectedPatterns: string[] = [];

  let score = 50; // baseline
  let feedbackNotes = "";

  if (words.length >= 3) {
    score += Math.min(25, words.length * 3);
  }

  // Task 1: A1 Benchmark (Self-introduction, location, weekday routine)
  if (task.taskIndex === 0) {
    const hasIntro = /\b(name is|i am|i'm|my name|live in|from)\b/i.test(text);
    const hasRoutine = /\b(usually|every day|work|study|weekdays|morning|afternoon|night|always|often)\b/i.test(text);
    const hasEpenthesis = /\b(e|es)(student|special|speak|school|start|spanish|study)\b/i.test(text);

    if (hasEpenthesis) {
      detectedPatterns.push("Initial /s/ cluster epenthesis (e.g., 'eschool')");
      score -= 8;
    }
    if (hasIntro) score += 15;
    if (hasRoutine) score += 10;

    const passed = score >= 65;
    feedbackNotes = passed
      ? "Demonstrated clear foundational self-identification and basic communicative fluency."
      : "Basic introductory sentence patterns are emerging. Practice direct /s/ clusters and present tense clarity.";

    return {
      taskIndex: 0,
      targetLevel: "A1",
      intelligibilityScore: Math.min(98, Math.max(30, Math.round(score))),
      passedBenchmark: passed,
      detectedPatterns,
      feedbackNotes,
    };
  }

  // Task 2: A2 Benchmark (Past narrative, regular/irregular past forms, -ed realization)
  if (task.taskIndex === 1) {
    const hasPastKeywords = /\b(went|visited|was|were|enjoyed|liked|travelled|traveled|stayed|saw|had|walked|ate|bought)\b/i.test(text);
    const hasUninflectedPast = /\b(yesterday|last|in the past)\b/i.test(text) && /\b(visit|go|stay|like|enjoy|walk)\b/i.test(text) && !hasPastKeywords;
    const hasRegularEd = /\b(visited|enjoyed|liked|walked|played|stayed|decided)\b/i.test(text);

    if (hasUninflectedPast) {
      detectedPatterns.push("Uninflected past verb form omission (e.g., 'I visit yesterday')");
      score -= 12;
    }
    if (hasPastKeywords) score += 18;
    if (hasRegularEd) score += 10;

    const passed = score >= 70;
    feedbackNotes = passed
      ? "Controlled regular and irregular past tense narration with chronological progression."
      : "Narrative ideas are clear. Work on audible regular '-ed' endings (/t/, /d/, /ɪd/) and past verb forms.";

    return {
      taskIndex: 1,
      targetLevel: "A2",
      intelligibilityScore: Math.min(98, Math.max(30, Math.round(score))),
      passedBenchmark: passed,
      detectedPatterns,
      feedbackNotes,
    };
  }

  // Task 3: B1 Benchmark (Opinion justification, discourse markers, fluid rhythm)
  const hasOpinionMarkers = /\b(in my opinion|i believe|i think|in my view|because|reason|furthermore|for example|on the other hand|firstly)\b/i.test(text);
  const hasSubordinatingClauses = /\b(because|although|if|when|which|that|so that|in order to)\b/i.test(text);
  const hasGoodLength = words.length >= 12;

  if (hasOpinionMarkers) score += 16;
  if (hasSubordinatingClauses) score += 12;
  if (hasGoodLength) score += 10;

  const passed = score >= 72;
  feedbackNotes = passed
    ? "Natural communicative spontaneity with opinion justification and connected discourse markers."
    : "Expressive opinion communication. Practice connecting clauses with discourse markers and fluent rhythm.";

  return {
    taskIndex: 2,
    targetLevel: "B1",
    intelligibilityScore: Math.min(98, Math.max(30, Math.round(score))),
    passedBenchmark: passed,
    detectedPatterns,
    feedbackNotes,
  };
}

export class CoachPlacementService {
  /**
   * Evaluates oral placement tasks, calculates consistent CEFR benchmark and intelligibility score,
   * persists placement evidence in Lurexa Core, and refreshes the single universal Learner Model.
   */
  public static async evaluateOralPlacement(input: CoachOralPlacementInput): Promise<CoachOralPlacementResult> {
    const { actor, tasks } = input;
    const now = new Date().toISOString();

    const taskScores: TaskDiagnosticScore[] = tasks.map((task) => evaluateTaskSpokenSample(task));

    // Calculate overall average intelligibility
    const totalIntelligibility = taskScores.reduce((acc, curr) => acc + curr.intelligibilityScore, 0);
    const overallIntelligibilityScore = taskScores.length > 0
      ? Math.round(totalIntelligibility / taskScores.length)
      : 70;

    // Collect all detected transfer patterns
    const allTransferPatterns = Array.from(
      new Set(taskScores.flatMap((t) => t.detectedPatterns))
    );

    // Determine CEFR level based on sequential benchmark criteria
    const passedA1 = taskScores.find((t) => t.taskIndex === 0)?.passedBenchmark ?? false;
    const passedA2 = taskScores.find((t) => t.taskIndex === 1)?.passedBenchmark ?? false;
    const passedB1 = taskScores.find((t) => t.taskIndex === 2)?.passedBenchmark ?? false;

    let estimatedLevel: CefrLevel = "A1";
    let recommendedCourseId = A1_PRODUCTION_COURSE_ID;
    let recommendedStartingFocus = "A1 Foundations — Spoken Introductions & Present Tense Clarity";
    let priorityTargets = [
      "Initial /s/ cluster stability (without /e/ epenthesis)",
      "Basic sentence structure and formulaic greetings",
    ];
    let feedback =
      "You have good communicative willingness! We recommend starting at A1 Foundations to build clean pronunciation habits and vocal confidence.";

    if (passedA1 && passedA2 && passedB1 && overallIntelligibilityScore >= 82) {
      estimatedLevel = "B2";
      recommendedCourseId = "english-b2-fluency-communication";
      recommendedStartingFocus = "B2 Spoken Fluency — Nuanced Discourse & Natural Cadence";
      priorityTargets = [
        "Advanced connected speech linking",
        "Idiomatic discourse flow and intonation control",
      ];
      feedback =
        "Exceptional oral fluency and communicative confidence! You demonstrated strong control of past narration, complex opinions, and natural discourse rhythm.";
    } else if (passedA1 && passedA2 && (passedB1 || overallIntelligibilityScore >= 74)) {
      estimatedLevel = "B1";
      recommendedCourseId = "english-b1-independent-speaker";
      recommendedStartingFocus = "B1 Intermediate Track — Opinion Articulation & Connected Speech";
      priorityTargets = [
        "Opinion discourse markers ('In my view', 'Furthermore')",
        "Connected speech and rhythm linking",
      ];
      feedback =
        "Strong communicative ability! You easily navigate foundational exchanges and past narratives. Your primary focus is refining connected speech and opinion structuring.";
    } else if (passedA1 && (passedA2 || overallIntelligibilityScore >= 62)) {
      estimatedLevel = "A2";
      recommendedCourseId = "english-a2-everyday-conversations";
      recommendedStartingFocus = "A2 Everyday Conversations — Past Narratives & -ed Endings";
      priorityTargets = [
        "Regular past tense -ed realization (/t/, /d/, /ɪd/)",
        "Chronological narrative flow and question formation",
      ];
      feedback =
        "Great communicative spontaneity! You demonstrate clear foundational sentence control with emerging regular past tense awareness. Recommended focus: past -ed endings and connected speech.";
    }

    const confidence: "low" | "medium" | "high" =
      tasks.length >= 3 ? "high" : tasks.length >= 2 ? "medium" : "low";

    const result: CoachOralPlacementResult = {
      estimatedLevel,
      overallIntelligibilityScore,
      confidence,
      taskScores,
      detectedTransferPatterns: allTransferPatterns,
      recommendedCourseId,
      recommendedStartingFocus,
      priorityTargets,
      feedback,
      evaluatedAt: now,
    };

    // Persist trusted placement evidence and updated profile in Core
    const db = getServerFirestore();
    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    const placementEvidenceId = `evidence-coach-placement-${actor.uid}-${Date.now()}`;

    // Provision curriculum if needed
    try {
      if (estimatedLevel === "A1") {
        await provisionA1ProductionCurriculum();
      } else if (estimatedLevel === "A2") {
        await ensureA2ProductionCurriculumInFirestore();
      } else if (estimatedLevel === "B1") {
        await ensureB1ProductionCurriculumInFirestore();
      } else if (estimatedLevel === "B2") {
        await ensureB2ProductionCurriculumInFirestore();
      }
    } catch (provisionErr) {
      console.warn("Curriculum provisioning warning during coach placement:", provisionErr);
    }

    const organizationReference = db.collection("organizations").doc(ORGANIZATION_ID);
    const membershipReference = organizationReference.collection("members").doc(actor.uid);
    const userMembershipReference = db.collection("user-memberships").doc(actor.uid).collection("organizations").doc(ORGANIZATION_ID);

    await Promise.all([
      organizationReference.set(
        {
          id: ORGANIZATION_ID,
          name: "Lurexa Self-Paced Learning",
          slug: "lurexa-self-paced",
          ownerId: "lurexa-system",
          plan: "platform",
          updatedAt: now,
        },
        { merge: true }
      ),
      membershipReference.set(
        {
          userId: actor.uid,
          orgId: ORGANIZATION_ID,
          role: "student",
          joinedAt: now,
          source: "coach-oral-placement",
        },
        { merge: true }
      ),
      userMembershipReference.set(
        {
          userId: actor.uid,
          orgId: ORGANIZATION_ID,
          role: "student",
          joinedAt: now,
          source: "coach-oral-placement",
        },
        { merge: true }
      ),
      db.collection("learners").doc(actor.uid).set(
        {
          learnerId: actor.uid,
          email: actor.email,
          proficiency: {
            cefr: estimatedLevel,
            confidence,
            intelligibilityScore: overallIntelligibilityScore,
            updatedAt: now,
          },
          placement: {
            estimatedLevel,
            confidence,
            overallScorePercent: overallIntelligibilityScore,
            priorityReinforcements: priorityTargets,
            recommendedCourseId,
            completedAt: now,
            type: "coach_oral_diagnostic",
          },
          oralPlacement: {
            estimatedLevel,
            overallIntelligibilityScore,
            confidence,
            taskScores,
            detectedTransferPatterns: allTransferPatterns,
            evaluatedAt: now,
          },
          onboarding: {
            path: "coach-oral-diagnostic",
            completedAt: now,
            recommendation: `${estimatedLevel} Oral Diagnostic`,
            recommendedCourseId,
            confidence,
          },
          updatedAt: now,
        },
        { merge: true }
      ),
      db.collection("learner-profiles").doc(actor.uid).set(
        {
          learnerId: actor.uid,
          email: actor.email,
          goals: ["speaking_fluency", "pronunciation_clarity"],
          proficiency: {
            cefr: estimatedLevel,
            confidence,
            intelligibilityScore: overallIntelligibilityScore,
            updatedAt: now,
          },
          onboarding: {
            path: "coach-oral-diagnostic",
            completedAt: now,
            recommendation: `${estimatedLevel} Speaking Placement`,
            recommendedCourseId,
            confidence,
          },
          activeTargets: {
            pronunciation: priorityTargets,
            fluency: [recommendedStartingFocus],
          },
          updatedAt: now,
        },
        { merge: true }
      ),
      evidenceRepository.append({
        contractVersion: "1",
        id: placementEvidenceId,
        learnerId: actor.uid,
        organizationId: ORGANIZATION_ID,
        source: {
          product: "coach",
          courseId: recommendedCourseId,
          activityId: "coach-oral-diagnostic-placement",
        },
        type: "assessment_result",
        observedAt: now,
        dataClassification: "sensitive",
        payload: {
          estimatedLevel,
          overallIntelligibilityScore,
          confidence,
          taskScores,
          detectedTransferPatterns: allTransferPatterns,
          scope: "oral_diagnostic_speaking_test",
        },
        provenance: {
          method: "system_observed",
          actorId: actor.uid,
          confidence: confidence === "high" ? 0.92 : 0.75,
        },
      }),
    ]);

    // Refresh Learner Model Mind intelligence asynchronously
    try {
      await refreshLearnerIntelligence({
        learnerId: actor.uid,
        organizationId: ORGANIZATION_ID,
        requestedDomains: ["proficiency", "pronunciation", "fluency", "recommendation"],
      });
    } catch (mindError) {
      console.warn("Learner intelligence refresh after coach placement encountered a minor warning.", mindError);
    }

    return result;
  }
}

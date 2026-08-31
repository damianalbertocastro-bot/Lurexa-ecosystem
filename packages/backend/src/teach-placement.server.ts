import type {
  EducatorProfile,
  TeachCefrLevel,
  TeachSpokenTaskInput,
  TeachTaskEvaluationScore,
  TeachOralPlacementResult,
} from "@lurexa/types";
import { type AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";
import { evaluateTeachCredential } from "./teach-credential";
import { TEACH_MVP_CREDENTIALS } from "./teach-catalog";

export type {
  TeachSpokenTaskInput,
  TeachTaskEvaluationScore,
  TeachOralPlacementResult,
};

const TEACH_DIAGNOSTIC_TASKS = [
  {
    level: "B1" as TeachCefrLevel,
    prompt:
      "Explain the instructions for a 5-minute pair-work speaking activity to your students. Include the goal, student roles, and time limit.",
    expectedKeywords: ["pair", "partner", "minutes", "talk", "ask", "answer", "role", "first", "then", "start"],
  },
  {
    level: "B2" as TeachCefrLevel,
    prompt:
      "A student says: 'Yesterday I go to the beach and I see many people.' How do you provide a supportive, constructive oral recast without discouraging them?",
    expectedKeywords: [
      "went",
      "saw",
      "beach",
      "yesterday",
      "past",
      "recast",
      "notice",
      "great",
      "repeat",
      "sounds",
    ],
  },
  {
    level: "C1" as TeachCefrLevel,
    prompt:
      "Discuss why prioritizing communicative intelligibility over native-like accent erasure is essential for language learners, particularly Dominican Spanish speakers.",
    expectedKeywords: [
      "intelligibility",
      "accent",
      "communication",
      "identity",
      "confidence",
      "transfer",
      "phonology",
      "perspective",
      "furthermore",
      "pedagogical",
    ],
  },
];

export const TeachPlacementService = {
  async evaluateSpokenDiagnostic(input: {
    actor: AuthenticatedActor;
    tasks: TeachSpokenTaskInput[];
  }): Promise<TeachOralPlacementResult> {
    const evaluatedAt = new Date().toISOString();
    const taskScores: TeachTaskEvaluationScore[] = [];
    let totalScore = 0;
    const allStrengths: string[] = [];

    input.tasks.forEach((task, idx) => {
      const benchmark = TEACH_DIAGNOSTIC_TASKS[idx] || TEACH_DIAGNOSTIC_TASKS[0]!;
      const transcript = (task.transcript || "").toLowerCase().trim();
      const words = transcript.split(/\s+/).filter(Boolean);

      let matchedKeywords = 0;
      for (const kw of benchmark.expectedKeywords) {
        if (transcript.includes(kw.toLowerCase())) {
          matchedKeywords++;
        }
      }

      const matchRatio = matchedKeywords / Math.max(4, benchmark.expectedKeywords.length);
      const fluencyLengthBonus = Math.min(30, Math.round(words.length * 1.5));
      const rawScore = Math.round(matchRatio * 60 + fluencyLengthBonus + 10);

      // Clamp task score
      const intelligibilityScore = Math.max(45, Math.min(98, transcript ? rawScore : 78));
      const passedBenchmark = intelligibilityScore >= 70;
      totalScore += intelligibilityScore;

      const strengths: string[] = [];
      if (idx === 0) {
        if (transcript.includes("first") || transcript.includes("then") || transcript.includes("minute")) {
          strengths.push("Clear instructional staging & boundary setting");
        }
      } else if (idx === 1) {
        if (transcript.includes("went") || transcript.includes("saw")) {
          strengths.push("Accurate constructive recasting");
        }
      } else if (idx === 2) {
        if (transcript.includes("intelligibility") || transcript.includes("confidence")) {
          strengths.push("Principled communicative pedagogy & identity awareness");
        }
      }

      if (strengths.length > 0) {
        allStrengths.push(...strengths);
      }

      taskScores.push({
        taskIndex: idx,
        targetLevel: benchmark.level,
        intelligibilityScore,
        passedBenchmark,
        pedagogicalStrengths: strengths,
        feedbackNotes: passedBenchmark
          ? `Demonstrated confident ${benchmark.level} instructional discourse control.`
          : `Emerging ${benchmark.level} pedagogical language control. Focus on discourse markers and precise feedback framing.`,
      });
    });

    const overallIntelligibilityScore = Math.round(
      totalScore / Math.max(1, input.tasks.length)
    );

    // Determine CEFR Benchmark Level
    let estimatedLevel: TeachCefrLevel = "B1";
    if (taskScores[0]?.passedBenchmark && taskScores[1]?.passedBenchmark && taskScores[2]?.passedBenchmark && overallIntelligibilityScore >= 85) {
      estimatedLevel = "C1";
    } else if (taskScores[0]?.passedBenchmark && (taskScores[1]?.passedBenchmark || overallIntelligibilityScore >= 75)) {
      estimatedLevel = "B2";
    } else if (taskScores[0]?.passedBenchmark || overallIntelligibilityScore >= 65) {
      estimatedLevel = "B1";
    } else {
      estimatedLevel = "A2";
    }

    const confidence: "low" | "medium" | "high" =
      input.tasks.length >= 3 ? "high" : "medium";

    let feedback = "";
    let recommendedGrowthFocus = "";

    if (estimatedLevel === "C1") {
      feedback = "Outstanding instructional fluency, nuanced pedagogical rationale, and high spoken clarity. Your classroom discourse provides rich communicative models for learners.";
      recommendedGrowthFocus = "T3 Proficient Educator · AI Differentiation & Curriculum Leadership";
    } else if (estimatedLevel === "B2") {
      feedback = "Solid professional English control with clear instructional framing and supportive corrective recasting. Ready for advanced pedagogical discourse.";
      recommendedGrowthFocus = "T2 Practitioner · Pronunciation Pedagogy & Formative Assessment";
    } else {
      feedback = "Good foundational instructional English. Focus on structuring classroom instructions and expanding spontaneous formative feedback language.";
      recommendedGrowthFocus = "T1 Foundation · The First Coherent Lesson & Classroom English";
    }

    // Persist verified educator state into Lurexa Core
    const db = getServerFirestore();
    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    const evidenceId = `teach-diagnostic-${input.actor.uid}-${Date.now()}`;

    const verifiedCompetencies = [
      { id: "speaking-instruction", name: "Speaking instruction", level: estimatedLevel === "C1" ? 4 : 3 },
      { id: "pronunciation-pedagogy", name: "Pronunciation pedagogy", level: estimatedLevel === "C1" ? 4 : 3 },
    ];

    await Promise.all([
      // Update teach-profiles
      db.collection("teach-profiles").doc(input.actor.uid).set(
        {
          userId: input.actor.uid,
          cefrLevel: estimatedLevel,
          verifiedCefrLevel: estimatedLevel,
          verifiedCompetencies,
          verifiedAt: evaluatedAt,
          diagnosticPlacement: {
            estimatedLevel,
            overallIntelligibilityScore,
            confidence,
            evaluatedAt,
          },
          updatedAt: evaluatedAt,
        },
        { merge: true }
      ),
      // Update learner-profiles for universal ecosystem consistency
      db.collection("learner-profiles").doc(input.actor.uid).set(
        {
          learnerId: input.actor.uid,
          email: input.actor.email,
          proficiency: {
            cefr: estimatedLevel,
            confidence,
            overallScorePercent: overallIntelligibilityScore,
            updatedAt: evaluatedAt,
          },
          updatedAt: evaluatedAt,
        },
        { merge: true }
      ),
      // Save trusted evidence event
      evidenceRepository.append({
        contractVersion: "1",
        id: evidenceId,
        learnerId: input.actor.uid,
        organizationId: "lurexa-self-paced",
        source: {
          product: "teach",
          activityId: "teach-spoken-diagnostic",
        },
        type: "assessment_result",
        observedAt: evaluatedAt,
        dataClassification: "sensitive",
        payload: {
          event: "teach_diagnostic.evaluated",
          estimatedLevel,
          overallIntelligibilityScore,
          confidence,
          taskScores,
          pedagogicalStrengths: allStrengths,
        },
        provenance: {
          method: "system_observed",
          actorId: input.actor.uid,
          confidence: 0.9,
        },
      }),
    ]);

    // Reconcile awarded credentials (T1–T5)
    let awardedCredentialsCount = 0;
    try {
      const profileData = (await db.collection("teach-profiles").doc(input.actor.uid).get()).data();
      const educatorProfile = profileData ? ({ ...profileData, userId: input.actor.uid } as unknown as EducatorProfile) : null;
      for (const cred of TEACH_MVP_CREDENTIALS) {
        const credEval = evaluateTeachCredential(cred, educatorProfile, [], []);
        if (credEval.eligible) {
          awardedCredentialsCount++;
          await db.collection("teachCredentialAwards").doc(`${input.actor.uid}_${cred.id}`).set(
            {
              userId: input.actor.uid,
              credentialId: cred.id,
              status: "awarded",
              awardedAt: evaluatedAt,
              verificationCode: `LX-TEACH-${cred.id.toUpperCase()}-${input.actor.uid.slice(0, 6)}`,
            },
            { merge: true }
          );
        }
      }
    } catch (credErr) {
      console.warn("Credential reconciliation after teach diagnostic:", credErr);
    }

    // Refresh Lurexa Mind educator intelligence
    try {
      await refreshLearnerIntelligence({
        learnerId: input.actor.uid,
        organizationId: "lurexa-self-paced",
        requestedDomains: ["proficiency", "goal"],
      });
    } catch (mindErr) {
      console.warn("Mind refresh after teach diagnostic:", mindErr);
    }

    return {
      estimatedLevel,
      overallIntelligibilityScore,
      confidence,
      taskScores,
      pedagogicalStrengths: Array.from(new Set(allStrengths)),
      recommendedGrowthFocus,
      awardedCredentialsCount,
      feedback,
      evaluatedAt,
    };
  },
};

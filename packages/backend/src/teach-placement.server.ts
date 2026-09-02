import type {
  EducatorProfile,
  TeachCefrLevel,
  TeachCourse,
  TeachSpokenTaskInput,
  TeachTaskEvaluationScore,
  TeachOralPlacementResult,
} from "@lurexa/types";
import { type AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";
import { evaluateTeachCredential } from "./teach-credential";
import { TEACH_MVP_COURSES, TEACH_MVP_CREDENTIALS } from "./teach-catalog";

export type {
  TeachSpokenTaskInput,
  TeachTaskEvaluationScore,
  TeachOralPlacementResult,
};

export const TEACH_DIAGNOSTIC_TASKS = [
  {
    level: "B1" as TeachCefrLevel,
    title: "Task 1: Classroom Instructions & Staging",
    capability: "instructional_language",
    prompt:
      "Explain the instructions for a 5-minute pair-work speaking activity to your students aloud. Include the goal, student roles, and time limit clearly.",
    expectedKeywords: ["pair", "partner", "minutes", "talk", "ask", "answer", "role", "first", "then", "start"],
  },
  {
    level: "B2" as TeachCefrLevel,
    title: "Task 2: Formative Feedback & Error Recasting",
    capability: "formative_recasting",
    prompt:
      "A student says: 'Yesterday I go to the beach and I see many people.' How do you provide a supportive, constructive oral recast without discouraging their participation?",
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
    title: "Task 3: Intelligibility & L1 Transfer Pedagogy",
    capability: "pronunciation_pedagogy",
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
  {
    level: "B2" as TeachCefrLevel,
    title: "Task 4: AI & Digital Lesson Scaffolding",
    capability: "ai_digital_literacy",
    prompt:
      "Explain how you evaluate and adapt an AI-generated reading dialogue before giving it to your students to ensure appropriate cognitive and vocabulary load.",
    expectedKeywords: [
      "evaluate",
      "adapt",
      "vocabulary",
      "level",
      "scaffold",
      "accuracy",
      "prompt",
      "students",
      "comprehension",
      "check",
    ],
  },
  {
    level: "C1" as TeachCefrLevel,
    title: "Task 5: Interactive Task Design & Student Talk Time",
    capability: "task_design",
    prompt:
      "Describe how you design a communicative task that maximizes meaningful student-to-student interaction while minimizing unnecessary teacher talk time.",
    expectedKeywords: [
      "interaction",
      "student",
      "talk",
      "time",
      "meaningful",
      "scaffold",
      "pairs",
      "groups",
      "feedback",
      "objective",
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
          strengths.push("Accurate constructive recasting & supportive correction");
        }
      } else if (idx === 2) {
        if (transcript.includes("intelligibility") || transcript.includes("confidence") || transcript.includes("identity")) {
          strengths.push("Principled communicative pedagogy & identity awareness");
        }
      } else if (idx === 3) {
        if (transcript.includes("evaluate") || transcript.includes("scaffold") || transcript.includes("level")) {
          strengths.push("Critical AI literacy & pedagogical curation");
        }
      } else if (idx === 4) {
        if (transcript.includes("interaction") || transcript.includes("student") || transcript.includes("talk")) {
          strengths.push("High-engagement communicative task structuring");
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
    const passedCount = taskScores.filter((t) => t.passedBenchmark).length;
    let estimatedLevel: TeachCefrLevel = "B1";
    if (passedCount === 5 && overallIntelligibilityScore >= 92) {
      estimatedLevel = "C2";
    } else if (passedCount >= 4 && overallIntelligibilityScore >= 82) {
      estimatedLevel = "C1";
    } else if (passedCount >= 2 && overallIntelligibilityScore >= 72) {
      estimatedLevel = "B2";
    } else if (passedCount >= 1 || overallIntelligibilityScore >= 60) {
      estimatedLevel = "B1";
    } else {
      estimatedLevel = "A2";
    }

    const confidence: "low" | "medium" | "high" =
      input.tasks.length >= 4 ? "high" : "medium";

    let feedback = "";
    let recommendedGrowthFocus = "";

    if (estimatedLevel === "C1" || estimatedLevel === "C2") {
      feedback = "Outstanding instructional fluency, nuanced pedagogical rationale, and high spoken clarity. Your classroom discourse provides rich communicative models for learners.";
      recommendedGrowthFocus = "T3 Proficient Educator · AI Differentiation & Curriculum Leadership";
    } else if (estimatedLevel === "B2") {
      feedback = "Solid professional English control with clear instructional framing and supportive corrective recasting. Ready for advanced pedagogical discourse.";
      recommendedGrowthFocus = "T2 Practitioner · Pronunciation Pedagogy & Formative Assessment";
    } else {
      feedback = "Good foundational instructional English. Focus on structuring classroom instructions and expanding spontaneous formative feedback language.";
      recommendedGrowthFocus = "T1 Foundation · The First Coherent Lesson & Classroom English";
    }

    // -------------------------------------------------------------
    // Automated Course Assignment & Enrollment by Level
    // -------------------------------------------------------------
    const assignedCourseIds: string[] = [];
    if (estimatedLevel === "C1" || estimatedLevel === "C2") {
      assignedCourseIds.push(
        "english-educators-b2-c1",
        "designing-asynchronous-learning",
        "teaching-specialized-industry-english"
      );
    } else if (estimatedLevel === "B2") {
      assignedCourseIds.push(
        "english-educators-b2-c1",
        "assessment-supports-learning",
        "ai-literacy-language-teachers"
      );
    } else {
      assignedCourseIds.push(
        "teaching-speaking-confidence",
        "pronunciation-clearer-instruction"
      );
    }

    const assignedCourses: TeachCourse[] = TEACH_MVP_COURSES.filter((c) =>
      assignedCourseIds.includes(c.id)
    );

    // Persist verified educator state into Lurexa Core
    const db = getServerFirestore();
    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    const evidenceId = `teach-diagnostic-${input.actor.uid}-${Date.now()}`;

    const verifiedCompetencies = [
      { id: "speaking-instruction", name: "Speaking instruction", level: estimatedLevel === "C1" ? 4 : 3 },
      { id: "pronunciation-pedagogy", name: "Pronunciation pedagogy", level: estimatedLevel === "C1" ? 4 : 3 },
      { id: "formative-assessment", name: "Formative feedback", level: estimatedLevel === "C1" ? 4 : 3 },
      { id: "ai-literacy", name: "AI literacy for teachers", level: estimatedLevel === "C1" ? 4 : 2 },
    ];

    await Promise.all([
      // Update educatorProfiles
      db.collection("educatorProfiles").doc(input.actor.uid).set(
        {
          userId: input.actor.uid,
          cefrLevel: estimatedLevel,
          verifiedCefrLevel: estimatedLevel,
          verifiedCompetencies,
          status: "approved",
          diagnosticPlacement: {
            estimatedLevel,
            overallIntelligibilityScore,
            confidence,
            assignedCourseIds,
            evaluatedAt,
          },
          updatedAt: evaluatedAt,
        },
        { merge: true }
      ),
      // Update teach-profiles
      db.collection("teach-profiles").doc(input.actor.uid).set(
        {
          userId: input.actor.uid,
          cefrLevel: estimatedLevel,
          verifiedCefrLevel: estimatedLevel,
          verifiedCompetencies,
          diagnosticPlacement: {
            estimatedLevel,
            overallIntelligibilityScore,
            confidence,
            assignedCourseIds,
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
          assignedCourseIds,
          pedagogicalStrengths: allStrengths,
        },
        provenance: {
          method: "system_observed",
          actorId: input.actor.uid,
          confidence: 0.9,
        },
      }),
      // Automatically enroll educator in assigned courses
      ...assignedCourseIds.map((courseId) =>
        db.collection("teachEnrollments").doc(`${input.actor.uid}_${courseId}`).set(
          {
            userId: input.actor.uid,
            courseId,
            progressPercent: 0,
            status: "active",
            enrolledAt: evaluatedAt,
            assignedViaPlacement: true,
            updatedAt: evaluatedAt,
          },
          { merge: true }
        )
      ),
    ]);

    // Reconcile awarded credentials (T1–T5)
    let awardedCredentialsCount = 0;
    try {
      const profileData = (await db.collection("educatorProfiles").doc(input.actor.uid).get()).data();
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
      assignedCourses,
      assignedCourseIds,
      feedback,
      evaluatedAt,
    };
  },
};

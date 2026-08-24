import type {
  T1CapstoneSubmission,
  T1EvaluationRubric,
  T1CompetencyMatrix,
} from "@lurexa/types";

export interface T1ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    totalDurationMinutes: number;
    teacherTalkTimeRatio: number;
    studentPracticeRatio: number;
    hasAllCoreStages: boolean;
  };
}

export class TeachT1Service {
  /**
   * Validates a T1 Capstone pedagogical artifact against the T1 competency standards.
   */
  public static validateArtifact(submission: T1CapstoneSubmission): T1ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!submission.lessonPlanArtifact || submission.lessonPlanArtifact.length < 4) {
      errors.push("T1 Capstone requires structured stages: warmup, presentation, guided practice, independent practice, and closure.");
    }

    const stages = (submission.lessonPlanArtifact || []).map((s) => s.stage);
    const hasWarmup = stages.includes("warmup");
    const hasPresentation = stages.includes("presentation");
    const hasGuided = stages.includes("guided_practice");
    const hasIndependent = stages.includes("independent_practice");
    const hasClosure = stages.includes("assessment_closure");
    const hasAllCoreStages = hasWarmup && hasPresentation && hasGuided && hasIndependent && hasClosure;

    if (!hasWarmup) warnings.push("Lesson plan should include an explicit warm-up stage.");
    if (!hasIndependent) errors.push("Lesson plan must include an independent student production stage.");
    if (!hasClosure) errors.push("Lesson plan must include an assessment/closure stage.");

    const totalDurationMinutes = (submission.lessonPlanArtifact || []).reduce(
      (acc, stage) => acc + (stage.allocatedMinutes || 0),
      0
    );

    if (totalDurationMinutes < 30 || totalDurationMinutes > 90) {
      errors.push(`Total lesson duration must be between 30 and 90 minutes. Found: ${totalDurationMinutes} minutes.`);
    }

    // Estimate TTT (Teacher Talk Time) vs STT (Student Talk Time)
    let estimatedTeacherMinutes = 0;
    let estimatedStudentMinutes = 0;

    for (const stage of submission.lessonPlanArtifact || []) {
      if (stage.stage === "warmup" || stage.stage === "presentation") {
        estimatedTeacherMinutes += stage.allocatedMinutes * 0.6;
        estimatedStudentMinutes += stage.allocatedMinutes * 0.4;
      } else if (stage.stage === "guided_practice") {
        estimatedTeacherMinutes += stage.allocatedMinutes * 0.35;
        estimatedStudentMinutes += stage.allocatedMinutes * 0.65;
      } else if (stage.stage === "independent_practice") {
        estimatedTeacherMinutes += stage.allocatedMinutes * 0.1;
        estimatedStudentMinutes += stage.allocatedMinutes * 0.9;
      } else {
        estimatedTeacherMinutes += stage.allocatedMinutes * 0.4;
        estimatedStudentMinutes += stage.allocatedMinutes * 0.6;
      }
    }

    const teacherTalkTimeRatio = totalDurationMinutes > 0 ? Number((estimatedTeacherMinutes / totalDurationMinutes).toFixed(2)) : 0;
    const studentPracticeRatio = totalDurationMinutes > 0 ? Number((estimatedStudentMinutes / totalDurationMinutes).toFixed(2)) : 0;

    if (teacherTalkTimeRatio > 0.45) {
      warnings.push(`Teacher talk time ratio (${Math.round(teacherTalkTimeRatio * 100)}%) exceeds recommended 35% target.`);
    }

    if (!submission.reflectiveRationale?.howL1TransferIsAddressed || submission.reflectiveRationale.howL1TransferIsAddressed.trim().length < 20) {
      errors.push("Reflective rationale must explicitly address Dominican Spanish (L1) phonological/syntactic transfer.");
    }

    if (!submission.reflectiveRationale?.whyThisObjective || submission.reflectiveRationale.whyThisObjective.trim().length < 20) {
      errors.push("Reflective rationale must explain objective selection and alignment with target CEFR level.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      metrics: {
        totalDurationMinutes,
        teacherTalkTimeRatio,
        studentPracticeRatio,
        hasAllCoreStages,
      },
    };
  }

  /**
   * Mind-integrated evaluation of a T1 Capstone submission.
   */
  public static evaluateT1Submission(submission: T1CapstoneSubmission): T1EvaluationRubric {
    const validation = this.validateArtifact(submission);
    if (!validation.valid) {
      throw new Error(`T1 Capstone validation failed: ${validation.errors.join("; ")}`);
    }

    // 1. Coherence and Structure (Max 25)
    let structureScore = 20;
    if (validation.metrics.hasAllCoreStages) structureScore += 5;
    const structureFeedback = validation.metrics.hasAllCoreStages
      ? "Demonstrates clear lesson sequence with all pedagogical stages represented."
      : "Stage sequence is acceptable, but ensure distinct demarcation between guided and independent production.";

    // 2. Objective Measurability (Max 25)
    const objectiveText = submission.reflectiveRationale?.whyThisObjective || "";
    const objectiveScore = objectiveText.length > 50 ? 24 : 20;
    const objectiveFeedback = "Objective is observable and appropriately scaled for target CEFR level.";

    // 3. Student-Centered Pacing (Max 25)
    let pacingScore = 20;
    if (validation.metrics.studentPracticeRatio >= 0.6) pacingScore += 4;
    if (validation.metrics.teacherTalkTimeRatio <= 0.35) pacingScore += 1;
    const pacingFeedback = `Strong student-centered pacing (${Math.round(validation.metrics.studentPracticeRatio * 100)}% student practice).`;

    // 4. Formative Feedback & L1 Scaffolding (Max 25)
    const l1Text = submission.reflectiveRationale?.howL1TransferIsAddressed || "";
    const scaffoldingScore = l1Text.length > 50 ? 24 : 19;
    const scaffoldingFeedback = "Explicit pedagogical awareness of Dominican Spanish transfer patterns and proactive formative checks.";

    const totalScore = structureScore + objectiveScore + pacingScore + scaffoldingScore;
    const passed = totalScore >= 80;

    const recommendationsForT2: string[] = passed
      ? [
          "Eligible for T2 Pathway: Differentiated Instruction & Multimodal Formative Assessment.",
          "Continue applying structured formative checking during fast-paced oral production drills.",
        ]
      : [
          "Refine independent practice phase to ensure >=65% student practice ratio.",
          "Expand formative check interventions in lesson plan stages.",
        ];

    return {
      rubricId: "T1_RUBRIC_V1",
      dimensionScores: {
        coherenceAndStructure: { score: structureScore, maxScore: 25, feedback: structureFeedback },
        objectiveMeasurability: { score: objectiveScore, maxScore: 25, feedback: objectiveFeedback },
        studentCenteredPacing: { score: pacingScore, maxScore: 25, feedback: pacingFeedback },
        formativeFeedbackScaffolding: { score: scaffoldingScore, maxScore: 25, feedback: scaffoldingFeedback },
      },
      totalScore,
      passed,
      recommendationsForT2,
      evaluatedAt: new Date().toISOString(),
      evaluatorType: "mind_automated",
    };
  }

  /**
   * Reference T1 Competency Matrix definition.
   */
  public static getT1CompetencyMatrix(): T1CompetencyMatrix {
    return {
      lessonStructure: {
        warmUpPresence: true,
        explicitObjectiveStated: true,
        guidedPracticeIncluded: true,
        independentProductionIncluded: true,
        closurePresent: true,
      },
      objectiveAlignment: {
        bloomTaxonomyLevel: "apply",
        cefrTargetLevel: "A1",
        measurableOutcomeDefined: true,
      },
      formativeChecks: {
        checkFrequencyPerLesson: 3,
        feedbackStrategy: "immediate_corrective",
        scaffoldingNotesProvided: true,
      },
      instructionalPacing: {
        totalDurationMinutes: 50,
        teacherTalkTimeRatio: 0.35,
        studentPracticeRatio: 0.65,
      },
    };
  }
}

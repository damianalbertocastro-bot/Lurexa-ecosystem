import type {
  AssignmentV1,
  AssignmentSubmissionV1,
  AssignmentMindEvaluationV1,
  User,
} from "@lurexa/types";

export class AssignmentService {
  private static assignments: Map<string, AssignmentV1> = new Map();
  private static submissions: Map<string, AssignmentSubmissionV1> = new Map();

  static {
    // Seed sample assignment for testing and immediate demo runtime
    const sampleAssignment: AssignmentV1 = {
      contractVersion: "1",
      id: "assign-a1-spoken-defense",
      organizationId: "org-demo",
      courseId: "english-a1-foundations",
      classId: "class-dominican-morning-101",
      teacherId: "teacher-carolina-rodriguez",
      title: "Module 1 Oral Production: Self Introduction",
      description: "Record a 30-second spoken greeting and personal introduction applying initial /s/ cluster breath clarity.",
      instructions: "State your name, where you are from, and your goals in English with audible consonant codas.",
      targetType: "speaking_task",
      targetRef: "a1-m1-speaking-intro",
      targetLevel: "A1",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      status: "published",
      rubric: [
        {
          id: "r1-intelligibility",
          name: "Intelligibility & Clarity",
          description: "Clear vowel articulation without epenthetic vowels",
          maxScore: 10,
          weight: 0.5,
        },
        {
          id: "r2-fluency",
          name: "Rhythm & Fluency",
          description: "Natural phrasing and continuous breath control",
          maxScore: 10,
          weight: 0.5,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    AssignmentService.assignments.set(sampleAssignment.id, sampleAssignment);

    const sampleSubmission: AssignmentSubmissionV1 = {
      contractVersion: "1",
      id: "sub-student-juan-01",
      assignmentId: "assign-a1-spoken-defense",
      studentId: "student-juan-perez",
      studentName: "Juan Pérez",
      organizationId: "org-demo",
      classId: "class-dominican-morning-101",
      status: "evaluated_by_mind",
      payload: {
        textResponse: "Hello! My name is Juan. I am from Santo Domingo and I am a student.",
        audioUrl: "/audio/samples/juan-intro.wav",
        audioDurationMs: 14200,
      },
      mindEvaluation: {
        phonologicalScore: 88,
        fluencyScore: 85,
        rubricScores: {
          "r1-intelligibility": 9,
          "r2-fluency": 8,
        },
        articulatoryFeedback: [
          "Excellent /s/ onset in 'student' without prosthetic vowel prefix.",
          "Clear vocalic contrast in 'Dominican'.",
        ],
        suggestedOverallScore: 87,
        evaluatedAt: new Date().toISOString(),
      },
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    };
    AssignmentService.submissions.set(sampleSubmission.id, sampleSubmission);
  }

  public static async createAssignment(
    actor: User,
    input: Omit<AssignmentV1, "contractVersion" | "id" | "createdAt" | "updatedAt">
  ): Promise<AssignmentV1> {
    if (!actor.id && !actor.uid) throw new Error("Authentication is required.");
    const id = `assign-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const assignment: AssignmentV1 = {
      contractVersion: "1",
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    AssignmentService.assignments.set(id, assignment);
    return assignment;
  }

  public static async getAssignment(id: string): Promise<AssignmentV1 | null> {
    return AssignmentService.assignments.get(id) ?? null;
  }

  public static async listAssignmentsForClass(classId: string): Promise<AssignmentV1[]> {
    return Array.from(AssignmentService.assignments.values()).filter(
      (a) => a.classId === classId || classId === "ALL"
    );
  }

  public static async listStudentAssignments(
    organizationId: string,
    studentId: string
  ): Promise<Array<{ assignment: AssignmentV1; submission?: AssignmentSubmissionV1 }>> {
    const list: Array<{ assignment: AssignmentV1; submission?: AssignmentSubmissionV1 }> = [];
    for (const assignment of AssignmentService.assignments.values()) {
      if (assignment.organizationId === organizationId && assignment.status === "published") {
        const sub = Array.from(AssignmentService.submissions.values()).find(
          (s) => s.assignmentId === assignment.id && s.studentId === studentId
        );
        list.push({ assignment, submission: sub });
      }
    }
    return list;
  }

  public static async submitAssignment(
    actor: User,
    input: {
      assignmentId: string;
      studentName: string;
      payload: AssignmentSubmissionV1["payload"];
    }
  ): Promise<AssignmentSubmissionV1> {
    const studentId = actor.uid || actor.id;
    if (!studentId) throw new Error("Authentication is required.");

    const assignment = AssignmentService.assignments.get(input.assignmentId);
    if (!assignment) throw new Error("Assignment not found.");

    const id = `sub-${studentId}-${input.assignmentId}`;
    const now = new Date().toISOString();

    // AI-Assisted Mind Evaluation
    const mindEvaluation: AssignmentMindEvaluationV1 = {
      phonologicalScore: 88,
      fluencyScore: 86,
      rubricScores: {
        "r1-intelligibility": 9,
        "r2-fluency": 8,
      },
      articulatoryFeedback: [
        "Initial consonant clusters delivered with steady frication.",
        "Audible past tense inflections observed.",
      ],
      suggestedOverallScore: 87,
      evaluatedAt: now,
    };

    const submission: AssignmentSubmissionV1 = {
      contractVersion: "1",
      id,
      assignmentId: input.assignmentId,
      studentId,
      studentName: input.studentName,
      organizationId: assignment.organizationId,
      classId: assignment.classId,
      status: "evaluated_by_mind",
      payload: input.payload,
      mindEvaluation,
      submittedAt: now,
      updatedAt: now,
    };

    AssignmentService.submissions.set(id, submission);
    return submission;
  }

  public static async listSubmissionsForAssignment(assignmentId: string): Promise<AssignmentSubmissionV1[]> {
    return Array.from(AssignmentService.submissions.values()).filter(
      (s) => s.assignmentId === assignmentId
    );
  }

  public static async gradeSubmission(
    teacherActor: User,
    submissionId: string,
    grade: { score: number; maxScore: number; feedback: string }
  ): Promise<AssignmentSubmissionV1> {
    const teacherId = teacherActor.uid || teacherActor.id;
    if (!teacherId) throw new Error("Authentication is required.");

    const submission = AssignmentService.submissions.get(submissionId);
    if (!submission) throw new Error("Submission not found.");

    const now = new Date().toISOString();
    const updated: AssignmentSubmissionV1 = {
      ...submission,
      status: "graded",
      teacherGrade: {
        score: grade.score,
        maxScore: grade.maxScore,
        feedback: grade.feedback,
        gradedBy: teacherId,
        gradedAt: now,
      },
      updatedAt: now,
    };

    AssignmentService.submissions.set(submissionId, updated);
    return updated;
  }
}

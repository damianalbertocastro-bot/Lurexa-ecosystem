import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";

const ORGANIZATION_ID = "lurexa-self-paced";
const COURSE_ID = "english-a1-foundations";
const MODULE_ID = "english-a1-introductions";
const LESSON_ID = "a1-introduce-yourself";

export type SelfPacedGoal = "daily_life" | "work" | "travel" | "study";

export interface SelfPacedOnboardingResult {
  courseId: string;
  lessonId: string;
  recommendation: {
    level: "A1";
    rationale: string;
  };
}

function lessonContentBlocks(): ContentBlock[] {
  return [
    {
      id: "a1-intro-text",
      type: "text",
      order: 1,
      data: {
        text: "Mission: introduce yourself in two short sentences.\n\nAndrea: Hi, I’m Andrea. What’s your name?\nLuis: Hello, I’m Luis. Nice to meet you.\nAndrea: Nice to meet you too.\n\nUse I’m + your name. Say Nice to meet you when you meet someone for the first time.",
      },
    },
    {
      id: "a1-greeting-response",
      type: "interactive",
      order: 2,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "GUIDED_PRACTICE",
          title: "Choose a natural response",
          instructions: "Choose the best response.",
          prompt: "Someone says: “Hi, I’m Carlos. Nice to meet you.”",
          options: ["Nice to meet you.", "I am fine, thank you.", "See you yesterday."],
          correctAnswers: ["Nice to meet you."],
          explanation: "Nice to meet you is the natural response when you meet someone for the first time.",
          competencyIds: ["EN-A1-SPK-INTRO-01"],
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: "a1-build-introduction",
      type: "interactive",
      order: 3,
      data: {
        activity: {
          schemaVersion: "1",
          type: "sentence_builder",
          stage: "GUIDED_PRACTICE",
          title: "Build your introduction",
          instructions: "Select the words in the correct order.",
          prompt: "Make one sentence to introduce yourself.",
          options: ["Hello,", "I’m", "Ana."],
          correctAnswers: ["Hello,", "I’m", "Ana."],
          explanation: "Use Hello, then I’m, then your name.",
          competencyIds: ["EN-A1-SPK-INTRO-01"],
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: "a1-intro-check",
      type: "quiz_embed",
      order: 4,
      data: {
        prompt: "Which sentence introduces your name?",
        options: ["I’m Daniela.", "Nice yesterday.", "I am fine name."],
        correctAnswer: "I’m Daniela.",
        explanation: "I’m + name is a short, natural introduction.",
      },
    },
    {
      id: "a1-create-apply",
      type: "text",
      order: 5,
      data: {
        text: "Create & Apply\n\nSay or write: “Hello, I’m [your name]. I’m from [your city]. Nice to meet you.”\n\nSpeak slowly enough to make your message clear. The goal is intelligibility, not accent imitation.",
      },
    },
  ];
}

function starterCourse(now: string): { course: Course; module: Module; lesson: Lesson } {
  const lesson: Lesson = {
    id: LESSON_ID,
    moduleId: MODULE_ID,
    title: "Introduce yourself",
    summary: "Greet someone, say your name, and give a short introduction.",
    contentBlocks: lessonContentBlocks(),
    order: 1,
    estimatedMinutes: 12,
  };
  const module: Module = {
    id: MODULE_ID,
    courseId: COURSE_ID,
    title: "Start speaking",
    description: "Your first practical English interaction.",
    order: 1,
    lessonIds: [LESSON_ID],
  };
  const course: Course = {
    id: COURSE_ID,
    orgId: ORGANIZATION_ID,
    authorId: "lurexa-system",
    title: "English A1 Foundations",
    description: "A practical first path for beginner English learners.",
    subject: "english",
    status: "published",
    isTemplate: false,
    moduleIds: [MODULE_ID],
    createdAt: now,
    updatedAt: now,
  };
  return { course, module, lesson };
}

/**
 * Creates the smallest viable self-paced entry path. A1 is a starter-course
 * recommendation for the learner-selected beginner path, not a CEFR placement
 * result or proficiency inference.
 */
export async function onboardSelfPacedLearner(input: {
  learnerId: string;
  email: string | null;
  goal: SelfPacedGoal;
}): Promise<SelfPacedOnboardingResult> {
  const database = getServerFirestore();
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  const now = new Date().toISOString();
  const { course, module, lesson } = starterCourse(now);

  const organizationReference = database.collection("organizations").doc(ORGANIZATION_ID);
  const membershipReference = organizationReference.collection("members").doc(input.learnerId);
  const userMembershipReference = database.collection("user-memberships").doc(input.learnerId).collection("organizations").doc(ORGANIZATION_ID);
  const profileReference = database.collection("learner-profiles").doc(input.learnerId);
  const goalEvidenceId = database.collection("learning-evidence").doc().id;

  await Promise.all([
    organizationReference.set({
      id: ORGANIZATION_ID,
      name: "Lurexa Self-Paced Learning",
      slug: "lurexa-self-paced",
      ownerId: "lurexa-system",
      plan: "platform",
      createdAt: now,
      updatedAt: now,
    }, { merge: true }),
    database.collection("courses").doc(COURSE_ID).set(course, { merge: true }),
    database.collection("modules").doc(MODULE_ID).set(module, { merge: true }),
    database.collection("lessons").doc(LESSON_ID).set(lesson, { merge: true }),
    membershipReference.set({
      userId: input.learnerId,
      orgId: ORGANIZATION_ID,
      role: "student",
      joinedAt: now,
      source: "self-paced-onboarding",
    }, { merge: true }),
    userMembershipReference.set({
      userId: input.learnerId,
      orgId: ORGANIZATION_ID,
      role: "student",
      joinedAt: now,
      source: "self-paced-onboarding",
    }, { merge: true }),
    profileReference.set({
      learnerId: input.learnerId,
      goals: [input.goal],
      onboarding: {
        path: "self-paced-beginner",
        completedAt: now,
        recommendation: "A1 starter course",
      },
      updatedAt: now,
    }, { merge: true }),
    evidenceRepository.append({
      id: goalEvidenceId,
      learnerId: input.learnerId,
      organizationId: ORGANIZATION_ID,
      source: {
        product: "learn",
        courseId: COURSE_ID,
        lessonId: LESSON_ID,
      },
      type: "goal_update",
      observedAt: now,
      payload: {
        goal: input.goal,
        startingPath: "self-paced-beginner",
      },
      provenance: {
        method: "learner_reported",
        actorId: input.learnerId,
        confidence: 1,
      },
    }),
  ]);

  return {
    courseId: COURSE_ID,
    lessonId: LESSON_ID,
    recommendation: {
      level: "A1",
      rationale: "You chose the beginner path, so we are starting with a practical A1 introduction lesson. This is not a formal CEFR placement result.",
    },
  };
}

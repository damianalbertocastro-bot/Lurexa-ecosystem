import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";

const ORGANIZATION_ID = "lurexa-self-paced";
const COURSE_ID = "english-a1-foundations";
const MODULE_ID = "english-a1-introductions";
const LESSON_ID = "a1-introduce-yourself";
const A2_COURSE_ID = "english-a2-everyday-conversations";
const A2_MODULE_ID = "english-a2-making-plans";
const A2_LESSON_ID = "a2-make-a-plan";

export type SelfPacedGoal = "daily_life" | "work" | "travel" | "study";
export type PlacementAnswer = "nice_to_meet_you" | "fine_thanks" | "i_live_in" | "i_live" | "are" | "is" | "going_to" | "go";

export interface SelfPacedOnboardingResult {
  courseId: string;
  lessonId: string;
  recommendation: {
    level: "A1" | "A2";
    confidence: "low";
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
      type: "interactive",
      order: 5,
      data: {
        activity: {
          schemaVersion: "1",
          type: "short_response",
          stage: "CREATE_APPLY",
          title: "Create your introduction",
          instructions: "Write your own short introduction. Include your name, where you are from, and “Nice to meet you.”",
          prompt: "Write two or three sentences to introduce yourself to a new classmate.",
          explanation: "You submitted a real introduction. Read it aloud slowly to practise clear, confident communication.",
          competencyIds: ["EN-A1-SPK-INTRO-01"],
          estimatedMinutes: 3,
          required: true,
        },
      },
    },
  ];
}

function a1StarterCourse(now: string): { course: Course; module: Module; lesson: Lesson } {
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

function a2StarterCourse(now: string): { course: Course; module: Module; lesson: Lesson } {
  const lesson: Lesson = {
    id: A2_LESSON_ID,
    moduleId: A2_MODULE_ID,
    title: "Make a simple plan",
    summary: "Invite someone, suggest a time, and respond to a plan.",
    contentBlocks: [
      { id: "a2-plan-text", type: "text", order: 1, data: { text: "Mission: make a simple plan with a friend.\n\nSofía: Are you free on Saturday?\nMateo: Yes, I am. What are you going to do?\nSofía: I’m going to visit the Malecón. Do you want to come?\nMateo: Sure! Let’s meet at three.\n\nUse Are you free…? to invite someone. Use going to for a plan." } },
      { id: "a2-plan-response", type: "interactive", order: 2, data: { activity: { schemaVersion: "1", type: "single_choice", stage: "GUIDED_PRACTICE", title: "Respond to an invitation", instructions: "Choose the most natural response.", prompt: "A friend says: “Do you want to come to the park?”", options: ["Sure, I’d like to.", "I am going yesterday.", "Nice to meet Saturday."], correctAnswers: ["Sure, I’d like to."], explanation: "Sure, I’d like to is a natural way to accept an invitation.", competencyIds: ["EN-A2-SPK-PLANS-01"], estimatedMinutes: 2, required: true } } },
      { id: "a2-plan-builder", type: "interactive", order: 3, data: { activity: { schemaVersion: "1", type: "sentence_builder", stage: "GUIDED_PRACTICE", title: "Build a plan", instructions: "Select the words in the correct order.", prompt: "Make a sentence about your plan.", options: ["I’m", "going", "to", "call", "my friend."], correctAnswers: ["I’m", "going", "to", "call", "my friend."], explanation: "Use I’m going to + verb to talk about a plan.", competencyIds: ["EN-A2-SPK-PLANS-01"], estimatedMinutes: 2, required: true } } },
      { id: "a2-plan-check", type: "quiz_embed", order: 4, data: { prompt: "Which question asks about a future plan?", options: ["What are you going to do?", "Where you yesterday?", "Nice to meet plan."], correctAnswer: "What are you going to do?", explanation: "What are you going to do? asks about a future plan." } },
      { id: "a2-plan-create-apply", type: "interactive", order: 5, data: { activity: { schemaVersion: "1", type: "short_response", stage: "CREATE_APPLY", title: "Invite a friend", instructions: "Write two or three sentences. Invite someone, say what you are going to do, and suggest a time.", prompt: "Write a short message to make a plan with a friend.", explanation: "You created a practical invitation. Read it aloud to rehearse the conversation.", competencyIds: ["EN-A2-SPK-PLANS-01"], estimatedMinutes: 3, required: true } } },
    ],
    order: 1,
    estimatedMinutes: 12,
  };
  const module: Module = { id: A2_MODULE_ID, courseId: A2_COURSE_ID, title: "Everyday conversations", description: "Make plans and respond naturally in common situations.", order: 1, lessonIds: [A2_LESSON_ID] };
  const course: Course = { id: A2_COURSE_ID, orgId: ORGANIZATION_ID, authorId: "lurexa-system", title: "English A2 Everyday Conversations", description: "A practical starter path for learners with early English foundations.", subject: "english", status: "published", isTemplate: false, moduleIds: [A2_MODULE_ID], createdAt: now, updatedAt: now };
  return { course, module, lesson };
}

function scorePlacement(answers: PlacementAnswer[] | undefined): { level: "A1" | "A2"; confidence: "low"; rationale: string; score: number } {
  if (!answers) return { level: "A1", confidence: "low", score: 0, rationale: "You chose the beginner path, so we are starting with a practical A1 introduction lesson. This is not a formal CEFR placement result." };
  const expected: PlacementAnswer[] = ["nice_to_meet_you", "i_live_in", "are", "going_to"];
  const score = answers.filter((answer, index) => answer === expected[index]).length;
  if (score >= 3) return { level: "A2", confidence: "low", score, rationale: "Your short start check suggests that an early A2 conversation lesson is a useful next step. This is a provisional recommendation, not a CEFR certification; speaking and listening evidence can refine it later." };
  return { level: "A1", confidence: "low", score, rationale: "Your short start check points to the A1 foundation lesson as the most useful starting step. This is a provisional recommendation, not a CEFR placement result." };
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
  placementAnswers?: PlacementAnswer[];
}): Promise<SelfPacedOnboardingResult> {
  const database = getServerFirestore();
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  const now = new Date().toISOString();
  const a1 = a1StarterCourse(now);
  const a2 = a2StarterCourse(now);
  const recommendation = scorePlacement(input.placementAnswers);
  const selected = recommendation.level === "A2" ? a2 : a1;

  const organizationReference = database.collection("organizations").doc(ORGANIZATION_ID);
  const membershipReference = organizationReference.collection("members").doc(input.learnerId);
  const userMembershipReference = database.collection("user-memberships").doc(input.learnerId).collection("organizations").doc(ORGANIZATION_ID);
  const profileReference = database.collection("learner-profiles").doc(input.learnerId);
  const goalEvidenceId = database.collection("learning-evidence").doc().id;
  const placementEvidenceId = database.collection("learning-evidence").doc().id;

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
    database.collection("courses").doc(a1.course.id).set(a1.course, { merge: true }),
    database.collection("modules").doc(a1.module.id).set(a1.module, { merge: true }),
    database.collection("lessons").doc(a1.lesson.id).set(a1.lesson, { merge: true }),
    database.collection("courses").doc(a2.course.id).set(a2.course, { merge: true }),
    database.collection("modules").doc(a2.module.id).set(a2.module, { merge: true }),
    database.collection("lessons").doc(a2.lesson.id).set(a2.lesson, { merge: true }),
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
        path: input.placementAnswers ? "self-paced-start-check" : "self-paced-beginner",
        completedAt: now,
        recommendation: `${recommendation.level} starter course`,
        recommendedCourseId: selected.course.id,
        confidence: recommendation.confidence,
      },
      updatedAt: now,
    }, { merge: true }),
    evidenceRepository.append({
      id: goalEvidenceId,
      learnerId: input.learnerId,
      organizationId: ORGANIZATION_ID,
      source: {
        product: "learn",
        courseId: selected.course.id,
        lessonId: selected.lesson.id,
      },
      type: "goal_update",
      observedAt: now,
      payload: {
        goal: input.goal,
        startingPath: input.placementAnswers ? "self-paced-start-check" : "self-paced-beginner",
      },
      provenance: {
        method: "learner_reported",
        actorId: input.learnerId,
        confidence: 1,
      },
    }),
    ...(input.placementAnswers ? [evidenceRepository.append({
      id: placementEvidenceId,
      learnerId: input.learnerId,
      organizationId: ORGANIZATION_ID,
      source: { product: "learn", courseId: selected.course.id, lessonId: selected.lesson.id, activityId: "self-paced-start-check" },
      type: "assessment_result",
      observedAt: now,
      payload: { answers: input.placementAnswers, score: recommendation.score, recommendation: recommendation.level, confidence: recommendation.confidence, scope: "short_start_check" },
      provenance: { method: "system_observed", actorId: input.learnerId, confidence: 0.25 },
    })] : []),
  ]);

  try {
    await refreshLearnerIntelligence({
      learnerId: input.learnerId,
      organizationId: ORGANIZATION_ID,
      requestedDomains: ["goal"],
    });
  } catch (error) {
    console.error("Learner goal interpretation failed after onboarding.", error);
  }

  return {
    courseId: selected.course.id,
    lessonId: selected.lesson.id,
    recommendation: {
      level: recommendation.level,
      confidence: recommendation.confidence,
      rationale: recommendation.rationale,
    },
  };
}

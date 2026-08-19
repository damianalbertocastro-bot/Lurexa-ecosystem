import { FieldValue } from "firebase-admin/firestore";
import { getServerFirebaseAuth, getServerFirestore } from "./firebase-admin.server";
import type { ContentBlock, Course, LearnerLearningActivity, LearnerLearningActivityContentBlockData, LearnerQuizContentBlockData, LearningActivity, LearningActivityContentBlockData, Lesson, LessonStage, Module, QuizContentBlockData, StudentProgress } from "@lurexa/types";

type TeacherRole = "owner" | "admin" | "teacher";

export interface AuthenticatedActor {
  uid: string;
  email: string | null;
}

export interface LearnerCourseSummary {
  course: Course;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  nextLesson: Lesson | null;
}

export interface TeacherCourseSummary {
  course: Course;
  lessons: Array<{ moduleTitle: string; lesson: Lesson }>;
}

export interface LearnerGamificationSummary {
  streakDays: number;
  totalPoints: number;
  lastActivityAt: string | null;
}

export interface LearnerDashboardSummary {
  courses: LearnerCourseSummary[];
  gamification: LearnerGamificationSummary;
}

function asCourse(value: FirebaseFirestore.DocumentData): Course {
  return { id: value.id as string, ...value } as Course;
}

function asLesson(value: FirebaseFirestore.DocumentData): Lesson {
  return { id: value.id as string, ...value } as Lesson;
}

function asModule(value: FirebaseFirestore.DocumentData): Module {
  return { id: value.id as string, ...value } as Module;
}

function calculateStreak(progress: StudentProgress[]): number {
  const activeDays = new Set(progress.filter((entry) => entry.completed).map((entry) => entry.lastAccessedAt.slice(0, 10)));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!activeDays.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  let streakDays = 0;
  while (activeDays.has(cursor.toISOString().slice(0, 10))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streakDays;
}

async function getMembership(actorId: string, orgId: string): Promise<{ role: string } | null> {
  const snapshot = await getServerFirestore()
    .collection("user-memberships")
    .doc(actorId)
    .collection("organizations")
    .doc(orgId)
    .get();
  return snapshot.exists ? (snapshot.data() as { role: string }) : null;
}

async function requireMembership(actorId: string, orgId: string): Promise<void> {
  if (!await getMembership(actorId, orgId)) throw new Error("You do not have access to this course.");
}

async function requireTeacher(actorId: string, orgId: string): Promise<void> {
  const membership = await getMembership(actorId, orgId);
  if (!membership || !(["owner", "admin", "teacher"] as TeacherRole[]).includes(membership.role as TeacherRole)) {
    throw new Error("A teacher organization membership is required.");
  }
}

async function getCourseOrThrow(courseId: string): Promise<Course> {
  const snapshot = await getServerFirestore().collection("courses").doc(courseId).get();
  if (!snapshot.exists) throw new Error("Course not found.");
  return asCourse(snapshot.data()!);
}

async function getCourseLessons(course: Course): Promise<Array<{ module: Module; lesson: Lesson }>> {
  const database = getServerFirestore();
  const modules = (await Promise.all(course.moduleIds.map(async (moduleId) => {
    const snapshot = await database.collection("modules").doc(moduleId).get();
    return snapshot.exists ? asModule(snapshot.data()!) : null;
  }))).filter((module): module is Module => module !== null && module.courseId === course.id)
    .sort((first, second) => first.order - second.order);

  const entries = await Promise.all(modules.flatMap((module) => module.lessonIds.map(async (lessonId) => {
    const snapshot = await database.collection("lessons").doc(lessonId).get();
    return snapshot.exists ? { module, lesson: asLesson(snapshot.data()!) } : null;
  })));
  return entries.filter((entry): entry is { module: Module; lesson: Lesson } => entry !== null)
    .sort((first, second) => first.module.order - second.module.order || first.lesson.order - second.lesson.order);
}

function readQuizData(value: Record<string, unknown>): QuizContentBlockData | null {
  if (typeof value.prompt !== "string" || typeof value.correctAnswer !== "string" || !Array.isArray(value.options) || !value.options.every((option) => typeof option === "string")) return null;
  return { prompt: value.prompt, options: value.options, correctAnswer: value.correctAnswer, ...(typeof value.explanation === "string" ? { explanation: value.explanation } : {}) };
}

const lessonStages: LessonStage[] = ["HOOK", "MISSION", "VOCABULARY_BUILDER", "CONTEXTUAL_INPUT", "COMPREHENSION", "LANGUAGE_NOTICING", "GRAMMAR_FOCUS", "PHONETICS_FOCUS", "GUIDED_PRACTICE", "CONVERSATION", "CREATE_APPLY", "REVIEW", "QUIZ", "REFLECTION"];
const scoredActivityTypes = ["single_choice", "multiple_selection", "sentence_builder"] as const;

function readLearningActivityData(value: Record<string, unknown>): LearningActivity | null {
  const activity = value.activity;
  if (typeof activity !== "object" || activity === null || Array.isArray(activity)) return null;
  const candidate = activity as Record<string, unknown>;
  if (candidate.schemaVersion !== "1" || !scoredActivityTypes.includes(candidate.type as (typeof scoredActivityTypes)[number]) || !lessonStages.includes(candidate.stage as LessonStage) || typeof candidate.title !== "string" || typeof candidate.instructions !== "string" || typeof candidate.prompt !== "string" || !Array.isArray(candidate.options) || !candidate.options.every((option) => typeof option === "string") || !Array.isArray(candidate.correctAnswers) || !candidate.correctAnswers.every((answer) => typeof answer === "string") || !Array.isArray(candidate.competencyIds) || !candidate.competencyIds.every((competencyId) => typeof competencyId === "string") || typeof candidate.estimatedMinutes !== "number" || typeof candidate.required !== "boolean") return null;
  return {
    schemaVersion: "1",
    type: candidate.type as LearningActivity["type"],
    stage: candidate.stage as LessonStage,
    title: candidate.title,
    instructions: candidate.instructions,
    prompt: candidate.prompt,
    options: candidate.options,
    correctAnswers: candidate.correctAnswers,
    competencyIds: candidate.competencyIds,
    estimatedMinutes: candidate.estimatedMinutes,
    required: candidate.required,
    ...(typeof candidate.explanation === "string" ? { explanation: candidate.explanation } : {}),
    ...(typeof candidate.hint === "string" ? { hint: candidate.hint } : {}),
  };
}

function sanitizeLearningActivity(activity: LearningActivity): LearnerLearningActivity {
  const { correctAnswers: _correctAnswers, hint: _hint, ...learnerActivity } = activity;
  return learnerActivity;
}

function sanitizeLessonForLearner(lesson: Lesson): Lesson {
  return {
    ...lesson,
    contentBlocks: lesson.contentBlocks.map((block) => {
      if (block.type === "quiz_embed") {
        const quiz = readQuizData(block.data);
        if (!quiz) return block;
        const learnerQuiz: LearnerQuizContentBlockData = { prompt: quiz.prompt, options: quiz.options };
        return { ...block, data: learnerQuiz };
      }
      if (block.type === "interactive") {
        const activity = readLearningActivityData(block.data);
        if (!activity) return block;
        const learnerActivity: LearnerLearningActivityContentBlockData = { activity: sanitizeLearningActivity(activity) };
        return { ...block, data: learnerActivity };
      }
      return block;
    }),
  };
}

function validateLessonContentBlocks(contentBlocks: ContentBlock[]): void {
  if (!contentBlocks.length) throw new Error("A lesson needs at least one content block.");
  const blockIds = new Set<string>();
  for (const block of contentBlocks) {
    if (!block.id || blockIds.has(block.id) || !Number.isFinite(block.order)) throw new Error("Lesson content contains an invalid block.");
    blockIds.add(block.id);
    if (block.type === "text" && typeof block.data.text !== "string") throw new Error("Text blocks require text content.");
    if (block.type === "quiz_embed" && !readQuizData(block.data)) throw new Error("Quiz blocks need valid answer data.");
    if (block.type === "interactive" && !readLearningActivityData(block.data)) throw new Error("Interactive activities need valid stage, options, answers, and competency metadata.");
  }
}


async function appendPlatformEvidence(input: {
  learnerId: string;
  organizationId: string;
  eventType: string;
  source: Record<string, unknown>;
  payload: Record<string, unknown>;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<void> {
  const reference = getServerFirestore().collection("learning-evidence").doc();
  await reference.set({
    evidenceId: reference.id,
    schemaVersion: "1",
    learnerId: input.learnerId,
    actor: { type: "learner", id: input.learnerId },
    source: { product: "learn", ...input.source },
    eventType: input.eventType,
    occurredAt: input.occurredAt,
    recordedAt: new Date().toISOString(),
    authorizationContext: { organizationId: input.organizationId, membershipRequired: true },
    payload: input.payload,
    reliability: {
      method: "system_observed",
      limitations: ["A single event is not a mastery determination."],
    },
    provenance: { service: "course-platform", contractVersion: "1" },
    idempotencyKey: input.idempotencyKey,
  });
}

export const CoursePlatformService = {
  async authenticate(authorization: string | null): Promise<AuthenticatedActor> {
    if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication is required.");
    const token = await getServerFirebaseAuth().verifyIdToken(authorization.slice(7));
    return { uid: token.uid, email: token.email ?? null };
  },

  async getLearnerCourses(actor: AuthenticatedActor): Promise<LearnerCourseSummary[]> {
    const database = getServerFirestore();
    const memberships = await database.collection("user-memberships").doc(actor.uid).collection("organizations").get();
    const organizationIds = memberships.docs.map((membership) => membership.id);
    const courses = (await Promise.all(organizationIds.map(async (orgId) => {
      const snapshots = await database.collection("courses").where("orgId", "==", orgId).get();
      return snapshots.docs.map((snapshot) => asCourse(snapshot.data())).filter((course) => course.status === "published");
    }))).flat();

    return Promise.all(courses.map(async (course) => {
      const lessons = await getCourseLessons(course);
      const progressSnapshots = await database.collection("progress").where("studentId", "==", actor.uid).get();
      const completed = new Set(progressSnapshots.docs.map((snapshot) => snapshot.data() as StudentProgress)
        .filter((progress) => progress.courseId === course.id && progress.completed).map((progress) => progress.lessonId));
      const next = lessons.find(({ lesson }) => !completed.has(lesson.id))?.lesson ?? null;
      return {
        course,
        completedLessons: completed.size,
        totalLessons: lessons.length,
        progressPercent: lessons.length === 0 ? 0 : Math.round((completed.size / lessons.length) * 100),
        nextLesson: next,
      };
    }));
  },

  async getTeacherCourses(actor: AuthenticatedActor): Promise<TeacherCourseSummary[]> {
    const database = getServerFirestore();
    const memberships = await database.collection("user-memberships").doc(actor.uid).collection("organizations").get();
    const organizationIds = memberships.docs
      .filter((membership) => (['owner', 'admin', 'teacher'] as TeacherRole[]).includes(membership.data().role as TeacherRole))
      .map((membership) => membership.id);
    const courses = (await Promise.all(organizationIds.map(async (orgId) => {
      const snapshots = await database.collection("courses").where("orgId", "==", orgId).get();
      return snapshots.docs.map((snapshot) => asCourse(snapshot.data()));
    }))).flat().sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));

    return Promise.all(courses.map(async (course) => ({
      course,
      lessons: (await getCourseLessons(course)).map(({ module, lesson }) => ({ moduleTitle: module.title, lesson })),
    })));
  },

  async getLearnerDashboard(actor: AuthenticatedActor): Promise<LearnerDashboardSummary> {
    const [courses, progressSnapshots] = await Promise.all([
      this.getLearnerCourses(actor),
      getServerFirestore().collection("progress").where("studentId", "==", actor.uid).get(),
    ]);
    const progress = progressSnapshots.docs.map((snapshot) => snapshot.data() as StudentProgress);
    const completed = progress.filter((entry) => entry.completed);
    return {
      courses,
      gamification: {
        streakDays: calculateStreak(progress),
        totalPoints: completed.length * 10,
        lastActivityAt: completed.sort((first, second) => second.lastAccessedAt.localeCompare(first.lastAccessedAt))[0]?.lastAccessedAt ?? null,
      },
    };
  },

  async getLesson(actor: AuthenticatedActor, courseId: string, lessonId: string): Promise<{ lesson: Lesson; progress: StudentProgress | null; nextLesson: Lesson | null }> {
    const course = await getCourseOrThrow(courseId);
    if (course.status !== "published") throw new Error("This course is not published.");
    await requireMembership(actor.uid, course.orgId);
    const lessons = await getCourseLessons(course);
    const lessonIndex = lessons.findIndex(({ lesson }) => lesson.id === lessonId);
    if (lessonIndex < 0) throw new Error("Lesson not found in this course.");
    const entry = lessons[lessonIndex];
    const progress = await getServerFirestore().collection("progress").doc(`${actor.uid}_${lessonId}`).get();
    return {
      lesson: sanitizeLessonForLearner(entry.lesson),
      progress: progress.exists ? (progress.data() as StudentProgress) : null,
      nextLesson: lessons[lessonIndex + 1]?.lesson ?? null,
    };
  },

  async completeLesson(actor: AuthenticatedActor, courseId: string, lessonId: string, timeSpentSeconds: number): Promise<StudentProgress> {
    const { lesson } = await this.getLesson(actor, courseId, lessonId);
    const record: StudentProgress = {
      id: `${actor.uid}_${lessonId}`, studentId: actor.uid, lessonId, moduleId: lesson.moduleId, courseId,
      completed: true, timeSpentSeconds: Math.max(0, Math.min(Math.round(timeSpentSeconds), 86_400)), attempts: [],
      lastAccessedAt: new Date().toISOString(),
    };
    await getServerFirestore().collection("progress").doc(record.id).set({ ...record, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    await appendPlatformEvidence({ learnerId: actor.uid, organizationId: course.orgId, eventType: "lesson.completed", source: { courseId, lessonId }, payload: { timeSpentSeconds: record.timeSpentSeconds }, occurredAt: record.lastAccessedAt, idempotencyKey: `${actor.uid}:${lessonId}:lesson.completed` });
    return record;
  },

  async submitQuizAttempt(actor: AuthenticatedActor, courseId: string, lessonId: string, quizId: string, answer: string): Promise<{ attempt: StudentProgress["attempts"][number]; explanation: string | null }> {
    const course = await getCourseOrThrow(courseId);
    if (course.status !== "published") throw new Error("This course is not published.");
    await requireMembership(actor.uid, course.orgId);
    const entry = (await getCourseLessons(course)).find(({ lesson }) => lesson.id === lessonId);
    if (!entry) throw new Error("Lesson not found in this course.");
    const block = entry.lesson.contentBlocks.find((item) => item.id === quizId && item.type === "quiz_embed");
    const quiz = block ? readQuizData(block.data) : null;
    if (!quiz) throw new Error("Activity not found.");
    const passed = answer.trim().toLocaleLowerCase() === quiz.correctAnswer.trim().toLocaleLowerCase();
    const attempt = { quizId, score: passed ? 1 : 0, maxScore: 1, passed, completedAt: new Date().toISOString() };
    const reference = getServerFirestore().collection("progress").doc(`${actor.uid}_${lessonId}`);
    const existing = await reference.get();
    const previous = existing.exists ? (existing.data() as StudentProgress) : null;
    const attempts = [...(previous?.attempts ?? []), { ...attempt, activityType: "single_choice", attemptNumber: (previous?.attempts.filter((item) => item.quizId === quizId).length ?? 0) + 1, firstAttempt: !previous?.attempts.some((item) => item.quizId === quizId) }];
    await reference.set({ id: reference.id, studentId: actor.uid, lessonId, moduleId: entry.lesson.moduleId, courseId, completed: previous?.completed ?? false, timeSpentSeconds: previous?.timeSpentSeconds ?? 0, attempts, bestScore: Math.max(previous?.bestScore ?? 0, attempt.score), lastAccessedAt: attempt.completedAt, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    await appendPlatformEvidence({ learnerId: actor.uid, organizationId: course.orgId, eventType: "assessment.submitted", source: { courseId, lessonId, activityId: quizId, attemptNumber: attempts.at(-1)?.attemptNumber ?? 1 }, payload: { correct: passed, firstAttempt: attempts.at(-1)?.firstAttempt ?? true }, occurredAt: attempt.completedAt, idempotencyKey: `${actor.uid}:${lessonId}:${quizId}:${attempts.at(-1)?.attemptNumber ?? 1}` });
    return { attempt, explanation: quiz.explanation ?? null };
  },

  async submitActivityAttempt(actor: AuthenticatedActor, courseId: string, lessonId: string, activityId: string, answers: string[]): Promise<{ attempt: StudentProgress["attempts"][number]; explanation: string | null }> {
    const course = await getCourseOrThrow(courseId);
    if (course.status !== "published") throw new Error("This course is not published.");
    await requireMembership(actor.uid, course.orgId);
    const entry = (await getCourseLessons(course)).find(({ lesson }) => lesson.id === lessonId);
    if (!entry) throw new Error("Lesson not found in this course.");
    const block = entry.lesson.contentBlocks.find((item) => item.id === activityId && item.type === "interactive");
    const activity = block ? readLearningActivityData(block.data) : null;
    if (!activity || !activity.options || !activity.correctAnswers) throw new Error("Activity not found.");
    const submitted = answers.map((answer) => answer.trim()).filter(Boolean);
    if (!submitted.length || submitted.some((answer) => !activity.options!.includes(answer))) throw new Error("Select one of the available answers.");
    if (activity.type === "single_choice" && submitted.length !== 1) throw new Error("Select one answer.");
    const passed = activity.type === "sentence_builder"
      ? submitted.length === activity.correctAnswers.length && submitted.every((answer, index) => answer === activity.correctAnswers![index])
      : submitted.length === activity.correctAnswers.length && submitted.every((answer) => activity.correctAnswers!.includes(answer));
    const completedAt = new Date().toISOString();
    const reference = getServerFirestore().collection("progress").doc(`${actor.uid}_${lessonId}`);
    const existing = await reference.get();
    const previous = existing.exists ? (existing.data() as StudentProgress) : null;
    const previousAttempts = previous?.attempts.filter((item) => item.quizId === activityId) ?? [];
    const attempt = { quizId: activityId, score: passed ? 1 : 0, maxScore: 1, passed, completedAt, activityType: activity.type, attemptNumber: previousAttempts.length + 1, firstAttempt: previousAttempts.length === 0, competencyIds: activity.competencyIds };
    await reference.set({ id: reference.id, studentId: actor.uid, lessonId, moduleId: entry.lesson.moduleId, courseId, completed: previous?.completed ?? false, timeSpentSeconds: previous?.timeSpentSeconds ?? 0, attempts: [...(previous?.attempts ?? []), attempt], bestScore: Math.max(previous?.bestScore ?? 0, attempt.score), lastAccessedAt: completedAt, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    const evidenceReference = getServerFirestore().collection("learning-evidence").doc();
    await evidenceReference.set({ evidenceId: evidenceReference.id, schemaVersion: "1", learnerId: actor.uid, actor: { type: "learner", id: actor.uid }, source: { product: "learn", courseId, lessonId, activityId, attemptNumber: attempt.attemptNumber }, eventType: "learning_activity.submitted", occurredAt: completedAt, recordedAt: new Date().toISOString(), authorizationContext: { organizationId: course.orgId, membershipRequired: true }, payload: { selectedAnswerCount: submitted.length, correct: passed, firstAttempt: attempt.firstAttempt, competencyIds: activity.competencyIds }, reliability: { method: "automatically_scored", limitations: ["Single activity result; not a mastery determination."] }, provenance: { contentSchemaVersion: activity.schemaVersion, activityType: activity.type }, idempotencyKey: `${actor.uid}:${lessonId}:${activityId}:${attempt.attemptNumber}` });
    return { attempt, explanation: activity.explanation ?? null };
  },

  async createCourse(actor: AuthenticatedActor, title: string, description: string, subject: Course["subject"]): Promise<Course> {
    const memberships = await getServerFirestore().collection("user-memberships").doc(actor.uid).collection("organizations").get();
    const membership = memberships.docs.find((snapshot) => (["owner", "admin", "teacher"] as TeacherRole[]).includes((snapshot.data().role as TeacherRole)));
    if (!membership) throw new Error("A teacher organization membership is required.");
    const reference = getServerFirestore().collection("courses").doc();
    const now = new Date().toISOString();
    const course: Course = { id: reference.id, orgId: membership.id, authorId: actor.uid, title, description, subject, status: "draft", isTemplate: false, moduleIds: [], createdAt: now, updatedAt: now };
    await reference.set(course);
    return course;
  },

  async updateCourse(actor: AuthenticatedActor, courseId: string, title: string, description: string): Promise<Course> {
    const course = await getCourseOrThrow(courseId);
    await requireTeacher(actor.uid, course.orgId);
    const updatedCourse: Course = { ...course, title, description, updatedAt: new Date().toISOString() };
    await getServerFirestore().collection("courses").doc(courseId).set(updatedCourse);
    return updatedCourse;
  },

  async addModule(actor: AuthenticatedActor, courseId: string, title: string, order: number): Promise<Module> {
    const course = await getCourseOrThrow(courseId);
    await requireTeacher(actor.uid, course.orgId);
    const reference = getServerFirestore().collection("modules").doc();
    const module: Module = { id: reference.id, courseId, title, order, lessonIds: [] };
    await getServerFirestore().runTransaction(async (transaction) => {
      transaction.set(reference, module);
      transaction.update(getServerFirestore().collection("courses").doc(courseId), { moduleIds: FieldValue.arrayUnion(reference.id), updatedAt: new Date().toISOString() });
    });
    return module;
  },

  async saveLesson(actor: AuthenticatedActor, moduleId: string, title: string, contentBlocks: ContentBlock[], order: number, estimatedMinutes: number): Promise<Lesson> {
    const moduleSnapshot = await getServerFirestore().collection("modules").doc(moduleId).get();
    if (!moduleSnapshot.exists) throw new Error("Module not found.");
    const module = asModule(moduleSnapshot.data()!);
    const course = await getCourseOrThrow(module.courseId);
    await requireTeacher(actor.uid, course.orgId);
    validateLessonContentBlocks(contentBlocks);
    const reference = getServerFirestore().collection("lessons").doc();
    const lesson: Lesson = { id: reference.id, moduleId, title, contentBlocks, order, estimatedMinutes };
    await getServerFirestore().runTransaction(async (transaction) => {
      transaction.set(reference, lesson);
      transaction.update(moduleSnapshot.ref, { lessonIds: FieldValue.arrayUnion(reference.id) });
    });
    return lesson;
  },

  async updateLesson(actor: AuthenticatedActor, lessonId: string, title: string, contentBlocks: ContentBlock[]): Promise<Lesson> {
    const lessonSnapshot = await getServerFirestore().collection("lessons").doc(lessonId).get();
    if (!lessonSnapshot.exists) throw new Error("Lesson not found.");
    const lesson = asLesson(lessonSnapshot.data()!);
    const moduleSnapshot = await getServerFirestore().collection("modules").doc(lesson.moduleId).get();
    if (!moduleSnapshot.exists) throw new Error("Module not found.");
    const module = asModule(moduleSnapshot.data()!);
    const course = await getCourseOrThrow(module.courseId);
    await requireTeacher(actor.uid, course.orgId);
    validateLessonContentBlocks(contentBlocks);
    const updatedLesson: Lesson = { ...lesson, title, contentBlocks };
    await getServerFirestore().runTransaction(async (transaction) => {
      transaction.set(lessonSnapshot.ref, updatedLesson);
      transaction.update(getServerFirestore().collection("courses").doc(course.id), { updatedAt: new Date().toISOString() });
    });
    return updatedLesson;
  },

  async deleteLesson(actor: AuthenticatedActor, lessonId: string): Promise<void> {
    const lessonSnapshot = await getServerFirestore().collection("lessons").doc(lessonId).get();
    if (!lessonSnapshot.exists) throw new Error("Lesson not found.");
    const lesson = asLesson(lessonSnapshot.data()!);
    const moduleSnapshot = await getServerFirestore().collection("modules").doc(lesson.moduleId).get();
    if (!moduleSnapshot.exists) throw new Error("Module not found.");
    const module = asModule(moduleSnapshot.data()!);
    const course = await getCourseOrThrow(module.courseId);
    await requireTeacher(actor.uid, course.orgId);
    await getServerFirestore().runTransaction(async (transaction) => {
      transaction.delete(lessonSnapshot.ref);
      transaction.update(moduleSnapshot.ref, { lessonIds: FieldValue.arrayRemove(lessonId) });
      transaction.update(getServerFirestore().collection("courses").doc(course.id), { updatedAt: new Date().toISOString() });
    });
  },

  async publishCourse(actor: AuthenticatedActor, courseId: string): Promise<void> {
    const course = await getCourseOrThrow(courseId);
    await requireTeacher(actor.uid, course.orgId);
    await getServerFirestore().collection("courses").doc(courseId).update({ status: "published", updatedAt: new Date().toISOString() });
  },
};

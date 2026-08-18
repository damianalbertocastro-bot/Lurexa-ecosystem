import { FieldValue } from "firebase-admin/firestore";
import { getServerFirebaseAuth, getServerFirestore } from "./firebase-admin.server";
import type { ContentBlock, Course, Lesson, Module, StudentProgress } from "@lurexa/types";

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

  async getLesson(actor: AuthenticatedActor, courseId: string, lessonId: string): Promise<{ lesson: Lesson; progress: StudentProgress | null }> {
    const course = await getCourseOrThrow(courseId);
    if (course.status !== "published") throw new Error("This course is not published.");
    await requireMembership(actor.uid, course.orgId);
    const entry = (await getCourseLessons(course)).find(({ lesson }) => lesson.id === lessonId);
    if (!entry) throw new Error("Lesson not found in this course.");
    const progress = await getServerFirestore().collection("progress").doc(`${actor.uid}_${lessonId}`).get();
    return { lesson: entry.lesson, progress: progress.exists ? (progress.data() as StudentProgress) : null };
  },

  async completeLesson(actor: AuthenticatedActor, courseId: string, lessonId: string, timeSpentSeconds: number): Promise<StudentProgress> {
    const { lesson } = await this.getLesson(actor, courseId, lessonId);
    const record: StudentProgress = {
      id: `${actor.uid}_${lessonId}`, studentId: actor.uid, lessonId, moduleId: lesson.moduleId, courseId,
      completed: true, timeSpentSeconds: Math.max(0, Math.min(Math.round(timeSpentSeconds), 86_400)), attempts: [],
      lastAccessedAt: new Date().toISOString(),
    };
    await getServerFirestore().collection("progress").doc(record.id).set({ ...record, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return record;
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

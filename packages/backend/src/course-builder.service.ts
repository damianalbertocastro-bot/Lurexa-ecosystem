import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Course, Module, Lesson, ContentBlock, Question } from "@lurexa/types";

export const CourseBuilderService = {
  /**
   * Create a new empty course draft
   */
  async createCourse(
    orgId: string,
    authorId: string,
    title: string,
    description: string,
    subject: Course["subject"]
  ): Promise<Course> {
    const courseId = doc(collection(db, "courses")).id;

    const newCourse: Course = {
      id: courseId,
      orgId,
      authorId,
      title,
      description,
      subject,
      status: "draft",
      isTemplate: false,
      moduleIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "courses", courseId), newCourse);
    return newCourse;
  },

  /**
   * Add a module to a course
   */
  async addModule(courseId: string, title: string, order: number): Promise<Module> {
    const moduleId = doc(collection(db, "modules")).id;

    const newModule: Module = {
      id: moduleId,
      courseId,
      title,
      order,
      lessonIds: [],
    };

    await setDoc(doc(db, "modules", moduleId), newModule);

    // Link module to course
    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, {
      moduleIds: arrayUnion(moduleId),
      updatedAt: new Date().toISOString(),
    });

    return newModule;
  },

  /**
   * Save or update a lesson with content blocks
   */
  async saveLesson(
    moduleId: string,
    lessonId: string | null,
    title: string,
    contentBlocks: ContentBlock[],
    order: number,
    estimatedMinutes: number
  ): Promise<Lesson> {
    const finalLessonId = lessonId || doc(collection(db, "lessons")).id;

    const lesson: Lesson = {
      id: finalLessonId,
      moduleId,
      title,
      contentBlocks,
      order,
      estimatedMinutes,
    };

    await setDoc(doc(db, "lessons", finalLessonId), lesson, { merge: true });

    if (!lessonId) {
      const moduleRef = doc(db, "modules", moduleId);
      await updateDoc(moduleRef, {
        lessonIds: arrayUnion(finalLessonId),
      });
    }

    return lesson;
  },
};
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { StudentProgress } from "@lurexa/types";

export const ProgressService = {
  async getStudentLessonProgress(
    studentId: string,
    lessonId: string
  ): Promise<StudentProgress | null> {
    const progressId = `${studentId}_${lessonId}`;
    const ref = doc(db, "progress", progressId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as StudentProgress;
  },

  /**
   * Direct browser writes are intentionally disabled because progress is an
   * authoritative Core record. Product code must submit learning actions to a
   * trusted server boundary such as CoursePlatformService/API routes instead.
   */
  async syncProgress(progress: StudentProgress): Promise<void> {
    void progress;
    throw new Error("Direct progress writes are disabled. Use the trusted Core learning API.");
  },
};

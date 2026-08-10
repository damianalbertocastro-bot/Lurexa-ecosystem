import { doc, getDoc, setDoc } from "firebase/firestore";
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

  async syncProgress(progress: StudentProgress): Promise<void> {
    const progressId = `${progress.studentId}_${progress.lessonId}`;
    const ref = doc(db, "progress", progressId);
    await setDoc(ref, progress, { merge: true });
  },
};
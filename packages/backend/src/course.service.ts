import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Course, Lesson } from "@lurexa/types";

export const CourseService = {
  async getCoursesByOrg(orgId: string): Promise<Course[]> {
    const q = query(collection(db, "courses"), where("orgId", "==", orgId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Course));
  },

  async getCourseById(courseId: string): Promise<Course | null> {
    const ref = doc(db, "courses", courseId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Course;
  },

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    const ref = doc(db, "lessons", lessonId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Lesson;
  },

  /** @deprecated Authoritative course mutations must use the trusted Core API. */
  async saveCourse(_course: Course): Promise<never> {
    throw new Error(
      "Direct browser course writes are disabled. Use the authenticated Lurexa Core learning API.",
    );
  },
};
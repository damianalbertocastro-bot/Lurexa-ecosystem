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

const trustedWriteError =
  "Direct course writes are disabled. Use the trusted Learn /api/learning CoursePlatform boundary.";

export const CourseService = {
  async getCoursesByOrg(orgId: string): Promise<Course[]> {
    const q = query(collection(db, "courses"), where("orgId", "==", orgId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((courseDoc) => ({ id: courseDoc.id, ...courseDoc.data() } as Course));
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

  /**
   * @deprecated Course is an authoritative Core record. Browser-side writes are
   * intentionally blocked; product code must use the trusted Learn API route.
   */
  async saveCourse(course: Course): Promise<void> {
    void course;
    throw new Error(trustedWriteError);
  },
};

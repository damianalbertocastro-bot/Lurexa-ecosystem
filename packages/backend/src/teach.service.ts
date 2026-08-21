import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { TEACH_MVP_COURSES, TEACH_MVP_CREDENTIALS } from "./teach-catalog";
import type {
  EducatorProfile,
  TeachAssessmentDomain,
  TeachAssessmentRequest,
  TeachCommunityPost,
  TeachCourse,
  TeachCredentialAward,
  TeachCredentialDefinition,
  TeachEnrollment,
  TeachEvidenceSubmission,
  TeachRecommendation,
} from "@lurexa/types";

const now = () => new Date().toISOString();

export const TeachService = {
  async getEducatorProfile(userId: string): Promise<EducatorProfile | null> {
    const snap = await getDoc(doc(db, "educatorProfiles", userId));
    return snap.exists() ? ({ ...snap.data(), userId: snap.id } as EducatorProfile) : null;
  },
  async upsertEducatorProfile(profile: EducatorProfile): Promise<void> {
    await setDoc(doc(db, "educatorProfiles", profile.userId), { ...profile, updatedAt: now() }, { merge: true });
  },
  async listPublishedCourses(): Promise<TeachCourse[]> {
    try {
      const snap = await getDocs(query(collection(db, "teachCourses"), where("published", "==", true)));
      if (!snap.empty) return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachCourse));
    } catch {
      // The code-first catalog keeps the MVP usable before Firestore course seeding is deployed.
    }
    return TEACH_MVP_COURSES;
  },
  async getCourse(courseId: string): Promise<TeachCourse | null> {
    try {
      const snap = await getDoc(doc(db, "teachCourses", courseId));
      if (snap.exists()) return { id: snap.id, ...snap.data() } as TeachCourse;
    } catch {
      // Fall through to the code-first catalog until trusted course seeding is deployed.
    }
    return TEACH_MVP_COURSES.find((course) => course.id === courseId) ?? null;
  },
  async listEnrollments(userId: string): Promise<TeachEnrollment[]> {
    const snap = await getDocs(query(collection(db, "teachEnrollments"), where("userId", "==", userId)));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachEnrollment));
  },
  async enroll(userId: string, courseId: string): Promise<TeachEnrollment> {
    const existing = await getDocs(query(collection(db, "teachEnrollments"), where("userId", "==", userId), where("courseId", "==", courseId)));
    if (!existing.empty) return { id: existing.docs[0]!.id, ...existing.docs[0]!.data() } as TeachEnrollment;
    const timestamp = now();
    const payload = { userId, courseId, status: "active" as const, completedModuleIds: [], progressPercent: 0, enrolledAt: timestamp, updatedAt: timestamp };
    const ref = await addDoc(collection(db, "teachEnrollments"), payload);
    return { id: ref.id, ...payload };
  },
  async updateEnrollmentProgress(enrollmentId: string, completedModuleIds: string[], totalModules: number): Promise<void> {
    const progressPercent = totalModules <= 0 ? 0 : Math.min(100, Math.round((completedModuleIds.length / totalModules) * 100));
    const timestamp = now();
    await updateDoc(doc(db, "teachEnrollments", enrollmentId), { completedModuleIds, progressPercent, status: progressPercent === 100 ? "completed" : "active", updatedAt: timestamp, ...(progressPercent === 100 ? { completedAt: timestamp } : {}) });
  },
  async listCommunityPosts(circleId?: string): Promise<TeachCommunityPost[]> {
    const base = collection(db, "teachCommunityPosts");
    const snap = await getDocs(circleId ? query(base, where("circleId", "==", circleId), orderBy("createdAt", "desc")) : query(base, orderBy("createdAt", "desc")));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachCommunityPost));
  },
  async createCommunityPost(input: Omit<TeachCommunityPost, "id" | "createdAt" | "updatedAt">): Promise<TeachCommunityPost> {
    const timestamp = now();
    const payload = { ...input, createdAt: timestamp, updatedAt: timestamp };
    const ref = await addDoc(collection(db, "teachCommunityPosts"), payload);
    return { id: ref.id, ...payload };
  },
  async listEvidence(userId: string): Promise<TeachEvidenceSubmission[]> {
    const snap = await getDocs(query(collection(db, "teachEvidence"), where("userId", "==", userId), orderBy("createdAt", "desc")));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachEvidenceSubmission));
  },
  async submitEvidence(input: Omit<TeachEvidenceSubmission, "id" | "createdAt" | "updatedAt" | "reviewedAt" | "reviewerId" | "verifiedAt" | "reviewerNote">): Promise<TeachEvidenceSubmission> {
    const timestamp = now();
    const payload = { ...input, createdAt: timestamp, updatedAt: timestamp };
    const ref = await addDoc(collection(db, "teachEvidence"), payload);
    return { id: ref.id, ...payload };
  },
  async requestAssessment(userId: string, domains: TeachAssessmentDomain[], requestedCompetencyIds: string[], educatorNote?: string): Promise<TeachAssessmentRequest> {
    const timestamp = now();
    const payload = { userId, domains, requestedCompetencyIds, status: "requested" as const, ...(educatorNote?.trim() ? { educatorNote: educatorNote.trim() } : {}), requestedAt: timestamp, updatedAt: timestamp };
    const ref = await addDoc(collection(db, "teachAssessments"), payload);
    return { id: ref.id, ...payload };
  },
  async listAssessments(userId: string): Promise<TeachAssessmentRequest[]> {
    const snap = await getDocs(query(collection(db, "teachAssessments"), where("userId", "==", userId), orderBy("requestedAt", "desc")));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachAssessmentRequest));
  },
  async listCredentialDefinitions(): Promise<TeachCredentialDefinition[]> {
    try {
      const snap = await getDocs(query(collection(db, "teachCredentialDefinitions"), where("active", "==", true)));
      if (!snap.empty) return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachCredentialDefinition));
    } catch {
      // Use the canonical MVP definitions until credential authoring is server-backed.
    }
    return TEACH_MVP_CREDENTIALS;
  },
  async listCredentialAwards(userId: string): Promise<TeachCredentialAward[]> {
    const snap = await getDocs(query(collection(db, "teachCredentialAwards"), where("userId", "==", userId)));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachCredentialAward));
  },
  async listRecommendations(userId: string): Promise<TeachRecommendation[]> {
    const snap = await getDocs(query(collection(db, "teachRecommendations"), where("userId", "==", userId), where("status", "==", "active"), orderBy("createdAt", "desc")));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachRecommendation));
  },
  async updateRecommendationStatus(id: string, status: TeachRecommendation["status"]): Promise<void> {
    await updateDoc(doc(db, "teachRecommendations", id), { status });
  },
};

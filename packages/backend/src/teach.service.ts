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
  TeachCommunityPost,
  TeachCourse,
  TeachCredentialAward,
  TeachCredentialDefinition,
  TeachEnrollment,
  TeachEvidenceSubmission,
  TeachRecommendation,
} from "@lurexa/types";

const now = () => new Date().toISOString();
const cefrRank = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;

export function evaluateTeachCredential(
  definition: TeachCredentialDefinition,
  profile: EducatorProfile | null,
  enrollments: TeachEnrollment[],
  evidence: TeachEvidenceSubmission[],
) {
  const requirementResults = definition.requirements.map((requirement) => {
    if (requirement.type === "course-completion") {
      const met = enrollments.some((item) => item.courseId === requirement.courseId && item.status === "completed");
      return { requirementId: requirement.id, met };
    }
    if (requirement.type === "verified-evidence") {
      const verified = evidence.filter((item) => item.status === "verified" && (!requirement.competencyId || item.competencyIds.includes(requirement.competencyId)));
      return { requirementId: requirement.id, met: verified.length >= (requirement.minimumCount ?? 1) };
    }
    if (requirement.type === "competency-level") {
      const competency = profile?.competencies.find((item) => item.id === requirement.competencyId);
      return { requirementId: requirement.id, met: (competency?.level ?? 0) >= (requirement.minimumLevel ?? 1) };
    }
    if (requirement.type === "cefr-level") {
      const current = profile?.cefrLevel ? cefrRank[profile.cefrLevel] : 0;
      const target = requirement.cefrLevel ? cefrRank[requirement.cefrLevel] : 0;
      return { requirementId: requirement.id, met: current >= target };
    }
    return { requirementId: requirement.id, met: false };
  });
  return { eligible: requirementResults.every((item) => item.met), requirements: requirementResults };
}

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
      const q = query(collection(db, "teachCourses"), where("published", "==", true));
      const snap = await getDocs(q);
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
      // Fall through to the code-first catalog.
    }
    return TEACH_MVP_COURSES.find((course) => course.id === courseId) ?? null;
  },

  async listEnrollments(userId: string): Promise<TeachEnrollment[]> {
    const q = query(collection(db, "teachEnrollments"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachEnrollment));
  },

  async enroll(userId: string, courseId: string): Promise<TeachEnrollment> {
    const existingQuery = query(
      collection(db, "teachEnrollments"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
    );
    const existing = await getDocs(existingQuery);
    if (!existing.empty) return { id: existing.docs[0]!.id, ...existing.docs[0]!.data() } as TeachEnrollment;

    const timestamp = now();
    const payload = {
      userId,
      courseId,
      status: "active" as const,
      completedModuleIds: [],
      progressPercent: 0,
      enrolledAt: timestamp,
      updatedAt: timestamp,
    };
    const ref = await addDoc(collection(db, "teachEnrollments"), payload);
    return { id: ref.id, ...payload };
  },

  async updateEnrollmentProgress(enrollmentId: string, completedModuleIds: string[], totalModules: number): Promise<void> {
    const progressPercent = totalModules <= 0 ? 0 : Math.min(100, Math.round((completedModuleIds.length / totalModules) * 100));
    const timestamp = now();
    await updateDoc(doc(db, "teachEnrollments", enrollmentId), {
      completedModuleIds,
      progressPercent,
      status: progressPercent === 100 ? "completed" : "active",
      updatedAt: timestamp,
      ...(progressPercent === 100 ? { completedAt: timestamp } : {}),
    });
  },

  async listCommunityPosts(circleId?: string): Promise<TeachCommunityPost[]> {
    const base = collection(db, "teachCommunityPosts");
    const q = circleId
      ? query(base, where("circleId", "==", circleId), orderBy("createdAt", "desc"))
      : query(base, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachCommunityPost));
  },

  async createCommunityPost(input: Omit<TeachCommunityPost, "id" | "createdAt" | "updatedAt">): Promise<TeachCommunityPost> {
    const timestamp = now();
    const payload = { ...input, createdAt: timestamp, updatedAt: timestamp };
    const ref = await addDoc(collection(db, "teachCommunityPosts"), payload);
    return { id: ref.id, ...payload };
  },

  async listEvidence(userId: string): Promise<TeachEvidenceSubmission[]> {
    const q = query(collection(db, "teachEvidence"), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachEvidenceSubmission));
  },

  async submitEvidence(input: Omit<TeachEvidenceSubmission, "id" | "createdAt" | "updatedAt" | "verifiedAt" | "reviewerNote">): Promise<TeachEvidenceSubmission> {
    const timestamp = now();
    const payload = { ...input, createdAt: timestamp, updatedAt: timestamp };
    const ref = await addDoc(collection(db, "teachEvidence"), payload);
    return { id: ref.id, ...payload };
  },

  async listCredentialDefinitions(): Promise<TeachCredentialDefinition[]> {
    try {
      const q = query(collection(db, "teachCredentialDefinitions"), where("active", "==", true));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachCredentialDefinition));
    } catch {
      // Use the canonical MVP definitions until credential authoring is server-backed.
    }
    return TEACH_MVP_CREDENTIALS;
  },

  async listCredentialAwards(userId: string): Promise<TeachCredentialAward[]> {
    const q = query(collection(db, "teachCredentialAwards"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachCredentialAward));
  },

  async listRecommendations(userId: string): Promise<TeachRecommendation[]> {
    const q = query(
      collection(db, "teachRecommendations"),
      where("userId", "==", userId),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() } as TeachRecommendation));
  },

  async updateRecommendationStatus(id: string, status: TeachRecommendation["status"]): Promise<void> {
    await updateDoc(doc(db, "teachRecommendations", id), { status });
  },
};

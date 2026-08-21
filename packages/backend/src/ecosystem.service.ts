import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface BranchingScenarioNode {
  id: string;
  title: string;
  contentMarkdown: string;
  videoUrl?: string;
  choiceOptions: Array<{
    label: string;
    nextNodeId: string;
    isCorrectPath: boolean;
  }>;
}

export interface StudioCourseBranch {
  courseId: string;
  rootNodeId: string;
  nodes: Record<string, BranchingScenarioNode>;
}

export interface VoiceCoachingSession {
  id: string;
  studentId: string;
  subject: string;
  targetTopic: string;
  transcript: Array<{ sender: "coach" | "student"; text: string; timestamp: string }>;
  sessionDurationSeconds: number;
  aiPronunciationScore?: number;
  createdAt: string;
}

export interface LiveClassroomSession {
  id: string;
  orgId: string;
  teacherId: string;
  courseId: string;
  activeWhiteboardDataJson: string;
  breakoutRooms: Array<{ roomId: string; name: string; studentIds: string[] }>;
  status: "scheduled" | "live" | "ended";
  startedAt?: string;
}

export interface InstitutionalAPIKey {
  keyId: string;
  orgId: string;
  apiKeyHash: string;
  rateLimitPerMin: number;
  status: "active" | "revoked";
  createdAt: string;
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashApiKey(rawKey: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawKey));
  return bytesToHex(new Uint8Array(digest));
}

function createRawApiKey(): string {
  const random = new Uint8Array(32);
  crypto.getRandomValues(random);
  return `lurexa_live_${bytesToHex(random)}`;
}

export const EcosystemService = {
  async saveBranchingScenario(scenario: StudioCourseBranch): Promise<void> {
    await setDoc(doc(db, "studio_scenarios", scenario.courseId), scenario, { merge: true });
  },

  async createVoiceCoachingSession(
    studentId: string,
    subject: string,
    targetTopic: string,
  ): Promise<VoiceCoachingSession> {
    const sessionId = doc(collection(db, "coach_sessions")).id;
    const session: VoiceCoachingSession = {
      id: sessionId,
      studentId,
      subject,
      targetTopic,
      transcript: [{
        sender: "coach",
        text: `Welcome to Lurexa Coach. Let’s practice ${targetTopic}.`,
        timestamp: new Date().toISOString(),
      }],
      sessionDurationSeconds: 0,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "coach_sessions", sessionId), session);
    return session;
  },

  async startLiveClassroom(
    orgId: string,
    teacherId: string,
    courseId: string,
  ): Promise<LiveClassroomSession> {
    const sessionId = doc(collection(db, "classroom_sessions")).id;
    const session: LiveClassroomSession = {
      id: sessionId,
      orgId,
      teacherId,
      courseId,
      activeWhiteboardDataJson: JSON.stringify({ strokeHistory: [] }),
      breakoutRooms: [],
      status: "live",
      startedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "classroom_sessions", sessionId), session);
    return session;
  },

  /** Returns the raw key exactly once. Only the SHA-256 digest is persisted. */
  async generateAPIKey(orgId: string, rateLimit = 1000): Promise<{ keyId: string; rawKey: string }> {
    const keyId = doc(collection(db, "api_keys")).id;
    const rawKey = createRawApiKey();
    const record: InstitutionalAPIKey = {
      keyId,
      orgId,
      apiKeyHash: await hashApiKey(rawKey),
      rateLimitPerMin: rateLimit,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "api_keys", keyId), record);
    return { keyId, rawKey };
  },
};

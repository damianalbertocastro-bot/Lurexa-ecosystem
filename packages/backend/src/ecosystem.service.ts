import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// --- 1. Lurexa Studio Types & Service ---
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

// --- 2. Lurexa Coach Types & Service ---
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

// --- 3. Lurexa Classroom Types & Service ---
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

// --- 4. Lurexa API Key System ---
export interface InstitutionalAPIKey {
  keyId: string;
  orgId: string;
  apiKeyHash: string;
  rateLimitPerMin: number;
  status: "active" | "revoked";
  createdAt: string;
}

export const EcosystemService = {
  // Lurexa Studio: Save interactive branching scenario
  async saveBranchingScenario(scenario: StudioCourseBranch): Promise<void> {
    const ref = doc(db, "studio_scenarios", scenario.courseId);
    await setDoc(ref, scenario, { merge: true });
  },

  // Lurexa Coach: Start and record voice session logs
  async createVoiceCoachingSession(
    studentId: string,
    subject: string,
    targetTopic: string
  ): Promise<VoiceCoachingSession> {
    const sessionId = doc(collection(db, "coach_sessions")).id;
    const session: VoiceCoachingSession = {
      id: sessionId,
      studentId,
      subject,
      targetTopic,
      transcript: [
        {
          sender: "coach",
          text: `Welcome! I am your AI Coach for ${subject}. Let's practice ${targetTopic}.`,
          timestamp: new Date().toISOString(),
        },
      ],
      sessionDurationSeconds: 0,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "coach_sessions", sessionId), session);
    return session;
  },

  // Lurexa Classroom: Initialize live collaborative session
  async startLiveClassroom(
    orgId: string,
    teacherId: string,
    courseId: string
  ): Promise<LiveClassroomSession> {
    const sessionId = doc(collection(db, "classroom_sessions")).id;
    const session: LiveClassroomSession = {
      id: sessionId,
      orgId,
      teacherId,
      courseId,
      activeWhiteboardDataJson: JSON.stringify({ strokeHistory: [] }),
      breakoutRooms: [
        { roomId: "room_1", name: "Breakout Group A", studentIds: [] },
        { roomId: "room_2", name: "Breakout Group B", studentIds: [] },
      ],
      status: "live",
      startedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "classroom_sessions", sessionId), session);
    return session;
  },

  // Lurexa API: Issue institutional API Key
  async generateAPIKey(orgId: string, rateLimit = 1000): Promise<{ keyId: string; rawKey: string }> {
    const keyId = doc(collection(db, "api_keys")).id;
    const rawKey = `lurexa_live_${Math.random().toString(36).substring(2)}${Date.now()}`;

    const record: InstitutionalAPIKey = {
      keyId,
      orgId,
      apiKeyHash: rawKey, // In production, store SHA-256 hash
      rateLimitPerMin: rateLimit,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "api_keys", keyId), record);
    return { keyId, rawKey };
  },
};

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

const retiredClientMutation = (capability: string): Error => new Error(
  `${capability} is not available through the legacy client EcosystemService. Use the governed product/server boundary instead.`,
);

/**
 * @deprecated Historical compatibility facade.
 *
 * This service previously bundled Studio, Coach, classroom, and institutional
 * API capabilities into one browser-side Firestore abstraction. Those domains
 * now require separate product/layer ownership and trusted server boundaries.
 * Methods remain temporarily for import compatibility, but all mutations fail
 * closed so future concepts cannot write production-looking records directly.
 */
export const EcosystemService = {
  async saveBranchingScenario(scenario: StudioCourseBranch): Promise<void> {
    void scenario;
    throw retiredClientMutation("Scenario persistence");
  },

  async createVoiceCoachingSession(
    studentId: string,
    subject: string,
    targetTopic: string,
  ): Promise<VoiceCoachingSession> {
    void studentId;
    void subject;
    void targetTopic;
    throw retiredClientMutation("Voice coaching session creation");
  },

  async startLiveClassroom(
    orgId: string,
    teacherId: string,
    courseId: string,
  ): Promise<LiveClassroomSession> {
    void orgId;
    void teacherId;
    void courseId;
    throw retiredClientMutation("Live classroom creation");
  },

  async generateAPIKey(
    orgId: string,
    rateLimit = 1000,
  ): Promise<{ keyId: string; rawKey: string }> {
    void orgId;
    void rateLimit;
    throw new Error(
      "Institutional API-key issuance is server-only. Use @lurexa/backend/institutional-api-key.server from an authorized server route.",
    );
  },
};

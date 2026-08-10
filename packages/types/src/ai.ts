export type AIMessageRole = "system" | "user" | "assistant";

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: string;
  flagged?: boolean;
}

export interface AIConversation {
  id: string;
  studentId: string;
  lessonId: string;
  orgId: string;
  messages: AIMessage[];
  modelUsed: "gpt-4o" | "claude-3.5-sonnet";
  tokenCount: number;
  createdAt: string;
  updatedAt: string;
}
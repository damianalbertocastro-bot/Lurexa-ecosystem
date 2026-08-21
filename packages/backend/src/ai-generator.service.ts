import { Question } from "@lurexa/types";

export interface PrototypeLessonDraft {
  title: string;
  summary: string;
  contentMarkdown: string;
  suggestedQuestions: Question[];
}

/**
 * Deterministic prototype content used to exercise authoring interfaces.
 *
 * This service does not call Lurexa Mind, an LLM provider, or any external AI
 * system. Production generation must be implemented behind a trusted server
 * boundary with provider policy, pedagogical constraints, provenance, cost
 * controls, moderation, and educator review.
 */
export const PrototypeContentService = {
  async generateLessonDraft(
    topic: string,
    targetLevel: string,
  ): Promise<PrototypeLessonDraft> {
    return {
      title: `${topic} (${targetLevel})`,
      summary: `Prototype draft covering ${topic} for level ${targetLevel}.`,
      contentMarkdown: `## Overview of ${topic}\n\nPrototype concepts and practice examples go here.`,
      suggestedQuestions: [
        {
          id: "prototype-q1",
          type: "multiple_choice",
          prompt: `Which option best matches the prototype rule for ${topic}?`,
          options: ["Option A", "Option B", "Option C"],
          correctAnswer: "Option A",
          explanation: "Prototype feedback only. Replace this content before publishing.",
        },
      ],
    };
  },
};

/** @deprecated Use PrototypeContentService. This alias remains temporarily for compatibility. */
export const AIGeneratorService = PrototypeContentService;
/** @deprecated Use PrototypeLessonDraft. */
export type AILessonDraft = PrototypeLessonDraft;

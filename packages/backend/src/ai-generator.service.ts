import { Question } from "@lurexa/types";

export interface AILessonDraft {
  title: string;
  summary: string;
  contentMarkdown: string;
  suggestedQuestions: Question[];
}

export const AIGeneratorService = {
  /**
   * Server-side AI prompt trigger for generating lesson drafts
   */
  async generateLessonDraft(
    topic: string,
    targetLevel: string
  ): Promise<AILessonDraft> {
    // API endpoint call to OpenAI / Anthropic server-side route
    return {
      title: `${topic} (${targetLevel})`,
      summary: `Automated draft covering ${topic} tailored for level ${targetLevel}.`,
      contentMarkdown: `## Overview of ${topic}\n\nKey concepts and practice examples go here.`,
      suggestedQuestions: [
        {
          id: "q1",
          type: "multiple_choice",
          prompt: `What is the primary rule of ${topic}?`,
          options: ["Option A", "Option B", "Option C"],
          correctAnswer: "Option A",
          explanation: "Option A directly matches the lesson explanation.",
        },
      ],
    };
  },
};
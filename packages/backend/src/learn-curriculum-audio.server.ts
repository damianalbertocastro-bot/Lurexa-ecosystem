import type { AuthenticatedActor } from "./course-platform.server";
import { resolveLearningCapability } from "./learning-capability.server";

const SPEECH_ENDPOINT = "https://api.openai.com/v1/audio/speech";
const SPEECH_MODEL = "gpt-4o-mini-tts";
const SPEECH_VOICE = "coral";

function instructionsFor(playbackGoal: "meaning" | "noticing" | "pronunciation_model"): string {
  if (playbackGoal === "pronunciation_model") {
    return "Speak clearly and naturally as an English pronunciation model. Preserve natural connected speech, stress, rhythm, and intonation without exaggeration or accent-erasure framing.";
  }
  if (playbackGoal === "noticing") {
    return "Speak clearly and naturally for an English learner. Use a warm tone, moderate pace, clear phrase boundaries, and natural English stress so the learner can notice useful language patterns.";
  }
  return "Speak naturally and clearly for comprehension. Use a warm tone and an accessible pace while preserving authentic English rhythm and connected speech.";
}

function resolveOpenAIApiKey(): string | null {
  return process.env.OPENAI_KEY_tutor?.trim()
    || process.env.OPENAI_API_KEY?.trim()
    || null;
}

export const LearnCurriculumAudioService = {
  async generate(input: {
    actor: AuthenticatedActor;
    courseId: string;
    lessonId: string;
    activityId: string;
  }): Promise<{ bytes: ArrayBuffer; contentType: string }> {
    const capability = await resolveLearningCapability(input);
    const audioInput = capability.kind === "model_listening"
      ? capability.modelText
      : capability.kind === "recorded_speaking"
        ? capability.targetText?.trim()
        : null;
    const playbackGoal = capability.kind === "model_listening" ? capability.playbackGoal : "pronunciation_model";

    if (!audioInput) {
      throw new Error(
        capability.kind === "recorded_speaking"
          ? "This speaking activity does not include trusted target text for a pronunciation model."
          : "This activity does not support curriculum audio.",
      );
    }

    const apiKey = resolveOpenAIApiKey();
    if (!apiKey) throw new Error("Production curriculum audio is not configured yet.");

    const response = await fetch(SPEECH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: SPEECH_MODEL,
        input: audioInput,
        voice: SPEECH_VOICE,
        instructions: instructionsFor(playbackGoal),
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      throw new Error(`Curriculum audio provider request failed (${response.status}).`);
    }

    return {
      bytes: await response.arrayBuffer(),
      contentType: response.headers.get("content-type") || "audio/mpeg",
    };
  },
};

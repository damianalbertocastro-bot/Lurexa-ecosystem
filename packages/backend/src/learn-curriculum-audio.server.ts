import { TextToSpeechClient } from "@google-cloud/text-to-speech";

import type { AuthenticatedActor } from "./course-platform.server";
import { getRawServiceAccountJson } from "./firebase-admin.server";
import { resolveLearningCapability } from "./learning-capability.server";

const DEFAULT_LANGUAGE_CODE = "en-US";
const DEFAULT_VOICE = "en-US-Neural2-F";

type GoogleServiceAccount = { project_id?: unknown; client_email?: unknown; private_key?: unknown };

function createTextToSpeechClient(): TextToSpeechClient {
  const serialized = getRawServiceAccountJson();
  if (!serialized) throw new Error("Production curriculum audio is not configured yet.");
  let serviceAccount: GoogleServiceAccount;
  try { serviceAccount = JSON.parse(serialized) as GoogleServiceAccount; } catch { throw new Error("Production curriculum audio is not configured yet."); }
  if (typeof serviceAccount.project_id !== "string" || typeof serviceAccount.client_email !== "string" || typeof serviceAccount.private_key !== "string") {
    throw new Error("Production curriculum audio is not configured yet.");
  }
  return new TextToSpeechClient({ projectId: serviceAccount.project_id, credentials: { client_email: serviceAccount.client_email, private_key: serviceAccount.private_key.replace(/\\n/g, "\n") } });
}

function toArrayBuffer(audioContent: Uint8Array | string): ArrayBuffer {
  const bytes = typeof audioContent === "string" ? Buffer.from(audioContent, "base64") : Buffer.from(audioContent);
  return Uint8Array.from(bytes).buffer;
}

export const LearnCurriculumAudioService = {
  async generate(input: { actor: AuthenticatedActor; courseId: string; lessonId: string; activityId: string }): Promise<{ bytes: ArrayBuffer; contentType: string }> {
    const capability = await resolveLearningCapability(input);
    const audioInput = capability.kind === "model_listening" ? capability.modelText : capability.kind === "recorded_speaking" ? capability.targetText?.trim() : null;
    if (!audioInput) throw new Error(capability.kind === "recorded_speaking" ? "This speaking activity does not include trusted target text for a pronunciation model." : "This activity does not support curriculum audio.");
    try {
      const [response] = await createTextToSpeechClient().synthesizeSpeech({
        input: { text: audioInput },
        voice: { languageCode: DEFAULT_LANGUAGE_CODE, name: process.env.LUREXA_LEARN_TTS_VOICE?.trim() || DEFAULT_VOICE },
        audioConfig: { audioEncoding: "MP3" },
      });
      if (!response.audioContent) throw new Error("Curriculum audio provider returned an empty response.");
      return { bytes: toArrayBuffer(response.audioContent), contentType: "audio/mpeg" };
    } catch (error) {
      if (error instanceof Error && error.message === "Production curriculum audio is not configured yet.") throw error;
      console.error("Learn curriculum audio provider request failed.", error instanceof Error ? error.name : "unknown error");
      throw new Error("Curriculum audio provider request failed.");
    }
  },
};

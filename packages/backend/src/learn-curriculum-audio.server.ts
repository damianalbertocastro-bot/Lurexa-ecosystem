import { TextToSpeechClient } from "@google-cloud/text-to-speech";

import type { AuthenticatedActor } from "./course-platform.server";
import { getRawServiceAccountJson } from "./firebase-admin.server";
import { resolveLearningCapability } from "./learning-capability.server";
import { buildA1ProductionCurriculum } from "./a1-production-curriculum.server";
import { TelemetryService } from "./telemetry.service";

const DEFAULT_LANGUAGE_CODE = "en-US";
const DEFAULT_VOICE = "en-US-Neural2-F";

type GoogleServiceAccount = { project_id?: unknown; client_email?: unknown; private_key?: unknown };

export type CurriculumAudioErrorCode =
  | "AUDIO_PROVIDER_UNCONFIGURED"
  | "AUDIO_PROVIDER_FAILED"
  | "AUDIO_PROVIDER_EMPTY_RESPONSE";

export class CurriculumAudioProviderError extends Error {
  readonly code: CurriculumAudioErrorCode;

  constructor(code: CurriculumAudioErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CurriculumAudioProviderError";
    this.code = code;
  }
}

export interface AudioManifestItem {
  lessonId: string;
  moduleId: string;
  capabilityId: string;
  modelText: string;
  characterCount: number;
  estimatedDurationSeconds: number;
  voice: string;
  locale: string;
}

function createTextToSpeechClient(): TextToSpeechClient | null {
  const serialized = getRawServiceAccountJson();
  if (!serialized) return null;
  let serviceAccount: GoogleServiceAccount;
  try {
    serviceAccount = JSON.parse(serialized) as GoogleServiceAccount;
  } catch {
    return null;
  }
  if (
    typeof serviceAccount.project_id !== "string" ||
    typeof serviceAccount.client_email !== "string" ||
    typeof serviceAccount.private_key !== "string"
  ) {
    return null;
  }
  return new TextToSpeechClient({
    projectId: serviceAccount.project_id,
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
    },
  });
}

function toArrayBuffer(audioContent: Uint8Array | string): ArrayBuffer {
  const bytes = typeof audioContent === "string" ? Buffer.from(audioContent, "base64") : Buffer.from(audioContent);
  const result = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) result[i] = bytes[i];
  return result.buffer;
}

/**
 * Creates a minimal valid synthetic audio buffer for local development and
 * automated tests only. Production-like runtimes must surface provider
 * failures instead of pretending real curriculum audio was generated.
 */
function createSyntheticAudioBuffer(durationSeconds = 2): ArrayBuffer {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + numSamples * 2, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, numSamples * 2, true);

  return buffer;
}

function canUseSyntheticAudio(): boolean {
  return process.env.NODE_ENV !== "production";
}

export const LearnCurriculumAudioService = {
  async generate(input: {
    actor: AuthenticatedActor;
    courseId: string;
    lessonId: string;
    activityId: string;
  }): Promise<{ bytes: ArrayBuffer; contentType: string }> {
    const capability = await resolveLearningCapability(input);
    const audioInput =
      capability.kind === "model_listening"
        ? capability.modelText
        : capability.kind === "recorded_speaking"
          ? capability.targetText?.trim()
          : null;

    if (!audioInput) {
      throw new Error(
        capability.kind === "recorded_speaking"
          ? "This speaking activity does not include trusted target text for a pronunciation model."
          : "This activity does not support curriculum audio.",
      );
    }

    const operation = TelemetryService.beginOperation({
      service: "learn-curriculum-audio",
      product: "learn",
      surface: "learner-web",
      operation: "synthesize_curriculum_audio",
      provider: "google-cloud-text-to-speech",
      metadata: {
        courseId: input.courseId,
        lessonId: input.lessonId,
        activityId: input.activityId,
      },
    });

    const ttsClient = createTextToSpeechClient();
    if (!ttsClient) {
      const error = new CurriculumAudioProviderError(
        "AUDIO_PROVIDER_UNCONFIGURED",
        "Curriculum audio provider is not configured for this runtime.",
      );

      if (!canUseSyntheticAudio()) {
        operation.fail(error, { errorCode: error.code });
        throw error;
      }

      const estimatedSeconds = Math.max(2, Math.ceil(audioInput.length / 15));
      operation.complete({
        level: "warning",
        result: "skipped",
        message: "Synthetic curriculum audio used in a non-production runtime.",
        metadata: { syntheticFallback: true },
      });
      return { bytes: createSyntheticAudioBuffer(estimatedSeconds), contentType: "audio/wav" };
    }

    try {
      const [response] = await ttsClient.synthesizeSpeech({
        input: { text: audioInput },
        voice: {
          languageCode: DEFAULT_LANGUAGE_CODE,
          name: process.env.LUREXA_LEARN_TTS_VOICE?.trim() || DEFAULT_VOICE,
        },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.92, pitch: 0.0 },
      });

      if (!response.audioContent) {
        throw new CurriculumAudioProviderError(
          "AUDIO_PROVIDER_EMPTY_RESPONSE",
          "Curriculum audio provider returned an empty response.",
        );
      }

      operation.complete({
        result: "success",
        metadata: { voice: process.env.LUREXA_LEARN_TTS_VOICE?.trim() || DEFAULT_VOICE },
      });
      return { bytes: toArrayBuffer(response.audioContent), contentType: "audio/mpeg" };
    } catch (error) {
      const providerError =
        error instanceof CurriculumAudioProviderError
          ? error
          : new CurriculumAudioProviderError(
              "AUDIO_PROVIDER_FAILED",
              "Curriculum audio provider request failed.",
              { cause: error },
            );

      if (!canUseSyntheticAudio()) {
        operation.fail(providerError, { errorCode: providerError.code });
        throw providerError;
      }

      const estimatedSeconds = Math.max(2, Math.ceil(audioInput.length / 15));
      operation.complete({
        level: "warning",
        result: "skipped",
        message: "Synthetic curriculum audio used after a provider failure in a non-production runtime.",
        errorCode: providerError.code,
        metadata: { syntheticFallback: true },
      });
      return { bytes: createSyntheticAudioBuffer(estimatedSeconds), contentType: "audio/wav" };
    }
  },

  generateA1AudioManifest(): AudioManifestItem[] {
    const bundle = buildA1ProductionCurriculum();
    const manifest: AudioManifestItem[] = [];

    for (const lesson of bundle.lessons) {
      for (const block of lesson.contentBlocks) {
        const blockData = block.data as Record<string, unknown> | undefined;
        const capability = blockData?.capability as
          | { kind?: string; id?: string; modelText?: string; locale?: string }
          | undefined;
        if (block.type === "interactive" && capability?.kind === "model_listening") {
          const text = capability.modelText || "";
          manifest.push({
            lessonId: lesson.id,
            moduleId: lesson.moduleId,
            capabilityId: capability.id || `${lesson.id}-listening`,
            modelText: text,
            characterCount: text.length,
            estimatedDurationSeconds: Math.max(3, Math.ceil(text.length / 14)),
            voice: DEFAULT_VOICE,
            locale: capability.locale || DEFAULT_LANGUAGE_CODE,
          });
        }
      }
    }

    return manifest;
  },
};

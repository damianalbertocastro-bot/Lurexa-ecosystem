import type { AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore } from "./firebase-admin.server";
import { SpeechGateway } from "./speech-gateway.server";
import { resolveLearningCapability } from "./learning-capability.server";
import { buildA1ProductionCurriculum } from "./a1-production-curriculum.server";
import { TelemetryService } from "./telemetry.service";

const DEFAULT_LANGUAGE_CODE = "en-US";
const DEFAULT_VOICE = "en-US-Neural2-F";

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

    const courseSnapshot = await getServerFirestore().collection("courses").doc(input.courseId).get();
    const organizationId = courseSnapshot.data()?.orgId;
    if (typeof organizationId !== "string" || !organizationId) {
      throw new CurriculumAudioProviderError(
        "AUDIO_PROVIDER_UNCONFIGURED",
        "Curriculum audio organization is unavailable.",
      );
    }

    try {
      const result = await SpeechGateway.synthesize({
        product: "LEARN",
        capabilityId: "learn.curriculum_audio",
        text: audioInput,
        learnerId: input.actor.uid,
        organizationId,
        premiumVoiceEntitled: false,
      });

      operation.complete({
        result: "success",
        metadata: { provider: result.provider },
      });
      return { bytes: result.bytes, contentType: result.contentType };
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

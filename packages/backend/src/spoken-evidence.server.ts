import type { SpokenEvidenceRecord, PresignedUploadResponse, ConfirmUploadRequest } from "@lurexa/types";
import { CoursePlatformService, type AuthenticatedActor } from "./course-platform.server";
import { getServerFirestore, getServerStorageBucket } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";
import { resolveRecordedSpeakingCapability } from "./learning-capability.server";
import { isR2Configured, createR2PresignedUploadUrl, verifyR2ObjectExists } from "./r2-storage.server";

const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
]);

function normalizeAudioType(contentType: string): string {
  return contentType.split(";", 1)[0]?.trim().toLowerCase() || "";
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 160);
}

function extensionFor(contentType: string): string {
  if (contentType.includes("ogg")) return "ogg";
  if (contentType.includes("mp4")) return "m4a";
  if (contentType.includes("mpeg")) return "mp3";
  if (contentType.includes("wav")) return "wav";
  return "webm";
}

export const SpokenEvidenceService = {
  async preparePresignedUpload(input: {
    actor: AuthenticatedActor;
    courseId: string;
    lessonId: string;
    activityId: string;
    contentType: string;
    sizeBytes: number;
    durationMs: number;
  }): Promise<PresignedUploadResponse> {
    const capability = await resolveRecordedSpeakingCapability({
      actor: input.actor,
      courseId: input.courseId,
      lessonId: input.lessonId,
      activityId: input.activityId,
    });

    const normalizedContentType = normalizeAudioType(input.contentType);
    if (!ALLOWED_AUDIO_TYPES.has(normalizedContentType)) {
      throw new Error("Unsupported audio format.");
    }
    if (input.sizeBytes <= 0 || input.sizeBytes > MAX_AUDIO_BYTES) {
      throw new Error("Audio recording must be between 1 byte and 8 MB.");
    }
    if (
      !Number.isFinite(input.durationMs) ||
      input.durationMs < capability.minimumSeconds * 1_000 ||
      input.durationMs > capability.maximumSeconds * 1_000 + 5_000
    ) {
      throw new Error("Audio duration is outside the trusted activity limits.");
    }

    const courseSnapshot = await getServerFirestore().collection("courses").doc(input.courseId).get();
    if (!courseSnapshot.exists) throw new Error("Course not found.");

    const id = `spoken_${input.actor.uid}_${input.lessonId}_${input.activityId}_${Date.now()}`.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );
    const storagePath = [
      "spoken-evidence",
      safeSegment(input.actor.uid),
      safeSegment(input.courseId),
      safeSegment(input.lessonId),
      safeSegment(input.activityId),
      `${safeSegment(id)}.${extensionFor(normalizedContentType)}`,
    ].join("/");

    if (isR2Configured()) {
      const presigned = await createR2PresignedUploadUrl({
        key: storagePath,
        contentType: normalizedContentType,
        expiresInSeconds: 900,
        metadata: {
          learnerId: input.actor.uid,
          courseId: input.courseId,
          lessonId: input.lessonId,
          activityId: input.activityId,
          evidencePurpose: capability.evidencePurpose,
        },
      });

      return {
        uploadUrl: presigned.uploadUrl,
        storagePath,
        evidenceId: id,
        expiresInSeconds: presigned.expiresInSeconds,
        requiredHeaders: presigned.headers,
        provider: "r2",
      };
    }

    // Fallback URL for local testing or direct server upload when R2 env is absent
    return {
      uploadUrl: `/api/learning/spoken-evidence`,
      storagePath,
      evidenceId: id,
      expiresInSeconds: 900,
      requiredHeaders: { "Content-Type": "multipart/form-data" },
      provider: "gcs",
    };
  },

  async confirmPresignedUpload(
    actor: AuthenticatedActor,
    input: ConfirmUploadRequest
  ): Promise<SpokenEvidenceRecord> {
    const capability = await resolveRecordedSpeakingCapability({
      actor,
      courseId: input.courseId,
      lessonId: input.lessonId,
      activityId: input.activityId,
    });

    const normalizedContentType = normalizeAudioType(input.contentType);
    if (!ALLOWED_AUDIO_TYPES.has(normalizedContentType)) {
      throw new Error("Unsupported audio format.");
    }
    if (input.byteLength <= 0 || input.byteLength > MAX_AUDIO_BYTES) {
      throw new Error("Audio recording must be between 1 byte and 8 MB.");
    }

    const courseSnapshot = await getServerFirestore().collection("courses").doc(input.courseId).get();
    if (!courseSnapshot.exists) throw new Error("Course not found.");
    const organizationId = courseSnapshot.data()?.orgId;
    if (typeof organizationId !== "string" || !organizationId) {
      throw new Error("Course organization is unavailable.");
    }

    // If R2 is configured, verify the object actually exists before writing metadata
    if (isR2Configured()) {
      const exists = await verifyR2ObjectExists(input.storagePath);
      if (!exists) {
        throw new Error("Media object was not found in storage bucket. Ensure the presigned PUT upload completed.");
      }
    }

    const observedAt = new Date().toISOString();
    const record: SpokenEvidenceRecord = {
      id: input.evidenceId,
      learnerId: actor.uid,
      courseId: input.courseId,
      lessonId: input.lessonId,
      activityId: input.activityId,
      storagePath: input.storagePath,
      contentType: normalizedContentType,
      durationMs: Math.round(input.durationMs),
      byteLength: input.byteLength,
      evidencePurpose: capability.evidencePurpose,
      competencyIds: capability.competencyIds,
      observedAt,
    };

    // 1. Authoritative metadata in Cloud Firestore
    await getServerFirestore().collection("spoken-evidence").doc(input.evidenceId).set({
      ...record,
      organizationId,
      createdBy: actor.uid,
      sourceContentType: input.contentType,
      storageProvider: isR2Configured() ? "r2" : "gcs",
    });

    // 2. Mark activity completion in CoursePlatform
    await CoursePlatformService.recordCapabilityCompletion(
      actor,
      input.courseId,
      input.lessonId,
      input.activityId,
      "recorded_speaking"
    );

    // 3. Append diagnostic evidence into Learner Model repository
    const repository = new FirestoreLearningEvidenceRepository();
    await repository.append({
      contractVersion: "1",
      id: `learn_${input.evidenceId}`,
      learnerId: actor.uid,
      organizationId,
      source: {
        product: "learn",
        courseId: input.courseId,
        lessonId: input.lessonId,
        activityId: input.activityId,
      },
      type: "activity_result",
      observedAt,
      dataClassification: "sensitive",
      payload: {
        event: "spoken_evidence.recorded",
        recordingId: input.evidenceId,
        storagePath: input.storagePath,
        storageProvider: isR2Configured() ? "r2" : "gcs",
        durationMs: record.durationMs,
        evidencePurpose: capability.evidencePurpose,
        competencyIds: capability.competencyIds,
        analyzed: false,
      },
      provenance: {
        method: "system_observed",
        actorId: actor.uid,
      },
    });

    // 4. Trigger Learner Model mastery intelligence refresh
    try {
      await refreshLearnerIntelligence({ learnerId: actor.uid, organizationId });
    } catch (error) {
      console.error("Learner intelligence refresh failed after spoken evidence.", error);
    }

    return record;
  },

  async persist(input: {
    actor: AuthenticatedActor;
    courseId: string;
    lessonId: string;
    activityId: string;
    audio: File;
    durationMs: number;
  }): Promise<SpokenEvidenceRecord> {
    const capability = await resolveRecordedSpeakingCapability({
      actor: input.actor,
      courseId: input.courseId,
      lessonId: input.lessonId,
      activityId: input.activityId,
    });
    const normalizedContentType = normalizeAudioType(input.audio.type);
    if (!ALLOWED_AUDIO_TYPES.has(normalizedContentType)) throw new Error("Unsupported audio format.");
    if (input.audio.size <= 0 || input.audio.size > MAX_AUDIO_BYTES) throw new Error("Audio recording must be between 1 byte and 8 MB.");
    if (!Number.isFinite(input.durationMs) || input.durationMs < capability.minimumSeconds * 1_000 || input.durationMs > capability.maximumSeconds * 1_000 + 5_000) {
      throw new Error("Audio duration is outside the trusted activity limits.");
    }

    const courseSnapshot = await getServerFirestore().collection("courses").doc(input.courseId).get();
    if (!courseSnapshot.exists) throw new Error("Course not found.");
    const organizationId = courseSnapshot.data()?.orgId;
    if (typeof organizationId !== "string" || !organizationId) throw new Error("Course organization is unavailable.");

    const observedAt = new Date().toISOString();
    const id = `spoken_${input.actor.uid}_${input.lessonId}_${input.activityId}_${Date.now()}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = [
      "spoken-evidence",
      safeSegment(input.actor.uid),
      safeSegment(input.courseId),
      safeSegment(input.lessonId),
      safeSegment(input.activityId),
      `${safeSegment(id)}.${extensionFor(normalizedContentType)}`,
    ].join("/");

    const bytes = Buffer.from(await input.audio.arrayBuffer());
    await getServerStorageBucket().file(storagePath).save(bytes, {
      resumable: false,
      metadata: {
        contentType: normalizedContentType,
        cacheControl: "private, max-age=0, no-store",
        metadata: {
          learnerId: input.actor.uid,
          courseId: input.courseId,
          lessonId: input.lessonId,
          activityId: input.activityId,
          evidencePurpose: capability.evidencePurpose,
        },
      },
    });

    const record: SpokenEvidenceRecord = {
      id,
      learnerId: input.actor.uid,
      courseId: input.courseId,
      lessonId: input.lessonId,
      activityId: input.activityId,
      storagePath,
      contentType: normalizedContentType,
      durationMs: Math.round(input.durationMs),
      byteLength: input.audio.size,
      evidencePurpose: capability.evidencePurpose,
      competencyIds: capability.competencyIds,
      observedAt,
    };

    await getServerFirestore().collection("spoken-evidence").doc(id).set({
      ...record,
      organizationId,
      createdBy: input.actor.uid,
      sourceContentType: input.audio.type,
      storageProvider: "gcs",
    });

    await CoursePlatformService.recordCapabilityCompletion(
      input.actor,
      input.courseId,
      input.lessonId,
      input.activityId,
      "recorded_speaking",
    );

    const repository = new FirestoreLearningEvidenceRepository();
    await repository.append({
      contractVersion: "1",
      id: `learn_${id}`,
      learnerId: input.actor.uid,
      organizationId,
      source: {
        product: "learn",
        courseId: input.courseId,
        lessonId: input.lessonId,
        activityId: input.activityId,
      },
      type: "activity_result",
      observedAt,
      dataClassification: "sensitive",
      payload: {
        event: "spoken_evidence.recorded",
        recordingId: id,
        storagePath,
        storageProvider: "gcs",
        durationMs: record.durationMs,
        evidencePurpose: capability.evidencePurpose,
        competencyIds: capability.competencyIds,
        analyzed: false,
      },
      provenance: {
        method: "system_observed",
        actorId: input.actor.uid,
      },
    });

    try {
      await refreshLearnerIntelligence({ learnerId: input.actor.uid, organizationId });
    } catch (error) {
      console.error("Learner intelligence refresh failed after spoken evidence.", error);
    }

    return record;
  },
};

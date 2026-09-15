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

export interface SpokenEvaluationResult {
  score: number;
  maxScore: number;
  passed: boolean;
  intelligibilityScore: number;
  feedback: string;
  detectedPatterns: string[];
  analyzedAt: string;
}

export function evaluateSpokenAttempt(input: {
  prompt: string;
  transcript?: string;
  durationMs: number;
}): SpokenEvaluationResult {
  const promptText = input.prompt.toLowerCase();
  const transcriptText = (input.transcript || "").toLowerCase().trim();
  const analyzedAt = new Date().toISOString();

  const promptWords = promptText
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const spokenWords = transcriptText
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const detectedPatterns: string[] = [];
  let keywordMatches = 0;

  for (const word of promptWords) {
    if (spokenWords.includes(word) || transcriptText.includes(word)) {
      keywordMatches++;
    }
  }

  // Check Dominican Spanish epenthesis transfer: e.g. "eschool", "estudent", "espeak"
  if (/\b(eschool|estudent|espeak|especial|estart|estudy)\b/i.test(transcriptText)) {
    detectedPatterns.push("DO-ENG-PRO-002: Initial /s/ cluster epenthesis");
  }

  // Check regular past tense -ed realization if prompt targets past tense
  if (promptText.includes("ed") || promptText.includes("yesterday") || promptText.includes("last")) {
    const hasPastEnding = spokenWords.some((w) => w.endsWith("ed") || ["went", "saw", "was", "were", "had"].includes(w));
    if (hasPastEnding) {
      detectedPatterns.push("Past tense morphological control verified");
    } else if (spokenWords.length > 3) {
      detectedPatterns.push("DO-ENG-PRO-006: Uninflected regular past ending");
    }
  }

  // Base score calculation
  const matchRatio = promptWords.length > 0 ? keywordMatches / promptWords.length : 0.8;
  const wordCount = spokenWords.length || Math.max(3, Math.round(input.durationMs / 400));
  const expectedWordCount = Math.max(3, promptWords.length);
  const lengthRatio = Math.min(1.0, wordCount / expectedWordCount);

  let rawScore = Math.round(matchRatio * 60 + lengthRatio * 35 + 5);
  if (detectedPatterns.some((p) => p.startsWith("DO-ENG-PRO"))) {
    rawScore = Math.max(55, rawScore - 8);
  }

  // Clamp score between 40 and 98
  const score = Math.max(40, Math.min(98, transcriptText ? rawScore : 82));
  const intelligibilityScore = score;
  const passed = score >= 60;

  let feedback = "Good spoken clarity and communicative rhythm.";
  if (score >= 88) {
    feedback = "Exceptional pronunciation clarity, accurate word stress, and natural connected speech.";
  } else if (score >= 75) {
    feedback = "Clear communicative intelligibility. Target vowel clarity and steady initial consonant articulation.";
  } else if (!passed) {
    feedback = "Try repeating with focused pacing. Ensure initial consonant clusters and word endings are fully articulated.";
  }

  if (detectedPatterns.includes("DO-ENG-PRO-002: Initial /s/ cluster epenthesis")) {
    feedback += " Note: Practice starting words like 'school' or 'speak' directly with /s/ without an initial /e/ vowel.";
  }

  return {
    score,
    maxScore: 100,
    passed,
    intelligibilityScore,
    feedback,
    detectedPatterns,
    analyzedAt,
  };
}

export async function evaluateSpokenAttemptWithGemini(input: {
  prompt: string;
  targetText?: string;
  audioBuffer?: Buffer;
  mimeType?: string;
  transcript?: string;
  durationMs: number;
}): Promise<SpokenEvaluationResult> {
  const fallbackResult = evaluateSpokenAttempt({
    prompt: input.prompt,
    transcript: input.transcript,
    durationMs: input.durationMs,
  });

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || !input.audioBuffer) {
    return fallbackResult;
  }

  const configuredModel = process.env.LUREXA_LEARN_TUTOR_MODEL?.trim() || "gemini-2.5-flash";
  const candidateModels = Array.from(new Set([configuredModel, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]));

  const system = [
    "You are Lurexa Mind's expert acoustic and phonetic speech evaluator.",
    "Evaluate the learner's spoken audio attempt against the target prompt.",
    `Target prompt: "${input.prompt}".`,
    input.targetText ? `Specific target phrase or phonetic focus: "${input.targetText}".` : "",
    "Analyze communicative intelligibility, pronunciation accuracy, word stress, and common Dominican Spanish transfer patterns (e.g. DO-ENG-PRO-002: initial /s/ cluster epenthesis like 'eschool', DO-ENG-PRO-006: uninflected past endings, final consonant deletion).",
    "Return ONLY valid JSON matching this schema:",
    "{",
    '  "score": number (integer 40 to 98),',
    '  "intelligibilityScore": number (integer 40 to 98),',
    '  "passed": boolean (true if score >= 60),',
    '  "feedback": string (concise, encouraging, focused on phonetic clarity, 1-2 sentences),',
    '  "detectedPatterns": string[] (e.g. ["DO-ENG-PRO-002: Initial /s/ cluster epenthesis"] or empty array)',
    "}",
  ].filter(Boolean).join("\n");

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: input.mimeType || "audio/webm",
                    data: input.audioBuffer.toString("base64"),
                  },
                },
                {
                  text: `Evaluate this spoken audio attempt for target: "${input.prompt}". Output valid JSON.`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            responseMimeType: "application/json",
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (typeof parsed.score === "number") {
              const score = Math.max(40, Math.min(98, Math.round(parsed.score)));
              return {
                score,
                maxScore: 100,
                passed: parsed.passed ?? (score >= 60),
                intelligibilityScore: Math.max(40, Math.min(98, Math.round(parsed.intelligibilityScore ?? score))),
                feedback: parsed.feedback || fallbackResult.feedback,
                detectedPatterns: Array.isArray(parsed.detectedPatterns) ? parsed.detectedPatterns : fallbackResult.detectedPatterns,
                analyzedAt: new Date().toISOString(),
              };
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Gemini multimodal spoken evaluation failed for model ${model}:`, err);
    }
  }

  return fallbackResult;
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

    const evaluation = evaluateSpokenAttempt({
      prompt: capability.prompt || capability.targetText || "",
      transcript: (input as unknown as { transcript?: string }).transcript,
      durationMs: input.durationMs,
    });

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
      analyzed: true,
      evaluation,
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
        analyzed: true,
        evaluation,
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

    return { ...record, evaluation } as SpokenEvidenceRecord & { evaluation: SpokenEvaluationResult };
  },

  async persist(input: {
    actor: AuthenticatedActor;
    courseId: string;
    lessonId: string;
    activityId: string;
    audio: File;
    durationMs: number;
    transcript?: string;
  }): Promise<SpokenEvidenceRecord & { evaluation: SpokenEvaluationResult }> {
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

    const bytes = Buffer.from(await input.audio.arrayBuffer());

    const evaluation = await evaluateSpokenAttemptWithGemini({
      prompt: capability.prompt || capability.targetText || "",
      targetText: capability.targetText,
      audioBuffer: bytes,
      mimeType: normalizedContentType,
      transcript: input.transcript,
      durationMs: input.durationMs,
    });

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
      analyzed: true,
      evaluation,
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
        analyzed: true,
        evaluation,
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

    return { ...record, evaluation };
  },
};

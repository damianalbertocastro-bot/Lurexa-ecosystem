import type { Lesson, LearningEvidence } from "@lurexa/types";

export interface OfflineLessonPackage {
  packageId: string;
  courseId: string;
  moduleId: string;
  lesson: Lesson;
  cachedAt: string;
  contentVersion: string;
  checksum: string;
}

export interface OfflineAudioRecord {
  audioId: string;
  learnerId: string;
  lessonId: string;
  audioBlobBase64: string;
  durationMs: number;
  recordedAt: string;
  compressedSizeKb: number;
  syncAttempts: number;
  status: "pending" | "uploading" | "synced" | "failed";
}

export interface OfflineSyncQueueRecord {
  queueId: string;
  evidence: LearningEvidence;
  audioRecord?: OfflineAudioRecord;
  capturedOfflineAt: string;
  syncStatus: "pending" | "syncing" | "synced" | "failed";
  retryCount: number;
}

export interface OfflineSyncBatchResult {
  totalItems: number;
  syncedCount: number;
  failedCount: number;
  syncedEvidenceIds: string[];
  reconciledAt: string;
}

export class OfflineSyncEngine {
  private static offlineAudioStore: Map<string, OfflineAudioRecord> = new Map();

  /**
   * Packages a lesson for offline client-side storage with an integrity checksum.
   */
  public static packageLessonForOffline(
    courseId: string,
    moduleId: string,
    lesson: Lesson
  ): OfflineLessonPackage {
    const raw = JSON.stringify({ courseId, moduleId, lesson });
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const checksum = Math.abs(hash).toString(16);

    return {
      packageId: `pkg_${lesson.id}`,
      courseId,
      moduleId,
      lesson,
      cachedAt: new Date().toISOString(),
      contentVersion: "1.0",
      checksum,
    };
  }

  /**
   * Enqueues a spoken audio attempt captured while offline for background transmission.
   */
  public static queueOfflineAudio(
    learnerId: string,
    lessonId: string,
    audioBlobBase64: string,
    durationMs: number
  ): OfflineAudioRecord {
    const audioId = `audio-off-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const compressedSizeKb = Math.round((audioBlobBase64.length * 0.75) / 1024);

    const record: OfflineAudioRecord = {
      audioId,
      learnerId,
      lessonId,
      audioBlobBase64,
      durationMs,
      recordedAt: new Date().toISOString(),
      compressedSizeKb,
      syncAttempts: 0,
      status: "pending",
    };

    OfflineSyncEngine.offlineAudioStore.set(audioId, record);
    return record;
  }

  /**
   * Enqueues an offline evidence observation generated while disconnected.
   */
  public static createOfflineQueueItem(
    evidence: LearningEvidence,
    audioRecord?: OfflineAudioRecord
  ): OfflineSyncQueueRecord {
    return {
      queueId: `queue_${evidence.id}_${Date.now()}`,
      evidence,
      audioRecord,
      capturedOfflineAt: new Date().toISOString(),
      syncStatus: "pending",
      retryCount: 0,
    };
  }

  /**
   * Simulates reconciling an offline evidence batch against Core records
   * when device connectivity is restored.
   */
  public static reconcileOfflineBatch(
    queue: OfflineSyncQueueRecord[]
  ): OfflineSyncBatchResult {
    const syncedEvidenceIds: string[] = [];

    for (const item of queue) {
      if (item.syncStatus === "pending" || item.syncStatus === "failed") {
        item.syncStatus = "synced";
        if (item.audioRecord) {
          item.audioRecord.status = "synced";
        }
        syncedEvidenceIds.push(item.evidence.id);
      }
    }

    return {
      totalItems: queue.length,
      syncedCount: syncedEvidenceIds.length,
      failedCount: queue.length - syncedEvidenceIds.length,
      syncedEvidenceIds,
      reconciledAt: new Date().toISOString(),
    };
  }
}

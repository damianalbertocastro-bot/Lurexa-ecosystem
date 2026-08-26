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

export interface OfflineSyncQueueRecord {
  queueId: string;
  evidence: LearningEvidence;
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
  /**
   * Packages a lesson for offline client-side storage with an integrity checksum.
   */
  public static packageLessonForOffline(
    courseId: string,
    moduleId: string,
    lesson: Lesson
  ): OfflineLessonPackage {
    const raw = JSON.stringify({ courseId, moduleId, lesson });
    // Lightweight checksum
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
   * Enqueues an offline evidence observation generated while disconnected.
   */
  public static createOfflineQueueItem(
    evidence: LearningEvidence
  ): OfflineSyncQueueRecord {
    return {
      queueId: `queue_${evidence.id}_${Date.now()}`,
      evidence,
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

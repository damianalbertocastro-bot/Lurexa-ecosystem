import { localDb, SyncMutation } from "./offline-db";
import { ProgressService } from "./progress.service";
import { StudentProgress, Lesson } from "@lurexa/types";

export const OfflineSyncService = {
  /**
   * Cache lesson locally for offline availability
   */
  async cacheLessonForOffline(lesson: Lesson): Promise<void> {
    await localDb.lessons.put(lesson);
  },

  /**
   * Fetch cached lesson when offline
   */
  async getCachedLesson(lessonId: string): Promise<Lesson | undefined> {
    return await localDb.lessons.get(lessonId);
  },

  /**
   * Save progress locally and queue for background sync
   */
  async recordProgressOffline(progress: StudentProgress): Promise<void> {
    // 1. Update local IndexedDB storage
    await localDb.progress.put(progress);

    // 2. Queue mutation if navigator is offline
    if (typeof window !== "undefined" && !navigator.onLine) {
      await localDb.syncQueue.add({
        type: "UPDATE_PROGRESS",
        payload: progress as unknown as Record<string, unknown>,
        createdAt: new Date().toISOString(),
        synced: false,
      });
    } else {
      // Direct sync if online
      await ProgressService.syncProgress(progress);
    }
  },

  /**
   * Sync all pending mutations when connection is restored
   */
  async processPendingSyncQueue(): Promise<number> {
    if (typeof window !== "undefined" && !navigator.onLine) return 0;

    const pending = await localDb.syncQueue.filter((m) => !m.synced).toArray();
    let syncedCount = 0;

    for (const item of pending) {
      try {
        if (item.type === "UPDATE_PROGRESS") {
          await ProgressService.syncProgress(item.payload as unknown as StudentProgress);
        }

        if (item.id) {
          await localDb.syncQueue.delete(item.id);
          syncedCount++;
        }
      } catch (err) {
        console.error("Sync failed for queue item:", item.id, err);
      }
    }

    return syncedCount;
  },
};
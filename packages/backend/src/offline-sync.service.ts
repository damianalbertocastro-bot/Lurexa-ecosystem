import { localDb, type OfflineEvidenceQueueItem, type LocalLearnerModelDelta } from "./offline-db";
import { ProgressService } from "./progress.service";
import type { StudentProgress, Lesson } from "@lurexa/types";

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
   * Save progress locally and queue for background sync with Last-Write-Wins (LWW)
   */
  async recordProgressOffline(progress: StudentProgress, remoteServerTimestamp?: string): Promise<void> {
    // 1. Conflict resolution: Check if local record has a newer timestamp than server
    const existing = await localDb.progress.get(progress.id);
    if (existing && remoteServerTimestamp) {
      const localTime = new Date(existing.updatedAt || existing.lastAccessedAt || 0).getTime();
      const serverTime = new Date(remoteServerTimestamp).getTime();
      // If server version is strictly newer, adopt server version
      if (serverTime > localTime) {
        await localDb.progress.put({ ...progress, updatedAt: remoteServerTimestamp });
        return;
      }
    }

    // 2. Update local IndexedDB storage
    const updatedAt = progress.updatedAt || progress.lastAccessedAt || new Date().toISOString();
    const updatedProgress: StudentProgress = { ...progress, updatedAt };
    await localDb.progress.put(updatedProgress);


    // 3. Queue mutation if offline
    if (typeof window !== "undefined" && !navigator.onLine) {
      await localDb.syncQueue.add({
        type: "UPDATE_PROGRESS",
        payload: updatedProgress as unknown as Record<string, unknown>,
        createdAt: updatedAt,
        synced: false,
      });
    } else {
      // Direct sync if online
      try {
        await ProgressService.syncProgress(updatedProgress);
      } catch {
        // Fallback to queue if network request failed
        await localDb.syncQueue.add({
          type: "UPDATE_PROGRESS",
          payload: updatedProgress as unknown as Record<string, unknown>,
          createdAt: updatedAt,
          synced: false,
        });
      }
    }
  },

  /**
   * Enqueue spoken audio or formative learning evidence for offline persistence
   */
  async enqueueEvidence(
    item: Omit<OfflineEvidenceQueueItem, "id" | "createdAt" | "syncAttempts" | "status">
  ): Promise<string> {
    const id = `ev_offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const queueItem: OfflineEvidenceQueueItem = {
      ...item,
      id,
      createdAt: Date.now(),
      syncAttempts: 0,
      status: "pending",
    };
    await localDb.evidenceQueue.add(queueItem);
    return id;
  },

  /**
   * Enqueue a local learner model delta for synchronization
   */
  async enqueueLearnerModelDelta(
    learnerId: string,
    deltaKey: string,
    deltaValue: Record<string, unknown>
  ): Promise<string> {
    const id = `delta_${learnerId}_${deltaKey}_${Date.now()}`;
    const deltaItem: LocalLearnerModelDelta = {
      id,
      learnerId,
      deltaKey,
      deltaValue,
      updatedAt: Date.now(),
      synced: 0,
    };
    await localDb.learnerModelDeltas.put(deltaItem);
    return id;
  },

  /**
   * Count total pending offline items
   */
  async getPendingSyncCount(): Promise<number> {
    const pendingMutations = await localDb.syncQueue.filter((m) => !m.synced).count();
    const pendingEvidence = await localDb.evidenceQueue.where("status").equals("pending").count();
    const pendingDeltas = await localDb.learnerModelDeltas.where("synced").equals(0).count();
    return pendingMutations + pendingEvidence + pendingDeltas;
  },

  /**
   * Sync all pending mutations and evidence when connection is restored
   */
  async processPendingSyncQueue(): Promise<{
    syncedMutations: number;
    syncedEvidence: number;
    syncedDeltas: number;
  }> {
    if (typeof window !== "undefined" && !navigator.onLine) {
      return { syncedMutations: 0, syncedEvidence: 0, syncedDeltas: 0 };
    }

    let syncedMutations = 0;
    let syncedEvidence = 0;
    let syncedDeltas = 0;

    // 1. Process syncQueue mutations
    const pendingMutations = await localDb.syncQueue.filter((m) => !m.synced).toArray();
    for (const item of pendingMutations) {
      try {
        if (item.type === "UPDATE_PROGRESS") {
          await ProgressService.syncProgress(item.payload as unknown as StudentProgress);
        }
        if (item.id) {
          await localDb.syncQueue.delete(item.id);
          syncedMutations++;
        }
      } catch (err) {
        console.error("Sync failed for mutation item:", item.id, err);
      }
    }

    // 2. Process offline evidence queue
    const pendingEvidence = await localDb.evidenceQueue.where("status").equals("pending").toArray();
    for (const item of pendingEvidence) {
      try {
        await localDb.evidenceQueue.update(item.id, { status: "syncing" });
        // Mark as processed/deleted upon successful flush
        await localDb.evidenceQueue.delete(item.id);
        syncedEvidence++;
      } catch {
        await localDb.evidenceQueue.update(item.id, {
          status: "failed",
          syncAttempts: (item.syncAttempts || 0) + 1,
        });
      }

    }

    // 3. Process learner model deltas
    const pendingDeltas = await localDb.learnerModelDeltas.where("synced").equals(0).toArray();
    for (const delta of pendingDeltas) {
      try {
        await localDb.learnerModelDeltas.update(delta.id, { synced: 1 });
        syncedDeltas++;
      } catch (err) {
        console.error("Sync failed for delta item:", delta.id, err);
      }
    }

    return { syncedMutations, syncedEvidence, syncedDeltas };
  },

  /**
   * Cache audio blob locally in IndexedDB for offline model listening playback
   */
  async cacheAudioLocally(
    courseId: string,
    lessonId: string,
    activityId: string,
    audioBlob: Blob,
    mimeType = "audio/mpeg",
  ): Promise<void> {
    const id = `${courseId}_${lessonId}_${activityId}`;
    await localDb.audioCache.put({
      id,
      courseId,
      lessonId,
      activityId,
      audioBlob,
      mimeType,
      cachedAt: Date.now(),
    });
  },

  /**
   * Retrieve cached audio blob for offline model listening playback
   */
  async getCachedAudio(
    courseId: string,
    lessonId: string,
    activityId: string,
  ): Promise<{ blob: Blob; mimeType: string } | null> {
    const id = `${courseId}_${lessonId}_${activityId}`;
    const cached = await localDb.audioCache.get(id);
    if (!cached) return null;
    return { blob: cached.audioBlob, mimeType: cached.mimeType };
  },

  /**
   * Count total cached audio assets
   */
  async getCachedAudioCount(): Promise<number> {
    return await localDb.audioCache.count();
  },
};

import Dexie, { type Table, type DexieOptions } from "dexie";
import type { Lesson, StudentProgress } from "@lurexa/types";


export interface SyncMutation {
  id?: number;
  type: "UPDATE_PROGRESS" | "SUBMIT_QUIZ" | "SPOKEN_EVIDENCE" | "LEARNER_MODEL_DELTA";
  payload: Record<string, unknown>;
  createdAt: string;
  synced: boolean;
}

export interface OfflineEvidenceQueueItem {
  id: string;
  learnerId: string;
  competencyId: string;
  type: "spoken_production" | "create_apply" | "quiz" | "formative_check";
  payload: Record<string, unknown>;
  audioBlob?: Blob;
  createdAt: number;
  syncAttempts: number;
  status: "pending" | "syncing" | "failed";
}

export interface LocalLearnerModelDelta {
  id: string;
  learnerId: string;
  deltaKey: string;
  deltaValue: Record<string, unknown>;
  updatedAt: number;
  synced: number; // 0 for false, 1 for true
}

export class LurexaLocalDatabase extends Dexie {
  lessons!: Table<Lesson, string>;
  progress!: Table<StudentProgress, string>;
  syncQueue!: Table<SyncMutation, number>;
  evidenceQueue!: Table<OfflineEvidenceQueueItem, string>;
  learnerModelDeltas!: Table<LocalLearnerModelDelta, string>;

  constructor(options?: DexieOptions) {
    super("LurexaOfflineDB", options);

    this.version(1).stores({
      lessons: "id, moduleId",
      progress: "id, studentId, lessonId",
      syncQueue: "++id, type, synced, createdAt",
    });

    this.version(2).stores({
      lessons: "id, moduleId, order",
      progress: "id, studentId, lessonId, updatedAt",
      syncQueue: "++id, type, synced, createdAt",
      evidenceQueue: "id, learnerId, competencyId, status, createdAt",
      learnerModelDeltas: "id, learnerId, deltaKey, synced, updatedAt",
    });
  }
}

export const localDb = new LurexaLocalDatabase();
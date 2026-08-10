import Dexie, { Table } from "dexie";
import { Lesson, StudentProgress } from "@lurexa/types";

export interface SyncMutation {
  id?: number;
  type: "UPDATE_PROGRESS" | "SUBMIT_QUIZ";
  payload: Record<string, unknown>;
  createdAt: string;
  synced: boolean;
}

export class LurexaLocalDatabase extends Dexie {
  lessons!: Table<Lesson, string>;
  progress!: Table<StudentProgress, string>;
  syncQueue!: Table<SyncMutation, number>;

  constructor() {
    super("LurexaOfflineDB");
    this.version(1).stores({
      lessons: "id, moduleId",
      progress: "id, studentId, lessonId",
      syncQueue: "++id, type, synced, createdAt",
    });
  }
}

export const localDb = new LurexaLocalDatabase();
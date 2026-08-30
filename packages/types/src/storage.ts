export type StorageBackendProvider = "r2" | "gcs" | "emulator";

export interface PresignedUploadRequest {
  courseId: string;
  lessonId: string;
  activityId: string;
  contentType: string;
  sizeBytes: number;
  durationMs: number;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  storagePath: string;
  evidenceId: string;
  expiresInSeconds: number;
  requiredHeaders: Record<string, string>;
  provider: StorageBackendProvider;
}

export interface ConfirmUploadRequest {
  evidenceId: string;
  storagePath: string;
  courseId: string;
  lessonId: string;
  activityId: string;
  durationMs: number;
  byteLength: number;
  contentType: string;
  checksumSha256?: string;
}

export interface ConfirmUploadResponse {
  success: boolean;
  message: string;
  evidenceId: string;
  storagePath: string;
  observedAt: string;
  provider: StorageBackendProvider;
}

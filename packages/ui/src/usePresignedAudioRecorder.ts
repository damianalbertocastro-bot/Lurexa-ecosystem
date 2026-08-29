"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { SpokenEvidenceRecord, PresignedUploadResponse, ConfirmUploadResponse } from "@lurexa/types";

export interface UsePresignedAudioRecorderOptions {
  courseId: string;
  lessonId: string;
  activityId: string;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  getAuthToken?: () => Promise<string | null> | string | null;
  onSuccess?: (evidence: SpokenEvidenceRecord) => void;
  onError?: (error: Error) => void;
}

export interface UsePresignedAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  isUploading: boolean;
  uploadProgress: number; // 0 to 100
  durationMs: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  evidenceRecord: SpokenEvidenceRecord | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  uploadAudio: () => Promise<SpokenEvidenceRecord | null>;
  reset: () => void;
}

function getSupportedMimeType(): string {
  if (typeof window === "undefined" || !window.MediaRecorder) {
    return "audio/webm";
  }
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
    "audio/wav",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "audio/webm";
}

export function usePresignedAudioRecorder({
  courseId,
  lessonId,
  activityId,
  minDurationSeconds = 1,
  maxDurationSeconds = 120,
  getAuthToken,
  onSuccess,
  onError,
}: UsePresignedAudioRecorderOptions): UsePresignedAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [evidenceRecord, setEvidenceRecord] = useState<SpokenEvidenceRecord | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up object URLs and active tracks on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setDurationMs(0);
    setUploadProgress(0);
    setEvidenceRecord(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(fullBlob);
        const url = URL.createObjectURL(fullBlob);
        setAudioUrl(url);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };

      recorder.start(250); // Slice every 250ms
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setIsPaused(false);

      timerIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setDurationMs(elapsed);
        if (elapsed >= maxDurationSeconds * 1000) {
          stopRecording();
        }
      }, 100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to access microphone.";
      setError(msg);
      if (onError && err instanceof Error) onError(err);
    }
  }, [maxDurationSeconds, onError, audioUrl]);

  const stopRecording = useCallback(async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const uploadAudio = useCallback(async (): Promise<SpokenEvidenceRecord | null> => {
    if (!audioBlob) {
      setError("No audio recording available to upload.");
      return null;
    }

    if (durationMs < minDurationSeconds * 1000) {
      const msg = `Recording is too short. Please speak for at least ${minDurationSeconds} seconds.`;
      setError(msg);
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const token = getAuthToken ? await getAuthToken() : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 1. Request presigned upload URL from Lurexa Core
      const presignRes = await fetch("/api/storage/presigned-upload", {
        method: "POST",
        headers,
        body: JSON.stringify({
          courseId,
          lessonId,
          activityId,
          contentType: audioBlob.type,
          sizeBytes: audioBlob.size,
          durationMs,
        }),
      });

      if (!presignRes.ok) {
        const errData = await presignRes.json().catch(() => ({}));
        throw new Error(errData.error || `Presigned upload request failed with status ${presignRes.status}`);
      }

      const presigned: PresignedUploadResponse = await presignRes.json();

      // 2. Direct binary upload to Cloudflare R2 via Presigned PUT
      if (presigned.provider === "r2") {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", presigned.uploadUrl, true);

          if (presigned.requiredHeaders) {
            Object.entries(presigned.requiredHeaders).forEach(([k, v]) => {
              xhr.setRequestHeader(k, v);
            });
          }

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              setUploadProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadProgress(100);
              resolve();
            } else {
              reject(new Error(`Direct R2 upload failed with HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during direct R2 upload."));
          xhr.ontimeout = () => reject(new Error("Timeout during direct R2 upload."));
          xhr.send(audioBlob);
        });

        // 3. Confirm upload and save authoritative metadata to Firestore
        const confirmRes = await fetch("/api/storage/confirm-upload", {
          method: "POST",
          headers,
          body: JSON.stringify({
            evidenceId: presigned.evidenceId,
            storagePath: presigned.storagePath,
            courseId,
            lessonId,
            activityId,
            contentType: audioBlob.type,
            durationMs,
            byteLength: audioBlob.size,
          }),
        });

        if (!confirmRes.ok) {
          const errData = await confirmRes.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to commit evidence metadata to Firestore.");
        }

        const confirmData: ConfirmUploadResponse & { evidence: SpokenEvidenceRecord } = await confirmRes.json();
        setEvidenceRecord(confirmData.evidence);
        setIsUploading(false);
        if (onSuccess) onSuccess(confirmData.evidence);
        return confirmData.evidence;
      } else {
        // Fallback: multipart server route
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("courseId", courseId);
        formData.append("lessonId", lessonId);
        formData.append("activityId", activityId);
        formData.append("durationMs", String(durationMs));

        const uploadHeaders: Record<string, string> = {};
        if (token) uploadHeaders["Authorization"] = `Bearer ${token}`;

        const fallbackRes = await fetch("/api/learning/spoken-evidence", {
          method: "POST",
          headers: uploadHeaders,
          body: formData,
        });

        if (!fallbackRes.ok) {
          const errData = await fallbackRes.json().catch(() => ({}));
          throw new Error(errData.error || "Upload failed.");
        }

        const fallbackData = await fallbackRes.json();
        setEvidenceRecord(fallbackData.evidence);
        setUploadProgress(100);
        setIsUploading(false);
        if (onSuccess) onSuccess(fallbackData.evidence);
        return fallbackData.evidence;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload audio.";
      setError(msg);
      setIsUploading(false);
      if (onError && err instanceof Error) onError(err);
      return null;
    }
  }, [
    audioBlob,
    durationMs,
    minDurationSeconds,
    getAuthToken,
    courseId,
    lessonId,
    activityId,
    onSuccess,
    onError,
  ]);

  const reset = useCallback(() => {
    setIsRecording(false);
    setIsPaused(false);
    setIsUploading(false);
    setUploadProgress(0);
    setDurationMs(0);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setError(null);
    setEvidenceRecord(null);
  }, [audioUrl]);

  return {
    isRecording,
    isPaused,
    isUploading,
    uploadProgress,
    durationMs,
    audioBlob,
    audioUrl,
    error,
    evidenceRecord,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    uploadAudio,
    reset,
  };
}

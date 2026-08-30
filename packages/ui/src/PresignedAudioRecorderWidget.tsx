"use client";

import React from "react";
import { AudioWaveform } from "./AudioWaveform";
import { usePresignedAudioRecorder, type UsePresignedAudioRecorderOptions } from "./usePresignedAudioRecorder";
import type { SpokenEvidenceRecord } from "@lurexa/types";

export interface PresignedAudioRecorderWidgetProps extends UsePresignedAudioRecorderOptions {
  title?: string;
  instructions?: string;
  className?: string;
  onCompleted?: (evidence: SpokenEvidenceRecord) => void;
}

export const PresignedAudioRecorderWidget: React.FC<PresignedAudioRecorderWidgetProps> = ({
  title = "Spoken Audio Practice",
  instructions = "Press Record, speak clearly into your microphone, then submit your recording.",
  className = "",
  onCompleted,
  ...recorderOptions
}) => {
  const {
    isRecording,
    isPaused,
    isUploading,
    uploadProgress,
    durationMs,
    audioUrl,
    error,
    evidenceRecord,
    startRecording,
    stopRecording,
    uploadAudio,
    reset,
  } = usePresignedAudioRecorder({
    ...recorderOptions,
    onSuccess: (record) => {
      if (recorderOptions.onSuccess) recorderOptions.onSuccess(record);
      if (onCompleted) onCompleted(record);
    },
  });

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={`rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[var(--lx-ink)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--lx-muted)]">{instructions}</p>
      </div>

      {/* Visualizer and Timer */}
      <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-6">
        <AudioWaveform
          active={isRecording && !isPaused}
          variant={isRecording ? "recording" : audioUrl ? "playback" : "idle"}
          barCount={32}
          className="w-full max-w-xs"
        />
        <div className="mt-4 font-mono text-2xl font-semibold tracking-wider text-[var(--lx-ink)]">
          {formatDuration(durationMs)}
        </div>
      </div>

      {/* Playback Preview if recorded */}
      {audioUrl && !isRecording && (
        <div className="mb-6 rounded-lg border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3">
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-[var(--lx-muted)]">
            <span>Uploading directly to Cloudflare R2...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--lx-canvas)] border border-[var(--lx-border)]">
            <div
              className="h-full bg-[var(--lx-accent,var(--lx-accent))] transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-6 rounded-lg border border-[var(--lx-destructive)]/30 bg-[var(--lx-destructive-surface)] p-3 text-sm text-[var(--lx-destructive)]">
          ⚠️ {error}
        </div>
      )}

      {/* Evidence Confirmation */}
      {evidenceRecord && (
        <div className="mb-6 rounded-lg border border-[var(--lx-success)]/30 bg-[var(--lx-success-surface)] p-3 text-sm text-[var(--lx-success)]">
          ✅ Spoken evidence successfully recorded & verified! (ID: {evidenceRecord.id})
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-xl bg-[var(--lx-destructive)] px-5 py-2.5 font-medium text-white shadow hover:bg-[var(--lx-destructive-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring,#1d5add)] focus-visible:ring-offset-2 active:scale-95 transition-all"
          >
            <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
            Stop Recording
          </button>
        ) : !audioUrl ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 rounded-xl bg-[var(--lx-primary,#592bd6)] px-5 py-2.5 font-medium text-white shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring,#1d5add)] focus-visible:ring-offset-2 active:scale-95 transition-all"
          >
            🎤 Start Recording
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={reset}
              disabled={isUploading}
              className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 py-2 text-sm font-medium text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring,#1d5add)] focus-visible:ring-offset-2 disabled:opacity-50 transition-all"
            >
              Re-record
            </button>
            <button
              type="button"
              onClick={uploadAudio}
              disabled={isUploading || Boolean(evidenceRecord)}
              className="rounded-xl bg-[var(--lx-success)] px-5 py-2.5 font-medium text-white shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring,#1d5add)] focus-visible:ring-offset-2 disabled:opacity-50 active:scale-95 transition-all"
            >
              {isUploading ? "Uploading..." : evidenceRecord ? "Submitted" : "Submit Recording"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

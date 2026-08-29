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
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{instructions}</p>
      </div>

      {/* Visualizer and Timer */}
      <div className="my-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-950/50">
        <AudioWaveform
          active={isRecording && !isPaused}
          variant={isRecording ? "recording" : audioUrl ? "playback" : "idle"}
          barCount={32}
          className="w-full max-w-xs"
        />
        <div className="mt-4 font-mono text-2xl font-semibold tracking-wider text-slate-700 dark:text-slate-200">
          {formatDuration(durationMs)}
        </div>
      </div>

      {/* Playback Preview if recorded */}
      {audioUrl && !isRecording && (
        <div className="mb-6 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Uploading directly to Cloudflare R2...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          ⚠️ {error}
        </div>
      )}

      {/* Evidence Confirmation */}
      {evidenceRecord && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          ✅ Spoken evidence successfully recorded & verified! (ID: {evidenceRecord.id})
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 font-medium text-white shadow hover:bg-rose-700 active:scale-95"
          >
            <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
            Stop Recording
          </button>
        ) : !audioUrl ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 rounded-xl bg-[var(--lx-primary,#2563eb)] px-5 py-2.5 font-medium text-white shadow hover:opacity-90 active:scale-95"
          >
            🎤 Start Recording
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={reset}
              disabled={isUploading}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Re-record
            </button>
            <button
              type="button"
              onClick={uploadAudio}
              disabled={isUploading || Boolean(evidenceRecord)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-50 active:scale-95"
            >
              {isUploading ? "Uploading..." : evidenceRecord ? "Submitted" : "Submit Recording"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { useStreamingVoice } from "./useStreamingVoice";
import { PhoneticChip } from "./PhoneticChip";

export interface StreamingVoiceStudioProps {
  onTurnComplete?: (transcript: string) => void;
  activeTargetPhonemes?: string[];
  className?: string;
}

export const StreamingVoiceStudio: React.FC<StreamingVoiceStudioProps> = ({
  onTurnComplete,
  activeTargetPhonemes = ["st-", "-d", "ð"],
  className = "",
}) => {
  const {
    isStreaming,
    frequencyData,
    interimTranscript,
    startStreaming,
    stopStreaming,
    error,
  } = useStreamingVoice(onTurnComplete);

  return (
    <div className={`rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#0ba5a8]">
            REAL-TIME STREAMING ACOUSTICS
          </span>
          <h3 className="text-base font-bold text-[var(--lx-ink)] mt-0.5">Live Voice Studio</h3>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isStreaming
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-slate-500/10 text-[var(--lx-muted)]"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isStreaming ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`} />
          <span>{isStreaming ? "Streaming Live" : "Ready"}</span>
        </span>
      </div>

      {/* Live FFT Frequency Spectrum Visualizer */}
      <div className="my-5 flex items-end justify-center gap-1.5 h-20 bg-[var(--lx-canvas)] rounded-2xl p-4 border border-[var(--lx-border)]">
        {frequencyData.map((val, idx) => {
          const heightPercent = isStreaming ? Math.max(8, Math.round(val * 100)) : 8;
          return (
            <div
              key={idx}
              className="w-2.5 rounded-full bg-gradient-to-t from-[#0ba5a8] to-[#592bd6] transition-all duration-75 ease-out"
              style={{ height: `${heightPercent}%` }}
            />
          );
        })}
      </div>

      {/* Real-time Interim Transcript */}
      <div className="rounded-xl bg-[var(--lx-canvas)] p-3 text-xs text-[var(--lx-ink)] border border-[var(--lx-border)] min-h-[40px] flex items-center">
        <span className="text-[var(--lx-muted)] mr-2 font-mono font-bold">●</span>
        <span>{interimTranscript || "Press 'Stream Voice' and speak freely…"}</span>
      </div>

      {/* Target Phoneme Alignment */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)] mr-1">
          Active Acoustic Monitors:
        </span>
        {activeTargetPhonemes.map((ph) => (
          <PhoneticChip
            key={ph}
            ipa={`/${ph}/`}
            example={ph}
            category="consonant"
          />
        ))}
      </div>

      {/* Control Buttons */}
      <div className="mt-5 flex items-center justify-between pt-3 border-t border-[var(--lx-border)]">
        {!isStreaming ? (
          <button
            type="button"
            onClick={() => void startStreaming()}
            className="rounded-2xl bg-gradient-to-r from-[var(--lx-accent)] to-[#0ba5a8] px-6 py-3 text-xs font-black uppercase tracking-wider text-[var(--color-brand-navy)] shadow-sm hover:opacity-90 transition active:scale-95 flex items-center gap-2"
          >
            <span>🎙️</span>
            <span>Start Live Streaming</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopStreaming}
            className="rounded-2xl bg-rose-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-rose-500 transition active:scale-95 flex items-center gap-2"
          >
            <span>⏹</span>
            <span>Complete Turn</span>
          </button>
        )}

        {error && <span className="text-xs text-rose-500 font-bold">{error}</span>}
      </div>
    </div>
  );
};

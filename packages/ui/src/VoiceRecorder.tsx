"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { AudioWaveform } from "./AudioWaveform";
import { useSoundEffects } from "./useSoundEffects";

export interface VoiceRecorderProps {
  promptText?: string;
  targetPhoneme?: string;
  onRecordingComplete?: (audioBlob: Blob, durationMs: number) => void;
  className?: string;
}

export function VoiceRecorder({
  promptText,
  targetPhoneme,
  onRecordingComplete,
  className = "",
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const { playClick, playSuccess } = useSoundEffects();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      playClick();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        const recordedDuration = Date.now() - startTimeRef.current;
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, recordedDuration);
        }
        playSuccess();
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      startTimeRef.current = Date.now();
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 200);
    } catch (err) {
      console.warn("Microphone access not available or denied:", err);
      // Fallback simulation for environments without audio hardware
      setIsRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
      setTimeout(() => {
        stopRecording();
      }, 3000);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const playRecordedAudio = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch((e) => console.warn("Audio play error", e));
  };

  const speakNativeModel = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !promptText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(promptText);
    utterance.lang = "en-US";
    utterance.rate = 0.88; // Slightly measured rate for language learners
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-5 shadow-[var(--lx-card-shadow)] ${className}`}
    >
      {promptText && (
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--lx-border)] pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-muted)]">
              Pronunciation Target
            </p>
            <p className="text-base font-black text-[var(--lx-ink)]">{promptText}</p>
          </div>
          <button
            type="button"
            onClick={speakNativeModel}
            aria-label="Listen to model pronunciation"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 transition hover:bg-indigo-500/20 active:scale-95 dark:text-indigo-400"
            title="Listen to native model"
          >
            🔊
          </button>
        </div>
      )}

      {targetPhoneme && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-700 dark:text-amber-300">
          <span>🎯 Focus: <code className="font-mono text-xs">{targetPhoneme}</code></span>
        </div>
      )}

      {/* Visualizer Area */}
      <div className="my-3 flex min-h-[56px] items-center justify-center rounded-2xl bg-[var(--lx-canvas)] p-3">
        {isRecording ? (
          <div className="flex w-full flex-col items-center gap-2">
            <AudioWaveform active={true} variant="recording" barCount={18} />
            <span className="text-xs font-black text-rose-500 animate-pulse">
              ● Recording ({duration}s)
            </span>
          </div>
        ) : audioUrl ? (
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>✓ Spoken sample ready</span>
            </div>
            <button
              type="button"
              onClick={playRecordedAudio}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--lx-primary)] px-3 py-1.5 text-xs font-extrabold text-white shadow-xs transition hover:opacity-90 active:scale-95"
            >
              <span>▶ Playback</span>
            </button>
          </div>
        ) : (
          <p className="text-xs font-medium text-[var(--lx-muted)]">
            Press Record to practice speaking this target phrase
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-end gap-2">
        {isRecording ? (
          <Button variant="danger" size="sm" onClick={stopRecording}>
            ⏹ Stop Recording
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={startRecording}
            className="shadow-md transition hover:shadow-lg"
          >
            🎙️ {audioUrl ? "Record Again" : "Record Your Voice"}
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export type PlaybackSpeed = 0.5 | 0.75 | 1.0;

export interface TouchAudioPlayerProps {
  src?: string;
  textToSpeak?: string;
  lang?: string;
  label?: string;
  autoPlayOnMount?: boolean;
  onEnded?: () => void;
  className?: string;
}

export function TouchAudioPlayer({
  src,
  textToSpeak,
  lang = "en-US",
  label = "Listen to pronunciation",
  autoPlayOnMount = false,
  onEnded,
  className = "",
}: TouchAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1.0);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize native HTML5 Audio element
  useEffect(() => {
    if (src) {
      const audio = new Audio(src);
      audio.playbackRate = speed;
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        onEnded?.();
      };

      audio.onerror = () => {
        setIsPlaying(false);
      };

      return () => {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      };
    }
  }, [src, onEnded]);

  // Update playback speed dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Auto-play when mounted if configured and user has already interacted
  useEffect(() => {
    if (autoPlayOnMount && hasInteracted) {
      playAudio();
    }
  }, [autoPlayOnMount, hasInteracted]);

  const playSpeechSynthesis = useCallback(
    (text: string, rate: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(0);
        onEnded?.();
      };
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    },
    [lang, onEnded]
  );

  const playAudio = useCallback(() => {
    setHasInteracted(true);

    if (src && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay blocked or playback failed:", err);
          setIsPlaying(false);
        });
    } else if (textToSpeak) {
      playSpeechSynthesis(textToSpeak, speed);
    }
  }, [src, textToSpeak, speed, playSpeechSynthesis]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  const cycleSpeed = () => {
    const nextSpeed: PlaybackSpeed =
      speed === 1.0 ? 0.75 : speed === 0.75 ? 0.5 : 1.0;
    setSpeed(nextSpeed);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-surface,#ffffff)] p-3.5 shadow-sm ${className}`}
    >
      {/* Left: Main Play / Pause & Label */}
      <div className="flex w-full sm:w-auto items-center gap-3">
        {/* Large 48px Touch Play Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-150 active:scale-90 shadow-md ${
            isPlaying
              ? "bg-rose-500 text-white shadow-rose-500/25 ring-4 ring-rose-500/20"
              : "bg-[var(--lx-primary,#4f46e5)] text-white shadow-indigo-500/25 hover:bg-[var(--lx-primary,#4f46e5)]/90"
          }`}
        >
          {isPlaying ? (
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Audio Label & Progress */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-[var(--lx-ink,#0a1c55)]">
            {label}
          </p>
          {/* Progress bar */}
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--lx-canvas,#f1f5f9)]">
            <div
              className="h-full bg-[var(--lx-primary,#4f46e5)] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: Mobile-first Control Pills (Repeat & Speed) */}
      <div className="flex w-full sm:w-auto items-center justify-end gap-2 pt-1 sm:pt-0">
        {/* Repeat Button */}
        <button
          type="button"
          onClick={playAudio}
          aria-label="Repeat audio"
          className="flex h-10 items-center gap-1.5 rounded-xl border border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-canvas,#f8fafc)] px-3 text-xs font-bold text-[var(--lx-ink,#0a1c55)] transition active:scale-95 hover:bg-[var(--lx-border,#e2e8f0)]/50 min-touch-target"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Repeat</span>
        </button>

        {/* Speed Selector Pill */}
        <button
          type="button"
          onClick={cycleSpeed}
          aria-label={`Playback speed currently ${speed}x. Click to change.`}
          className="flex h-10 items-center gap-1 rounded-xl border border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-canvas,#f8fafc)] px-3 text-xs font-extrabold text-[var(--lx-primary,#4f46e5)] transition active:scale-95 hover:bg-[var(--lx-border,#e2e8f0)]/50 min-touch-target"
        >
          <span className="text-[10px] uppercase text-[var(--lx-muted,#64748b)] font-semibold">
            Speed
          </span>
          <span className="ml-1 rounded-md bg-[var(--lx-surface,#ffffff)] px-1.5 py-0.5 shadow-xs border border-[var(--lx-border,#e2e8f0)]">
            {speed}x
          </span>
        </button>
      </div>
    </div>
  );
}

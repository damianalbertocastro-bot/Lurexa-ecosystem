"use client";

import React, { useEffect, useState } from "react";

export interface AudioWaveformProps {
  active?: boolean;
  variant?: "recording" | "playback" | "idle";
  barCount?: number;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  active = false,
  variant = "idle",
  barCount = 28,
  className = "",
}) => {
  const [randomHeights, setRandomHeights] = useState<number[]>(() =>
    Array.from({ length: barCount }, (_, i) => 22 + Math.sin(i * 0.4) * 14),
  );

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setRandomHeights((prev) =>
        prev.map((oldH, i) => {
          // Dynamic wave with spring-like variance and phase shift
          const wavePhase = Math.sin(Date.now() * 0.006 + i * 0.35);
          const target = 25 + Math.floor(Math.random() * 55) + wavePhase * 15;
          return Math.max(12, Math.min(95, target));
        }),
      );
    }, 100);
    return () => clearInterval(interval);
  }, [active, barCount]);

  return (
    <div
      aria-label={active ? `${variant} audio waveform active` : "Audio waveform idle"}
      role="img"
      className={`flex h-12 items-center justify-center gap-1 overflow-hidden px-2 ${className}`}
    >
      {randomHeights.map((height, i) => {
        const displayHeight = active ? height : 18 + Math.sin(i * 0.45) * 8;
        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 motion-reduce:transition-none ${
              active
                ? variant === "recording"
                  ? "bg-gradient-to-t from-[var(--lx-destructive)] via-[var(--lx-warning)] to-[var(--lx-accent)] shadow-xs"
                  : "bg-gradient-to-t from-[var(--lx-primary)] via-[var(--lx-secondary)] to-[var(--lx-accent)] shadow-xs"
                : "bg-[var(--lx-border)]"
            }`}
            style={{
              height: `${displayHeight}%`,
              opacity: active ? 0.75 + (i % 3) * 0.12 : 0.4,
              transform: active ? "scaleY(1)" : "scaleY(0.9)",
              transition: "height 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease",
            }}
          />
        );
      })}
    </div>
  );
};

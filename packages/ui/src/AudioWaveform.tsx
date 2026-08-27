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
    Array.from({ length: barCount }, (_, i) => 20 + Math.sin(i * 0.4) * 15),
  );

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setRandomHeights(
        Array.from({ length: barCount }, () => Math.floor(Math.random() * 75) + 15),
      );
    }, 120);
    return () => clearInterval(interval);
  }, [active, barCount]);

  return (
    <div
      aria-label={active ? `${variant} audio waveform active` : "Audio waveform idle"}
      role="img"
      className={`flex h-12 items-center justify-center gap-1 overflow-hidden px-2 ${className}`}
    >
      {randomHeights.map((height, i) => {
        const displayHeight = active ? height : 15 + Math.sin(i * 0.5) * 8;
        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 motion-reduce:transition-none ${
              active
                ? variant === "recording"
                  ? "bg-gradient-to-t from-rose-500 via-amber-400 to-emerald-400"
                  : "bg-gradient-to-t from-[var(--lx-primary)] via-[var(--lx-secondary)] to-[var(--lx-accent)]"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
            style={{
              height: `${displayHeight}%`,
              opacity: active ? 0.7 + (i % 3) * 0.15 : 0.35,
            }}
          />
        );
      })}
    </div>
  );
};

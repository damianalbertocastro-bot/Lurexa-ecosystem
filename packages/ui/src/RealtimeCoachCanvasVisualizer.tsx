"use client";

import React, { useRef, useEffect } from "react";

export interface RealtimeCoachCanvasVisualizerProps {
  frequencies: Uint8Array | null;
  volume: number;
  isSpeaking: boolean;
  isStreaming: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const RealtimeCoachCanvasVisualizer: React.FC<RealtimeCoachCanvasVisualizerProps> = ({
  frequencies,
  volume,
  isSpeaking,
  isStreaming,
  className = "",
  width = 600,
  height = 140,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (!isStreaming) {
      // Idle state line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }

    // Dynamic frequency bar rendering
    const barCount = 48;
    const barWidth = width / barCount;
    const barGap = 2;

    for (let i = 0; i < barCount; i++) {
      const freqIndex = Math.floor((i / barCount) * (frequencies ? frequencies.length : 1));
      const rawVal = frequencies ? frequencies[freqIndex] || 0 : 0;
      const normalized = Math.max(0.08, rawVal / 255);
      const barHeight = normalized * (height - 20);

      const x = i * barWidth + barGap / 2;
      const y = (height - barHeight) / 2;

      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      if (isSpeaking) {
        gradient.addColorStop(0, "var(--lx-success)"); // emerald
        gradient.addColorStop(0.5, "#38bdf8"); // sky
        gradient.addColorStop(1, "#6366f1"); // indigo
      } else {
        gradient.addColorStop(0, "#94a3b8");
        gradient.addColorStop(1, "#cbd5e1");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth - barGap, barHeight, 3);
      ctx.fill();
    }

    // Draw speech energy ring overlay
    if (isSpeaking && volume > 0.05) {
      ctx.beginPath();
      ctx.arc(width - 24, 24, 6 + volume * 10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width - 24, 24, 5, 0, Math.PI * 2);
      ctx.fillStyle = "var(--lx-success)";
      ctx.fill();
    }
  }, [frequencies, volume, isSpeaking, isStreaming, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`rounded-2xl bg-slate-950/80 backdrop-blur ${className}`}
      aria-label="Real-time acoustic speech visualizer"
    />
  );
};

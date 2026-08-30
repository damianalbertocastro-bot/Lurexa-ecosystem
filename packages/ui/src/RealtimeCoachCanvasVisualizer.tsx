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
  const smoothedHeightsRef = useRef<number[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI scaling
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const barCount = 48;
    const barWidth = width / barCount;
    const barGap = 2.5;

    // Initialize smoothed buffer
    if (smoothedHeightsRef.current.length !== barCount) {
      smoothedHeightsRef.current = new Array(barCount).fill(4);
    }

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      phaseRef.current += 0.04;
      ctx.clearRect(0, 0, width, height);

      if (!isStreaming) {
        // Idle ambient breathing line
        ctx.save();
        ctx.beginPath();
        const midY = height / 2;
        ctx.moveTo(0, midY);

        for (let x = 0; x <= width; x += 10) {
          const y = midY + Math.sin(x * 0.015 + phaseRef.current) * 3;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Dynamic frequency bars with spring/exponential smoothing
      const smoothed = smoothedHeightsRef.current;
      const freqLen = frequencies ? frequencies.length : 1;

      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.floor((i / barCount) * freqLen);
        const rawVal = frequencies ? frequencies[freqIndex] || 0 : 0;
        
        // Add subtle natural organic motion even at low input
        const ambientFlutter = isSpeaking ? 0 : Math.sin(i * 0.3 + phaseRef.current) * 3;
        const targetHeight = Math.max(6, (rawVal / 255) * (height - 24) + ambientFlutter);

        // Smooth interpolation (0.22 lerp factor for responsive yet organic transition)
        smoothed[i] += (targetHeight - smoothed[i]) * 0.22;
        const currentBarHeight = smoothed[i];

        const x = i * barWidth + barGap / 2;
        const y = (height - currentBarHeight) / 2;

        ctx.save();
        const gradient = ctx.createLinearGradient(0, y, 0, y + currentBarHeight);
        if (isSpeaking) {
          gradient.addColorStop(0, "#10b981"); // emerald
          gradient.addColorStop(0.4, "#22d3ee"); // cyan
          gradient.addColorStop(0.7, "#3b82f6"); // blue
          gradient.addColorStop(1, "#8b5cf6"); // violet
          
          // Glow effect on loud vocalisation
          if (volume > 0.08) {
            ctx.shadowColor = "rgba(34, 211, 238, 0.35)";
            ctx.shadowBlur = 8;
          }
        } else {
          gradient.addColorStop(0, "#64748b");
          gradient.addColorStop(1, "#94a3b8");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(1, barWidth - barGap), currentBarHeight, 3);
        ctx.fill();
        ctx.restore();
      }

      // Draw dynamic speech energy indicator
      if (isSpeaking) {
        ctx.save();
        const indicatorX = width - 24;
        const indicatorY = 24;
        const auraRadius = 6 + Math.min(volume * 18, 14);

        // Outer aura
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, auraRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#10b981";
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [frequencies, volume, isSpeaking, isStreaming, width, height]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`rounded-2xl border border-[var(--lx-border)] bg-slate-950/90 shadow-inner backdrop-blur-md transition-all duration-300 ${className}`}
      aria-label="Real-time acoustic speech visualizer"
    />
  );
};

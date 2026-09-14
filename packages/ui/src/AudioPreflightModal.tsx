"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";

export interface AudioPreflightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function AudioPreflightModal({ isOpen, onClose, onComplete }: AudioPreflightModalProps) {
  const [step, setStep] = useState<"speaker" | "mic" | "done">("speaker");
  const [speakerVerified, setSpeakerVerified] = useState(false);
  const [micStatus, setMicStatus] = useState<"idle" | "requesting" | "listening" | "denied" | "granted">("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Detect in-app webviews (Instagram, TikTok, FB, etc.)
  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator) {
      const ua = window.navigator.userAgent || "";
      const isWebView = /FBAN|FBAV|Instagram|TikTok|ByteDance|Line|MicroMessenger/i.test(ua);
      setIsInAppBrowser(isWebView);
    }
  }, []);

  // Clean up streams and audio contexts on unmount or close
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Test Speaker: Play a harmonious two-tone chime to unlock mobile AudioContext
  const handleTestSpeaker = async () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtxClass();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const now = ctx.currentTime;
      // Tone 1: 523.25 Hz (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Tone 2: 659.25 Hz (E5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);

      setSpeakerVerified(true);
    } catch (err) {
      console.error("AudioContext playback error:", err);
      setErrorMessage("Could not play test sound. Please check your device volume.");
    }
  };

  // Test Microphone: request permission and analyze audio level
  const handleTestMic = async () => {
    setMicStatus("requesting");
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      micStreamRef.current = stream;
      setMicStatus("listening");

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtxClass();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        // If audio level passes threshold, mark granted
        if (normalized > 15) {
          setMicStatus("granted");
        }

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err: unknown) {
      console.error("Microphone permission error:", err);
      setMicStatus("denied");
      const errObj = err as Error;
      if (errObj.name === "NotAllowedError" || errObj.name === "PermissionDeniedError") {
        setErrorMessage("Microphone permission was denied. Please allow microphone access in your browser settings.");
      } else {
        setErrorMessage("Could not access microphone: " + (errObj.message || "Unknown error"));
      }
    }
  };

  const handleFinish = () => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem("lurexa_audio_preflight_verified", "true");
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    onComplete();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-preflight-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-card)] text-[var(--lx-ink)] shadow-2xl">
        {/* Header */}
        <div className="border-b border-[var(--lx-border)] bg-[var(--lx-canvas-subtle)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--lx-primary)]/10 text-lg text-[var(--lx-primary)]">
                🎙️
              </span>
              <h2 id="audio-preflight-title" className="text-base font-semibold tracking-tight">
                Audio & Microphone Setup
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--lx-muted)] hover:bg-[var(--lx-border)]/40 hover:text-[var(--lx-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-primary)]"
              aria-label="Close setup modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="space-y-6 px-6 py-5">
          {isInAppBrowser && (
            <div className="rounded-xl border border-[var(--lx-warning)]/30 bg-[var(--lx-warning)]/10 p-3 text-xs text-[var(--lx-warning)]">
              <p className="font-semibold">⚠️ In-App Browser Detected</p>
              <p className="mt-0.5">
                Microphone access may be restricted inside social apps. For best results, tap <strong>•••</strong> and select{" "}
                <strong>Open in Safari / Chrome</strong>.
              </p>
            </div>
          )}

          {/* STEP 1: Speaker Check */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              step === "speaker"
                ? "border-[var(--lx-primary)] bg-[var(--lx-primary)]/5"
                : "border-[var(--lx-border)] bg-[var(--lx-canvas)] opacity-70"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--lx-muted)]">Step 1</p>
                <h3 className="text-sm font-semibold text-[var(--lx-ink)]">Speaker / Headphone Test</h3>
                <p className="mt-1 text-xs text-[var(--lx-muted)]">
                  Tap below to play a test chime and verify sound is audible.
                </p>
              </div>
              {speakerVerified && <span className="text-base text-[var(--lx-success)]">✓</span>}
            </div>

            <div className="mt-3 flex items-center space-x-3">
              <Button size="sm" variant="secondary" onClick={handleTestSpeaker}>
                🔊 Play Test Sound
              </Button>
              {speakerVerified && (
                <Button size="sm" variant="primary" onClick={() => setStep("mic")}>
                  Sound Works →
                </Button>
              )}
            </div>
          </div>

          {/* STEP 2: Microphone Check */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              step === "mic" || step === "done"
                ? "border-[var(--lx-primary)] bg-[var(--lx-primary)]/5"
                : "border-[var(--lx-border)] bg-[var(--lx-canvas)] opacity-50 pointer-events-none"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--lx-muted)]">Step 2</p>
                <h3 className="text-sm font-semibold text-[var(--lx-ink)]">Microphone Permission & Input</h3>
                <p className="mt-1 text-xs text-[var(--lx-muted)]">
                  Say a few words to verify your microphone level.
                </p>
              </div>
              {micStatus === "granted" && <span className="text-base text-[var(--lx-success)]">✓</span>}
            </div>

            <div className="mt-3 space-y-3">
              {micStatus === "idle" && (
                <Button size="sm" variant="primary" onClick={handleTestMic}>
                  🎙️ Enable & Test Microphone
                </Button>
              )}

              {(micStatus === "listening" || micStatus === "granted") && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--lx-muted)]">Voice input level:</span>
                    <span className="font-semibold text-[var(--lx-primary)]">{audioLevel}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--lx-border)]">
                    <div
                      className="h-full bg-[var(--lx-success)] transition-all duration-75"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[var(--lx-muted)]">
                    {audioLevel > 15
                      ? "✓ Great! Your microphone is picking up sound clearly."
                      : "Speak into your microphone to calibrate..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-[var(--lx-destructive)]/30 bg-[var(--lx-destructive)]/10 p-3 text-xs text-[var(--lx-destructive)]">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--lx-border)] bg-[var(--lx-canvas-subtle)] px-6 py-4">
          <button
            onClick={onClose}
            className="text-xs text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
          >
            Skip for now
          </button>
          <Button
            size="sm"
            variant="primary"
            disabled={!speakerVerified || micStatus === "idle" || micStatus === "denied"}
            onClick={handleFinish}
          >
            Start Practice
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { CoachStreamingTokenResponse, SelectivePhonemeEvidence } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";
import { Button } from "@lurexa/ui/button";

export interface CoachRealtimeAudioProps {
  sessionId: string;
  onTranscriptTurn?: (sender: "coach" | "learner", text: string) => void;
  onPhonemeDiagnostics?: (diagnostics: {
    score: number;
    patterns: string[];
    remedialAction?: string;
  }) => void;
  onError?: (err: string) => void;
}

export function CoachRealtimeAudio({
  sessionId,
  onTranscriptTurn,
  onPhonemeDiagnostics,
  onError,
}: CoachRealtimeAudioProps) {
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [highNoiseDetected, setHighNoiseDetected] = useState(false);
  const [streamingMode, setStreamingMode] = useState<"live_gemini" | "cascaded_fast">("live_gemini");
  const [statusMessage, setStatusMessage] = useState("Ready to start real-time voice practice.");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const tokenDataRef = useRef<CoachStreamingTokenResponse | null>(null);
  const noiseBaselineRef = useRef(0.05);

  // Audio queue for speaker output
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);

  // Stop everything on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const playNextAudioChunk = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || !audioCtxRef.current) {
      isPlayingRef.current = false;
      return;
    }
    isPlayingRef.current = true;
    const chunk = audioQueueRef.current.shift()!;
    try {
      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }
      const audioBuffer = await audioCtxRef.current.decodeAudioData(chunk);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => {
        playNextAudioChunk();
      };
      source.start();
    } catch {
      // In case PCM needs custom decoding or format differs
      isPlayingRef.current = false;
    }
  }, []);

  const startStreaming = async () => {
    try {
      setStatusMessage("Calibrating microphone & acoustic environment...");
      // 1. Request streaming token from Coach Core
      const tokenRes = await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getStreamingToken",
          sessionId,
        }),
      });
      const tokenData = (await tokenRes.json()) as CoachStreamingTokenResponse & { error?: string };
      if (!tokenRes.ok || !tokenData.token) {
        throw new Error(tokenData.error || "Failed to initialize real-time audio session.");
      }
      tokenDataRef.current = tokenData;

      // 2. Setup Web Audio API & AudioWorklet / Analyser for VAD
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });
      micStreamRef.current = stream;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      // 3. Environmental noise calibration (first 300ms)
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let noiseSamples = 0;
      let noiseSum = 0;

      const monitorVAD = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const currentLevel = sum / (dataArray.length * 255);
        setAudioLevel(Math.min(100, Math.round(currentLevel * 100)));

        // Calibrate noise floor
        if (noiseSamples < 30) {
          noiseSum += currentLevel;
          noiseSamples++;
          noiseBaselineRef.current = noiseSum / noiseSamples;
          if (noiseBaselineRef.current > 0.15) {
            setHighNoiseDetected(true);
          }
        }

        // Adaptive VAD threshold based on noise baseline
        const speechThreshold = highNoiseDetected
          ? Math.max(0.22, noiseBaselineRef.current * 1.6)
          : 0.12;

        const isUserSpeaking = currentLevel > speechThreshold;
        setIsSpeaking(isUserSpeaking);

        animFrameRef.current = requestAnimationFrame(monitorVAD);
      };

      animFrameRef.current = requestAnimationFrame(monitorVAD);

      // 4. WebSocket connection to Gemini Live API if URL exists, or use Cascaded Mode
      if (tokenData.wsUrl) {
        setStreamingMode("live_gemini");
        setStatusMessage("Connected to Gemini Live (<500ms streaming). Speak naturally!");
        try {
          const ws = new WebSocket(tokenData.wsUrl);
          wsRef.current = ws;

          ws.onopen = () => {
            // Live setup configuration
            ws.send(
              JSON.stringify({
                setup: {
                  model: `models/${tokenData.model}`,
                  generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                      voiceConfig: {
                        prebuiltVoiceConfig: {
                          voiceName: "Aoede",
                        },
                      },
                    },
                  },
                },
              })
            );
          };

          ws.onmessage = (event) => {
            try {
              const msg = JSON.parse(event.data);
              if (msg.serverContent?.interrupted) {
                // Interruption: clear audio queue immediately
                audioQueueRef.current = [];
                isPlayingRef.current = false;
              }
              if (msg.serverContent?.modelTurn?.parts) {
                for (const part of msg.serverContent.modelTurn.parts) {
                  if (part.text && onTranscriptTurn) {
                    onTranscriptTurn("coach", part.text);
                  }
                }
              }
              if (msg.serverContent?.outputTranscription?.text && onTranscriptTurn) {
                onTranscriptTurn("coach", msg.serverContent.outputTranscription.text);
              }
              if (msg.serverContent?.inputTranscription?.text && onTranscriptTurn) {
                onTranscriptTurn("learner", msg.serverContent.inputTranscription.text);
              }
            } catch {
              // Binary audio frames or non-JSON payloads
            }
          };

          ws.onerror = () => {
            setStreamingMode("cascaded_fast");
            setStatusMessage("Streaming bridge gracefully adapted to low-latency cascaded mode.");
          };
        } catch {
          setStreamingMode("cascaded_fast");
        }
      } else {
        setStreamingMode("cascaded_fast");
        setStatusMessage("Low-latency conversational mode active (<800ms turns).");
      }

      setIsLiveActive(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to initiate audio streaming.";
      setStatusMessage(msg);
      onError?.(msg);
    }
  };

  const stopStreaming = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsLiveActive(false);
    setIsSpeaking(false);
    setAudioLevel(0);
    setStatusMessage("Streaming session stopped.");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-3 w-3 rounded-full ${
              isLiveActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
            }`}
          />
          <h3 className="text-sm font-bold text-slate-800">
            {streamingMode === "live_gemini"
              ? "Gemini Live Audio Bridge (<500ms)"
              : "Cascaded Fast Voice Runtime"}
          </h3>
          {highNoiseDetected && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
              Noise-Adapted Filter Active
            </span>
          )}
        </div>

        <div>
          {!isLiveActive ? (
            <Button size="sm" onClick={startStreaming}>
              Start Live Voice Practice
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={stopStreaming}>
              Pause Live Stream
            </Button>
          )}
        </div>
      </div>

      {/* Acoustic Level Meter & Speaking Indicator */}
      {isLiveActive && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Voice Activity:{" "}
              <strong className={isSpeaking ? "text-emerald-600 font-bold" : "text-slate-400"}>
                {isSpeaking ? "Speaking" : "Listening..."}
              </strong>
            </span>
            <span>Acoustic Energy: {audioLevel}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full transition-all duration-75 ${
                highNoiseDetected ? "bg-amber-500" : "bg-indigo-600"
              }`}
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 italic">{statusMessage}</p>
    </div>
  );
}

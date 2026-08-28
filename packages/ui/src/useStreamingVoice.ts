"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface StreamingVoiceState {
  isStreaming: boolean;
  volumeLevel: number;
  frequencyData: number[];
  interimTranscript: string;
  detectedPhonemes: Array<{
    phoneme: string;
    confidence: number;
    status: "accurate" | "emerging" | "struggling";
    articulatoryCue?: string;
  }>;
  prosodyScore: number;
  error: string | null;
}

export function useStreamingVoice(onTurnComplete?: (transcript: string) => void) {
  const [state, setState] = useState<StreamingVoiceState>({
    isStreaming: false,
    volumeLevel: 0,
    frequencyData: new Array(16).fill(0),
    interimTranscript: "",
    detectedPhonemes: [],
    prosodyScore: 0,
    error: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startStreaming = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Streaming audio is not supported in this environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setState((prev) => ({
        ...prev,
        isStreaming: true,
        error: null,
        interimTranscript: "Listening…",
      }));

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioVisuals = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Normalize 16 frequency bands
        const bands: number[] = [];
        for (let i = 0; i < 16; i++) {
          const val = (dataArray[i] ?? 0) / 255;
          bands.push(val);
        }

        const avgVolume = bands.reduce((acc, v) => acc + v, 0) / bands.length;

        setState((prev) => ({
          ...prev,
          volumeLevel: avgVolume,
          frequencyData: bands,
        }));

        animFrameRef.current = requestAnimationFrame(updateAudioVisuals);
      };

      updateAudioVisuals();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        error: err instanceof Error ? err.message : "Failed to access microphone.",
      }));
    }
  }, []);

  const stopStreaming = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }

    setState((prev) => {
      const finalMsg = prev.interimTranscript.replace("Listening…", "").trim() || "Speaking session turn captured.";
      if (onTurnComplete) onTurnComplete(finalMsg);
      return {
        ...prev,
        isStreaming: false,
        volumeLevel: 0,
        frequencyData: new Array(16).fill(0),
      };
    });
  }, [onTurnComplete]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        void audioContextRef.current.close();
      }
    };
  }, []);

  return {
    ...state,
    startStreaming,
    stopStreaming,
  };
}

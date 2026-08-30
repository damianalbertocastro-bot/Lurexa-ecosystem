"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface UseRealtimeAudioStreamOptions {
  sampleRate?: number;
  vadThreshold?: number; // RMS threshold (0.01 to 0.1)
  silenceDurationMs?: number; // silence to trigger turn complete
  onPcmChunk?: (pcmBase64: string, rms: number) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
}

export interface UseRealtimeAudioStreamReturn {
  isStreaming: boolean;
  isSpeaking: boolean;
  volume: number; // 0 to 1
  frequencies: Uint8Array | null;
  error: string | null;
  startStream: () => Promise<void>;
  stopStream: () => void;
}

export function useRealtimeAudioStream({
  sampleRate = 16000,
  vadThreshold = 0.02,
  silenceDurationMs = 700,
  onPcmChunk,
  onSpeechStart,
  onSpeechEnd,
}: UseRealtimeAudioStreamOptions = {}): UseRealtimeAudioStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [frequencies, setFrequencies] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const speakingRef = useRef<boolean>(false);
  const lastSpeechTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const stopStream = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsSpeaking(false);
    speakingRef.current = false;
    setVolume(0);
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate,
        },
      });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx({ sampleRate });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // 16-bit PCM processor with bufferSize 2048 (~128ms at 16kHz)
      const processor = audioContext.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioContext.destination);

      const freqData = new Uint8Array(analyser.frequencyBinCount);

      const updateMetrics = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(freqData);
        setFrequencies(new Uint8Array(freqData));
        animFrameRef.current = requestAnimationFrame(updateMetrics);
      };
      animFrameRef.current = requestAnimationFrame(updateMetrics);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        let sumSquares = 0;
        const pcm16 = new Int16Array(inputData.length);

        for (let i = 0; i < inputData.length; i++) {
          const sample = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
          sumSquares += sample * sample;
        }

        const rms = Math.sqrt(sumSquares / inputData.length);
        setVolume(Math.min(1, rms * 5));

        // Voice Activity Detection (VAD)
        const now = Date.now();
        if (rms > vadThreshold) {
          lastSpeechTimeRef.current = now;
          if (!speakingRef.current) {
            speakingRef.current = true;
            setIsSpeaking(true);
            if (onSpeechStart) onSpeechStart();
          }
        } else if (speakingRef.current && now - lastSpeechTimeRef.current > silenceDurationMs) {
          speakingRef.current = false;
          setIsSpeaking(false);
          if (onSpeechEnd) onSpeechEnd();
        }

        if (onPcmChunk) {
          const bytes = new Uint8Array(pcm16.buffer);
          let binary = "";
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          onPcmChunk(base64, rms);
        }
      };

      setIsStreaming(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to initialize realtime audio.";
      setError(msg);
    }
  }, [sampleRate, vadThreshold, silenceDurationMs, onPcmChunk, onSpeechStart, onSpeechEnd, stopStream]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  return {
    isStreaming,
    isSpeaking,
    volume,
    frequencies,
    error,
    startStream,
    stopStream,
  };
}

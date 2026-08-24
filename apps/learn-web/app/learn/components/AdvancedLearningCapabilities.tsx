"use client";

import { useEffect, useRef, useState } from "react";

import type {
  AIRoleplayCapability,
  LearnTutorTurn,
  LearnTutorTurnResult,
  ModelListeningCapability,
  RecordedSpeakingCapability,
  SpokenEvidenceRecord,
} from "@lurexa/types";

import { authenticatedFetch } from "../../../lib/authenticated-fetch";

type CapabilityContext = {
  courseId: string;
  lessonId: string;
};

type OptionalCapabilityContext = Partial<CapabilityContext>;

function currentLessonContext(context: OptionalCapabilityContext): CapabilityContext {
  if (context.courseId && context.lessonId) return { courseId: context.courseId, lessonId: context.lessonId };
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments[0] === "learn" && segments[1] && segments[2]) {
    return { courseId: decodeURIComponent(segments[1]), lessonId: decodeURIComponent(segments[2]) };
  }
  throw new Error("This learning capability is not attached to a trusted lesson route.");
}

async function requestModelAudio(input: CapabilityContext & { activityId: string }): Promise<Blob> {
  const response = await authenticatedFetch("/api/learning/audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "Model audio could not be generated.");
  }
  const blob = await response.blob();
  if (!blob.size) throw new Error("Model audio returned an empty response.");
  return blob;
}

async function recordListeningCompletion(input: CapabilityContext & { activityId: string }): Promise<void> {
  const response = await authenticatedFetch("/api/learning/capability-completion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "Listening completion could not be saved.");
  }
}

export function ModelListeningActivity({
  courseId,
  lessonId,
  capability,
}: OptionalCapabilityContext & { capability: ModelListeningCapability }) {
  const generatedUrlRef = useRef<string | null>(null);
  const completionRecordedRef = useRef(false);
  const [audioSource, setAudioSource] = useState<string | null>(capability.audioUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(Boolean(capability.audioUrl));
  const [completed, setCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(capability.transcriptVisibility !== "hidden");

  useEffect(() => () => {
    if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
  }, []);

  async function generateModelAudio() {
    if (audioSource || loading) return;
    setLoading(true);
    setError(null);
    try {
      const context = currentLessonContext({ courseId, lessonId });
      const blob = await requestModelAudio({ ...context, activityId: capability.id });
      const objectUrl = URL.createObjectURL(blob);
      if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
      generatedUrlRef.current = objectUrl;
      setAudioSource(objectUrl);
      setGenerated(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Model audio could not be generated.");
    } finally {
      setLoading(false);
    }
  }

  async function completeListening() {
    if (completionRecordedRef.current) return;
    completionRecordedRef.current = true;
    setError(null);
    try {
      const context = currentLessonContext({ courseId, lessonId });
      await recordListeningCompletion({ ...context, activityId: capability.id });
      setCompleted(true);
    } catch (completionError) {
      completionRecordedRef.current = false;
      setError(completionError instanceof Error ? completionError.message : "Listening completion could not be saved.");
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
            🎧 Listen &amp; Notice Chunks
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-950">{capability.title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          CEFR A1 Audio Model
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{capability.instructions}</p>

      {audioSource ? (
        <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-sm font-bold text-sky-950">
              {generated ? "Model audio is ready. Listen through the full sample:" : "Approved lesson audio:"}
            </p>
            {completed ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                ✓ Listening Logged
              </span>
            ) : (
              <span className="text-xs font-medium text-sky-700">Listen completely to save</span>
            )}
          </div>
          <audio
            className="w-full"
            controls
            autoPlay
            preload="metadata"
            src={audioSource}
            onEnded={() => void completeListening()}
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void generateModelAudio()}
          disabled={loading}
          className="mt-5 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50 transition flex items-center gap-2"
        >
          <span>▶</span>
          <span>{loading ? "Generating Model Audio…" : "Generate & Play Model Audio"}</span>
        </button>
      )}

      {error ? (
        <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-900" role="alert">
          <p className="font-semibold">Listening evidence could not be recorded.</p>
          <p className="mt-1">{error}</p>
          <button
            type="button"
            className="mt-3 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-900 shadow-sm"
            onClick={() => (audioSource ? void completeListening() : void generateModelAudio())}
          >
            {audioSource ? "Retry Recording Listening Completion" : "Retry Generating Audio"}
          </button>
        </div>
      ) : null}

      {/* Transcript Collapsible */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => setShowTranscript((current) => !current)}
          className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1"
        >
          <span>{showTranscript ? "Hide Transcript" : "Show Audio Script (Optional)"}</span>
        </button>
        {showTranscript ? (
          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-4 animate-in fade-in duration-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Audio Script:</p>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">{capability.modelText}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function RecordedSpeakingActivity({
  courseId,
  lessonId,
  capability,
}: CapabilityContext & { capability: RecordedSpeakingCapability }) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modelAudioUrlRef = useRef<string | null>(null);
  const previewAudioUrlRef = useRef<string | null>(null);

  const [recording, setRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [status, setStatus] = useState<"idle" | "ready" | "uploading" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [modelAudioSource, setModelAudioSource] = useState<string | null>(null);
  const [modelAudioLoading, setModelAudioLoading] = useState(false);
  const [modelAudioError, setModelAudioError] = useState<string | null>(null);

  useEffect(() => () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (modelAudioUrlRef.current) URL.revokeObjectURL(modelAudioUrlRef.current);
    if (previewAudioUrlRef.current) URL.revokeObjectURL(previewAudioUrlRef.current);
  }, []);

  async function loadSpeakingModelAudio() {
    if (!capability.targetText || modelAudioSource || modelAudioLoading) return;
    setModelAudioLoading(true);
    setModelAudioError(null);
    try {
      const blob = await requestModelAudio({ courseId, lessonId, activityId: capability.id });
      const objectUrl = URL.createObjectURL(blob);
      if (modelAudioUrlRef.current) URL.revokeObjectURL(modelAudioUrlRef.current);
      modelAudioUrlRef.current = objectUrl;
      setModelAudioSource(objectUrl);
    } catch (caught) {
      setModelAudioError(caught instanceof Error ? caught.message : "Pronunciation model audio is unavailable.");
    } finally {
      setModelAudioLoading(false);
    }
  }

  async function startRecording() {
    if (recording) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("error");
      setMessage("Audio recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      setAudioBlob(null);
      setPreviewUrl(null);
      setDurationMs(0);
      setElapsedSeconds(0);
      setMessage(null);
      setStatus("idle");

      timerIntervalRef.current = setInterval(() => {
        if (startedAtRef.current) {
          setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }
      }, 500);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        const elapsed = Math.max(0, Date.now() - (startedAtRef.current ?? Date.now()));
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const objUrl = URL.createObjectURL(blob);
        if (previewAudioUrlRef.current) URL.revokeObjectURL(previewAudioUrlRef.current);
        previewAudioUrlRef.current = objUrl;

        setAudioBlob(blob);
        setPreviewUrl(objUrl);
        setDurationMs(elapsed);
        setStatus("ready");
        setRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
      };
      recorder.start();
      setRecording(true);
    } catch (recordError) {
      setStatus("error");
      setMessage(recordError instanceof Error ? recordError.message : "Microphone access was not granted.");
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }

  async function saveRecording() {
    if (!audioBlob || status === "uploading") return;
    const seconds = Math.round(durationMs / 1_000);
    if (seconds < capability.minimumSeconds || seconds > capability.maximumSeconds) {
      setStatus("error");
      setMessage(`Record between ${capability.minimumSeconds}s and ${capability.maximumSeconds}s before saving.`);
      return;
    }
    setStatus("uploading");
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("audio", new File([audioBlob], `${capability.id}.webm`, { type: audioBlob.type || "audio/webm" }));
      formData.append("courseId", courseId);
      formData.append("lessonId", lessonId);
      formData.append("activityId", capability.id);
      formData.append("durationMs", String(durationMs));
      const response = await authenticatedFetch("/api/learning/spoken-evidence", { method: "POST", body: formData });
      const result = (await response.json()) as SpokenEvidenceRecord & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to save spoken evidence.");
      setStatus("saved");
      setMessage(
        capability.evidencePurpose === "performance"
          ? "Recording successfully preserved as authentic spoken evidence!"
          : "Recording saved as rehearsal evidence."
      );
    } catch (saveError) {
      setStatus("error");
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save spoken evidence.");
    }
  }

  const seconds = Math.round(durationMs / 1_000);
  const meetsDuration = seconds >= capability.minimumSeconds && seconds <= capability.maximumSeconds;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          🗣️ Speak &amp; Record Spoken Evidence
        </span>
        <span className="text-xs font-medium text-slate-500">
          Min {capability.minimumSeconds}s · Max {capability.maximumSeconds}s
        </span>
      </div>

      <h2 className="mt-3 text-xl font-bold text-slate-950">{capability.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{capability.instructions}</p>

      {/* Spoken Target Card */}
      <div className="mt-4 rounded-2xl bg-amber-50/70 border border-amber-100 p-4 text-sm text-slate-800">
        <p className="font-bold text-amber-950">{capability.prompt}</p>
        {capability.targetText ? (
          <p className="mt-2 text-xs font-medium text-amber-800">Model Pattern: “{capability.targetText}”</p>
        ) : null}
      </div>

      {/* Hear Model Pronunciation */}
      {capability.targetText ? (
        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-800">Target Pronunciation Model</p>
              <p className="mt-1 text-xs text-slate-600">
                Hear the model chunk once, then record. Focus on rhythm and intelligibility, not accent erasure.
              </p>
            </div>
            {!modelAudioSource ? (
              <button
                type="button"
                disabled={modelAudioLoading}
                onClick={() => void loadSpeakingModelAudio()}
                className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50 transition"
              >
                {modelAudioLoading ? "Generating…" : "Hear Model"}
              </button>
            ) : null}
          </div>
          {modelAudioSource ? (
            <audio className="mt-3 w-full" controls autoPlay preload="metadata" src={modelAudioSource}>
              Your browser does not support audio playback.
            </audio>
          ) : null}
          {modelAudioError ? (
            <div className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-800">
              <p>{modelAudioError}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Recording Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!recording ? (
          <button
            type="button"
            onClick={() => void startRecording()}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition flex items-center gap-2"
          >
            <span className="h-3 w-3 rounded-full bg-rose-400 animate-pulse" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-rose-500 transition flex items-center gap-2"
          >
            <span className="h-3 w-3 rounded-sm bg-white" />
            <span>Stop Recording ({elapsedSeconds}s)</span>
          </button>
        )}

        {previewUrl ? (
          <button
            type="button"
            disabled={!meetsDuration || status === "uploading" || status === "saved"}
            onClick={() => void saveRecording()}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {status === "uploading" ? "Saving Evidence…" : status === "saved" ? "Saved ✓" : "Save Spoken Evidence"}
          </button>
        ) : null}
      </div>

      {/* Recorded Audio Preview Player */}
      {previewUrl ? (
        <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Your Recorded Attempt ({seconds}s):
          </p>
          <audio className="w-full" controls src={previewUrl}>
            Your browser does not support audio playback.
          </audio>
        </div>
      ) : null}

      {audioBlob && !meetsDuration ? (
        <p className="mt-2 text-xs font-semibold text-amber-700">
          ⚠️ Please record at least {capability.minimumSeconds} seconds before saving.
        </p>
      ) : null}

      {message ? (
        <div
          className={`mt-4 rounded-2xl p-4 text-sm ${
            status === "error" ? "bg-rose-50 text-rose-800 border border-rose-200" : "bg-emerald-50 text-emerald-900 border border-emerald-200"
          }`}
          role={status === "error" ? "alert" : "status"}
        >
          <p className="font-semibold">{status === "error" ? "Recording issue" : "✓ Great job"}</p>
          <p className="mt-1">{message}</p>
        </div>
      ) : null}
    </section>
  );
}

export function AIRoleplayActivity({
  courseId,
  lessonId,
  capability,
}: CapabilityContext & { capability: AIRoleplayCapability }) {
  const openingTurn: LearnTutorTurn = {
    sender: "tutor",
    text: capability.scenario.openingLine,
    timestamp: "scenario-opening",
  };
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<LearnTutorTurn[]>([openingTurn]);
  const [learnerMessage, setLearnerMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [provider, setProvider] = useState<LearnTutorTurnResult["provider"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  async function sendTurn(customMessage?: string) {
    const message = (customMessage ?? learnerMessage).trim();
    if (!message || sending) return;
    setSending(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/learning/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          activityId: capability.id,
          ...(sessionId ? { sessionId } : {}),
          learnerMessage: message,
        }),
      });
      const result = (await response.json()) as LearnTutorTurnResult & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to continue the roleplay.");
      setSessionId(result.sessionId);
      setTranscript([openingTurn, ...result.transcript]);
      setProvider(result.provider);
      setLearnerMessage("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to continue the roleplay.");
    } finally {
      setSending(false);
    }
  }

  const learnerTurns = transcript.filter((turn) => turn.sender === "learner").length;
  const reachedMinimum = learnerTurns >= capability.scenario.minimumTurns;

  const quickScaffoldingChips = [
    "Hi! Nice to meet you.",
    "Could you repeat that, please?",
    "I'm from the Dominican Republic.",
    "I'm a student.",
  ];

  return (
    <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-teal-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-300 ring-1 ring-teal-400/30">
            💬 AI Interactive Conversation
          </span>
          <h2 className="mt-3 text-xl font-bold">{capability.title}</h2>
        </div>
        {provider ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              provider === "gemini" ? "bg-teal-400/20 text-teal-200" : "bg-amber-400/20 text-amber-200"
            }`}
          >
            {provider === "gemini" ? "Lurexa Mind AI" : "Practice Mode"}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">{capability.instructions}</p>

      {/* Scenario Context Card */}
      <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-slate-300 flex flex-wrap gap-4">
        <span>
          <strong className="text-teal-300">Partner Role:</strong> {capability.scenario.role}
        </span>
        <span>
          <strong className="text-teal-300">Your Goal:</strong> {capability.scenario.learnerGoal}
        </span>
      </div>

      {/* Chat Transcript Window */}
      <div ref={scrollRef} className="mt-5 max-h-96 space-y-3 overflow-y-auto rounded-2xl bg-black/40 border border-white/10 p-4">
        {transcript.map((turn, index) => (
          <div
            key={`${turn.timestamp}-${index}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              turn.sender === "learner"
                ? "ml-auto bg-indigo-600 text-white font-medium"
                : "bg-white/10 text-slate-100 ring-1 ring-white/10"
            }`}
          >
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-1">
              {turn.sender === "learner" ? "You" : capability.scenario.role}
            </p>
            <p>{turn.text}</p>
          </div>
        ))}
        {sending ? (
          <div className="bg-white/10 text-slate-300 rounded-2xl px-4 py-3 max-w-[50%] text-xs italic animate-pulse">
            Partner is typing…
          </div>
        ) : null}
      </div>

      {/* Quick Scaffolding Helper Chips */}
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Useful A1 Phrases:</p>
        <div className="flex flex-wrap gap-2">
          {quickScaffoldingChips.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => void sendTurn(phrase)}
              disabled={sending}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/15 transition disabled:opacity-40"
            >
              + {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="mt-4 flex gap-2">
        <input
          value={learnerMessage}
          onChange={(event) => setLearnerMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void sendTurn();
          }}
          placeholder="Type your response in English…"
          className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
        />
        <button
          type="button"
          disabled={!learnerMessage.trim() || sending || learnerTurns >= capability.scenario.maximumTurns}
          onClick={() => void sendTurn()}
          className="rounded-2xl bg-teal-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm hover:bg-teal-300 disabled:opacity-40 transition"
        >
          {sending ? "…" : "Send"}
        </button>
      </div>

      {/* Turn Progress & Guidance */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>
          Turns: <strong>{learnerTurns}</strong> / {capability.scenario.maximumTurns}
        </span>
        <span>
          {reachedMinimum
            ? "✓ Minimum required turns completed; feel free to continue practicing!"
            : `Complete at least ${capability.scenario.minimumTurns} turns to fulfill required evidence.`}
        </span>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 p-4 text-sm text-rose-200" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}

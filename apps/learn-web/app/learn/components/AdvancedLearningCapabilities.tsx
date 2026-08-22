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
    const payload = await response.json() as { error?: string };
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
    const payload = await response.json() as { error?: string };
    throw new Error(payload.error ?? "Listening completion could not be saved.");
  }
}

export function ModelListeningActivity({ courseId, lessonId, capability }: OptionalCapabilityContext & { capability: ModelListeningCapability }) {
  const generatedUrlRef = useRef<string | null>(null);
  const completionRecordedRef = useRef(false);
  const [audioSource, setAudioSource] = useState<string | null>(capability.audioUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(Boolean(capability.audioUrl));
  const [completed, setCompleted] = useState(false);

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
          <p className="text-xs font-bold tracking-[0.14em] text-sky-700">LISTEN &amp; NOTICE</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">{capability.title}</h2>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">Text-to-speech model</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{capability.instructions}</p>
      {audioSource ? (
        <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <p className="mb-3 text-sm font-semibold text-sky-950">{generated ? "Model audio is ready. Listen through the full sample before continuing." : "Approved lesson audio is ready."}</p>
          <audio className="w-full" controls autoPlay preload="metadata" src={audioSource} onEnded={() => void completeListening()}>
            Your browser does not support audio playback.
          </audio>
          {completed ? <p className="mt-3 text-xs font-semibold text-emerald-700">Listening completed ✓</p> : null}
        </div>
      ) : (
        <button type="button" onClick={() => void generateModelAudio()} disabled={loading} className="mt-5 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-50">
          {loading ? "Generating model audio…" : "Generate & play model audio"}
        </button>
      )}
      {error ? <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-900" role="alert"><p className="font-semibold">Listening evidence is not ready.</p><p className="mt-1">{error}</p><p className="mt-2 text-xs">The lesson cannot treat this required listening capability as complete until playback finishes and the completion record is saved.</p></div> : null}
{capability.transcriptVisibility !== "hidden" ? (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What you will hear</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{capability.modelText}</p>
        </div>
      ) : (
        <p className="mt-5 text-xs leading-5 text-slate-500">The script is hidden for this listening check. Use the audio first, then complete the comprehension activity.</p>
      )}
    </section>
  );
}

export function RecordedSpeakingActivity({ courseId, lessonId, capability }: CapabilityContext & { capability: RecordedSpeakingCapability }) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const modelAudioUrlRef = useRef<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [status, setStatus] = useState<"idle" | "ready" | "uploading" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [modelAudioSource, setModelAudioSource] = useState<string | null>(null);
  const [modelAudioLoading, setModelAudioLoading] = useState(false);
  const [modelAudioError, setModelAudioError] = useState<string | null>(null);

  useEffect(() => () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (modelAudioUrlRef.current) URL.revokeObjectURL(modelAudioUrlRef.current);
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
      setDurationMs(0);
      setMessage(null);
      setStatus("idle");
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const elapsed = Math.max(0, Date.now() - (startedAtRef.current ?? Date.now()));
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
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
      setMessage(recordError instanceof Error ? recordError.message : "Microphone access was not available.");
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
      setMessage(`Record between ${capability.minimumSeconds} and ${capability.maximumSeconds} seconds before saving.`);
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
      const result = await response.json() as SpokenEvidenceRecord & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to save spoken evidence.");
      setStatus("saved");
      setMessage(capability.evidencePurpose === "performance"
        ? "Recording saved as performance evidence. It has not been scored for pronunciation yet."
        : "Recording saved as rehearsal evidence. Rehearsal is not mastery.");
    } catch (saveError) {
      setStatus("error");
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save spoken evidence.");
    }
  }

  const seconds = Math.round(durationMs / 1_000);
  const meetsDuration = seconds >= capability.minimumSeconds && seconds <= capability.maximumSeconds;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
      <p className="text-xs font-bold tracking-[0.14em] text-amber-700">SPEAK &amp; RECORD</p>
      <h2 className="mt-2 text-xl font-bold text-slate-950">{capability.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{capability.instructions}</p>
      <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-slate-800">
        <p className="font-semibold">{capability.prompt}</p>
        {capability.targetText ? <p className="mt-2 text-xs text-slate-600">Model: {capability.targetText}</p> : null}
      </div>
      {capability.targetText ? (
        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-sky-700">Pronunciation model</p>
              <p className="mt-1 text-sm text-slate-700">Hear the trusted target once, then record your own version. The goal is intelligibility and natural rhythm, not accent imitation.</p>
            </div>
            {!modelAudioSource ? (
              <button type="button" disabled={modelAudioLoading} onClick={() => void loadSpeakingModelAudio()} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-50">
                {modelAudioLoading ? "Generating…" : "Hear model pronunciation"}
              </button>
            ) : null}
          </div>
          {modelAudioSource ? <audio className="mt-4 w-full" controls autoPlay preload="metadata" src={modelAudioSource}>Your browser does not support audio playback.</audio> : null}
          {modelAudioError ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">{modelAudioError}</p> : null}
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        {!recording
          ? <button type="button" onClick={() => void startRecording()} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500">Start recording</button>
          : <button type="button" onClick={stopRecording} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-500">Stop recording</button>}
        {audioBlob ? <button type="button" disabled={!meetsDuration || status === "uploading" || status === "saved"} onClick={() => void saveRecording()} className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{status === "uploading" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save spoken evidence"}</button> : null}
      </div>
      {audioBlob ? <p className="mt-3 text-xs text-slate-500">Recorded: {seconds}s · minimum {capability.minimumSeconds}s · maximum {capability.maximumSeconds}s.</p> : null}
      {audioBlob && !meetsMinimum ? <p className="mt-2 text-xs font-semibold text-amber-700">Record a little longer before saving this attempt.</p> : null}
      {message ? <p className={`mt-4 rounded-2xl p-4 text-sm ${status === "error" ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-900"}`} role="status">{message}</p> : null}
    </section>
  );
}

export function AIRoleplayActivity({ courseId, lessonId, capability }: CapabilityContext & { capability: AIRoleplayCapability }) {
  const openingTurn: LearnTutorTurn = { sender: "tutor", text: capability.scenario.openingLine, timestamp: "scenario-opening" };
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<LearnTutorTurn[]>([openingTurn]);
  const [learnerMessage, setLearnerMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [provider, setProvider] = useState<LearnTutorTurnResult["provider"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sendTurn() {
    const message = learnerMessage.trim();
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
      const result = await response.json() as LearnTutorTurnResult & { error?: string };
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

  return (
    <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-bold tracking-[0.14em] text-teal-300">AI ROLEPLAY</p><h2 className="mt-2 text-xl font-bold">{capability.title}</h2></div>
        {provider ? <span className={`rounded-full px-3 py-1 text-xs font-semibold ${provider === "openai" ? "bg-teal-400/20 text-teal-200" : "bg-amber-400/20 text-amber-200"}`}>{provider === "openai" ? "Lurexa Mind AI" : "Fallback practice mode"}</span> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{capability.instructions}</p>
      <div className="mt-5 max-h-96 space-y-3 overflow-y-auto rounded-2xl bg-white/5 p-4">
        {transcript.map((turn, index) => <div key={`${turn.timestamp}-${index}`} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${turn.sender === "learner" ? "ml-auto bg-indigo-500 text-white" : "bg-white/10 text-slate-100"}`}>{turn.text}</div>)}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={learnerMessage} onChange={(event) => setLearnerMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void sendTurn(); }} placeholder="Type your next turn…" className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400" />
        <button type="button" disabled={!learnerMessage.trim() || sending || learnerTurns >= capability.scenario.maximumTurns} onClick={() => void sendTurn()} className="rounded-2xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50">{sending ? "…" : "Send"}</button>
      </div>
      <p className="mt-3 text-xs text-slate-400">Turns: {learnerTurns}/{capability.scenario.maximumTurns}. {reachedMinimum ? "Minimum required interaction reached; continue if useful." : `Complete at least ${capability.scenario.minimumTurns} learner turns.`}</p>
      {provider === "deterministic_fallback" ? <p className="mt-3 rounded-2xl bg-amber-400/10 p-3 text-xs text-amber-100">The model provider is not currently available. This controlled fallback keeps the scenario testable but is not production AI.</p> : null}
      {error ? <p className="mt-4 rounded-2xl bg-rose-500/15 p-4 text-sm text-rose-100" role="alert">{error}</p> : null}
    </section>
  );
}

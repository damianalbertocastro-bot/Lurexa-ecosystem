"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LearnTutorTurn } from "@lurexa/types";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { authenticatedFetch } from "../../../../lib/authenticated-fetch";

type Judgment = "meets" | "not_yet" | "inconclusive";

type Candidate = {
  evidenceId: string;
  lessonId: string | null;
  activityId: string | null;
  observedAt: string;
  evidenceType: string;
  event: string | null;
  competencyIds: string[];
  requirementIds: string[];
  textPreview: string | null;
  recordingId: string | null;
  sessionId: string | null;
  validatedRequirementIds: string[];
};

type TranscriptPayload = {
  transcript: LearnTutorTurn[];
  sessionId: string;
};

function readError(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

function evidenceLabel(candidate: Candidate): string {
  if (candidate.event === "spoken_evidence.recorded") return "Recorded speaking";
  if (candidate.event === "ai_roleplay.turn") return "AI roleplay conversation";
  if (candidate.textPreview) return "Written / Create & Apply response";
  return candidate.evidenceType;
}

export function A1CapstoneReviewPanel({ studentId }: { studentId: string }) {
  const audioUrlRef = useRef<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState("");
  const [selectedRequirementId, setSelectedRequirementId] = useState("");
  const [judgment, setJudgment] = useState<Judgment>("inconclusive");
  const [rationale, setRationale] = useState("");
  const [confidence, setConfidence] = useState(0.75);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<LearnTutorTurn[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [artifactLoading, setArtifactLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCandidate = useMemo(
    () => candidates.find((item) => item.evidenceId === selectedEvidenceId) ?? null,
    [candidates, selectedEvidenceId],
  );
  const requirementAlreadyValidated = Boolean(
    selectedCandidate && selectedRequirementId && selectedCandidate.validatedRequirementIds.includes(selectedRequirementId),
  );

  useEffect(() => () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  async function loadCandidates() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await authenticatedFetch(`/api/learning/capstone-validation?learnerId=${encodeURIComponent(studentId)}`);
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to load A1 capstone evidence."));
      const items = body as Candidate[];
      setCandidates(items);
      const first = items.find((item) => item.requirementIds.some((requirementId) => !item.validatedRequirementIds.includes(requirementId))) ?? items[0];
      if (first) {
        setSelectedEvidenceId(first.evidenceId);
        setSelectedRequirementId(first.requirementIds.find((requirementId) => !first.validatedRequirementIds.includes(requirementId)) ?? first.requirementIds[0] ?? "");
      }
      setMessage(items.length ? "A1 capstone evidence loaded. Review the artifact before recording a judgment." : "No reviewable A1 capstone evidence has been produced yet.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load A1 capstone evidence.");
    } finally {
      setLoading(false);
    }
  }

  function selectCandidate(evidenceId: string) {
    const candidate = candidates.find((item) => item.evidenceId === evidenceId) ?? null;
    setSelectedEvidenceId(evidenceId);
    setSelectedRequirementId(candidate?.requirementIds.find((requirementId) => !candidate.validatedRequirementIds.includes(requirementId)) ?? candidate?.requirementIds[0] ?? "");
    setTranscript(null);
    setRationale("");
    setJudgment("inconclusive");
    setMessage(null);
    setError(null);
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
  }

  async function loadArtifact() {
    if (!selectedCandidate || artifactLoading) return;
    setArtifactLoading(true);
    setError(null);
    try {
      if (selectedCandidate.recordingId) {
        const response = await authenticatedFetch(`/api/learning/capstone-artifact?learnerId=${encodeURIComponent(studentId)}&evidenceId=${encodeURIComponent(selectedCandidate.evidenceId)}&kind=recording`);
        if (!response.ok) {
          const body: unknown = await response.json();
          throw new Error(readError(body, "Unable to load the spoken recording."));
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = url;
        setAudioUrl(url);
      } else if (selectedCandidate.sessionId) {
        const response = await authenticatedFetch(`/api/learning/capstone-artifact?learnerId=${encodeURIComponent(studentId)}&evidenceId=${encodeURIComponent(selectedCandidate.evidenceId)}&kind=transcript`);
        const body: unknown = await response.json();
        if (!response.ok) throw new Error(readError(body, "Unable to load the roleplay transcript."));
        setTranscript((body as TranscriptPayload).transcript);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load the capstone artifact.");
    } finally {
      setArtifactLoading(false);
    }
  }

  async function saveJudgment(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedCandidate || !selectedRequirementId || saving || requirementAlreadyValidated) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await authenticatedFetch("/api/learning/capstone-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId: studentId,
          requirementId: selectedRequirementId,
          sourceEvidenceId: selectedCandidate.evidenceId,
          judgment,
          rationale,
          confidence,
        }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body, "Unable to save the capstone judgment."));
      setCandidates((current) => current.map((item) => item.evidenceId === selectedCandidate.evidenceId
        ? { ...item, validatedRequirementIds: [...new Set([...item.validatedRequirementIds, selectedRequirementId])] }
        : item));
      setMessage(`Judgment saved: ${judgment.replace("_", " ")}. The raw learner artifact was preserved unchanged.`);
      setRationale("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the capstone judgment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="A1 capstone review" subtitle="Validate My Life, My English evidence without changing the learner's raw artifact">
      <div className="space-y-5 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" isLoading={loading} onClick={() => void loadCandidates()}>Load A1 capstone evidence</Button>
          <span className="text-xs text-slate-500">Only teacher-authorized A1 evidence is returned.</span>
        </div>

        {candidates.length ? (
          <>
            <label className="block text-sm font-semibold text-slate-800">Evidence artifact
              <select value={selectedEvidenceId} onChange={(event) => selectCandidate(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm">
                {candidates.map((candidate) => (
                  <option key={candidate.evidenceId} value={candidate.evidenceId}>
                    {evidenceLabel(candidate)} · {candidate.lessonId ?? "A1"} · {new Date(candidate.observedAt).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>

            {selectedCandidate ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">Artifact context</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{evidenceLabel(selectedCandidate)}</p>
                <p className="mt-1 text-xs text-slate-600">Competencies: {selectedCandidate.competencyIds.join(", ")}</p>
                {selectedCandidate.textPreview ? <div className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-slate-800 ring-1 ring-slate-200">{selectedCandidate.textPreview}</div> : null}
                {selectedCandidate.recordingId || selectedCandidate.sessionId ? (
                  <Button variant="ghost" size="sm" isLoading={artifactLoading} onClick={() => void loadArtifact()}>
                    {selectedCandidate.recordingId ? "Load private recording" : "Load private roleplay transcript"}
                  </Button>
                ) : null}
                {audioUrl ? <audio className="mt-3 w-full" controls preload="metadata" src={audioUrl}>Your browser does not support audio playback.</audio> : null}
                {transcript ? (
                  <div className="mt-3 max-h-80 space-y-2 overflow-y-auto rounded-xl bg-white p-3 ring-1 ring-slate-200">
                    {transcript.map((turn, index) => (
                      <p key={`${turn.timestamp}-${index}`} className={`rounded-xl px-3 py-2 text-sm ${turn.sender === "learner" ? "ml-8 bg-indigo-50 text-indigo-950" : "mr-8 bg-slate-100 text-slate-800"}`}>
                        <strong>{turn.sender === "learner" ? "Learner" : "Tutor"}:</strong> {turn.text}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <form onSubmit={saveJudgment} className="space-y-4">
              <label className="block text-sm font-semibold text-slate-800">Capstone requirement
                <select value={selectedRequirementId} onChange={(event) => setSelectedRequirementId(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm">
                  {selectedCandidate?.requirementIds.map((requirementId) => (
                    <option key={requirementId} value={requirementId}>
                      {requirementId}{selectedCandidate.validatedRequirementIds.includes(requirementId) ? " · already reviewed" : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-800">Performance judgment
                <select value={judgment} onChange={(event) => setJudgment(event.target.value as Judgment)} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm">
                  <option value="meets">Meets the A1 requirement</option>
                  <option value="not_yet">Not yet</option>
                  <option value="inconclusive">Inconclusive / more evidence needed</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-800">Confidence: {Math.round(confidence * 100)}%
                <input type="range" min="0.5" max="1" step="0.05" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} className="mt-2 w-full" />
              </label>

              <label className="block text-sm font-semibold text-slate-800">Rationale
                <textarea value={rationale} onChange={(event) => setRationale(event.target.value)} required rows={4} placeholder="Describe what the learner demonstrated, what was still supported, and why this judgment is defensible." className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm" />
              </label>

              {requirementAlreadyValidated ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">This artifact has already been reviewed for the selected requirement. Choose another requirement or artifact.</p> : null}
              <Button type="submit" variant="primary" isLoading={saving} disabled={!rationale.trim() || !selectedRequirementId || requirementAlreadyValidated}>Save capstone judgment</Button>
            </form>
          </>
        ) : null}

        {message ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900" role="status">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-800" role="alert">{error}</p> : null}
      </div>
    </Card>
  );
}

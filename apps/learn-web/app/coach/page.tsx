"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import type { CoachSession, CoachSessionStartResult, LearnerContext } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

export default function LurexaCoachPage() {
  const [session, setSession] = useState<CoachSession | null>(null);
  const [learnerContext, setLearnerContext] = useState<LearnerContext | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartCoaching = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch("/api/coach", { method: "POST" });
      const payload = await response.json() as CoachSessionStartResult & { error?: string };
      if (!response.ok || !payload.session) {
        throw new Error(payload.error ?? "Unable to start Coach session.");
      }
      setSession(payload.session);
      setLearnerContext(payload.learnerContext);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start Coach session.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecordingPrototype = () => {
    if (!session) return;
    setIsRecording((current) => !current);

    if (!isRecording) {
      setTimeout(() => {
        const now = new Date().toISOString();
        setSession((current) => current ? {
          ...current,
          transcript: [
            ...current.transcript,
            {
              sender: "learner",
              text: "I have been practicing my English pronunciation today.",
              timestamp: now,
            },
            {
              sender: "coach",
              text: "Your message was clear. Production speech analysis is not enabled in this prototype yet, so I will not invent a pronunciation score. Future feedback will use evidence-backed pronunciation observations and your existing learner context.",
              timestamp: now,
            },
          ],
          updatedAt: now,
        } : null);
        setIsRecording(false);
      }, 1200);
    }
  };

  const contextItems = learnerContext ? [
    learnerContext.proficiency?.cefr ? `CEFR ${learnerContext.proficiency.cefr}` : null,
    learnerContext.curriculum?.lessonId ? "Recent Learn context" : null,
    learnerContext.activeTargets?.pronunciation?.length
      ? `Pronunciation: ${learnerContext.activeTargets.pronunciation.slice(0, 2).join(", ")}`
      : null,
    learnerContext.activeTargets?.fluency?.length
      ? `Fluency: ${learnerContext.activeTargets.fluency.slice(0, 2).join(", ")}`
      : null,
  ].filter((item): item is string => Boolean(item)) : [];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">🎙️ Lurexa Coach</h1>
            <p className="text-slate-500">Context-aware English speaking and pronunciation practice</p>
          </div>
          <Badge variant={session ? "success" : "info"}>{session ? "Learner context connected" : "Speaking prototype"}</Badge>
        </div>

        {!session ? (
          <Card title="Continue your speaking practice" subtitle="Coach uses authorized learning context from across Lurexa instead of asking you to start over.">
            <div className="space-y-4 pt-2">
              <p className="text-sm text-slate-600">
                Practice focuses on intelligibility, naturalness, fluency, and useful pronunciation refinement—not accent erasure.
              </p>
              {error && <p className="text-sm font-medium text-red-700">{error}</p>}
              <Button variant="primary" onClick={handleStartCoaching} isLoading={loading}>
                Start Coach session
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card title="Session context" subtitle="Authorized context Coach is using for this session">
              <div className="flex flex-wrap gap-2 pt-2">
                {contextItems.length > 0
                  ? contextItems.map((item) => <Badge key={item} variant="info">{item}</Badge>)
                  : <p className="text-sm text-slate-600">Coach is starting with limited context and will adapt as reliable learning evidence develops.</p>}
              </div>
            </Card>

            <Card title="Speaking session active" action={<Badge variant="success">Session active</Badge>}>
              <div className="space-y-4 pt-2">
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100 p-8 text-center">
                  <Button
                    variant={isRecording ? "destructive" : "primary"}
                    size="lg"
                    onClick={toggleRecordingPrototype}
                  >
                    {isRecording ? "🔴 Finish prototype sample" : "🎙️ Try speaking prototype"}
                  </Button>
                  <p className="mt-3 text-xs text-slate-500">Production speech recognition and pronunciation analysis are not enabled on this screen yet.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Session transcript</h4>
                  {session.transcript.map((message, index) => (
                    <div
                      key={`${message.timestamp}-${index}`}
                      className={`rounded-lg p-3 text-xs ${
                        message.sender === "coach"
                          ? "border border-indigo-100 bg-indigo-50 text-indigo-900"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <strong>{message.sender === "coach" ? "🤖 Coach" : "🗣️ You"}:</strong> {message.text}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

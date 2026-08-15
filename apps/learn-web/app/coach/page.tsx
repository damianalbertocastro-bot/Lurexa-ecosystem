"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { EcosystemService, VoiceCoachingSession } from "@lurexa/backend";

export default function LurexaCoachPage() {
  const [session, setSession] = useState<VoiceCoachingSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartCoaching = async () => {
    setLoading(true);
    try {
      const sess = await EcosystemService.createVoiceCoachingSession(
        "student_demo",
        "English B2",
        "Oral Fluency & Accent Reduction"
      );
      setSession(sess);
    } catch {
      alert("Failed to start AI Coach session.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording && session) {
      // Simulate live voice transcript append
      setTimeout(() => {
        setSession((prev) =>
          prev
            ? {
                ...prev,
                transcript: [
                  ...prev.transcript,
                  { sender: "student", text: "I have been practicing my English pronunciation today.", timestamp: new Date().toISOString() },
                  { sender: "coach", text: "Great pronunciation! Pitch and stress on 'practicing' were 94% accurate.", timestamp: new Date().toISOString() },
                ],
                aiPronunciationScore: 94,
              }
            : null
        );
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">🎙️ Lurexa Coach</h1>
            <p className="text-slate-500">Real-time 1:1 voice AI tutoring and accent scoring</p>
          </div>
          <Badge variant="info">Voice API Connected</Badge>
        </div>

        {!session ? (
          <Card title="Start Voice Coaching Session" subtitle="Practice oral fluency and pronunciation in real time">
            <Button variant="primary" onClick={handleStartCoaching} isLoading={loading}>
              Initialize AI Voice Coach
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card title="Oral Session Active" action={<Badge variant="success">Fluency Score: {session.aiPronunciationScore || "--"}%</Badge>}>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-center p-8 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                  <Button
                    variant={isRecording ? "destructive" : "primary"}
                    size="lg"
                    onClick={toggleRecording}
                  >
                    {isRecording ? "🔴 Stop Speaking & Evaluate" : "🎙️ Tap to Speak to AI Coach"}
                  </Button>
                </div>

                {/* Live Transcript */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Live Voice Transcript</h4>
                  {session.transcript.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-xs ${
                        msg.sender === "coach"
                          ? "bg-indigo-50 border border-indigo-100 text-indigo-900"
                          : "bg-white border border-slate-200 text-slate-800"
                      }`}
                    >
                      <strong>{msg.sender === "coach" ? "🤖 AI Coach" : "🗣️ You"}:</strong> {msg.text}
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

"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import { TypingIndicator } from "../../coach/TypingIndicator";
import { AIMessage } from "@lurexa/types";

export interface AITutorWidgetProps {
  lessonTitle: string;
  lessonContext: string;
}

export const AITutorWidget: React.FC<AITutorWidgetProps> = ({
  lessonTitle,
  lessonContext,
}) => {
  const { playClick, playSuccess } = useSoundEffects();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content: `Hi! I'm your AI tutor for **${lessonTitle}**. How can I help you understand this topic or practice pronunciation?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    playClick();

    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Mock AI response - in production calls backend server-side RAG endpoint
    setTimeout(() => {
      const assistantMsg: AIMessage = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: `Great question regarding **${lessonTitle}**! Based on the lesson context (${lessonContext.slice(0, 120)}), focus on communicative flow. Let me know if you want a targeted example!`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
      playSuccess();
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[600px] border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)]">
      <div className="border-b border-[var(--lx-border)] pb-3 mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[var(--lx-ink)]">🤖 AI Learning Companion</h3>
          <p className="text-xs text-[var(--lx-muted)]">Context: {lessonTitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`animate-fade-slide-up p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
              m.role === "user"
                ? "bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] text-white ml-auto shadow-md"
                : "bg-[var(--lx-canvas)] text-[var(--lx-ink)] border border-[var(--lx-border)] mr-auto"
            }`}
          >
            <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${m.role === "user" ? "text-cyan-100" : "text-[var(--lx-primary)]"}`}>
              {m.role === "user" ? "You" : "AI Tutor"}
            </p>
            {m.content}
          </div>
        ))}
        {loading && <TypingIndicator label="AI Tutor is thinking..." />}
      </div>

      {/* Chat Form */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-[var(--lx-border)] pt-3">
        <Input
          placeholder="Ask about this lesson..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" variant="primary" isLoading={loading}>
          Send
        </Button>
      </form>
    </Card>
  );
};

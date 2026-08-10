"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { AIMessage } from "@lurexa/types";

export interface AITutorWidgetProps {
  lessonTitle: string;
  lessonContext: string;
}

export const AITutorWidget: React.FC<AITutorWidgetProps> = ({
  lessonTitle,
  lessonContext,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content: `Hi! I'm your AI tutor for **${lessonTitle}**. How can I help you understand this topic?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
        content: `Great question regarding **${lessonTitle}**! Based on the lesson notes, remember to focus on the key principles. Let me know if you want a practical example!`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[600px] border-slate-200 shadow-sm">
      <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">🤖 AI Tutor</h3>
          <p className="text-xs text-slate-500">Context: {lessonTitle}</p>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-sm max-w-[85%] ${
              m.role === "user"
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-slate-100 text-slate-800 mr-auto"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400 italic">AI Tutor is thinking...</p>}
      </div>

      {/* Chat Form */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 pt-3">
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
}
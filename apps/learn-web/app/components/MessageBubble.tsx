// apps/learn-web/app/components/MessageBubble.tsx
import React from "react";

export interface MessageBubbleProps {
  sender: "coach" | "learner";
  text: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text }) => {
  const isCoach = sender === "coach";
  return (
    <div
      className={`rounded-lg p-3 text-sm ${isCoach ? "border border-indigo-100 bg-indigo-50 text-indigo-900" : "border border-slate-200 bg-white text-slate-800"}`}
    >
      <strong>{isCoach ? "🤖 Coach" : "🗣️ You"}:</strong> {text}
    </div>
  );
};

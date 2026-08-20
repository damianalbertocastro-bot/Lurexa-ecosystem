// apps/learn-web/app/chat/page.tsx
import React from "react";
import { ConversationWindow } from "../components/ConversationWindow";

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[var(--learn-canvas)] p-4">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Lurexa Coach Chat</h1>
      <ConversationWindow />
    </main>
  );
}

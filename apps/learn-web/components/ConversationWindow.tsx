// apps/learn-web/components/ConversationWindow.tsx
import React from "react";

export function ConversationWindow() {
  return (
    <div className="w-full rounded-2xl border border-dashed border-[var(--lx-border)] bg-[var(--lx-canvas)] p-6 text-center">
      <p className="text-sm font-extrabold text-[var(--color-brand-navy)]">Conversation is preparing.</p>
      <p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">Your guided speaking activity will appear here when it is ready.</p>
    </div>
  );
}

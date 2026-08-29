// apps/learn-web/components/ConversationWindow.tsx
import React from "react";

export function ConversationWindow() {
  return (
    <div className="w-full rounded-2xl border border-dashed border-[#cbd7f0] bg-[#f8faff] p-6 text-center">
      <p className="text-sm font-extrabold text-[#10245f]">Conversation is preparing.</p>
      <p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">Your guided speaking activity will appear here when it is ready.</p>
    </div>
  );
}

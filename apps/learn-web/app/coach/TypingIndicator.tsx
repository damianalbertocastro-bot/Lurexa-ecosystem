import React from "react";

export function TypingIndicator({ label = "Lurexa Coach is thinking..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-1 rounded-2xl border border-violet-100 bg-[var(--lx-surface)] px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--lx-primary)] [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--lx-secondary)] [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--lx-accent)]" />
      </div>
      <span className="text-xs font-semibold text-[var(--lx-muted)] animate-pulse">
        {label}
      </span>
    </div>
  );
}

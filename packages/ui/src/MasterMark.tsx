import type { HTMLAttributes } from "react";

export interface MasterMarkProps extends HTMLAttributes<HTMLSpanElement> {
  inverse?: boolean;
  compact?: boolean;
}

export function MasterMark({ inverse = false, compact = false, className = "", ...props }: MasterMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
      <span className="grid h-9 w-9 shrink-0 place-items-center">
        <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
          <path d="M39 38C26 38 13 31 10 15c-1-5 4-9 9-7 14 4 22 15 22 30Z" fill="#592bd6" opacity=".98" />
          <path d="M41 38c0-15 8-26 22-30 5-2 10 2 9 7-3 16-16 23-30 23Z" fill="#2160df" opacity=".88" />
          <path d="M39 42c-15 0-27 8-30 23-1 5 4 9 9 7 14-4 22-15 22-30Z" fill="#071d67" opacity=".94" />
          <path d="M41 42c0 15 8 26 22 30 5 2 10-2 9-7-3-15-15-23-30-23Z" fill="#12cdd4" />
          <circle cx="40" cy="40" r="5" fill="white" />
        </svg>
      </span>
      {!compact && <span className={`text-lg font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span>}
    </span>
  );
}

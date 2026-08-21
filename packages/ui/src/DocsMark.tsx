import type { HTMLAttributes } from "react";

export interface DocsMarkProps extends HTMLAttributes<HTMLSpanElement> {
  inverse?: boolean;
  compact?: boolean;
}

function DocsGlyph() {
  return <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
    <path d="M14 9h34l18 18v44H14V9Z" fill="#071d67" />
    <path d="M48 9v18h18" fill="#2160df" />
    <path d="M25 35h29M25 45h29M25 55h18" stroke="white" strokeWidth="5" strokeLinecap="round" />
    <circle cx="57" cy="59" r="10" fill="#12cdd4" />
    <path d="m64 66 8 8" stroke="#592bd6" strokeWidth="5" strokeLinecap="round" />
  </svg>;
}

export function DocsMark({ inverse = false, compact = false, className = "", ...props }: DocsMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";
  return <span className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
    <span className="grid h-9 w-9 shrink-0 place-items-center"><DocsGlyph /></span>
    {!compact && <span className="leading-none">
      <span className={`block text-lg font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span>
      <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-[.17em] text-[#0ba5a8]">Docs</span>
    </span>}
  </span>;
}

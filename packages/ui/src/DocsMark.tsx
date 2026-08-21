import type { HTMLAttributes } from "react";

export interface DocsMarkProps extends HTMLAttributes<HTMLSpanElement> {
  inverse?: boolean;
  compact?: boolean;
}

function DocsGlyph() {
  return <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
    <path d="M10 12h19c6 0 11 5 11 11v28H21c-6 0-11-5-11-11V12Z" fill="currentColor"/>
    <path d="M54 12H35c-6 0-11 5-11 11v28h19c6 0 11-5 11-11V12Z" fill="#315fd7" opacity=".92"/>
    <path d="M32 20v31" stroke="#12cdd4" strokeWidth="4" strokeLinecap="round"/>
    <path d="M17 24h9M17 31h9M38 24h9M38 31h9" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".9"/>
    <circle cx="46" cy="44" r="5" fill="#12cdd4"/>
    <path d="m49.5 47.5 5 5" stroke="#12cdd4" strokeWidth="3" strokeLinecap="round"/>
  </svg>;
}

export function DocsMark({ inverse = false, compact = false, className = "", ...props }: DocsMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";
  return <span className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
    <span className="grid h-9 w-9 shrink-0 place-items-center text-[#592bd6]"><DocsGlyph /></span>
    {!compact && <span className="leading-none"><span className={`block text-lg font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span><span className="mt-1 block text-[10px] font-extrabold uppercase tracking-[.17em] text-[#12aab0]">Docs</span></span>}
  </span>;
}

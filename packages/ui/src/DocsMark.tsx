import type { HTMLAttributes } from "react";
import { brandMarkSizeClasses, type BrandMarkSize } from "./brand-mark-size";

export interface DocsMarkProps extends HTMLAttributes<HTMLSpanElement> {
  inverse?: boolean;
  compact?: boolean;
  size?: BrandMarkSize;
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

export function DocsMark({ inverse = false, compact = false, size = "md", className = "", ...props }: DocsMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";
  const classes = brandMarkSizeClasses[size];
  return <span className={`inline-flex items-center ${classes.rootGap} ${className}`} {...props}>
    <span className={`grid shrink-0 place-items-center ${classes.glyph}`}><DocsGlyph /></span>
    {!compact && <span className="leading-none">
      <span className={`block ${classes.wordmark} font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span>
      <span className={`mt-1 block ${classes.label} font-extrabold uppercase tracking-[.17em] text-[#0ba5a8]`}>Docs</span>
    </span>}
  </span>;
}

import type { HTMLAttributes } from "react";
import { brandMarkGlyphDimensions, brandMarkSizeClasses, type BrandMarkSize } from "./brand-mark-size";

export interface MasterMarkProps extends HTMLAttributes<HTMLSpanElement> {
  inverse?: boolean;
  compact?: boolean;
  size?: BrandMarkSize;
}

export function MasterMark({ inverse = false, compact = false, size = "md", className = "", ...props }: MasterMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";
  const classes = brandMarkSizeClasses[size];
  const glyphDimension = brandMarkGlyphDimensions[size];

  return (
    <span className={`inline-flex items-center ${classes.rootGap} ${className}`} {...props}>
      <span
        className={`grid shrink-0 place-items-center ${classes.glyph}`}
        style={{ display: "grid", width: glyphDimension, height: glyphDimension, flexShrink: 0, placeItems: "center" }}
      >
        <svg viewBox="0 0 80 80" className="h-full w-full" style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true">
          <path d="M39 38C26 38 13 31 10 15c-1-5 4-9 9-7 14 4 22 15 22 30Z" fill="#592bd6" opacity=".98" />
          <path d="M41 38c0-15 8-26 22-30 5-2 10 2 9 7-3 16-16 23-30 23Z" fill="#2160df" opacity=".88" />
          <path d="M39 42c-15 0-27 8-30 23-1 5 4 9 9 7 14-4 22-15 22-30Z" fill="#071d67" opacity=".94" />
          <path d="M41 42c0 15 8 26 22 30 5 2 10-2 9-7-3-15-15-23-30-23Z" fill="#12cdd4" />
          <circle cx="40" cy="40" r="5" fill="white" />
        </svg>
      </span>
      {!compact && <span className={`${classes.wordmark} font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span>}
    </span>
  );
}

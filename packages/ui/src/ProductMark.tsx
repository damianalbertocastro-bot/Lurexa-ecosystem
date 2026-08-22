import type { HTMLAttributes } from "react";
import { brandMarkGlyphDimensions, brandMarkSizeClasses, type BrandMarkSize } from "./brand-mark-size";

export type LurexaProduct = "learn" | "coach" | "teach" | "admin" | "insight" | "studio";

export interface ProductMarkProps extends HTMLAttributes<HTMLSpanElement> {
  product?: LurexaProduct;
  inverse?: boolean;
  compact?: boolean;
  size?: BrandMarkSize;
}

const productLabel: Record<LurexaProduct, string> = {
  learn: "Learn",
  coach: "Coach",
  teach: "Teach",
  admin: "Admin",
  insight: "Insight",
  studio: "Studio",
};

const productLabelClass: Record<LurexaProduct, string> = {
  learn: "text-[#592bd6]",
  coach: "text-[#0ba5a8]",
  teach: "text-[#315fd7]",
  admin: "text-[#071d67]",
  insight: "text-[#2160df]",
  studio: "text-[#8b3bd9]",
};

function ProductGlyph({ product }: { product: LurexaProduct }) {
  if (product === "learn") {
    return <svg viewBox="0 0 64 64" className="h-full w-full" style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true">
      <path d="M7 33 31 9l11 11L29 33 43 47 32 58 7 33Z" fill="#592bd6" />
      <path d="m31 9 11-6v17L31 9Z" fill="#2160df" />
      <path d="M43 20 57 6v47H43V20Z" fill="#592bd6" />
    </svg>;
  }

  if (product === "coach") {
    return <svg viewBox="0 0 80 80" className="h-full w-full" style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true">
      <path d="M12 18h44c7 0 12 5 12 12v18c0 7-5 12-12 12H37L23 70V60H12C5 60 0 55 0 48V30c0-7 5-12 12-12Z" fill="#592bd6" />
      <path d="M17 40h7l4-10 6 20 6-17 5 12 4-5h11" fill="none" stroke="#12cdd4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="58" cy="20" r="10" fill="#071d67" />
      <rect x="55" y="14" width="6" height="9" rx="3" fill="white" />
      <path d="M53 22c0 5 10 5 10 0M58 27v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>;
  }

  if (product === "teach") {
    return <svg viewBox="0 0 64 64" className="h-full w-full" style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true">
      <path d="M7 23h50l-9-11H16L7 23Z" fill="#071d67" />
      <path d="M15 25h34v7H15z" fill="#071d67" />
      <path d="M30 32v15" stroke="#071d67" strokeWidth="4" />
      <circle cx="30" cy="51" r="3" fill="#12cdd4" />
    </svg>;
  }

  if (product === "admin") {
    return <svg viewBox="0 0 80 80" className="h-full w-full" style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true">
      <path d="M40 6 68 16v22c0 18-11 29-28 36C23 67 12 56 12 38V16L40 6Z" fill="#071d67" />
      <path d="M40 18 56 24v14c0 10-6 17-16 22-10-5-16-12-16-22V24l16-6Z" fill="#2160df" />
      <path d="M33 39h14M40 32v14" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <circle cx="59" cy="55" r="10" fill="#12cdd4" />
      <path d="m54 55 4 4 7-9" fill="none" stroke="#071d67" strokeWidth="3.5" strokeLinecap="round" />
    </svg>;
  }

  if (product === "insight") {
    return <svg viewBox="0 0 80 80" className="h-full w-full" style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true">
      <circle cx="34" cy="34" r="23" fill="#071d67" />
      <circle cx="34" cy="34" r="16" fill="white" />
      <path d="M18 41 27 33l7 5 12-14 5 4" fill="none" stroke="#592bd6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="24" r="4" fill="#12cdd4" />
      <path d="m51 51 18 18" stroke="#2160df" strokeWidth="10" strokeLinecap="round" />
    </svg>;
  }

  return <svg viewBox="0 0 80 80" className="h-full w-full" style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true">
    <rect x="8" y="12" width="28" height="28" rx="7" fill="#592bd6" />
    <rect x="44" y="12" width="28" height="28" rx="7" fill="#2160df" />
    <rect x="8" y="48" width="28" height="24" rx="7" fill="#071d67" />
    <path d="M52 49h12v7h8v12h-8v7H52v-7h-8V56h8v-7Z" fill="#12cdd4" />
    <path d="M17 26h10M22 21v10" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="m51 30 6-10 6 10" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function ProductMark({ product = "learn", inverse = false, compact = false, size = "md", className = "", ...props }: ProductMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";
  const classes = brandMarkSizeClasses[size];
  const glyphDimension = brandMarkGlyphDimensions[size];

  return <span className={`inline-flex items-center ${classes.rootGap} ${className}`} {...props}>
    <span
      className={`grid shrink-0 place-items-center ${classes.glyph}`}
      style={{ display: "grid", width: glyphDimension, height: glyphDimension, flexShrink: 0, placeItems: "center" }}
    ><ProductGlyph product={product} /></span>
    {!compact && <span className="leading-none">
      <span className={`block ${classes.wordmark} font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span>
      <span className={`mt-1 block ${classes.label} font-extrabold uppercase tracking-[.17em] ${productLabelClass[product]}`}>{productLabel[product]}</span>
    </span>}
  </span>;
}

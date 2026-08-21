import type { HTMLAttributes } from "react";

export type LurexaProduct = "learn" | "coach" | "teach" | "admin" | "insight" | "studio";

export interface ProductMarkProps extends HTMLAttributes<HTMLSpanElement> {
  product?: LurexaProduct;
  inverse?: boolean;
  compact?: boolean;
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
    return <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <path d="M12 58 28 42l10 10 17-17 9 9-26 26L12 58Z" fill="#592bd6" />
      <path d="M18 22h28a8 8 0 0 1 8 8v11l-8 8V31H18v27H8V32c0-6 4-10 10-10Z" fill="#071d67" />
      <path d="M49 13h18v18h-9V27L45 40l-7-7 13-13h-2v-7Z" fill="#12cdd4" />
      <circle cx="28" cy="42" r="4" fill="#2160df" />
    </svg>;
  }

  if (product === "coach") {
    return <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <path d="M12 18h44c7 0 12 5 12 12v18c0 7-5 12-12 12H37L23 70V60H12C5 60 0 55 0 48V30c0-7 5-12 12-12Z" fill="#592bd6" />
      <path d="M17 40h7l4-10 6 20 6-17 5 12 4-5h11" fill="none" stroke="#12cdd4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="58" cy="20" r="10" fill="#071d67" />
      <rect x="55" y="14" width="6" height="9" rx="3" fill="white" />
      <path d="M53 22c0 5 10 5 10 0M58 27v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>;
  }

  if (product === "teach") {
    return <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <path d="M15 63V27h9v36h-9Zm21 0V17h9v46h-9Zm21 0V8h9v55h-9Z" fill="#071d67" />
      <path d="M14 52 38 38l12 7 18-18" fill="none" stroke="#592bd6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="68" cy="27" r="8" fill="#12cdd4" />
      <path d="m64 27 3 3 6-7" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
  }

  if (product === "admin") {
    return <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <path d="M40 6 68 16v22c0 18-11 29-28 36C23 67 12 56 12 38V16L40 6Z" fill="#071d67" />
      <path d="M40 18 56 24v14c0 10-6 17-16 22-10-5-16-12-16-22V24l16-6Z" fill="#2160df" />
      <path d="M33 39h14M40 32v14" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <circle cx="59" cy="55" r="10" fill="#12cdd4" />
      <path d="m54 55 4 4 7-9" fill="none" stroke="#071d67" strokeWidth="3.5" strokeLinecap="round" />
    </svg>;
  }

  if (product === "insight") {
    return <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <circle cx="34" cy="34" r="23" fill="#071d67" />
      <circle cx="34" cy="34" r="16" fill="white" />
      <path d="M18 41 27 33l7 5 12-14 5 4" fill="none" stroke="#592bd6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="24" r="4" fill="#12cdd4" />
      <path d="m51 51 18 18" stroke="#2160df" strokeWidth="10" strokeLinecap="round" />
    </svg>;
  }

  return <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
    <rect x="8" y="12" width="28" height="28" rx="7" fill="#592bd6" />
    <rect x="44" y="12" width="28" height="28" rx="7" fill="#2160df" />
    <rect x="8" y="48" width="28" height="24" rx="7" fill="#071d67" />
    <path d="M52 49h12v7h8v12h-8v7H52v-7h-8V56h8v-7Z" fill="#12cdd4" />
    <path d="M17 26h10M22 21v10" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="m51 30 6-10 6 10" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function ProductMark({ product = "learn", inverse = false, compact = false, className = "", ...props }: ProductMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";

  return <span className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
    <span className="grid h-9 w-9 shrink-0 place-items-center"><ProductGlyph product={product} /></span>
    {!compact && <span className="leading-none">
      <span className={`block text-lg font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span>
      <span className={`mt-1 block text-[10px] font-extrabold uppercase tracking-[.17em] ${productLabelClass[product]}`}>{productLabel[product]}</span>
    </span>}
  </span>;
}

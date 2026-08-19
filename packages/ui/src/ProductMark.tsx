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

function ProductGlyph({ product }: { product: LurexaProduct }) {
  if (product === "learn") return <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true"><path d="M7 33 31 9l11 11L29 33 43 47 32 58 7 33Z" fill="currentColor"/><path d="m31 9 11-6v17L31 9Z" fill="#2160df"/><path d="M43 20 57 6v47H43V20Z" fill="currentColor"/></svg>;
  if (product === "coach") return <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true"><rect x="15" y="21" width="34" height="27" rx="7" fill="currentColor"/><path d="M22 17v-5m20 5v-5M9 28v10m46-10v10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><circle cx="25" cy="34" r="3" fill="white"/><circle cx="39" cy="34" r="3" fill="white"/><path d="M29 42h7" stroke="#12cdd4" strokeWidth="3" strokeLinecap="round"/></svg>;
  if (product === "teach") return <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true"><path d="M7 23h50l-9-11H16L7 23Z" fill="currentColor"/><path d="M15 25h34v7H15z" fill="currentColor"/><path d="M30 32v15" stroke="currentColor" strokeWidth="4"/><circle cx="30" cy="51" r="3" fill="#12cdd4"/></svg>;
  if (product === "admin") return <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true"><path d="m7 23 25-15 25 15H7Z" fill="currentColor"/><path d="M13 28h7v21h-7zm15 0h8v21h-8zm16 0h7v21h-7z" fill="currentColor"/><path d="M9 52h46v5H9z" fill="#12cdd4"/></svg>;
  if (product === "insight") return <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true"><rect x="8" y="37" width="10" height="17" rx="5" fill="currentColor" opacity=".6"/><rect x="27" y="23" width="10" height="31" rx="5" fill="currentColor"/><rect x="46" y="10" width="10" height="44" rx="5" fill="#16c9d1"/></svg>;
  return <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true"><path d="m20 8 22 2 13 20-13 25-24-1L7 32 20 8Z" fill="currentColor"/><path d="m21 31 9 9 17-17" fill="none" stroke="#12cdd4" strokeWidth="7" strokeLinecap="square"/></svg>;
}

export function ProductMark({ product = "learn", inverse = false, compact = false, className = "", ...props }: ProductMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";
  const label = product === "learn" ? "text-[#592bd6]" : "text-[#1d5add]";

  return <span className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
    <span className="grid h-9 w-9 shrink-0 place-items-center text-[#592bd6]"><ProductGlyph product={product} /></span>
    {!compact && <span className="leading-none"><span className={`block text-lg font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span><span className={`mt-1 block text-[10px] font-extrabold uppercase tracking-[.17em] ${label}`}>{productLabel[product]}</span></span>}
  </span>;
}
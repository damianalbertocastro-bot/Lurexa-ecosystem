import type { HTMLAttributes } from "react";
import { brandMarkSizeClasses, type BrandMarkSize } from "./brand-mark-size";

export type LurexaEcosystemLayer = "core" | "mind";

export interface EcosystemLayerMarkProps extends HTMLAttributes<HTMLSpanElement> {
  layer: LurexaEcosystemLayer;
  inverse?: boolean;
  compact?: boolean;
  size?: BrandMarkSize;
}

const labels: Record<LurexaEcosystemLayer, string> = {
  core: "Core",
  mind: "Mind",
};

function LayerGlyph({ layer }: { layer: LurexaEcosystemLayer }) {
  if (layer === "core") {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
        <path d="M40 7 66 22v36L40 73 14 58V22L40 7Z" fill="#071d67" />
        <path d="M40 19 55 28v24L40 61 25 52V28L40 19Z" fill="#2160df" />
        <circle cx="40" cy="40" r="9" fill="#12cdd4" />
        <path d="M40 7v12M14 22l11 6M66 22l-11 6M14 58l11-6M66 58l-11-6M40 73V61" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <path d="M25 14c-9 0-16 7-16 16 0 5 2 9 6 12-4 3-6 7-6 12 0 9 7 16 16 16 6 0 11-3 14-8 3 5 8 8 14 8 9 0 16-7 16-16 0-5-2-9-6-12 4-3 6-7 6-12 0-9-7-16-16-16-6 0-11 3-14 8-3-5-8-8-14-8Z" fill="#592bd6" />
      <path d="M40 20v40M24 31c8 0 10 6 10 10M56 31c-8 0-10 6-10 10M24 54c7 0 10-4 10-8M56 54c-7 0-10-4 10-8" fill="none" stroke="#12cdd4" strokeWidth="4" strokeLinecap="round" />
      <circle cx="40" cy="40" r="5" fill="white" />
    </svg>
  );
}

export function EcosystemLayerMark({ layer, inverse = false, compact = false, size = "md", className = "", ...props }: EcosystemLayerMarkProps) {
  const wordmark = inverse ? "text-white" : "text-[#071d67]";
  const label = layer === "core" ? "text-[#2160df]" : "text-[#592bd6]";
  const classes = brandMarkSizeClasses[size];

  return (
    <span className={`inline-flex items-center ${classes.rootGap} ${className}`} {...props}>
      <span className={`grid shrink-0 place-items-center ${classes.glyph}`}><LayerGlyph layer={layer} /></span>
      {!compact && (
        <span className="leading-none">
          <span className={`block ${classes.wordmark} font-extrabold tracking-[-.06em] ${wordmark}`}>Lurexa</span>
          <span className={`mt-1 block ${classes.label} font-extrabold uppercase tracking-[.17em] ${label}`}>{labels[layer]}</span>
        </span>
      )}
    </span>
  );
}

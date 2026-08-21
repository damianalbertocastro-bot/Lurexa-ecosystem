export type BrandMarkSize = "sm" | "md" | "lg";

export const brandMarkSizeClasses: Record<
  BrandMarkSize,
  { rootGap: string; glyph: string; wordmark: string; label: string }
> = {
  sm: {
    rootGap: "gap-2",
    glyph: "h-7 w-7",
    wordmark: "text-base",
    label: "text-[9px]",
  },
  md: {
    rootGap: "gap-2.5",
    glyph: "h-9 w-9",
    wordmark: "text-lg",
    label: "text-[10px]",
  },
  lg: {
    rootGap: "gap-3",
    glyph: "h-12 w-12",
    wordmark: "text-xl",
    label: "text-[11px]",
  },
};

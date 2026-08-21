export type BrandMarkSize = "sm" | "md" | "lg";

export const brandMarkSizeClasses: Record<
  BrandMarkSize,
  { rootGap: string; glyph: string; wordmark: string; label: string; glyphPixels: number }
> = {
  sm: {
    rootGap: "gap-2",
    glyph: "h-7 w-7",
    wordmark: "text-base",
    label: "text-[9px]",
    glyphPixels: 28,
  },
  md: {
    rootGap: "gap-2.5",
    glyph: "h-9 w-9",
    wordmark: "text-lg",
    label: "text-[10px]",
    glyphPixels: 36,
  },
  lg: {
    rootGap: "gap-3",
    glyph: "h-12 w-12",
    wordmark: "text-xl",
    label: "text-[11px]",
    glyphPixels: 48,
  },
};

/**
 * Brand marks are consumed by both Tailwind and CSS-module applications.
 * Keep the glyph dimensions independent of utility-class generation so a
 * product identity never disappears when an app does not load Tailwind.
 */
export const brandMarkGlyphDimensions: Record<BrandMarkSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
};
